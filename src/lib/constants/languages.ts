export interface LanguageEntry {
  label: string;
  ios: string;
  android: string;
  deepl: string;
}

export const LANGUAGES: LanguageEntry[] = [
  { label: "English (US)", ios: "en-US",   android: "en-US",  deepl: "EN-US"   },
  { label: "日本語",        ios: "ja",      android: "ja-JP",  deepl: "JA"      },
  { label: "한국어",        ios: "ko",      android: "ko-KR",  deepl: "KO"      },
  { label: "中文(简体)",    ios: "zh-Hans", android: "zh-CN",  deepl: "ZH"      },
  { label: "中文(繁體)",    ios: "zh-Hant", android: "zh-TW",  deepl: "ZH-HANT" },
  { label: "Deutsch",       ios: "de-DE",   android: "de-DE",  deepl: "DE"      },
  { label: "Español",       ios: "es-ES",   android: "es-ES",  deepl: "ES"      },
  { label: "Français",      ios: "fr-FR",   android: "fr-FR",  deepl: "FR"      },
  { label: "Bahasa Indonesia", ios: "id",   android: "id-ID",  deepl: "ID"      },
  { label: "Italiano",      ios: "it",      android: "it-IT",  deepl: "IT"      },
  { label: "Português",     ios: "pt-PT",   android: "pt-PT",  deepl: "PT-PT"   },
  { label: "Русский",       ios: "ru",      android: "ru-RU",  deepl: "RU"      },
  { label: "ภาษาไทย",       ios: "th",      android: "th-TH",  deepl: "TH"      },
  { label: "Tiếng Việt",    ios: "vi",      android: "vi-VN",  deepl: "VI"      },
];

export const IOS_LANGS = LANGUAGES.map((l) => l.ios);
export const ANDROID_LANGS = LANGUAGES.map((l) => l.android);

// iOS lang -> DeepL lang
export const IOS_TO_DEEPL: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.ios, l.deepl])
);

// Android lang -> DeepL lang
export const ANDROID_TO_DEEPL: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.android, l.deepl])
);

// DeepL lang -> iOS lang
export const DEEPL_TO_IOS: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.deepl, l.ios])
);

// DeepL lang -> Android lang
export const DEEPL_TO_ANDROID: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.deepl, l.android])
);
