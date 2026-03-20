"use client";
import { use } from "react";
import ScreenshotGallery from "@/components/screenshots/ScreenshotGallery";

export default function AndroidScreenshotsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  return <ScreenshotGallery projectId={projectId} platform="android" />;
}
