import fs from "fs";
import path from "path";

function readTxt(filePath: string): string {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8").trim();
}

export function readIosConfig(fastlanePath: string) {
  // 審査担当者向け連絡先情報
  const reviewInfoPath = path.join(fastlanePath, "metadata", "review_information");
  const reviewInfo: Record<string, string> = {};

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
    reviewInfo[field] = readTxt(filePath);
  }

  // Deliverfile設定（パース）
  const deliverfilePath = path.join(fastlanePath, "Deliverfile");
  const deliverfile: Record<string, string | number | boolean> = {};

  if (fs.existsSync(deliverfilePath)) {
    const content = fs.readFileSync(deliverfilePath, "utf-8");

    // price_tier を抽出
    const priceTierMatch = content.match(/price_tier\s+(\d+)/);
    if (priceTierMatch) {
      deliverfile.price_tier = parseInt(priceTierMatch[1]);
    }

    // boolean設定を抽出
    const boolFields = [
      "submit_for_review",
      "automatic_release",
      "content_rights_contains_third_party_content",
      "content_rights_has_rights",
    ];

    for (const field of boolFields) {
      const match = content.match(new RegExp(`${field}\\s+(true|false)`));
      if (match) {
        deliverfile[field] = match[1] === "true";
      }
    }
  }

  // submission_information をパース
  const submission: Record<string, boolean> = {};
  if (fs.existsSync(deliverfilePath)) {
    const content = fs.readFileSync(deliverfilePath, "utf-8");
    const submissionMatch = content.match(/submission_information\(\{([\s\S]*?)\}\)/);

    if (submissionMatch) {
      const submissionContent = submissionMatch[1];
      const submissionFields = [
        "add_id_info_uses_idfa",
        "add_id_info_serves_ads",
        "add_id_info_tracks_action",
        "add_id_info_tracks_install",
        "export_compliance_uses_encryption",
        "export_compliance_is_exempt",
        "export_compliance_contains_third_party_cryptography",
        "export_compliance_contains_proprietary_cryptography",
      ];

      for (const field of submissionFields) {
        const match = submissionContent.match(new RegExp(`${field}:\\s*(true|false)`));
        if (match) {
          submission[field] = match[1] === "true";
        }
      }
    }
  }

  // 年齢制限設定（age_rating.json）
  const ageRatingPath = path.join(fastlanePath, "metadata", "age_rating.json");
  let ageRating: Record<string, number> = {};

  if (fs.existsSync(ageRatingPath)) {
    try {
      const content = fs.readFileSync(ageRatingPath, "utf-8");
      ageRating = JSON.parse(content);
    } catch {
      // JSONパースエラーは無視
    }
  }

  return { reviewInfo, deliverfile, submission, ageRating };
}

export function readAndroidConfig(fastlanePath: string) {
  // Android用の設定読み込み（将来的に実装）
  return { reviewInfo: {}, deliverfile: {}, submission: {}, ageRating: {} };
}
