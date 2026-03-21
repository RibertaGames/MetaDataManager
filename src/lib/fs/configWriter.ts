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
    category: Record<string, string>;
    reviewInfo: Record<string, string>;
    deliverfile: Record<string, string | number | boolean>;
    submission: Record<string, boolean>;
    ageRating: Record<string, number>;
  }
) {
  // カテゴリフィールドを書き込み
  const metadataPath = path.join(fastlanePath, "metadata");
  ensureDir(metadataPath);

  const categoryFields = [
    "primary_category",
    "secondary_category",
    "primary_first_sub_category",
    "primary_second_sub_category",
    "secondary_first_sub_category",
    "secondary_second_sub_category",
  ];

  for (const field of categoryFields) {
    const filePath = path.join(metadataPath, `${field}.txt`);
    const value = config.category[field] ?? "";
    writeTxt(filePath, value);
  }

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
  const phasedRelease = config.deliverfile.phased_release ?? false;
  const priceTier = config.deliverfile.price_tier ?? 0;
  const thirdPartyContent = config.deliverfile.content_rights_contains_third_party_content ?? false;
  const hasRights = config.deliverfile.content_rights_has_rights ?? true;

  deliverfileContent += `submit_for_review ${submitForReview}\n`;
  deliverfileContent += `automatic_release ${automaticRelease}\n`;
  if (phasedRelease) {
    deliverfileContent += `# 段階的リリース（7日間で段階的に配信）\n`;
    deliverfileContent += `phased_release ${phasedRelease}\n`;
  }
  deliverfileContent += `# CI/CD環境では force: true が必要（確認プロンプトをスキップ）\n`;
  deliverfileContent += `# run_precheck_before_submit: true により検証は実行される\n`;
  deliverfileContent += `force true\n`;
  deliverfileContent += `# スクリーンショット設定は Fastfile で管理（Deliverfileでは設定しない）\n`;
  deliverfileContent += `# release_notes は各言語の metadata/*/release_notes.txt から自動読み込み\n`;
  deliverfileContent += `run_precheck_before_submit true\n\n`;

  // 価格設定
  deliverfileContent += `# 価格設定（0 = 無料）\n`;
  deliverfileContent += `price_tier ${priceTier}\n\n`;

  // 年齢制限設定
  deliverfileContent += `# 年齢制限設定\n`;
  deliverfileContent += `app_rating_config_path "./fastlane/metadata/age_rating.json"\n\n`;

  // submission_information
  deliverfileContent += `submission_information({\n`;
  // コンテンツの配信権
  if (thirdPartyContent) {
    deliverfileContent += `  # AdMob広告を使用しているため、サードパーティコンテンツを含む\n`;
  }
  deliverfileContent += `  content_rights_contains_third_party_content: ${thirdPartyContent},\n`;
  deliverfileContent += `  content_rights_has_rights: ${hasRights},\n`;
  deliverfileContent += `  # IDFA設定\n`;
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

  // 新しいApp Store Connect APIフォーマット
  const ratingValue = (val: number) => val === 0 ? "NONE" : val === 1 ? "INFREQUENT_OR_MILD" : "FREQUENT_OR_INTENSE";

  const ageRatingData = {
    violenceCartoonOrFantasy: ratingValue(config.ageRating.CARTOON_FANTASY_VIOLENCE ?? 0),
    violenceRealistic: ratingValue(config.ageRating.REALISTIC_VIOLENCE ?? 0),
    violenceRealisticProlongedGraphicOrSadistic: ratingValue(config.ageRating.PROLONGED_GRAPHIC_SADISTIC_REALISTIC_VIOLENCE ?? 0),
    profanityOrCrudeHumor: ratingValue(config.ageRating.PROFANITY_CRUDE_HUMOR ?? 0),
    matureOrSuggestiveThemes: ratingValue(config.ageRating.MATURE_SUGGESTIVE ?? 0),
    horrorOrFearThemes: ratingValue(config.ageRating.HORROR ?? 0),
    medicalOrTreatmentInformation: ratingValue(config.ageRating.MEDICAL_TREATMENT_INFO ?? 0),
    alcoholTobaccoOrDrugUseOrReferences: ratingValue(config.ageRating.ALCOHOL_TOBACCO_DRUGS ?? 0),
    gambling: false,
    contests: ratingValue(config.ageRating.GAMBLING_CONTESTS ?? 0),
    gamblingSimulated: ratingValue(config.ageRating.SIMULATED_GAMBLING ?? 0),
    sexualContentOrNudity: ratingValue(config.ageRating.SEXUAL_CONTENT_NUDITY ?? 0),
    sexualContentGraphicAndNudity: ratingValue(config.ageRating.GRAPHIC_SEXUAL_CONTENT_NUDITY ?? 0),
    unrestrictedWebAccess: config.ageRating.UNRESTRICTED_WEB_ACCESS === 1 || config.ageRating.UNRESTRICTED_WEB_ACCESS === 2,
    kidsAgeBand: null,
  };

  fs.writeFileSync(ageRatingPath, JSON.stringify(ageRatingData, null, 2), "utf-8");
}

export function writeAndroidConfig(
  fastlanePath: string,
  config: {
    category: Record<string, string>;
    reviewInfo: Record<string, string>;
    deliverfile: Record<string, string | number | boolean>;
    submission: Record<string, boolean>;
    ageRating: Record<string, number>;
  }
) {
  // カテゴリフィールド（Google Play Consoleで設定するため、ファイルには書き込まない）
  // 必要に応じて将来的に実装

  // Fastfile を更新（track, release_status, rollout, in_app_update_priority）
  const fastfilePath = path.join(fastlanePath, "Fastfile");

  if (fs.existsSync(fastfilePath)) {
    let content = fs.readFileSync(fastfilePath, "utf-8");

    // track を更新
    const track = config.deliverfile.track ?? "internal";
    content = content.replace(
      /track:\s*['"][^'"]*['"]/g,
      `track: '${track}'`
    );

    // release_status を更新
    const releaseStatus = config.deliverfile.release_status ?? "draft";
    content = content.replace(
      /release_status:\s*['"][^'"]*['"]/g,
      `release_status: '${releaseStatus}'`
    );

    // rollout を更新（100%の場合は削除、それ以外は追加/更新）
    const rollout = config.deliverfile.rollout ?? 100;
    if (rollout < 100) {
      const rolloutValue = (rollout / 100).toFixed(2); // 0.0～1.0に変換
      if (content.includes("rollout:")) {
        content = content.replace(/rollout:\s*[\d.]+/, `rollout: ${rolloutValue}`);
      } else {
        // rollout行を追加（release_statusの後に）
        content = content.replace(
          /(release_status:\s*['"][^'"]*['"])/,
          `$1,\n      rollout: ${rolloutValue}`
        );
      }
    } else {
      // 100%の場合はrollout行を削除
      content = content.replace(/,?\s*rollout:\s*[\d.]+,?\n?/g, "");
    }

    // in_app_update_priority を更新
    const priority = config.deliverfile.in_app_update_priority ?? 0;
    if (content.includes("in_app_update_priority:")) {
      content = content.replace(
        /in_app_update_priority:\s*\d+/,
        `in_app_update_priority: ${priority}`
      );
    }

    fs.writeFileSync(fastfilePath, content, "utf-8");
  }

  // age_rating.json を書き込み（iOSと共通）
  const ageRatingPath = path.join(fastlanePath, "metadata", "age_rating.json");
  ensureDir(path.dirname(ageRatingPath));

  // 新しいApp Store Connect APIフォーマット
  const ratingValue = (val: number) => val === 0 ? "NONE" : val === 1 ? "INFREQUENT_OR_MILD" : "FREQUENT_OR_INTENSE";

  const ageRatingData = {
    violenceCartoonOrFantasy: ratingValue(config.ageRating.CARTOON_FANTASY_VIOLENCE ?? 0),
    violenceRealistic: ratingValue(config.ageRating.REALISTIC_VIOLENCE ?? 0),
    violenceRealisticProlongedGraphicOrSadistic: ratingValue(config.ageRating.PROLONGED_GRAPHIC_SADISTIC_REALISTIC_VIOLENCE ?? 0),
    profanityOrCrudeHumor: ratingValue(config.ageRating.PROFANITY_CRUDE_HUMOR ?? 0),
    matureOrSuggestiveThemes: ratingValue(config.ageRating.MATURE_SUGGESTIVE ?? 0),
    horrorOrFearThemes: ratingValue(config.ageRating.HORROR ?? 0),
    medicalOrTreatmentInformation: ratingValue(config.ageRating.MEDICAL_TREATMENT_INFO ?? 0),
    alcoholTobaccoOrDrugUseOrReferences: ratingValue(config.ageRating.ALCOHOL_TOBACCO_DRUGS ?? 0),
    gambling: false,
    contests: ratingValue(config.ageRating.GAMBLING_CONTESTS ?? 0),
    gamblingSimulated: ratingValue(config.ageRating.SIMULATED_GAMBLING ?? 0),
    sexualContentOrNudity: ratingValue(config.ageRating.SEXUAL_CONTENT_NUDITY ?? 0),
    sexualContentGraphicAndNudity: ratingValue(config.ageRating.GRAPHIC_SEXUAL_CONTENT_NUDITY ?? 0),
    unrestrictedWebAccess: config.ageRating.UNRESTRICTED_WEB_ACCESS === 1 || config.ageRating.UNRESTRICTED_WEB_ACCESS === 2,
    kidsAgeBand: null,
  };

  fs.writeFileSync(ageRatingPath, JSON.stringify(ageRatingData, null, 2), "utf-8");
}
