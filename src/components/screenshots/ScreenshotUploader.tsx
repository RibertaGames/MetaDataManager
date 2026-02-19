"use client";
import { useEffect, useState } from "react";

interface DirEntry { name: string; path: string; }
interface ImageEntry { name: string; path: string; }

interface BrowseResult {
  current: string;
  parent: string | null;
  dirs: DirEntry[];
  images: ImageEntry[];
}

interface Props {
  projectId: string;
  platform: "ios" | "android";
  lang: string;
  type: string;
  onDone: () => void;
  onClose: () => void;
}

export default function ScreenshotUploader({ projectId, platform, lang, type, onDone, onClose }: Props) {
  const [result, setResult] = useState<BrowseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copying, setCopying] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [doneCount, setDoneCount] = useState<number | null>(null);

  async function browse(path?: string) {
    setLoading(true);
    setError("");
    setSelected(new Set());
    try {
      const url = path
        ? `/api/fs/images?path=${encodeURIComponent(path)}`
        : "/api/fs/images";
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        setManualInput(data.current);
      }
    } catch {
      setError("読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { browse(); }, []);

  function toggleSelect(imagePath: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(imagePath)) next.delete(imagePath);
      else next.add(imagePath);
      return next;
    });
  }

  function toggleSelectAll() {
    if (!result) return;
    if (selected.size === result.images.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(result.images.map((i) => i.path)));
    }
  }

  async function handleCopy() {
    if (selected.size === 0) return;
    setCopying(true);
    try {
      const res = await fetch("/api/screenshots/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          platform,
          lang,
          type,
          sourcePaths: Array.from(selected),
        }),
      });
      const data = await res.json();
      setDoneCount(data.copied ?? 0);
      setTimeout(() => {
        onDone();
      }, 1000);
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col" style={{ maxHeight: "85vh" }}>

        {/* ヘッダー */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">スクリーンショットを追加</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* パス入力 */}
        <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && browse(manualInput.trim())}
            placeholder="パスを直接入力..."
            className="flex-1 border rounded px-3 py-1.5 text-sm font-mono text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => browse(manualInput.trim())}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 border rounded hover:bg-gray-200 transition"
          >
            移動
          </button>
        </div>

        {/* 現在のパス */}
        {result && (
          <div className="px-5 py-2 bg-blue-50 border-b border-blue-100 text-xs font-mono text-blue-700 truncate">
            📁 {result.current}
          </div>
        )}

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {loading && <div className="text-center py-8 text-gray-400 text-sm">読み込み中...</div>}
          {error && <div className="text-center py-8 text-red-500 text-sm">{error}</div>}
          {!loading && result && (
            <div>
              {/* フォルダ一覧 */}
              <ul className="space-y-0.5 mb-3">
                {result.parent && (
                  <li>
                    <button
                      onClick={() => browse(result.parent!)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-600 text-left transition"
                    >
                      <span>⬆️</span>
                      <span className="font-medium">..</span>
                      <span className="text-gray-400 text-xs ml-1">上の階層へ</span>
                    </button>
                  </li>
                )}
                {result.dirs.map((dir) => (
                  <li key={dir.path}>
                    <button
                      onClick={() => browse(dir.path)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-sm text-gray-800 text-left transition"
                    >
                      <span>📁</span>
                      <span className="flex-1 truncate">{dir.name}</span>
                      <span className="text-blue-400 text-xs opacity-0 group-hover:opacity-100">開く →</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* 画像一覧 */}
              {result.images.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs text-gray-500">画像 {result.images.length}枚</span>
                    <button
                      onClick={toggleSelectAll}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {selected.size === result.images.length ? "選択解除" : "すべて選択"}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {result.images.map((img) => (
                      <div
                        key={img.path}
                        onClick={() => toggleSelect(img.path)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                          selected.has(img.path)
                            ? "border-blue-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="relative aspect-[9/16] bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/fs/image-preview?path=${encodeURIComponent(img.path)}`}
                            alt={img.name}
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                          {selected.has(img.path) && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="px-1 py-0.5 text-xs text-gray-500 truncate bg-white">{img.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.images.length === 0 && result.dirs.length === 0 && result.parent === null ? null : (
                result.images.length === 0 && result.dirs.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm">ファイルがありません</div>
                )
              )}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {doneCount !== null
              ? `✅ ${doneCount}枚をコピーしました`
              : `${selected.size}枚選択中`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50 transition"
            >
              キャンセル
            </button>
            <button
              onClick={handleCopy}
              disabled={selected.size === 0 || copying || doneCount !== null}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition font-medium"
            >
              {copying ? "コピー中..." : `${selected.size}枚を追加`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
