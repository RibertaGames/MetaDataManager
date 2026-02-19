import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/translate/deepl";

export async function POST(req: NextRequest) {
  const { text, sourceLang, targetLangs } = await req.json() as {
    text: string;
    sourceLang: string;
    targetLangs: string[];
  };

  if (!text || !sourceLang || !targetLangs?.length) {
    return NextResponse.json({ error: "text, sourceLang, targetLangs は必須です" }, { status: 400 });
  }

  const results: Record<string, string> = {};
  const errors: Record<string, string> = {};

  for (const targetLang of targetLangs) {
    try {
      results[targetLang] = await translateText(text, sourceLang, targetLang);
    } catch (e) {
      errors[targetLang] = e instanceof Error ? e.message : "Unknown error";
    }
  }

  return NextResponse.json({ translations: results, errors });
}
