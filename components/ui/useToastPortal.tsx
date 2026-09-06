"use client";

import React, { useMemo, useRef } from "react";
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
  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;
  const dismissRef = useRef(dismiss);
  dismissRef.current = dismiss;

  const handleDismiss = React.useCallback((id: string) => {
    dismissRef.current(id);
  }, []);

  // Keep a stable component reference across parent re-renders
  // to avoid unmounting/remounting the ToastContainer and replaying animations.
  const ToastPortal = useMemo(() => {
    return function ToastPortal() {
      return <ToastContainer toasts={toastsRef.current} onDismiss={handleDismiss} />;
    };
  }, [handleDismiss]);

  return { toast, ToastPortal };
}
