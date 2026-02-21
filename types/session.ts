// types/session.ts

export type DispatchSession = {
  sessionId: number;
  representativeName: string;
  status: "ACTIVE" | "COMPLETED";
  dispatchedAt: string;   // ISO
  completedAt: string | null;
};

export type CreateSessionRequest = {
  representativeName: string;
};
