import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProject } from "@/lib/fs/projectStore";
import {
  ANDROID_SCREENSHOT_TYPES,
  DEFAULT_ANDROID_SCREENSHOT_FOLDER,
} from "@/lib/constants/define";

export async function POST(req: NextRequest) {
  try {
    const { projectId, platform, lang, type, orderedFilenames } = await req.json();

    if (!projectId || !platform || !lang || !type || !Array.isArray(orderedFilenames)) {
      return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
    }

    const project = getProject(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let dir: string;
    if (platform === "android") {
      const folderName = ANDROID_SCREENSHOT_TYPES[type] ?? DEFAULT_ANDROID_SCREENSHOT_FOLDER;
      dir = path.join(project.fastlanePath, "metadata", "android", lang, "images", folderName);
    } else {
      // iOS: fastlane/screenshots/{lang}/ (Fastlaneが解像度から自動判定)
      dir = path.join(project.fastlanePath, "screenshots", lang);
    }

    if (!fs.existsSync(dir)) {
      return NextResponse.json({ error: "Directory not found" }, { status: 404 });
    }

    // 一時ディレクトリを作成
    const tempDir = path.join(dir, ".tmp_reorder");
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      // ファイルを一時ディレクトリに移動
      for (const filename of orderedFilenames) {
        const src = path.join(dir, filename);
        const temp = path.join(tempDir, filename);
        if (fs.existsSync(src)) {
          fs.renameSync(src, temp);
        }
      }

      // 番号プレフィックスを付けて元のディレクトリに戻す
      orderedFilenames.forEach((filename, index) => {
        const temp = path.join(tempDir, filename);
        if (!fs.existsSync(temp)) return;

        // 既存の番号プレフィックスを削除
        const cleanName = filename.replace(/^\d+_/, "");
        const newName = `${String(index + 1).padStart(2, "0")}_${cleanName}`;
        const dest = path.join(dir, newName);

        fs.renameSync(temp, dest);
      });

      // 一時ディレクトリを削除
      fs.rmdirSync(tempDir);

      return NextResponse.json({ success: true });
    } catch (error) {
      // エラー時は一時ディレクトリのファイルを戻す
      if (fs.existsSync(tempDir)) {
        const tempFiles = fs.readdirSync(tempDir);
        for (const file of tempFiles) {
          fs.renameSync(path.join(tempDir, file), path.join(dir, file));
        }
        fs.rmdirSync(tempDir);
      }
      throw error;
    }
  } catch (error) {
    console.error("Screenshot reorder error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
