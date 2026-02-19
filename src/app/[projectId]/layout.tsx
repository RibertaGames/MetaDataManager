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

  const tabs = [
    { href: `/${projectId}/ios`, label: "iOS" },
    { href: `/${projectId}/android`, label: "Android" },
    { href: `/${projectId}/screenshots`, label: "Screenshots" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* プロジェクトヘッダー + タブ */}
      <div className="bg-white border-b border-gray-200 px-8 pt-5 pb-0">
        <h1 className="text-xl font-bold text-gray-800 mb-3">
          {project?.name ?? "..."}
        </h1>
        <nav className="flex gap-1">
          {tabs.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-5 py-2 text-sm font-medium rounded-t-lg transition border-b-2
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
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}
