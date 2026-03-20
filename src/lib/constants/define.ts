/**
 * 全ての定数定義
 */

// ============================================
// 言語設定
// ============================================

export interface LanguageEntry {
  label: string;
  ios: string;
  android: string;
  deepl: string;
}

export const LANGUAGES: LanguageEntry[] = [
  { label: "日本語",        ios: "ja",      android: "ja-JP",  deepl: "JA"      },
  { label: "English (US)", ios: "en-US",   android: "en-US",  deepl: "EN-US"   },
  { label: "한국어",        ios: "ko",      android: "ko-KR",  deepl: "KO"      },
  { label: "中文(简体)",    ios: "zh-Hans", android: "zh-CN",  deepl: "ZH"      },
  { label: "中文(繁體)",    ios: "zh-Hant", android: "zh-TW",  deepl: "ZH-HANT" },
  { label: "Deutsch",       ios: "de-DE",   android: "de-DE",  deepl: "DE"      },
  { label: "Español",       ios: "es-ES",   android: "es-ES",  deepl: "ES"      },
  { label: "Français",      ios: "fr-FR",   android: "fr-FR",  deepl: "FR"      },
  { label: "Bahasa Indonesia", ios: "id",   android: "id",     deepl: "ID"      },
  { label: "Italiano",      ios: "it",      android: "it-IT",  deepl: "IT"      },
  { label: "Português",     ios: "pt-PT",   android: "pt-PT",  deepl: "PT-PT"   },
  { label: "Русский",       ios: "ru",      android: "ru-RU",  deepl: "RU"      },
  { label: "ภาษาไทย",       ios: "th",      android: "th",     deepl: "TH"      },
  { label: "Tiếng Việt",    ios: "vi",      android: "vi",     deepl: "VI"      },
];

export const IOS_LANGS = LANGUAGES.map((l) => l.ios);
export const ANDROID_LANGS = LANGUAGES.map((l) => l.android);

export const IOS_TO_DEEPL: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.ios, l.deepl])
);

export const ANDROID_TO_DEEPL: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.android, l.deepl])
);

export const DEEPL_TO_IOS: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.deepl, l.ios])
);

export const DEEPL_TO_ANDROID: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.deepl, l.android])
);

// ============================================
// スクリーンショット設定
// ============================================

/**
 * Android のスクリーンショットフォルダ名
 * fastlane/metadata/android/{lang}/images/{folderName}/
 */
export const ANDROID_SCREENSHOT_TYPES: Record<string, string> = {
  phone: "phoneScreenshots",
  "7inch": "sevenInchScreenshots",
  "10inch": "tenInchScreenshots",
};

/**
 * iOS のスクリーンショット設定
 *
 * ⚠️ 重要: iOSスクリーンショットは言語フォルダ直下に配置する
 * パス: fastlane/screenshots/{lang}/*.png
 *
 * Fastlaneが画像の解像度から自動的にデバイスタイプを判定します。
 * デバイス別のサブフォルダは使用しません。
 */

export const DEFAULT_ANDROID_SCREENSHOT_TYPE = "phone";
export const DEFAULT_ANDROID_SCREENSHOT_FOLDER = ANDROID_SCREENSHOT_TYPES[DEFAULT_ANDROID_SCREENSHOT_TYPE];

// ============================================
// メタデータフィールド定義
// ============================================

export interface FieldDef {
  key: string;
  label: string;
  maxLength: number | null;
  multiline: boolean;
  filePath?: string; // デフォルトは `${key}.txt`
}

/**
 * 設定フィールド定義（Deliverfile用）
 */
export interface ConfigFieldDef {
  key: string;
  label: string;
  type: "text" | "number" | "boolean" | "select";
  description?: string;
  options?: { value: string | number | boolean; label: string }[];
  min?: number;
  max?: number;
}

/**
 * iOS メタデータフィールド（言語別）
 */
export const IOS_FIELDS: FieldDef[] = [
  { key: "name",             label: "アプリ名",               maxLength: 30,   multiline: false },
  { key: "subtitle",         label: "サブタイトル",           maxLength: 30,   multiline: false },
  { key: "keywords",         label: "キーワード",             maxLength: 100,  multiline: false },
  { key: "promotional_text", label: "プロモーションテキスト", maxLength: 170,  multiline: false },
  { key: "description",      label: "説明",                   maxLength: 4000, multiline: true  },
  { key: "release_notes",    label: "リリースノート",         maxLength: 4000, multiline: true  },
  { key: "privacy_url",      label: "プライバシーURL",        maxLength: null, multiline: false },
  { key: "support_url",      label: "サポートURL",            maxLength: null, multiline: false },
  { key: "marketing_url",    label: "マーケティングURL",      maxLength: null, multiline: false },
];

/**
 * iOS グローバルフィールド（言語に依存しない）
 */
export const IOS_GLOBAL_FIELDS: FieldDef[] = [
  { key: "copyright",        label: "著作権",                 maxLength: 100,  multiline: false },
];

/**
 * iOS 審査担当者向け連絡先情報
 */
export const IOS_REVIEW_INFO_FIELDS: FieldDef[] = [
  { key: "first_name",      label: "名",                     maxLength: null, multiline: false },
  { key: "last_name",       label: "姓",                     maxLength: null, multiline: false },
  { key: "phone_number",    label: "電話番号",               maxLength: null, multiline: false },
  { key: "email_address",   label: "メールアドレス",         maxLength: null, multiline: false },
  { key: "demo_user",       label: "デモユーザー名（任意）", maxLength: null, multiline: false },
  { key: "demo_password",   label: "デモパスワード（任意）", maxLength: null, multiline: false },
  { key: "notes",           label: "備考（任意）",           maxLength: 4000, multiline: true  },
];

/**
 * Android メタデータフィールド
 */
export const ANDROID_FIELDS: FieldDef[] = [
  { key: "title",             label: "タイトル",       maxLength: 30,   multiline: false, filePath: "title.txt"             },
  { key: "short_description", label: "簡単な説明",     maxLength: 80,   multiline: false, filePath: "short_description.txt" },
  { key: "full_description",  label: "詳細な説明",     maxLength: 4000, multiline: true,  filePath: "full_description.txt"  },
  { key: "changelog",         label: "変更履歴",       maxLength: 500,  multiline: true,  filePath: "changelogs/default.txt"},
];

// ============================================
// ファイルパス設定
// ============================================

/**
 * iOS メタデータのベースパス
 */
export const IOS_METADATA_BASE = "metadata";

/**
 * iOS スクリーンショットのベースパス
 */
export const IOS_SCREENSHOTS_BASE = "screenshots";

/**
 * Android メタデータのベースパス
 */
export const ANDROID_METADATA_BASE = "metadata/android";

/**
 * 画像ファイル拡張子
 */
export const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|webp)$/i;

// ============================================
// API設定
// ============================================

/**
 * DeepL API エンドポイント
 */
export const DEEPL_API_ENDPOINT_FREE = "https://api-free.deepl.com/v2/translate";
export const DEEPL_API_ENDPOINT_PRO = "https://api.deepl.com/v2/translate";

// ============================================
// Deliverfile設定項目
// ============================================

/**
 * iOS Deliverfile 基本設定
 */
export const IOS_DELIVERFILE_CONFIG: ConfigFieldDef[] = [
  { key: "price_tier", label: "価格帯", type: "number", description: "0 = 無料", min: 0, max: 87 },
  { key: "submit_for_review", label: "審査に自動提出", type: "boolean", description: "アップロード後に自動的に審査に提出" },
  { key: "automatic_release", label: "承認後に自動リリース", type: "boolean", description: "審査承認後に自動的にリリース" },
  { key: "content_rights_contains_third_party_content", label: "サードパーティコンテンツを含む", type: "boolean", description: "広告、ユーザー生成コンテンツなど" },
  { key: "content_rights_has_rights", label: "配信権を保有", type: "boolean", description: "コンテンツの配信権を保有している" },
];

/**
 * iOS submission_information（IDFA・暗号化設定）
 */
export const IOS_SUBMISSION_INFO: ConfigFieldDef[] = [
  { key: "add_id_info_uses_idfa", label: "IDFAを使用", type: "boolean", description: "広告識別子（IDFA）を使用" },
  { key: "add_id_info_serves_ads", label: "広告を表示", type: "boolean", description: "アプリ内で広告を表示" },
  { key: "add_id_info_tracks_action", label: "ユーザー行動をトラッキング", type: "boolean", description: "広告目的でユーザー行動を追跡" },
  { key: "add_id_info_tracks_install", label: "インストールをトラッキング", type: "boolean", description: "広告アトリビューション用" },
  { key: "export_compliance_uses_encryption", label: "暗号化を使用", type: "boolean", description: "HTTPS、SSL/TLSなど" },
  { key: "export_compliance_is_exempt", label: "暗号化規制の免除対象", type: "boolean", description: "標準的な暗号化のみ使用" },
  { key: "export_compliance_contains_third_party_cryptography", label: "サードパーティの暗号化", type: "boolean", description: "SDKの暗号化機能を使用" },
  { key: "export_compliance_contains_proprietary_cryptography", label: "独自の暗号化実装", type: "boolean", description: "自社開発の暗号化を使用" },
];

/**
 * iOS 年齢制限設定
 */
export const IOS_AGE_RATING: ConfigFieldDef[] = [
  { key: "CARTOON_FANTASY_VIOLENCE", label: "アニメ・ファンタジー暴力", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "REALISTIC_VIOLENCE", label: "リアルな暴力", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "PROLONGED_GRAPHIC_SADISTIC_REALISTIC_VIOLENCE", label: "長時間の残虐なリアル暴力", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "PROFANITY_CRUDE_HUMOR", label: "卑猥な表現・下品なユーモア", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "MATURE_SUGGESTIVE", label: "成人向けまたは性的な内容", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "HORROR", label: "ホラー・恐怖", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "MEDICAL_TREATMENT_INFO", label: "医療/治療情報", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "ALCOHOL_TOBACCO_DRUGS", label: "アルコール・タバコ・薬物", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "GAMBLING", label: "ギャンブル", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "SEXUAL_CONTENT_NUDITY", label: "性的なコンテンツ・ヌード", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "GRAPHIC_SEXUAL_CONTENT_NUDITY", label: "露骨な性的コンテンツ・ヌード", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "UNRESTRICTED_WEB_ACCESS", label: "制限なしのウェブアクセス", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "GAMBLING_CONTESTS", label: "ギャンブル・コンテスト", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
  { key: "SIMULATED_GAMBLING", label: "シミュレーションギャンブル", type: "select", options: [
    { value: 0, label: "なし" },
    { value: 1, label: "まれ/軽度" },
    { value: 2, label: "頻繁/激しい" },
  ]},
];
