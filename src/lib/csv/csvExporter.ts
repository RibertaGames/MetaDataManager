import Papa from "papaparse";
import { MetadataFields } from "@/types/metadata";

export function exportToCsv(fields: MetadataFields, langCodes: string[]): string {
  const rows: string[][] = [];
  // ヘッダー行
  rows.push(["field", ...langCodes]);
  // データ行
  for (const [fieldKey, langMap] of Object.entries(fields)) {
    const row = [fieldKey, ...langCodes.map((lang) => langMap[lang] ?? "")];
    rows.push(row);
  }
  return Papa.unparse(rows);
}
