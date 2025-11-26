
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
  Drive: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M12 7v10"/><path d="M8 11l4-4 4 4"/></svg>,
  Sparkle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/></svg>,
  Admin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  YouTube: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>,
  Email: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Bot: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 9a1 1 0 0 1 0 2 1 1 0 0 1 0-2zm0-5a3 3 0 0 1 1 2.829l-.112.17L12 11.5l-.888-.499.112-.171A1 1 0 0 0 12 8z"/></svg>,
  Map: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Instagram: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  Globe: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Trophy: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Maximize: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Minimize: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="3" x2="21" y2="3"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Pill: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>,
  Pen: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
};

// --- SUBJECT CONSTANTS ---
export const PHARMACY_SUBS = [
    "Pharmacology", "Pharmaceutics", "Pharmaceutical Jurisprudence",
    "Pharmacognosy", "Pharmaceutical Chemistry", "Pharmaceutical Analysis",
    "Physical Pharmacy", "Other Subjects"
];

export const SUBJECT_CATEGORIES = {
    "Polity": { icon: "🏛️", colorLight: "bg-rose-100 text-rose-600", colorDark: "bg-rose-900/40 text-rose-400" },
    "History": { icon: "📜", colorLight: "bg-amber-100 text-amber-600", colorDark: "bg-amber-900/40 text-amber-400" },
    "Science": { icon: "🧬", colorLight: "bg-cyan-100 text-cyan-600", colorDark: "bg-cyan-900/40 text-cyan-400" },
    "Geography": { icon: "🌍", colorLight: "bg-emerald-100 text-emerald-600", colorDark: "bg-emerald-900/40 text-emerald-400" },
    "English": { icon: "🔡", colorLight: "bg-violet-100 text-violet-600", colorDark: "bg-violet-900/40 text-violet-400" },
    "Current": { icon: "⚡", colorLight: "bg-yellow-100 text-yellow-700", colorDark: "bg-yellow-900/40 text-yellow-400" },
    "Pharmacy Exams": { icon: "💊", colorLight: "bg-blue-100 text-blue-600", colorDark: "bg-blue-900/40 text-blue-400" }
};

// --- COMPREHENSIVE TRANSLATION DICTIONARY ---
const translations = {
  en: {
    heroTitle: "Organized Notes & Practice for",
    heroSubtitle: "SSC, Railway & State Exams",
    heroTagline: "Study smart, practice better!",
    heroBrand: "with Vidyunmesā EduWorld",
    heroDesc: "Organized notes, smart quizzes, clear roadmaps — your exam companion.",
    startLearning: "Start Learning",
    aiToolsBtn: "Try AI Tools For Practice",
    subjects: "Curated Subjects",
    subjectsDesc: "Ultra-lightweight, structured notes with tables and lists.",
    quizMaker: "AI Quiz Maker",
    quizDesc: "Practice endlessly with AI-generated questions.",
    examSathi: "Vidyunmesā Exam Sathi Pro",
    sathiDesc: "24/7 Doubt solving chatbot for instant concept clarity.",
    roadmap: "Roadmap Strategy",
    roadmapDesc: "Step-by-step curated plans for SSC, Railway & State Exams.",
    libTitle: "Subject Library",
    libSub: "Select a category to view notes",
    recentUploads: "Recent Uploads",
    searchResults: "Search Results",
    noResults: "No results found for",
    emptyLib: "Library is empty. Time to create content!",
    searchPlaceholder: "Search topics...",
    clearSearch: "Clear Search",
    navHome: "Home",
    navSub: "Subjects",
    navAI: "AI Tools",
    navRoad: "Roadmap",
    navContact: "Contact",
    focusMode: "Focus Mode",
    breakTime: "Break Time",
    admin: "Admin Panel",
    subjectPolity: "Polity",
    subjectHistory: "History",
    subjectScience: "Science",
    subjectCurrent: "Current Affairs",
    subjectGeography: "Geography",
    subjectEnglish: "English",
    subjectPharmacy: "Pharmacy Exams",
    smartNote: "Smart Note",
    file: "File",
    telegram: "Telegram",
    platform: "Platform",
    legal: "Legal & Support",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    backToSub: "Back to Subjects",
    backToMain: "Back to All Categories"
  },
  hi: {
    heroTitle: "SSC, Railway और State Exams के लिए",
    heroSubtitle: "व्यवस्थित नोट्स और प्रैक्टिस",
    heroTagline: "सही पढ़ें, बेहतर अभ्यास करें!",
    heroBrand: "Vidyunmesā EduWorld के साथ",
    heroDesc: "व्यवस्थित नोट्स, स्मार्ट क्विज़ और स्पष्ट रोडमैप — आपका एग्जाम साथी।",
    startLearning: "पढ़ाई शुरू करें",
    aiToolsBtn: "प्रैक्टिस के लिए AI Tools",
    subjects: "क्यूरेटेड विषय (Subjects)",
    subjectsDesc: "टेबल्स और लिस्ट के साथ स्ट्रक्चर्ड, हल्के नोट्स।",
    quizMaker: "AI Quiz Maker",
    quizDesc: "AI द्वारा बनाए गए अनंत सवालों से अभ्यास करें।",
    examSathi: "Vidyunmesā Exam साथी प्रो",
    sathiDesc: "कॉन्सेप्ट्स क्लियर करने के लिए 24/7 डाउट सॉल्विंग चैटबॉट।",
    roadmap: "रोडमैप स्ट्रेटेजी",
    roadmapDesc: "SSC, Railway और State Exams के लिए चरण-दर-चरण योजना।",
    libTitle: "विषय पुस्तकालय",
    libSub: "नोट्स देखने के लिए एक श्रेणी चुनें",
    recentUploads: "हाल ही में अपलोड किए गए",
    searchResults: "सर्च परिणाम",
    noResults: "कोई परिणाम नहीं मिला:",
    emptyLib: "लाइब्रेरी खाली है। कंटेंट बनाने का समय!",
    searchPlaceholder: "टॉपिक खोजें...",
    clearSearch: "सर्च हटाएं",
    navHome: "होम",
    navSub: "विषय",
    navAI: "AI टूल्स",
    navRoad: "रोडमैप",
    navContact: "संपर्क",
    focusMode: "फोकस मोड",
    breakTime: "ब्रेक टाइम",
    admin: "एडमिन पैनल",
    subjectPolity: "राजव्यवस्था",
    subjectHistory: "इतिहास",
    subjectScience: "विज्ञान",
    subjectCurrent: "करंट अफेयर्स",
    subjectGeography: "भूगोल",
    subjectEnglish: "अंग्रेजी",
    subjectPharmacy: "फार्मेसी परीक्षा",
    smartNote: "स्मार्ट नोट",
    file: "फाइल",
    telegram: "टेलीग्राम",
    platform: "प्लेटफ़ॉर्म",
    legal: "कानूनी और सहायता",
    privacy: "गोपनीयता नीति",
    terms: "सेवा की शर्तें",
    backToSub: "वापस विषयों पर जाएं",
    backToMain: "सभी श्रेणियों पर वापस जाएं"
  }
};

// --- Future Proofing: Error Boundary ---
interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real app, log this to a service like Sentry
    // console.error("Uncaught error:", error, errorInfo); 
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-4 text-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
            <p className="text-slate-500 mb-4">Please refresh the page to continue learning.</p>
            <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors">
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Ad Placeholder ---
const AdPlaceholder: React.FC<{ id: string; className?: string }> = ({ id, className = "" }) => (
  <div id={id} className={`w-full bg-white/50 backdrop-blur-sm border border-dashed border-indigo-200 rounded-2xl text-indigo-300 text-xs flex items-center justify-center py-6 ${className}`}>
    Advertisement Space ({id})
  </div>
);

// --- FOCUS TIMER (POMODORO) COMPONENT ---
const PomodoroTimer: React.FC<{ theme: Theme; onClose: () => void; labels: any }> = ({ theme, onClose, labels }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        if("Notification" in window && Notification.permission === "granted") {
            new Notification("Focus time over! Take a break. ☕");
        } else {
            // alert("Focus time over! Take a break. ☕");
        }
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        // alert("Break over! Back to work. 🚀");
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  if (isMinimized) {
      return (
          <div className="fixed bottom-20 right-4 z-[100] transition-all duration-300 animate-float">
             <button 
                onClick={() => setIsMinimized(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl border-2 font-bold backdrop-blur-xl transition-all hover:scale-105 ${isActive ? 'animate-pulse' : ''} ${theme === 'dark' ? 'bg-slate-800 border-cyan-500 text-cyan-400 shadow-cyan-900/50' : 'bg-white border-indigo-500 text-indigo-600 shadow-indigo-200'}`}
             >
                 <Icons.Clock />
                 <span className="font-mono text-base">{formatTime(timeLeft)}</span>
             </button>
          </div>
      );
  }

  return (
    <div className={`fixed bottom-20 right-4 z-[100] p-4 w-72 rounded-2xl shadow-2xl border backdrop-blur-md transition-all animate-fade-in ${theme === 'dark' ? 'bg-slate-900/95 border-cyan-900 text-cyan-100 shadow-black/80' : 'bg-white/95 border-indigo-100 text-slate-800 shadow-indigo-100'}`}>
       <div className="flex items-center justify-between gap-2 mb-4 border-b pb-3 border-current border-opacity-10">
          <span className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
            {mode === 'focus' ? `🔥 ${labels.focusMode}` : `☕ ${labels.breakTime}`}
          </span>
          <div className="flex gap-1">
             <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-black/5 rounded-lg transition-colors" title="Minimize"><Icons.Minimize /></button>
             <button onClick={onClose} className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold" title="Close">✕</button>
          </div>
       </div>
       
       <div className="text-6xl font-mono font-bold mb-6 text-center tracking-wider tabular-nums">
          {formatTime(timeLeft)}
       </div>
       
       <div className="flex gap-3 justify-center">
          <button onClick={toggleTimer} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors shadow-sm active:scale-95 ${isActive ? 'bg-red-100 text-red-600' : (theme === 'dark' ? 'bg-cyan-600 text-white' : 'bg-indigo-600 text-white')}`}>
             {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer} className={`flex-1 py-3 text-sm font-bold rounded-xl border active:scale-95 ${theme === 'dark' ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
             Reset
          </button>
       </div>
    </div>
  );
};

const SubjectCard: React.FC<{ title: string; icon: React.ReactNode; color: string; onClick: () => void; isGradient?: boolean; theme: Theme }> = ({ title, icon, color, onClick, isGradient = false, theme }) => (
  <div 
    onClick={onClick} 
    className={`group relative backdrop-blur-md p-6 rounded-2xl border shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2 overflow-hidden ${theme === 'dark' ? 'bg-slate-800/60 border-cyan-900/30 shadow-black/50 hover:shadow-cyan-900/20' : 'bg-white/70 border-white/50 shadow-slate-200/50 hover:shadow-indigo-200/40'}`}
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20' : 'bg-gradient-to-br from-indigo-50/0 to-indigo-50/50'}`} />
    
    <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 ${color}`}>
      {icon}
    </div>
    <h3 className={`relative z-10 font-bold text-lg group-hover:opacity-80 transition-all ${isGradient ? (theme === 'dark' ? 'text-cyan-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600') : (theme === 'dark' ? 'text-slate-100' : 'text-slate-900')}`}>{title}</h3>
    <p className={`relative z-10 text-sm mt-2 group-hover:text-slate-400 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Notes • Practice</p>
    
    <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ${theme === 'dark' ? 'bg-cyan-900/30' : 'bg-gradient-to-br from-slate-100 to-transparent'}`} />
  </div>
);

const getLinkDetails = (url: string | undefined, labels: any) => {
  if (!url) return { icon: <Icons.Sparkle />, text: labels.smartNote, color: "text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100", type: "smart" };
  
  if (url.includes('t.me') || url.includes('telegram')) {
    return { icon: <Icons.Telegram />, text: labels.telegram, color: "text-sky-500 bg-sky-50 border-sky-100 hover:bg-sky-100", type: "external" };
  } else if (url.includes('drive.google.com')) {
    return { icon: <Icons.Drive />, text: "PDF", color: "text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100", type: "external" };
  }
  return { icon: <Icons.Download />, text: labels.file, color: "text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100", type: "external" };
};

const Footer: React.FC<{ setView: (v: ViewState) => void; theme: Theme; socialLinks: SocialLink[]; labels: any }> = ({ setView, theme, socialLinks, labels }) => (
  <footer id="contact-section" className={`border-t pt-16 pb-8 mt-20 relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
     <div className={`absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full blur-3xl -z-0 ${theme === 'dark' ? 'bg-cyan-900/20' : 'bg-indigo-50/50'}`}></div>

     <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-4 gap-10 relative z-10">
        <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md shadow-md"></div>
                    <span className="relative text-white font-brand font-bold text-2xl italic pt-0.5">V</span>
                </div>
                <h2 className={`font-brand font-bold text-2xl ${theme === 'dark' ? 'text-cyan-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'}`}>Vidyunmesā EduWorld</h2>
            </div>
            <p className={`text-sm leading-relaxed max-w-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Empowering India's aspirants with <strong>AI-driven clarity</strong>. 
            </p>
            <div className="flex gap-3 pt-2 flex-wrap">
                {socialLinks.map(link => {
                   const btnClass = theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:bg-cyan-900 hover:text-cyan-400' : 'bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600';
                   const IconComp = (Icons as any)[link.platform] || Icons.Globe;
                   return (
                       <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className={`p-2 rounded-full transition-colors ${btnClass}`} title={link.label}>
                           <IconComp />
                       </a>
                   )
                })}
            </div>
        </div>

        <div>
            <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{labels.platform}</h3>
            <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                <li><button onClick={() => setView('home')} className="hover:text-indigo-600 transition-colors">{labels.navHome}</button></li>
                <li><button onClick={() => setView('subjects')} className="hover:text-indigo-600 transition-colors">{labels.libTitle}</button></li>
                <li><button onClick={() => setView('ai-tools')} className="hover:text-indigo-600 transition-colors">{labels.navAI}</button></li>
                <li><button onClick={() => setView('roadmap')} className="hover:text-indigo-600 transition-colors">{labels.navRoad}</button></li>
                <li><button onClick={() => setView('admin')} className="hover:text-indigo-600 transition-colors flex items-center gap-1"><Icons.Admin /> {labels.admin}</button></li>
            </ul>
        </div>

        <div>
            <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'}`}>{labels.legal}</h3>
            <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">{labels.privacy}</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">{labels.terms}</a></li>
            </ul>
        </div>
     </div>

     <div className={`max-w-5xl mx-auto px-4 mt-12 pt-8 border-t text-center ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
        <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} <span className={`font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Vidyunmesā EduWorld</span>. All rights reserved.
        </p>
     </div>
  </footer>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [activeNote, setActiveNote] = useState<LibraryItem | null>(null);
  const [notesLibrary, setNotesLibrary] = useState<LibraryItem[]>([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');

  const [userXP, setUserXP] = useState(0);
  const [showPomodoro, setShowPomodoro] = useState(false);

  // --- ADMIN SECURITY & AUDIO STATE ---
  const ADMIN_PASSWORD = "!@#$%";
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [audioAccessLevel, setAudioAccessLevel] = useState<'locked' | 'admin' | 'public'>('locked');

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
      { id: '1', platform: 'Telegram', url: '#', label: 'Join Channel' },
      { id: '2', platform: 'YouTube', url: '#', label: 'Subscribe' },
      { id: '3', platform: 'Email', url: '#', label: 'Email Us' }
  ]);

  useEffect(() => {
      const xp = localStorage.getItem('vidyunmesa_xp');
      if (xp) setUserXP(parseInt(xp));
      
      const savedLevel = localStorage.getItem('audio_access_level');
      if (savedLevel && ['locked', 'admin', 'public'].includes(savedLevel)) {
          setAudioAccessLevel(savedLevel as any);
      }
  }, []);

  const handleAddXP = (amount: number) => {
      const newXP = userXP + amount;
      setUserXP(newXP);
      localStorage.setItem('vidyunmesa_xp', newXP.toString());
  };

  const handleSetAudioAccessLevel = (level: 'locked' | 'admin' | 'public') => {
      setAudioAccessLevel(level);
      localStorage.setItem('audio_access_level', level);
  };

  const handleAdminLogin = () => {
      if (adminPasswordInput === ADMIN_PASSWORD) {
          setIsAdminSession(true);
          setAdminPasswordInput("");
      } else {
          alert("Incorrect Password. Access Denied.");
          setAdminPasswordInput("");
      }
  };

  const getLevel = (xp: number) => {
      if (xp < 100) return "Novice";
      if (xp < 500) return "Apprentice";
      if (xp < 1000) return "Scholar";
      return "Grandmaster";
  };

  const canPlayAudio = useMemo(() => {
      if (audioAccessLevel === 'public') return true;
      if (audioAccessLevel === 'admin' && isAdminSession) return true;
      return false;
  }, [audioAccessLevel, isAdminSession]);

  const themeColors = {
     bg: theme === 'dark' ? 'bg-slate-950' : 'bg-[#f8f9fc]',
     text: theme === 'dark' ? 'text-slate-100' : 'text-slate-900',
     subText: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
     cardBg: theme === 'dark' ? 'bg-slate-900/70 border-cyan-900/30 text-slate-100' : 'bg-white/60 border-white/60 text-slate-900',
     headerBg: theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200/60',
     navBtn: theme === 'dark' ? 'text-slate-300 hover:text-cyan-400' : 'text-slate-500 hover:text-slate-800',
     navBtnActive: theme === 'dark' ? 'bg-slate-800 text-cyan-400 shadow-cyan-900/20' : 'bg-white text-indigo-600 shadow-sm',
     gradientText: theme === 'dark' ? 'text-cyan-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
     primaryBtn: theme === 'dark' ? 'bg-cyan-600 text-white shadow-cyan-900/50 hover:bg-cyan-500' : 'bg-slate-900 text-white shadow-slate-300 hover:shadow-slate-400',
     aiBtn: theme === 'dark' ? 'from-cyan-800 to-blue-900' : 'from-indigo-600 via-purple-600 to-pink-600',
     heroBtnLight: 'bg-blue-600 text-white shadow-blue-300 hover:bg-blue-700',
     heroAccentLight: 'text-yellow-500'
  };

  const txt = translations[language];

  useEffect(() => {
    const loadData = () => {
        try {
            const localCustomStr = localStorage.getItem('custom_notes');
            const localDeletedStr = localStorage.getItem('deleted_ids');

            const localCustomNotes: LibraryItem[] = localCustomStr ? JSON.parse(localCustomStr) : [];
            const deletedIds: number[] = localDeletedStr ? JSON.parse(localDeletedStr).map(Number) : [];

            const masterMap = new Map<number, LibraryItem>();

            STATIC_NOTES.forEach(note => {
                masterMap.set(Number(note.id), note);
            });

            localCustomNotes.forEach(note => {
                masterMap.set(Number(note.id), note);
            });

            deletedIds.forEach(delId => {
                if (masterMap.has(delId)) {
                    masterMap.delete(delId);
                }
            });

            const finalLibrary = Array.from(masterMap.values()).sort((a, b) => Number(b.id) - Number(a.id));
            
            setNotesLibrary(finalLibrary);
        } catch (error) {
            // Fallback to static if everything crashes
            setNotesLibrary(STATIC_NOTES); 
        }
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const openNote = (note: LibraryItem) => {
    if (note.pdfUrl) {
      window.open(note.pdfUrl, '_blank');
    } else {
      setActiveNote(note);
      setView('reader');
    }
  };

  const handleAddNote = (newNote: LibraryItem) => {
    setNotesLibrary(prev => [newNote, ...prev]);
    const currentCustomNotes = localStorage.getItem('custom_notes');
    const parsedCustom = currentCustomNotes ? JSON.parse(currentCustomNotes) : [];
    const newCustom = [newNote, ...parsedCustom];
    localStorage.setItem('custom_notes', JSON.stringify(newCustom));
    setView('subjects');
  };

  const handleEditNote = (updatedNote: LibraryItem) => {
      setNotesLibrary(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
      const currentCustomNotes = JSON.parse(localStorage.getItem('custom_notes') || '[]');
      const index = currentCustomNotes.findIndex((n: LibraryItem) => n.id === updatedNote.id);
      if (index !== -1) {
          currentCustomNotes[index] = updatedNote;
      } else {
          currentCustomNotes.unshift(updatedNote);
      }
      localStorage.setItem('custom_notes', JSON.stringify(currentCustomNotes));
      
      const deletedIds = JSON.parse(localStorage.getItem('deleted_ids') || '[]');
      if (deletedIds.includes(updatedNote.id)) {
          const newDeleted = deletedIds.filter((id: number) => id !== updatedNote.id);
          localStorage.setItem('deleted_ids', JSON.stringify(newDeleted));
      }
  };

  const handleDeleteNote = (id: number) => {
    const targetId = Number(id);
    setNotesLibrary(prev => prev.filter(n => Number(n.id) !== targetId));
    const currentDeleted = JSON.parse(localStorage.getItem('deleted_ids') || '[]');
    const newDeleted = [...new Set([...currentDeleted, targetId])];
    localStorage.setItem('deleted_ids', JSON.stringify(newDeleted));
    const currentCustom = JSON.parse(localStorage.getItem('custom_notes') || '[]');
    const newCustom = currentCustom.filter((n: any) => Number(n.id) !== targetId);
    localStorage.setItem('custom_notes', JSON.stringify(newCustom));
  };

  const handleUpdateSocialLinks = (newLinks: SocialLink[]) => {
      setSocialLinks(newLinks);
      localStorage.setItem('social_links', JSON.stringify(newLinks));
  }

  const filteredNotes = useMemo(() => {
      return notesLibrary.filter(note => {
          if (note.isPrivate === true && !isAdminSession) {
              return false;
          }
          if (activeSubCategory) {
              if (note.subject !== activeSubCategory) return false;
          } else if (activeCategory) {
              if (activeCategory === 'Pharmacy Exams') {
                  if (note.subject !== 'Pharmacy Exams' && !PHARMACY_SUBS.includes(note.subject)) return false;
              } else {
                  if (note.subject !== activeCategory) return false;
              }
          }
          const q = searchQuery.toLowerCase();
          const title = (note.title || "").toLowerCase();
          const subj = (note.subject || "").toLowerCase();
          const hiTitle = (note.smartContentHindi?.title || "").toLowerCase();
          
          return title.includes(q) || subj.includes(q) || hiTitle.includes(q);
      });
  }, [notesLibrary, searchQuery, isAdminSession, activeCategory, activeSubCategory]);

  const navItems = [
    { id: 'home', label: txt.navHome },
    { id: 'subjects', label: txt.navSub },
    { id: 'ai-tools', label: txt.navAI },
    { id: 'roadmap', label: txt.navRoad },
    { id: 'contact', label: txt.navContact }
  ];

  const renderHeader = () => (
    <div className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b shadow-sm transition-all ${themeColors.headerBg}`}>
        <div className="max-w-5xl mx-auto px-4">
            <header className="flex items-center justify-between py-3 gap-2">
                <div className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0" onClick={() => setView('home')}>
                    <div className="relative w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md shadow-lg shadow-indigo-200/50 rotate-3 group-hover:rotate-6 transition-transform"></div>
                        <span className="relative text-white font-brand font-bold text-xl md:text-3xl italic pr-0.5 pb-0.5">V</span>
                    </div>
                    <div className="flex flex-col justify-center -space-y-1">
                        <h1 className={`font-brand font-bold text-xl md:text-3xl tracking-wide group-hover:opacity-90 transition-opacity ${themeColors.gradientText}`}>Vidyunmesā</h1>
                        <span className={`font-brand text-[10px] md:text-lg font-medium tracking-wide hidden xs:inline-block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900'}`}>EduWorld</span>
                    </div>
                </div>

                <nav className={`hidden md:flex items-center gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/50 border-slate-200/50'}`}>
                    {navItems.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => {
                              if (item.id === 'contact') {
                                 if (view === 'admin' || view === 'reader') {
                                    setView('home');
                                    setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                                 } else {
                                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                                 }
                              } else if (item.id === 'home' || item.id === 'subjects' || item.id === 'ai-tools' || item.id === 'roadmap') {
                                setView(item.id as ViewState);
                                setActiveCategory(null); 
                                setActiveSubCategory(null);
                              }
                            }} 
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${view === item.id ? themeColors.navBtnActive : themeColors.navBtn}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                     <div className={`flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-full border text-[10px] md:text-xs font-bold shadow-sm transition-all ${theme === 'dark' ? 'bg-slate-800 border-amber-700/50 text-amber-400' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-orange-700'}`} title={`Level: ${getLevel(userXP)}`}>
                        <Icons.Trophy /> 
                        <span>{userXP}<span className="hidden sm:inline"> XP</span></span>
                     </div>
                </div>
            </header>

            <nav className="md:hidden flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
                {navItems.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'contact') {
                             if (view === 'admin' || view === 'reader') {
                                setView('home');
                                setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                             } else {
                                document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                             }
                          } else if (item.id === 'home' || item.id === 'subjects' || item.id === 'ai-tools' || item.id === 'roadmap') {
                            setView(item.id as ViewState);
                            setActiveCategory(null);
                            setActiveSubCategory(null);
                          }
                        }} 
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 ${view === item.id ? 'bg-slate-900 text-white border-slate-900 shadow-md' : (theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    </div>
  );

  return (
    <ErrorBoundary>
    <div className={`min-h-screen font-sans relative overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-700 transition-colors duration-500 ${themeColors.bg} ${themeColors.text}`}>
      
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-60 bg-gradient-to-b ${theme === 'dark' ? 'from-cyan-900/20 to-transparent' : 'from-indigo-100/40 to-transparent'}`}></div>
          <div className={`absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-3xl opacity-40 animate-pulse-slow ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-amber-100/40'}`}></div>
      </div>
      
      {showPomodoro && <PomodoroTimer theme={theme} onClose={() => setShowPomodoro(false)} labels={{ focusMode: txt.focusMode, breakTime: txt.breakTime }} />}

      <div className="relative z-10 flex flex-col min-h-screen">
      
      {view !== 'admin' && view !== 'reader' && renderHeader()}

      <main className="max-w-5xl mx-auto px-4 flex-grow w-full pt-6 md:pt-8">
        
        {view === 'reader' && activeNote ? (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-[#fafbfc]'}`}>
                 <SmartNoteReader 
                  note={activeNote} 
                  onBack={() => setView('subjects')} 
                  language={language} 
                  onXPAdd={() => handleAddXP(20)} 
                  canPlayAudio={canPlayAudio}
                 />
            </div>
        ) : view === 'admin' ? (
            !isAdminSession ? (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <span className="text-3xl">🔒</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access Locked</h2>
                        <p className="text-slate-500 mb-6 text-sm">Enter the secure password to manage content.</p>
                        
                        <input 
                            type="password" 
                            value={adminPasswordInput}
                            onChange={(e) => setAdminPasswordInput(e.target.value)}
                            placeholder="Enter Admin Password"
                            className="w-full p-4 border border-slate-300 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none text-center text-lg font-bold tracking-widest"
                            onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                        />
                        
                        <div className="flex gap-3">
                            <button onClick={() => setView('home')} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleAdminLogin} className="flex-1 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg">
                                Unlock 🔓
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-[#f3f5f9] pb-12">
                     <div className="fixed inset-0 z-0 pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
                     </div>
                     <div className="relative z-10">
                        {renderHeader()}
                        <AdminPanel 
                            notes={notesLibrary} 
                            onAddNote={handleAddNote} 
                            onDeleteNote={handleDeleteNote}
                            onEditNote={handleEditNote}
                            socialLinks={socialLinks}
                            onUpdateSocialLinks={handleUpdateSocialLinks}
                            onBack={() => {
                                setIsAdminSession(false); 
                                setView('home');
                            }}
                            language={language}
                            theme={theme}
                            audioAccessLevel={audioAccessLevel}
                            onUpdateAudioAccessLevel={handleSetAudioAccessLevel}
                        />
                     </div>
                </div>
            )
        ) : view === 'home' ? (
          <div className="space-y-16">
            <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                <button
                  onClick={() => setShowPomodoro(!showPomodoro)}
                  className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-full text-sm font-bold border transition-all ${showPomodoro ? 'bg-red-100 text-red-600 border-red-200 shadow-inner' : (theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-600 hover:shadow-sm')}`}
                >
                   <Icons.Clock /> <span className="hidden xs:inline">{txt.focusMode}</span>
                </button>

                <button 
                  onClick={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
                  className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-full text-sm font-bold border transition-all ${theme === 'dark' ? 'border-cyan-800 bg-slate-900 text-cyan-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200'}`}
                >
                   <span>🌐</span> {language === 'en' ? 'हिन्दी' : 'EN'}
                </button>

                <button 
                  onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                  className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-full text-sm font-bold border transition-all ${theme === 'dark' ? 'border-yellow-600 bg-slate-900 text-yellow-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200'}`}
                >
                   {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>

            <div className="text-center space-y-8 py-6 md:py-12 relative">
               <div className="absolute top-10 left-10 animate-float hidden md:block text-4xl">📚</div>
               <div className="absolute bottom-10 right-10 animate-float hidden md:block text-4xl" style={{animationDelay: '1s'}}>🧪</div>

              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm mb-4 border ${theme === 'dark' ? 'bg-slate-900 border-cyan-900' : 'bg-white border-indigo-100'}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-cyan-400' : 'bg-indigo-500'}`}></span>
                <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-cyan-400' : 'text-indigo-600'}`}>AI-Powered Learning V2.0</span>
              </div>

              <h2 className={`text-4xl md:text-6xl font-extrabold leading-tight tracking-tight max-w-4xl mx-auto ${themeColors.text}`}>
                {txt.heroTitle} <br className="hidden md:block" />
                <span className={themeColors.gradientText}>{txt.heroSubtitle}</span>
              </h2>
              
              <div className={`text-xl md:text-3xl font-bold mt-4 flex flex-col items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                 <span>{txt.heroTagline}</span>
                 <span className={`text-2xl md:text-4xl font-brand ${themeColors.gradientText}`}>{txt.heroBrand}</span>
              </div>
              
              <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-6 ${themeColors.subText}`}>
                {txt.heroDesc}
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 pt-4">
                <button onClick={() => setView('subjects')} className={`group relative px-8 py-4 font-bold rounded-xl shadow-xl transition-all overflow-hidden ${theme === 'dark' ? 'bg-cyan-600 text-white hover:shadow-cyan-500/50' : 'bg-yellow-400 text-slate-900 hover:bg-yellow-300'}`}>
                   <span className="relative flex items-center gap-2"> <Icons.Book /> {txt.startLearning} <Icons.ArrowRight /></span>
                </button>
                
                <button onClick={() => setView('ai-tools')} className="group relative mt-4 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-r ${themeColors.aiBtn}`}></div>
                    <div className={`relative m-[2px] hover:bg-opacity-95 transition-all rounded-2xl px-8 py-3 flex items-center gap-3 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                        <span className="text-2xl animate-pulse">🧠</span>
                        <span className={`font-bold text-lg ${themeColors.gradientText}`}>{txt.aiToolsBtn}</span>
                    </div>
                </button>
              </div>
            </div>

            <AdPlaceholder id="home-banner-1" />

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                  { icon: <Icons.Book />, title: txt.subjects, desc: txt.subjectsDesc, color: theme === 'dark' ? "bg-indigo-900/40 text-indigo-400" : "bg-indigo-100 text-indigo-600", action: () => setView('subjects') },
                  { icon: <Icons.Brain />, title: txt.quizMaker, desc: txt.quizDesc, color: theme === 'dark' ? "bg-amber-900/40 text-amber-400" : "bg-amber-100 text-amber-600", action: () => setView('ai-tools') },
                  { icon: <Icons.Bot />, title: txt.examSathi, desc: txt.sathiDesc, color: theme === 'dark' ? "bg-purple-900/40 text-purple-400" : "bg-purple-100 text-purple-600", action: () => setView('ai-tools') },
                  { icon: <Icons.Map />, title: txt.roadmap, desc: txt.roadmapDesc, color: theme === 'dark' ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-100 text-emerald-600", action: () => setView('roadmap') }
              ].map((feature, i) => (
                  <div onClick={feature.action} key={i} className={`cursor-pointer backdrop-blur-md p-8 rounded-2xl shadow-sm border transition-all duration-300 group hover:shadow-md hover:-translate-y-1 ${themeColors.cardBg}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>{feature.icon}</div>
                    <h3 className={`text-xl font-bold mb-3 ${i % 2 === 0 ? themeColors.gradientText : themeColors.text}`}>{feature.title}</h3>
                    <p className={`leading-relaxed text-sm ${themeColors.subText}`}>{feature.desc}</p>
                  </div>
              ))}
            </div>
          </div>
        ) : view === 'subjects' ? (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    {activeSubCategory ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setActiveSubCategory(null)} className={`text-sm font-bold hover:underline ${theme === 'dark' ? 'text-cyan-400' : 'text-indigo-600'}`}>{activeCategory === 'Pharmacy Exams' ? (language === 'hi' ? "फार्मेसी" : "Pharmacy") : activeCategory}</button>
                            <span className="text-slate-400">/</span>
                            <h2 className={`text-3xl font-bold ${themeColors.gradientText}`}>{activeSubCategory}</h2>
                        </div>
                    ) : activeCategory ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setActiveCategory(null)} className={`text-sm font-bold hover:underline ${theme === 'dark' ? 'text-cyan-400' : 'text-indigo-600'}`}>{txt.navSub}</button>
                            <span className="text-slate-400">/</span>
                            <h2 className={`text-3xl font-bold ${themeColors.gradientText}`}>{activeCategory === 'Pharmacy Exams' ? (language === 'hi' ? "फार्मेसी परीक्षा" : "Pharmacy Exams") : (translations[language] as any)[`subject${activeCategory}`] || activeCategory}</h2>
                        </div>
                    ) : (
                        <>
                            <h2 className={`text-3xl font-bold ${themeColors.gradientText}`}>{txt.libTitle}</h2>
                            <p className={`mt-1 ${themeColors.subText}`}>{txt.libSub}</p>
                        </>
                    )}
                </div>
                
                <div className="relative w-full md:w-72">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Icons.Search />
                   </div>
                   <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={txt.searchPlaceholder} 
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-4 outline-none transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:ring-cyan-900' : 'bg-white/50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-50'}`}
                   />
                </div>
            </div>
            
            {!activeCategory && !searchQuery && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <SubjectCard theme={theme} title={txt.subjectPolity} icon={<span className="text-2xl">🏛️</span>} color={SUBJECT_CATEGORIES['Polity'].colorLight} onClick={() => setActiveCategory("Polity")} isGradient={true} />
                <SubjectCard theme={theme} title={txt.subjectHistory} icon={<span className="text-2xl">📜</span>} color={SUBJECT_CATEGORIES['History'].colorLight} onClick={() => setActiveCategory("History")} isGradient={false} />
                <SubjectCard theme={theme} title={txt.subjectScience} icon={<span className="text-2xl">🧬</span>} color={SUBJECT_CATEGORIES['Science'].colorLight} onClick={() => setActiveCategory("Science")} isGradient={true} />
                <SubjectCard theme={theme} title={txt.subjectGeography} icon={<span className="text-2xl">🌍</span>} color={SUBJECT_CATEGORIES['Geography'].colorLight} onClick={() => setActiveCategory("Geography")} isGradient={false} />
                <SubjectCard theme={theme} title={txt.subjectEnglish} icon={<span className="text-2xl">🔡</span>} color={SUBJECT_CATEGORIES['English'].colorLight} onClick={() => setActiveCategory("English")} isGradient={true} />
                <SubjectCard theme={theme} title={txt.subjectCurrent} icon={<span className="text-2xl">⚡</span>} color={SUBJECT_CATEGORIES['Current'].colorLight} onClick={() => setActiveCategory("Current")} isGradient={false} />
                <SubjectCard theme={theme} title={txt.subjectPharmacy} icon={<span className="text-2xl">💊</span>} color={SUBJECT_CATEGORIES['Pharmacy Exams'].colorLight} onClick={() => setActiveCategory("Pharmacy Exams")} isGradient={true} />
              </div>
            )}

            {activeCategory === 'Pharmacy Exams' && !activeSubCategory && !searchQuery && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                    {PHARMACY_SUBS.map((sub, idx) => (
                        <div 
                            key={sub} 
                            onClick={() => setActiveSubCategory(sub)}
                            className={`p-6 rounded-xl border shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center gap-3 ${theme === 'dark' ? 'bg-slate-800 border-cyan-900/30 text-cyan-100 hover:bg-slate-700' : 'bg-white border-indigo-50 text-slate-700 hover:border-indigo-200'}`}
                        >
                            <div className="text-3xl">{idx % 2 === 0 ? '🧪' : '💊'}</div>
                            <div className="font-bold text-sm">{sub}</div>
                        </div>
                    ))}
                </div>
            )}

            {(activeCategory || searchQuery) && (!activeCategory || activeCategory !== 'Pharmacy Exams' || activeSubCategory || searchQuery) && (
                <div className={`backdrop-blur-xl rounded-2xl shadow-lg border overflow-hidden animate-fade-in ${themeColors.cardBg}`}>
                    <div className={`px-6 py-5 border-b flex justify-between items-center ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-slate-100'}`}>
                        <h3 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> 
                            {searchQuery ? `${txt.searchResults} (${filteredNotes.length})` : (activeSubCategory ? activeSubCategory : (activeCategory ? activeCategory : txt.recentUploads))}
                        </h3>
                        <div className="flex gap-2">
                            {activeCategory && !searchQuery && (
                                <button onClick={() => activeSubCategory ? setActiveSubCategory(null) : setActiveCategory(null)} className="text-xs font-bold text-indigo-600 hover:underline bg-indigo-50 px-2 py-1 rounded">
                                    ⬅ {activeSubCategory ? txt.backToSub : txt.backToMain}
                                </button>
                            )}
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="text-xs text-red-500 font-bold hover:underline">{txt.clearSearch}</button>
                            )}
                        </div>
                    </div>
                    <div className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                        {filteredNotes.map((note, index) => {
                            const linkMeta = getLinkDetails(note.pdfUrl, txt);
                            const noteBgHover = theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-white';
                            const linkColor = theme === 'dark' ? 'text-slate-300 bg-slate-800 border-slate-700 hover:bg-slate-700' : linkMeta.color;
                            
                            const displayTitle = (language === 'hi' && note.smartContentHindi) ? note.smartContentHindi.title : note.title;
                            const displaySubject = (language === 'hi' && note.smartContentHindi) ? note.smartContentHindi.subject : note.subject;

                            return (
                                <div key={note.id} className={`p-5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group border-l-4 border-transparent hover:border-indigo-500 ${noteBgHover}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-indigo-50 text-indigo-600'}`}>{displaySubject}</span>
                                            <span className="text-xs text-slate-400">• {note.time || "N/A"}</span>
                                        </div>
                                        <h4 className={`font-bold text-lg transition-opacity group-hover:opacity-80 ${index % 2 === 0 ? themeColors.gradientText : themeColors.text}`}>{displayTitle}</h4>
                                    </div>
                                    <button 
                                        onClick={() => openNote(note)}
                                        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm active:scale-95 ${linkColor}`}
                                    >
                                        {linkMeta.icon}
                                        <span>{linkMeta.text}</span>
                                    </button>
                                </div>
                            );
                        })}
                        {filteredNotes.length === 0 && (
                        <div className={`p-12 text-center italic ${theme === 'dark' ? 'text-slate-500 bg-slate-900' : 'text-slate-400 bg-slate-50/50'}`}>
                            {searchQuery ? `${txt.noResults} "${searchQuery}"` : txt.emptyLib}
                        </div>
                        )}
                    </div>
                </div>
            )}
        </div>
        ) : view === 'ai-tools' ? (
            <AIToolsPanel onBack={() => setView('home')} language={language} theme={theme} onQuizComplete={() => handleAddXP(50)} />
        ) : view === 'roadmap' ? (
            <RoadmapPanel onBack={() => setView('home')} language={language} />
        ) : null}

      </main>
      {view !== 'ai-tools' && view !== 'admin' && view !== 'reader' && <Footer setView={setView} theme={theme} socialLinks={socialLinks} labels={txt} />}
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default App;
