// types/ktas.ts

export type PreKtasResponse = {
  aiKtasLevel: number;       // 1-5
  aiReasoning: string | null;
  paramedicKtasLevel: number | null;
  synced: boolean;
  createdAt: string;         // ISO
  updatedAt: string;         // ISO
};

export type UpdateAiKtasRequest = {
  level: number;       // 1-5
  reasoning?: string;
};

export type UpdateParamedicKtasRequest = {
  level: number;       // 1-5
};

export type ToggleSyncRequest = {
  synced: boolean;
};
