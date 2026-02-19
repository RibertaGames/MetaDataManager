"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";

export default function Sidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const params = useParams();
  const pathname = usePathname();
  const activeProjectId = params?.projectId as string | undefined;

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []));
  }, [pathname]);

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col py-4 flex-shrink-0">
      <div className="px-4 mb-6">
        <Link href="/projects" className="text-lg font-bold tracking-wide text-white hover:text-blue-400">
          MetadataManager
        </Link>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/${p.id}/ios`}
            className={`block px-3 py-2 rounded-md text-sm font-medium truncate transition
              ${activeProjectId === p.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}
          >
            {p.name}
          </Link>
        ))}
      </nav>

      <div className="px-2 mt-4 border-t border-gray-700 pt-4 space-y-1">
        <Link href="/projects" className="block px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-gray-700">
          + プロジェクト管理
        </Link>
        <Link href="/settings" className="block px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-gray-700">
          ⚙ 設定
        </Link>
      </div>
    </aside>
  );
}
