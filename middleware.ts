// middleware.ts
// Next.js rewrite가 Origin 헤더를 백엔드로 전달하면
// 백엔드 CORS 필터가 localhost를 거부하므로 Origin을 제거한다.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("origin");

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/api/dispatch/:path*",
    "/api/medical/:path*",
    "/api/dev/:path*",
    "/test/:path*",
  ],
};
