import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
