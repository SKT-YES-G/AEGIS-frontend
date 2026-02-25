// types/triage.ts — FA_server (AI) 응답 타입

export type EvidenceSpan = {
  quote: string;
  interpretation: string;
};

export type ClassificationLog = {
  stage: number; // 2 | 3 | 4
  selection: string;
  confidence: string; // "높음" | "중간" | "낮음"
  evidence_spans: EvidenceSpan[];
  reason: string;
};

export type TriageState = {
  session_id: string;
  stage2_selection: string | null;
  stage3_selection: string | null;
  stage4_selection: string | null;
  final_ktas_level: number | null;
  retriage_target: string | null;
  retriage_action: string | null;
  additional_questions: string[];
  classification_log: ClassificationLog[];
};

export type TriageInputResponse = {
  session_id: string;
  message: string;
  state: TriageState;
};
