import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { apiClient } from '../backend/api-client';
import { ClassSchedule, ScheduleItem, ClassInfo } from '../types';

interface AdminScheduleProps {
    adminId: number;
}

export const AdminSchedule: React.FC<AdminScheduleProps> = ({ adminId }) => {
    const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [newCourse, setNewCourse] = useState<Partial<ScheduleItem>>({
        day: 'Lundi',
        time: '08:00-09:00',
        subject: '',
        teacher: '',
        room: ''
    });

    useEffect(() => {
        apiClient.setAdminId(adminId);
        loadData();
    }, [adminId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [schedulesData, classesData] = await Promise.all([
                apiClient.getAllSchedules(),
                apiClient.getAllClasses()
            ]);
            setSchedules(schedulesData);
            setClasses(classesData);
            if (classesData.length > 0) {
                setSelectedClassId(classesData[0].id);
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentSchedule = schedules.find(s => s.classId === selectedClassId);

    const handleAddCourse = async () => {
        if (!newCourse.subject || !newCourse.teacher || !newCourse.room) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        try {
            const updatedSchedule = [
                ...(currentSchedule?.schedule || []),
                newCourse as ScheduleItem
            ];

            await apiClient.updateSchedule(
                selectedClassId,
                currentSchedule?.className || selectedClassId,
                updatedSchedule
            );

            setNewCourse({
                day: 'Lundi',
                time: '08:00-09:00',
                subject: '',
                teacher: '',
                room: ''
            });
            setShowAddCourse(false);
            await loadData();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleDeleteCourse = async (index: number) => {
        if (!currentSchedule) return;
        if (!confirm('Supprimer ce cours ?')) return;

        try {
            const updatedSchedule = currentSchedule.schedule.filter((_, i) => i !== index);
            await apiClient.updateSchedule(
                selectedClassId,
                currentSchedule.className,
                updatedSchedule
            );
            await loadData();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion de l'Emploi du Temps</h2>

            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Sélectionner une classe</label>
                <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                >
                    {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.fullName}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                    {currentSchedule ? `Emploi du temps - ${currentSchedule.className}` : 'Nouvelle classe'}
                </h3>
                <button
                    onClick={() => setShowAddCourse(!showAddCourse)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <Plus size={20} /> Ajouter un cours
                </button>
            </div>

            {showAddCourse && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <select
                            value={newCourse.day}
                            onChange={(e) => setNewCourse({ ...newCourse, day: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                        >
                            <option>Lundi</option>
                            <option>Mardi</option>
                            <option>Mercredi</option>
                            <option>Jeudi</option>
                            <option>Vendredi</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Horaire (ex: 08:00-09:00)"
                            value={newCourse.time}
                            onChange={(e) => setNewCourse({ ...newCourse, time: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Matière"
                            value={newCourse.subject}
                            onChange={(e) => setNewCourse({ ...newCourse, subject: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Professeur"
                            value={newCourse.teacher}
                            onChange={(e) => setNewCourse({ ...newCourse, teacher: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Salle"
                            value={newCourse.room}
                            onChange={(e) => setNewCourse({ ...newCourse, room: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddCourse}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            <Save size={16} /> Ajouter
                        </button>
                        <button
                            onClick={() => setShowAddCourse(false)}
                            className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            <X size={16} /> Annuler
                        </button>
                    </div>
                </div>
            )}

            {currentSchedule && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">Jour</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Horaire</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Matière</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Professeur</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Salle</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSchedule.schedule.map((course, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{course.day}</td>
                                    <td className="border border-gray-300 px-4 py-2">{course.time}</td>
                                    <td className="border border-gray-300 px-4 py-2">{course.subject}</td>
                                    <td className="border border-gray-300 px-4 py-2">{course.teacher}</td>
                                    <td className="border border-gray-300 px-4 py-2">{course.room}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleDeleteCourse(idx)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
