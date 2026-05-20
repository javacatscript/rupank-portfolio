"use client";

import { useEffect, useRef, useState } from "react";
import { verifyAdminKey } from "@/lib/projectsAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = "ADMIN_ACCESS_REQUIRED",
}: AuthModalProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setKey("");
      setError("");
      setIsSubmitting(false);
      return;
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

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
    setError("");
    setIsSubmitting(true);

    const result = await verifyAdminKey(key);
    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    try {
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close authentication modal"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md border border-terminal-white/20 bg-bg-card p-5 sm:p-6 box-retro border-glow animate-fadeInUp">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] text-terminal-muted tracking-widest uppercase mb-1">
              Security Checkpoint
            </p>
            <h3
              id="auth-modal-title"
              className="text-terminal-green text-sm sm:text-base font-bold uppercase tracking-wider text-glow-sm"
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-terminal-muted hover:text-terminal-white text-xs tracking-widest uppercase transition-colors"
            aria-label="Close"
          >
            [ESC]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Enter_Security_Key
            </span>
            <input
              ref={inputRef}
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="********"
              className="mt-2 w-full bg-bg-card-alt border border-terminal-white/20 px-3 py-2.5 text-sm text-terminal-white placeholder:text-terminal-muted/60 focus:outline-none focus:border-terminal-green/60 transition-colors"
              autoComplete="off"
              required
            />
          </label>

          {error && (
            <p
              role="alert"
              className="text-accent-red text-xs tracking-wider border border-accent-red/30 bg-accent-red/10 px-3 py-2"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="submit"
              disabled={isSubmitting || !key.trim()}
              className="flex-1 bg-terminal-green text-black text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-terminal-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "VERIFYING..." : "UNLOCK_ACCESS"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-terminal-white/10 text-terminal-muted text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-terminal-white/20 hover:text-terminal-white transition-colors"
            >
              ABORT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
