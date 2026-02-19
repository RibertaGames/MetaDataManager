import { IOS_FIELDS } from "@/lib/constants/iosFields";
import MetadataEditor from "@/components/metadata/MetadataEditor";

export default async function IosPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <MetadataEditor projectId={projectId} platform="ios" fields={IOS_FIELDS} />;
}
