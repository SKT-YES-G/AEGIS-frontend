// types/tmap.d.ts
export {};

declare global {
  interface Window {
    // ✅ any 금지 → unknown으로
    Tmapv3?: unknown;
  }
}