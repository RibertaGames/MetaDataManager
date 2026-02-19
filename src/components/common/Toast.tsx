"use client";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let setToastsGlobal: React.Dispatch<React.SetStateAction<ToastMessage[]>> | null = null;

export function showToast(message: string, type: ToastType = "success") {
  setToastsGlobal?.((prev) => [...prev, { id: ++toastId, message, type }]);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  setToastsGlobal = setToasts;

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all
            ${t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-blue-600"}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
