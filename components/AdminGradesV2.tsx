import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Loader2, ChevronDown, Search } from 'lucide-react';
import { apiClient } from '../backend/api-client';
import { StudentGrade } from '../types';
import { CLASSES } from '../data';

interface AdminGradesPropsV2 {
    adminId: number;
}

type GradeLevel = '6ème' | '5ème' | '4ème' | '3ème' | '2nde' | '1ère' | 'Terminale';
type ClassLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

interface FilterState {
    level: GradeLevel | 'all';
    letter: ClassLetter | 'all';
    studentSearch: string;
    subjectSearch: string;
}

interface StudentGradeGroup {
    studentId: number;
    studentName: string;
    className: string;
    grades: StudentGrade[];
    average: number;
}

export const AdminGradesV2: React.FC<AdminGradesPropsV2> = ({ adminId }) => {
    const [grades, setGrades] = useState<StudentGrade[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        level: 'all',
        letter: 'all',
        studentSearch: '',
        subjectSearch: ''
    });

    const [formData, setFormData] = useState({
        studentId: '',
        subject: '',
        date: new Date().toLocaleDateString('fr-FR'),
        note: '',
        max: 20,
        coef: 1
    });

    const gradeLevels: GradeLevel[] = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];
    const classLetters: ClassLetter[] = ['A', 'B', 'C', 'D', 'E', 'F'];

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

    // Filtrer et grouper les notes par élève
    const getFilteredStudentGrades = (): StudentGradeGroup[] => {
        const studentMap = new Map<number, StudentGradeGroup>();

        // Regrouper les notes par élève
        grades.forEach(grade => {
            const student = students.find(s => s.id === grade.studentId);
            if (!student) return;

            if (!studentMap.has(grade.studentId)) {
                studentMap.set(grade.studentId, {
                    studentId: grade.studentId,
                    studentName: grade.studentName,
                    className: student.className || 'Non assigné',
                    grades: [],
                    average: 0
                });
            }

            studentMap.get(grade.studentId)!.grades.push(grade);
        });

        // Calculer les moyennes
        studentMap.forEach(group => {
            if (group.grades.length > 0) {
                const totalPoints = group.grades.reduce(
                    (sum, g) => sum + ((g.note / g.max) * 20 * g.coef),
                    0
                );
                const totalCoef = group.grades.reduce((sum, g) => sum + g.coef, 0);
                group.average = totalCoef > 0 ? Math.round((totalPoints / totalCoef) * 10) / 10 : 0;
            }
        });

        // Appliquer les filtres
        return Array.from(studentMap.values()).filter(group => {
            const className = group.className;
            const [level, letter] = className ? className.split(' ') : ['', ''];

            // Filtrer par niveau
            if (filters.level !== 'all' && level !== filters.level) return false;

            // Filtrer par lettre de classe
            if (filters.letter !== 'all' && letter !== filters.letter) return false;

            // Filtrer par nom d'élève
            if (filters.studentSearch && 
                !group.studentName.toLowerCase().includes(filters.studentSearch.toLowerCase())) {
                return false;
            }

            // Filtrer par matière
            if (filters.subjectSearch) {
                const hasSubject = group.grades.some(g =>
                    g.subject.toLowerCase().includes(filters.subjectSearch.toLowerCase())
                );
                if (!hasSubject) return false;
            }

            return true;
        });
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
            alert('Erreur lors de l\'ajout de la note');
        }
    };

    const handleDeleteGrade = async (studentId: number, subject: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

        try {
            await apiClient.deleteGrade(studentId, subject);
            await loadData();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const filteredGroups = getFilteredStudentGrades();

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">📊 Gestion des Notes</h2>
                    <p className="text-sm text-gray-500 mt-1">Gérer les notes par élève, classe et niveau</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                    <Plus size={20} /> Ajouter une note
                </button>
            </div>

            {/* Formulaire d'ajout */}
            {showAddForm && (
                <form onSubmit={handleAddGrade} className="bg-green-50 p-6 rounded-lg mb-6 border-2 border-green-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">➕ Nouvelle Note</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <select
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="">👤 Sélectionner un élève</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} - {s.className}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="📚 Matière"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="number"
                            placeholder="📝 Note obtenue"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            min="0"
                            step="0.5"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Note max"
                            value={formData.max}
                            onChange={(e) => setFormData({ ...formData, max: parseFloat(e.target.value) })}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            min="1"
                        />
                        <input
                            type="number"
                            placeholder="⚙️ Coefficient"
                            value={formData.coef}
                            onChange={(e) => setFormData({ ...formData, coef: parseFloat(e.target.value) })}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            min="1"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                            <Save size={16} /> Enregistrer
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                        >
                            <X size={16} /> Annuler
                        </button>
                    </div>
                </form>
            )}

            {/* Filtres */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">🔍 Filtres</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filtre Niveau */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau</label>
                        <select
                            value={filters.level}
                            onChange={(e) => setFilters({ ...filters, level: e.target.value as any })}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="all">📚 Tous les niveaux</option>
                            {gradeLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtre Classe */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Classe</label>
                        <select
                            value={filters.letter}
                            onChange={(e) => setFilters({ ...filters, letter: e.target.value as any })}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="all">📖 Toutes les classes</option>
                            {classLetters.map(letter => (
                                <option key={letter} value={letter}>{letter}</option>
                            ))}
                        </select>
                    </div>

                    {/* Recherche Élève */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Recherche Élève</label>
                        <input
                            type="text"
                            placeholder="Nom de l'élève..."
                            value={filters.studentSearch}
                            onChange={(e) => setFilters({ ...filters, studentSearch: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    {/* Recherche Matière */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Recherche Matière</label>
                        <input
                            type="text"
                            placeholder="Matière..."
                            value={filters.subjectSearch}
                            onChange={(e) => setFilters({ ...filters, subjectSearch: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            {/* Affichage des résultats */}
            <div className="space-y-4">
                {filteredGroups.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Aucun élève ne correspond aux critères de filtrage</p>
                    </div>
                ) : (
                    filteredGroups.map(group => (
                        <div key={group.studentId} className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition">
                            {/* En-tête du groupe */}
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{group.studentName}</h3>
                                        <p className="text-sm text-gray-600">📍 {group.className}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-blue-600">{group.average}</p>
                                        <p className="text-xs text-gray-600">Moyenne générale</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tableau des notes */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">Matière</th>
                                            <th className="px-4 py-2 text-center text-sm font-semibold">Note</th>
                                            <th className="px-4 py-2 text-center text-sm font-semibold">Coef</th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                                            <th className="px-4 py-2 text-center text-sm font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.grades.map((grade, idx) => (
                                            <tr key={idx} className="border-b hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 text-sm">{grade.subject}</td>
                                                <td className="px-4 py-3 text-center font-semibold text-blue-600">
                                                    {grade.note}/{grade.max}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm">×{grade.coef}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{grade.date}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => handleDeleteGrade(group.studentId, grade.subject)}
                                                        className="text-red-500 hover:text-red-700 transition"
                                                        title="Supprimer cette note"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Statistiques du groupe */}
                            <div className="bg-gray-50 px-4 py-3 border-t text-xs text-gray-600">
                                <span>📌 {group.grades.length} note{group.grades.length > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Statistiques globales */}
            {filteredGroups.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                        📊 <strong>{filteredGroups.length} élève{filteredGroups.length > 1 ? 's' : ''}</strong> affiché{filteredGroups.length > 1 ? 's' : ''}
                        | 📝 <strong>{filteredGroups.reduce((sum, g) => sum + g.grades.length, 0)} note{filteredGroups.reduce((sum, g) => sum + g.grades.length, 0) > 1 ? 's' : ''}</strong>
                    </p>
                </div>
            )}
        </div>
    );
};
