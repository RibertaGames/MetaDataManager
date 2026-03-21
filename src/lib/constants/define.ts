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
  { key: "apple_tv_privacy_policy", label: "Apple TVプライバシーURL", maxLength: null, multiline: false },
];

/**
 * iOS グローバルフィールド（言語に依存しない）- メタデータページ用
 */
export const IOS_GLOBAL_FIELDS: FieldDef[] = [
  { key: "copyright",        label: "著作権",                 maxLength: 100,  multiline: false },
];

/**
 * iOS カテゴリフィールド - 設定ページ用
 */
export const IOS_CATEGORY_FIELDS: FieldDef[] = [
  { key: "primary_category", label: "主カテゴリ",             maxLength: null, multiline: false },
  { key: "secondary_category", label: "副カテゴリ（任意）",   maxLength: null, multiline: false },
  { key: "primary_first_sub_category", label: "主カテゴリ サブ1（任意）", maxLength: null, multiline: false },
  { key: "primary_second_sub_category", label: "主カテゴリ サブ2（任意）", maxLength: null, multiline: false },
  { key: "secondary_first_sub_category", label: "副カテゴリ サブ1（任意）", maxLength: null, multiline: false },
  { key: "secondary_second_sub_category", label: "副カテゴリ サブ2（任意）", maxLength: null, multiline: false },
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
  { key: "title",             label: "タイトル",       maxLength: 50,   multiline: false, filePath: "title.txt"             },
  { key: "short_description", label: "簡単な説明",     maxLength: 80,   multiline: false, filePath: "short_description.txt" },
  { key: "full_description",  label: "詳細な説明",     maxLength: 4000, multiline: true,  filePath: "full_description.txt"  },
  { key: "video",             label: "プロモーション動画URL", maxLength: null, multiline: false, filePath: "video.txt"     },
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
  { key: "price_tier", label: "価格帯", type: "number", description: "0 = 無料、1-87 = 有料", min: 0, max: 87 },
  { key: "submit_for_review", label: "審査に自動提出", type: "boolean", description: "アップロード後に自動的に審査に提出" },
  { key: "automatic_release", label: "承認後に自動リリース", type: "boolean", description: "審査承認後に自動的にリリース（段階的リリースと併用不可）" },
  { key: "phased_release", label: "段階的リリース（7日間）", type: "boolean", description: "7日間かけて段階的に配信（自動リリースと併用不可）" },
];

/**
 * iOS submission_information（コンテンツ権利・IDFA・暗号化設定）
 */
export const IOS_SUBMISSION_INFO: ConfigFieldDef[] = [
  { key: "content_rights_contains_third_party_content", label: "サードパーティコンテンツを含む", type: "boolean", description: "広告、ユーザー生成コンテンツなど" },
  { key: "content_rights_has_rights", label: "配信権を保有", type: "boolean", description: "コンテンツの配信権を保有している" },
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
  { key: "lootBox", label: "ルートボックス（ガチャなど）", type: "boolean", description: "ランダムな報酬を得るための課金要素" },
  { key: "advertising", label: "広告を表示", type: "boolean", description: "アプリ内で広告を表示する" },
  { key: "messagingAndChat", label: "メッセージング・チャット機能", type: "boolean", description: "ユーザー間のメッセージング機能" },
  { key: "ageAssurance", label: "年齢確認機能", type: "boolean", description: "年齢確認・認証機能を含む" },
  { key: "userGeneratedContent", label: "ユーザー生成コンテンツ", type: "boolean", description: "ユーザーが作成したコンテンツを含む" },
  { key: "healthOrWellnessTopics", label: "健康・ウェルネス関連", type: "boolean", description: "健康やウェルネスに関する情報を提供" },
  { key: "parentalControls", label: "ペアレンタルコントロール", type: "boolean", description: "保護者向けの制御機能を含む" },
  { key: "gunsOrOtherWeapons", label: "銃・武器の描写", type: "boolean", description: "銃や武器の描写を含む" },
];

// ============================================
// App Store カテゴリ定義
// ============================================

/**
 * iOS App Store 主カテゴリ一覧
 */
export const IOS_PRIMARY_CATEGORIES = [
  { value: "", label: "未選択" },
  { value: "BUSINESS", label: "ビジネス" },
  { value: "BOOKS", label: "ブック" },
  { value: "DEVELOPER_TOOLS", label: "開発ツール" },
  { value: "EDUCATION", label: "教育" },
  { value: "ENTERTAINMENT", label: "エンターテインメント" },
  { value: "FINANCE", label: "ファイナンス" },
  { value: "FOOD_AND_DRINK", label: "フード＆ドリンク" },
  { value: "GAMES", label: "ゲーム" },
  { value: "GRAPHICS_AND_DESIGN", label: "グラフィック＆デザイン" },
  { value: "HEALTH_AND_FITNESS", label: "ヘルスケア＆フィットネス" },
  { value: "LIFESTYLE", label: "ライフスタイル" },
  { value: "MAGAZINES_AND_NEWSPAPERS", label: "雑誌＆新聞" },
  { value: "MEDICAL", label: "メディカル" },
  { value: "MUSIC", label: "ミュージック" },
  { value: "NAVIGATION", label: "ナビゲーション" },
  { value: "NEWS", label: "ニュース" },
  { value: "PHOTO_AND_VIDEO", label: "写真＆ビデオ" },
  { value: "PRODUCTIVITY", label: "仕事効率化" },
  { value: "REFERENCE", label: "辞書/辞典/その他" },
  { value: "SHOPPING", label: "ショッピング" },
  { value: "SOCIAL_NETWORKING", label: "ソーシャルネットワーキング" },
  { value: "SPORTS", label: "スポーツ" },
  { value: "STICKERS", label: "ステッカー" },
  { value: "TRAVEL", label: "旅行" },
  { value: "UTILITIES", label: "ユーティリティ" },
  { value: "WEATHER", label: "天気" },
];

/**
 * ゲームのサブカテゴリ
 */
export const IOS_GAME_SUB_CATEGORIES = [
  { value: "", label: "未選択" },
  { value: "GAMES_ACTION", label: "アクション" },
  { value: "GAMES_ADVENTURE", label: "アドベンチャー" },
  { value: "GAMES_CASUAL", label: "カジュアル" },
  { value: "GAMES_BOARD", label: "ボード" },
  { value: "GAMES_CARD", label: "カード" },
  { value: "GAMES_DICE", label: "サイコロ" },
  { value: "GAMES_EDUCATIONAL", label: "教育" },
  { value: "GAMES_FAMILY", label: "ファミリー" },
  { value: "GAMES_MUSIC", label: "ミュージック" },
  { value: "GAMES_PUZZLE", label: "パズル" },
  { value: "GAMES_RACING", label: "レーシング" },
  { value: "GAMES_ROLE_PLAYING", label: "ロールプレイング" },
  { value: "GAMES_SIMULATION", label: "シミュレーション" },
  { value: "GAMES_SPORTS", label: "スポーツ" },
  { value: "GAMES_STRATEGY", label: "ストラテジー" },
  { value: "GAMES_TRIVIA", label: "トリビア" },
  { value: "GAMES_WORD", label: "ワード" },
];

/**
 * ステッカーのサブカテゴリ
 */
export const IOS_STICKER_SUB_CATEGORIES = [
  { value: "", label: "未選択" },
  { value: "STICKERS_EMOJI_AND_EXPRESSIONS", label: "絵文字＆表現" },
  { value: "STICKERS_ANIMALS", label: "動物" },
  { value: "STICKERS_CELEBRATIONS", label: "お祝い" },
  { value: "STICKERS_CHARACTERS", label: "キャラクター" },
  { value: "STICKERS_COMICS", label: "コミック" },
  { value: "STICKERS_FOOD_AND_DRINK", label: "フード＆ドリンク" },
  { value: "STICKERS_OBJECTS", label: "オブジェクト" },
  { value: "STICKERS_PEOPLE", label: "人物" },
  { value: "STICKERS_PLACES_AND_THINGS", label: "場所＆もの" },
  { value: "STICKERS_SEASONAL", label: "季節" },
  { value: "STICKERS_SPORTS", label: "スポーツ" },
  { value: "STICKERS_TRAVEL", label: "旅行" },
  { value: "STICKERS_VEHICLES", label: "乗り物" },
  { value: "STICKERS_MUSIC", label: "ミュージック" },
];

// ============================================
// Android / Google Play 設定
// ============================================

/**
 * Android カテゴリフィールド
 */
export const ANDROID_CATEGORY_FIELDS: FieldDef[] = [
  { key: "category", label: "カテゴリ", maxLength: null, multiline: false },
];

/**
 * Android Deliverfile/Supply 設定
 */
export const ANDROID_SUPPLY_CONFIG: ConfigFieldDef[] = [
  { key: "track", label: "配信トラック", type: "select", description: "アプリの配信先トラック", options: [
    { value: "internal", label: "Internal（内部テスト）" },
    { value: "alpha", label: "Alpha（限定テスト）" },
    { value: "beta", label: "Beta（ベータテスト）" },
    { value: "production", label: "Production（本番リリース）" },
  ]},
  { key: "release_status", label: "リリース状態", type: "select", description: "リリースの状態", options: [
    { value: "draft", label: "Draft（ドラフト）" },
    { value: "completed", label: "Completed（リリース完了）" },
  ]},
  { key: "rollout", label: "段階的リリース（%）", type: "number", description: "0～100%で指定。100%で全ユーザーに配信", min: 0, max: 100 },
  { key: "in_app_update_priority", label: "アプリ内更新優先度", type: "select", description: "0=低、5=最高（必須更新）", options: [
    { value: 0, label: "0 - 低（スキップ可能）" },
    { value: 1, label: "1 - 低" },
    { value: 2, label: "2 - 中" },
    { value: 3, label: "3 - 中" },
    { value: 4, label: "4 - 高" },
    { value: 5, label: "5 - 最高（必須更新）" },
  ]},
];

/**
 * Google Play カテゴリ一覧（アプリ）
 */
export const ANDROID_APP_CATEGORIES = [
  { value: "", label: "未選択" },
  { value: "APPLICATION", label: "総合" },
  { value: "ART_AND_DESIGN", label: "アート＆デザイン" },
  { value: "AUTO_AND_VEHICLES", label: "自動車" },
  { value: "BEAUTY", label: "美容" },
  { value: "BOOKS_AND_REFERENCE", label: "書籍＆リファレンス" },
  { value: "BUSINESS", label: "ビジネス" },
  { value: "COMICS", label: "コミック" },
  { value: "COMMUNICATION", label: "通信" },
  { value: "DATING", label: "デート" },
  { value: "EDUCATION", label: "教育" },
  { value: "ENTERTAINMENT", label: "エンターテインメント" },
  { value: "EVENTS", label: "イベント" },
  { value: "FINANCE", label: "金融" },
  { value: "FOOD_AND_DRINK", label: "グルメ＆ドリンク" },
  { value: "HEALTH_AND_FITNESS", label: "ヘルスケア＆フィットネス" },
  { value: "HOUSE_AND_HOME", label: "住まい＆インテリア" },
  { value: "LIFESTYLE", label: "ライフスタイル" },
  { value: "MAPS_AND_NAVIGATION", label: "マップ＆ナビゲーション" },
  { value: "MEDICAL", label: "医療" },
  { value: "MUSIC_AND_AUDIO", label: "音楽＆オーディオ" },
  { value: "NEWS_AND_MAGAZINES", label: "ニュース＆マガジン" },
  { value: "PARENTING", label: "子育て" },
  { value: "PERSONALIZATION", label: "カスタマイズ" },
  { value: "PHOTOGRAPHY", label: "写真" },
  { value: "PRODUCTIVITY", label: "仕事効率化" },
  { value: "SHOPPING", label: "ショッピング" },
  { value: "SOCIAL", label: "ソーシャルネットワーク" },
  { value: "SPORTS", label: "スポーツ" },
  { value: "TOOLS", label: "ツール" },
  { value: "TRAVEL_AND_LOCAL", label: "トラベル＆ローカル" },
  { value: "VIDEO_PLAYERS", label: "ビデオプレイヤー＆エディタ" },
  { value: "WEATHER", label: "天気" },
  { value: "ANDROID_WEAR", label: "Android Wear" },
];

/**
 * Google Play ゲームカテゴリ一覧
 */
export const ANDROID_GAME_CATEGORIES = [
  { value: "", label: "未選択" },
  { value: "GAME", label: "ゲーム（総合）" },
  { value: "GAME_ACTION", label: "アクション" },
  { value: "GAME_ADVENTURE", label: "アドベンチャー" },
  { value: "GAME_ARCADE", label: "アーケード" },
  { value: "GAME_BOARD", label: "ボード" },
  { value: "GAME_CARD", label: "カード" },
  { value: "GAME_CASINO", label: "カジノ" },
  { value: "GAME_CASUAL", label: "カジュアル" },
  { value: "GAME_EDUCATIONAL", label: "教育" },
  { value: "GAME_MUSIC", label: "ミュージック" },
  { value: "GAME_PUZZLE", label: "パズル" },
  { value: "GAME_RACING", label: "レーシング" },
  { value: "GAME_ROLE_PLAYING", label: "ロールプレイング" },
  { value: "GAME_SIMULATION", label: "シミュレーション" },
  { value: "GAME_SPORTS", label: "スポーツ" },
  { value: "GAME_STRATEGY", label: "ストラテジー" },
  { value: "GAME_TRIVIA", label: "トリビア" },
  { value: "GAME_WORD", label: "ワード" },
  { value: "FAMILY", label: "ファミリー" },
];

/**
 * すべてのAndroidカテゴリ（アプリ＋ゲーム）
 */
export const ANDROID_ALL_CATEGORIES = [...ANDROID_APP_CATEGORIES, ...ANDROID_GAME_CATEGORIES.slice(1)];
