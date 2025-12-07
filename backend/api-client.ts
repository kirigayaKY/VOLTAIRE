import axios, { AxiosInstance } from 'axios';
import { AnnouncementData, ClassSchedule, StudentGrade, ClassInfo } from '../types';

export interface AdminApiClient {
    // Classes
    getAllClasses: () => Promise<ClassInfo[]>;
    addClass: (classInfo: ClassInfo) => Promise<ClassInfo>;
    deleteClass: (classId: string) => Promise<any>;

    // Grades
    getAllGrades: () => Promise<StudentGrade[]>;
    getStudentGrades: (studentId: number) => Promise<any>;
    getClassGrades: (className: string) => Promise<StudentGrade[]>;
    updateGrade: (studentId: number, subject: string, date: string, note: number, max: number, coef: number) => Promise<any>;
    deleteGrade: (studentId: number, subject: string) => Promise<any>;

    // Schedule
    getAllSchedules: () => Promise<ClassSchedule[]>;
    getClassSchedule: (classId: string) => Promise<ClassSchedule>;
    updateSchedule: (classId: string, className: string, schedule: any[]) => Promise<any>;

    // Announcements
    getAllAnnouncements: () => Promise<AnnouncementData[]>;
    createAnnouncement: (title: string, content: string, type: string) => Promise<AnnouncementData>;
    updateAnnouncement: (id: number, title: string, content: string, type: string) => Promise<AnnouncementData>;
    deleteAnnouncement: (id: number) => Promise<any>;

    // Students
    getAllStudents: () => Promise<any[]>;
    getClassStudents: (className: string) => Promise<any[]>;
}

class ApiClient implements AdminApiClient {
    private client: AxiosInstance;
    private adminId: number | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: '/api'
        });
    }

    setAdminId(id: number) {
        this.adminId = id;
        this.client.defaults.headers.common['x-admin-id'] = id.toString();
    }

    // === CLASSES ===
    async getAllClasses(): Promise<ClassInfo[]> {
        const res = await this.client.get('/admin/classes');
        return res.data.data || [];
    }

    async addClass(classInfo: ClassInfo): Promise<ClassInfo> {
        const res = await this.client.post('/admin/classes/create', classInfo);
        return res.data.data;
    }

    async deleteClass(classId: string): Promise<any> {
        const res = await this.client.delete(`/admin/classes/${classId}`);
        return res.data;
    }

    // === GRADES ===
    async getAllGrades(): Promise<StudentGrade[]> {
        const res = await this.client.get('/admin/grades');
        return res.data.data || [];
    }

    async getStudentGrades(studentId: number): Promise<any> {
        const res = await this.client.get(`/admin/grades/${studentId}`);
        return res.data.data;
    }

    async getClassGrades(className: string): Promise<StudentGrade[]> {
        const res = await this.client.get(`/admin/grades/by-class/${encodeURIComponent(className)}`);
        return res.data.data || [];
    }

    async updateGrade(studentId: number, subject: string, date: string, note: number, max: number, coef: number): Promise<any> {
        const res = await this.client.post('/admin/grades/update', {
            studentId,
            subject,
            date,
            note,
            max,
            coef
        });
        return res.data;
    }

    async deleteGrade(studentId: number, subject: string): Promise<any> {
        const res = await this.client.delete(`/admin/grades/${studentId}/${subject}`);
        return res.data;
    }

    // === SCHEDULE ===
    async getAllSchedules(): Promise<ClassSchedule[]> {
        const res = await this.client.get('/admin/schedule');
        return res.data.data || [];
    }

    async getClassSchedule(classId: string): Promise<ClassSchedule> {
        const res = await this.client.get(`/admin/schedule/${classId}`);
        return res.data.data;
    }

    async updateSchedule(classId: string, className: string, schedule: any[]): Promise<any> {
        const res = await this.client.post('/admin/schedule/update', {
            classId,
            className,
            schedule
        });
        return res.data;
    }

    // === ANNOUNCEMENTS ===
    async getAllAnnouncements(): Promise<AnnouncementData[]> {
        const res = await this.client.get('/admin/announcements');
        return res.data.data || [];
    }

    async getPublicAnnouncements(): Promise<AnnouncementData[]> {
        const res = await this.client.get('/announcements');
        return res.data.data || [];
    }

    async createAnnouncement(title: string, content: string, type: string): Promise<AnnouncementData> {
        const res = await this.client.post('/admin/announcements/create', {
            title,
            content,
            type
        });
        return res.data.data;
    }

    async updateAnnouncement(id: number, title: string, content: string, type: string): Promise<AnnouncementData> {
        const res = await this.client.put(`/admin/announcements/${id}`, {
            title,
            content,
            type
        });
        return res.data.data;
    }

    async deleteAnnouncement(id: number): Promise<any> {
        const res = await this.client.delete(`/admin/announcements/${id}`);
        return res.data;
    }

    // === STUDENTS ===
    async getAllStudents(): Promise<any[]> {
        const res = await this.client.get('/admin/students');
        return res.data.data || [];
    }

    async getClassStudents(className: string): Promise<any[]> {
        const res = await this.client.get(`/admin/students/class/${className}`);
        return res.data.data || [];
    }
}

export const apiClient = new ApiClient();
