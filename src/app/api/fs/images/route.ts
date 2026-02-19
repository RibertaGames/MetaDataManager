import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp"];

export async function GET(req: NextRequest) {
  const rawPath = req.nextUrl.searchParams.get("path");
  const targetPath = rawPath ?? os.homedir();

  try {
    const resolved = path.resolve(targetPath);

    if (!fs.existsSync(resolved)) {
      return NextResponse.json({ error: "パスが存在しません" }, { status: 404 });
    }

    const stat = fs.statSync(resolved);
    if (!stat.isDirectory()) {
      return NextResponse.json({ error: "ディレクトリではありません" }, { status: 400 });
    }

    const entries = fs.readdirSync(resolved, { withFileTypes: true });

    const dirs = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => ({ name: e.name, path: path.join(resolved, e.name).replace(/\\/g, "/") }))
      .sort((a, b) => a.name.localeCompare(b.name, "ja"));

    const images = entries
      .filter((e) => e.isFile() && IMAGE_EXTS.includes(path.extname(e.name).toLowerCase()))
      .map((e) => ({ name: e.name, path: path.join(resolved, e.name).replace(/\\/g, "/") }))
      .sort((a, b) => a.name.localeCompare(b.name, "ja"));

    const parentPath = resolved !== path.parse(resolved).root
      ? path.dirname(resolved).replace(/\\/g, "/")
      : null;

    return NextResponse.json({
      current: resolved.replace(/\\/g, "/"),
      parent: parentPath,
      dirs,
      images,
    });
  } catch {
    return NextResponse.json({ error: "ディレクトリを読み込めませんでした" }, { status: 500 });
  }
}
