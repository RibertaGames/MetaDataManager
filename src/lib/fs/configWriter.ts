import fs from "fs";
import path from "path";

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeTxt(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content + "\n", "utf-8");
}

export function writeIosConfig(
  fastlanePath: string,
  config: {
    reviewInfo: Record<string, string>;
    deliverfile: Record<string, string | number | boolean>;
    submission: Record<string, boolean>;
    ageRating: Record<string, number>;
  }
) {
  // 審査担当者向け連絡先情報を書き込み
  const reviewInfoPath = path.join(fastlanePath, "metadata", "review_information");
  ensureDir(reviewInfoPath);

  const reviewFields = [
    "first_name",
    "last_name",
    "phone_number",
    "email_address",
    "demo_user",
    "demo_password",
    "notes",
  ];

  for (const field of reviewFields) {
    const filePath = path.join(reviewInfoPath, `${field}.txt`);
    const value = config.reviewInfo[field] ?? "";
    writeTxt(filePath, value);
  }

  // Deliverfileを生成
  const deliverfilePath = path.join(fastlanePath, "Deliverfile");
  let deliverfileContent = "";

  // 基本設定
  const submitForReview = config.deliverfile.submit_for_review ?? false;
  const automaticRelease = config.deliverfile.automatic_release ?? true;
  const priceTier = config.deliverfile.price_tier ?? 0;
  const thirdPartyContent = config.deliverfile.content_rights_contains_third_party_content ?? false;
  const hasRights = config.deliverfile.content_rights_has_rights ?? true;

  deliverfileContent += `submit_for_review ${submitForReview}\n`;
  deliverfileContent += `automatic_release ${automaticRelease}\n`;
  deliverfileContent += `# CI/CD環境では force: true が必要（確認プロンプトをスキップ）\n`;
  deliverfileContent += `# run_precheck_before_submit: true により検証は実行される\n`;
  deliverfileContent += `force true\n`;
  deliverfileContent += `# スクリーンショット設定は Fastfile で管理（Deliverfileでは設定しない）\n`;
  deliverfileContent += `# release_notes は各言語の metadata/*/release_notes.txt から自動読み込み\n`;
  deliverfileContent += `run_precheck_before_submit true\n\n`;

  // 価格設定
  deliverfileContent += `# 価格設定（0 = 無料）\n`;
  deliverfileContent += `price_tier ${priceTier}\n\n`;

  // コンテンツの配信権
  deliverfileContent += `# コンテンツの配信権\n`;
  if (thirdPartyContent) {
    deliverfileContent += `# AdMob広告を使用しているため、サードパーティコンテンツを含む\n`;
  }
  deliverfileContent += `content_rights_contains_third_party_content ${thirdPartyContent}\n`;
  deliverfileContent += `content_rights_has_rights ${hasRights}\n\n`;

  // 年齢制限設定
  deliverfileContent += `# 年齢制限設定\n`;
  deliverfileContent += `app_rating_config_path "./metadata/age_rating.json"\n\n`;

  // submission_information
  deliverfileContent += `submission_information({\n`;
  deliverfileContent += `  add_id_info_uses_idfa: ${config.submission.add_id_info_uses_idfa ?? false},\n`;
  deliverfileContent += `  add_id_info_serves_ads: ${config.submission.add_id_info_serves_ads ?? false},\n`;
  deliverfileContent += `  add_id_info_tracks_action: ${config.submission.add_id_info_tracks_action ?? false},\n`;
  deliverfileContent += `  add_id_info_tracks_install: ${config.submission.add_id_info_tracks_install ?? false},\n`;
  deliverfileContent += `  # 暗号化使用（HTTPS、AdMob等）\n`;
  deliverfileContent += `  export_compliance_uses_encryption: ${config.submission.export_compliance_uses_encryption ?? false},\n`;
  deliverfileContent += `  # 標準的な暗号化のみなので免除対象\n`;
  deliverfileContent += `  export_compliance_is_exempt: ${config.submission.export_compliance_is_exempt ?? true},\n`;
  deliverfileContent += `  # サードパーティSDK（AdMob等）が暗号化使用\n`;
  deliverfileContent += `  export_compliance_contains_third_party_cryptography: ${config.submission.export_compliance_contains_third_party_cryptography ?? false},\n`;
  deliverfileContent += `  # 独自の暗号化実装なし\n`;
  deliverfileContent += `  export_compliance_contains_proprietary_cryptography: ${config.submission.export_compliance_contains_proprietary_cryptography ?? false},\n`;
  deliverfileContent += `  # 以下は is_exempt: true の場合、通常不要\n`;
  deliverfileContent += `  export_compliance_compliance_required: false,\n`;
  deliverfileContent += `  export_compliance_encryption_updated: false,\n`;
  deliverfileContent += `  export_compliance_app_type: nil,\n`;
  deliverfileContent += `  export_compliance_available_on_french_store: false\n`;
  deliverfileContent += `});`;

  fs.writeFileSync(deliverfilePath, deliverfileContent, "utf-8");

  // age_rating.json を書き込み
  const ageRatingPath = path.join(fastlanePath, "metadata", "age_rating.json");
  ensureDir(path.dirname(ageRatingPath));

  const ageRatingData = {
    CARTOON_FANTASY_VIOLENCE: config.ageRating.CARTOON_FANTASY_VIOLENCE ?? 0,
    REALISTIC_VIOLENCE: config.ageRating.REALISTIC_VIOLENCE ?? 0,
    PROLONGED_GRAPHIC_SADISTIC_REALISTIC_VIOLENCE:
      config.ageRating.PROLONGED_GRAPHIC_SADISTIC_REALISTIC_VIOLENCE ?? 0,
    PROFANITY_CRUDE_HUMOR: config.ageRating.PROFANITY_CRUDE_HUMOR ?? 0,
    MATURE_SUGGESTIVE: config.ageRating.MATURE_SUGGESTIVE ?? 0,
    HORROR: config.ageRating.HORROR ?? 0,
    MEDICAL_TREATMENT_INFO: config.ageRating.MEDICAL_TREATMENT_INFO ?? 0,
    ALCOHOL_TOBACCO_DRUGS: config.ageRating.ALCOHOL_TOBACCO_DRUGS ?? 0,
    GAMBLING: config.ageRating.GAMBLING ?? 0,
    SEXUAL_CONTENT_NUDITY: config.ageRating.SEXUAL_CONTENT_NUDITY ?? 0,
    GRAPHIC_SEXUAL_CONTENT_NUDITY: config.ageRating.GRAPHIC_SEXUAL_CONTENT_NUDITY ?? 0,
    UNRESTRICTED_WEB_ACCESS: config.ageRating.UNRESTRICTED_WEB_ACCESS ?? 0,
    GAMBLING_CONTESTS: config.ageRating.GAMBLING_CONTESTS ?? 0,
    SIMULATED_GAMBLING: config.ageRating.SIMULATED_GAMBLING ?? 0,
    KIDSAGECATEGORY: null,
  };

  fs.writeFileSync(ageRatingPath, JSON.stringify(ageRatingData, null, 2), "utf-8");
}

export function writeAndroidConfig(fastlanePath: string, config: any) {
  // Android用の設定書き込み（将来的に実装）
}
