import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import { UserData, AnnouncementData, ClassSchedule, StudentGrade } from '../types';
import { INITIAL_USERS, INITIAL_ANNOUNCEMENTS, CLASS_SCHEDULES } from '../data';

const app: Application = express();
const PORT = process.env.PORT || 5000;

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
 * Body: { firstName, lastName, matricule, className, dateOfBirth, parentPhone, password, photo? }
 */
app.post('/api/student/register', (req: Request, res: Response) => {
    try {
        const { firstName, lastName, matricule, className, dateOfBirth, parentPhone, password, photo } = req.body;

        // Validation des champs obligatoires
        if (!firstName || !lastName || !matricule || !className || !dateOfBirth || !parentPhone || !password) {
            return res.status(400).json({
                success: false,
                error: 'Données manquantes (firstName, lastName, matricule, className, dateOfBirth, parentPhone, password)'
            });
        }

        // Vérifier que le matricule n'existe pas
        if (users.find(u => u.matricule.toUpperCase() === matricule.toUpperCase())) {
            return res.status(400).json({
                success: false,
                error: 'Ce numéro matricule est déjà enregistré'
            });
        }

        // Créer le nouvel utilisateur
        const newUser: UserData = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            matricule: matricule.toUpperCase(),
            role: 'student',
            firstName,
            lastName: lastName.toUpperCase(),
            password, // En production, hasher le mot de passe
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
