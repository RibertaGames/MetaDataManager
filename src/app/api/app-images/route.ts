import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProject } from "@/lib/fs/projectStore";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const platform = req.nextUrl.searchParams.get("platform");
  const lang = req.nextUrl.searchParams.get("lang");
  const imageType = req.nextUrl.searchParams.get("imageType"); // "icon" or "featureGraphic"

  if (!projectId || !platform || !lang || !imageType) {
    return NextResponse.json({ error: "projectId, platform, lang, imageType は必須です" }, { status: 400 });
  }

  if (platform !== "android") {
    return NextResponse.json({ error: "アイコン・フィーチャーグラフィックはAndroidのみサポートされています" }, { status: 400 });
  }

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const dir = path.join(project.fastlanePath, "metadata", "android", lang, "images");
  const filename = imageType === "icon" ? "icon.png" : "featureGraphic.png";
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ exists: false });
  }

  const url = `/api/app-images/file?projectId=${projectId}&platform=${platform}&lang=${lang}&imageType=${imageType}`;
  return NextResponse.json({ exists: true, url, filename });
}

export async function DELETE(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const platform = req.nextUrl.searchParams.get("platform");
  const lang = req.nextUrl.searchParams.get("lang");
  const imageType = req.nextUrl.searchParams.get("imageType");

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
  if (!path.resolve(filePath).startsWith(path.resolve(project.fastlanePath))) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ deleted: filename });
}
