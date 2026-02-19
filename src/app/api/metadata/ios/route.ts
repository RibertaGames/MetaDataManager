import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/fs/projectStore";
import { readIosMetadata } from "@/lib/fs/metadataReader";
import { writeIosMetadata } from "@/lib/fs/metadataWriter";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const fields = readIosMetadata(project.fastlanePath);
  return NextResponse.json({ fields });
}

export async function POST(req: NextRequest) {
  const { projectId, fields } = await req.json();
  if (!projectId || !fields) return NextResponse.json({ error: "projectId と fields は必須です" }, { status: 400 });

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  writeIosMetadata(project.fastlanePath, fields);
  return NextResponse.json({ ok: true });
}
