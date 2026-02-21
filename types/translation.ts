// types/translation.ts

export type TranslationResponse = {
  translationId: number;
  speaker: string;
  originalText: string;
  translatedText: string;
  easyTranslation: string | null;
  language: string;
  createdAt: string; // ISO
};

export type SaveTranslationRequest = {
  speaker: string;
  originalText: string;
  translatedText: string;
  easyTranslation?: string | null;
  language: string;
};
