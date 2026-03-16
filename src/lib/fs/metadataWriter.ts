import fs from "fs";
import path from "path";
import { MetadataFields } from "@/types/metadata";
import { IOS_FIELDS, IOS_GLOBAL_FIELDS } from "@/lib/constants/iosFields";
import { ANDROID_FIELDS } from "@/lib/constants/androidFields";

function writeTxt(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
}

export function writeIosMetadata(fastlanePath: string, fields: MetadataFields) {
  // 言語別フィールド
  for (const field of IOS_FIELDS) {
    const langMap = fields[field.key];
    if (!langMap) continue;
    for (const [lang, value] of Object.entries(langMap)) {
      const filePath = path.join(fastlanePath, "metadata", lang, `${field.key}.txt`);
      writeTxt(filePath, value);
    }
  }

  // グローバルフィールド
  for (const field of IOS_GLOBAL_FIELDS) {
    const langMap = fields[field.key];
    if (!langMap) continue;
    const value = langMap.global || "";
    const filePath = path.join(fastlanePath, "metadata", `${field.key}.txt`);
    writeTxt(filePath, value);
  }
}

export function writeAndroidMetadata(fastlanePath: string, fields: MetadataFields) {
  for (const field of ANDROID_FIELDS) {
    const langMap = fields[field.key];
    if (!langMap) continue;
    for (const [lang, value] of Object.entries(langMap)) {
      const filePath = path.join(fastlanePath, "metadata", "android", lang, field.filePath ?? `${field.key}.txt`);
      writeTxt(filePath, value);
    }
  }
}
