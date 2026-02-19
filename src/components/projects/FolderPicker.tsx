"use client";
import { useEffect, useState } from "react";

interface DirEntry {
  name: string;
  path: string;
}

interface BrowseResult {
  current: string;
  parent: string | null;
  dirs: DirEntry[];
}

interface Props {
  onSelect: (path: string) => void;
  onClose: () => void;
  initialPath?: string;
}

export default function FolderPicker({ onSelect, onClose, initialPath }: Props) {
  const [result, setResult] = useState<BrowseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualInput, setManualInput] = useState("");

  async function browse(path?: string) {
    setLoading(true);
    setError("");
    try {
      const url = path
        ? `/api/fs/browse?path=${encodeURIComponent(path)}`
        : "/api/fs/browse";
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

  useEffect(() => {
    browse(initialPath);
  }, []);

  async function handleManualGo() {
    if (manualInput.trim()) await browse(manualInput.trim());
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col" style={{ maxHeight: "80vh" }}>
        {/* ヘッダー */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-base">フォルダを選択</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* パス手動入力 */}
        <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualGo()}
            placeholder="パスを直接入力..."
            className="flex-1 border rounded px-3 py-1.5 text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleManualGo}
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

        {/* ディレクトリ一覧 */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {loading && (
            <div className="text-center py-8 text-gray-400 text-sm">読み込み中...</div>
          )}
          {error && (
            <div className="text-center py-8 text-red-500 text-sm">{error}</div>
          )}
          {!loading && result && (
            <ul className="space-y-0.5">
              {/* 上の階層へ */}
              {result.parent && (
                <li>
                  <button
                    onClick={() => browse(result.parent!)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-600 transition text-left"
                  >
                    <span className="text-base">⬆️</span>
                    <span className="font-medium">..</span>
                    <span className="text-gray-400 text-xs ml-1">上の階層へ</span>
                  </button>
                </li>
              )}

              {result.dirs.length === 0 && (
                <li className="text-center py-6 text-gray-400 text-sm">サブフォルダがありません</li>
              )}

              {result.dirs.map((dir) => (
                <li key={dir.path}>
                  <button
                    onClick={() => browse(dir.path)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-sm text-gray-800 transition text-left group"
                  >
                    <span className="text-base">📁</span>
                    <span className="flex-1 truncate">{dir.name}</span>
                    <span className="text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition">開く →</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* フッター：選択ボタン */}
        <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-400 font-mono truncate flex-1">
            {result?.current ?? ""}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50 transition"
            >
              キャンセル
            </button>
            <button
              onClick={() => result && onSelect(result.current)}
              disabled={!result}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition font-medium"
            >
              このフォルダを選択
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
