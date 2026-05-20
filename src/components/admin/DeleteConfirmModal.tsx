"use client";

import { useEffect } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  description?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  itemName,
  description = "This cannot be undone.",
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close delete confirmation"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md border border-terminal-white/20 bg-bg-card p-5 sm:p-6 box-retro border-glow animate-fadeInUp">
        <p className="text-[10px] text-terminal-muted tracking-widest uppercase mb-1">
          Confirm Deletion
        </p>
        <h3
          id="delete-confirm-title"
          className="text-accent-red text-sm sm:text-base font-bold uppercase tracking-wider"
        >
          {title}
        </h3>
        <p className="mt-3 text-sm text-terminal-muted">
          Remove <span className="text-terminal-white">{itemName}</span>.{" "}
          {description}
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-accent-red text-black text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-accent-red/90 transition-colors"
          >
            CONFIRM_DELETE
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-terminal-white/10 text-terminal-muted text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-terminal-white/20 hover:text-terminal-white transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
