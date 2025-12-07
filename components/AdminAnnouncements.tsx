import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Loader2, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../backend/api-client';
import { AnnouncementData } from '../types';

interface AdminAnnouncementsProps {
    adminId: number;
}

export const AdminAnnouncements: React.FC<AdminAnnouncementsProps> = ({ adminId }) => {
    const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        type: 'important' | 'event' | 'exam' | 'info' | 'urgent';
    }>({
        title: '',
        content: '',
        type: 'info'
    });

    useEffect(() => {
        apiClient.setAdminId(adminId);
        loadAnnouncements();
    }, [adminId]);

    const loadAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await apiClient.getAllAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        try {
            if (editingId) {
                await apiClient.updateAnnouncement(editingId, formData.title, formData.content, formData.type);
            } else {
                await apiClient.createAnnouncement(formData.title, formData.content, formData.type);
            }

            resetForm();
            await loadAnnouncements();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

        try {
            await apiClient.deleteAnnouncement(id);
            await loadAnnouncements();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleEdit = (announcement: AnnouncementData) => {
        setFormData({
            title: announcement.title,
            content: announcement.content,
            type: announcement.type
        });
        setEditingId(announcement.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ title: '', content: '', type: 'info' });
        setEditingId(null);
        setShowForm(false);
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'important': 'bg-red-100 text-red-800',
            'event': 'bg-blue-100 text-blue-800',
            'exam': 'bg-yellow-100 text-yellow-800',
            'info': 'bg-green-100 text-green-800',
            'urgent': 'bg-red-200 text-red-900'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Annonces</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <Plus size={20} /> Nouvelle annonce
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-green-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? '✏️ Modifier l\'annonce' : '📝 Créer une nouvelle annonce'}
                    </h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Titre de l'annonce"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            required
                        />
                        <textarea
                            placeholder="Contenu de l'annonce (visible par tous)"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full border border-gray-300 rounded px-4 py-2 h-32"
                            required
                        />
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                        >
                            <option value="info">ℹ️ Information</option>
                            <option value="event">🎉 Événement</option>
                            <option value="exam">📝 Examen</option>
                            <option value="important">⚠️ Important</option>
                            <option value="urgent">🚨 Urgent</option>
                        </select>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                            <Save size={16} /> {editingId ? 'Mettre à jour' : 'Publier pour tous'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                        >
                            <X size={16} /> Annuler
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Aucune annonce pour le moment</p>
                ) : (
                    [...announcements].reverse().map(announcement => (
                        <div key={announcement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded ${getTypeColor(announcement.type)}`}>
                                            {announcement.type.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">{announcement.date}</span>
                                        {announcement.author && <span className="text-xs text-gray-600">Par {announcement.author}</span>}
                                    </div>
                                </div>
                                <div title="Visible par tous">
                                    <CheckCircle2 className="text-green-500" size={20} />
                                </div>
                            </div>
                            <p className="text-gray-700 mt-3">{announcement.content}</p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEdit(announcement)}
                                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                                >
                                    <Edit2 size={16} /> Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(announcement.id)}
                                    className="flex items-center gap-2 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={16} /> Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
