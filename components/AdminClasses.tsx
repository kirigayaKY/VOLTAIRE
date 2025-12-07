import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Loader2, Users } from 'lucide-react';
import { apiClient } from '../backend/api-client';
import { ClassInfo, GradeLevel, ClassLetter } from '../types';

interface AdminClassesProps {
    adminId: number;
}

export const AdminClasses: React.FC<AdminClassesProps> = ({ adminId }) => {
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        gradeLevel: '6ème',
        letter: 'A',
        mainTeacher: '',
        studentCount: 30
    });

    const gradeLevels = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    useEffect(() => {
        apiClient.setAdminId(adminId);
        loadClasses();
    }, [adminId]);

    const loadClasses = async () => {
        setLoading(true);
        try {
            const data = await apiClient.getAllClasses();
            setClasses(data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const fullName = `${formData.gradeLevel} ${formData.letter}`;
        const classId = `${formData.gradeLevel.substring(0, 1)}${formData.letter}`.replace(/ème|nde|re/g, '');

        const newClass: ClassInfo = {
            id: classId,
            gradeLevel: formData.gradeLevel as GradeLevel,
            letter: formData.letter as ClassLetter,
            fullName: fullName,
            mainTeacher: formData.mainTeacher,
            studentCount: formData.studentCount
        };

        // Vérifier que la classe n'existe pas
        if (classes.find(c => c.fullName === fullName)) {
            alert('Cette classe existe déjà !');
            return;
        }

        try {
            await apiClient.addClass(newClass);
            setFormData({
                gradeLevel: '6ème',
                letter: 'A',
                mainTeacher: '',
                studentCount: 30
            });
            setShowAddForm(false);
            await loadClasses();
            alert(`✅ Classe "${fullName}" créée avec succès ! Elle est maintenant accessible partout.`);
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la création de la classe');
        }
    };

    const handleDeleteClass = async (classId: string, fullName: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la classe ${fullName} ?`)) return;

        try {
            await apiClient.deleteClass(classId);
            await loadClasses();
            alert(`✅ Classe supprimée`);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    // Grouper les classes par niveau
    const classesByLevel = gradeLevels.map(level => ({
        level,
        classes: classes.filter(c => c.gradeLevel === level)
    }));

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Classes</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    <Plus size={20} /> Ajouter une classe
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddClass} className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">📚 Créer une nouvelle classe</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Niveau</label>
                            <select
                                value={formData.gradeLevel}
                                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            >
                                {gradeLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Lettre</label>
                            <select
                                value={formData.letter}
                                onChange={(e) => setFormData({ ...formData, letter: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            >
                                {letters.map(letter => (
                                    <option key={letter} value={letter}>{letter}</option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="text"
                            placeholder="Professeur principal (optionnel)"
                            value={formData.mainTeacher}
                            onChange={(e) => setFormData({ ...formData, mainTeacher: e.target.value })}
                            className="col-span-2 border border-gray-300 rounded px-3 py-2"
                        />
                        <input
                            type="number"
                            placeholder="Nombre d'élèves estimé"
                            value={formData.studentCount}
                            onChange={(e) => setFormData({ ...formData, studentCount: parseInt(e.target.value) })}
                            className="col-span-2 border border-gray-300 rounded px-3 py-2"
                            min="1"
                            max="50"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                        >
                            <Save size={16} /> Créer la classe
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                        >
                            <X size={16} /> Annuler
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-8">
                {classesByLevel.map(({ level, classes: levelClasses }) => (
                    <div key={level}>
                        <h3 className="text-lg font-bold text-gray-700 mb-3 pb-2 border-b-2 border-gray-200">
                            {level}
                        </h3>
                        {levelClasses.length === 0 ? (
                            <p className="text-gray-400 italic text-sm ml-4">Aucune classe pour ce niveau</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-4">
                                {levelClasses.map((cls) => (
                                    <div key={cls.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800">{cls.fullName}</h4>
                                                {cls.mainTeacher && (
                                                    <p className="text-sm text-gray-600">👨‍🏫 {cls.mainTeacher}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteClass(cls.id, cls.fullName)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Supprimer cette classe"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Users size={16} />
                                            <span>{cls.studentCount} élèves</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>ℹ️ Info :</strong> Les classes créées ici seront disponibles immédiatement pour la gestion des notes, emplois du temps et seront visibles par tous les élèves.
                </p>
            </div>
        </div>
    );
};
