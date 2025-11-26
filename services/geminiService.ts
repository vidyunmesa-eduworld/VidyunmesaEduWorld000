
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { SmartNote, QuizQuestion, Language } from '../types';

// Safely access API key
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// ============================================================================
// 🔒 SYSTEM ARCHITECTURE LOCK: NOTE GENERATOR CORE
// ============================================================================
// The Prompts and logic for 'generateSmartNote' and 'convertRawTextToSmartNote'
// are LOCKED to specific personas ("World-Class Professor" & "Forensic Coach").
//
// DO NOT MODIFY the prompt structures below to "simplify" or "summarize" output.
// The "Zero Data Loss" and "Visual Engagement" rules are CRITICAL for this app.
// Future features must adapt to THIS standard, not the other way around.
// ============================================================================

// --- SAFETY SYSTEM CONSTANTS ---
const STORAGE_KEY = 'vidyunmesa_ai_usage';
// UPDATED: Strict 1400 Limit (Free Tier Safety Buffer)
const DAILY_LIMIT = 1400; 

// --- HELPER: WAIT FUNCTION ---
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- HELPER: JSON CLEANER ---
const cleanAndParseJSON = (text: string) => {
  try {
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstOpen = clean.indexOf('{');
    const firstArray = clean.indexOf('[');
    const start = (firstArray !== -1 && firstArray < firstOpen) ? firstArray : firstOpen;
    
    const lastClose = clean.lastIndexOf('}');
    const lastArray = clean.lastIndexOf(']');
    const end = (lastArray !== -1 && lastArray > lastClose) ? lastArray : lastClose;
    
    if (start !== -1 && end !== -1) {
      clean = clean.substring(start, end + 1);
    }

    return JSON.parse(clean);
  } catch (e) {
    return null;
  }
};

// --- HELPER: RETRY WRAPPER (Exponential Backoff) ---
// Future-proof: Retries up to 4 times with increasing delays (1s, 2s, 4s, 8s)
const runWithRetry = async <T>(operation: () => Promise<T>, retries = 4, delay = 1000): Promise<T> => {
  try {
    // Check API Key existence before attempting
    if (!apiKey) throw new Error("API Key is missing. Please configure Vercel environment variables.");
    
    return await operation();
  } catch (error: any) {
    const msg = error?.message || "";
    // Handle Quota (429), Service Unavailable (503), or internal API errors
    const isRetryable = msg.includes('429') || msg.includes('503') || msg.includes('quota') || msg.includes('fetch');
    
    if (isRetryable && retries > 0) {
      await wait(delay);
      return runWithRetry(operation, retries - 1, delay * 2); 
    }
    throw error;
  }
};

// --- SAFETY CHECK ---
const checkSafetyLimits = (): { allowed: boolean; message?: string } => {
  try {
    const today = new Date().toLocaleDateString();
    const stored = localStorage.getItem(STORAGE_KEY);
    let data = stored ? JSON.parse(stored) : { date: today, count: 0 };

    if (data.date !== today) data = { date: today, count: 0 };

    if (data.count >= DAILY_LIMIT) {
      return { allowed: false, message: "Daily Limit Reached (1400 Requests). Wait for tomorrow." };
    }

    data.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { allowed: true };
  } catch (error) {
    return { allowed: true };
  }
};

// --- EXPORTED USAGE GETTER FOR UI ---
export const getQuotaUsage = () => {
    try {
        const today = new Date().toLocaleDateString();
        const stored = localStorage.getItem(STORAGE_KEY);
        let data = stored ? JSON.parse(stored) : { date: today, count: 0 };
        
        // If date changed but user hasn't made a request yet, show 0
        if (data.date !== today) return { count: 0, limit: DAILY_LIMIT };
        
        return { count: data.count, limit: DAILY_LIMIT };
    } catch (e) {
        return { count: 0, limit: DAILY_LIMIT };
    }
};

// --- POWER FEATURE: STREAMING CHAT ---
export const getChatResponseStream = async function* (
  message: string, 
  history: {role: string, parts: {text: string}[]}[], 
  language: Language,
  mode: 'standard' | 'web'
) {
  const safety = checkSafetyLimits();
  if (!safety.allowed) {
    yield "⚠️ Daily Limit Reached (1400 Requests). Please try again tomorrow.";
    return;
  }

  if (!apiKey) {
      yield "⚠️ API Key missing. Please configure it in Settings.";
      return;
  }

  // 1. MODE CONFIGURATION
  let modelId = 'gemini-2.5-flash';
  let config: any = {};

  // Base instruction
  let sysInstruct = language === 'hi' 
    ? "Output Language: Hindi (Devanagari). Keep scientific terms in English brackets. Be a helpful tutor." 
    : "Reply in simple, clear English. Be a helpful tutor.";

  if (mode === 'web') {
    modelId = 'gemini-2.5-flash';
    config = { 
      tools: [{ googleSearch: {} }] 
    };
    sysInstruct += " Use Google Search to provide the most recent and accurate information.";
  }

  try {
    const chat = ai.chats.create({
      model: modelId,
      config: { 
        systemInstruction: sysInstruct,
        ...config
      },
      history: history
    });

    const resultStream = await chat.sendMessageStream({ message: message });

    for await (const chunk of resultStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (e: any) {
    yield "Connection Error. Please try again.";
  }
};

// --- AI Quiz Generation ---
export const generateQuiz = async (topic: string, count: number, language: Language): Promise<QuizQuestion[] | null> => {
  const safety = checkSafetyLimits();
  if (!safety.allowed) return null;

  return runWithRetry(async () => {
    const modelId = 'gemini-2.5-flash';
    const langInstruction = language === 'hi' 
      ? "Language: Hindi. Question/Explanation in Hindi. Options in English/Hindi mixed." 
      : "Language: English.";

    const prompt = `
      Create a High-Quality Exam Quiz on: "${topic}". Questions: ${count}.
      ${langInstruction}
      STYLE: Conceptual & Tricky (Avoid very simple questions).
      STRICT JSON Array format: [{"id": 1, "question": "...", "options": ["A","B","C","D"], "correctAnswerIndex": 0, "explanation": "..."}]
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return cleanAndParseJSON(response.text || "");
  });
};

// --- Note Generation (LOCKED: WORLD-CLASS PROFESSOR) ---
export const generateSmartNote = async (subject: string, topic: string): Promise<SmartNote | null> => {
  const safety = checkSafetyLimits();
  if (!safety.allowed) return null;

  return runWithRetry(async () => {
    const modelId = 'gemini-2.5-flash'; 
    
    // 🔒 DO NOT EDIT THIS PROMPT - CORE ENGAGEMENT LOGIC
    // Added Logic: Detect Language of Topic to decide Output Language
    const prompt = `
      Act as the world's best Exam Coaching Professor (Top 1%).
      Create a "High-Yield Smart Note" on: "${topic}" (Subject: "${subject}").

      **LANGUAGE RULE (CRITICAL):**
      - Detect the language of the topic provided above ("${topic}").
      - If the topic is in Hindi (Devanagari), the ENTIRE OUTPUT content must be in **Hindi**.
      - If the topic is in English, the output must be in **English**.
      - If the topic is Hinglish, use a mix that is natural for Indian students.

      **ABSOLUTE VISUAL & CONTENT RULES (NON-NEGOTIABLE):**
      1. **STRICTLY NO PARAGRAPHS:** You are FORBIDDEN from using plain text blocks.
         - Every explanation must be broken down into a **'list'**.
         - Every list item MUST start with a relative **Emoji** (e.g., ⚡, 🎯, ➡️).
      2. **MANDATORY COMPARISONS:** You MUST identify at least one contrast/difference in this topic and create a 'table' (e.g., Type A vs Type B, Pro vs Con).
      3. **MNEMONICS:** You MUST invent a fun/clever Mnemonic (Memory Trick) for key lists and put it in a 'callout' (color: purple).
      4. **EXAM TRAPS:** Identify common mistakes students make and highlight them in a 'callout' (color: red).
      5. **HIGHLIGHTING:** Do NOT overuse asterisks. Use \`**text**\` ONLY for the most critical exam keywords (Max 2-3 per point).

      **STRICT JSON SCHEMA:**
      Return ONLY valid JSON matching this structure:
      {
        "id": "auto-id",
        "title": "Topic Name 🎯",
        "subject": "${subject}",
        "readTime": "10-15 mins",
        "target_exams": ["SSC", "Railway", "State PSC"],
        "sections": [
           { "type": "callout", "title": "🚀 Core Concept", "color": "blue", "content": "Punchy definition..." },
           { "type": "list", "title": "⚡ Key Features", "items": ["🎯 Point 1...", "⚡ Point 2..."] },
           { "type": "table", "title": "📊 Comparison", "tableData": { "headers": ["Basis", "A", "B"], "rows": [["..", "..", ".."]] } },
           { "type": "callout", "title": "🧠 Mnemonic", "color": "purple", "content": "Remember: ..." },
           { "type": "callout", "title": "⚠️ Exam Trap", "color": "red", "content": "Don't confuse X with Y..." }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const noteData = cleanAndParseJSON(response.text || "");
    // Ensure ID exists if AI missed it
    if (noteData && (!noteData.id || noteData.id === 'auto-id')) {
        noteData.id = `gen-${Date.now()}`;
    }
    return noteData;
  });
};

// --- Convert Text to Note (LOCKED: ZERO DATA LOSS + ENGAGING) ---
export const convertRawTextToSmartNote = async (rawText: string): Promise<SmartNote | null> => {
  const safety = checkSafetyLimits();
  if (!safety.allowed) return null;

  return runWithRetry(async () => {
    const modelId = 'gemini-2.5-flash'; 
    const safeText = rawText.substring(0, 28000); 

    // 🔒 DO NOT EDIT THIS PROMPT - CORE INTEGRITY LOGIC
    // Updated Logic: "Same Language" policy
    const prompt = `
      Act as a "Forensic Exam Coach" who specializes in **100% Data Fidelity** combined with **World-Class Visual Teaching**.
      Convert the provided RAW TEXT into a structured "Smart Note" JSON.

      **RULE 1: STRICT LANGUAGE FIDELITY (CRITICAL)**
      - **DETECT the language** of the INPUT TEXT below.
      - Your JSON output content MUST be in the **EXACT SAME LANGUAGE** as the input.
      - **DO NOT TRANSLATE.** 
        - If input is Hindi -> Output Hindi (Devanagari).
        - If input is English -> Output English.
        - If input is Mixed (Hinglish) -> Output Mixed (keep terms as they are).
      - Maintain the original terminology strictly.

      **RULE 2: ZERO DATA LOSS (CRITICAL)**
      - Every single fact, number, date, name, condition, and example in the input text MUST be present in the output.
      - **DO NOT** summarize if it means losing detail. If the input has 50 specific points, your note must have 50 points.

      **RULE 3: VISUAL ENGAGEMENT (STRICTLY NO PARAGRAPHS)**
      - **NO PLAIN TEXT:** You are FORBIDDEN from using long blocks of text.
      - **TRANSFORM EVERYTHING:** 
         - Convert normal paragraphs into **Bullet Lists** with Emojis for EVERY point (e.g. 🔸, 🔹, ➡️).
         - Convert comparisons or data sets into **Tables** (Mandatory).
         - Put key definitions or warnings in **Callouts**.
      - **HIGHLIGHTING:** Use \`**text**\` to highlight EXAM KEYWORDS (High yield points only). Do not bold entire sentences.
      
      **RULE 4: MANDATORY VALUE ADDS**
      - **🧠 MNEMONICS:** You MUST invent at least one clever Mnemonic (Memory Trick) based on the content.
      - **⚠️ EXAM TRAPS:** Based on the text, identify a confusing point where a student might make a mistake.

      **INPUT TEXT:**
      "${safeText}"

      **OUTPUT SCHEMA:**
      Return valid JSON matching the SmartNote schema. Ensure the 'sections' array covers 100% of the input data but formatted beautifully.
      {
        "id": "auto-id",
        "title": "Generated Note 📝",
        "subject": "General",
        "readTime": "15 mins",
        "target_exams": ["All Exams"],
        "sections": [
           { "type": "callout", "title": "🚀 Concept", "color": "blue", "content": "Exact definition from text..." },
           { "type": "table", "title": "📊 Data Analysis", "tableData": { "headers": [".."], "rows": [[".."]] } },
           { "type": "list", "title": "⚡ Detailed Points", "items": ["🔸 Fact 1 from text", "🔹 Fact 2 from text"] },
           { "type": "callout", "title": "🧠 AI Mnemonic", "color": "purple", "content": "Remember this list using..." },
           { "type": "callout", "title": "⚠️ Potential Trap", "color": "red", "content": "Note the difference between..." }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const noteData = cleanAndParseJSON(response.text || "");
    if (noteData) noteData.id = `converted-${Date.now()}`;
    return noteData;
  });
};

// --- Translate to Hindi ---
export const translateSmartNote = async (note: SmartNote, targetLanguage: Language): Promise<SmartNote> => {
  const safety = checkSafetyLimits();
  if (!safety.allowed) return note;

  return runWithRetry(async () => {
    const modelId = 'gemini-2.5-flash';
    
    const prompt = `
      Translate this JSON content to **Hindi (Devanagari)**.
      1. Maintain EXACT JSON structure.
      2. Translate content, items, headers, rows.
      3. Keep Technical Terms in brackets (e.g., कोशिका [Cell]).
      4. Maintain Emojis if present.
      
      INPUT JSON: ${JSON.stringify(note)}
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const translated = cleanAndParseJSON(response.text || "");
    if (!translated) throw new Error("Translation Failed");
    return translated;
  });
}

// --- TTS Generation (High Quality) ---
export const generateSpeech = async (text: string, language: Language): Promise<string | null> => {
  const safety = checkSafetyLimits();
  if (!safety.allowed) return null;

  return runWithRetry(async () => {
    const modelId = "gemini-2.5-flash-preview-tts";
    const voiceName = 'Kore'; 

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  });
};
