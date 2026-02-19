"use client";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { showToast } from "@/components/common/Toast";
import { useRouter } from "next/navigation";
import FolderPicker from "@/components/projects/FolderPicker";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [fastlanePath, setFastlanePath] = useState("");
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data.projects ?? []);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditTarget(null); setName(""); setFastlanePath(""); setShowForm(true);
  }

  function openEdit(p: Project) {
    setEditTarget(p); setName(p.name); setFastlanePath(p.fastlanePath); setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !fastlanePath.trim()) {
      showToast("名前とfastlaneパスを入力してください", "error");
      return;
    }
    if (editTarget) {
      await fetch(`/api/projects/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, fastlanePath }),
      });
      showToast("プロジェクトを更新しました");
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, fastlanePath }),
      });
      showToast("プロジェクトを追加しました");
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string, projectName: string) {
    if (!confirm(`「${projectName}」を削除しますか？`)) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    showToast("削除しました");
    load();
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">プロジェクト管理</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition"
        >
          + 新しいプロジェクト
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center text-gray-400 py-16 border-2 border-dashed rounded-lg">
          <p className="text-lg mb-2">プロジェクトがありません</p>
          <p className="text-sm">「+ 新しいプロジェクト」からfastlaneプロジェクトを追加してください</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between hover:shadow-sm transition">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => router.push(`/${p.id}/ios`)}
              >
                <div className="font-semibold text-gray-800">{p.name}</div>
                <div className="text-xs text-gray-400 mt-0.5 font-mono">{p.fastlanePath}</div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => openEdit(p)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 transition"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 transition"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* フォームモーダル */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <h2 className="text-lg font-bold mb-4">
              {editTarget ? "プロジェクトを編集" : "新しいプロジェクトを追加"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">プロジェクト名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: Apple Game"
                  className="w-full border rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">fastlaneフォルダのパス</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fastlanePath}
                    onChange={(e) => setFastlanePath(e.target.value)}
                    placeholder="例: C:/Users/user/Documents/AppleGame/fastlane"
                    className="flex-1 border rounded px-3 py-2 text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="px-3 py-2 text-sm border rounded bg-gray-50 hover:bg-gray-100 text-gray-700 transition flex-shrink-0"
                  >
                    📁 参照
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">fastlaneフォルダ（metadata/ が含まれるフォルダ）の絶対パスを入力、または「参照」から選択してください</p>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm border rounded hover:bg-gray-50 transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {editTarget ? "更新" : "追加"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* フォルダ選択ピッカー */}
      {showPicker && (
        <FolderPicker
          initialPath={fastlanePath || undefined}
          onSelect={(selected) => {
            setFastlanePath(selected);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
