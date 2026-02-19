import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/screenshots/file",
        search: "*",
      },
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  // ローカルファイルシステムアクセスのためEdge Runtimeを無効化
  serverExternalPackages: [],
};

export default nextConfig;
