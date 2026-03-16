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
 * iOS のスクリーンショットフォルダ名
 * fastlane/screenshots/{lang}/{deviceFolder}/
 *
 * Apple の最新要件に準拠（"inch" サフィックス必須）
 */
export const IOS_SCREENSHOT_TYPES: Record<string, string> = {
  iphone67: "iPhone 6.7 inch",
  iphone65: "iPhone 6.5 inch",
  iphone55: "iPhone 5.5 inch",
  ipad: "iPad Pro (6th gen)",
};

export const DEFAULT_IOS_SCREENSHOT_TYPE = "iphone67";
export const DEFAULT_ANDROID_SCREENSHOT_TYPE = "phone";

export const DEFAULT_IOS_SCREENSHOT_FOLDER = IOS_SCREENSHOT_TYPES[DEFAULT_IOS_SCREENSHOT_TYPE];
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
