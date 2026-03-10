"use client";
import { useEffect, useState } from "react";
import { LANGUAGES } from "@/lib/constants/languages";
import ScreenshotUploader from "./ScreenshotUploader";

interface Screenshot { filename: string; url: string; }

interface Props {
  projectId: string;
  platform: "ios" | "android";
}

// fastlane deliver のiOSデバイスフォルダ名に対応
const IOS_TYPES = [
  { value: "iphone67", label: 'iPhone 6.7"', required: true },
  { value: "iphone65", label: 'iPhone 6.5"', required: false },
  { value: "iphone55", label: 'iPhone 5.5"', required: false },
  { value: "ipad", label: "iPad Pro", required: false },
];

const ANDROID_TYPES = [
  { value: "phone", label: "Phone", required: true },
  { value: "7inch", label: "7インチ", required: false },
  { value: "10inch", label: "10インチ", required: false },
];

export default function ScreenshotGallery({ projectId, platform }: Props) {
  const langs = LANGUAGES;
  const [lang, setLang] = useState(platform === "ios" ? "ja" : "ja-JP");
  const [type, setType] = useState(platform === "ios" ? "iphone67" : "phone");
  const deviceTypes = platform === "ios" ? IOS_TYPES : ANDROID_TYPES;
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [enlarged, setEnlarged] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  // プラットフォーム切り替え時に言語とデバイスタイプを更新
  useEffect(() => {
    const currentLangEntry = LANGUAGES.find(l =>
      l.ios === lang || l.android === lang
    );
    if (currentLangEntry) {
      const newLang = platform === "ios" ? currentLangEntry.ios : currentLangEntry.android;
      setLang(newLang);
    }
    setType(platform === "ios" ? "iphone67" : "phone");
  }, [platform]);

  function loadScreenshots() {
    setLoading(true);
    fetch(`/api/screenshots?projectId=${projectId}&platform=${platform}&lang=${lang}&type=${type}`)
      .then((r) => r.json())
      .then((d) => setScreenshots(d.screenshots ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadScreenshots();
  }, [projectId, platform, lang, type]);

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newScreenshots = [...screenshots];
    const draggedItem = newScreenshots[draggedIndex];
    newScreenshots.splice(draggedIndex, 1);
    newScreenshots.splice(index, 0, draggedItem);

    setScreenshots(newScreenshots);
    setDraggedIndex(index);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  async function saveOrder() {
    setReordering(true);
    try {
      const orderedFilenames = screenshots.map(s => s.filename);
      const res = await fetch("/api/screenshots/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          platform,
          lang,
          type,
          orderedFilenames,
        }),
      });

      if (!res.ok) {
        alert("並び替えに失敗しました");
        return;
      }

      loadScreenshots();
    } finally {
      setReordering(false);
    }
  }

  return (
    <div>
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-4 flex-wrap items-center">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">言語</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="border rounded px-2 py-1 text-sm text-gray-900 bg-white"
            >
              {langs.map((l) => {
                const code = platform === "ios" ? l.ios : l.android;
                return <option key={code} value={code}>{l.label} ({code})</option>;
              })}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">デバイス</label>
            <div className="inline-flex border rounded overflow-hidden">
              {deviceTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-3 py-1 text-sm transition flex items-center gap-1 ${type === t.value ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  {t.label}
                  {t.required && (
                    <span className={`text-xs font-bold px-1 rounded ${type === t.value ? "bg-white/30 text-white" : "bg-red-100 text-red-500"}`}>
                      必須
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {screenshots.length > 0 && (
            <button
              onClick={saveOrder}
              disabled={reordering}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition font-medium"
            >
              {reordering ? "保存中..." : "並び順を保存"}
            </button>
          )}
          <button
            onClick={() => setShowUploader(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
          >
            + 追加
          </button>
        </div>
      </div>

      {/* ギャラリー */}
      {loading ? (
        <div className="text-center text-gray-500 py-16">読み込み中...</div>
      ) : screenshots.length === 0 ? (
        <div className="text-center text-gray-400 py-16 border-2 border-dashed rounded-lg">
          スクリーンショットが見つかりません
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {screenshots.map((s, index) => (
            <div
              key={s.filename}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`border rounded-lg overflow-hidden hover:shadow-md transition group relative cursor-move ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <div className="absolute top-2 left-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                {index + 1}
              </div>
              <div
                className="relative aspect-[9/16] bg-gray-100 cursor-pointer"
                onClick={() => setEnlarged(s.url)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.url} alt={s.filename} className="absolute inset-0 w-full h-full object-contain" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!confirm(`「${s.filename}」を削除しますか？`)) return;
                    fetch(`/api/screenshots?projectId=${projectId}&platform=${platform}&lang=${lang}&type=${type}&filename=${encodeURIComponent(s.filename)}`, { method: "DELETE" })
                      .then(() => loadScreenshots());
                  }}
                  className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition hidden group-hover:flex"
                >
                  ✕
                </button>
              </div>
              <div className="px-2 py-1 text-xs text-gray-500 truncate">{s.filename}</div>
            </div>
          ))}
        </div>
      )}

      {/* アップローダー */}
      {showUploader && (
        <ScreenshotUploader
          projectId={projectId}
          platform={platform}
          lang={lang}
          type={type}
          onDone={() => {
            setShowUploader(false);
            loadScreenshots();
          }}
          onClose={() => setShowUploader(false)}
        />
      )}

      {/* 拡大表示 */}
      {enlarged && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setEnlarged(null)}
        >
          <div className="relative max-w-screen-sm w-full mx-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={enlarged} alt="screenshot" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
