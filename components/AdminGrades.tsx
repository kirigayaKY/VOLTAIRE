import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { apiClient } from '../backend/api-client';
import { StudentGrade } from '../types';

interface AdminGradesProps {
    adminId: number;
}

export const AdminGrades: React.FC<AdminGradesProps> = ({ adminId }) => {
    const [grades, setGrades] = useState<StudentGrade[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        studentId: '',
        subject: '',
        date: new Date().toLocaleDateString('fr-FR'),
        note: '',
        max: 20,
        coef: 1
    });

    useEffect(() => {
        apiClient.setAdminId(adminId);
        loadData();
    }, [adminId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [gradesData, studentsData] = await Promise.all([
                apiClient.getAllGrades(),
                apiClient.getAllStudents()
            ]);
            setGrades(gradesData);
            setStudents(studentsData);
        } catch (error) {
            console.error('Erreur au chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.studentId || !formData.subject || !formData.note) return;

        try {
            await apiClient.updateGrade(
                parseInt(formData.studentId),
                formData.subject,
                formData.date,
                parseFloat(formData.note),
                formData.max,
                formData.coef
            );
            setFormData({
                studentId: '',
                subject: '',
                date: new Date().toLocaleDateString('fr-FR'),
                note: '',
                max: 20,
                coef: 1
            });
            setShowAddForm(false);
            await loadData();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleDeleteGrade = async (studentId: number, subject: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

        try {
            await apiClient.deleteGrade(studentId, subject);
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Notes</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    <Plus size={20} /> Ajouter une note
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddGrade} className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <select
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                            required
                        >
                            <option value="">Sélectionner un élève</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Matière"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                        />
                        <input
                            type="number"
                            placeholder="Note"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                            min="0"
                            step="0.5"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Note max"
                            value={formData.max}
                            onChange={(e) => setFormData({ ...formData, max: parseFloat(e.target.value) })}
                            className="border border-gray-300 rounded px-3 py-2"
                            min="1"
                        />
                        <input
                            type="number"
                            placeholder="Coefficient"
                            value={formData.coef}
                            onChange={(e) => setFormData({ ...formData, coef: parseFloat(e.target.value) })}
                            className="border border-gray-300 rounded px-3 py-2"
                            min="1"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            <Save size={16} /> Enregistrer
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            <X size={16} /> Annuler
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Élève</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Matière</th>
                            <th className="border border-gray-300 px-4 py-2">Note</th>
                            <th className="border border-gray-300 px-4 py-2">Coef</th>
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((grade, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{grade.studentName}</td>
                                <td className="border border-gray-300 px-4 py-2">{grade.subject}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{grade.note}/{grade.max}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{grade.coef}</td>
                                <td className="border border-gray-300 px-4 py-2">{grade.date}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleDeleteGrade(grade.studentId, grade.subject)}
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
        </div>
    );
};
