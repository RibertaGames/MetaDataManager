export interface FieldDef {
  key: string;
  label: string;
  maxLength: number | null;
  multiline: boolean;
  filePath?: string; // デフォルトは `${key}.txt`
}

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
