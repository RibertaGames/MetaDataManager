import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { ToastContainer } from "@/components/common/Toast";

export const metadata: Metadata = {
  title: "MetadataManager",
  description: "App Store / Google Play Metadata Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
