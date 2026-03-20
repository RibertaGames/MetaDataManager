import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/fs/projectStore";
import { readAndroidConfig } from "@/lib/fs/configReader";
import { writeAndroidConfig } from "@/lib/fs/configWriter";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const config = readAndroidConfig(project.fastlanePath);
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  const { projectId, category, reviewInfo, deliverfile, submission, ageRating } = await req.json();
  if (!projectId)
    return NextResponse.json({ error: "projectId は必須です" }, { status: 400 });

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  writeAndroidConfig(project.fastlanePath, { category, reviewInfo, deliverfile, submission, ageRating });
  return NextResponse.json({ ok: true });
}
