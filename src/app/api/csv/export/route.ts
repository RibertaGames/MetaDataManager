import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/fs/projectStore";
import { readIosMetadata } from "@/lib/fs/metadataReader";
import { readAndroidMetadata } from "@/lib/fs/metadataReader";
import { exportToCsv } from "@/lib/csv/csvExporter";
import { IOS_LANGS, ANDROID_LANGS } from "@/lib/constants/define";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  const platform = req.nextUrl.searchParams.get("platform") as "ios" | "android";

  if (!projectId || !platform) {
    return NextResponse.json({ error: "projectId と platform は必須です" }, { status: 400 });
  }

  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  let fields, langs;
  if (platform === "ios") {
    fields = readIosMetadata(project.fastlanePath);
    langs = IOS_LANGS;
  } else {
    fields = readAndroidMetadata(project.fastlanePath);
    langs = ANDROID_LANGS;
  }

  const csv = exportToCsv(fields, langs);
  const filename = `${platform}_metadata_${project.name.replace(/\s+/g, "_")}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
