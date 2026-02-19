import Papa from "papaparse";
import { MetadataFields } from "@/types/metadata";

export function importFromCsv(csvText: string): MetadataFields {
  const result = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
  const rows = result.data;
  if (rows.length < 2) return {};

  const headers = rows[0]; // ["field", "en-US", "ja", ...]
  const langCodes = headers.slice(1);
  const fields: MetadataFields = {};

  for (const row of rows.slice(1)) {
    const fieldKey = row[0];
    if (!fieldKey) continue;
    fields[fieldKey] = {};
    for (let i = 0; i < langCodes.length; i++) {
      fields[fieldKey][langCodes[i]] = row[i + 1] ?? "";
    }
  }

  return fields;
}
