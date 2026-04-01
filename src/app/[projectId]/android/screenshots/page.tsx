"use client";
import { use } from "react";
import ScreenshotGallery from "@/components/screenshots/ScreenshotGallery";
import AppImageUploader from "@/components/app-images/AppImageUploader";

export default function AndroidScreenshotsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  return (
    <div className="space-y-8">
      {/* アイコン・フィーチャーグラフィック */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">📦 アプリアイコン・フィーチャーグラフィック</h2>
        <AppImageUploader projectId={projectId} platform="android" />
      </section>

      {/* スクリーンショット */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">📸 スクリーンショット</h2>
        <ScreenshotGallery projectId={projectId} platform="android" />
      </section>
    </div>
  );
}
