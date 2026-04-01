"use client";
import { useEffect, useState } from "react";
import { LANGUAGES } from "@/lib/constants/define";

interface Props {
  projectId: string;
  platform: "android";
}

interface ImageData {
  exists: boolean;
  url?: string;
  filename?: string;
}

const IMAGE_SPECS = {
  icon: {
    label: "アプリアイコン",
    size: "512 x 512",
    maxSize: "1 MB",
    required: true,
  },
  featureGraphic: {
    label: "フィーチャーグラフィック",
    size: "1024 x 500",
    maxSize: "15 MB",
    required: true,
  },
};

export default function AppImageUploader({ projectId, platform }: Props) {
  const langs = LANGUAGES;
  const [lang, setLang] = useState("ja-JP");
  const [iconData, setIconData] = useState<ImageData>({ exists: false });
  const [featureGraphicData, setFeatureGraphicData] = useState<ImageData>({ exists: false });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  function loadImages() {
    setLoading(true);
    Promise.all([
      fetch(`/api/app-images?projectId=${projectId}&platform=${platform}&lang=${lang}&imageType=icon`).then((r) => r.json()),
      fetch(`/api/app-images?projectId=${projectId}&platform=${platform}&lang=${lang}&imageType=featureGraphic`).then((r) => r.json()),
    ])
      .then(([icon, feature]) => {
        setIconData(icon);
        setFeatureGraphicData(feature);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadImages();
  }, [projectId, platform, lang]);

  async function handleUpload(imageType: "icon" | "featureGraphic", file: File) {
    setUploading(imageType);
    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("platform", platform);
      formData.append("lang", lang);
      formData.append("imageType", imageType);
      formData.append("file", file);

      const res = await fetch("/api/app-images/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("アップロードに失敗しました");
        return;
      }

      loadImages();
    } finally {
      setUploading(null);
    }
  }

  async function handleDelete(imageType: "icon" | "featureGraphic") {
    if (!confirm(`${IMAGE_SPECS[imageType].label}を削除しますか？`)) return;

    const res = await fetch(
      `/api/app-images?projectId=${projectId}&platform=${platform}&lang=${lang}&imageType=${imageType}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      alert("削除に失敗しました");
      return;
    }

    loadImages();
  }

  function renderImageCard(imageType: "icon" | "featureGraphic", data: ImageData) {
    const spec = IMAGE_SPECS[imageType];
    const isUploading = uploading === imageType;

    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {spec.label}
              {spec.required && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-600">必須</span>
              )}
            </h3>
            <p className="text-sm text-gray-500">
              {spec.size} ピクセル / 最大 {spec.maxSize}
            </p>
          </div>
        </div>

        {data.exists && data.url ? (
          <div className="relative group">
            <div
              className={`border rounded overflow-hidden bg-gray-100 ${
                imageType === "icon" ? "w-32 h-32" : "w-full aspect-[1024/500]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.url} alt={spec.label} className="w-full h-full object-contain" />
            </div>
            <button
              onClick={() => handleDelete(imageType)}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-400">
            <p className="mb-4">画像が設定されていません</p>
            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition">
              {isUploading ? "アップロード中..." : "画像を選択"}
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(imageType, file);
                }}
              />
            </label>
          </div>
        )}

        {data.exists && (
          <div className="mt-3">
            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition text-sm">
              {isUploading ? "アップロード中..." : "画像を変更"}
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(imageType, file);
                }}
              />
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mr-2">言語</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border rounded px-3 py-2 text-sm text-gray-900 bg-white"
        >
          {langs.map((l) => {
            const code = l.android;
            return (
              <option key={code} value={code}>
                {l.label} ({code})
              </option>
            );
          })}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-16">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderImageCard("icon", iconData)}
          {renderImageCard("featureGraphic", featureGraphicData)}
        </div>
      )}
    </div>
  );
}
