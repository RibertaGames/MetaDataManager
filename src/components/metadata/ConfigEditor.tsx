"use client";
import { useEffect, useState, useCallback } from "react";
import { FieldDef, ConfigFieldDef } from "@/lib/constants/define";
import { showToast } from "@/components/common/Toast";

interface Props {
  projectId: string;
  platform: "ios" | "android";
  reviewInfoFields: FieldDef[];
  deliverfileConfig: ConfigFieldDef[];
  submissionInfo: ConfigFieldDef[];
  ageRating: ConfigFieldDef[];
}

type ConfigValues = Record<string, string | number | boolean>;

export default function ConfigEditor({
  projectId,
  platform,
  reviewInfoFields,
  deliverfileConfig,
  submissionInfo,
  ageRating,
}: Props) {
  const [reviewInfo, setReviewInfo] = useState<Record<string, string>>({});
  const [deliverfile, setDeliverfile] = useState<ConfigValues>({});
  const [submission, setSubmission] = useState<ConfigValues>({});
  const [rating, setRating] = useState<ConfigValues>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/config/${platform}?projectId=${projectId}`);
      const data = await res.json();
      setReviewInfo(data.reviewInfo ?? {});
      setDeliverfile(data.deliverfile ?? {});
      setSubmission(data.submission ?? {});
      setRating(data.ageRating ?? {});
    } catch {
      showToast("設定の読み込みに失敗しました", "error");
    } finally {
      setLoading(false);
    }
  }, [projectId, platform]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/config/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          reviewInfo,
          deliverfile,
          submission,
          ageRating: rating,
        }),
      });
      if (res.ok) showToast("設定を保存しました");
      else showToast("保存に失敗しました", "error");
    } catch {
      showToast("保存中にエラーが発生しました", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">読み込み中...</div>;
  }

  return (
    <div>
      {/* ツールバー */}
      <div className="flex items-center gap-2 mb-6 justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-semibold transition"
        >
          {saving ? "保存中..." : "💾 保存"}
        </button>
      </div>

      {/* 審査担当者向け連絡先情報 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
          📧 審査担当者向け連絡先情報
        </h2>
        <div className="space-y-4">
          {reviewInfoFields.map((field) => (
            <div key={field.key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.label.includes("任意") ? "" : <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.multiline ? (
                <textarea
                  value={reviewInfo[field.key] ?? ""}
                  onChange={(e) =>
                    setReviewInfo((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  rows={3}
                  maxLength={field.maxLength ?? undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type={field.key.includes("email") ? "email" : field.key.includes("phone") ? "tel" : "text"}
                  value={reviewInfo[field.key] ?? ""}
                  onChange={(e) =>
                    setReviewInfo((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  maxLength={field.maxLength ?? undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Deliverfile 基本設定 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">⚙️ Deliverfile 基本設定</h2>
        <div className="space-y-4">
          {deliverfileConfig.map((field) => (
            <div key={field.key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              {field.description && (
                <p className="text-xs text-gray-500 mb-2">{field.description}</p>
              )}
              {field.type === "boolean" ? (
                <input
                  type="checkbox"
                  checked={deliverfile[field.key] === true}
                  onChange={(e) =>
                    setDeliverfile((prev) => ({ ...prev, [field.key]: e.target.checked }))
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              ) : field.type === "number" ? (
                <input
                  type="number"
                  value={deliverfile[field.key] ?? ""}
                  onChange={(e) =>
                    setDeliverfile((prev) => ({ ...prev, [field.key]: parseInt(e.target.value) || 0 }))
                  }
                  min={field.min}
                  max={field.max}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type="text"
                  value={deliverfile[field.key] ?? ""}
                  onChange={(e) =>
                    setDeliverfile((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submission Information (IDFA・暗号化設定) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
          🔒 Submission Information（IDFA・暗号化設定）
        </h2>
        <div className="space-y-4">
          {submissionInfo.map((field) => (
            <div key={field.key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={submission[field.key] === true}
                  onChange={(e) =>
                    setSubmission((prev) => ({ ...prev, [field.key]: e.target.checked }))
                  }
                  className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  {field.description && (
                    <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 年齢制限設定 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">🔞 年齢制限設定</h2>
        <div className="space-y-4">
          {ageRating.map((field) => (
            <div key={field.key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
              {field.type === "select" && field.options ? (
                <select
                  value={rating[field.key] ?? 0}
                  onChange={(e) =>
                    setRating((prev) => ({ ...prev, [field.key]: parseInt(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {field.options.map((opt) => (
                    <option key={String(opt.value)} value={opt.value as number}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
