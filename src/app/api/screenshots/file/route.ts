import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProject } from "@/lib/fs/projectStore";

const ANDROID_TYPES: Record<string, string> = {
  phone: "phoneScreenshots",
  "7inch": "sevenInchScreenshots",
  "10inch": "tenInchScreenshots",
};

const IOS_TYPES: Record<string, string> = {
  iphone67: 'iPhone 6.7"',
  iphone65: 'iPhone 6.5"',
  iphone55: 'iPhone 5.5"',
  ipad: "iPad Pro (6th gen)",
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const projectId = searchParams.get("projectId");
  const platform = searchParams.get("platform");
  const lang = searchParams.get("lang");
  const type = searchParams.get("type") ?? (platform === "ios" ? "iphone67" : "phone");
  const filename = searchParams.get("filename");

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
    // iOS: fastlane/screenshots/{lang}/{device}/
    const deviceFolder = IOS_TYPES[type] ?? 'iPhone 6.7"';
    dir = path.join(project.fastlanePath, "screenshots", lang, deviceFolder);
  }

  const filePath = path.join(dir, filename);

  // パストラバーサル防止
  if (!filePath.startsWith(path.resolve(project.fastlanePath))) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg"
    : ext === ".webp" ? "image/webp"
    : "image/png";

  return new NextResponse(buffer, {
    headers: { "Content-Type": contentType },
  });
}
