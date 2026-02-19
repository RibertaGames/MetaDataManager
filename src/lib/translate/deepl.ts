import { readSettings } from "@/lib/fs/settingsStore";

interface DeepLResult {
  translations: { text: string; detected_source_language: string }[];
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const settings = readSettings();
  if (!settings.deeplApiKey) throw new Error("DeepL APIキーが設定されていません");

  const endpoint = settings.deeplFreeApi
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${settings.deeplApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL API error: ${res.status} ${err}`);
  }

  const data: DeepLResult = await res.json();
  return data.translations[0]?.text ?? "";
}
