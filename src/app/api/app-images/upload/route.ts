import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProject } from "@/lib/fs/projectStore";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const projectId = formData.get("projectId") as string;
    const platform = formData.get("platform") as string;
    const lang = formData.get("lang") as string;
    const imageType = formData.get("imageType") as string;
    const file = formData.get("file") as File;

    if (!projectId || !platform || !lang || !imageType || !file) {
      return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
    }

    if (platform !== "android") {
      return NextResponse.json({ error: "アイコン・フィーチャーグラフィックはAndroidのみサポートされています" }, { status: 400 });
    }

    const project = getProject(projectId);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const dir = path.join(project.fastlanePath, "metadata", "android", lang, "images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filename = imageType === "icon" ? "icon.png" : "featureGraphic.png";
    const filePath = path.join(dir, filename);

    // パストラバーサル防止
    if (!path.resolve(filePath).startsWith(path.resolve(project.fastlanePath))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return NextResponse.json({ uploaded: filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "アップロード失敗" }, { status: 500 });
  }
}
