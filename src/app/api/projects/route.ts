import { NextRequest, NextResponse } from "next/server";
import { readProjects, createProject } from "@/lib/fs/projectStore";

export async function GET() {
  const data = readProjects();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { name, fastlanePath } = await req.json();
  if (!name || !fastlanePath) {
    return NextResponse.json({ error: "name と fastlanePath は必須です" }, { status: 400 });
  }
  const project = createProject(name, fastlanePath);
  return NextResponse.json(project, { status: 201 });
}
