// lib/env.ts
// ✅ 환경변수는 한 곳에서만 읽도록 통일 (나중에 백엔드 붙일 때 편함)
export const env = {
  // 비어 있으면 Next 내부 API(/api/...)를 그대로 사용
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
};
