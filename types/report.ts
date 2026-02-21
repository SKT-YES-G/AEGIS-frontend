// types/report.ts

export type AmbulanceReport = {
  aiChecklistData: number[] | null;     // 68-item binary array
  checklistData: number[] | null;       // 68-item binary array (paramedic)
  sbp: number | null;
  dbp: number | null;
  rr: number | null;
  pr: number | null;
  tempC: number | null;
  spO2: number | null;
  glucose: number | null;
  aiSummary: string | null;
  chiefComplaint: string | null;
  assessment: string | null;
  incidentDateTime: string | null;      // ISO
  createdAt: string;
  updatedAt: string;
};

export type UpdateVitalsRequest = {
  sbp?: number;
  dbp?: number;
  rr?: number;
  pr?: number;
  tempC?: number;
  spO2?: number;
  glucose?: number;
};

export type UpdateSummaryRequest = {
  summary: string;
};

export type UpdateAiChecklistRequest = {
  aiChecklistData: number[];   // 68 items
};

export type UpdateChecklistRequest = {
  checklistData: number[];     // 68 items
};

export type UpdateAssessmentRequest = {
  chiefComplaint?: string;
  assessment?: string;
  incidentDateTime?: string;   // ISO
};
