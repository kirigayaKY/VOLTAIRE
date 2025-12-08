import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    GraduationCap, BookOpen, Users, Trophy, MapPin, 
    Phone, Mail, Menu, X, ChevronRight, User, Lock, 
    Calendar, Bell, FileText, Globe, Star, Clock, Image as ImageIcon, ZoomIn, Loader2, AlertCircle,
    Utensils, PlusCircle, CheckCircle, Mic, MicOff, Send, Bot, ShieldCheck,
    Briefcase, Book, CheckSquare, KeyRound, Eye, EyeOff, LogOut, Settings, Camera, Save, Edit, Upload
} from 'lucide-react';
import { 
    INITIAL_USERS, INITIAL_NEWS, INITIAL_SCHEDULE, 
    INITIAL_ANNOUNCEMENTS, INITIAL_CLUBS, INITIAL_PHOTOS, 
    IVESTP_PROGRAMS 
} from './data';
import { 
    Section, UserData, GradeData, ScheduleItem, 
    AnnouncementData, ClubData, PhotoData, ProgramData 
} from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentAnnouncements } from './components/StudentAnnouncements';

// --- COMPONENTS ---

const Logo = ({ className = "h-12" }: { className?: string }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <img 
            src="/Gemini_Generated_Image_1i6wa31i6wa31i6w.png" 
            alt="Logo Voltaire" 
            className="h-full object-contain drop-shadow-md"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
            }} 
        />
        <div className="flex flex-col">
            <span className="font-serif font-bold leading-tight text-voltaire-green tracking-wide">VOLTAIRE</span>
            <span className="text-xs uppercase tracking-widest text-prestige-gold font-bold">Marcory • IVESTP</span>
        </div>
    </div>
);

const NewsTicker = ({ news }: { news: string[] }) => (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-300 text-xs py-1.5 overflow-hidden relative whitespace-nowrap border-b border-slate-700/50">
        <motion.div 
            animate={{ x: ["100%", "-100%"] }} 
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
            className="inline-block"
        >
            {news.map((item, i) => (
                <span key={i} className="mx-8 font-light text-slate-400 opacity-80">{item}</span>
            ))}
        </motion.div>
    </div>
);

const Navbar = ({ setSection, currentSection }: { setSection: (s: Section) => void, currentSection: Section }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: 'home', label: 'Accueil' },
        { id: 'ivestp', label: 'Université IVESTP' },
        { id: 'gallery', label: 'Galerie' },
        { id: 'history', label: 'Histoire' },
        { id: 'contact', label: 'Contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-2 shadow-lg' : 'bg-white/95 backdrop-blur-md py-3'}`}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                <motion.div 
                    onClick={() => setSection('home')} 
                    className="cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title="Accueil"
                >
                    <Logo className={scrolled ? "h-9" : "h-12"} />
                </motion.div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map(item => (
                        <motion.button
                            key={item.id}
                            onClick={() => setSection(item.id as Section)}
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`text-sm font-medium transition-colors hover:text-prestige-gold ${
                                currentSection === item.id ? 'text-voltaire-green font-bold' : 'text-slate-700'
                            }`}
                        >
                            {item.label}
                        </motion.button>
                    ))}
                    <div className="flex space-x-2 border-l pl-4 border-slate-300">
                        <motion.button 
                            onClick={() => setSection('login-student')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-xs font-bold text-voltaire-green border border-voltaire-green rounded-full hover:bg-voltaire-green hover:text-white transition-all"
                        >
                            Espace Élève
                        </motion.button>
                        <motion.button 
                            onClick={() => setSection('login-admin')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-2 text-xs font-bold text-slate-600 border border-slate-400 rounded-full hover:bg-slate-100 transition-all"
                            title="Accès Administrateur"
                        >
                            Admin
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)} 
                    className="md:hidden text-voltaire-green"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setSection(item.id as Section); setIsOpen(false); }}
                                    className="text-left text-slate-700 font-medium active:text-voltaire-green"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <hr className="border-slate-100" />
                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {setSection('login-student'); setIsOpen(false)}} 
                                className="w-full text-left font-bold text-voltaire-green p-2 rounded hover:bg-slate-50 flex items-center gap-2"
                            >
                                <User size={16} /> Espace Élève
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const Hero = ({ setSection }: { setSection: (s: Section) => void }) => (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-100">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-voltaire-green/10 -skew-x-12 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-prestige-gold/10 -skew-x-12 -translate-x-1/4 rounded-tr-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
            >
                <span className="inline-block px-3 py-1 bg-white border border-voltaire-green text-voltaire-green rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    Excellence & Discipline
                </span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-tight">
                    Construire <span className="text-voltaire-green">l'Élite</span> de demain.
                </h1>
                <p className="text-lg text-slate-600 max-w-lg">
                    Du Collège à l'Université, le Groupe Scolaire Voltaire Marcory et IVESTP s'engagent à offrir une éducation de classe mondiale au cœur d'Abidjan.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSection('ivestp')} 
                        className="px-8 py-3 bg-voltaire-green text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-voltaire-dark transition-all font-semibold flex items-center gap-2"
                    >
                        Découvrir IVESTP <ChevronRight size={18} />
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSection('gallery')} 
                        className="px-8 py-3 bg-white text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold flex items-center gap-2"
                    >
                        <ImageIcon size={18}/> Visite Virtuelle
                    </motion.button>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden md:block"
            >
                <motion.div 
                    whileHover={{ rotate: 0 }}
                    className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 transition-all duration-500 cursor-pointer"
                >
                    <img 
                        src="/photo2.png" 
                        alt="Campus Voltaire" 
                        className="w-full h-[500px] object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <p className="font-serif text-xl italic">"Le savoir est la seule richesse qui s'accroît quand on la partage."</p>
                    </div>
                </motion.div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-prestige-gold rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-voltaire-green rounded-full opacity-20 blur-2xl"></div>
            </motion.div>
        </div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 group cursor-pointer overflow-hidden relative"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-150`}></div>
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 text-voltaire-green group-hover:bg-voltaire-green group-hover:text-white transition-colors">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold font-serif mb-3 text-slate-800">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

const InfoSection = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Un parcours d'excellence</h2>
                <div className="w-20 h-1 bg-prestige-gold mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={BookOpen} 
                    title="Collège & Lycée" 
                    desc="Un enseignement rigoureux basé sur les programmes officiels renforcés, préparant aux examens nationaux avec des taux de réussite exceptionnels."
                    color="bg-voltaire-green"
                />
                <FeatureCard 
                    icon={GraduationCap} 
                    title="Université IVESTP" 
                    desc="Des filières professionnalisantes en Gestion, Technologie et Sciences, connectées au monde de l'entreprise et ouvertes sur l'international."
                    color="bg-prestige-gold"
                />
                <FeatureCard 
                    icon={Trophy} 
                    title="Sports & Culture" 
                    desc="Un complexe sportif moderne (Basket, Football) et des clubs culturels pour épanouir les talents au-delà de la salle de classe."
                    color="bg-accent-orange"
                />
            </div>
        </div>
    </section>
);

const DirectorWord = () => (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3">
                <div className="relative">
                    <div className="w-full h-[400px] bg-gray-300 rounded-lg overflow-hidden shadow-xl">
                    </div>
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 shadow-lg rounded-lg border-l-4 border-voltaire-green">
                        <p className="font-bold text-slate-800">M. le Directeur Général</p>
                        <p className="text-xs text-slate-500">Groupe Voltaire Marcory</p>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-2/3 space-y-6">
                <h2 className="text-3xl font-serif font-bold text-voltaire-green">Le mot de la direction</h2>
                <blockquote className="text-xl text-slate-700 italic border-l-4 border-prestige-gold pl-6 py-2">
                    "Notre mission dépasse la simple transmission du savoir. À Voltaire Marcory, nous forgeons le caractère, cultivons l'ambition et préparons nos élèves à devenir les leaders de l'Afrique de demain."
                </blockquote>
                <p className="text-slate-600 leading-relaxed">
                    Depuis sa création, notre établissement s'est imposé comme une référence en matière d'éducation en Côte d'Ivoire. Grâce à une équipe pédagogique dévouée et des infrastructures modernes, nous offrons un cadre propice à l'épanouissement intellectuel et personnel de chaque apprenant.
                </p>
            </div>
        </div>
    </section>
);

const ServicesSection = () => (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img 
                            src="/Gemini_Generated_Image_s00ulms00ulms00u.png" 
                            alt="Cantine Scolaire" 
                            className="rounded-2xl shadow-xl w-full h-[350px] object-cover"
                        />
                    </motion.div>
                </div>
                <div className="w-full md:w-1/2 space-y-6 order-1 md:order-2">
                    <motion.div
                         initial={{ opacity: 0, x: 30 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-accent-orange/10 text-accent-orange rounded-lg">
                                <Utensils size={32} />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-slate-900">Cantine & Services</h2>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Parce que bien manger, c'est bien apprendre. Le Groupe Scolaire Voltaire Marcory dispose d'une 
                            <span className="font-bold text-voltaire-green"> cantine moderne</span> offrant des repas sains et équilibrés, préparés sur place par des professionnels de la restauration.
                        </p>
                        <ul className="space-y-4 pt-2">
                            <li className="flex items-center gap-3 text-slate-700 font-medium">
                                <div className="w-2 h-2 rounded-full bg-voltaire-green"></div>
                                Menus variés et équilibrés validés par un nutritionniste.
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 font-medium">
                                <div className="w-2 h-2 rounded-full bg-voltaire-green"></div>
                                Espace de restauration climatisé et convivial.
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 font-medium">
                                <div className="w-2 h-2 rounded-full bg-voltaire-green"></div>
                                Services complémentaires : Transport scolaire & Infirmerie.
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
);

const Timeline = () => {
    const events = [
        { year: '1995', title: 'Fondation', desc: "Ouverture du Collège Voltaire avec 3 classes." },
        { year: '2005', title: 'Expansion', desc: "Inauguration du bâtiment Lycée et des laboratoires." },
        { year: '2012', title: 'IVESTP', desc: "Création de l'Institut Voltaire d'Enseignement Supérieur Technique et Professionnel." },
        { year: '2023', title: 'Modernisation', desc: "Rénovation des infrastructures sportives et digitalisation." },
    ];

    return (
        <div className="py-20 container mx-auto px-4">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Notre Histoire</h2>
                <p className="text-slate-600">Plus de 25 ans d'engagement pour l'éducation.</p>
            </div>
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-1/2 md:translate-x-[-1px] space-y-12">
                {events.map((evt, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        key={idx}
                        className={`relative flex items-center md:justify-between ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="absolute -left-[9px] md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-voltaire-green border-4 border-white shadow-sm z-10"></div>
                        <motion.div 
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                            className="ml-8 md:ml-0 md:w-[45%] bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-all cursor-default"
                        >
                            <span className="text-prestige-gold font-bold text-xl block mb-1">{evt.year}</span>
                            <h3 className="font-bold text-slate-800 text-lg">{evt.title}</h3>
                            <p className="text-slate-500 text-sm mt-2">{evt.desc}</p>
                        </motion.div>
                        <div className="hidden md:block md:w-[45%]"></div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const Gallery = ({ photos }: { photos: PhotoData[] }) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <div className="pt-20 bg-slate-50 min-h-screen pb-20">
             <div className="bg-white py-12 text-center border-b mb-12">
                <span className="text-prestige-gold font-bold uppercase tracking-widest text-sm mb-2 block">Visite Virtuelle</span>
                <h1 className="text-4xl font-serif font-bold text-voltaire-green">La Galerie Voltaire</h1>
                <p className="text-slate-500 mt-4 max-w-xl mx-auto px-4">
                    Plongez au cœur de notre établissement. Des salles de classe aux terrains de sport, découvrez l'environnement Voltaire.
                </p>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {photos.map((photo) => (
                        <motion.div
                            layoutId={`card-${photo.id}`}
                            key={photo.id}
                            onClick={() => setSelectedId(photo.id)}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer group"
                        >
                            <div className="relative h-56 md:h-64 overflow-hidden">
                                <motion.img 
                                    src={photo.src} 
                                    alt={photo.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ZoomIn className="text-white drop-shadow-md" size={32} />
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-voltaire-green text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                        {photo.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif font-bold text-xl text-slate-800 mb-2">{photo.title}</h3>
                                <p className="text-slate-600 text-sm line-clamp-2">{photo.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedId && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div 
                            layoutId={`card-${selectedId}`}
                            className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row relative shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setSelectedId(null)} 
                                className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>

                            {(() => {
                                const photo = photos.find(p => p.id === selectedId);
                                if(!photo) return null;
                                return (
                                    <>
                                        <div className="w-full md:w-2/3 h-[40vh] md:h-auto bg-slate-900 flex items-center justify-center relative">
                                             <img src={photo.src} alt={photo.title} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col bg-white overflow-y-auto max-h-[50vh] md:max-h-full">
                                            <span className="text-voltaire-green font-bold text-sm tracking-wide uppercase mb-2">{photo.category}</span>
                                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-3 md:mb-4">{photo.title}</h2>
                                            <p className="text-slate-600 leading-relaxed mb-6 text-sm md:text-base">{photo.desc}</p>
                                            <div className="mt-auto pt-4 md:pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400 text-sm">
                                                <span>Voltaire Marcory</span>
                                                <ImageIcon size={16} />
                                            </div>
                                        </div>
                                    </>
                                )
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Register = ({ onRegister, goBack, db }: { onRegister: (user: UserData) => void, goBack: () => void, db: UserData[] }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [matricule, setMatricule] = useState('');
    const [className, setClassName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPhoto(imageUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!firstName || !lastName || !matricule || !className || !dateOfBirth || !parentPhone || !password) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        // Check if matricule already exists
        const exists = db.find(u => u.matricule.toLowerCase() === matricule.toLowerCase());
        if (exists) {
            setError('Ce numéro matricule est déjà enregistré.');
            return;
        }

        const newUser: UserData = {
            id: Date.now(),
            matricule: matricule.toUpperCase(),
            role: 'student',
            firstName,
            lastName: lastName.toUpperCase(),
            password,
            className,
            status: 'active',
            dateOfBirth,
            parentPhone,
            photo: photo || undefined,
            average: 0, // Nouveau élève, pas encore de moyenne
            absences: 0,
            delays: 0,
            rank: 0,
            grades: []
        };

        onRegister(newUser);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative overflow-hidden my-8"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-voltaire-green"></div>
                
                <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goBack} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X size={20} />
                </motion.button>

                <div className="text-center mb-8 mt-4">
                    <h2 className="text-3xl font-bold text-slate-800">Inscription Élève</h2>
                    <p className="text-sm text-slate-500 mt-2">Créez votre compte pour accéder à l'espace numérique</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-accent-orange/10 text-accent-orange p-3 rounded-lg text-sm flex items-center gap-2 border border-accent-orange/20">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-slate-50 flex items-center justify-center text-slate-300">
                                {photo ? (
                                    <img src={photo} alt="Aperçu" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={40} />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-voltaire-green text-white p-2 rounded-full shadow-md">
                                <Upload size={16} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Ajouter une photo (Facultatif)</p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Nom</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:border-voltaire-green focus:outline-none" placeholder="Votre nom" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Prénoms</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:border-voltaire-green focus:outline-none" placeholder="Vos prénoms" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Matricule</label>
                            <input type="text" value={matricule} onChange={(e) => setMatricule(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:border-voltaire-green focus:outline-none" placeholder="Ex: 23-VM-0000" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Classe</label>
                            <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:border-voltaire-green focus:outline-none" required>
                                <option value="">Sélectionner...</option>
                                <option value="6ème">6ème</option>
                                <option value="5ème">5ème</option>
                                <option value="4ème">4ème</option>
                                <option value="3ème">3ème</option>
                                <option value="2nde A">2nde A</option>
                                <option value="2nde C">2nde C</option>
                                <option value="1ère A">1ère A</option>
                                <option value="1ère C">1ère C</option>
                                <option value="1ère D">1ère D</option>
                                <option value="Terminale A">Terminale A</option>
                                <option value="Terminale C">Terminale C</option>
                                <option value="Terminale D">Terminale D</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Date de Naissance</label>
                            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:border-voltaire-green focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Numéro Parent/Tuteur</label>
                            <input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:border-voltaire-green focus:outline-none" placeholder="+225..." required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Mot de passe</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:border-voltaire-green focus:outline-none" placeholder="Min. 6 caractères" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Confirmer mot de passe</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:border-voltaire-green focus:outline-none" placeholder="Répéter mot de passe" required />
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="w-full py-4 rounded-lg text-white font-bold shadow-lg bg-voltaire-green hover:bg-voltaire-dark transition-colors text-lg flex items-center justify-center gap-2 mt-4"
                    >
                        <CheckCircle size={20} />
                        S'inscrire
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

const Login = ({ type, goBack, onLoginSuccess, db, onRegisterClick }: { type: 'student' | 'parent' | 'admin'; goBack: () => void; onLoginSuccess: (user: UserData) => void; db: UserData[]; onRegisterClick?: () => void }) => {
    const [matricule, setMatricule] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotMatricule, setForgotMatricule] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotError, setForgotError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            let user;
            if (type === 'admin') {
                if (matricule.toLowerCase() === 'admin' && password === '08546517') {
                    user = db.find(u => u.role === 'admin');
                }
            } else {
                // Pour les élèves, on vérifie matricule ET mot de passe dans la base
                user = db.find(u => u.matricule.toUpperCase() === matricule.toUpperCase() && u.role === type);
                
                if (user) {
                    // Si l'utilisateur a un mot de passe spécifique (inscription), on le vérifie
                    // Sinon on utilise le mot de passe par défaut "123456" pour les données mockées initiales
                    const validPassword = user.password === password || (password === "123456" && user.password !== password && user.id <= 10); 
                    
                    if (!validPassword && user.password !== password) {
                         throw new Error("Mot de passe incorrect");
                    }
                }
            }

            if (user) {
                onLoginSuccess(user);
            } else {
                throw new Error("Identifiants introuvables.");
            }

        } catch (err: any) {
            setError(err.message || "Erreur de connexion");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError('');
        
        const user = db.find(u => u.matricule.toUpperCase() === forgotMatricule.toUpperCase() && u.role === type);
        
        if (!user) {
            setForgotError('Matricule non trouvé');
            return;
        }
        
        if (!newPassword || newPassword.length < 6) {
            setForgotError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        alert(`✅ Mot de passe réinitialisé avec succès!\n\nNouveau mot de passe : ${newPassword}\n\nVous pouvez maintenant vous connecter avec vos nouveaux identifiants.`);
        setShowForgotPassword(false);
        setForgotMatricule('');
        setNewPassword('');
    };

    const isStudent = type === 'student';
    const isAdmin = type === 'admin';
    const bgColor = isAdmin ? 'bg-slate-900' : 'bg-slate-100';
    const accentColor = isAdmin ? 'bg-slate-700' : (isStudent ? 'bg-voltaire-green' : 'bg-prestige-gold');

    if (showForgotPassword && !isAdmin) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${bgColor} p-4`}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${isAdmin ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-800'} rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden`}
                >
                    <div className={`absolute top-0 left-0 w-full h-2 ${accentColor}`}></div>
                    
                    <div className="text-center mb-8 mt-4">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-voltaire-light text-voltaire-green`}>
                            <KeyRound size={32} />
                        </div>
                        <h2 className="text-2xl font-bold">Réinitialiser le mot de passe</h2>
                        <p className="text-sm text-slate-500 mt-2">Entrez votre matricule et votre nouveau mot de passe</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleForgotPassword}>
                        {forgotError && (
                            <div className="bg-accent-orange/10 text-accent-orange p-3 rounded-lg text-sm flex items-center gap-2 border border-accent-orange/20">
                                <AlertCircle size={16} /> {forgotError}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Matricule</label>
                            <input 
                                type="text" 
                                placeholder="Ex: 23-VM-0012"
                                value={forgotMatricule}
                                onChange={(e) => setForgotMatricule(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-voltaire-green focus:outline-none transition-colors bg-slate-50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Nouveau mot de passe</label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-voltaire-green focus:outline-none transition-colors bg-slate-50"
                            />
                            <p className="text-xs text-slate-500 mt-1">Min. 6 caractères</p>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-voltaire-green text-white py-3 rounded-lg font-bold hover:bg-voltaire-dark transition-colors"
                        >
                            Réinitialiser
                        </motion.button>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setShowForgotPassword(false)}
                            className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                        >
                            Retour à la connexion
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        );
    }

    if (isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
                {/* Décoration d'arrière-plan */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-voltaire-green opacity-5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-prestige-gold opacity-5 rounded-full blur-3xl -ml-40 -mb-40"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-800 border-2 border-slate-700 rounded-3xl shadow-2xl p-10 w-full max-w-lg relative z-10 overflow-hidden"
                >
                    {/* Top gradient bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-voltaire-green via-prestige-gold to-voltaire-green"></div>
                    
                    {/* Close button */}
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={goBack} 
                        className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </motion.button>

                    {/* Header section */}
                    <div className="text-center mb-10 mt-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring" }}
                            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-voltaire-green to-green-600 flex items-center justify-center mb-6 shadow-lg"
                        >
                            <ShieldCheck size={40} className="text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2">Panneau Admin</h2>
                        <p className="text-slate-400 text-sm">Accès sécurisé réservé au personnel autorisé</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm flex items-center gap-3"
                            >
                                <AlertCircle size={18} className="flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        {/* Identifiant Input */}
                        <div>
                            <label className="block text-xs font-bold uppercase mb-3 text-slate-300 tracking-wider">
                                Identifiant Admin
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-voltaire-green/20 to-prestige-gold/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center">
                                    <ShieldCheck size={18} className="absolute left-4 text-voltaire-green" />
                                    <input 
                                        type="text" 
                                        value={matricule}
                                        onChange={(e) => setMatricule(e.target.value)}
                                        placeholder="Entrez votre identifiant"
                                        className="w-full pl-14 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-voltaire-green transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mot de passe Input */}
                        <div>
                            <label className="block text-xs font-bold uppercase mb-3 text-slate-300 tracking-wider">
                                Mot de passe
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-voltaire-green/20 to-prestige-gold/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center">
                                    <Lock size={18} className="absolute left-4 text-voltaire-green" />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-14 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-voltaire-green transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                    <span className="font-bold text-slate-400">Test ID:</span> admin
                                </span>
                                <span className="text-xs text-slate-500">
                                    <span className="font-bold text-slate-400">Test MDP:</span> 08546517
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button 
                            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(76, 175, 80, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-4 mt-8 rounded-xl text-white font-bold shadow-lg bg-gradient-to-r from-voltaire-green to-green-600 hover:from-voltaire-green hover:to-green-700 transition-all duration-300 flex justify-center items-center gap-2 text-lg disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    Accéder au Panneau
                                </>
                            )}
                        </motion.button>

                        {/* Footer info */}
                        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-700">
                            <p>🔒 Connexion sécurisée | Accès limité au personnel autorisé</p>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${bgColor} p-4`}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isAdmin ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-800'} rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden`}
            >
                <div className={`absolute top-0 left-0 w-full h-2 ${accentColor}`}></div>
                
                <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goBack} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X size={20} />
                </motion.button>

                <div className="text-center mb-8 mt-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isStudent ? 'bg-voltaire-light text-voltaire-green' : 'bg-prestige-light text-prestige-gold'}`}>
                        {isStudent ? <User size={32} /> : <Users size={32} />}
                    </div>
                    <h2 className="text-2xl font-bold">Espace {isStudent ? 'Élève' : 'Parents'}</h2>
                    <p className="text-sm text-slate-500">
                        Connectez-vous pour accéder au suivi scolaire
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-accent-orange/10 text-accent-orange p-3 rounded-lg text-sm flex items-center gap-2 border border-accent-orange/20">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Identifiant</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input 
                                type="text" 
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                                placeholder={isStudent ? "Ex: 23-VM-0012" : "Ex: P-23-0012"}
                                className="w-full pl-10 pr-4 py-2 border bg-white border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-voltaire-green focus:ring-voltaire-green/20 transition-all text-slate-800"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Mot de passe</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                className="w-full pl-10 pr-10 py-2 border bg-white border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:border-voltaire-green focus:ring-voltaire-green/20 transition-all text-slate-800"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <p className="text-right text-xs text-slate-400 mt-1 italic">
                            (Test: 123456)
                        </p>
                        {onRegisterClick && (
                            <div className="flex justify-between items-center mt-2">
                                <motion.button
                                    type="button"
                                    onClick={onRegisterClick}
                                    className="text-xs text-slate-600 hover:text-voltaire-green font-semibold underline"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Pas encore de compte ? S'inscrire
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-xs text-voltaire-green hover:text-voltaire-dark font-semibold"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    🔑 Mot de passe oublié ?
                                </motion.button>
                            </div>
                        )}
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg text-white font-bold shadow-lg transition-transform flex justify-center items-center gap-2 ${accentColor} hover:brightness-110 ${isLoading ? 'opacity-80' : ''}`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Se Connecter'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

// Calcul de la moyenne avec coefficient
const calculateAverage = (grades: GradeData[]) => {
    if (!grades || grades.length === 0) return 0;
    let totalPoints = 0;
    let totalCoef = 0;
    
    grades.forEach(grade => {
        const normalizedNote = grade.max === 10 ? (grade.note / 0.5) : grade.note;
        totalPoints += normalizedNote * grade.coef;
        totalCoef += grade.coef;
    });
    
    return totalCoef > 0 ? (totalPoints / totalCoef).toFixed(2) : 0;
};

// === STUDENT DASHBOARD COMPONENTS ===

const StudentHomeTab = ({ user, news, onNavigate }: { user: UserData; news: string[]; onNavigate: (s: Section) => void }) => {
    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-voltaire-green to-green-600 text-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-2">👋 Bienvenue, {user.firstName} !</h2>
                <p className="text-voltaire-light">Content de te revoir. Voici un résumé de ta journée.</p>
            </motion.div>

            {/* Quick Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-voltaire-green cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">📝</div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Notes</p>
                            <p className="text-sm font-bold">{calculateAverage(user.grades || [])}/20</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-orange-500 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">📝</div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Emploi du Temps</p>
                            <p className="text-sm font-bold">6 cours</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-pink-500 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">👤</div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Profil</p>
                            <p className="text-sm font-bold">Mes infos</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* News & Updates Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* College News */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Globe size={20} className="text-voltaire-green" />
                        Actualités du Collège
                    </h3>
                    <div className="space-y-3">
                        {news.slice(0, 4).map((item, idx) => (
                            <motion.div key={idx} whileHover={{ x: 5 }} className="p-3 bg-slate-50 rounded-lg border-l-4 border-voltaire-green hover:bg-slate-100 transition-colors cursor-pointer">
                                <p className="text-sm text-slate-700">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Info IVESTP */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <BookOpen size={18} className="text-prestige-gold" />
                        IVESTP
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Découvre nos programmes d'enseignement supérieur technique et professionnel.
                    </p>
                    <div 
                        onClick={() => onNavigate('ivestp')}
                        className="bg-prestige-gold text-white px-3 py-2 rounded-lg text-sm font-semibold text-center cursor-pointer hover:bg-yellow-700 transition-colors"
                    >
                        En savoir plus
                    </div>
                </div>
            </div>


        </div>
    );
};

const StudentProfileTab = ({ user }: { user: UserData }) => {
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [parentPhone, setParentPhone] = useState(user.parentPhone || '+225 07 07 45 79 82'); 
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(user.photo || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
            // Dans une vraie app, on enverrait l'image au backend ici
        }
    };

    const handlePhoneSave = () => {
        setIsEditingPhone(false);
        // Dans une vraie app, on sauvegarderait le numéro ici
        alert('Numéro parent mis à jour !');
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm">
                                {avatar ? (
                                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-voltaire-green to-green-600 flex items-center justify-center text-white">
                                        <span className="text-6xl font-bold">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-slate-600 hover:text-voltaire-green border border-slate-200 transition-colors"
                                title="Changer la photo"
                            >
                                <Camera size={16} />
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setShowPasswordChange(!showPasswordChange)}
                            className="mt-4 px-4 py-2 bg-voltaire-green text-white rounded-lg font-bold hover:bg-voltaire-dark transition-colors flex items-center gap-2 text-sm"
                        >
                            <KeyRound size={16} />
                            Modifier mot de passe
                        </motion.button>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-slate-800 mb-1">{user.firstName} {user.lastName}</h2>
                        <p className="text-slate-500 mb-6">Élève - {user.className}</p>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Matricule</p>
                                    <p className="text-lg font-bold text-slate-800">{user.matricule}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Classe</p>
                                    <p className="text-lg font-bold text-slate-800">{user.className}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Date de Naissance</p>
                                    <p className="text-lg font-bold text-slate-800">{user.dateOfBirth || "Non renseignée"}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Statut</p>
                                    <p className="text-lg font-bold text-voltaire-green">Actif</p>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-prestige-gold p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Numéro Parent/Tuteur</p>
                                    {!isEditingPhone ? (
                                        <button onClick={() => setIsEditingPhone(true)} className="text-slate-400 hover:text-slate-600">
                                            <Edit size={14} />
                                        </button>
                                    ) : (
                                        <button onClick={handlePhoneSave} className="text-green-600 hover:text-green-700">
                                            <Save size={16} />
                                        </button>
                                    )}
                                </div>
                                {isEditingPhone ? (
                                    <input 
                                        type="text" 
                                        value={parentPhone}
                                        onChange={(e) => setParentPhone(e.target.value)}
                                        className="text-lg font-bold text-slate-800 bg-white border border-yellow-300 rounded px-2 py-1 w-full focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-lg font-bold text-slate-800">{parentPhone}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Form */}
            {showPasswordChange && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Modifier votre mot de passe</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Ancien mot de passe</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-voltaire-green" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nouveau mot de passe</label>
                            <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-voltaire-green" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Confirmer le nouveau mot de passe</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-voltaire-green" />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="w-full py-3 bg-voltaire-green text-white rounded-lg font-bold hover:bg-voltaire-dark transition-colors"
                        >
                            Enregistrer le nouveau mot de passe
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const StudentNotesTab = ({ user }: { user: UserData }) => {
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadGrades();
    }, [user.matricule]);

    const loadGrades = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/student/grades/${user.matricule}`);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des notes');
            }
            const data = await response.json();
            if (data.success) {
                setGrades(data.data.grades || []);
            } else {
                setError(data.error || 'Impossible de charger les notes');
            }
        } catch (err) {
            setError('Erreur lors de la récupération des notes. Vérifiez votre connexion.');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-voltaire-green" />
                    Relevé de notes
                </h3>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-voltaire-green"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-4 flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {!loading && grades.length === 0 && !error && (
                    <div className="text-center py-12 text-slate-500">
                        <FileText size={40} className="mx-auto mb-3 opacity-30" />
                        <p>Aucune note disponible pour le moment</p>
                    </div>
                )}

                {!loading && grades.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-bold text-slate-600 text-sm uppercase">Matière</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm uppercase text-center">Coef</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm uppercase text-center">Note</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm uppercase text-center">Date</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm uppercase text-center">Appréciation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {grades.map((grade, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">{grade.subject}</td>
                                        <td className="p-4 text-center text-slate-500">{grade.coef}</td>
                                        <td className="p-4 text-center">
                                            <span className={`font-bold px-2 py-1 rounded ${grade.note >= 12 ? 'bg-green-100 text-green-700' : grade.note >= 10 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                {grade.note}/{grade.max}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-sm text-slate-500">{grade.date}</td>
                                        <td className="p-4 text-center text-sm text-slate-500">
                                            {grade.note >= 16 ? 'Très Bien' : grade.note >= 14 ? 'Bien' : grade.note >= 12 ? 'Assez Bien' : grade.note >= 10 ? 'Passable' : 'Insuffisant'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const StudentScheduleTab = () => {
    return (
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-voltaire-green" />
                    Emploi du temps
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map(day => {
                        const dayCourses = INITIAL_SCHEDULE.filter(s => s.day === day);
                        if(dayCourses.length === 0) return null;
                        
                        return (
                            <div key={day} className="border border-slate-200 rounded-lg overflow-hidden">
                                <div className="bg-slate-50 p-3 font-bold text-slate-700 border-b border-slate-200">
                                    {day}
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {dayCourses.map((course, idx) => (
                                        <div key={idx} className="p-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 hover:bg-slate-50">
                                            <div className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 whitespace-nowrap">
                                                {course.time}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-slate-800">{course.subject}</div>
                                                <div className="text-xs text-slate-500">{course.teacher}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded flex items-center gap-1">
                                                    <MapPin size={12} /> {course.room}
                                                </span>
                                                {course.notification && (
                                                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded flex items-center gap-1">
                                                        <AlertCircle size={12} /> {course.notification}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const StudentDashboard = ({ user, news, onNavigate, onLogout }: { user: UserData; news: string[]; onNavigate: (s: Section) => void; onLogout: () => void }) => {
    const [activeTab, setActiveTab] = useState<'home' | 'notes' | 'schedule' | 'announcements' | 'profile'>('home');

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-slate-900 text-white p-4 flex flex-col fixed bottom-0 md:relative z-40 md:h-screen">
                <div className="hidden md:flex items-center gap-2 mb-8 px-2">
                    <img src="/logo.png" alt="Logo Voltaire" className="w-8 h-8 object-contain" />
                    <div>
                        <span className="font-bold text-lg">Espace Élève</span>
                        <p className="text-xs text-slate-400">Voltaire Marcory</p>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col justify-around md:justify-start gap-1 md:gap-2 flex-1">
                    <button 
                        onClick={() => setActiveTab('home')}
                        className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'home' ? 'bg-voltaire-green text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                            <BookOpen size={20} />
                            <span className="text-[10px] md:text-sm font-medium">Accueil</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => setActiveTab('notes')}
                        className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'notes' ? 'bg-voltaire-green text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                            <FileText size={20} />
                            <span className="text-[10px] md:text-sm font-medium">Notes</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => setActiveTab('schedule')}
                        className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'schedule' ? 'bg-voltaire-green text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                            <Calendar size={20} />
                            <span className="text-[10px] md:text-sm font-medium">Emploi du temps</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => setActiveTab('announcements')}
                        className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'announcements' ? 'bg-voltaire-green text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                            <Bell size={20} />
                            <span className="text-[10px] md:text-sm font-medium">Annonces</span>
                        </div>
                    </button>
                     <button 
                        onClick={() => setActiveTab('profile')}
                        className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-voltaire-green text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                            <User size={20} />
                            <span className="text-[10px] md:text-sm font-medium">Profil</span>
                        </div>
                    </button>
                </div>

                <div className="hidden md:block pt-4 border-t border-slate-700">
                    <button 
                        onClick={onLogout}
                        className="w-full p-3 rounded-lg flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 pb-20 md:pb-8 h-screen overflow-y-auto">
                 {/* Mobile Header */}
                <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-30">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-voltaire-green rounded-lg flex items-center justify-center font-serif font-bold text-white">V</div>
                        <span className="font-bold">Voltaire</span>
                    </div>
                    <button onClick={onLogout} className="text-slate-500 hover:text-red-500">
                        <LogOut size={20} />
                    </button>
                </div>

                <div className="p-4 md:p-8 max-w-6xl mx-auto">
                    {activeTab === 'home' && (
                        <StudentHomeTab 
                            user={user} 
                            news={news} 
                            onNavigate={onNavigate} 
                        />
                    )}
                    {activeTab === 'notes' && <StudentNotesTab user={user} />}
                    {activeTab === 'schedule' && <StudentScheduleTab />}
                    {activeTab === 'announcements' && <StudentAnnouncements />}
                    {activeTab === 'profile' && <StudentProfileTab user={user} />}
                </div>
            </div>
        </div>
    );
};

const Footer = ({ setSection }: { setSection: (s: Section) => void }) => (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <img src="/logo.png" alt="Logo Voltaire" className="w-10 h-10 object-contain" />
                        <div>
                            <span className="font-serif font-bold text-white text-lg block leading-none">VOLTAIRE</span>
                            <span className="text-[10px] uppercase tracking-widest text-prestige-gold font-bold">Marcory • IVESTP</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400 max-w-sm mb-6">
                        L'excellence éducative au cœur d'Abidjan. De la 6ème aux Grandes Écoles, nous formons l'élite de demain avec rigueur et passion.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-voltaire-green hover:text-white transition-colors cursor-pointer">
                            <span className="font-bold">f</span>
                        </div>
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-voltaire-green hover:text-white transition-colors cursor-pointer">
                            <span className="font-bold">in</span>
                        </div>
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-voltaire-green hover:text-white transition-colors cursor-pointer">
                            <span className="font-bold">Ig</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-4">Liens Rapides</h4>
                    <ul className="space-y-2 text-sm">
                        <li><button onClick={() => setSection('home')} className="hover:text-voltaire-green transition-colors">Accueil</button></li>
                        <li><button onClick={() => setSection('ivestp')} className="hover:text-voltaire-green transition-colors">Enseignement Supérieur</button></li>
                        <li><button onClick={() => setSection('gallery')} className="hover:text-voltaire-green transition-colors">Galerie</button></li>
                        <li><button onClick={() => setSection('contact')} className="hover:text-voltaire-green transition-colors">Contact</button></li>
                        <li><button onClick={() => setSection('login-student')} className="hover:text-voltaire-green transition-colors">Espace Élève</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Contact</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin size={16} className="text-voltaire-green mt-1" />
                            <span>Marcory Zone 4,<br/>Abidjan, Côte d'Ivoire</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={16} className="text-voltaire-green" />
                            <span>+225 07 07 45 79 82</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={16} className="text-voltaire-green" />
                            <span>contact@voltaire-marcory.ci</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
                <p>&copy; {new Date().getFullYear()} Groupe Scolaire Voltaire Marcory. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
);

const App = () => {
    const [section, setSection] = useState<Section>('home');
    const [user, setUser] = useState<UserData | null>(null);
    const [db, setDb] = useState<UserData[]>(INITIAL_USERS);

    // Charger et sauvegarder les utilisateurs depuis/vers localStorage
    useEffect(() => {
        const savedUsers = localStorage.getItem('voltaire_users');
        if (savedUsers) {
            try {
                setDb(JSON.parse(savedUsers));
            } catch (err) {
                console.error('Erreur lors du chargement des utilisateurs:', err);
                setDb(INITIAL_USERS);
            }
        }
    }, []);

    // Synchroniser le frontend avec le backend au démarrage
    useEffect(() => {
        const syncWithBackend = async () => {
            try {
                const response = await fetch('/api/public/users');
                const data = await response.json();
                if (data.success && data.data) {
                    setDb(data.data);
                    localStorage.setItem('voltaire_users', JSON.stringify(data.data));
                }
            } catch (error) {
                console.error('Erreur lors de la synchronisation avec le backend:', error);
                // Utiliser les données locales en cas d'erreur
            }
        };
        
        // Synchroniser après un court délai pour que le backend soit prêt
        const timer = setTimeout(syncWithBackend, 500);
        return () => clearTimeout(timer);
    }, []);

    // Sauvegarder les changements de db dans localStorage
    useEffect(() => {
        localStorage.setItem('voltaire_users', JSON.stringify(db));
    }, [db]);

    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [section]);

    const handleLoginSuccess = (loggedInUser: UserData) => {
        setUser(loggedInUser);
        if (loggedInUser.role === 'admin') {
            setSection('admin-dash');
        } else {
            setSection('student-dash');
        }
    };

    const handleRegister = async (newUser: UserData) => {
        try {
            const response = await fetch('/api/student/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    matricule: newUser.matricule,
                    className: newUser.className,
                    dateOfBirth: newUser.dateOfBirth,
                    parentPhone: newUser.parentPhone,
                    password: newUser.password,
                    photo: newUser.photo
                })
            });

            const data = await response.json();

            if (data.success) {
                // Ajouter également au état local pour la compatibilité
                setDb(prevDb => [...prevDb, newUser]);
                alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                setSection('login-student');
            } else {
                alert(`Erreur d'inscription: ${data.error}`);
            }
        } catch (error) {
            alert('Erreur de connexion au serveur. Veuillez réessayer.');
            console.error('Erreur inscription:', error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setSection('home');
    };

    return (
        <div className="min-h-screen font-sans text-slate-800 bg-white selection:bg-voltaire-green selection:text-white">
            
            {!['student-dash', 'admin-dash', 'login-student', 'login-admin', 'register-student'].includes(section) && (
                <Navbar setSection={setSection} currentSection={section} />
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={section}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {section === 'home' && (
                        <>
                            <Hero setSection={setSection} />
                            <NewsTicker news={INITIAL_NEWS} />
                            <InfoSection />
                            <DirectorWord />
                            <ServicesSection />
                            <Timeline />
                        </>
                    )}

                    {section === 'gallery' && <Gallery photos={INITIAL_PHOTOS} />}

                    {section === 'history' && (
                        <div className="pt-20">
                            <Timeline />
                            <div className="container mx-auto px-4 pb-20 text-center">
                                <p className="text-slate-600 max-w-2xl mx-auto">
                                    L'histoire de Voltaire Marcory est celle d'une passion pour l'éducation. 
                                    Depuis nos débuts modestes jusqu'à devenir un complexe éducatif de référence, 
                                    nous n'avons cessé d'innover pour offrir le meilleur à nos élèves.
                                </p>
                            </div>
                        </div>
                    )}

                    {section === 'ivestp' && (
                        <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
                            <div className="container mx-auto px-4">
                                <div className="text-center mb-16">
                                    <span className="text-prestige-gold font-bold uppercase tracking-widest text-sm mb-2 block">Enseignement Supérieur</span>
                                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6">Nos Filières d'Excellence</h1>
                                    <p className="text-slate-600 max-w-2xl mx-auto">
                                        L'IVESTP propose des formations BTS et Licence Professionnelle adaptées aux besoins du marché du travail ivoirien et international.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {IVESTP_PROGRAMS.map(prog => (
                                        <motion.div 
                                            key={prog.id}
                                            whileHover={{ y: -5 }}
                                            className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-voltaire-green group hover:shadow-xl transition-all"
                                        >
                                            <div className="mb-4">
                                                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-voltaire-green transition-colors">{prog.title}</h3>
                                                <div className="flex items-center gap-2 text-xs font-bold text-prestige-gold uppercase tracking-wider">
                                                    <Clock size={14} /> {prog.duration}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">{prog.fullDesc}</p>
                                            
                                            <div className="mb-6">
                                                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                                                    <BookOpen size={16} className="text-voltaire-green" /> Matières Clés
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {prog.subjects.slice(0, 3).map((sub, i) => (
                                                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">{sub}</span>
                                                    ))}
                                                    {prog.subjects.length > 3 && <span className="px-2 py-1 bg-slate-50 text-slate-400 text-xs rounded-md">+{prog.subjects.length - 3}</span>}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                                                    <Briefcase size={16} className="text-accent-orange" /> Débouchés
                                                </h4>
                                                <ul className="text-xs text-slate-600 space-y-1">
                                                    {prog.careers.slice(0, 3).map((car, i) => (
                                                        <li key={i} className="flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-slate-400"></div> {car}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {section === 'contact' && (
                        <div className="pt-24 pb-20 bg-white min-h-screen">
                             <div className="container mx-auto px-4 max-w-4xl">
                                <div className="text-center mb-16">
                                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6">Contactez-nous</h1>
                                    <p className="text-slate-600">
                                        Une question sur les inscriptions ? Besoin de renseignements ? 
                                        Notre équipe est à votre disposition.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                    <div className="p-8 bg-slate-50 rounded-2xl text-center hover:bg-voltaire-green hover:text-white transition-colors group">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-voltaire-green shadow-sm group-hover:text-voltaire-green">
                                            <Phone size={32} />
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">Téléphone</h3>
                                        <p className="text-sm opacity-80">+225 07 07 45 79 82</p>
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-2xl text-center hover:bg-voltaire-green hover:text-white transition-colors group">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-voltaire-green shadow-sm group-hover:text-voltaire-green">
                                            <MapPin size={32} />
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">Adresse</h3>
                                        <p className="text-sm opacity-80">Marcory Zone 4<br/>Abidjan, Côte d'Ivoire</p>
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-2xl text-center hover:bg-voltaire-green hover:text-white transition-colors group">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-voltaire-green shadow-sm group-hover:text-voltaire-green">
                                            <Mail size={32} />
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">Email</h3>
                                        <p className="text-sm opacity-80">institutvoltaireci@gmail.com</p>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                                    <h3 className="font-serif font-bold text-2xl mb-6 text-slate-800">Envoyez-nous un message</h3>
                                    <form className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Nom complet</label>
                                                <input type="text" className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-voltaire-green" placeholder="Votre nom" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Email</label>
                                                <input type="email" className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-voltaire-green" placeholder="votre@email.com" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase mb-1 text-slate-600">Message</label>
                                            <textarea rows={5} className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-voltaire-green" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                                        </div>
                                        <button className="px-8 py-3 bg-voltaire-green text-white font-bold rounded-lg hover:bg-voltaire-dark transition-colors">
                                            Envoyer le message
                                        </button>
                                    </form>
                                </div>
                             </div>
                        </div>
                    )}

                    {(section === 'login-student' || section === 'login-admin') && (
                        <div className="pt-20">
                            <Login 
                                type={section === 'login-student' ? 'student' : 'admin'} 
                                goBack={() => setSection('home')}
                                onLoginSuccess={handleLoginSuccess}
                                db={db}
                                onRegisterClick={section === 'login-student' ? () => setSection('register-student') : undefined}
                            />
                        </div>
                    )}

                    {section === 'register-student' && (
                        <div className="pt-20">
                            <Register 
                                onRegister={handleRegister} 
                                goBack={() => setSection('login-student')} 
                                db={db}
                            />
                        </div>
                    )}

                    {section === 'student-dash' && user && (
                        <StudentDashboard 
                            user={user} 
                            news={INITIAL_NEWS}
                            onNavigate={setSection}
                            onLogout={handleLogout}
                        />
                    )}

                    {section === 'admin-dash' && user && (
                        <AdminDashboard
                            adminId={user.id}
                            adminName={`${user.firstName} ${user.lastName}`}
                            onLogout={handleLogout}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Footer only on public pages */}
            {section !== 'student-dash' && section !== 'admin-dash' && section !== 'login-student' && section !== 'login-admin' && section !== 'register-student' && (
                <Footer setSection={setSection} />
            )}
        </div>
    );
};

export default App;