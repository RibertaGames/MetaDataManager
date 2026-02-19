"use client";
import { use } from "react";
import { useState } from "react";
import ScreenshotGallery from "@/components/screenshots/ScreenshotGallery";

export default function ScreenshotsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [platform, setPlatform] = useState<"ios" | "android">("android");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(["ios", "android"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-5 py-2 text-sm font-medium rounded-lg border transition
              ${platform === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
          >
            {p === "ios" ? "iOS" : "Android"}
          </button>
        ))}
      </div>
      <ScreenshotGallery projectId={projectId} platform={platform} />
    </div>
  );
}
