"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = params?.projectId as string;
  const pathname = usePathname();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`)
        .then((r) => r.json())
        .then((d) => setProject(d));
    }
  }, [projectId]);

  // プラットフォームを判定
  const isIos = pathname.includes("/ios");
  const isAndroid = pathname.includes("/android");
  const currentPlatform = isIos ? "ios" : isAndroid ? "android" : "ios";

  // プラットフォームタブ
  const platformTabs = [
    { key: "ios", label: "📱 iOS", href: `/${projectId}/ios/metadata` },
    { key: "android", label: "🤖 Android", href: `/${projectId}/android/metadata` },
  ];

  // サブタブ（現在のプラットフォームに応じて）
  const subTabs = [
    { key: "metadata", label: "📝 メタデータ", href: `/${projectId}/${currentPlatform}/metadata` },
    { key: "config", label: "⚙️ 設定", href: `/${projectId}/${currentPlatform}/config` },
    { key: "screenshots", label: "📸 スクリーンショット", href: `/${projectId}/${currentPlatform}/screenshots` },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* プロジェクトヘッダー */}
      <div className="bg-white border-b border-gray-200 px-8 pt-5 pb-0">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {project?.name ?? "..."}
        </h1>

        {/* プラットフォームタブ（第1階層） */}
        <nav className="flex gap-2 mb-3">
          {platformTabs.map((tab) => {
            const active = currentPlatform === tab.key;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={`px-6 py-2.5 text-sm font-semibold rounded-t-lg transition
                  ${active
                    ? "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* サブタブ（第2階層） */}
        <nav className="flex gap-1 border-t border-gray-200 pt-2">
          {subTabs.map((tab) => {
            const active = pathname.includes(`/${tab.key}`);
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={`px-4 py-2 text-sm font-medium rounded-t transition border-b-2
                  ${active
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        {children}
      </div>
    </div>
  );
}
