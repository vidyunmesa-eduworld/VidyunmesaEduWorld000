// Exported: 11/27/2025, 4:02:33 PM
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

export const STATIC_NOTES: LibraryItem[] = [
  {
    "id": 1764239170343,
    "title": "lecttttt-1",
    "subject": "Polity",
    "time": "External Link",
    "pdfUrl": "https://archive.org/details/google-ai-studio",
    "isPrivate": false
  },
  {
    "id": 1764237128947,
    "title": "lect-1",
    "subject": "Polity",
    "time": "External Link",
    "pdfUrl": "[archiveorg google-ai-studio width=560 height=384 frameborder=0 webkitallowfullscreen=true mozallowfullscreen=true]",
    "isPrivate": false
  },
  {
    "id": 1764237031199,
    "title": "Lect-1 Introduction ",
    "subject": "Pharmaceutical Jurisprudence",
    "time": "External Link",
    "pdfUrl": "<iframe     src=\"https://archive.org/embed/google-ai-studio\" width=\"560\"     height=\"384\" frameborder=\"0\" webkitallowfullscreen=\"true\"     mozallowfullscreen=\"true\" allowfullscreen></iframe>",
    "isPrivate": false
  }
];