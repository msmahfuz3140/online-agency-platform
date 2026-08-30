"use client";

import { ToastContainer } from "./Toast";
import { useToast } from "./useToast";

/**
 * Drop-in wrapper: renders the ToastContainer and exposes the toast() function.
 *
 * Usage:
 *   const { toast, ToastPortal } = useToastPortal();
 *   ...
 *   <ToastPortal />
 *   <button onClick={() => toast("success", "Saved!")}>Save</button>
 */
export function useToastPortal() {
  const { toast, dismiss, toasts } = useToast();

  function ToastPortal() {
    return <ToastContainer toasts={toasts} onDismiss={dismiss} />;
  }

  return { toast, ToastPortal };
}
