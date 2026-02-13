// types/tmap.d.ts
// 목적: window.Tmapv3 타입 오류 방지 (SDK가 전역으로 주입됨)
export {};

declare global {
  interface Window {
    Tmapv3?: any;
  }
}