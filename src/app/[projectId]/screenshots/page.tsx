import { redirect } from "next/navigation";

export default async function ScreenshotsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  // 古いURLから新しいURLへリダイレクト
  redirect(`/${projectId}/ios/screenshots`);
}
