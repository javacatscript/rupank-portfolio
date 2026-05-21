"use client";

import { useEffect, useState } from "react";

const inputClass =
  "mt-2 w-full bg-bg-card-alt border border-terminal-white/20 px-3 py-2.5 text-sm text-terminal-white font-mono focus:outline-none focus:border-terminal-green/60";

interface SystemLogEditModalProps {
  isOpen: boolean;
  initialLines: string[];
  onClose: () => void;
  onSave: (lines: string[]) => void | Promise<void>;
}

export default function SystemLogEditModal({
  isOpen,
  initialLines,
  onClose,
  onSave,
}: SystemLogEditModalProps) {
  const [text, setText] = useState(initialLines.join("\n"));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = text
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line) => line.length > 0);

    if (lines.length === 0) return;
    setError("");
    try {
      await onSave(lines);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save system log");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-lg border border-terminal-white/20 bg-bg-card p-5 box-retro border-glow animate-fadeInUp">
        <h3 className="text-terminal-green text-sm font-bold uppercase tracking-wider mb-2">
          EDIT_SYSTEM_LOG
        </h3>
        <p className="text-[10px] text-terminal-muted mb-4">
          One line per row. Keep the last line as {"> _"} for the blinking cursor effect.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className={`${inputClass} resize-y min-h-[160px]`}
          />

          {error && (
            <p className="text-red-400 text-xs tracking-wider mt-3">{error}</p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 bg-terminal-green text-black text-xs font-bold uppercase py-2.5"
            >
              SAVE_LOG
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-terminal-white/10 text-terminal-muted text-xs font-bold uppercase py-2.5"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
