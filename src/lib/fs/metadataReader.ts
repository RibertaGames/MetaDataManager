import fs from "fs";
import path from "path";
import { MetadataFields } from "@/types/metadata";
import { IOS_FIELDS, IOS_GLOBAL_FIELDS } from "@/lib/constants/define";
import { ANDROID_FIELDS } from "@/lib/constants/define";
import { IOS_LANGS, ANDROID_LANGS } from "@/lib/constants/define";

function readTxt(filePath: string): string {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8").trim();
}

export function readIosMetadata(fastlanePath: string): MetadataFields {
  const fields: MetadataFields = {};

  // 言語別フィールド
  for (const field of IOS_FIELDS) {
    fields[field.key] = {};
    for (const lang of IOS_LANGS) {
      const filePath = path.join(fastlanePath, "metadata", lang, `${field.key}.txt`);
      fields[field.key][lang] = readTxt(filePath);
    }
  }

  // グローバルフィールド
  for (const field of IOS_GLOBAL_FIELDS) {
    const filePath = path.join(fastlanePath, "metadata", `${field.key}.txt`);
    const value = readTxt(filePath);
    // グローバルフィールドは "global" キーに保存
    fields[field.key] = { global: value };
  }

  return fields;
}

export function readAndroidMetadata(fastlanePath: string): MetadataFields {
  const fields: MetadataFields = {};
  for (const field of ANDROID_FIELDS) {
    fields[field.key] = {};
    for (const lang of ANDROID_LANGS) {
      const filePath = path.join(fastlanePath, "metadata", "android", lang, field.filePath ?? `${field.key}.txt`);
      fields[field.key][lang] = readTxt(filePath);
    }
  }
  return fields;
}
