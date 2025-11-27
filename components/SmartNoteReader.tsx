
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { SmartNote, Language } from '../types';
import { generateSpeech } from '../services/geminiService';

// --- FUTURE PROOFING CONFIGURATION ---
const SAMPLE_RATE = 24000;
const MAX_CONCURRENT_REQUESTS = 4; 
const INITIAL_BUFFER_THRESHOLD = 40; 
const SAFETY_FLUSH_LIMIT = 600;

interface SmartNoteReaderProps {
  note: any; 
  onBack: () => void;
  language: Language;
  onXPAdd?: () => void;
  canPlayAudio?: boolean;
}

// --- TYPES ---
interface RenderableBlock {
  id: string;
  type: 'header' | 'text' | 'list' | 'table' | 'callout';
  title?: string;
  content?: string;
  items?: any[]; 
  tableData?: { headers: string[]; rows: string[][] };
  color?: string;
  depth?: number;
}

interface ScriptItem {
  text: string;
  blockId: string;
  originalBlockIds?: string[]; 
}

// --- TEACHER PHRASES REPOSITORY ---
const TEACHER_PHRASES = {
  en: {
    intro: ["Hello students, welcome to today's class.", "Let's dive deep into this topic today.", "Focus on the screen, let's start."],
    header: ["Moving on to the next important topic,", "Now, let's understand,", "The next heading is very crucial,"],
    listStart: ["Here are the key points you need to remember:", "Let's break this down into points:", "Note down these important factors:"],
    listNext: ["Next point is,", "Also consider this,", "Furthermore,"],
    table: ["Look at this comparison table carefully.", "Let's compare these data points.", "This table summarizes the data."],
    callout: ["Important note!", "Please remember this specific fact,", "Exam tip:"],
    outro: ["That concludes our session.", "Please revise these notes carefully.", "Class dismissed. Great job today."]
  },
  hi: {
    intro: ["नमस्ते स्टूडेंट्स, आज की क्लास में आपका स्वागत है।", "चलिए आज इस टॉपिक को गहराई से समझते हैं।", "ध्यान दीजिये, हम शुरू कर रहे हैं।"],
    header: ["अब चलते हैं अगले टॉपिक की ओर,", "चलिए अब इसे समझते हैं,", "अगला पॉइंट बहुत महत्वपूर्ण है,"],
    listStart: ["इसके मुख्य बिंदु इस प्रकार हैं:", "चलिए इसे पॉइंट्स में समझते हैं:", "इन बातों को नोट कर लीजिये:"],
    listNext: ["अगला पॉइंट है,", "इसके अलावा,", "और साथ ही,"],
    table: ["इस टेबल को ध्यान से देखिये।", "चलिए इन आंकड़ों की तुलना करते हैं।", "यह टेबल सब कुछ साफ़ कर देती है।"],
    callout: ["महत्वपूर्ण नोट!", "इस बात को विशेष रूप से याद रखें,", "एग्जाम के लिए टिप:"],
    outro: ["आज की क्लास यहीं समाप्त होती है।", "कृपया इसका रिविज़न ज़रूर करें।", "शाबाश! पढ़ाई जारी रखें।"]
  }
};

const getRandomPhrase = (phrases: string[]) => phrases[Math.floor(Math.random() * phrases.length)];

// --- HELPER: Callout Styles ---
const getCalloutStyles = (color?: string) => {
    switch (color?.toLowerCase()) {
        case 'red': return 'bg-red-50/50 border-red-400 text-red-900 icon-red shadow-sm';
        case 'purple': return 'bg-purple-50/50 border-purple-400 text-purple-900 icon-purple shadow-sm';
        case 'blue': return 'bg-blue-50/50 border-blue-400 text-blue-900 icon-blue shadow-sm';
        case 'green': return 'bg-green-50/50 border-green-400 text-green-900 icon-green shadow-sm';
        case 'yellow':
        default: return 'bg-amber-50/50 border-amber-400 text-amber-900 icon-amber shadow-sm';
    }
};

const getCalloutIcon = (color?: string) => {
    switch (color?.toLowerCase()) {
        case 'red': return '⚠️';
        case 'purple': return '🧠';
        case 'blue': return '🚀';
        case 'green': return '✅';
        default: return '💡';
    }
};

// --- HELPER: RICH TEXT PARSER (Polished Highlighting) ---
const renderRichText = (text: string) => {
    if (!text) return null;
    // Split by **text** pattern
    const parts = text.split(/\*\*(.*?)\*\*/g);
    
    return parts.map((part, index) => {
        // Odd indices are the text that was inside ** **
        if (index % 2 === 1) {
            return (
                <span key={index} className="highlight-span relative inline-block px-1.5 py-0.5 mx-1 font-semibold text-indigo-900 bg-indigo-100 rounded-md shadow-sm border border-indigo-200/50 transform hover:scale-105 transition-transform duration-200 cursor-default">
                    {part}
                </span>
            );
        }
        return <span key={index}>{part}</span>;
    });
};

// ==================================================================================
// CRITICAL CORE ENGINE: DATA NORMALIZER
// ==================================================================================
const normalizeNoteContent = (note: any): RenderableBlock[] => {
  const blocks: RenderableBlock[] = [];
  let counter = 0;

  const processSection = (sec: any, depth = 0) => {
    const uniqueId = `block-${counter++}`;
    
    if (sec.content_type === 'nested_sections' || sec.subsections) {
      if (sec.title) {
        blocks.push({ 
          id: uniqueId, 
          type: 'header', 
          title: sec.title, 
          content: depth === 0 ? 'Topic' : 'Sub-topic',
          depth 
        });
      }
      if (Array.isArray(sec.subsections)) {
        sec.subsections.forEach((sub: any) => processSection(sub, depth + 1));
      }
      return;
    }

    const type = sec.type || sec.content_type || 'text';
    
    if (type === 'table' && (sec.tableData || sec.content?.headers)) {
       blocks.push({
         id: uniqueId,
         type: 'table',
         title: sec.title,
         tableData: sec.tableData || sec.content
       });
    } 
    else if (type === 'list' && (Array.isArray(sec.items) || Array.isArray(sec.content))) {
       blocks.push({
         id: uniqueId,
         type: 'list',
         title: sec.title,
         items: sec.items || sec.content
       });
    } 
    else {
       // Convert plain text paragraphs into a visual list-like structure if it's long
       let textContent = "";
       if (typeof sec.content === 'string') textContent = sec.content;
       else if (typeof sec.content === 'object' && sec.content?.text) textContent = sec.content.text;
       else if (sec.content) textContent = JSON.stringify(sec.content);

       if (textContent.length > 0 || sec.title) {
         blocks.push({
           id: uniqueId,
           type: sec.title && !textContent ? 'header' : (type === 'callout' ? 'callout' : 'text'),
           title: sec.title,
           content: textContent,
           depth,
           color: sec.color
         });
       }
    }
  };

  const sections = note.sections || [];
  if (Array.isArray(sections)) {
    sections.forEach((s: any) => processSection(s));
  } else if (note.content) {
     processSection(note);
  }

  return blocks;
};

// ==================================================================================
// CRITICAL CORE ENGINE: LOSSLESS SCRIPT GENERATOR
// ==================================================================================
const generateTeacherScript = (blocks: RenderableBlock[], noteTitle: string, lang: Language): ScriptItem[] => {
    const finalScript: ScriptItem[] = [];
    const phrases = lang === 'hi' ? TEACHER_PHRASES.hi : TEACHER_PHRASES.en;

    let textBuffer = "";
    let blockIdBuffer: string[] = [];
    
    const flush = (force = false) => {
        if (!textBuffer.trim()) return;
        if (force || textBuffer.length > SAFETY_FLUSH_LIMIT) {
            finalScript.push({
                text: textBuffer.trim(),
                blockId: blockIdBuffer[0] || 'start', 
                originalBlockIds: [...new Set(blockIdBuffer)]
            });
            textBuffer = "";
            blockIdBuffer = [];
        }
    };

    textBuffer += `${getRandomPhrase(phrases.intro)} Today we are discussing "${noteTitle}". `;
    blockIdBuffer.push(blocks[0]?.id || 'start');
    flush(true);

    blocks.forEach((block) => {
        if (block.title) {
             const transition = block.type === 'header' ? getRandomPhrase(phrases.header) : "";
             textBuffer += `${transition} ${block.title}. `;
        }
        
        blockIdBuffer.push(block.id);

        if (block.type === 'text' && block.content) {
            // Remove ** for audio reading, they shouldn't be spoken
            const cleanText = block.content.replace(/\*\*/g, '').replace(/\n/g, ' ');
            textBuffer += cleanText + " ";
        }
        else if (block.type === 'list' && block.items) {
            textBuffer += `${getRandomPhrase(phrases.listStart)} `;
            
            block.items.forEach((item, idx) => {
                 if (typeof item === 'string') {
                     textBuffer += `${item.replace(/\*\*/g, '')}. `;
                 } 
                 else if (typeof item === 'object') {
                     if (item.heading || item.text) {
                         const h = item.heading || item.text;
                         textBuffer += `${h.replace(/\*\*/g, '')}. `;
                     }
                     if (item.details) {
                         if (Array.isArray(item.details)) {
                             item.details.forEach((det: string) => {
                                 textBuffer += `${det.replace(/\*\*/g, '')}. `;
                             });
                         } else {
                             textBuffer += `${item.details.replace(/\*\*/g, '')}. `;
                         }
                     }
                 }
                 if (idx % 2 === 0) flush();
            });
        }
        else if (block.type === 'table' && block.tableData) {
            textBuffer += `${getRandomPhrase(phrases.table)} `;
            textBuffer += `Columns are: ${block.tableData.headers.join(' and ')}. `;
            
            block.tableData.rows.forEach((row, rIdx) => {
                 textBuffer += `Row ${rIdx + 1}: `;
                 row.forEach((cell, cIdx) => {
                     const header = block.tableData?.headers[cIdx] || `Column ${cIdx+1}`;
                     textBuffer += `${header} is ${cell.replace(/\*\*/g, '')}. `;
                 });
            });
        }
        else if (block.type === 'callout') {
             textBuffer += `${getRandomPhrase(phrases.callout)} ${block.content?.replace(/\*\*/g, '')}. `;
        }

        flush();
    });

    if (textBuffer) {
        textBuffer += ` ${getRandomPhrase(phrases.outro)}`;
        flush(true);
    }

    return finalScript;
};

// ==================================================================================
// COMPONENT LOGIC
// ==================================================================================

const SmartNoteReader: React.FC<SmartNoteReaderProps> = ({ 
    note: rawNote, 
    onBack, 
    language, 
    onXPAdd, 
    canPlayAudio = false
}) => {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState("Initializing Class...");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReadyToPlay, setIsReadyToPlay] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [userHasInitialized, setUserHasInitialized] = useState(false);
  
  // Video State
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const blocks = useMemo(() => {
      if (!rawNote) return [];
      const baseNote = (language === 'hi' && rawNote.smartContentHindi) 
          ? rawNote.smartContentHindi 
          : (rawNote.smartContent || rawNote);
      return normalizeNoteContent(baseNote);
  }, [rawNote, language]);

  const script = useMemo(() => {
      if (blocks.length === 0) return [];
      const baseNote = (language === 'hi' && rawNote.smartContentHindi) 
          ? rawNote.smartContentHindi 
          : (rawNote.smartContent || rawNote);
      return generateTeacherScript(blocks, baseNote?.title || "Class", language);
  }, [blocks, language, rawNote]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentIndexRef = useRef(0);
  const stopRequestedRef = useRef(false);
  const audioCacheRef = useRef<Map<number, AudioBuffer>>(new Map());
  const activeRequestsRef = useRef<Set<number>>(new Set());
  const isMountRef = useRef(true);
  const hasStartedPlaybackRef = useRef(false);

  useEffect(() => {
      isMountRef.current = true;
      // Clean up audio context on unmount to prevent memory leaks
      return () => {
          isMountRef.current = false;
          fullStop();
          if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
            audioCtxRef.current.close();
          }
      };
  }, []); // Empty dependency for unmount cleanup only

  // Reset state when note/language changes
  useEffect(() => {
      currentIndexRef.current = 0;
      audioCacheRef.current.clear();
      activeRequestsRef.current.clear();
      hasStartedPlaybackRef.current = false;
      
      setIsReadyToPlay(false);
      setDownloadProgress(0);
      setCurrentSubtitle("Setting up Classroom Environment...");
      setIsPlaying(false);
      setUserHasInitialized(false);
      setIsVideoLoaded(false); 
      
      // Suspend context if active to save resources
      if(audioCtxRef.current && audioCtxRef.current.state === 'running') {
          audioCtxRef.current.suspend();
      }
  }, [script, canPlayAudio]);

  const decodePCM = (base64: string): AudioBuffer | null => {
      try {
          const binary = window.atob(base64);
          const len = binary.length;
          const safeLen = len % 2 === 0 ? len : len - 1;
          const bytes = new Uint8Array(safeLen);
          for (let i = 0; i < safeLen; i++) bytes[i] = binary.charCodeAt(i);
          const int16 = new Int16Array(bytes.buffer);
          
          if (!audioCtxRef.current) return null;
          const buffer = audioCtxRef.current.createBuffer(1, int16.length, SAMPLE_RATE);
          const channel = buffer.getChannelData(0);
          for (let i = 0; i < int16.length; i++) channel[i] = int16[i] / 32768.0;
          return buffer;
      } catch (e) { return null; }
  };

  const backgroundLoader = useCallback(async () => {
      if (!isMountRef.current) return;
      if (!canPlayAudio) return;

      const totalItems = script.length;
      const completedCount = audioCacheRef.current.size;
      const currentPct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

      if (isMountRef.current) setDownloadProgress(currentPct);

      if (!isReadyToPlay) {
          if (currentPct >= INITIAL_BUFFER_THRESHOLD || (totalItems < 6 && completedCount === totalItems)) {
               if (isMountRef.current) setIsReadyToPlay(true);
          }
      }

      if (completedCount >= totalItems) return;

      const activeCount = activeRequestsRef.current.size;
      const freeSlots = MAX_CONCURRENT_REQUESTS - activeCount;

      if (freeSlots > 0) {
          const startSearch = hasStartedPlaybackRef.current ? currentIndexRef.current : 0;
          
          let dispatched = 0;
          for (let i = startSearch; i < totalItems; i++) {
              if (!audioCacheRef.current.has(i) && !activeRequestsRef.current.has(i)) {
                  fetchAudioChunk(i);
                  dispatched++;
                  if (dispatched >= freeSlots) break;
              }
          }
      }

      if (completedCount < totalItems) {
         setTimeout(() => {
            if(isMountRef.current && canPlayAudio) backgroundLoader();
         }, 300);
      }

  }, [script, language, isReadyToPlay, canPlayAudio]);

  const fetchAudioChunk = async (index: number) => {
      if (activeRequestsRef.current.has(index)) return;
      activeRequestsRef.current.add(index);

      try {
          const text = script[index].text;
          const base64 = await generateSpeech(text, language);
          
          if (base64 && isMountRef.current) {
              // Ensure context exists
              if(!audioCtxRef.current) {
                  const Ctx = window.AudioContext || (window as any).webkitAudioContext;
                  audioCtxRef.current = new Ctx({ sampleRate: SAMPLE_RATE });
              }
              
              const buffer = decodePCM(base64);
              if (buffer) {
                  audioCacheRef.current.set(index, buffer);
              }
          }
      } catch (e) {
          // Silent fail, retry logic is in backgroundLoader loop implicitly
      } finally {
          if (isMountRef.current) {
              activeRequestsRef.current.delete(index);
          }
      }
  };

  useEffect(() => {
      if (canPlayAudio && userHasInitialized) {
          // Init context on first interaction
          if(!audioCtxRef.current) {
              const Ctx = window.AudioContext || (window as any).webkitAudioContext;
              audioCtxRef.current = new Ctx({ sampleRate: SAMPLE_RATE });
          }
          backgroundLoader();
      }
  }, [canPlayAudio, userHasInitialized]);

  const playSequence = async () => {
      if (stopRequestedRef.current || !isMountRef.current) return;

      hasStartedPlaybackRef.current = true;
      const idx = currentIndexRef.current;
      const total = script.length;

      if (idx >= total) {
          setIsPlaying(false);
          setCurrentSubtitle("Class Completed! 🎉");
          if(onXPAdd) onXPAdd();
          return;
      }

      const buffer = audioCacheRef.current.get(idx);

      if (buffer) {
          const item = script[idx];
          setCurrentSubtitle(item.text.length > 100 ? item.text.substring(0, 100) + "..." : item.text);
          setActiveBlockId(item.blockId);
          
          const el = document.getElementById(item.blockId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

          setProgress((idx / total) * 100);

          if (audioCtxRef.current?.state === 'suspended') {
              await audioCtxRef.current.resume();
          }

          const source = audioCtxRef.current!.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtxRef.current!.destination);
          
          source.onended = () => {
              if (!stopRequestedRef.current && isMountRef.current) {
                  currentIndexRef.current++;
                  playSequence();
              }
          };
          
          sourceRef.current = source;
          source.start();
      } else {
          setCurrentSubtitle("Buffering next concept... (Optimizing Network)");
          if (!activeRequestsRef.current.has(idx)) {
              fetchAudioChunk(idx);
          }
          setTimeout(() => { if(isMountRef.current) playSequence(); }, 500); 
      }
  };

  const fullStop = () => {
      stopRequestedRef.current = true;
      if (sourceRef.current) {
          try { sourceRef.current.stop(); } catch(e) {}
      }
      setIsPlaying(false);
  };

  const handleStart = () => {
      if (!isReadyToPlay || !canPlayAudio) return;
      stopRequestedRef.current = false;
      setIsPlaying(true);
      if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
      playSequence();
  };

  // --- 100% FIXED PRINT HANDLER (VISIBILITY TOGGLE + COLOR PRESERVATION) ---
  const handlePrint = () => {
    // Inject strict print styles if not already present
    if (typeof window !== 'undefined') {
        let style = document.getElementById('print-style-fix');
        if(!style) {
            style = document.createElement('style');
            style.id = 'print-style-fix';
            style.innerHTML = `
                @media print {
                    /* RESET GLOBAL STYLES */
                    html, body, #root {
                        width: 100% !important;
                        height: auto !important;
                        overflow: visible !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        position: static !important;
                    }

                    /* COLOR FIX: Enable exact color printing */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    /* HIDE EVERYTHING using visibility */
                    body * {
                        visibility: hidden;
                    }

                    /* DISPLAY ONLY OUR PRINT PORTAL */
                    /* Force it to be visible, absolute, and start at top-left */
                    #printable-content, #printable-content * {
                        visibility: visible !important;
                    }

                    #printable-content {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        z-index: 9999 !important;
                        background: white !important;
                        padding: 20px !important;
                        margin: 0 !important;
                        color: #1e293b; /* Default dark text (slate-800) instead of black */
                    }

                    /* PRESERVE HIGHLIGHT COLORS EXPLICITLY */
                    .highlight-span {
                        background-color: #e0e7ff !important; /* indigo-100 */
                        color: #312e81 !important; /* indigo-900 */
                        border: 1px solid #c7d2fe !important;
                    }
                    
                    /* PRESERVE CALLOUT COLORS */
                    .bg-red-50\\/50 { background-color: #fef2f2 !important; border-color: #f87171 !important; color: #7f1d1d !important; }
                    .bg-purple-50\\/50 { background-color: #faf5ff !important; border-color: #c084fc !important; color: #581c87 !important; }
                    .bg-blue-50\\/50 { background-color: #eff6ff !important; border-color: #60a5fa !important; color: #1e3a8a !important; }
                    .bg-green-50\\/50 { background-color: #f0fdf4 !important; border-color: #4ade80 !important; color: #14532d !important; }
                    .bg-amber-50\\/50 { background-color: #fffbeb !important; border-color: #fbbf24 !important; color: #78350f !important; }

                    /* HIDE NO-PRINT ELEMENTS explicitly */
                    .no-print {
                        display: none !important;
                        visibility: hidden !important;
                    }
                    
                    /* Fix layout for printed items */
                    .note-block {
                        break-inside: avoid;
                        page-break-inside: avoid;
                        margin-bottom: 20px !important;
                        border: 1px solid #eee !important;
                    }

                    /* Watermark Logic: CLEAN GRID OVERLAY MODE */
                    .print-watermark {
                        display: grid !important;
                        grid-template-columns: repeat(2, 1fr) !important;
                        grid-template-rows: repeat(4, 1fr) !important;
                        visibility: visible !important;
                        position: fixed !important; /* Fixed ensures repeat on every page */
                        inset: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        z-index: 2147483647 !important; /* Topmost layer */
                        opacity: 0.08 !important; /* Very subtle opacity */
                        pointer-events: none !important;
                        background: transparent !important;
                        align-items: center;
                        justify-items: center;
                    }
                    
                    .print-watermark-item {
                        transform: rotate(-45deg);
                        font-size: 24px;
                        font-weight: 900;
                        color: #000;
                        text-transform: uppercase;
                        letter-spacing: 4px;
                        white-space: nowrap;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setTimeout(() => {
        window.print();
    }, 300);
  };

  // --- ROBUST YOUTUBE ID EXTRACTOR ---
  const getYouTubeId = (url: string | undefined) => {
      if (!url) return null;
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = url.match(regExp);
      return (match && match[1]) ? match[1] : null;
  }

  const youtubeId = getYouTubeId(rawNote?.youtubeUrl);

  return (
      <div className="min-h-screen bg-[#f8f9fa]/80 backdrop-blur-sm pb-40 font-sans relative">
          
          {/* HEADER (Hidden in Print via CSS) */}
          <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b shadow-sm px-4 py-3 no-print">
              <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                  <button onClick={() => { fullStop(); onBack(); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  
                  <div className="flex-1">
                      {!canPlayAudio ? (
                           <div className="flex justify-center text-xs font-bold text-red-500 uppercase tracking-widest bg-red-50 py-1.5 rounded-lg border border-red-100">
                               Premium Audio Feature Locked
                           </div>
                      ) : !userHasInitialized ? (
                          <div className="flex justify-center">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Audio Class Available</span>
                          </div>
                      ) : !isReadyToPlay ? (
                          <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                                  <span>Buffering Class Resources...</span>
                                  <span>{downloadProgress}% / {INITIAL_BUFFER_THRESHOLD}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500 transition-all duration-300 relative overflow-hidden" style={{width: `${downloadProgress}%`}}>
                                     <div className="absolute inset-0 bg-white/30 animate-[shimmer_1s_infinite]"></div>
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                                  <span>Class Progress</span>
                                  <span>{Math.round(progress)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-600 transition-all duration-500" style={{width: `${progress}%`}}></div>
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="flex gap-2">
                       {/* Download / Print Button */}
                       <button 
                           onClick={handlePrint}
                           className="shrink-0 p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center group relative"
                           title="Save PDF / Print"
                       >
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                           <span className="absolute top-10 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Save PDF</span>
                       </button>

                      {!canPlayAudio ? (
                          <button disabled className="shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white shadow-sm bg-slate-800 opacity-80 cursor-not-allowed">
                              <span>🔒 Locked</span>
                          </button>
                      ) : !userHasInitialized ? (
                          <button 
                              onClick={() => setUserHasInitialized(true)}
                              className="shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white shadow-lg transition-all transform active:scale-95 bg-indigo-600 hover:bg-indigo-700 animate-pulse"
                          >
                              <span>🎧 Load Audio Class</span>
                          </button>
                      ) : (
                          <button 
                              onClick={isPlaying ? fullStop : handleStart}
                              disabled={!isReadyToPlay}
                              className={`shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white shadow-lg transition-all transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed ${isPlaying ? 'bg-rose-500 hover:bg-rose-600' : (isReadyToPlay ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-400')}`}
                          >
                              {!isReadyToPlay ? (
                                  <span className="flex gap-2 items-center"><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> {downloadProgress}%</span>
                              ) : (
                                  isPlaying ? <span>⏸ Pause</span> : <span>▶ Start Class</span>
                              )}
                          </button>
                      )}
                  </div>
              </div>
              
              <div className="max-w-2xl mx-auto mt-3 text-center relative min-h-[3rem] flex items-center justify-center px-4 no-print">
                   <p className={`text-sm md:text-lg font-medium text-indigo-900 transition-all duration-300 leading-snug`}>
                      {!canPlayAudio ? "Contact Admin to unlock this Premium Audio Class feature." : (!userHasInitialized ? "Tap the button above to start downloading audio materials." : (!isReadyToPlay ? "Please wait, we are securing a high-speed connection..." : (isPlaying ? `"${currentSubtitle}"` : "Resources Ready. Tap Start to begin the session.")))}
                   </p>
              </div>
          </div>

          {/* PRINT PORTAL WRAPPER: This ID is crucial for the CSS fix */}
          <div id="printable-content" className="max-w-3xl mx-auto p-4 md:p-8 space-y-12 relative z-10">
              
              {/* WATERMARK (Visible in Print) - CLEAN GRID OVERLAY */}
              <div className="print-watermark" aria-hidden="true">
                  {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="print-watermark-item">
                          Vidyunmesā EduWorld
                      </div>
                  ))}
              </div>

              {blocks.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 animate-pulse">
                      <div className="text-6xl mb-4">🎓</div>
                      <h3 className="text-xl font-bold">Preparing your Classroom...</h3>
                  </div>
              ) : (
                  <>
                  {blocks.map((block) => {
                      const isActive = activeBlockId === block.id;
                      // Note: In print, 'activeClass' background logic will be overridden by print CSS to keep it clean
                      const activeClass = isActive ? "ring-2 ring-indigo-500 ring-offset-4 scale-[1.02] shadow-2xl border-indigo-200 bg-white z-10" : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg";

                      if (block.type === 'header') {
                          return (
                             <div id={block.id} key={block.id} className={`pt-10 pb-4 transition-all duration-500 note-block ${isActive ? 'opacity-100 transform translate-x-2' : 'opacity-90'}`}>
                                 <h2 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 ${block.depth === 0 ? 'text-4xl md:text-5xl border-b-2 border-indigo-100 pb-4 mb-4' : 'text-2xl md:text-3xl'}`} style={{ color: 'black', WebkitTextFillColor: 'initial', backgroundImage: 'none' }}>
                                     {renderRichText(block.title || "")}
                                 </h2>
                             </div>
                          );
                      }

                      return (
                          <div id={block.id} key={block.id} className={`p-6 md:p-10 rounded-2xl border transition-all duration-500 relative note-block ${activeClass}`}>
                              {isActive && <div className="absolute -left-3 top-10 w-1.5 h-16 bg-indigo-500 rounded-r-full shadow-lg no-print"></div>}
                              
                              {block.title && <h3 className="font-bold text-2xl mb-6 text-slate-800 tracking-tight">{renderRichText(block.title)}</h3>}
                              
                              {block.type === 'text' && (
                                  <p className="text-slate-700 text-lg md:text-xl leading-loose tracking-wide whitespace-pre-wrap flex items-start gap-3">
                                     <span className="mt-1.5 text-indigo-400 no-print">🔹</span>
                                     <span>{renderRichText(block.content || "")}</span>
                                  </p>
                              )}

                              {block.type === 'list' && (
                                  <ul className="space-y-6">
                                      {block.items?.map((item, i) => {
                                          let itemText = "";
                                          let itemDetails: React.ReactNode = null;

                                          if (typeof item === 'string') {
                                              itemText = item;
                                          } else if (typeof item === 'object' && item !== null) {
                                              if (item.text) itemText = item.text;
                                              else if (item.heading) {
                                                  itemText = item.heading;
                                                  if (item.details) {
                                                       if (Array.isArray(item.details)) {
                                                           itemDetails = <ul className="list-disc pl-5 mt-2 space-y-2 text-base text-slate-600 leading-relaxed">
                                                               {item.details.map((d:string, k:number) => <li key={k}>{renderRichText(d)}</li>)}
                                                           </ul>;
                                                       } else {
                                                           itemDetails = <div className="text-base text-slate-600 mt-2 leading-relaxed">{renderRichText(item.details)}</div>;
                                                       }
                                                  }
                                              }
                                          }

                                          // Force an Emoji if the string doesn't start with one (Basic heuristic)
                                          const hasEmoji = /^\p{Emoji}/u.test(itemText);
                                          const prefix = !hasEmoji ? "🔸 " : "";
                                          
                                          return (
                                              <li key={i} className="flex gap-4 items-start">
                                                  <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mt-1 border border-indigo-100 shadow-sm no-print">
                                                      {i + 1}
                                                  </span>
                                                  <div className="text-slate-700 text-lg md:text-xl leading-loose tracking-wide">
                                                      <span className="font-medium">{prefix}{renderRichText(itemText)}</span>
                                                      {itemDetails}
                                                  </div>
                                              </li>
                                          );
                                      })}
                                  </ul>
                              )}

                              {block.type === 'table' && block.tableData && (
                                  <div className="overflow-hidden rounded-xl border border-slate-200 mt-4 shadow-sm">
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-left text-base">
                                            <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-xs">
                                                <tr>
                                                    {block.tableData.headers.map((h, i) => <th key={i} className="p-4 whitespace-nowrap">{renderRichText(h)}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {block.tableData.rows.map((row, r) => (
                                                    <tr key={r} className="hover:bg-indigo-50/30 transition-colors">
                                                        {row.map((c, ci) => <td key={ci} className="p-4 text-slate-700 leading-relaxed">{renderRichText(c)}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                      </div>
                                  </div>
                              )}

                              {block.type === 'callout' && (
                                  <div className={`border-l-4 p-6 rounded-r-xl my-4 ${getCalloutStyles(block.color)}`}>
                                      <div className="font-bold flex items-center gap-2 mb-2 text-lg">
                                          <span className="text-2xl">{getCalloutIcon(block.color)}</span> {renderRichText(block.title || "Note")}
                                      </div>
                                      <p className="text-lg md:text-xl leading-relaxed">{renderRichText(block.content || "")}</p>
                                  </div>
                              )}
                          </div>
                      );
                  })}

                  {/* VIDEO SECTION */}
                  {youtubeId && (
                      <div className="mt-16 pt-10 border-t-2 border-slate-200 break-inside-avoid note-block">
                          {/* WEB VIEW: VIDEO PLAYER (FACADE PATTERN) */}
                          <div className="video-player-frame bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-1 no-print">
                              <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
                                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                      <span className="text-red-500 text-2xl">📺</span> Video Class
                                  </h2>
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden xs:inline">Recommended Watch</span>
                              </div>
                              
                              {/* Facade vs Iframe */}
                              <div className="aspect-video w-full bg-black relative group cursor-pointer">
                                  {!isVideoLoaded ? (
                                      <div onClick={() => setIsVideoLoaded(true)} className="absolute inset-0 flex items-center justify-center bg-black">
                                          <img 
                                            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} 
                                            alt="Video Thumbnail" 
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center">
                                              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                              </div>
                                          </div>
                                          <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded font-bold">Click to Play</div>
                                      </div>
                                  ) : (
                                      <iframe 
                                          width="100%" 
                                          height="100%" 
                                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`} 
                                          title="Video Lecture" 
                                          frameBorder="0" 
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                          allowFullScreen
                                          className="absolute inset-0"
                                      ></iframe>
                                  )}
                              </div>
                              
                              {/* FALLBACK BUTTON */}
                              <div className="bg-slate-800 px-4 py-4 text-center border-t border-slate-700">
                                   <p className="text-slate-400 text-xs md:text-sm mb-3">
                                      Video loading slow or restricted?
                                   </p>
                                   <a 
                                      href={rawNote?.youtubeUrl} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 group"
                                   >
                                      <span>Watch Directly on YouTube</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                                   </a>
                              </div>
                          </div>

                          {/* PRINT VIEW: VIDEO LINK (Fallback) */}
                          <div className="hidden no-print" style={{ display: 'none' }}></div>
                          <div className="hidden print:block p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 mt-4 text-center">
                              <h3 className="font-bold text-xl mb-2 flex items-center justify-center gap-2">
                                  <span>📺</span> Video Class Available
                              </h3>
                              <p className="text-base text-slate-600 mb-2">Scan or visit the link to watch the full class for this topic:</p>
                              <a href={rawNote?.youtubeUrl} className="text-blue-600 underline font-mono text-sm break-all font-bold">
                                  {rawNote?.youtubeUrl}
                              </a>
                          </div>
                      </div>
                  )}
                  </>
              )}
          </div>
      </div>
  );
};

export default SmartNoteReader;
