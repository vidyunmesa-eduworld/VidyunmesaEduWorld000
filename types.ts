
// SYSTEM LOCK: EDUCATION ONLY
// This file strictly defines types for the Education Suite (Notes, Quiz, Chat).
// ANY PRESENTATION/VIDEO TYPES ARE BANNED FROM THIS SCHEMA.

// --- Smart Note Types ---
export interface SmartNoteSection {
  type?: 'text' | 'list' | 'table' | 'callout' | 'formula' | string;
  title?: string;
  content?: any; // Relaxed to allow string, string[], or objects for legacy/AI data
  items?: any[]; // Relaxed to allow string[] or object[] for rich lists
  tableData?: { headers: string[]; rows: string[][] }; // For tables
  color?: string; // For callouts

  // Legacy/Data Compatibility Fields
  id?: string;
  content_type?: string;
  subsections?: SmartNoteSection[];
}

export interface SmartNote {
  id: string;
  title: string;
  subject?: string; 
  readTime?: string;
  target_exams?: string[];
  sections: SmartNoteSection[];
}

// --- Quiz Types ---
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

// --- App State Types ---
export type ViewState = 'home' | 'subjects' | 'reader' | 'admin' | 'ai-tools' | 'roadmap';
export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

// --- Social & Config Types ---
export interface SocialLink {
  id: string;
  platform: 'Telegram' | 'YouTube' | 'Instagram' | 'Email' | 'Website';
  url: string;
  label: string;
  youtubeUrl?: string;
}
