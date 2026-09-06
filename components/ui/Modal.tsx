"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
  /** Footer action buttons — rendered inside the modal footer */
  actions?: React.ReactNode;
  hideHeader?: boolean;
  noPadding?: boolean;
  fullScreenOnMobile?: boolean;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md sm:max-w-lg",
  lg: "max-w-lg sm:max-w-xl lg:max-w-2xl",
  xl: "max-w-xl sm:max-w-2xl lg:max-w-3xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  actions,
  hideHeader,
  noPadding,
  fullScreenOnMobile = false,
}: ModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const isFullMobile = fullScreenOnMobile || (size === "xl" && noPadding);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={description ? "modal-description" : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${
              isFullMobile ? "p-0 sm:p-4" : "p-2 sm:p-4"
            }`}
          >
            <div
              className={`w-full ${sizeMap[size]} bg-surface border border-border shadow-2xl pointer-events-auto flex flex-col overflow-hidden overscroll-contain my-auto ${
                isFullMobile
                  ? "h-full sm:h-auto max-h-[100dvh] sm:max-h-[88vh] rounded-none sm:rounded-2xl"
                  : "max-h-[92dvh] sm:max-h-[88vh] rounded-2xl"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {!hideHeader && (title || description) && (
                <div className="flex items-start justify-between p-3.5 sm:p-5 border-b border-border shrink-0">
                  <div className="pr-2 min-w-0">
                    {title && (
                      <h2 id="modal-title" className="text-base sm:text-lg font-semibold text-foreground truncate">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p id="modal-description" className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-fg line-clamp-2 sm:line-clamp-none">
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="ml-2 flex-shrink-0 text-muted-fg hover:text-foreground transition-colors rounded-lg p-1.5 hover:bg-neutral-800 -mr-1"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Body */}
              {children && (
                noPadding ? (
                  <div className="flex-1 flex flex-col overflow-hidden min-h-0">{children}</div>
                ) : (
                  <div className="p-3.5 sm:p-6 overflow-y-auto overscroll-contain flex-1 [scrollbar-width:thin]">{children}</div>
                )
              )}

              {/* Footer */}
              {actions && (
                <div className="flex items-center justify-end gap-2.5 sm:gap-3 p-3.5 sm:px-6 sm:pb-5 pt-3 border-t border-border/50 shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Convenience: Confirmation Modal for destructive actions */
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      actions={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
