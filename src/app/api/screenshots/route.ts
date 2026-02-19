import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProject } from "@/lib/fs/projectStore";

const ANDROID_TYPES: Record<string, string> = {
  phone: "phoneScreenshots",
  "7inch": "sevenInchScreenshots",
  "10inch": "tenInchScreenshots",
};

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const platform = req.nextUrl.searchParams.get("platform");
  const lang = req.nextUrl.searchParams.get("lang");
  const type = req.nextUrl.searchParams.get("type") ?? "phone";

  if (!projectId || !platform || !lang) {
    return NextResponse.json({ error: "projectId, platform, lang は必須です" }, { status: 400 });
  }

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  let dir: string;
  if (platform === "android") {
    const folderName = ANDROID_TYPES[type] ?? "phoneScreenshots";
    dir = path.join(project.fastlanePath, "metadata", "android", lang, "images", folderName);
  } else {
    dir = path.join(project.fastlanePath, "metadata", lang, "screenshots");
  }

  if (!fs.existsSync(dir)) return NextResponse.json({ screenshots: [] });

  const files = fs.readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .map((f) => ({
      filename: f,
      url: `/api/screenshots/file?projectId=${projectId}&platform=${platform}&lang=${lang}&type=${type}&filename=${encodeURIComponent(f)}`,
    }));

  return NextResponse.json({ screenshots: files });
}
