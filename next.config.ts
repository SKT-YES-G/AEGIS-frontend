import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.aegis119.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // 백엔드 API 프록시 (CORS 우회)
      { source: "/api/auth/:path*", destination: `${API_URL}/api/auth/:path*` },
      { source: "/api/dispatch/:path*", destination: `${API_URL}/api/dispatch/:path*` },
      { source: "/api/medical/:path*", destination: `${API_URL}/api/medical/:path*` },
      { source: "/api/dev/:path*", destination: `${API_URL}/api/dev/:path*` },
      { source: "/test/:path*", destination: `${API_URL}/test/:path*` },
    ];
  },
};

export default nextConfig;
