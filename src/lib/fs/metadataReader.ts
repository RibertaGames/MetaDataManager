import fs from "fs";
import path from "path";
import { MetadataFields } from "@/types/metadata";
import { IOS_FIELDS } from "@/lib/constants/iosFields";
import { ANDROID_FIELDS } from "@/lib/constants/androidFields";
import { IOS_LANGS, ANDROID_LANGS } from "@/lib/constants/languages";

function readTxt(filePath: string): string {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8").trim();
}

export function readIosMetadata(fastlanePath: string): MetadataFields {
  const fields: MetadataFields = {};
  for (const field of IOS_FIELDS) {
    fields[field.key] = {};
    for (const lang of IOS_LANGS) {
      const filePath = path.join(fastlanePath, "metadata", lang, `${field.key}.txt`);
      fields[field.key][lang] = readTxt(filePath);
    }
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
