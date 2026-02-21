// services/auth.service.ts
import { http } from "./http";
import { tokenStore } from "./token";
import type { LoginRequest, LoginResponse, FireStationSearchItem } from "@/types/auth";

export const authService = {
  /** 로그인: 토큰 저장까지 처리 */
  async login(req: LoginRequest): Promise<LoginResponse> {
    const data = await http.noAuth.post<LoginResponse>("/api/auth/login", req);
    tokenStore.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  /** 로그아웃: 서버 호출 + 로컬 토큰 삭제 */
  async logout(): Promise<void> {
    try {
      await http.post("/api/auth/logout");
    } finally {
      tokenStore.clear();
    }
  },

  /** 소방서 이름 검색 */
  searchFireStations(query: string): Promise<FireStationSearchItem[]> {
    return http.noAuth.get<FireStationSearchItem[]>(
      `/api/auth/fire-stations/search?query=${encodeURIComponent(query)}`,
    );
  },
};
