import { UserData, ScheduleItem, AnnouncementData, ClubData, PhotoData, ProgramData, ClassInfo, ClassSchedule } from './types';

export const INITIAL_USERS: UserData[] = [
    {
        id: 1,
        matricule: "23-VM-0012",
        role: "student",
        firstName: "Jean-Marc",
        lastName: "KOUAMÉ",
        password: "voltaire2024",
        status: "active",
        className: "Terminale D",
        average: 14.5,
        absences: 2,
        delays: 3,
        rank: 4,
        dateOfBirth: "2006-05-15",
        parentPhone: "+225 07 07 45 79 82",
        photo: undefined,
        grades: [
            { subject: 'Mathématiques', date: '12 Mar', coef: 4, note: 16, max: 20 },
            { subject: 'Physique-Chimie', date: '10 Mar', coef: 3, note: 12, max: 20 },
            { subject: 'SVT', date: '05 Mar', coef: 2, note: 15, max: 20 },
            { subject: 'Français', date: '08 Mar', coef: 3, note: 14, max: 20 },
            { subject: 'Philosophie', date: '28 Fév', coef: 3, note: 11, max: 20 },
            { subject: 'Histoire-Géographie', date: '03 Mar', coef: 2, note: 13, max: 20 },
            { subject: 'Anglais (LV1)', date: '01 Mar', coef: 2, note: 17, max: 20 },
            { subject: 'Espagnol (LV2)', date: '25 Fév', coef: 2, note: 14, max: 20 },
            { subject: 'Allemand (LV2)', date: '24 Fév', coef: 2, note: 13, max: 20 },
            { subject: 'ECM', date: '20 Fév', coef: 1, note: 16, max: 20 },
            { subject: 'EPS', date: '26 Fév', coef: 1, note: 18, max: 20 },
            { subject: 'Éducation Artistique', date: '15 Fév', coef: 1, note: 15, max: 20 }
        ]
    },
    {
        id: 2,
        matricule: "23-VM-0088",
        role: "student",
        firstName: "Aïcha",
        lastName: "KONÉ",
        password: "ivestp2024",
        status: "active",
        className: "1ère C",
        average: 16.2,
        absences: 0,
        delays: 1,
        rank: 1,
        dateOfBirth: "2007-08-22",
        parentPhone: "+225 05 05 12 34 56",
        grades: [
            { subject: 'Mathématiques', date: '12 Mar', coef: 4, note: 18, max: 20 },
            { subject: 'Physique-Chimie', date: '01 Mar', coef: 3, note: 14, max: 20 },
            { subject: 'SVT', date: '03 Mar', coef: 2, note: 15, max: 20 },
            { subject: 'Français', date: '10 Mar', coef: 3, note: 17, max: 20 },
            { subject: 'Anglais', date: '08 Mar', coef: 2, note: 19, max: 20 },
            { subject: 'Histoire-Géographie', date: '05 Mar', coef: 2, note: 16, max: 20 },
            { subject: 'EPS', date: '28 Fév', coef: 1, note: 16, max: 20 }
        ]
    },
    {
        id: 3,
        matricule: "23-VM-0045",
        role: "student",
        firstName: "Stéphane",
        lastName: "DIALLO",
        password: "marcory2024",
        status: "active",
        className: "6ème B",
        average: 12.8,
        absences: 5,
        delays: 4,
        rank: 7,
        dateOfBirth: "2012-02-10",
        parentPhone: "+225 01 02 03 04 05",
        grades: [
            { subject: 'Mathématiques', date: '12 Mar', coef: 4, note: 14, max: 20 },
            { subject: 'Français', date: '10 Mar', coef: 3, note: 13, max: 20 },
            { subject: 'Anglais', date: '08 Mar', coef: 2, note: 11, max: 20 },
            { subject: 'SVT', date: '05 Mar', coef: 2, note: 12, max: 20 },
            { subject: 'EPS', date: '03 Mar', coef: 1, note: 16, max: 20 }
        ]
    },
    {
        id: 4,
        matricule: "23-VM-0067",
        role: "student",
        firstName: "Marie",
        lastName: "TRAORÉ",
        password: "college2024",
        status: "active",
        className: "4ème A",
        average: 13.5,
        absences: 3,
        delays: 2,
        rank: 5,
        dateOfBirth: "2010-11-05",
        parentPhone: "+225 07 88 99 66 33",
        grades: [
            { subject: 'Mathématiques', date: '12 Mar', coef: 4, note: 15, max: 20 },
            { subject: 'Français', date: '10 Mar', coef: 3, note: 13, max: 20 },
            { subject: 'Physique-Chimie', date: '08 Mar', coef: 3, note: 12, max: 20 },
            { subject: 'Anglais', date: '05 Mar', coef: 2, note: 14, max: 20 },
            { subject: 'Histoire-Géographie', date: '03 Mar', coef: 2, note: 13, max: 20 }
        ]
    },
    {
        id: 99,
        matricule: "admin",
        role: "admin",
        firstName: "Super",
        lastName: "Admin",
        password: "08546517",
        status: "active"
    }
];

export const INITIAL_NEWS = [
    "📢 Inscriptions ouvertes pour l'année scolaire 2024-2025",
    "🏆 L'équipe de basket remporte le tournoi régional !",
    "📅 Réunion parents-professeurs le 15 Mars",
    "🎓 Journée portes ouvertes IVESTP le 20 Avril"
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
    { day: 'Lundi', time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. Kouassi', room: 'Salle 101' },
    { day: 'Lundi', time: '09:00-10:00', subject: 'Français', teacher: 'Mme Traoré', room: 'Salle 102' },
    { day: 'Lundi', time: '10:15-11:15', subject: 'Anglais', teacher: 'M. Diallo', room: 'Salle 103' },
    { day: 'Lundi', time: '11:15-12:15', subject: 'Histoire-Géographie', teacher: 'M. Koné', room: 'Salle 104' },
    { day: 'Lundi', time: '14:00-15:00', subject: 'Philosophie', teacher: 'M. Yao', room: 'Salle 106' },
    
    { day: 'Mardi', time: '08:00-09:00', subject: 'SVT', teacher: 'Mme Kouamé', room: 'Labo 201', notification: 'Changé en salle 7' },
    { day: 'Mardi', time: '09:00-10:00', subject: 'Physique-Chimie', teacher: 'M. Bah', room: 'Labo 202' },
    { day: 'Mardi', time: '10:15-11:15', subject: 'Anglais', teacher: 'M. Diallo', room: 'Salle 103' },
    { day: 'Mardi', time: '11:15-12:15', subject: 'Espagnol / Allemand', teacher: 'Mme Soro', room: 'Salle 108' },
    
    { day: 'Mercredi', time: '08:00-10:00', subject: 'EPS', teacher: 'M. Koffi', room: 'Gymnase' },
    { day: 'Mercredi', time: '10:15-12:15', subject: 'Mathématiques', teacher: 'M. Kouassi', room: 'Salle 101' },
    
    { day: 'Jeudi', time: '08:00-09:00', subject: 'Français', teacher: 'Mme Traoré', room: 'Salle 102' },
    { day: 'Jeudi', time: '09:00-10:00', subject: 'ECM', teacher: 'M. Soumahoro', room: 'Salle 105' },
    { day: 'Jeudi', time: '10:15-12:15', subject: 'Physique-Chimie', teacher: 'M. Bah', room: 'Labo 202' },
    
    { day: 'Vendredi', time: '08:00-10:00', subject: 'Éducation Artistique', teacher: 'Mme Doukoure', room: 'Atelier Art' },
    { day: 'Vendredi', time: '10:15-11:15', subject: 'Histoire-Géographie', teacher: 'M. Koné', room: 'Salle 104' },
    { day: 'Vendredi', time: '15:00-17:00', subject: 'Vie Scolaire / Clubs', teacher: 'Divers', room: 'Cour' }
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementData[] = [
    { id: 1, title: '🚨 Examen Blanc - Mathématiques', content: 'L\'examen blanc de mathématiques aura lieu le 20 Mars. Durée : 3 heures. Salle d\'examen : Amphithéâtre.', date: '03 Mar', type: 'exam', author: 'Direction' },
    { id: 2, title: '📅 Congés de Printemps', content: 'Les congés de printemps débutent le 15 Avril et se terminent le 30 Avril. Bon repos !', date: '02 Mar', type: 'info', author: 'Direction' },
    { id: 3, title: '🏆 Tournoi de Football', content: 'Venez assister au grand tournoi inter-classes le 12 Mars à 15h au stade de Marcory. Tous les élèves sont invités à participer ou à soutenir leur classe !', date: '01 Mar', type: 'event', author: 'Club Football' },
    { id: 4, title: '⚠️ Travaux de Maintenance', content: 'Les travaux de maintenance du système informatique auront lieu le 28 Février de 18h à 22h. La plateforme sera inaccessible pendant cette période.', date: '25 Fév', type: 'urgent', author: 'IT' },
    { id: 5, title: '📚 Réunion Parents-Professeurs', content: 'La réunion parents-professeurs aura lieu le 15 Mars de 14h à 17h. Inscriptions obligatoires via la plateforme.', date: '24 Fév', type: 'important', author: 'Direction' }
];

export const INITIAL_CLUBS: ClubData[] = [
    { id: 1, name: 'Basketball', emoji: '🏀', description: 'Rejoins notre équipe de basketball et participe aux tournois régionaux ! Entraînements intenses et ambiance conviviale.', coach: 'M. Koffi', schedule: 'Mardi & Jeudi 16:00-17:30', photo: 'https://images.unsplash.com/photo-1546519638-68711109d298?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', members: 24 },
    { id: 2, name: 'Football', emoji: '⚽', description: 'L\'équipe officielle du collège. Préparation aux matchs inter-écoles et développement des talents.', coach: 'M. Touré', schedule: 'Lundi & Mercredi 15:30-17:00', photo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', members: 32 },
    { id: 3, name: 'Arts Plastiques', emoji: '🎨', description: 'Expression créative et découverte des techniques artistiques. Expositions régulières de nos créations.', coach: 'Mme Doukoure', schedule: 'Mercredi 15:30-16:30', photo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', members: 18 },
    { id: 4, name: 'Club Science', emoji: '🧪', description: 'Expériences, projets scientifiques et participation aux concours. Découvrez la science en s\'amusant !', coach: 'M. Bah', schedule: 'Jeudi 15:00-16:30', photo: 'https://images.unsplash.com/photo-1564871711033-cda380052da2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', members: 22 },
    { id: 5, name: 'Robotique', emoji: '🤖', description: 'Programmation et construction de robots. Compétitions nationales et développement des skills en tech.', coach: 'M. Soumahoro', schedule: 'Vendredi 14:00-16:00', photo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', members: 15 },
    { id: 6, name: 'Débat & Oratoire', emoji: '🎤', description: 'Améliore ton éloquence et participe à des débats passionnants. Prépare-toi pour les concours régionaux.', coach: 'Mme Traoré', schedule: 'Mardi 15:30-17:00', photo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', members: 20 }
];

export const INITIAL_PHOTOS: PhotoData[] = [
    {
        id: 1,
        src: "/photo1.png",
        category: "Vie Scolaire",
        title: "Nos Élèves",
        desc: "Élégance et discipline : nos élèves en tenue de cérémonie."
    },
    {
        id: 2,
        src: "/photo2.png", 
        category: "Campus",
        title: "Campus Voltaire",
        desc: "Le savoir est la seule richesse qui s'accroît quand on la partage."
    },
    {
        id: 3,
        src: "/photo3.png",
        category: "Infrastructures",
        title: "Installations Modernes",
        desc: "Nos installations sportives et académiques de pointe."
    },
    {
        id: 4,
        src: "/photo4.png",
        category: "Vie Scolaire",
        title: "Événements",
        desc: "Les moments forts de la vie scolaire à Voltaire."
    },
    {
        id: 5,
        src: "/photo5.png",
        category: "Enseignement Supérieur",
        title: "Campus IVESTP",
        desc: "L'Institut Voltaire d'Enseignement Supérieur Technique et Professionnel."
    },
    {
        id: 6,
        src: "/photo6.png",
        category: "Infrastructures",
        title: "Environnement",
        desc: "Un cadre d'études serein et inspirant au cœur de Marcory."
    }
];

export const IVESTP_PROGRAMS: ProgramData[] = [
    {
        id: 'ges-com',
        title: 'Gestion Commerciale',
        shortDesc: 'Formation aux techniques de vente, négociation et marketing.',
        fullDesc: 'Le BTS Gestion Commerciale forme des spécialistes capables de gérer la relation client, de la prospection à la fidélisation. Ils participent à la définition de la politique commerciale et assurent la vente des produits et services.',
        subjects: ['Techniques de vente', 'Marketing opérationnel', 'Droit commercial', 'Gestion de la relation client', 'Statistiques commerciales'],
        careers: ['Attaché commercial', 'Chef de rayon', 'Responsable des ventes', 'Chargé de clientèle', 'Promoteur des ventes'],
        duration: '2 ans (BTS)'
    },
    {
        id: 'rh',
        title: 'Ressources Humaines',
        shortDesc: 'Gestion administrative et développement du capital humain.',
        fullDesc: 'Cette filière prépare à la gestion du personnel au sein des organisations : administration de la paie, recrutement, formation, et gestion des carrières. Un rôle clé au cœur de l\'entreprise.',
        subjects: ['Droit du travail & Social', 'Gestion de la paie', 'Psychologie du travail', 'Communication interne', 'GPEC'],
        careers: ['Assistant RH', 'Gestionnaire de paie', 'Chargé de recrutement', 'Collaborateur social', 'Assistant de direction'],
        duration: '2 ans (BTS) / 3 ans (Licence Pro)'
    },
    {
        id: 'info',
        title: 'Informatique & Dév',
        shortDesc: 'Développement d\'applications Web/Mobile et réseaux.',
        fullDesc: 'Formation technique intensive axée sur le développement logiciel (Fullstack), la conception de bases de données et l\'administration des systèmes et réseaux informatiques.',
        subjects: ['Algorithmique & Python', 'Développement Web (React, Node)', 'Bases de données (SQL)', 'Réseaux & Sécurité', 'Maintenance'],
        careers: ['Développeur Fullstack', 'Administrateur Réseau', 'Technicien Support', 'Webmaster', 'DevOps Junior'],
        duration: '2 ans (BTS) / 3 ans (Licence Pro)'
    },
    {
        id: 'finances',
        title: 'Finance Comptabilité',
        shortDesc: 'Maîtrise des flux financiers et des obligations fiscales.',
        fullDesc: 'Les étudiants apprennent à traduire en écritures comptables toutes les opérations commerciales et financières de l\'entreprise, à établir les états financiers et à analyser la rentabilité.',
        subjects: ['Comptabilité générale', 'Fiscalité des entreprises', 'Contrôle de gestion', 'Analyse financière', 'Mathématiques financières'],
        careers: ['Comptable', 'Assistant Contrôleur de gestion', 'Auditeur junior', 'Trésorier', 'Assistant Administratif et Financier'],
        duration: '2 ans (BTS)'
    },
    {
        id: 'logistique',
        title: 'Logistique',
        shortDesc: 'Optimisation de la chaîne logistique et du transport.',
        fullDesc: 'Formation dédiée à l\'organisation et à la gestion des flux de marchandises, depuis l\'approvisionnement matières premières jusqu\'à la distribution finale aux clients.',
        subjects: ['Supply Chain Management', 'Transport international', 'Gestion des stocks', 'Douane & Transit', 'Achats'],
        careers: ['Responsable logistique', 'Agent de transit', 'Gestionnaire de stocks', 'Responsable d\'entrepôt', 'Déclarant en douane'],
        duration: '2 ans (BTS)'
    },
    {
        id: 'com',
        title: 'Communication',
        shortDesc: 'Stratégies de communication, publicité et relations publiques.',
        fullDesc: 'Ce programme forme des professionnels de l\'image capables de concevoir et mettre en œuvre des actions de communication interne ou externe pour valoriser l\'image de l\'entreprise.',
        subjects: ['Stratégie de communication', 'PAO / Design graphique', 'Relations presse', 'Community Management', 'Événementiel'],
        careers: ['Chargé de communication', 'Community Manager', 'Attaché de presse', 'Média planneur', 'Responsable relations publiques'],
        duration: '2 ans (BTS)'
    }
];

// --- CLASSES ---
export const CLASSES: ClassInfo[] = [
    // 6ème
    { id: '6A', gradeLevel: '6ème', letter: 'A', fullName: '6ème A', mainTeacher: 'M. Kouassi', studentCount: 35 },
    { id: '6B', gradeLevel: '6ème', letter: 'B', fullName: '6ème B', mainTeacher: 'Mme Traoré', studentCount: 32 },
    { id: '6C', gradeLevel: '6ème', letter: 'C', fullName: '6ème C', mainTeacher: 'M. Diallo', studentCount: 34 },
    
    // 5ème
    { id: '5A', gradeLevel: '5ème', letter: 'A', fullName: '5ème A', mainTeacher: 'M. Koné', studentCount: 33 },
    { id: '5B', gradeLevel: '5ème', letter: 'B', fullName: '5ème B', mainTeacher: 'Mme Bah', studentCount: 31 },
    
    // 4ème
    { id: '4A', gradeLevel: '4ème', letter: 'A', fullName: '4ème A', mainTeacher: 'M. Yao', studentCount: 36 },
    { id: '4B', gradeLevel: '4ème', letter: 'B', fullName: '4ème B', mainTeacher: 'Mme Soro', studentCount: 30 },
    
    // 3ème
    { id: '3A', gradeLevel: '3ème', letter: 'A', fullName: '3ème A', mainTeacher: 'M. Soumahoro', studentCount: 35 },
    { id: '3B', gradeLevel: '3ème', letter: 'B', fullName: '3ème B', mainTeacher: 'Mme Doukoure', studentCount: 34 },
    
    // 2nde
    { id: '2nde', gradeLevel: '2nde', letter: 'A', fullName: '2nde', mainTeacher: 'M. Koffi', studentCount: 40 },
    
    // 1ère
    { id: '1C', gradeLevel: '1ère', letter: 'C', fullName: '1ère C', mainTeacher: 'M. Kouamé', studentCount: 28 },
    { id: '1D', gradeLevel: '1ère', letter: 'D', fullName: '1ère D', mainTeacher: 'Mme Keita', studentCount: 30 },
    
    // Terminale
    { id: 'TD', gradeLevel: 'Terminale', letter: 'D', fullName: 'Terminale D', mainTeacher: 'M. N\'Goran', studentCount: 32 },
    { id: 'TE', gradeLevel: 'Terminale', letter: 'E', fullName: 'Terminale E', mainTeacher: 'Mme Gomis', studentCount: 29 }
];

// --- EMPLOI DU TEMPS PAR CLASSE ---
export const CLASS_SCHEDULES: ClassSchedule[] = [
    {
        classId: '6A',
        className: '6ème A',
        schedule: [
            { day: 'Lundi', time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. Kouassi', room: 'Salle 101' },
            { day: 'Lundi', time: '09:00-10:00', subject: 'Français', teacher: 'Mme Traoré', room: 'Salle 102' },
            { day: 'Lundi', time: '10:15-11:15', subject: 'Anglais', teacher: 'M. Diallo', room: 'Salle 103' },
            { day: 'Mardi', time: '08:00-09:00', subject: 'SVT', teacher: 'Mme Kouamé', room: 'Labo 201' },
            { day: 'Mardi', time: '09:00-10:00', subject: 'Physique-Chimie', teacher: 'M. Bah', room: 'Labo 202' },
            { day: 'Mercredi', time: '08:00-10:00', subject: 'EPS', teacher: 'M. Koffi', room: 'Gymnase' },
            { day: 'Jeudi', time: '08:00-09:00', subject: 'Français', teacher: 'Mme Traoré', room: 'Salle 102' },
            { day: 'Vendredi', time: '08:00-10:00', subject: 'Éducation Artistique', teacher: 'Mme Doukoure', room: 'Atelier Art' }
        ]
    },
    {
        classId: '4A',
        className: '4ème A',
        schedule: [
            { day: 'Lundi', time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. Kouassi', room: 'Salle 101' },
            { day: 'Lundi', time: '09:00-10:00', subject: 'Français', teacher: 'Mme Traoré', room: 'Salle 102' },
            { day: 'Lundi', time: '10:15-11:15', subject: 'Anglais', teacher: 'M. Diallo', room: 'Salle 103' },
            { day: 'Lundi', time: '11:15-12:15', subject: 'Histoire-Géographie', teacher: 'M. Koné', room: 'Salle 104' },
            { day: 'Mardi', time: '08:00-09:00', subject: 'Physique-Chimie', teacher: 'M. Bah', room: 'Labo 202' },
            { day: 'Mercredi', time: '08:00-10:00', subject: 'EPS', teacher: 'M. Koffi', room: 'Gymnase' },
            { day: 'Jeudi', time: '08:00-09:00', subject: 'Français', teacher: 'Mme Traoré', room: 'Salle 102' }
        ]
    },
    {
        classId: '4B',
        className: '4ème B',
        schedule: [
            { day: 'Lundi', time: '08:00-09:00', subject: 'Français', teacher: 'Mme Soro', room: 'Salle 105' },
            { day: 'Lundi', time: '09:00-10:00', subject: 'Mathématiques', teacher: 'M. Yao', room: 'Salle 106' },
            { day: 'Mardi', time: '08:00-09:00', subject: 'Anglais', teacher: 'M. Diallo', room: 'Salle 103' },
            { day: 'Mercredi', time: '08:00-10:00', subject: 'EPS', teacher: 'M. Koffi', room: 'Gymnase' },
            { day: 'Jeudi', time: '08:00-10:00', subject: 'SVT', teacher: 'Mme Kouamé', room: 'Labo 201' }
        ]
    },
    {
        classId: 'Terminale D',
        className: 'Terminale D',
        schedule: [
            { day: 'Lundi', time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. N\'Goran', room: 'Salle 201' },
            { day: 'Lundi', time: '09:00-10:00', subject: 'Français', teacher: 'M. Kouamé', room: 'Salle 202' },
            { day: 'Lundi', time: '10:15-11:15', subject: 'Philosophie', teacher: 'Mme Gomis', room: 'Salle 203' },
            { day: 'Mardi', time: '08:00-09:00', subject: 'Physique-Chimie', teacher: 'M. Yao', room: 'Labo 301' },
            { day: 'Mercredi', time: '08:00-10:00', subject: 'SVT', teacher: 'Mme Traoré', room: 'Labo 302' }
        ]
    }
];
