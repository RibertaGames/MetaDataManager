"use client";
import { useEffect, useState, useCallback } from "react";
import { MetadataFields } from "@/types/metadata";
import { FieldDef } from "@/lib/constants/iosFields";
import { LANGUAGES, IOS_TO_DEEPL, ANDROID_TO_DEEPL } from "@/lib/constants/languages";
import FieldRow from "./FieldRow";
import { showToast } from "@/components/common/Toast";

interface Props {
  projectId: string;
  platform: "ios" | "android";
  fields: FieldDef[];
}

export default function MetadataEditor({ projectId, platform, fields }: Props) {
  const [values, setValues] = useState<MetadataFields>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/metadata/${platform}?projectId=${projectId}`);
      const data = await res.json();
      setValues(data.fields ?? {});
    } catch {
      showToast("データの読み込みに失敗しました", "error");
    } finally {
      setLoading(false);
    }
  }, [projectId, platform]);

  useEffect(() => { load(); }, [load]);

  function handleChange(fieldKey: string, lang: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [fieldKey]: { ...(prev[fieldKey] ?? {}), [lang]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/metadata/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, fields: values }),
      });
      if (res.ok) showToast("保存しました");
      else showToast("保存に失敗しました", "error");
    } catch {
      showToast("保存中にエラーが発生しました", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleTranslateAll() {
    const sourceLang = platform === "ios" ? "ja" : "ja-JP";
    const toDeepl = platform === "ios" ? IOS_TO_DEEPL : ANDROID_TO_DEEPL;

    const targetLangs = LANGUAGES
      .filter((l) => {
        const code = platform === "ios" ? l.ios : l.android;
        return code !== sourceLang;
      })
      .map((l) => l.deepl);

    setTranslating(true);
    showToast("全フィールドを翻訳中...", "info");

    let done = 0;
    for (const field of fields) {
      const sourceText = values[field.key]?.[sourceLang];
      if (!sourceText?.trim()) { done++; continue; }

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: sourceText, sourceLang: "JA", targetLangs }),
        });
        const data = await res.json();

        for (const lang of LANGUAGES) {
          const code = platform === "ios" ? lang.ios : lang.android;
          if (code === sourceLang) continue;
          const translated = data.translations[lang.deepl];
          if (translated) {
            setValues((prev) => ({
              ...prev,
              [field.key]: { ...(prev[field.key] ?? {}), [code]: translated },
            }));
          }
        }
      } catch {
        // 個別のエラーはスキップ
      }
      done++;
    }

    setTranslating(false);
    showToast("一括翻訳が完了しました");
  }

  async function handleExportCsv() {
    const res = await fetch(`/api/csv/export?projectId=${projectId}&platform=${platform}`);
    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="(.+?)"/);
    const filename = match?.[1] ?? `${platform}_metadata.csv`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("platform", platform);
    formData.append("file", file);

    try {
      const res = await fetch("/api/csv/import", { method: "POST", body: formData });
      if (res.ok) {
        showToast("CSVをインポートしました");
        await load();
      } else {
        showToast("CSVのインポートに失敗しました", "error");
      }
    } catch {
      showToast("インポート中にエラーが発生しました", "error");
    }
    e.target.value = "";
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">読み込み中...</div>;
  }

  return (
    <div>
      {/* ツールバー */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={handleTranslateAll}
          disabled={translating}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm font-medium transition"
        >
          {translating ? "翻訳中..." : "🌐 一括翻訳 (JA→全言語)"}
        </button>
        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium transition"
        >
          📥 CSVエクスポート
        </button>
        <label className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium transition cursor-pointer">
          📤 CSVインポート
          <input type="file" accept=".csv" className="hidden" onChange={handleImportCsv} />
        </label>
        <div className="flex-1" />
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-semibold transition"
        >
          {saving ? "保存中..." : "💾 保存"}
        </button>
      </div>

      {/* フィールド一覧 */}
      {fields.map((field) => (
        <FieldRow
          key={field.key}
          field={field}
          values={values[field.key] ?? {}}
          platform={platform}
          onChange={(lang, value) => handleChange(field.key, lang, value)}
        />
      ))}
    </div>
  );
}
