import { redirect } from "next/navigation";

export default async function IosPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/${projectId}/ios/metadata`);
}
