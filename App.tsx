import React, { useState, useEffect, useMemo, Component, ErrorInfo } from 'react';
import { ViewState, SmartNote, Language, Theme, SocialLink } from './types';
import { STATIC_NOTES, LibraryItem } from './notesData';
import SmartNoteReader from './components/SmartNoteReader';
import AdminPanel from './components/AdminPanel';
import AIToolsPanel from './components/AIToolsPanel';
import RoadmapPanel from './components/RoadmapPanel';

// --- Modern Icons (Optimized for Edu-UI) ---
const Icons = {
  Book: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Brain: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Telegram: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-18.6 7.4a2.24 2.24 0 0 0-.1 4.12l4.5 1.78 10.5-6.7-8.3 7.6 3.8 7.6c.4.8 1.6.9 2.1.2l4.2-4 6-2.4a2.24 2.24 0 0 0 1.4-2.1V3.733c0-.5-.2-1-.6-1.3z"/></svg>,
  YouTube: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>,
  Instagram: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  Map: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>,
  Bot: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/></svg>,
  Globe: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  Pill: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>,
  Pen: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
};

// --- Constants ---
const ADMIN_PASSWORD = "!@#$%";

// --- Subject Hierarchy ---
export const SUBJECT_CATEGORIES: Record<string, any> = {
  "Polity": { icon: "⚖️", color: "bg-amber-100 text-amber-700" },
  "History": { icon: "🏰", color: "bg-orange-100 text-orange-700" },
  "Geography": { icon: "🌍", color: "bg-green-100 text-green-700" },
  "Science": { icon: "🧬", color: "bg-blue-100 text-blue-700" },
  "English": { icon: "📖", color: "bg-rose-100 text-rose-700" },
  "Aptitude": { icon: "🧮", color: "bg-purple-100 text-purple-700" },
  "Current Affairs": { icon: "📰", color: "bg-teal-100 text-teal-700" },
  "Pharmacy Exams": { icon: "💊", color: "bg-cyan-100 text-cyan-700" },
  "General": { icon: "📚", color: "bg-slate-100 text-slate-700" }
};

export const PHARMACY_SUBS = [
  "Pharmacology", "Pharmaceutics", "Pharmaceutical Jurisprudence", 
  "Pharmacognosy", "Pharmaceutical Chemistry", "Pharmaceutical Analysis", 
  "Physical Pharmacy", "Others Subjects"
];

// --- Translations Dictionary ---
const translations = {
  en: {
    home: "Home",
    subjects: "Subjects",
    aiTools: "AI Tools",
    roadmap: "Roadmap",
    contact: "Contact",
    startLearning: "Start Learning",
    tryAI: "Try AI Tools For Practice",
    withBrand: "with Vidyunmesā EduWorld",
    tagline: "Organized Notes & Practice for SSC, Railway & State Exams — Study smart, practice better!",
    intro: "Organized notes, smart quizzes, clear roadmaps — your exam companion.",
    curatedSubjects: "Curated Subjects",
    aiQuizMaker: "AI Quiz Maker",
    examSathi: "Vidyunmesā Sathi",
    examRoadmap: "Exam Roadmap",
    recentUploads: "Recent Uploads",
    searchPlaceholder: "Search notes by topic or subject...",
    readNote: "Read Smart Note",
    platform: "Platform",
    legal: "Legal & Support",
    community: "Community",
    copyright: "© 2024 Vidyunmesā EduWorld. All rights reserved.",
    adminLogin: "Admin Login",
    enterPass: "Enter Password",
    access: "Access",
    back: "Back",
    admin: "Admin Panel",
    pharmacyHub: "Pharmacy Hub",
    selectCategory: "Select Category",
    allSubjects: "All Subjects"
  },
  hi: {
    home: "होम",
    subjects: "विषय",
    aiTools: "AI टूल्स",
    roadmap: "रोडमैप",
    contact: "संपर्क",
    startLearning: "पढ़ाई शुरू करें",
    tryAI: "AI टूल्स आज़माएं",
    withBrand: "Vidyunmesā EduWorld के साथ",
    tagline: "SSC, रेलवे और राज्य परीक्षाओं के लिए व्यवस्थित नोट्स और अभ्यास — स्मार्ट बनें, बेहतर अभ्यास करें!",
    intro: "व्यवस्थित नोट्स, स्मार्ट क्विज़, स्पष्ट रोडमैप — आपका परीक्षा साथी।",
    curatedSubjects: "चयनित विषय",
    aiQuizMaker: "AI क्विज़ मेकर",
    examSathi: "Vidyunmesā साथी",
    examRoadmap: "परीक्षा रोडमैप",
    recentUploads: "हालिया अपलोड",
    searchPlaceholder: "टॉपिक या विषय खोजें...",
    readNote: "स्मार्ट नोट पढ़ें",
    platform: "प्लेटफ़ॉर्म",
    legal: "कानूनी और सहायता",
    community: "समुदाय",
    copyright: "© 2024 Vidyunmesā EduWorld. सर्वाधिकार सुरक्षित।",
    adminLogin: "एडमिन लॉगिन",
    enterPass: "पासवर्ड दर्ज करें",
    access: "प्रवेश करें",
    back: "वापस",
    admin: "एडमिन पैनल",
    pharmacyHub: "फार्मेसी हब",
    selectCategory: "श्रेणी चुनें",
    allSubjects: "सभी विषय"
  }
};

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-slate-600 mb-6">The application encountered an unexpected error. Please try reloading.</p>
            <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors">
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [activeNote, setActiveNote] = useState<LibraryItem | null>(null);
  const [customNotes, setCustomNotes] = useState<LibraryItem[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  
  // --- Subject Navigation State ---
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedPharmacySub, setSelectedPharmacySub] = useState<string | null>(null);

  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  
  // --- Admin & Auth State ---
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");

  // --- Audio & Social State ---
  const [audioAccessLevel, setAudioAccessLevel] = useState<'locked' | 'admin' | 'public'>('locked');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
      { id: '1', platform: 'Telegram', url: '#', label: 'Join Channel' },
      { id: '2', platform: 'YouTube', url: '#', label: 'Watch Lectures' }
  ]);

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState("");

  const txt = translations[language];

  // --- Load Data ---
  useEffect(() => {
    try {
        const stored = localStorage.getItem('vidyunmesa_custom_notes');
        if (stored) setCustomNotes(JSON.parse(stored));
        
        const deleted = localStorage.getItem('vidyunmesa_deleted_ids');
        if (deleted) setDeletedIds(JSON.parse(deleted));

        const savedLinks = localStorage.getItem('vidyunmesa_social_links');
        if (savedLinks) setSocialLinks(JSON.parse(savedLinks));

        const savedAudio = localStorage.getItem('vidyunmesa_audio_level');
        if (savedAudio) setAudioAccessLevel(savedAudio as any);
        
        // Clean up legacy garbage if any
        const legacyKey = 'cinematic_presentations'; 
        if(localStorage.getItem(legacyKey)) localStorage.removeItem(legacyKey);

    } catch (e) {
        console.error("Storage load error", e);
    }
  }, []);

  // --- Persistence Helpers ---
  const saveCustomNotes = (notes: LibraryItem[]) => {
      setCustomNotes(notes);
      localStorage.setItem('vidyunmesa_custom_notes', JSON.stringify(notes));
  };

  const saveSocialLinks = (links: SocialLink[]) => {
      setSocialLinks(links);
      localStorage.setItem('vidyunmesa_social_links', JSON.stringify(links));
  }

  const updateAudioLevel = (level: 'locked' | 'admin' | 'public') => {
      setAudioAccessLevel(level);
      localStorage.setItem('vidyunmesa_audio_level', level);
  }

  // --- Master Data Merge ---
  const allNotes = useMemo(() => {
      const combined = [...customNotes, ...STATIC_NOTES];
      // Filter out deleted IDs (Tombstone logic)
      return combined.filter(n => !deletedIds.includes(n.id.toString()));
  }, [customNotes, deletedIds]);

  // --- Filter Logic ---
  const filteredNotes = useMemo(() => {
      let filtered = allNotes;

      // 1. Search Filter
      if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(n => 
              (n.title?.toLowerCase() || "").includes(q) || 
              (n.subject?.toLowerCase() || "").includes(q) ||
              (n.smartContentHindi?.title?.toLowerCase() || "").includes(q)
          );
      }

      // 2. Subject Filter
      if (selectedSubject) {
          if (selectedSubject === "Pharmacy Exams" && selectedPharmacySub) {
              filtered = filtered.filter(n => n.subject === selectedPharmacySub);
          } else {
              // If it's Pharmacy but no sub selected, show all Pharmacy
              if (selectedSubject === "Pharmacy Exams") {
                   filtered = filtered.filter(n => PHARMACY_SUBS.includes(n.subject));
              } else {
                   filtered = filtered.filter(n => n.subject === selectedSubject);
              }
          }
      }

      // 3. Privacy Filter (Master Override)
      // If note is private, only show if Admin
      if (!isAdminSession) {
          filtered = filtered.filter(n => !n.isPrivate);
      }

      return filtered;
  }, [allNotes, searchQuery, selectedSubject, selectedPharmacySub, isAdminSession]);

  // --- Handlers ---
  const handleDeleteNote = (id: number) => {
      const strId = id.toString();
      const newDeleted = [...deletedIds, strId];
      setDeletedIds(newDeleted);
      localStorage.setItem('vidyunmesa_deleted_ids', JSON.stringify(newDeleted));
      
      // Also remove from custom state if exists there
      const remainingCustom = customNotes.filter(n => n.id !== id);
      saveCustomNotes(remainingCustom);
  };

  const handleAddNote = (note: LibraryItem) => {
      saveCustomNotes([note, ...customNotes]);
  };

  const handleEditNote = (updatedNote: LibraryItem) => {
      const idx = customNotes.findIndex(n => n.id === updatedNote.id);
      if (idx >= 0) {
          const updated = [...customNotes];
          updated[idx] = updatedNote;
          saveCustomNotes(updated);
      } else {
          // If editing a static note, we essentially "fork" it into custom notes
          // but since we use IDs, we just add it.
          saveCustomNotes([updatedNote, ...customNotes]); 
      }
  };

  const handleAdminLogin = () => {
      if (adminPassInput === ADMIN_PASSWORD) {
          setIsAdminSession(true);
          setShowAdminLogin(false);
          setAdminPassInput("");
          setView('admin');
      } else {
          alert("Invalid Password");
      }
  };

  // --- Renderers ---

  const renderHeader = () => (
    <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
            {/* Top Row: Brand & Toggles */}
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => {setView('home'); setSelectedSubject(null);}}>
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-tl-2xl rounded-br-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-white font-brand text-2xl font-bold">V</span>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="leading-tight">
                        <h1 className="text-xl font-brand font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Vidyunmesā</h1>
                        <span className={`text-xs font-bold tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-900'}`}>EduWorld</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {language === 'en' ? '🇮🇳 HI' : '🇺🇸 EN'}
                    </button>
                    <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-slate-800 text-yellow-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    {/* XP / Gamification Badge */}
                    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-white border-slate-200 text-indigo-600'}`}>
                        <span>🏆 Scholar Lvl. 1</span>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Navigation (Mobile Scrollable) */}
            <nav className="flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar md:pb-0 md:h-12 -mt-1">
                {[
                    { id: 'home', label: txt.home, icon: Icons.Book },
                    { id: 'subjects', label: txt.subjects, icon: Icons.Brain },
                    { id: 'ai-tools', label: txt.aiTools, icon: Icons.Bot },
                    { id: 'roadmap', label: txt.roadmap, icon: Icons.Map },
                    { id: 'contact', label: txt.contact, icon: Icons.Telegram } 
                ].map(item => (
                    <button 
                        key={item.id}
                        onClick={() => {
                            if (item.id === 'contact') {
                                const footer = document.getElementById('contact-section');
                                if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                                else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                            } else {
                                setView(item.id as ViewState);
                                setSelectedSubject(null);
                            }
                        }}
                        className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                            view === item.id 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100')
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    </header>
  );

  const renderFooter = () => (
      <footer id="contact-section" className={`py-12 px-4 border-t ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-tl-xl rounded-br-xl flex items-center justify-center text-white font-brand font-bold">V</div>
                      <span className={`text-lg font-brand font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Vidyunmesā EduWorld</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6 opacity-80 max-w-sm">{txt.intro}</p>
                  <div className="flex gap-3">
                      {socialLinks.map(link => (
                          <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-white hover:bg-slate-200 text-indigo-600 shadow-sm'}`}>
                              {link.platform === 'Telegram' && <Icons.Telegram />}
                              {link.platform === 'YouTube' && <Icons.YouTube />}
                              {link.platform === 'Instagram' && <Icons.Instagram />}
                          </a>
                      ))}
                  </div>
              </div>
              
              <div>
                  <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{txt.platform}</h4>
                  <ul className="space-y-2 text-sm">
                      <li><button onClick={() => setView('subjects')} className="hover:underline">{txt.subjects}</button></li>
                      <li><button onClick={() => setView('ai-tools')} className="hover:underline">{txt.aiTools}</button></li>
                      <li><button onClick={() => setView('roadmap')} className="hover:underline">{txt.roadmap}</button></li>
                      <li>
                          <button onClick={() => {
                              if(isAdminSession) setView('admin');
                              else setShowAdminLogin(true);
                          }} className="text-red-500 font-bold hover:underline">{txt.adminLogin}</button>
                      </li>
                  </ul>
              </div>

              <div>
                  <h4 className={`font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500`}>{txt.legal}</h4>
                  <ul className="space-y-2 text-sm">
                      <li>Privacy Policy</li>
                      <li>Terms of Service</li>
                      <li>Cookie Policy</li>
                  </ul>
              </div>
          </div>
          <div className="text-center text-xs mt-12 pt-8 border-t border-slate-200/10 opacity-50">
              {txt.copyright}
          </div>
      </footer>
  );

  // --- Views ---

  const renderHome = () => (
      <main className="animate-fade-in">
          {/* Hero */}
          <section className="relative pt-12 pb-20 px-4 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 border shadow-sm ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-300 border-indigo-800' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                  🚀 {txt.tagline}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600`}>Study Smart, Practice Better</span>
                  <br />
                  <span className="font-brand text-3xl md:text-5xl text-slate-400 mt-2 block">{txt.withBrand}</span>
              </h2>
              <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {txt.intro}
              </p>
              <div className="flex flex-col items-center gap-4">
                  <button 
                      onClick={() => setView('subjects')}
                      className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform hover:shadow-2xl"
                  >
                      {txt.startLearning}
                  </button>
                  <button 
                      onClick={() => setView('ai-tools')}
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                      <span>🧠 {txt.tryAI}</span>
                  </button>
              </div>
          </section>

          {/* Features Grid */}
          <section className="max-w-5xl mx-auto px-4 py-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                      { id: 'subjects', label: txt.curatedSubjects, icon: Icons.Book, color: 'bg-blue-50 text-blue-600', grad: 'from-blue-500 to-indigo-500' },
                      { id: 'ai-tools', label: txt.aiQuizMaker, icon: Icons.Brain, color: 'bg-purple-50 text-purple-600', grad: 'from-purple-500 to-pink-500' },
                      { id: 'ai-tools', label: txt.examSathi, icon: Icons.Bot, color: 'bg-amber-50 text-amber-600', grad: 'from-amber-500 to-orange-500' },
                      { id: 'roadmap', label: txt.examRoadmap, icon: Icons.Map, color: 'bg-emerald-50 text-emerald-600', grad: 'from-emerald-500 to-teal-500' }
                  ].map((item, i) => (
                      <div 
                          key={i} 
                          onClick={() => setView(item.id as ViewState)}
                          className={`group cursor-pointer relative p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}
                      >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${item.color}`}>
                              <item.icon />
                          </div>
                          <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{item.label}</h3>
                          <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${item.grad}`}></div>
                      </div>
                  ))}
              </div>
          </section>
      </main>
  );

  const renderSubjects = () => {
      if (selectedSubject === "Pharmacy Exams" && !selectedPharmacySub) {
          // Pharmacy Hub View
          return (
              <div className="max-w-6xl mx-auto p-4 animate-fade-in min-h-screen">
                  <button onClick={() => setSelectedSubject(null)} className="mb-6 flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                      ← {txt.back}
                  </button>
                  
                  <div className="text-center mb-10">
                      <span className="text-4xl mb-4 block">💊</span>
                      <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{txt.pharmacyHub}</h2>
                      <p className="text-slate-500">{txt.selectCategory}</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                      {PHARMACY_SUBS.map((sub) => (
                          <div 
                              key={sub} 
                              onClick={() => setSelectedPharmacySub(sub)}
                              className={`p-6 rounded-2xl border cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-slate-700'}`}
                          >
                              <h3 className="font-bold text-lg">{sub}</h3>
                          </div>
                      ))}
                  </div>
              </div>
          );
      }

      if (!selectedSubject) {
          // Main Categories View
          return (
              <div className="max-w-6xl mx-auto p-4 animate-fade-in min-h-screen">
                  <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{txt.curatedSubjects}</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                      {Object.entries(SUBJECT_CATEGORIES).map(([name, meta]) => (
                          <div 
                              key={name}
                              onClick={() => setSelectedSubject(name)}
                              className={`p-6 rounded-3xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center gap-3 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                          >
                              <span className="text-4xl mb-2">{meta.icon}</span>
                              <h3 className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{name}</h3>
                          </div>
                      ))}
                  </div>

                  {/* Global Search Bar */}
                  <div className="max-w-xl mx-auto mb-8 relative">
                      <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={txt.searchPlaceholder}
                          className={`w-full pl-12 pr-4 py-4 rounded-full shadow-sm focus:ring-2 outline-none transition-all ${theme === 'dark' ? 'bg-slate-800 text-white focus:ring-indigo-500' : 'bg-white text-slate-900 border border-slate-200 focus:ring-indigo-200'}`}
                      />
                      <svg className="absolute left-4 top-4 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>

                  {/* Recent / All Notes List */}
                  <div className="space-y-4">
                      <h3 className={`font-bold text-lg px-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{searchQuery ? 'Search Results' : txt.recentUploads}</h3>
                      {filteredNotes.length === 0 ? (
                          <div className="text-center py-10 text-slate-400 italic">No notes found. Try adjusting filters.</div>
                      ) : (
                          filteredNotes.map(note => {
                              const displayNote = language === 'hi' && note.smartContentHindi ? note.smartContentHindi : (note.smartContent || note);
                              const title = displayNote.title || note.title;
                              const isAlternate = note.id % 2 === 0; // Simple alternation logic

                              return (
                                  <div 
                                      key={note.id} 
                                      className={`group flex items-center justify-between p-5 rounded-2xl border transition-all hover:shadow-md ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                                              {SUBJECT_CATEGORIES[note.subject]?.icon || '📄'}
                                          </div>
                                          <div>
                                              <h4 className={`font-bold text-lg ${isAlternate ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600' : (theme === 'dark' ? 'text-white' : 'text-slate-900')}`}>
                                                  {title}
                                              </h4>
                                              <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                                  <span className="flex items-center gap-1">⏱️ {note.time}</span>
                                                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border dark:border-slate-600">{note.subject}</span>
                                                  {note.isPrivate && <span className="text-red-500 font-bold">🔒 Private</span>}
                                              </div>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={() => setActiveNote(note)}
                                          className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'}`}
                                      >
                                          {txt.readNote}
                                      </button>
                                  </div>
                              );
                          })
                      )}
                  </div>
              </div>
          );
      }

      // Specific Subject View (Notes List)
      return (
          <div className="max-w-5xl mx-auto p-4 animate-fade-in min-h-screen">
              <div className="flex items-center justify-between mb-8">
                  <button onClick={() => {
                      if(selectedPharmacySub) setSelectedPharmacySub(null);
                      else setSelectedSubject(null);
                  }} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                      ← {txt.back}
                  </button>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {selectedPharmacySub || selectedSubject} <span className="text-slate-400 text-lg font-normal">Library</span>
                  </h2>
              </div>

              <div className="space-y-4">
                  {filteredNotes.map(note => (
                      <div key={note.id} className={`p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                          <div className="flex justify-between items-start">
                              <div>
                                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{(language === 'hi' && note.smartContentHindi?.title) || note.title}</h3>
                                  <div className="flex gap-2 text-sm text-slate-500">
                                      <span>⏱️ {note.time}</span>
                                      {note.youtubeUrl && <span className="text-red-500 font-bold">• 📺 Video Class</span>}
                                  </div>
                              </div>
                              <button 
                                  onClick={() => setActiveNote(note)}
                                  className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg"
                              >
                                  Read Now
                              </button>
                          </div>
                      </div>
                  ))}
                  {filteredNotes.length === 0 && (
                      <div className="text-center py-20">
                          <span className="text-4xl block mb-4">📭</span>
                          <p className="text-slate-500">No notes available in this category yet.</p>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  // --- Main Render ---
  const bgClass = theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-[#f8f9fa] text-slate-900';

  return (
    <ErrorBoundary>
      <div className={`min-h-screen font-sans ${bgClass} transition-colors duration-300`}>
        
        {/* ADMIN LOGIN MODAL */}
        {showAdminLogin && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">🛡️</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{txt.adminLogin}</h2>
                    <p className="text-slate-500 text-sm mb-6">Secure Area. Authorized Personnel Only.</p>
                    <input 
                        type="password" 
                        value={adminPassInput}
                        onChange={(e) => setAdminPassInput(e.target.value)}
                        placeholder={txt.enterPass}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-lg mb-4 focus:ring-2 focus:ring-slate-900 outline-none text-slate-900"
                    />
                    <div className="flex gap-3">
                        <button onClick={() => setShowAdminLogin(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">{txt.back}</button>
                        <button onClick={handleAdminLogin} className="flex-1 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg">{txt.access}</button>
                    </div>
                </div>
            </div>
        )}

        {/* ACTIVE NOTE READER OVERLAY */}
        {activeNote ? (
            <SmartNoteReader 
                note={activeNote} 
                onBack={() => setActiveNote(null)} 
                language={language} 
                canPlayAudio={
                    audioAccessLevel === 'public' || 
                    (audioAccessLevel === 'admin' && isAdminSession)
                }
            />
        ) : (
            <>
                {renderHeader()}
                
                <div className="min-h-[calc(100vh-300px)]">
                    {view === 'home' && renderHome()}
                    {view === 'subjects' && renderSubjects()}
                    {view === 'ai-tools' && <AIToolsPanel onBack={() => setView('home')} language={language} theme={theme} />}
                    {view === 'roadmap' && <RoadmapPanel onBack={() => setView('home')} language={language} />}
                    {view === 'admin' && isAdminSession && (
                        <AdminPanel 
                            notes={customNotes} 
                            onAddNote={handleAddNote} 
                            onDeleteNote={handleDeleteNote}
                            onEditNote={handleEditNote}
                            socialLinks={socialLinks}
                            onUpdateSocialLinks={saveSocialLinks}
                            onBack={() => { setView('home'); setIsAdminSession(false); }} // Auto-lock on exit
                            language={language}
                            theme={theme}
                            audioAccessLevel={audioAccessLevel}
                            onUpdateAudioAccessLevel={updateAudioLevel}
                        />
                    )}
                </div>

                {view !== 'ai-tools' && view !== 'admin' && renderFooter()}
                
                {/* GLOBAL FOCUS TIMER WIDGET */}
                <div className="fixed bottom-6 right-6 z-40 hidden md:block">
                    <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all hover:scale-105 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-white'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <span className={`font-mono font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>25:00</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 text-center">Focus Mode</div>
                    </div>
                </div>
            </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;