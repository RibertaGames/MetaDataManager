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
  iphone67: "iPhone 6.7",
  iphone65: "iPhone 6.5",
  iphone55: "iPhone 5.5",
  ipad: "iPad Pro (6th gen)",
};

export async function POST(req: NextRequest) {
  try {
    const { projectId, platform, lang, type, sourcePaths } = await req.json();

    if (!projectId || !platform || !lang || !type || !Array.isArray(sourcePaths)) {
      return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
    }

    const project = getProject(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let destDir: string;
    if (platform === "android") {
      const folderName = ANDROID_TYPES[type] ?? "phoneScreenshots";
      destDir = path.join(project.fastlanePath, "metadata", "android", lang, "images", folderName);
    } else {
      const deviceFolder = IOS_TYPES[type] ?? "iPhone 6.7";
      destDir = path.join(project.fastlanePath, "screenshots", lang, deviceFolder);
    }

    console.log("Creating directory:", destDir);
    fs.mkdirSync(destDir, { recursive: true });

    let copied = 0;
    const errors: string[] = [];

    for (const src of sourcePaths) {
      try {
        const resolvedSrc = path.resolve(src);
        const filename = path.basename(resolvedSrc);
        const dest = path.join(destDir, filename);

        console.log("Copying:", resolvedSrc, "->", dest);
        fs.copyFileSync(resolvedSrc, dest);
        copied++;
      } catch (err) {
        console.error("Failed to copy:", src, err);
        errors.push(src);
      }
    }

    return NextResponse.json({ copied, errors });
  } catch (error) {
    console.error("Screenshot copy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
