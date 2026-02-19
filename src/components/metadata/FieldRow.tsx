"use client";
import { FieldDef } from "@/lib/constants/iosFields";
import { LANGUAGES, IOS_TO_DEEPL, ANDROID_TO_DEEPL } from "@/lib/constants/languages";
import { showToast } from "@/components/common/Toast";

interface Props {
  field: FieldDef;
  values: Record<string, string>;
  platform: "ios" | "android";
  onChange: (lang: string, value: string) => void;
}

export default function FieldRow({ field, values, platform, onChange }: Props) {
  const langs = LANGUAGES;
  const sourceLang = platform === "ios" ? "ja" : "ja-JP";
  const toDeepl = platform === "ios" ? IOS_TO_DEEPL : ANDROID_TO_DEEPL;

  async function handleTranslate() {
    const sourceText = values[sourceLang];
    if (!sourceText?.trim()) {
      showToast("日本語テキストを入力してください", "error");
      return;
    }

    const targetLangs = langs
      .filter((l) => {
        const code = platform === "ios" ? l.ios : l.android;
        return code !== sourceLang;
      })
      .map((l) => l.deepl);

    showToast(`「${field.label}」を翻訳中...`, "info");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, sourceLang: "JA", targetLangs }),
      });
      const data = await res.json();

      for (const lang of langs) {
        const code = platform === "ios" ? lang.ios : lang.android;
        if (code === sourceLang) continue;
        const translated = data.translations[lang.deepl];
        if (translated) onChange(code, translated);
      }
      showToast(`「${field.label}」の翻訳が完了しました`);
    } catch {
      showToast("翻訳中にエラーが発生しました", "error");
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      {/* フィールドヘッダー */}
      <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800">{field.label}</span>
          {field.maxLength && (
            <span className="text-xs text-gray-400">最大{field.maxLength}文字</span>
          )}
        </div>
        <button
          onClick={handleTranslate}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          JA → 全言語翻訳
        </button>
      </div>

      {/* 各言語のテキストエリア */}
      <div className="divide-y divide-gray-100">
        {langs.map((lang) => {
          const code = platform === "ios" ? lang.ios : lang.android;
          const value = values[code] ?? "";
          const isOver = field.maxLength !== null && value.length > field.maxLength;

          return (
            <div key={code} className="flex items-start px-4 py-2 gap-3">
              <div className="w-28 flex-shrink-0 pt-2">
                <span className="text-xs font-medium text-gray-600">{lang.label}</span>
                <div className="text-xs text-gray-400">{code}</div>
              </div>
              <div className="flex-1">
                {field.multiline ? (
                  <textarea
                    value={value}
                    onChange={(e) => onChange(code, e.target.value)}
                    rows={3}
                    className={`w-full text-sm text-gray-900 bg-white border rounded px-2 py-1.5 resize-y focus:outline-none focus:ring-2
                      ${isOver ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(code, e.target.value)}
                    className={`w-full text-sm text-gray-900 bg-white border rounded px-2 py-1.5 focus:outline-none focus:ring-2
                      ${isOver ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                  />
                )}
              </div>
              {field.maxLength && (
                <div className={`text-xs pt-2 w-14 text-right flex-shrink-0 ${isOver ? "text-red-500 font-bold" : "text-gray-400"}`}>
                  {value.length}/{field.maxLength}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
