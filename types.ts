
export type Section = 'home' | 'login-student' | 'login-admin' | 'register-student' | 'student-dash' | 'admin-dash' | 'admin-grades' | 'admin-schedule' | 'admin-announcements' | 'ivestp' | 'treichville' | 'history' | 'contact' | 'gallery';

export interface GradeData {
    subject: string;
    date: string;
    coef: number;
    note: number;
    max: number;
}

export interface UserData {
    id: number;
    matricule: string;
    role: 'student' | 'parent' | 'admin';
    firstName: string;
    lastName: string;
    password: string;
    email?: string;
    status?: 'active' | 'blocked';
    className?: string;
    childMatricule?: string;
    average?: number;
    absences?: number;
    delays?: number;
    rank?: number;
    notifications?: string[];
    grades?: GradeData[];
    // Nouveaux champs pour l'inscription
    photo?: string;
    dateOfBirth?: string;
    parentPhone?: string;
}

export interface PhotoData {
    id: number;
    src: string;
    category: string;
    title: string;
    desc: string;
}

export interface ProgramData {
    id: string;
    title: string;
    shortDesc: string;
    fullDesc: string;
    subjects: string[];
    careers: string[];
    duration: string;
}

export interface ScheduleItem {
    day: string;
    time: string;
    subject: string;
    teacher: string;
    room: string;
    notification?: string;
}

export interface AnnouncementData {
    id: number;
    title: string;
    content: string;
    date: string;
    type: 'important' | 'event' | 'exam' | 'info' | 'urgent';
    author?: string;
}

export interface ClubData {
    id: number;
    name: string;
    emoji: string;
    description: string;
    coach: string;
    schedule: string;
    photo: string;
    members: number;
}

// Classes disponibles (6ème à Terminale)
export type GradeLevel = '6ème' | '5ème' | '4ème' | '3ème' | '2nde' | '1ère' | 'Terminale';
export type ClassLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ClassInfo {
    id: string;
    gradeLevel: GradeLevel;
    letter: ClassLetter;
    fullName: string; // e.g., "4ème A"
    mainTeacher?: string;
    studentCount: number;
}

// Emploi du temps par classe
export interface ClassScheduleItem extends ScheduleItem {
    classId?: string;
}

export interface ClassSchedule {
    classId: string;
    className: string;
    schedule: ScheduleItem[];
}

// Données des notes individuelles
export interface StudentGrade {
    studentId: number;
    studentName: string;
    subject: string;
    date: string;
    note: number;
    max: number;
    coef: number;
    teacher?: string;
}

// Réponses API
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
