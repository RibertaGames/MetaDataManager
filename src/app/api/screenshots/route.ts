import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProject } from "@/lib/fs/projectStore";

const ANDROID_TYPES: Record<string, string> = {
  phone: "phoneScreenshots",
  "7inch": "sevenInchScreenshots",
  "10inch": "tenInchScreenshots",
};

// fastlane deliver が使うiOSデバイスフォルダ名
const IOS_TYPES: Record<string, string> = {
  iphone67: "iPhone 6.7",
  iphone65: "iPhone 6.5",
  iphone55: "iPhone 5.5",
  ipad: "iPad Pro (6th gen)",
};

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const platform = req.nextUrl.searchParams.get("platform");
  const lang = req.nextUrl.searchParams.get("lang");
  const type = req.nextUrl.searchParams.get("type") ?? (platform === "ios" ? "iphone67" : "phone");

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
    // iOS: fastlane/screenshots/{lang}/{device}/
    const deviceFolder = IOS_TYPES[type] ?? "iPhone 6.7";
    dir = path.join(project.fastlanePath, "screenshots", lang, deviceFolder);
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

export async function DELETE(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const platform = req.nextUrl.searchParams.get("platform");
  const lang = req.nextUrl.searchParams.get("lang");
  const type = req.nextUrl.searchParams.get("type") ?? (platform === "ios" ? "iphone67" : "phone");
  const filename = req.nextUrl.searchParams.get("filename");

  if (!projectId || !platform || !lang || !filename) {
    return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
  }

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  let dir: string;
  if (platform === "android") {
    const folderName = ANDROID_TYPES[type] ?? "phoneScreenshots";
    dir = path.join(project.fastlanePath, "metadata", "android", lang, "images", folderName);
  } else {
    const deviceFolder = IOS_TYPES[type] ?? "iPhone 6.7";
    dir = path.join(project.fastlanePath, "screenshots", lang, deviceFolder);
  }

  const filePath = path.join(dir, filename);

  // パストラバーサル防止
  if (!path.resolve(filePath).startsWith(path.resolve(project.fastlanePath))) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ deleted: filename });
}
