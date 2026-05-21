"use client";

import { useEffect, useState } from "react";
import type { HeroContent } from "@/types/siteContent";

const inputClass =
  "mt-2 w-full bg-bg-card-alt border border-terminal-white/20 px-3 py-2.5 text-sm text-terminal-white placeholder:text-terminal-muted/60 focus:outline-none focus:border-terminal-green/60 transition-colors";

interface HeroEditModalProps {
  isOpen: boolean;
  initial: HeroContent;
  onClose: () => void;
  onSave: (data: HeroContent) => void | Promise<void>;
}

export default function HeroEditModal({
  isOpen,
  initial,
  onClose,
  onSave,
}: HeroEditModalProps) {
  const [name, setName] = useState(initial.name);
  const [tagline, setTagline] = useState(initial.tagline);
  const [error, setError] = useState("");

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !tagline.trim()) {
      setError("Name and tagline are required.");
      return;
    }
    setError("");
    try {
      await onSave({ name: name.trim(), tagline: tagline.trim() });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save hero");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg border border-terminal-white/20 bg-bg-card p-5 sm:p-6 box-retro border-glow animate-fadeInUp">
        <p className="text-[10px] text-terminal-muted tracking-widest uppercase mb-1">
          Hero Module
        </p>
        <h3 className="text-terminal-green text-sm font-bold uppercase tracking-wider text-glow-sm mb-5">
          EDIT_PLAYER_PROFILE
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Display_Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </label>

          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              About / Tagline
            </span>
            <textarea
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              rows={4}
              className={`${inputClass} resize-y min-h-[100px]`}
              required
            />
          </label>

          {error && (
            <p className="text-accent-red text-xs border border-accent-red/30 bg-accent-red/10 px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-terminal-green text-black text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-terminal-green/90 transition-colors"
            >
              COMMIT_CHANGES
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-terminal-white/10 text-terminal-muted text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:text-terminal-white transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
