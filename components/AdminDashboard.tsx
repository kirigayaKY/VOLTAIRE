import React, { useState } from 'react';
import { BookOpen, Clock, Bell, LogOut, Users } from 'lucide-react';
import { AdminGradesV3 } from './AdminGradesV3';
import { AdminSchedule } from './AdminSchedule';
import { AdminAnnouncements } from './AdminAnnouncements';
import { AdminClasses } from './AdminClasses';

interface AdminDashboardProps {
    adminId: number;
    adminName: string;
    onLogout: () => void;
}

type AdminTab = 'classes' | 'grades' | 'schedule' | 'announcements';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    adminId,
    adminName,
    onLogout
}) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('classes');

    const tabs = [
        {
            id: 'classes' as const,
            label: 'Gestion des Classes',
            icon: Users,
            description: 'Créer, modifier et supprimer les classes. Les classes sont utilisées pour l\'emploi du temps et les notes.'
        },
        {
            id: 'grades' as const,
            label: 'Gestion des Notes',
            icon: BookOpen,
            description: 'Ajouter, modifier ou supprimer les notes des élèves par classe'
        },
        {
            id: 'schedule' as const,
            label: 'Emploi du Temps',
            icon: Clock,
            description: 'Gérer l\'emploi du temps pour chaque classe (6ème à Terminale)'
        },
        {
            id: 'announcements' as const,
            label: 'Annonces',
            icon: Bell,
            description: 'Publier des annonces visibles par tous (élèves, parents, professeurs)'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Header */}
            <div className="bg-gradient-to-r from-voltaire-green to-prestige-gold text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">🔐 Panneau Administrateur</h1>
                        <p className="text-sm mt-1 opacity-90">Connecté: {adminName}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                    >
                        <LogOut size={20} /> Déconnexion
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-800 border-b border-slate-700 shadow">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-8">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-4 border-b-2 transition ${
                                        activeTab === tab.id
                                            ? 'border-prestige-gold text-prestige-gold'
                                            : 'border-transparent text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-semibold">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-slate-700 rounded-lg p-6 mb-6 text-white border border-slate-600">
                    <p className="text-sm">{tabs.find(t => t.id === activeTab)?.description}</p>
                </div>

                {activeTab === 'classes' && <AdminClasses adminId={adminId} />}
                {activeTab === 'grades' && <AdminGradesV3 adminId={adminId} />}
                {activeTab === 'schedule' && <AdminSchedule adminId={adminId} />}
                {activeTab === 'announcements' && <AdminAnnouncements adminId={adminId} />}
            </div>

            {/* Footer */}
            <div className="bg-slate-900 border-t border-slate-700 text-center py-6 text-slate-400 mt-12">
                <p>© 2025 IVESTP Voltaire • Système de Gestion Scolaire</p>
            </div>
        </div>
    );
};
