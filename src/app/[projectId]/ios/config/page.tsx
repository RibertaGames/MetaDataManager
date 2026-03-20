import ConfigEditor from "@/components/metadata/ConfigEditor";
import {
  IOS_REVIEW_INFO_FIELDS,
  IOS_DELIVERFILE_CONFIG,
  IOS_SUBMISSION_INFO,
  IOS_AGE_RATING,
} from "@/lib/constants/define";

export default async function IosConfigPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ConfigEditor
      projectId={projectId}
      platform="ios"
      reviewInfoFields={IOS_REVIEW_INFO_FIELDS}
      deliverfileConfig={IOS_DELIVERFILE_CONFIG}
      submissionInfo={IOS_SUBMISSION_INFO}
      ageRating={IOS_AGE_RATING}
    />
  );
}
