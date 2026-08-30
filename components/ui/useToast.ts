"use client";

import { useCallback, useState } from "react";
import type { ToastData, ToastType } from "./Toast";

let idCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = `toast-${++idCounter}`;
      setToasts((prev) => [...prev, { id, type, title, description }]);
    },
    []
  );

  return { toast, dismiss, toasts };
}
