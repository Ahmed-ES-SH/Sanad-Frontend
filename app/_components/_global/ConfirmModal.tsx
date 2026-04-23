"use client";

import React, { useEffect, useRef } from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Accessible confirmation modal.
 * Non-invasive: purely a UI wrapper that does not change business logic.
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Confirm",
  description = "Are you sure you want to continue?",
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      // trap focus on open: move focus to the confirm button
      setTimeout(() => confirmButtonRef.current?.focus(), 0);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [open, onCancel]);

  if (!open) return null;

  return (
    // backdrop
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />

      <div
        ref={dialogRef}
        className="z-50 max-w-lg w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6"
      >
        <h2 id="confirm-modal-title" className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        <p id="confirm-modal-desc" className="mt-2 text-sm text-gray-600">
          {description}
        </p>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
