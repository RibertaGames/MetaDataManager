"use client";
import { useEffect, useState } from "react";
import { Settings } from "@/types/project";
import { showToast } from "@/components/common/Toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({ deeplApiKey: "", deeplFreeApi: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    showToast("設定を保存しました");
  }

  if (loading) return <div className="p-8 text-gray-500">読み込み中...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">DeepL API キー</label>
          <input
            type="text"
            value={settings.deeplApiKey}
            onChange={(e) => setSettings({ ...settings, deeplApiKey: e.target.value })}
            placeholder="xxxx-xxxx-xxxx-xxxx"
            className="w-full border rounded px-3 py-2 text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-gray-400 mt-1">
            <a href="https://www.deepl.com/ja/pro-api" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              DeepL APIページ
            </a>
            でAPIキーを取得してください（無料プランで月50万文字まで利用可能）
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="freeApi"
            checked={settings.deeplFreeApi}
            onChange={(e) => setSettings({ ...settings, deeplFreeApi: e.target.checked })}
            className="w-4 h-4 accent-blue-600"
          />
          <label htmlFor="freeApi" className="text-sm text-gray-700">
            無料プランのAPIを使用する（api-free.deepl.com）
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition"
        >
          {saving ? "保存中..." : "設定を保存"}
        </button>
      </form>
    </div>
  );
}
