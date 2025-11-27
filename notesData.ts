// Exported: Fresh Start
import { SmartNote } from './types';

export interface LibraryItem {
  id: number;
  title: string;
  subject: string;
  time: string;
  pdfUrl?: string;
  youtubeUrl?: string;
  smartContent?: SmartNote;
  smartContentHindi?: SmartNote;
  isPrivate?: boolean;
}

// CLEAN SLATE - NO LEGACY LINKS
export const STATIC_NOTES: LibraryItem[] = [];
