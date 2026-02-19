import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp"];

export async function GET(req: NextRequest) {
  const rawPath = req.nextUrl.searchParams.get("path");
  if (!rawPath) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }

  const resolved = path.resolve(rawPath);

  const ext = path.extname(resolved).toLowerCase();
  if (!IMAGE_EXTS.includes(ext)) {
    return NextResponse.json({ error: "Not an image file" }, { status: 400 });
  }

  if (!fs.existsSync(resolved)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(resolved);
  const contentType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg"
    : ext === ".webp" ? "image/webp"
    : "image/png";

  return new NextResponse(buffer, {
    headers: { "Content-Type": contentType },
  });
}
