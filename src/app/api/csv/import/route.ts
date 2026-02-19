import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/fs/projectStore";
import { writeIosMetadata } from "@/lib/fs/metadataWriter";
import { writeAndroidMetadata } from "@/lib/fs/metadataWriter";
import { importFromCsv } from "@/lib/csv/csvImporter";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const projectId = formData.get("projectId") as string;
  const platform = formData.get("platform") as "ios" | "android";
  const file = formData.get("file") as File;

  if (!projectId || !platform || !file) {
    return NextResponse.json({ error: "projectId, platform, file は必須です" }, { status: 400 });
  }

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const csvText = await file.text();
  const fields = importFromCsv(csvText);

  if (platform === "ios") {
    writeIosMetadata(project.fastlanePath, fields);
  } else {
    writeAndroidMetadata(project.fastlanePath, fields);
  }

  return NextResponse.json({ ok: true });
}
