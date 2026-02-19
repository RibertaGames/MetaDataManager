import { NextRequest, NextResponse } from "next/server";
import { readSettings, writeSettings } from "@/lib/fs/settingsStore";

export async function GET() {
  const settings = readSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = readSettings();
  writeSettings({ ...current, ...body });
  return NextResponse.json({ ok: true });
}
