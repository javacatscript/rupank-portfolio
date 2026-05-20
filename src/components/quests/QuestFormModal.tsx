"use client";

import { useEffect, useState } from "react";
import type { Quest, QuestFormData, QuestStatus } from "@/types/quest";

interface QuestFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData?: Quest;
  onClose: () => void;
  onSave: (data: QuestFormData, id?: string) => void | Promise<void>;
}

const inputClass =
  "mt-2 w-full bg-bg-card-alt border border-terminal-white/20 px-3 py-2.5 text-sm text-terminal-white placeholder:text-terminal-muted/60 focus:outline-none focus:border-terminal-green/60 transition-colors";

const emptyForm: QuestFormData = {
  status: "active",
  title: "",
  company: "",
  period: "",
  description: "",
};

function getInitialForm(mode: "add" | "edit", initialData?: Quest): QuestFormData {
  if (mode === "edit" && initialData) {
    return {
      status: initialData.status,
      title: initialData.title,
      company: initialData.company,
      period: initialData.period,
      description: initialData.description,
    };
  }
  return emptyForm;
}

export default function QuestFormModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
}: QuestFormModalProps) {
  const [form, setForm] = useState<QuestFormData>(() =>
    getInitialForm(mode, initialData)
  );
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

    const title = form.title.trim();
    const company = form.company.trim();
    const period = form.period.trim();
    const description = form.description.trim();

    if (!title || !company || !period || !description) {
      setError("All fields are required.");
      return;
    }

    await onSave(
      {
        status: form.status,
        title,
        company,
        period,
        description,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-form-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close quest form"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-terminal-white/20 bg-bg-card p-5 sm:p-6 box-retro border-glow animate-fadeInUp">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] text-terminal-muted tracking-widest uppercase mb-1">
              {mode === "add" ? "New Quest" : "Edit Quest"}
            </p>
            <h3
              id="quest-form-title"
              className="text-terminal-green text-sm sm:text-base font-bold uppercase tracking-wider text-glow-sm"
            >
              {mode === "add" ? "ADD_NEW_QUEST" : "UPDATE_QUEST_DATA"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-terminal-muted hover:text-terminal-white text-xs tracking-widest uppercase transition-colors"
          >
            [ESC]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Quest_Status
            </span>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as QuestStatus,
                }))
              }
              className={inputClass}
            >
              <option value="active">Active Quest</option>
              <option value="completed">Quest Completed</option>
            </select>
          </label>

          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Role_Title
            </span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className={inputClass}
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
                Company
              </span>
              <input
                value={form.company}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, company: event.target.value }))
                }
                className={inputClass}
                required
              />
            </label>

            <label className="block">
              <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
                Period
              </span>
              <input
                value={form.period}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, period: event.target.value }))
                }
                placeholder="Jan 2024 - PRESENT"
                className={inputClass}
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={5}
              className={`${inputClass} resize-y min-h-[120px]`}
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
              className="flex-1 bg-terminal-green text-black text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-terminal-green/90 transition-colors"
            >
              {mode === "add" ? "SAVE_QUEST" : "COMMIT_CHANGES"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-terminal-white/10 text-terminal-muted text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-terminal-white/20 hover:text-terminal-white transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
