import { ANDROID_FIELDS } from "@/lib/constants/define";
import MetadataEditor from "@/components/metadata/MetadataEditor";

export default async function AndroidPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <MetadataEditor projectId={projectId} platform="android" fields={ANDROID_FIELDS} />;
}
