
import React, { useState, useEffect } from 'react';
import { LibraryItem } from '../notesData';
import { generateSmartNote, convertRawTextToSmartNote, translateSmartNote, getQuotaUsage } from '../services/geminiService';
import { SmartNote, Language, Theme, SocialLink } from '../types';
import { SUBJECT_CATEGORIES, PHARMACY_SUBS } from '../App';

interface AdminPanelProps {
  notes: LibraryItem[];
  onAddNote: (note: LibraryItem) => void;
  onDeleteNote: (id: number) => void;
  onEditNote: (note: LibraryItem) => void;
  socialLinks: SocialLink[];
  onUpdateSocialLinks: (links: SocialLink[]) => void;
  onBack: () => void;
  language: Language;
  theme: Theme;
  audioAccessLevel: 'locked' | 'admin' | 'public';
  onUpdateAudioAccessLevel: (level: 'locked' | 'admin' | 'public') => void;
  aiEnabled: boolean;
  onUpdateAiEnabled: (enabled: boolean) => void;
  siteIntroText: string;
  onUpdateSiteIntro: (text: string) => void;
}

// --- Translations ---
const t = {
  en: {
    title: "Admin Dashboard",
    activeNotes: "Active Notes",
    exit: "Exit",
    tabStudio: "✨ AI Studio",
    tabManager: "📚 Library",
    tabSettings: "⚙️ Settings",
    modeAI: "Topic Mode (AI)",
    modeConvert: "Text Mode (AI)",
    modeManual: "Manual Link",
    phSubject: "Select Subject",
    phTopic: "Topic (e.g. Cell Structure)",
    phText: "Paste text here to convert...",
    phLinkTitle: "Enter Note Title",
    phLinkUrl: "Paste Telegram / Drive / PDF Link here...",
    btnGenEn: "1. Generate English Note",
    btnGenHi: "2. Generate Hindi Version",
    btnSave: "3. Save to Database",
    btnUpdate: "Update Existing Note",
    cooling: "Cooling Down...",
    readyHi: "Ready for Hindi",
    export: "Export Full Database Code",
    statusEn: "English Generated",
    statusHi: "Hindi Generated",
    saveWarn: "Copy this code to notesData.ts",
    deleted: "Deleted",
    edit: "Edit",
    editMode: "Editing Mode",
    cancelEdit: "Cancel Edit",
    confirmDelete: "Are you sure you want to permanently delete this note? This cannot be undone.",
    noNotes: "No notes found. Go to AI Studio to create one.",
    manualSave: "Save Manual Note"
  },
  hi: {
    title: "एडमिन डैशबोर्ड",
    activeNotes: "कुल नोट्स",
    exit: "बाहर जाएं",
    tabStudio: "✨ AI स्टूडियो",
    tabManager: "📚 लाइब्रेरी",
    tabSettings: "⚙️ सेटिंग्स",
    modeAI: "टॉपिक मोड (AI)",
    modeConvert: "टेक्स्ट मोड (AI)",
    modeManual: "मैनुअल लिंक",
    phSubject: "विषय चुनें",
    phTopic: "टॉपिक (जैसे कोशिका)",
    phText: "टेक्स्ट पेस्ट करें...",
    phLinkTitle: "नोट का शीर्षक लिखें",
    phLinkUrl: "Telegram / Drive / PDF लिंक पेस्ट करें...",
    btnGenEn: "1. अंग्रेजी नोट बनाएं",
    btnGenHi: "2. हिंदी वर्जन बनाएं",
    btnSave: "3. डेटाबेस में सेव करें",
    btnUpdate: "नोट अपडेट करें",
    cooling: "इंतज़ार करें...",
    readyHi: "हिंदी के लिए तैयार",
    export: "पूरा डेटाबेस कोड निकालें",
    statusEn: "अंग्रेजी तैयार",
    statusHi: "हिंदी तैयार",
    saveWarn: "इस कोड को notesData.ts में कॉपी करें",
    deleted: "हटा दिया गया",
    edit: "संपादित करें",
    editMode: "संपादन मोड",
    cancelEdit: "रद्द करें",
    confirmDelete: "क्या आप वाकई इस नोट को हमेशा के लिए हटाना चाहते हैं? यह वापस नहीं आएगा।",
    noNotes: "कोई नोट्स नहीं मिले। AI स्टूडियो में जाकर नया नोट बनाएं।",
    manualSave: "मैनुअल नोट सेव करें"
  }
};

// --- SOCIAL MEDIA MANAGER COMPONENT ---
const SocialMediaManager: React.FC<{ links: SocialLink[], onUpdate: (l: SocialLink[]) => void }> = ({ links, onUpdate }) => {
    const [platform, setPlatform] = useState<SocialLink['platform']>('Telegram');
    const [url, setUrl] = useState("");
    const [label, setLabel] = useState("");

    const handleAdd = () => {
        if (!url || !label) return;
        onUpdate([...links, { id: Date.now().toString(), platform, url, label }]);
        setUrl(""); setLabel("");
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800">Social Links Manager</h3>
            <div className="grid md:grid-cols-3 gap-4">
                <select value={platform} onChange={e => setPlatform(e.target.value as any)} className="p-2 border rounded-lg"><option>Telegram</option><option>YouTube</option><option>Instagram</option><option>Email</option></select>
                <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label" className="p-2 border rounded-lg" />
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" className="p-2 border rounded-lg" />
            </div>
            <button onClick={handleAdd} className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold">Add Link</button>
            <div className="space-y-2 mt-4">
                {links.map(l => (
                    <div key={l.id} className="flex justify-between bg-slate-50 p-3 rounded-lg text-sm">
                        <span>{l.platform}: {l.label}</span>
                        <button onClick={() => onUpdate(links.filter(x => x.id !== l.id))} className="text-red-500 font-bold">X</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    notes, onAddNote, onDeleteNote, onEditNote, socialLinks, onUpdateSocialLinks, onBack, language, 
    audioAccessLevel, onUpdateAudioAccessLevel, aiEnabled, onUpdateAiEnabled, siteIntroText, onUpdateSiteIntro 
}) => {
  const [activeTab, setActiveTab] = useState('studio');
  const [mode, setMode] = useState<'ai' | 'convert' | 'manual'>('manual'); // Default to manual for safety
  const txt = t[language];
  
  // --- GENERATION STATE ---
  const [subject, setSubject] = useState("Polity"); 
  const [subSubject, setSubSubject] = useState(""); 
  const [topic, setTopic] = useState("");
  const [rawText, setRawText] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [isPrivate, setIsPrivate] = useState(false); 
  const [youtubeLink, setYoutubeLink] = useState(""); 
  
  const [englishNote, setEnglishNote] = useState<SmartNote | null>(null);
  const [hindiNote, setHindiNote] = useState<SmartNote | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [cooldown, setCooldown] = useState(0); 
  const [step, setStep] = useState(0); 
  
  const [quota, setQuota] = useState({ count: 0, limit: 1400 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempIntro, setTempIntro] = useState(siteIntroText);

  const allSubjects = Object.keys(SUBJECT_CATEGORIES);

  useEffect(() => {
      if (activeTab === 'settings') {
          setQuota(getQuotaUsage());
          setTempIntro(siteIntroText);
      }
  }, [activeTab, siteIntroText]);

  useEffect(() => {
      let timer: any;
      if (cooldown > 0) {
          timer = setInterval(() => setCooldown(c => c - 1), 1000);
      } else if (cooldown === 0 && step === 1) {
          setStep(2); 
      }
      return () => clearInterval(timer);
  }, [cooldown, step]);

  const startEditing = (note: LibraryItem) => {
      setEditingId(note.id);
      
      if (PHARMACY_SUBS.includes(note.subject)) {
          setSubject("Pharmacy Exams");
          setSubSubject(note.subject);
      } else {
          setSubject(note.subject);
          setSubSubject("");
      }

      setTopic(note.title);
      setIsPrivate(note.isPrivate || false); 
      setYoutubeLink(note.youtubeUrl || ""); 
      
      if (note.smartContent) {
          setMode('ai');
          setEnglishNote(note.smartContent || null);
          setHindiNote(note.smartContentHindi || null);
          setStep(note.smartContentHindi ? 3 : 2);
      } else {
          setMode('manual');
          setManualTitle(note.title);
          setManualLink(note.pdfUrl || "");
      }
      
      setActiveTab('studio');
  };

  const cancelEditing = () => {
      setEditingId(null);
      setSubject("Polity");
      setSubSubject("");
      setTopic("");
      setManualTitle("");
      setManualLink("");
      setIsPrivate(false);
      setYoutubeLink("");
      setEnglishNote(null);
      setHindiNote(null);
      setStep(0);
  };

  const handleGenEnglish = async () => {
      const finalSubject = subject === "Pharmacy Exams" && subSubject ? subSubject : subject;

      if (mode === 'ai' && (!finalSubject || !topic)) return alert("Fill details");
      if (mode === 'convert' && !rawText) return alert("Paste text");

      setIsGenerating(true);
      if (!editingId) {
        setEnglishNote(null);
        setHindiNote(null);
      }
      
      try {
          let note: SmartNote | null = null;
          if (mode === 'ai') note = await generateSmartNote(finalSubject, topic);
          else note = await convertRawTextToSmartNote(rawText);

          if (note) {
              note.subject = finalSubject;
              setEnglishNote(note);
              setStep(1);
              setCooldown(10); 
          } else {
              alert("Error: Could not generate English note.");
          }
      } catch (e) { alert("API Error."); }
      setIsGenerating(false);
  };

  const handleGenHindi = async () => {
      if (!englishNote) return;
      setIsGenerating(true);
      try {
          const hNote = await translateSmartNote(englishNote, 'hi');
          if (hNote) {
              hNote.id = `hi-${englishNote.id}`;
              hNote.subject = englishNote.subject;
              setHindiNote(hNote);
              setStep(3);
          }
      } catch (e) { 
          alert("Hindi Translation limit reached. You can still save English version."); 
          setStep(3); 
      }
      setIsGenerating(false);
  };

  const handleSave = async () => {
      const finalSubject = subject === "Pharmacy Exams" && subSubject ? subSubject : subject;
      
      let newItem: LibraryItem;

      if (mode === 'manual') {
          if (!manualTitle || !manualLink) return alert("Please enter Title and Link");
          newItem = {
              id: editingId || Date.now(),
              title: manualTitle,
              subject: finalSubject,
              time: "External Link",
              pdfUrl: manualLink,
              isPrivate: isPrivate,
              youtubeUrl: youtubeLink || undefined
          };
      } else {
          if (!englishNote) return;
          newItem = {
              id: editingId || Date.now(), 
              title: englishNote.title,
              subject: finalSubject,
              time: englishNote.readTime,
              smartContent: { ...englishNote, subject: finalSubject },
              smartContentHindi: hindiNote ? { ...hindiNote, subject: finalSubject } : undefined,
              isPrivate: isPrivate, 
              youtubeUrl: youtubeLink || undefined 
          };
      }
      
      if (editingId) {
          onEditNote(newItem);
          alert("✅ Note Updated Successfully!");
      } else {
          onAddNote(newItem);
          alert(`✅ Saved!\n\n${txt.saveWarn}`);
      }
      cancelEditing();
  };

  const handleExport = async () => {
      const code = `// Exported: ${new Date().toLocaleString()}\nimport { SmartNote } from './types';\n\nexport interface LibraryItem {\n  id: number;\n  title: string;\n  subject: string;\n  time: string;\n  pdfUrl?: string;\n  youtubeUrl?: string;\n  smartContent?: SmartNote;\n  smartContentHindi?: SmartNote;\n  isPrivate?: boolean;\n}\n\nexport const STATIC_NOTES: LibraryItem[] = ${JSON.stringify(notes, null, 2)};`;
      await navigator.clipboard.writeText(code);
      alert("Code Copied to Clipboard!");
  }

  const getYouTubeId = (url: string) => {
      if (!url) return null;
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = url.match(regExp);
      return (match && match[1]) ? match[1] : null;
  }
  const previewId = getYouTubeId(youtubeLink);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 animate-fade-in pb-20">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
            <h2 className="text-2xl font-bold">{txt.title}</h2>
            <div className="flex gap-4">
                 <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{txt.activeNotes}: {notes.length}</span>
                 <button onClick={onBack} className="bg-white text-slate-900 px-4 py-1 rounded-lg font-bold text-sm hover:bg-slate-200">{txt.exit}</button>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 bg-white p-2 rounded-xl shadow-sm border w-fit mx-auto">
             {['studio', 'manager', 'settings'].map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-bold text-sm capitalize ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                     {tab}
                 </button>
             ))}
        </div>

        {/* TAB: STUDIO */}
        {activeTab === 'studio' && (
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4 relative">
                     {editingId && (
                         <div className="absolute top-0 left-0 w-full bg-amber-100 text-amber-800 text-xs font-bold text-center py-1 rounded-t-2xl border-b border-amber-200">
                             ⚠️ {txt.editMode} - ID: {editingId}
                         </div>
                     )}
                     
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Select Main Subject</label>
                        <select 
                            value={subject} 
                            onChange={e => {
                                setSubject(e.target.value);
                                setSubSubject("");
                            }} 
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                            {allSubjects.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>

                        {subject === "Pharmacy Exams" && (
                            <div className="animate-fade-in mt-3">
                                <label className="block text-xs font-bold text-blue-500 mb-1">Select Pharmacy Category</label>
                                <select 
                                    value={subSubject} 
                                    onChange={e => setSubSubject(e.target.value)} 
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50 border-blue-100 text-blue-900"
                                >
                                    <option value="">-- Select Category --</option>
                                    {PHARMACY_SUBS.map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                     </div>

                     {/* Mode Switcher */}
                     <div className="flex bg-slate-100 p-1 rounded-lg mb-4 mt-2">
                         <button onClick={() => setMode('manual')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'manual' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>🔗 {txt.modeManual}</button>
                         {aiEnabled && (
                             <>
                                <button onClick={() => setMode('ai')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'ai' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>{txt.modeAI}</button>
                                <button onClick={() => setMode('convert')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'convert' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>{txt.modeConvert}</button>
                             </>
                         )}
                     </div>

                     {/* --- MANUAL MODE INPUTS --- */}
                     {mode === 'manual' && (
                         <div className="space-y-3">
                             <div>
                                 <label className="text-xs font-bold text-slate-500 ml-1">Title</label>
                                 <input value={manualTitle} onChange={e => setManualTitle(e.target.value)} placeholder={txt.phLinkTitle} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-slate-500 ml-1">Link URL</label>
                                 <input value={manualLink} onChange={e => setManualLink(e.target.value)} placeholder={txt.phLinkUrl} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm" />
                             </div>
                         </div>
                     )}

                     {/* --- AI MODE INPUTS --- */}
                     {mode === 'ai' && (
                         <input value={topic} onChange={e => setTopic(e.target.value)} placeholder={txt.phTopic} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                     )}
                     {mode === 'convert' && (
                         <textarea value={rawText} onChange={e => setRawText(e.target.value)} placeholder={txt.phText} className="w-full p-3 border rounded-xl h-40 focus:ring-2 focus:ring-indigo-500 outline-none" />
                     )}

                     {/* YouTube Link Input */}
                     <div className="relative mt-4">
                        <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">YouTube Video Lecture Link (Optional)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-red-500">📺</div>
                            <input 
                                value={youtubeLink} 
                                onChange={e => setYoutubeLink(e.target.value)} 
                                placeholder="Paste YouTube Video Link here..." 
                                className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm bg-red-50 border-red-100 text-red-900 placeholder-red-300" 
                            />
                            {previewId && <div className="absolute inset-y-0 right-3 flex items-center text-green-600 font-bold text-xs">✓ Valid</div>}
                        </div>
                     </div>

                     {/* Privacy Toggle */}
                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                        <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${isPrivate ? 'bg-indigo-600' : 'bg-slate-300'}`} onClick={() => setIsPrivate(!isPrivate)}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isPrivate ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                            {isPrivate ? '🔒 Private (Admin Only)' : '🌍 Public (Everyone)'}
                        </span>
                     </div>

                     {/* Control Flow */}
                     <div className="pt-4 space-y-3">
                        {mode === 'manual' ? (
                            <button onClick={handleSave} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl hover:bg-opacity-90 transform active:scale-95 transition-all">
                                {editingId ? txt.btnUpdate : txt.manualSave}
                            </button>
                        ) : (
                            <>
                                {step === 0 && (
                                    <button onClick={handleGenEnglish} disabled={isGenerating} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all">
                                        {isGenerating ? 'Generating...' : (editingId ? 'Regenerate English Content' : txt.btnGenEn)}
                                    </button>
                                )}

                                {step === 1 && (
                                     <button disabled className="w-full bg-slate-100 text-slate-500 py-3 rounded-xl font-bold cursor-not-allowed flex justify-center items-center gap-2 border border-slate-200">
                                         <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                         {txt.cooling} ({cooldown}s)
                                     </button>
                                )}

                                {step === 2 && (
                                     <button onClick={handleGenHindi} disabled={isGenerating} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-md hover:shadow-lg transition-all">
                                         {isGenerating ? 'Translating...' : (editingId && hindiNote ? 'Regenerate Hindi' : txt.btnGenHi)}
                                     </button>
                                )}

                                {(step === 2 || step === 3) && (
                                    <div className="space-y-2">
                                        {step === 3 && <div className="text-center text-sm font-bold text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">✅ All Ready!</div>}
                                        <button onClick={handleSave} className={`w-full text-white py-4 rounded-xl font-bold shadow-xl hover:bg-opacity-90 transform active:scale-95 transition-all ${editingId ? 'bg-amber-600' : 'bg-slate-900'}`}>
                                            {editingId ? txt.btnUpdate : txt.btnSave}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        
                        <button onClick={editingId ? cancelEditing : () => setStep(0)} className="w-full py-2 text-xs text-red-400 underline hover:text-red-600">
                             {editingId ? txt.cancelEdit : 'Reset Everything'}
                        </button>
                     </div>
                </div>

                {/* Preview Area */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-[600px] overflow-y-auto">
                    <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4 text-center">Preview Window</h3>
                    {mode === 'manual' ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                            <span className="text-4xl">🔗</span>
                            <span className="font-bold">Manual Link Mode</span>
                            <span className="text-xs">No preview available for external links.</span>
                        </div>
                    ) : englishNote ? (
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded inline-block">English Version</span>
                                    {isPrivate && <span className="text-xs font-bold bg-slate-800 text-white px-2 py-1 rounded">🔒 Private</span>}
                                </div>
                                <h4 className="font-bold text-lg">{englishNote.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">Subject: {englishNote.subject}</p>
                                {youtubeLink && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-bold">📺 Video Attached</p>}
                                <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600 font-mono overflow-hidden h-20">
                                    {JSON.stringify(englishNote.sections[0], null, 2)}...
                                </div>
                            </div>
                            {hindiNote ? (
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                                    <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded mb-2 inline-block">Hindi Version</span>
                                    <h4 className="font-bold text-lg">{hindiNote.title}</h4>
                                    <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600 font-mono overflow-hidden h-20">
                                        {JSON.stringify(hindiNote.sections[0], null, 2)}...
                                    </div>
                                </div>
                            ) : step > 1 && (
                                <div className="text-center p-4 text-slate-400 text-sm italic border-2 border-dashed border-slate-200 rounded-xl">
                                    Hindi version not generated yet.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300">
                            <span className="text-4xl mb-2">📄</span>
                            <span className="font-bold">Waiting for generation...</span>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* TAB: MANAGER */}
        {activeTab === 'manager' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <h3 className="font-bold text-slate-700">{notes.length} Total Notes</h3>
                    <button onClick={handleExport} className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-sm">
                        {txt.export}
                    </button>
                </div>
                <div className="divide-y overflow-y-auto flex-1">
                    {notes.map(note => (
                        <div key={note.id} className="p-4 flex justify-between items-center hover:bg-indigo-50 transition-colors group">
                            <div>
                                <div className="font-bold text-slate-800 flex items-center gap-2">
                                    {note.isPrivate && <span title="Private Note" className="text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded">🔒</span>}
                                    {note.title}
                                </div>
                                <div className="text-xs text-slate-500 flex gap-2 mt-1">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded border">{note.subject}</span>
                                    <span className="text-slate-400">ID: {note.id}</span>
                                    {note.smartContentHindi && <span className="text-green-600 font-bold text-[10px] border border-green-200 px-1 rounded bg-green-50">HI Available</span>}
                                    {note.pdfUrl && <span className="text-blue-600 font-bold text-[10px] border border-blue-200 px-1 rounded bg-blue-50">🔗 Link</span>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEditing(note)}
                                    className="bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                                >
                                    {txt.edit} ✏️
                                </button>
                                <button 
                                    onClick={() => {
                                        if(window.confirm(txt.confirmDelete)) {
                                            onDeleteNote(note.id); 
                                        }
                                    }} 
                                    className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                                >
                                    {txt.deleted} 🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div className="p-10 text-center text-slate-400 italic">{txt.noNotes}</div>
                    )}
                </div>
            </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        🎮 Control Center
                    </h3>

                    {/* AI Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                            <div className="font-bold text-slate-800">Enable AI Features</div>
                            <div className="text-xs text-slate-500">Toggle "Deep Think", Chat, and Quiz Maker features.</div>
                        </div>
                        <button 
                            onClick={() => onUpdateAiEnabled(!aiEnabled)}
                            className={`w-14 h-8 rounded-full p-1 transition-colors ${aiEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${aiEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Site Intro Editor */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-2">Edit Site Intro / About Us</h4>
                        <textarea 
                            value={tempIntro} 
                            onChange={(e) => setTempIntro(e.target.value)} 
                            className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            rows={3}
                        />
                        <button onClick={() => onUpdateSiteIntro(tempIntro)} className="mt-2 text-xs bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">Save Text</button>
                    </div>

                    {/* Audio Controls */}
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                        <div>
                            <div className="font-bold text-slate-800">Public Audio Access</div>
                            <div className="text-xs text-slate-500">Controls AI-powered audio class features.</div>
                        </div>
                        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                            <button onClick={() => onUpdateAudioAccessLevel('locked')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${audioAccessLevel === 'locked' ? 'bg-red-100 text-red-700' : 'text-slate-500'}`}>🔒 Locked</button>
                            <button onClick={() => onUpdateAudioAccessLevel('admin')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${audioAccessLevel === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'text-slate-500'}`}>🛡️ Admin</button>
                            <button onClick={() => onUpdateAudioAccessLevel('public')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${audioAccessLevel === 'public' ? 'bg-green-100 text-green-700' : 'text-slate-500'}`}>🌍 Public</button>
                        </div>
                    </div>
                </div>

                <SocialMediaManager links={socialLinks} onUpdate={onUpdateSocialLinks} />
            </div>
        )}
    </div>
  );
};

export default AdminPanel;
