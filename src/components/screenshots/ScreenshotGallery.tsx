"use client";
import { useEffect, useState } from "react";
import { LANGUAGES } from "@/lib/constants/languages";
import Image from "next/image";

interface Screenshot { filename: string; url: string; }

interface Props {
  projectId: string;
  platform: "ios" | "android";
}

const ANDROID_TYPES = [
  { value: "phone", label: "Phone" },
  { value: "7inch", label: "7インチ" },
  { value: "10inch", label: "10インチ" },
];

export default function ScreenshotGallery({ projectId, platform }: Props) {
  const langs = LANGUAGES;
  const [lang, setLang] = useState(platform === "ios" ? "en-US" : "en-US");
  const [type, setType] = useState("phone");
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [enlarged, setEnlarged] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/screenshots?projectId=${projectId}&platform=${platform}&lang=${lang}&type=${type}`)
      .then((r) => r.json())
      .then((d) => setScreenshots(d.screenshots ?? []))
      .finally(() => setLoading(false));
  }, [projectId, platform, lang, type]);

  return (
    <div>
      {/* フィルター */}
      <div className="flex gap-4 mb-6 flex-wrap">
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
        {platform === "android" && (
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">タイプ</label>
            <div className="inline-flex border rounded overflow-hidden">
              {ANDROID_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-3 py-1 text-sm transition ${type === t.value ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
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
          {screenshots.map((s) => (
            <div
              key={s.filename}
              className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition"
              onClick={() => setEnlarged(s.url)}
            >
              <div className="relative aspect-[9/16] bg-gray-100">
                <Image src={s.url} alt={s.filename} fill className="object-contain" />
              </div>
              <div className="px-2 py-1 text-xs text-gray-500 truncate">{s.filename}</div>
            </div>
          ))}
        </div>
      )}

      {/* 拡大表示 */}
      {enlarged && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setEnlarged(null)}
        >
          <div className="relative max-w-screen-sm w-full mx-4">
            <Image src={enlarged} alt="screenshot" width={400} height={800} className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
