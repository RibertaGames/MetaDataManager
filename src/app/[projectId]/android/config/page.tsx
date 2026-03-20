import ConfigEditor from "@/components/metadata/ConfigEditor";
import {
  ANDROID_CATEGORY_FIELDS,
  ANDROID_SUPPLY_CONFIG,
  IOS_AGE_RATING,
} from "@/lib/constants/define";

export default async function AndroidConfigPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ConfigEditor
      projectId={projectId}
      platform="android"
      categoryFields={ANDROID_CATEGORY_FIELDS}
      reviewInfoFields={[]} // Androidには審査担当者情報なし
      deliverfileConfig={ANDROID_SUPPLY_CONFIG}
      submissionInfo={[]} // Androidには submission_information なし
      ageRating={IOS_AGE_RATING} // 年齢制限はiOSと共通
    />
  );
}
