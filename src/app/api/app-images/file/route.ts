import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProject } from "@/lib/fs/projectStore";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const projectId = searchParams.get("projectId");
  const platform = searchParams.get("platform");
  const lang = searchParams.get("lang");
  const imageType = searchParams.get("imageType");

  if (!projectId || !platform || !lang || !imageType) {
    return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
  }

  if (platform !== "android") {
    return NextResponse.json({ error: "アイコン・フィーチャーグラフィックはAndroidのみサポートされています" }, { status: 400 });
  }

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const dir = path.join(project.fastlanePath, "metadata", "android", lang, "images");
  const filename = imageType === "icon" ? "icon.png" : "featureGraphic.png";
  const filePath = path.join(dir, filename);

  // パストラバーサル防止
  if (!filePath.startsWith(path.resolve(project.fastlanePath))) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const contentType = "image/png";

  return new NextResponse(buffer, {
    headers: { "Content-Type": contentType },
  });
}
