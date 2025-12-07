import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../backend/api-client';
import { AnnouncementData } from '../types';

export const StudentAnnouncements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await apiClient.getPublicAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error('Erreur lors du chargement des annonces:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'urgent':
                return <AlertCircle className="text-red-600" size={20} />;
            case 'important':
                return <AlertCircle className="text-orange-600" size={20} />;
            case 'exam':
                return <Calendar className="text-blue-600" size={20} />;
            case 'event':
                return <Bell className="text-green-600" size={20} />;
            default:
                return <Bell className="text-slate-600" size={20} />;
        }
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'important': 'bg-orange-100 text-orange-800 border-orange-300',
            'event': 'bg-blue-100 text-blue-800 border-blue-300',
            'exam': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'info': 'bg-green-100 text-green-800 border-green-300',
            'urgent': 'bg-red-100 text-red-800 border-red-300'
        };
        return colors[type] || 'bg-slate-100 text-slate-800 border-slate-300';
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'important': 'Important',
            'event': 'Événement',
            'exam': 'Examen',
            'info': 'Actualité',
            'urgent': 'Urgent'
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Bell size={20} className="text-voltaire-green" />
                    Annonces
                </h3>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-voltaire-green"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Bell size={20} className="text-voltaire-green" />
                    Annonces & Actualités
                </h3>

                {announcements.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Bell size={40} className="mx-auto mb-3 opacity-30" />
                        <p>Aucune annonce pour le moment</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {[...announcements].reverse().map((announcement) => (
                            <motion.div
                                key={announcement.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setSelectedId(announcement.id)}
                                className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all ${getTypeColor(announcement.type)} ${
                                    selectedId === announcement.id ? 'ring-2 ring-offset-1' : ''
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        {getTypeIcon(announcement.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-lg">{announcement.title}</h4>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full border`}>
                                                {getTypeLabel(announcement.type)}
                                            </span>
                                        </div>
                                        <p className="text-sm opacity-75 mb-2 line-clamp-2">
                                            {announcement.content}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs opacity-60">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {announcement.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User size={14} />
                                                {announcement.author}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded view */}
                                {selectedId === announcement.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 pt-4 border-t border-current border-opacity-20"
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {announcement.content}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
