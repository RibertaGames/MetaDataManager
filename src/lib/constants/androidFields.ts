import { FieldDef } from "./iosFields";

export const ANDROID_FIELDS: FieldDef[] = [
  { key: "title",             label: "タイトル",       maxLength: 30,   multiline: false, filePath: "title.txt"             },
  { key: "short_description", label: "簡単な説明",     maxLength: 80,   multiline: false, filePath: "short_description.txt" },
  { key: "full_description",  label: "詳細な説明",     maxLength: 4000, multiline: true,  filePath: "full_description.txt"  },
  { key: "changelog",         label: "変更履歴",       maxLength: 500,  multiline: true,  filePath: "changelogs/default.txt"},
];
