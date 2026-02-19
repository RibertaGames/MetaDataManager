import { NextRequest, NextResponse } from "next/server";
import { getProject, updateProject, deleteProject } from "@/lib/fs/projectStore";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { name, fastlanePath } = await req.json();
  if (!name || !fastlanePath) {
    return NextResponse.json({ error: "name と fastlanePath は必須です" }, { status: 400 });
  }
  const project = updateProject(projectId, name, fastlanePath);
  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  deleteProject(projectId);
  return NextResponse.json({ ok: true });
}
