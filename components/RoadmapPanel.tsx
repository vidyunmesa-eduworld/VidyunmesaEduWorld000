
import React, { useState } from 'react';
import { Language } from '../types';

interface RoadmapPanelProps {
  onBack: () => void;
  language: Language;
}

const GRADIENT_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600";

// --- TRANSLATION HELPER FOR EXAM DATA ---
const getExamData = (lang: Language) => [
  {
    id: 'ssc',
    name: 'SSC CGL / CHSL',
    icon: '🏛️',
    description: lang === 'hi' 
      ? 'सबसे प्रतिष्ठित कर्मचारी चयन परीक्षाएं। गति, सटीकता और मजबूत अंकगणित की आवश्यकता है।'
      : 'The most prestigious staff selection exams. Requires speed, accuracy, and strong arithmetic.',
    phases: [
      {
        title: lang === 'hi' ? 'नींव चरण (Foundation)' : 'Foundation Phase',
        duration: lang === 'hi' ? 'महीने 1-3' : 'Months 1-3',
        focus: lang === 'hi' ? 'कॉन्सेप्ट स्पष्टता और मूल सिलेबस' : 'Concept Clarity & Basic Syllabus',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        tasks: lang === 'hi' ? [
          'Maths: अंकगणित पूरा करें (प्रतिशत, अनुपात, लाभ/हानि)।',
          'English: व्याकरण के नियम (Part of Speech, Tense)।',
          'Reasoning: वर्बल रीजनिंग टॉपिक्स कवर करें।',
          'Daily: 15 मिनट संपादकीय (Editorial) पढ़ना।'
        ] : [
          'Maths: Complete Arithmetic (Percentage, Ratio, Profit/Loss).',
          'English: Master Grammar Rules (Part of Speech, Tense).',
          'Reasoning: Cover Verbal Reasoning topics.',
          'Daily: 15 mins Editorial Reading.'
        ]
      },
      {
        title: lang === 'hi' ? 'मजबूती चरण' : 'Strengthening Phase',
        duration: lang === 'hi' ? 'महीने 4-5' : 'Months 4-5',
        focus: lang === 'hi' ? 'एडवांस्ड मैथ्स और शब्दावली' : 'Advanced Maths & Vocabulary',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        tasks: lang === 'hi' ? [
          'Maths: एडवांस्ड मैथ्स शुरू करें (ज्यामिति, त्रिकोणमिति)।',
          'English: वन वर्ड सब्स्टीट्यूशन और मुहावरे (Blackbook) याद करें।',
          'GS: स्मार्ट नोट्स के जरिए स्टेटिक जीके (इतिहास, राजव्यवस्था) कवर करें।',
          'सेक्शनल मॉक टेस्ट देना शुरू करें।'
        ] : [
          'Maths: Start Advanced Maths (Geometry, Trigonometry, Algebra).',
          'English: Memorize One Word Substitutions & Idioms (Blackbook).',
          'GS: Cover Static GK (History, Polity) via Smart Notes.',
          'Start taking Sectional Mock Tests.'
        ]
      },
      {
        title: lang === 'hi' ? 'महारत चरण' : 'Mastery Phase',
        duration: lang === 'hi' ? 'महीना 6' : 'Month 6',
        focus: lang === 'hi' ? 'गति और सटीकता' : 'Speed & Accuracy',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        tasks: lang === 'hi' ? [
          'Daily 1 फुल मॉक टेस्ट (Pre Level)।',
          'कमजोर क्षेत्रों का कड़ाई से विश्लेषण करें।',
          'Current Affairs: पिछले 6 महीने का रिवीजन करें।',
          'Maths: कैलकुलेशन ड्रिल (वर्ग, घन) का अभ्यास करें।'
        ] : [
          'Daily 1 Full Mock Test (Pre Level).',
          'Analyze weak areas rigorously.',
          'Current Affairs: Revise last 6 months.',
          'Maths: Practice calculation drills (Squares, Cubes).'
        ]
      },
      {
        title: lang === 'hi' ? 'अंतिम लैप' : 'Final Lap',
        duration: lang === 'hi' ? 'परीक्षा का महीना' : 'Exam Month',
        focus: lang === 'hi' ? 'रिवीजन और माइंडसेट' : 'Revision & Mindset',
        color: 'bg-green-100 text-green-700 border-green-200',
        tasks: lang === 'hi' ? [
          'रोजाना फॉर्मूला नोटबुक रिवाइज करें।',
          'गलत मॉक सवालों को दोबारा हल करें।',
          'अच्छी नींद लें और परीक्षा शिफ्ट के अनुसार बायोलॉजिकल क्लॉक सेट करें।'
        ] : [
          'Revise Formula Notebook daily.',
          'Re-attempt incorrect mock questions.',
          'Sleep well and maintain a biological clock matching exam shift.'
        ]
      }
    ]
  },
  {
    id: 'railway',
    name: lang === 'hi' ? 'रेलवे NTPC / Group D' : 'Railway NTPC / Group D',
    icon: '🚂',
    description: lang === 'hi' 
      ? 'सामान्य विज्ञान, रीजनिंग और करंट अफेयर्स पर भारी फोकस, साथ में मध्यम स्तर का मैथ्स।'
      : 'Focuses heavily on General Science, Reasoning, and Current Affairs with moderate Maths.',
    phases: [
      {
        title: lang === 'hi' ? 'विज्ञान और मूल बातें' : 'Science & Basics',
        duration: lang === 'hi' ? 'महीने 1-2' : 'Months 1-2',
        focus: lang === 'hi' ? 'NCERT विज्ञान और बेसिक मैथ्स' : 'NCERT Science & Basic Maths',
        color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        tasks: lang === 'hi' ? [
          'Science: कक्षा 9 और 10 की NCERT पढ़ें (Physics, Chem, Bio)।',
          'Maths: नंबर सिस्टम और कमर्शियल मैथ्स पर फोकस करें।',
          'Reasoning: कोडिंग-डिकोडिंग, सीरीज, सादृश्यता।'
        ] : [
          'Science: Read NCERT Class 9 & 10 (Physics, Chem, Bio).',
          'Maths: Focus on Number System & Commercial Maths.',
          'Reasoning: Coding-Decoding, Series, Analogy.'
        ]
      },
      {
        title: lang === 'hi' ? 'अभ्यास चरण' : 'Practice Phase',
        duration: lang === 'hi' ? 'महीने 3-4' : 'Months 3-4',
        focus: lang === 'hi' ? 'पिछले वर्षों के प्रश्न (PYQ)' : 'Previous Year Questions (PYQ)',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        tasks: lang === 'hi' ? [
          'पिछले 5 वर्षों के रेलवे पेपर्स हल करें।',
          'GS: रेलवे-विशिष्ट स्टेटिक जीके पर फोकस करें।',
          'Current Affairs: स्पीडी/एड्यूटेरिया वार्षिक पत्रिकाएं।'
        ] : [
          'Solve last 5 years Railway Papers (Platform/Youth books).',
          'GS: Focus on Railway-specific static GK.',
          'Current Affairs: Speddy/Eduteria yearly magazines.'
        ]
      },
      {
        title: lang === 'hi' ? 'गति चरण' : 'Speed Phase',
        duration: lang === 'hi' ? 'महीना 5' : 'Month 5',
        focus: lang === 'hi' ? 'मॉक टेस्ट और विश्लेषण' : 'Mock Tests & Analysis',
        color: 'bg-rose-100 text-rose-700 border-rose-200',
        tasks: lang === 'hi' ? [
          'रोजाना CBT-1 फुल मॉक टेस्ट दें।',
          'सटीकता पर ध्यान दें (नेगेटिव मार्किंग से बचें)।',
          'आवर्त सारणी और SI इकाइयों को अच्छी तरह रिवाइज करें।'
        ] : [
          'Attempt CBT-1 Full Mocks daily.',
          'Focus on accuracy (Avoid negative marking).',
          'Revise Periodic Table and SI Units thoroughly.'
        ]
      }
    ]
  },
  {
    id: 'state',
    name: lang === 'hi' ? 'राज्य परीक्षा (Police/PSC)' : 'State Exams (Police/PSC)',
    icon: '👮',
    description: lang === 'hi'
      ? 'राज्य जीके, हिंदी/क्षेत्रीय भाषा और सामान्य जागरूकता का संतुलित ज्ञान आवश्यक है।'
      : 'Requires balanced knowledge of State GK, Hindi/Regional Language, and General Awareness.',
    phases: [
      {
        title: lang === 'hi' ? 'राज्य विशिष्ट' : 'State Specifics',
        duration: lang === 'hi' ? 'महीने 1-2' : 'Months 1-2',
        focus: lang === 'hi' ? 'क्षेत्रीय ज्ञान और भाषा' : 'Regional Knowledge & Language',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        tasks: lang === 'hi' ? [
          'राज्य का नक्शा, संस्कृति और इतिहास का गहराई से अध्ययन करें।',
          'Language: व्याकरण (हिंदी/क्षेत्रीय) की मूल बातें सीखें।',
          'Polity: राज्य सरकार से संबंधित अनुच्छेदों पर ध्यान दें।'
        ] : [
          'Study State Map, Culture, and History deeply.',
          'Language: Master Grammar (Hindi/Regional) basics.',
          'Polity: Focus on Articles related to State Govt.'
        ]
      },
      {
        title: lang === 'hi' ? 'मुख्य विषय' : 'Core Subjects',
        duration: lang === 'hi' ? 'महीने 3-4' : 'Months 3-4',
        focus: lang === 'hi' ? 'GS और मानसिक योग्यता' : 'GS & Mental Aptitude',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        tasks: lang === 'hi' ? [
          'History/Geography: मानक पाठ्यपुस्तकें।',
          'Maths: सरल अंकगणितीय गणनाओं पर ध्यान दें।',
          'Mental Aptitude: पुलिस प्रणाली से संबंधित तर्क।'
        ] : [
          'History/Geography: Standard text books.',
          'Maths: Focus on simple arithmetic calculations.',
          'Mental Aptitude: Police system related reasoning.'
        ]
      },
      {
        title: lang === 'hi' ? 'ड्रिल चरण' : 'Drill Phase',
        duration: lang === 'hi' ? 'महीना 5' : 'Month 5',
        focus: lang === 'hi' ? 'मॉक ड्रिल' : 'Mock Drills',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        tasks: lang === 'hi' ? [
          'शारीरिक प्रशिक्षण (यदि लागू हो)।',
          'स्थानीय राज्य के पिछले पेपर्स हल करें।',
          'Current Affairs: राज्य + राष्ट्रीय मिश्रण।'
        ] : [
          'Physical Training (if applicable).',
          'Solve Local State Previous Papers.',
          'Current Affairs: State + National mix.'
        ]
      }
    ]
  }
];

const RoadmapPanel: React.FC<RoadmapPanelProps> = ({ onBack, language }) => {
  const [selectedExam, setSelectedExam] = useState<any | null>(null);

  const t = {
    back: language === 'hi' ? 'वापस' : 'Back',
    title: language === 'hi' ? 'अपना लक्ष्य चुनें' : 'Choose Your Target',
    desc: language === 'hi' 
      ? 'अपना परीक्षा लक्ष्य चुनें। हमने आपको शुरुआती से रेंकर तक ले जाने के लिए विशेषज्ञ-क्यूरेटेड रणनीतियाँ तैयार की हैं।' 
      : 'Select your exam goal. We have prepared expert-curated strategies to take you from beginner to ranker.',
    viewMap: language === 'hi' ? 'रोडमैप देखें' : 'View Roadmap',
    why: language === 'hi' ? 'रोडमैप क्यों अपनाएं?' : 'Why follow a Roadmap?',
    whyDesc: language === 'hi'
      ? 'निरंतरता तीव्रता को हरा देती है। अधिकांश छात्र प्रतिभा की कमी के कारण नहीं, बल्कि दिशा की कमी के कारण असफल होते हैं। ये रोडमैप टॉपर्स की रणनीतियों के विश्लेषण पर आधारित हैं।'
      : 'Consistency beats intensity. Most students fail not because of lack of talent, but lack of direction. These roadmaps are designed based on the analysis of top rankers strategies.',
    blueprint: language === 'hi' ? 'रणनीतिक खाका' : 'Strategic Blueprint',
    goal: language === 'hi' ? 'चरण लक्ष्य' : 'Phase Goal',
    plan: language === 'hi' ? 'कार्य योजना' : 'Action Plan',
    quote: language === 'hi' ? '"सफलता उत्साह खोए बिना विफलता से विफलता तक जाने में है।"' : '"Success consists of going from failure to failure without loss of enthusiasm."'
  };

  const EXAM_DATA = getExamData(language);

  // --- View 1: Selection Grid ---
  if (!selectedExam) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-2">
             <button onClick={onBack} className="self-start flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                {t.back}
             </button>
             <h2 className={`text-3xl md:text-4xl font-bold ${GRADIENT_TEXT}`}>{t.title}</h2>
             <p className="text-slate-500 max-w-2xl">{t.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {EXAM_DATA.map((exam) => (
            <div 
              key={exam.id} 
              onClick={() => setSelectedExam(exam)}
              className="group relative bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-indigo-200 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl overflow-hidden"
            >
               {/* Hover Effect Background */}
               <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    {exam.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{exam.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{exam.description}</p>
                  
                  <div className="flex items-center text-indigo-600 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                    {t.viewMap} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
           <div className="relative z-10 max-w-3xl">
              <h3 className="text-xl font-bold mb-2">{t.why}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t.whyDesc}
              </p>
           </div>
           <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent hidden md:block"></div>
        </div>
      </div>
    );
  }

  // --- View 2: Detailed Timeline ---
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
       {/* Header */}
       <div className="sticky top-4 z-40 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-lg p-4 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedExam(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex items-center gap-3">
               <span className="text-3xl">{selectedExam.icon}</span>
               <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedExam.name}</h2>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{t.blueprint}</span>
               </div>
            </div>
          </div>
       </div>

       {/* Timeline */}
       <div className="relative pl-4 md:pl-8 space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-12 top-4 bottom-4 w-1 bg-slate-200 rounded-full"></div>

          {selectedExam.phases.map((phase: any, index: number) => (
             <div key={index} className="relative flex gap-6 md:gap-10 group">
                {/* Dot */}
                <div className={`absolute left-6 md:left-10 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-purple-500' :
                    index === 2 ? 'bg-amber-500' : 'bg-green-500'
                }`}></div>

                {/* Content Card */}
                <div className={`flex-1 ml-6 md:ml-8 rounded-2xl p-6 border transition-all hover:shadow-lg hover:-translate-y-1 ${phase.color} bg-opacity-20 bg-white`}>
                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-black/5 pb-3">
                      <h3 className="text-xl font-bold">{phase.title}</h3>
                      <span className="text-xs font-bold px-3 py-1 bg-white/60 rounded-full backdrop-blur-sm shadow-sm uppercase tracking-wide mt-2 md:mt-0 w-fit">
                        ⏱️ {phase.duration}
                      </span>
                   </div>
                   
                   <div className="mb-4">
                      <p className="text-sm font-bold opacity-70 uppercase tracking-wider mb-1">{t.goal}</p>
                      <p className="font-medium text-lg leading-snug">{phase.focus}</p>
                   </div>

                   <div>
                      <p className="text-sm font-bold opacity-70 uppercase tracking-wider mb-2">{t.plan}</p>
                      <ul className="space-y-2">
                        {phase.tasks.map((task: string, tIdx: number) => (
                          <li key={tIdx} className="flex items-start gap-2 text-sm md:text-base leading-relaxed opacity-90">
                             <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"></span>
                             <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
             </div>
          ))}
       </div>

       {/* Footer Note */}
       <div className="mt-16 text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-500 italic">
            {t.quote}
          </p>
          <p className="font-bold text-slate-900 mt-2">- Winston Churchill</p>
       </div>
    </div>
  );
};

export default RoadmapPanel;
