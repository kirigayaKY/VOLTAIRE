import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { UserData, AnnouncementData, ClassSchedule, StudentGrade } from '../types';
import { INITIAL_USERS, INITIAL_ANNOUNCEMENTS, CLASS_SCHEDULES } from '../data';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// === Configuration Email (Nodemailer) ===
// Pour Gmail: Utiliser un mot de passe d'application (App Password)
// https://support.google.com/accounts/answer/185833
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'votre_email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'votre_mot_de_passe_app'
    }
});

// Test de connexion email
transporter.verify((error, success) => {
    if (error) {
        console.log('⚠️ Email configuration error:', error.message);
        console.log('📧 Email sending will be disabled until configured properly');
    } else {
        console.log('✅ Email service ready');
    }
});

// === Stockage des codes de vérification temporaires ===
interface ResetCode {
    matricule: string;
    code: string;
    expiresAt: number;
    role: string;
}
let resetCodes: ResetCode[] = [];

// === Stockage des codes d'inscription éphémères (Codes Voltaire) ===
interface InscriptionCode {
    code: string;
    createdAt: number;
    expiresAt: number;
    isUsed: boolean;
    usedBy?: string; // Matricule de l'élève qui l'a utilisé
}
let inscriptionCodes: InscriptionCode[] = [];

// === Fonction d'envoi d'email ===
const sendEmail = async (to: string, subject: string, htmlContent: string): Promise<boolean> => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Voltaire School <noreply@voltaire.school>',
            to: to,
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email envoyé à: ${to}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// === In-Memory Storage (En production, utiliser une vraie BD) ===
let users: UserData[] = JSON.parse(JSON.stringify(INITIAL_USERS));
let announcements: AnnouncementData[] = JSON.parse(JSON.stringify(INITIAL_ANNOUNCEMENTS));
let classSchedules: ClassSchedule[] = JSON.parse(JSON.stringify(CLASS_SCHEDULES));
let classes: any[] = [
    { id: '6A', gradeLevel: '6ème', letter: 'A', fullName: '6ème A', mainTeacher: 'M. Kouassi', studentCount: 35 },
    { id: '6B', gradeLevel: '6ème', letter: 'B', fullName: '6ème B', mainTeacher: 'Mme Traoré', studentCount: 32 },
    { id: '6C', gradeLevel: '6ème', letter: 'C', fullName: '6ème C', mainTeacher: 'M. Diallo', studentCount: 34 },
    { id: '5A', gradeLevel: '5ème', letter: 'A', fullName: '5ème A', mainTeacher: 'M. Koné', studentCount: 33 },
    { id: '5B', gradeLevel: '5ème', letter: 'B', fullName: '5ème B', mainTeacher: 'Mme Bah', studentCount: 31 },
    { id: '4A', gradeLevel: '4ème', letter: 'A', fullName: '4ème A', mainTeacher: 'M. Yao', studentCount: 36 },
    { id: '4B', gradeLevel: '4ème', letter: 'B', fullName: '4ème B', mainTeacher: 'Mme Soro', studentCount: 30 },
    { id: '3A', gradeLevel: '3ème', letter: 'A', fullName: '3ème A', mainTeacher: 'M. Soumahoro', studentCount: 35 },
    { id: '3B', gradeLevel: '3ème', letter: 'B', fullName: '3ème B', mainTeacher: 'Mme Doukoure', studentCount: 34 },
    { id: '2nde', gradeLevel: '2nde', letter: 'A', fullName: '2nde', mainTeacher: 'M. Koffi', studentCount: 40 },
    { id: '1C', gradeLevel: '1ère', letter: 'C', fullName: '1ère C', mainTeacher: 'M. Kouamé', studentCount: 28 },
    { id: '1D', gradeLevel: '1ère', letter: 'D', fullName: '1ère D', mainTeacher: 'Mme Keita', studentCount: 30 },
    { id: 'TD', gradeLevel: 'Terminale', letter: 'D', fullName: 'Terminale D', mainTeacher: 'M. N\'Goran', studentCount: 32 },
    { id: 'TE', gradeLevel: 'Terminale', letter: 'E', fullName: 'Terminale E', mainTeacher: 'Mme Gomis', studentCount: 29 }
];

// === TYPES & HELPERS ===
interface AuthRequest extends Request {
    adminId?: number;
}

// Middleware d'authentification admin
const adminAuthMiddleware = (req: AuthRequest, res: Response, next: any) => {
    const adminId = req.headers['x-admin-id'] as string;
    
    if (!adminId) {
        return res.status(401).json({
            success: false,
            error: 'Admin authentication required'
        });
    }

    const admin = users.find(u => u.id === parseInt(adminId) && u.role === 'admin');
    if (!admin) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized admin access'
        });
    }

    req.adminId = admin.id;
    next();
};

// === ENDPOINTS: CODES D'INSCRIPTION (Sécurisation des inscriptions) ===

/**
 * POST /api/admin/codes/generate
 * Génère un nouveau code d'inscription éphémère (30 minutes)
 * Accessible uniquement aux admins
 */
app.post('/api/admin/codes/generate', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        // Générer un code aléatoire (8 caractères alphanumériques)
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const now = Date.now();
        const expiresAt = now + (30 * 60 * 1000); // 30 minutes

        const newCode: InscriptionCode = {
            code,
            createdAt: now,
            expiresAt,
            isUsed: false
        };

        inscriptionCodes.push(newCode);

        console.log(`✅ Code d'inscription généré: ${code} (valide 30 min)`);

        res.json({
            success: true,
            message: 'Code d\'inscription généré avec succès',
            data: {
                code: code,
                expiresAt: expiresAt,
                expiresIn: '30 minutes'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la génération du code'
        });
    }
});

/**
 * POST /api/admin/codes/generate-batch
 * Génère plusieurs codes d'inscription à la fois
 */
app.post('/api/admin/codes/generate-batch', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1 || quantity > 50) {
            return res.status(400).json({
                success: false,
                error: 'Quantité invalide (1-50)'
            });
        }

        const generatedCodes = [];
        const now = Date.now();
        const expiresAt = now + (30 * 60 * 1000);

        for (let i = 0; i < quantity; i++) {
            const code = Math.random().toString(36).substring(2, 10).toUpperCase();
            const newCode: InscriptionCode = {
                code,
                createdAt: now,
                expiresAt,
                isUsed: false
            };
            inscriptionCodes.push(newCode);
            generatedCodes.push(code);
        }

        console.log(`✅ ${quantity} codes d'inscription générés`);

        res.json({
            success: true,
            message: `${quantity} codes générés avec succès`,
            data: {
                codes: generatedCodes,
                expiresIn: '30 minutes'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la génération des codes'
        });
    }
});

/**
 * GET /api/admin/codes
 * Retourne tous les codes d'inscription
 */
app.get('/api/admin/codes', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const now = Date.now();

        // Trier les codes : actifs en premier, puis expirés
        const codes = inscriptionCodes
            .map(c => ({
                code: c.code,
                status: c.isUsed ? 'used' : (c.expiresAt > now ? 'active' : 'expired'),
                createdAt: new Date(c.createdAt).toLocaleString('fr-FR'),
                expiresAt: new Date(c.expiresAt).toLocaleString('fr-FR'),
                isUsed: c.isUsed,
                usedBy: c.usedBy || null
            }))
            .sort((a, b) => {
                if (a.status === 'active' && b.status !== 'active') return -1;
                if (a.status !== 'active' && b.status === 'active') return 1;
                return 0;
            });

        const stats = {
            total: codes.length,
            active: codes.filter(c => c.status === 'active').length,
            used: codes.filter(c => c.status === 'used').length,
            expired: codes.filter(c => c.status === 'expired').length
        };

        res.json({
            success: true,
            stats,
            data: codes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des codes'
        });
    }
});

/**
 * DELETE /api/admin/codes/:code
 * Supprime un code d'inscription (désactive)
 */
app.delete('/api/admin/codes/:code', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const { code } = req.params;
        const index = inscriptionCodes.findIndex(c => c.code === code);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Code non trouvé'
            });
        }

        inscriptionCodes.splice(index, 1);
        console.log(`✅ Code supprimé: ${code}`);

        res.json({
            success: true,
            message: 'Code supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression du code'
        });
    }
});

// === ENDPOINTS: CLASSES ===

/**
 * GET /api/admin/classes
 * Retourne toutes les classes
 */
app.get('/api/admin/classes', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        res.json({
            success: true,
            data: classes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des classes'
        });
    }
});

/**
 * POST /api/admin/classes/create
 * Crée une nouvelle classe
 */
app.post('/api/admin/classes/create', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const { id, gradeLevel, letter, fullName, mainTeacher, studentCount } = req.body;

        if (!id || !gradeLevel || !letter || !fullName) {
            return res.status(400).json({
                success: false,
                error: 'Données manquantes'
            });
        }

        // Vérifier que la classe n'existe pas
        if (classes.find(c => c.id === id)) {
            return res.status(400).json({
                success: false,
                error: 'Cette classe existe déjà'
            });
        }

        const newClass = {
            id,
            gradeLevel,
            letter,
            fullName,
            mainTeacher,
            studentCount: studentCount || 30
        };

        classes.push(newClass);

        res.json({
            success: true,
            message: 'Classe créée avec succès',
            data: newClass
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la création de la classe'
        });
    }
});

/**
 * DELETE /api/admin/classes/:id
 * Supprime une classe
 */
app.delete('/api/admin/classes/:id', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const classId = req.params.id;
        const initialLength = classes.length;

        classes = classes.filter(c => c.id !== classId);

        if (classes.length === initialLength) {
            return res.status(404).json({
                success: false,
                error: 'Classe non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Classe supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression de la classe'
        });
    }
});

// === ENDPOINTS: GRADES (Notes) ===

/**
 * GET /api/admin/grades
 * Retourne toutes les notes de tous les élèves
 */
app.get('/api/admin/grades', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const studentGrades: StudentGrade[] = [];

        users
            .filter(u => u.role === 'student' && u.grades)
            .forEach(student => {
                student.grades!.forEach(grade => {
                    studentGrades.push({
                        studentId: student.id,
                        studentName: `${student.firstName} ${student.lastName}`,
                        subject: grade.subject,
                        date: grade.date,
                        note: grade.note,
                        max: grade.max,
                        coef: grade.coef,
                        teacher: 'Non spécifié'
                    });
                });
            });

        res.json({
            success: true,
            data: studentGrades
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des notes'
        });
    }
});

/**
 * GET /api/admin/grades/:studentId
 * Retourne les notes d'un élève spécifique
 */
app.get('/api/admin/grades/:studentId', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const student = users.find(u => u.id === parseInt(req.params.studentId) && u.role === 'student');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Élève non trouvé'
            });
        }

        const studentGrades: StudentGrade[] = (student.grades || []).map(grade => ({
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            subject: grade.subject,
            date: grade.date,
            note: grade.note,
            max: grade.max,
            coef: grade.coef,
            teacher: 'Non spécifié'
        }));

        res.json({
            success: true,
            data: {
                student: {
                    id: student.id,
                    matricule: student.matricule,
                    name: `${student.firstName} ${student.lastName}`,
                    className: student.className
                },
                grades: studentGrades
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des notes'
        });
    }
});

/**
 * POST /api/admin/grades/update
 * Ajoute ou met à jour une note pour un élève
 * Body: { studentId, subject, date, note, max, coef }
 */
app.post('/api/admin/grades/update', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const { studentId, subject, date, note, max, coef } = req.body;

        if (!studentId || !subject || note === undefined || max === undefined || coef === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Données manquantes (studentId, subject, note, max, coef)'
            });
        }

        const student = users.find(u => u.id === studentId && u.role === 'student');
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Élève non trouvé'
            });
        }

        if (!student.grades) {
            student.grades = [];
        }

        // Chercher si la note existe
        const existingGradeIndex = student.grades.findIndex(g => g.subject === subject && g.date === date);

        if (existingGradeIndex !== -1) {
            // Mise à jour
            student.grades[existingGradeIndex] = { subject, date, coef, note, max };
        } else {
            // Ajout
            student.grades.push({ subject, date, coef, note, max });
        }

        // Recalculer la moyenne
        const totalPoints = student.grades.reduce((sum, g) => sum + (g.note / g.max * 20 * g.coef), 0);
        const totalCoef = student.grades.reduce((sum, g) => sum + g.coef, 0);
        student.average = totalCoef > 0 ? Math.round((totalPoints / totalCoef) * 10) / 10 : 0;

        res.json({
            success: true,
            message: 'Note mise à jour avec succès',
            data: {
                studentId,
                subject,
                note,
                newAverage: student.average
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour de la note'
        });
    }
});

/**
 * DELETE /api/admin/grades/:studentId/:subject
 * Supprime une note spécifique
 */
app.delete('/api/admin/grades/:studentId/:subject', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const { studentId, subject } = req.params;
        const student = users.find(u => u.id === parseInt(studentId) && u.role === 'student');

        if (!student || !student.grades) {
            return res.status(404).json({
                success: false,
                error: 'Élève ou notes non trouvés'
            });
        }

        student.grades = student.grades.filter(g => g.subject !== subject);

        res.json({
            success: true,
            message: 'Note supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression de la note'
        });
    }
});

/**
 * GET /api/admin/grades/by-class/:className
 * Retourne les notes de tous les élèves d'une classe spécifique
 */
app.get('/api/admin/grades/by-class/:className', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const className = decodeURIComponent(req.params.className);
        const studentGrades: StudentGrade[] = [];

        users
            .filter(u => u.role === 'student' && u.className === className && u.grades)
            .forEach(student => {
                student.grades!.forEach(grade => {
                    studentGrades.push({
                        studentId: student.id,
                        studentName: `${student.firstName} ${student.lastName}`,
                        subject: grade.subject,
                        date: grade.date,
                        note: grade.note,
                        max: grade.max,
                        coef: grade.coef,
                        teacher: 'Non spécifié'
                    });
                });
            });

        res.json({
            success: true,
            data: studentGrades
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des notes de la classe'
        });
    }
});

/**
 * GET /api/student/grades/:matricule
 * Endpoint PUBLIC - Retourne les notes d'un élève par son matricule
 * Query: ?password=... (optionnel pour plus de sécurité)
 */
app.get('/api/student/grades/:matricule', (req: Request, res: Response) => {
    try {
        const student = users.find(u => u.matricule === req.params.matricule.toUpperCase() && u.role === 'student');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Élève non trouvé'
            });
        }

        const studentGrades: StudentGrade[] = (student.grades || []).map(grade => ({
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            subject: grade.subject,
            date: grade.date,
            note: grade.note,
            max: grade.max,
            coef: grade.coef,
            teacher: 'Non spécifié'
        }));

        res.json({
            success: true,
            data: {
                student: {
                    id: student.id,
                    matricule: student.matricule,
                    name: `${student.firstName} ${student.lastName}`,
                    className: student.className,
                    average: student.average || 0
                },
                grades: studentGrades
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des notes'
        });
    }
});

// === ENDPOINTS: SCHEDULE (Emploi du Temps) ===

/**
 * GET /api/admin/schedule
 * Retourne tous les emplois du temps par classe
 */
app.get('/api/admin/schedule', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        res.json({
            success: true,
            data: classSchedules
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des emplois du temps'
        });
    }
});

/**
 * GET /api/admin/schedule/:classId
 * Retourne l'emploi du temps d'une classe spécifique
 */
app.get('/api/admin/schedule/:classId', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const schedule = classSchedules.find(cs => cs.classId === req.params.classId);

        if (!schedule) {
            return res.status(404).json({
                success: false,
                error: 'Emploi du temps non trouvé pour cette classe'
            });
        }

        res.json({
            success: true,
            data: schedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération de l\'emploi du temps'
        });
    }
});

/**
 * POST /api/admin/schedule/update
 * Met à jour l'emploi du temps d'une classe
 * Body: { classId, schedule: [] }
 */
app.post('/api/admin/schedule/update', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const { classId, className, schedule } = req.body;

        if (!classId || !Array.isArray(schedule)) {
            return res.status(400).json({
                success: false,
                error: 'Données manquantes ou invalides'
            });
        }

        const existingScheduleIndex = classSchedules.findIndex(cs => cs.classId === classId);

        if (existingScheduleIndex !== -1) {
            classSchedules[existingScheduleIndex] = {
                classId,
                className: className || classSchedules[existingScheduleIndex].className,
                schedule
            };
        } else {
            classSchedules.push({
                classId,
                className: className || classId,
                schedule
            });
        }

        res.json({
            success: true,
            message: 'Emploi du temps mis à jour avec succès',
            data: classSchedules.find(cs => cs.classId === classId)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour de l\'emploi du temps'
        });
    }
});

// === ENDPOINTS: ANNOUNCEMENTS (Annonces) ===

/**
 * GET /api/announcements
 * Endpoint PUBLIC - Retourne toutes les annonces visibles par tous (élèves, parents, etc)
 */
app.get('/api/announcements', (req: Request, res: Response) => {
    try {
        res.json({
            success: true,
            data: announcements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des annonces'
        });
    }
});

/**
 * GET /api/admin/announcements
 * Retourne toutes les annonces (pour l'admin)
 */
app.get('/api/admin/announcements', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        res.json({
            success: true,
            data: announcements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des annonces'
        });
    }
});

/**
 * POST /api/admin/announcements/create
 * Crée une nouvelle annonce (visible par tous)
 * Body: { title, content, type }
 */
app.post('/api/admin/announcements/create', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const { title, content, type } = req.body;
        const adminUser = users.find(u => u.id === req.adminId);

        if (!title || !content || !type) {
            return res.status(400).json({
                success: false,
                error: 'Données manquantes (title, content, type)'
            });
        }

        const newAnnouncement: AnnouncementData = {
            id: Math.max(...announcements.map(a => a.id), 0) + 1,
            title,
            content,
            date: new Date().toLocaleDateString('fr-FR'),
            type: type as any,
            author: adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Admin'
        };

        announcements.push(newAnnouncement);

        res.json({
            success: true,
            message: 'Annonce créée et publiée pour tous',
            data: newAnnouncement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la création de l\'annonce'
        });
    }
});

/**
 * PUT /api/admin/announcements/:id
 * Met à jour une annonce existante
 */
app.put('/api/admin/announcements/:id', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const announcementId = parseInt(req.params.id);
        const { title, content, type } = req.body;

        const announcement = announcements.find(a => a.id === announcementId);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                error: 'Annonce non trouvée'
            });
        }

        if (title) announcement.title = title;
        if (content) announcement.content = content;
        if (type) announcement.type = type;

        res.json({
            success: true,
            message: 'Annonce mise à jour',
            data: announcement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour de l\'annonce'
        });
    }
});

/**
 * DELETE /api/admin/announcements/:id
 * Supprime une annonce
 */
app.delete('/api/admin/announcements/:id', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const announcementId = parseInt(req.params.id);
        const initialLength = announcements.length;

        announcements = announcements.filter(a => a.id !== announcementId);

        if (announcements.length === initialLength) {
            return res.status(404).json({
                success: false,
                error: 'Annonce non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Annonce supprimée'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression de l\'annonce'
        });
    }
});

// === ENDPOINTS: AUTHENTICATION & REGISTRATION ===

/**
 * POST /api/student/register
 * Endpoint PUBLIC - Inscription d'un nouvel élève
 * Body: { firstName, lastName, matricule, className, dateOfBirth, parentPhone, email, password, inscriptionCode, photo? }
 * 
 * SÉCURITÉ: Requires valid inscription code (ephemeral token)
 * Ajoute automatiquement la classe si elle n'existe pas dans:
 * - Gestion des classes
 * - Emploi du temps
 */
app.post('/api/student/register', (req: Request, res: Response) => {
    try {
        const { firstName, lastName, matricule, className, dateOfBirth, parentPhone, email, password, inscriptionCode, photo } = req.body;

        // Validation des champs obligatoires
        if (!firstName || !lastName || !matricule || !className || !dateOfBirth || !parentPhone || !email || !password || !inscriptionCode) {
            return res.status(400).json({
                success: false,
                error: 'Données manquantes (incluant inscriptionCode)'
            });
        }

        // 🔐 VALIDATION DU CODE D'INSCRIPTION (Sécurité)
        const now = Date.now();
        const codeRecord = inscriptionCodes.find(c => c.code === inscriptionCode);

        if (!codeRecord) {
            return res.status(403).json({
                success: false,
                error: 'Code d\'inscription invalide'
            });
        }

        if (codeRecord.isUsed) {
            return res.status(403).json({
                success: false,
                error: 'Ce code a déjà été utilisé'
            });
        }

        if (codeRecord.expiresAt < now) {
            return res.status(403).json({
                success: false,
                error: 'Ce code d\'inscription a expiré (valide 30 minutes)'
            });
        }

        // Valider le format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Adresse email invalide'
            });
        }

        // Vérifier que le matricule n'existe pas
        if (users.find(u => u.matricule.toUpperCase() === matricule.toUpperCase())) {
            return res.status(400).json({
                success: false,
                error: 'Ce numéro matricule est déjà enregistré'
            });
        }

        // Vérifier que l'email n'existe pas
        if (users.find(u => u.email?.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: 'Cet email est déjà enregistré'
            });
        }

        // 🆕 Vérifier et ajouter automatiquement la classe si elle n'existe pas
        if (!classes.find(c => c.id === className)) {
            // Extraire le niveau et la lettre de la classe (ex: "6ème A" -> "6ème", "A")
            const classNameParts = className.trim().split(' ');
            const gradeLevel = classNameParts[0] || className;
            const letter = classNameParts[1] || '';
            
            const newClass = {
                id: className,
                gradeLevel: gradeLevel,
                letter: letter,
                fullName: className,
                mainTeacher: 'À assigner',
                studentCount: 0
            };
            
            classes.push(newClass);
            console.log(`✅ Classe automatiquement créée: ${className}`);

            // 🆕 Ajouter un emploi du temps par défaut pour cette classe
            const defaultSchedule: ClassSchedule = {
                classId: className,
                className: className,
                schedule: [
                    { day: 'Lundi', time: '08:00-09:30', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' },
                    { day: 'Lundi', time: '09:45-11:15', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' },
                    { day: 'Mardi', time: '08:00-09:30', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' },
                    { day: 'Mardi', time: '09:45-11:15', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' },
                    { day: 'Mercredi', time: '08:00-09:30', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' },
                    { day: 'Mercredi', time: '09:45-11:15', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' },
                    { day: 'Jeudi', time: '08:00-09:30', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' },
                    { day: 'Jeudi', time: '09:45-11:15', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' },
                    { day: 'Vendredi', time: '08:00-09:30', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' },
                    { day: 'Vendredi', time: '09:45-11:15', subject: 'À planifier', teacher: 'À assigner', room: 'À assigner' }
                ]
            };
            
            classSchedules.push(defaultSchedule);
            console.log(`✅ Emploi du temps automatiquement créé pour: ${className}`);
        }

        // Créer le nouvel utilisateur
        const newUser: UserData = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            matricule: matricule.toUpperCase(),
            role: 'student',
            firstName,
            lastName: lastName.toUpperCase(),
            password, // En production, hasher le mot de passe
            email: email.toLowerCase(),
            className,
            status: 'active',
            dateOfBirth,
            parentPhone,
            photo: photo || undefined,
            average: 0,
            absences: 0,
            delays: 0,
            rank: 0,
            grades: []
        };

        users.push(newUser);

        // 🔐 Marquer le code comme utilisé (sécurité)
        codeRecord.isUsed = true;
        codeRecord.usedBy = matricule;
        console.log(`✅ Code d'inscription utilisé par: ${matricule}`);

        res.json({
            success: true,
            message: 'Inscription réussie. Vous pouvez maintenant vous connecter.',
            data: {
                id: newUser.id,
                matricule: newUser.matricule,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                className: newUser.className
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'inscription'
        });
    }
});

/**
 * POST /api/auth/request-reset
 * Génère et envoie un code de réinitialisation par email
 * Body: { matricule, email, role }
 */
app.post('/api/auth/request-reset', async (req: Request, res: Response) => {
    try {
        const { matricule, email, role } = req.body;

        if (!matricule || !email || !role) {
            return res.status(400).json({
                success: false,
                error: 'Matricule, email et rôle requis'
            });
        }

        // Vérifier que l'utilisateur existe
        const user = users.find(u => 
            u.matricule.toUpperCase() === matricule.toUpperCase() && 
            u.role === role &&
            u.email?.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
            // Ne pas révéler si l'utilisateur existe (sécurité)
            return res.status(400).json({
                success: false,
                error: 'Matricule, email ou rôle incorrect'
            });
        }

        // Générer un code aléatoire de 6 chiffres
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Valide 5 minutes

        // Supprimer les anciens codes
        resetCodes = resetCodes.filter(rc => rc.matricule !== matricule);

        // Ajouter le nouveau code
        resetCodes.push({
            matricule,
            code,
            expiresAt,
            role
        });

        // Envoyer l'email avec le code
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #17a34a;">Réinitialisation de mot de passe</h2>
                <p>Bonjour ${user.firstName} ${user.lastName},</p>
                <p>Vous avez demandé la réinitialisation de votre mot de passe pour le Groupe Scolaire Voltaire.</p>
                <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #666;">Votre code de vérification:</p>
                    <h1 style="margin: 10px 0; color: #17a34a; letter-spacing: 5px;">${code}</h1>
                    <p style="margin: 0; font-size: 12px; color: #999;">Valide pendant 5 minutes</p>
                </div>
                <p style="color: #666; font-size: 12px;">
                    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #999; font-size: 11px; text-align: center;">
                    © 2025 Groupe Scolaire Voltaire Marcory
                </p>
            </div>
        `;

        const emailSent = await sendEmail(
            user.email || email,
            '🔐 Code de réinitialisation de mot de passe - Voltaire',
            emailHtml
        );

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                error: 'Erreur lors de l\'envoi du code par email'
            });
        }

        res.json({
            success: true,
            message: 'Code envoyé par email. Vérifiez votre boîte mail (y compris spam).',
            data: {
                matricule: matricule,
                codeSent: true
            }
        });
    } catch (error) {
        console.error('Erreur reset-request:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la demande de réinitialisation'
        });
    }
});

/**
 * POST /api/auth/verify-reset
 * Vérifie le code et change le mot de passe
 * Body: { matricule, code, newPassword, role }
 */
app.post('/api/auth/verify-reset', (req: Request, res: Response) => {
    try {
        const { matricule, code, newPassword, role } = req.body;

        if (!matricule || !code || !newPassword || !role) {
            return res.status(400).json({
                success: false,
                error: 'Données manquantes'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Le mot de passe doit avoir au moins 6 caractères'
            });
        }

        // Vérifier le code
        const resetCode = resetCodes.find(rc => 
            rc.matricule === matricule && 
            rc.code === code &&
            rc.role === role
        );

        if (!resetCode) {
            return res.status(400).json({
                success: false,
                error: 'Code de vérification incorrect'
            });
        }

        // Vérifier l'expiration
        if (resetCode.expiresAt < Date.now()) {
            resetCodes = resetCodes.filter(rc => rc !== resetCode);
            return res.status(400).json({
                success: false,
                error: 'Code expiré. Demandez un nouveau code.'
            });
        }

        // Trouver et mettre à jour l'utilisateur
        const user = users.find(u => u.matricule === matricule && u.role === role);
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Utilisateur non trouvé'
            });
        }

        // Changer le mot de passe
        user.password = newPassword;

        // Supprimer le code utilisé
        resetCodes = resetCodes.filter(rc => rc !== resetCode);

        // Envoyer un email de confirmation
        const confirmationHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #17a34a;">✅ Mot de passe réinitialisé</h2>
                <p>Bonjour ${user.firstName} ${user.lastName},</p>
                <p>Votre mot de passe a été réinitialisé avec succès.</p>
                <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
                <p style="margin-top: 30px; color: #999; font-size: 12px;">
                    Si vous n'avez pas changé votre mot de passe, veuillez contacter l'administration.
                </p>
            </div>
        `;

        sendEmail(
            user.email || '',
            '✅ Mot de passe réinitialisé - Voltaire',
            confirmationHtml
        );

        res.json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.',
            data: {
                matricule: matricule,
                role: role
            }
        });
    } catch (error) {
        console.error('Erreur verify-reset:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la vérification'
        });
    }
});

// === ENDPOINTS: STUDENTS ===

/**
 * GET /api/public/users
 * Retourne tous les utilisateurs (PUBLIC - pour synchronisation frontend)
 */
app.get('/api/public/users', (req: Request, res: Response) => {
    try {
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des utilisateurs'
        });
    }
});

/**
 * GET /api/admin/students
 * Retourne tous les élèves
 */
app.get('/api/admin/students', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const students = users
            .filter(u => u.role === 'student')
            .map(s => ({
                id: s.id,
                matricule: s.matricule,
                name: `${s.firstName} ${s.lastName}`,
                className: s.className,
                average: s.average || 0,
                absences: s.absences || 0,
                status: s.status
            }));

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des élèves'
        });
    }
});

/**
 * GET /api/admin/students/class/:className
 * Retourne les élèves d'une classe spécifique
 */
app.get('/api/admin/students/class/:className', adminAuthMiddleware, (req: AuthRequest, res: Response) => {
    try {
        const students = users
            .filter(u => u.role === 'student' && u.className === req.params.className)
            .map(s => ({
                id: s.id,
                matricule: s.matricule,
                name: `${s.firstName} ${s.lastName}`,
                className: s.className,
                average: s.average || 0,
                absences: s.absences || 0,
                status: s.status
            }));

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des élèves'
        });
    }
});

// === HEALTH CHECK ===
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'API OK', timestamp: new Date() });
});

// === ERROR HANDLING ===
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// === START SERVER ===
app.listen(PORT, () => {
    console.log(`✅ Backend API running on http://localhost:${PORT}`);
    console.log(`📊 Admin Dashboard at http://localhost:3000/admin`);
});

export default app;
