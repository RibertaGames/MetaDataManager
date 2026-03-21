"use client";
import { useEffect, useState, useCallback } from "react";
import {
  FieldDef,
  ConfigFieldDef,
  IOS_PRIMARY_CATEGORIES,
  IOS_GAME_SUB_CATEGORIES,
  IOS_STICKER_SUB_CATEGORIES,
  ANDROID_ALL_CATEGORIES,
} from "@/lib/constants/define";
import { showToast } from "@/components/common/Toast";

interface Props {
  projectId: string;
  platform: "ios" | "android";
  categoryFields: FieldDef[];
  reviewInfoFields: FieldDef[];
  deliverfileConfig: ConfigFieldDef[];
  submissionInfo: ConfigFieldDef[];
  ageRating: ConfigFieldDef[];
}

type ConfigValues = Record<string, string | number | boolean>;

export default function ConfigEditor({
  projectId,
  platform,
  categoryFields,
  reviewInfoFields,
  deliverfileConfig,
  submissionInfo,
  ageRating,
}: Props) {
  const [categoryValues, setCategoryValues] = useState<Record<string, string>>({});
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
      setCategoryValues(data.category ?? {});
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
          category: categoryValues,
          reviewInfo,
          deliverfile,
          submission,
          ageRating: rating,
        }),
      });
      if (res.ok) {
        showToast("設定を保存しました");
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast(
          `保存に失敗しました: ${errorData.error || errorData.details || "不明なエラー"}`,
          "error"
        );
      }
    } catch (error) {
      showToast(`保存中にエラーが発生しました: ${error instanceof Error ? error.message : "不明なエラー"}`, "error");
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

      {/* カテゴリ設定 */}
      {categoryFields.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            📂 カテゴリ設定
          </h2>

          {/* Android の場合：シンプルな1つのカテゴリ選択 */}
          {platform === "android" && (
            <div className="p-6 bg-white rounded-lg border-2 border-green-100 shadow-sm">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                カテゴリ <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryValues.category ?? ""}
                onChange={(e) =>
                  setCategoryValues((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {ANDROID_ALL_CATEGORIES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                アプリまたはゲームのカテゴリを1つ選択してください
              </p>
            </div>
          )}

          {/* iOS の場合：階層的なカテゴリ選択 */}
          {platform === "ios" && (
            <>
              {/* 主カテゴリとサブカテゴリ */}
              <div className="mb-6 p-6 bg-white rounded-lg border-2 border-blue-100 shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                主カテゴリ <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryValues.primary_category ?? ""}
                onChange={(e) =>
                  setCategoryValues((prev) => ({ ...prev, primary_category: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {IOS_PRIMARY_CATEGORIES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ゲームのサブカテゴリ */}
            {categoryValues.primary_category === "GAMES" && (
              <div className="ml-6 mt-4 pl-4 border-l-4 border-blue-300 bg-blue-50 p-4 rounded-r-lg">
                <div className="text-sm font-medium text-blue-900 mb-3">
                  🎮 ゲームジャンル（最大2つまで選択可能）
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      ジャンル 1
                    </label>
                    <select
                      value={categoryValues.primary_first_sub_category ?? ""}
                      onChange={(e) =>
                        setCategoryValues((prev) => ({
                          ...prev,
                          primary_first_sub_category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {IOS_GAME_SUB_CATEGORIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      ジャンル 2（任意）
                    </label>
                    <select
                      value={categoryValues.primary_second_sub_category ?? ""}
                      onChange={(e) =>
                        setCategoryValues((prev) => ({
                          ...prev,
                          primary_second_sub_category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {IOS_GAME_SUB_CATEGORIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ステッカーのサブカテゴリ */}
            {categoryValues.primary_category === "STICKERS" && (
              <div className="ml-6 mt-4 pl-4 border-l-4 border-purple-300 bg-purple-50 p-4 rounded-r-lg">
                <div className="text-sm font-medium text-purple-900 mb-3">
                  🎨 ステッカータイプ（最大2つまで選択可能）
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      タイプ 1
                    </label>
                    <select
                      value={categoryValues.primary_first_sub_category ?? ""}
                      onChange={(e) =>
                        setCategoryValues((prev) => ({
                          ...prev,
                          primary_first_sub_category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {IOS_STICKER_SUB_CATEGORIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      タイプ 2（任意）
                    </label>
                    <select
                      value={categoryValues.primary_second_sub_category ?? ""}
                      onChange={(e) =>
                        setCategoryValues((prev) => ({
                          ...prev,
                          primary_second_sub_category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {IOS_STICKER_SUB_CATEGORIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 副カテゴリとサブカテゴリ */}
          <div className="p-6 bg-white rounded-lg border-2 border-gray-100 shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                副カテゴリ <span className="text-gray-400 text-xs">(任意)</span>
              </label>
              <select
                value={categoryValues.secondary_category ?? ""}
                onChange={(e) =>
                  setCategoryValues((prev) => ({ ...prev, secondary_category: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              >
                {IOS_PRIMARY_CATEGORIES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 副カテゴリがゲームの場合 */}
            {categoryValues.secondary_category === "GAMES" && (
              <div className="ml-6 mt-4 pl-4 border-l-4 border-green-300 bg-green-50 p-4 rounded-r-lg">
                <div className="text-sm font-medium text-green-900 mb-3">
                  🎮 副カテゴリ - ゲームジャンル
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      ジャンル 1
                    </label>
                    <select
                      value={categoryValues.secondary_first_sub_category ?? ""}
                      onChange={(e) =>
                        setCategoryValues((prev) => ({
                          ...prev,
                          secondary_first_sub_category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {IOS_GAME_SUB_CATEGORIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      ジャンル 2（任意）
                    </label>
                    <select
                      value={categoryValues.secondary_second_sub_category ?? ""}
                      onChange={(e) =>
                        setCategoryValues((prev) => ({
                          ...prev,
                          secondary_second_sub_category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {IOS_GAME_SUB_CATEGORIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 副カテゴリがステッカーの場合 */}
            {categoryValues.secondary_category === "STICKERS" && (
              <div className="ml-6 mt-4 pl-4 border-l-4 border-pink-300 bg-pink-50 p-4 rounded-r-lg">
                <div className="text-sm font-medium text-pink-900 mb-3">
                  🎨 副カテゴリ - ステッカータイプ
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      タイプ 1
                    </label>
                    <select
                      value={categoryValues.secondary_first_sub_category ?? ""}
                      onChange={(e) =>
                        setCategoryValues((prev) => ({
                          ...prev,
                          secondary_first_sub_category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {IOS_STICKER_SUB_CATEGORIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      タイプ 2（任意）
                    </label>
                    <select
                      value={categoryValues.secondary_second_sub_category ?? ""}
                      onChange={(e) =>
                        setCategoryValues((prev) => ({
                          ...prev,
                          secondary_second_sub_category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {IOS_STICKER_SUB_CATEGORIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 審査担当者向け連絡先情報（iOSのみ）*/}
      {reviewInfoFields.length > 0 && (
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
      )}

      {/* Deliverfile 基本設定 */}
      {deliverfileConfig.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            ⚙️ {platform === "ios" ? "Deliverfile" : "Supply"} 基本設定
          </h2>
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
                ) : field.type === "select" && field.options ? (
                  <select
                    value={deliverfile[field.key] ?? (field.options[0]?.value || "")}
                    onChange={(e) => {
                      const value = field.options?.find((opt) => String(opt.value) === e.target.value)?.value;
                      setDeliverfile((prev) => ({ ...prev, [field.key]: value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {field.options.map((opt) => (
                      <option key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
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
      )}

      {/* Submission Information (コンテンツ権利・IDFA・暗号化)（iOSのみ） */}
      {submissionInfo.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            🔒 Submission Information（コンテンツ権利・IDFA・暗号化）
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
      )}

      {/* 年齢制限設定 */}
      {ageRating.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">🔞 年齢制限設定</h2>
        <div className="space-y-4">
          {ageRating.map((field) => (
            <div key={field.key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
              {field.description && (
                <p className="text-xs text-gray-500 mb-2">{field.description}</p>
              )}
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
              ) : field.type === "boolean" ? (
                <input
                  type="checkbox"
                  checked={rating[field.key] === true}
                  onChange={(e) =>
                    setRating((prev) => ({ ...prev, [field.key]: e.target.checked }))
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              ) : null}
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}
