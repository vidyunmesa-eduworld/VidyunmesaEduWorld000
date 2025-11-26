
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponseStream, generateQuiz } from '../services/geminiService';
import { QuizQuestion, Language, Theme } from '../types';

interface AIToolsPanelProps {
  onBack: () => void;
  language: Language;
  theme: Theme;
  onQuizComplete?: () => void;
}

type ToolMode = 'overview' | 'quiz' | 'sathi';
type QuizState = 'setup' | 'loading' | 'playing' | 'result';
type ChatMode = 'standard' | 'web';

const AIToolsPanel: React.FC<AIToolsPanelProps> = ({ onBack, language, theme, onQuizComplete }) => {
  const [mode, setMode] = useState<ToolMode>('overview');

  // --- Theme Colors ---
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-cyan-100' : 'text-slate-900';
  const subTextColor = isDark ? 'text-cyan-400/70' : 'text-slate-500';
  const cardBg = isDark ? 'bg-slate-800/50 border-cyan-900' : 'bg-white border-indigo-50';
  const accentGradient = isDark ? 'text-cyan-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600';

  const t = {
    en: {
       title: "AI Power Tools",
       quizTitle: "AI Quiz Maker",
       quizDesc: "Generate unlimited practice questions from any topic instantly.",
       quizBtn: "Create Quiz",
       chatTitle: "Vidyunmesā Exam Sathi Pro",
       chatDesc: "Advanced doubts solving with Live Search.",
       chatBtn: "Open Sathi",
       back: "Back",
       enterTopic: "Enter Topic (e.g. Modern History)",
       startQuiz: "Start Quiz 🚀",
       generating: "Generating Quiz...",
       wait: "Please wait...",
       result: "Quiz Results",
       playAgain: "Play Again",
       exit: "Exit",
       explanation: "Explanation",
       submit: "Submit Test",
       next: "Next Question",
       typeDoubt: "Ask a complex doubt...",
       clearChat: "Clear",
       online: "Online",
       setupTitle: "Create AI Mock Test",
       setupDesc: "Enter a topic and AI will generate fresh MCQs.",
       modeStandard: "Fast",
       modeWeb: "Web Search"
    },
    hi: {
       title: "AI सुविधाएं",
       quizTitle: "AI Quiz Maker",
       quizDesc: "किसी भी टॉपिक से अनलिमिटेड प्रैक्टिस सवाल बनाएं।",
       quizBtn: "क्विज़ बनाएं",
       chatTitle: "Vidyunmesā Exam साथी प्रो",
       chatDesc: "लाइव सर्च के साथ डाउट सॉल्विंग।",
       chatBtn: "साथी खोलें",
       back: "वापस",
       enterTopic: "टॉपिक का नाम (e.g. Modern History)",
       startQuiz: "क्विज़ शुरू करें 🚀",
       generating: "क्विज़ बन रहा है...",
       wait: "कृपया प्रतीक्षा करें...",
       result: "परिणाम",
       playAgain: "फिर से खेलें",
       exit: "बाहर निकलें",
       explanation: "व्याख्या (Explanation)",
       submit: "टेस्ट सबमिट करें",
       next: "अगला सवाल",
       typeDoubt: "कठिन सवाल पूछें...",
       clearChat: "साफ़ करें",
       online: "ऑनलाइन",
       setupTitle: "AI Mock Test बनाएं",
       setupDesc: "टॉपिक लिखें और AI नए MCQs बनाएगा।",
       modeStandard: "फास्ट",
       modeWeb: "वेब सर्च"
    }
  };

  const txt = t[language];


  // --- Quiz State ---
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [quizTopic, setQuizTopic] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  
  const handleStartQuiz = async () => {
      if (!quizTopic) return;
      setQuizState('loading');
      const data = await generateQuiz(quizTopic, questionCount, language);
      if (data && data.length > 0) {
          setQuizData(data);
          setUserAnswers(new Array(data.length).fill(-1));
          setCurrentQIndex(0);
          setQuizState('playing');
      } else {
          setQuizState('setup');
          alert("Failed to generate quiz. Please check your internet connection.");
      }
  };

  const handleOptionSelect = (optionIndex: number) => {
      const newAnswers = [...userAnswers];
      newAnswers[currentQIndex] = optionIndex;
      setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
      if (currentQIndex < quizData.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
      } else {
          setQuizState('result');
          if (onQuizComplete) onQuizComplete();
      }
  };

  const handleResetQuiz = () => {
      setQuizState('setup');
      setQuizTopic("");
      setQuizData([]);
      setUserAnswers([]);
      setCurrentQIndex(0);
  };


  // --- Chat State (Exam Sathi) ---
  const [chatHistory, setChatHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);
  const [chatMode, setChatMode] = useState<ChatMode>('standard');
  
  const helloText = "Hello dost! mai tumhara Mentor. kaise ho tum";

  const [messages, setMessages] = useState<{sender: 'user' | 'bot', text: string}[]>([{ sender: 'bot', text: helloText }]);
  const [inputMsg, setInputMsg] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  useEffect(() => {
    if (messages.length === 1) {
         setMessages([{ sender: 'bot', text: helloText }]);
    }
  }, [language]);

  const handleSend = async () => {
    if (!inputMsg.trim()) return;
    
    const userText = inputMsg;
    setInputMsg("");
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsStreaming(true);

    // Create a placeholder for bot response
    setMessages(prev => [...prev, { sender: 'bot', text: "" }]);

    const stream = getChatResponseStream(userText, chatHistory, language, chatMode);
    
    let fullResponse = "";

    for await (const chunk of stream) {
        fullResponse += chunk;
        // Update the last message (the bot placeholder) with accumulated text
        setMessages(prev => {
            const newArr = [...prev];
            newArr[newArr.length - 1] = { sender: 'bot', text: fullResponse };
            return newArr;
        });
    }

    const newHistory = [
        ...chatHistory,
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: fullResponse }] }
    ];
    setChatHistory(newHistory);
    setIsStreaming(false);
  };

  const handleClearChat = () => {
      setMessages([{ sender: 'bot', text: helloText }]);
      setChatHistory([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };


  // --- Render Logic ---
  
  if (mode === 'overview') {
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex items-center gap-4 mb-6">
                 <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-cyan-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                 </button>
                 <h2 className={`text-3xl font-bold ${accentGradient}`}>{txt.title}</h2>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                 {/* Quiz Maker Card */}
                 <div onClick={() => setMode('quiz')} className={`cursor-pointer group relative rounded-3xl p-8 shadow-xl border transition-all hover:-translate-y-2 overflow-hidden ${cardBg}`}>
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className={isDark ? "text-cyan-500" : "text-indigo-600"}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/></svg>
                      </div>
                      <div className="relative z-10">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-indigo-100 text-indigo-600'}`}>⚡</div>
                          <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>{txt.quizTitle}</h3>
                          <p className={`mb-6 ${subTextColor}`}>{txt.quizDesc}</p>
                          <span className={`inline-flex items-center font-bold ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}>{txt.quizBtn} &rarr;</span>
                      </div>
                 </div>

                 {/* Exam Sathi Card */}
                 <div onClick={() => setMode('sathi')} className={`cursor-pointer group relative rounded-3xl p-8 shadow-xl border transition-all hover:-translate-y-2 overflow-hidden ${cardBg}`}>
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className={isDark ? "text-cyan-500" : "text-purple-600"}><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 9a1 1 0 0 1 0 2 1 1 0 0 1 0-2zm0-5a3 3 0 0 1 1 2.829l-.112.17L12 11.5l-.888-.499.112-.171A1 1 0 0 0 12 8z"/></svg>
                      </div>
                      <div className="relative z-10">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>🤖</div>
                          <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>{txt.chatTitle}</h3>
                          <p className={`mb-6 ${subTextColor}`}>{txt.chatDesc}</p>
                          <span className={`inline-flex items-center font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{txt.chatBtn} &rarr;</span>
                      </div>
                 </div>
             </div>
        </div>
    );
  }

  // --- QUIZ MAKER VIEW ---
  if (mode === 'quiz') {
      const inputBg = isDark ? 'bg-slate-900 border-cyan-900 text-white' : 'bg-white border-indigo-200';

      if (quizState === 'setup') {
        return (
            <div className="max-w-2xl mx-auto py-12 animate-fade-in">
                <button onClick={() => setMode('overview')} className={`mb-8 flex items-center gap-2 transition-colors ${subTextColor} hover:${textColor}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    {txt.back}
                </button>
                <div className={`p-8 rounded-3xl shadow-xl border text-center ${cardBg}`}>
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-md ${isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-indigo-100 text-indigo-600'}`}>⚡</div>
                    <h2 className={`text-3xl font-bold mb-2 ${textColor}`}>{txt.setupTitle}</h2>
                    <p className={`mb-8 ${subTextColor}`}>{txt.setupDesc}</p>

                    <div className="space-y-6 text-left max-w-md mx-auto">
                        <div>
                            <label className={`block text-sm font-bold mb-2 uppercase tracking-wider ${subTextColor}`}>Topic</label>
                            <input 
                                type="text" 
                                value={quizTopic}
                                onChange={(e) => setQuizTopic(e.target.value)}
                                placeholder={txt.enterTopic}
                                className={`w-full p-4 border rounded-xl focus:ring-4 focus:ring-opacity-50 outline-none text-lg font-medium transition-all ${inputBg} ${isDark ? 'focus:ring-cyan-800 focus:border-cyan-500' : 'focus:ring-indigo-50 focus:border-indigo-500'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-bold mb-2 uppercase tracking-wider ${subTextColor}`}>Questions</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[10, 20, 30].map(num => (
                                    <button key={num} onClick={() => setQuestionCount(num)} className={`py-3 rounded-xl font-bold border-2 transition-all ${questionCount === num ? (isDark ? 'border-cyan-500 bg-cyan-900/50 text-cyan-400' : 'border-indigo-600 bg-indigo-50 text-indigo-700') : (isDark ? 'border-slate-700 text-slate-500 hover:border-cyan-700' : 'border-slate-100 text-slate-500 hover:border-indigo-200')}`}>{num}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleStartQuiz} disabled={!quizTopic} className={`w-full py-4 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/50' : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-200'}`}>
                            {txt.startQuiz}
                        </button>
                    </div>
                </div>
            </div>
        );
      }

      if (quizState === 'loading') {
          return (
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="w-24 h-24 relative mb-8">
                      <div className={`absolute inset-0 border-4 rounded-full ${isDark ? 'border-cyan-900' : 'border-indigo-100'}`}></div>
                      <div className={`absolute inset-0 border-4 rounded-full border-t-transparent animate-spin ${isDark ? 'border-cyan-400' : 'border-indigo-600'}`}></div>
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>{txt.generating}</h3>
                  <p className={subTextColor}>{txt.wait}</p>
              </div>
          );
      }

      if (quizState === 'playing') {
          const question = quizData[currentQIndex];
          const progress = ((currentQIndex + 1) / quizData.length) * 100;
          const optBorder = isDark ? 'border-slate-700 hover:border-cyan-700 hover:bg-slate-800' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50';
          const optSelected = isDark ? 'border-cyan-500 bg-cyan-900/40' : 'border-indigo-600 bg-indigo-50';
          const circleSelected = isDark ? 'bg-cyan-500 border-cyan-500 text-slate-900' : 'bg-indigo-600 border-indigo-600 text-white';
          const circleDefault = isDark ? 'border-slate-600 text-slate-500 group-hover:border-cyan-500 group-hover:text-cyan-400' : 'border-slate-300 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500';

          return (
              <div className="max-w-3xl mx-auto py-8 animate-fade-in">
                  <div className="mb-8">
                      <div className="flex justify-between items-end mb-2">
                          <span className={`text-sm font-bold uppercase tracking-wider ${subTextColor}`}>Question {currentQIndex + 1} / {quizData.length}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${isDark ? 'bg-cyan-900 text-cyan-400' : 'bg-indigo-100 text-indigo-700'}`}>Exam Mode</span>
                      </div>
                      <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <div className={`h-full transition-all duration-500 ${isDark ? 'bg-cyan-500' : 'bg-indigo-600'}`} style={{ width: `${progress}%` }}></div>
                      </div>
                  </div>

                  <div className={`p-6 md:p-10 rounded-3xl shadow-xl border mb-8 ${cardBg}`}>
                      <h3 className={`text-xl md:text-2xl font-bold leading-relaxed mb-8 ${textColor}`}>
                          {question.question}
                      </h3>
                      <div className="space-y-4">
                          {question.options.map((option, idx) => {
                              const isSelected = userAnswers[currentQIndex] === idx;
                              return (
                                  <button key={idx} onClick={() => handleOptionSelect(idx)} className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${isSelected ? optSelected : optBorder}`}>
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-colors ${isSelected ? circleSelected : circleDefault}`}>{String.fromCharCode(65 + idx)}</div>
                                      <span className={`font-medium text-lg ${isSelected ? (isDark ? 'text-cyan-100' : 'text-indigo-900') : (isDark ? 'text-slate-300' : 'text-slate-700')}`}>{option}</span>
                                  </button>
                              );
                          })}
                      </div>
                  </div>

                  <div className="flex justify-between items-center">
                      <button onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))} disabled={currentQIndex === 0} className={`font-bold disabled:opacity-30 px-4 ${isDark ? 'text-cyan-600 hover:text-cyan-400' : 'text-slate-500 hover:text-slate-800'}`}>Back</button>
                      <button onClick={handleNextQuestion} className={`px-8 py-3 text-white rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2 ${isDark ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-900 hover:bg-slate-800'}`}>{currentQIndex === quizData.length - 1 ? `${txt.submit} 🏁` : `${txt.next} →`}</button>
                  </div>
              </div>
          );
      }

      if (quizState === 'result') {
          const score = userAnswers.filter((ans, idx) => ans === quizData[idx].correctAnswerIndex).length;
          const percentage = Math.round((score / quizData.length) * 100);
          
          return (
              <div className="max-w-3xl mx-auto py-8 animate-fade-in pb-20">
                  <div className={`rounded-3xl p-8 text-white text-center shadow-2xl mb-10 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-cyan-800 to-blue-900 shadow-cyan-900/50' : 'bg-gradient-to-br from-indigo-600 to-purple-700 shadow-indigo-200'}`}>
                       <div className="relative z-10">
                           <h2 className="text-2xl font-bold mb-2 opacity-90">{txt.result}</h2>
                           <div className="text-6xl font-black mb-4 tracking-tight">{score} <span className="text-3xl opacity-60 font-medium">/ {quizData.length}</span></div>
                           <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold mb-6">{percentage >= 80 ? '🌟 Excellent!' : percentage >= 50 ? '👍 Good Effort' : '📚 Needs Improvement'}</div>
                           <div className="flex justify-center gap-4">
                               <button onClick={handleResetQuiz} className={`px-6 py-2 bg-white rounded-xl font-bold transition-colors shadow-lg ${isDark ? 'text-cyan-900 hover:bg-cyan-50' : 'text-indigo-600 hover:bg-indigo-50'}`}>{txt.playAgain}</button>
                               <button onClick={() => setMode('overview')} className={`px-6 py-2 border rounded-xl font-bold transition-colors ${isDark ? 'bg-cyan-900 text-white border-cyan-500 hover:bg-cyan-800' : 'bg-indigo-800 text-white border-indigo-500 hover:bg-indigo-700'}`}>{txt.exit}</button>
                           </div>
                       </div>
                  </div>

                  <div className="space-y-6">
                      {quizData.map((q, idx) => {
                          const userAns = userAnswers[idx];
                          const correctAns = q.correctAnswerIndex;
                          const isCorrect = userAns === correctAns;
                          const cardClass = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';

                          return (
                              <div key={idx} className={`p-6 rounded-2xl border-l-4 shadow-sm ${cardClass} ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                                  <div className="flex gap-4 mb-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>{idx + 1}</div>
                                      <div className="flex-1">
                                          <h4 className={`font-bold text-lg mb-3 ${textColor}`}>{q.question}</h4>
                                          <div className="space-y-2 mb-4">
                                              {q.options.map((opt, optIdx) => {
                                                  let optionClass = isDark ? "p-3 rounded-lg border border-slate-700 text-slate-400" : "p-3 rounded-lg border border-slate-100 text-slate-600";
                                                  if (optIdx === correctAns) optionClass = isDark ? "p-3 rounded-lg border border-green-500/50 bg-green-900/30 text-green-400 font-bold" : "p-3 rounded-lg border border-green-200 bg-green-50 text-green-800 font-bold";
                                                  else if (optIdx === userAns && !isCorrect) optionClass = isDark ? "p-3 rounded-lg border border-red-500/50 bg-red-900/30 text-red-400" : "p-3 rounded-lg border border-red-200 bg-red-50 text-red-800";
                                                  return (
                                                      <div key={optIdx} className={optionClass}>
                                                          {String.fromCharCode(65 + optIdx)}. {opt}
                                                          {optIdx === correctAns && <span className="float-right">✅</span>}
                                                          {optIdx === userAns && !isCorrect && <span className="float-right">❌</span>}
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                          <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-800'}`}><strong>💡 {txt.explanation}:</strong> {q.explanation}</div>
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          );
      }
  }

  // --- EXAM SATHI (CHAT) VIEW ---
  if (mode === 'sathi') {
    const inputClass = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900';

    return (
        <div className={`max-w-3xl mx-auto h-[calc(100vh-130px)] flex flex-col rounded-2xl shadow-xl overflow-hidden border animate-fade-in ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
             
             {/* Chat Header */}
             <div className={`p-4 flex justify-between items-center shadow-md shrink-0 ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
                 <div className="flex items-center gap-3">
                     <button onClick={() => setMode('overview')} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                     </button>
                     <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl border-2 border-white/20">🤖</div>
                         <div>
                             <h3 className="font-bold leading-none">{txt.chatTitle}</h3>
                             <span className="text-[10px] text-green-400 font-bold tracking-wide uppercase flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> {txt.online}
                             </span>
                         </div>
                     </div>
                 </div>
                 <button onClick={handleClearChat} className="text-xs bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-300 px-3 py-1.5 rounded-lg transition-all">{txt.clearChat}</button>
             </div>

             {/* Model Toggles - Deep Think REMOVED */}
             <div className={`flex p-2 gap-2 border-b ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <button onClick={() => setChatMode('standard')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${chatMode === 'standard' ? (isDark ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-indigo-600 border-indigo-100 shadow-sm') : 'border-transparent opacity-50 hover:opacity-100'}`}>
                    ⚡ {txt.modeStandard}
                </button>
                <button onClick={() => setChatMode('web')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${chatMode === 'web' ? (isDark ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-blue-600 border-blue-100 shadow-sm') : 'border-transparent opacity-50 hover:opacity-100'}`}>
                    🌍 {txt.modeWeb}
                </button>
             </div>

             {/* Messages Area */}
             <div className={`flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                 {messages.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                             msg.sender === 'user' 
                             ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none' 
                             : (isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white text-slate-700 border border-slate-100') + ' rounded-bl-none'
                         }`}>
                             {msg.text ? msg.text.split('\n').map((line, i) => (
                                 <p key={i} className={`min-h-[1rem] ${i > 0 ? 'mt-2' : ''}`}>
                                     {line.split(/(\*\*.*?\*\*)/g).map((part, j) => 
                                         part.startsWith('**') && part.endsWith('**') 
                                         ? <strong key={j} className={isDark ? 'text-yellow-300' : 'text-indigo-700'}>{part.slice(2, -2)}</strong> 
                                         : part
                                     )}
                                 </p>
                             )) : (
                                 <span className="animate-pulse">Thinking...</span>
                             )}
                         </div>
                     </div>
                 ))}
                 <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className={`p-4 border-t shrink-0 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                 <div className="flex gap-2 relative">
                     <input 
                         type="text" 
                         value={inputMsg}
                         onChange={(e) => setInputMsg(e.target.value)}
                         onKeyDown={handleKeyDown}
                         placeholder={txt.typeDoubt}
                         className={`flex-1 p-4 pr-12 rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all ${inputClass} ${isDark ? 'focus:ring-cyan-500' : 'focus:ring-indigo-300'}`}
                     />
                     <button 
                         onClick={handleSend}
                         disabled={!inputMsg.trim() || isStreaming}
                         className={`absolute right-2 top-2 bottom-2 aspect-square text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${isDark ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-900 hover:bg-indigo-600'}`}
                     >
                         {isStreaming ? (
                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                         )}
                     </button>
                 </div>
             </div>
        </div>
    );
  }

  return null;
};

export default AIToolsPanel;
