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
      setToasts((prev) => {
        if (prev.some((t) => t.type === type && t.title === title && t.description === description)) {
          return prev;
        }
        const id = `toast-${++idCounter}`;
        return [...prev, { id, type, title, description }];
      });
    },
    []
  );

  return { toast, dismiss, toasts };
}
