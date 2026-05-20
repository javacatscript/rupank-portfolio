"use client";

import { useEffect, useState } from "react";
import type { Skill, SkillCategory, SkillFormData } from "@/types/skill";

interface SkillFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData?: Skill;
  onClose: () => void;
  onSave: (data: SkillFormData, id?: string) => void | Promise<void>;
}

const inputClass =
  "mt-2 w-full bg-bg-card-alt border border-terminal-white/20 px-3 py-2.5 text-sm text-terminal-white placeholder:text-terminal-muted/60 focus:outline-none focus:border-terminal-green/60 transition-colors";

const categoryOptions: { id: SkillCategory; label: string }[] = [
  { id: "languages", label: "LANGUAGES" },
  { id: "frontend", label: "FRONTEND" },
  { id: "backend", label: "BACKEND_APIS" },
  { id: "perf_ai", label: "PERF_AI" },
  { id: "tools", label: "TOOLS" },
];

const emptyForm: SkillFormData = {
  name: "",
  level: "",
  category: ["frontend"],
  icon: "??",
  highlight: false,
};

function getInitialForm(mode: "add" | "edit", initialData?: Skill): SkillFormData {
  if (mode === "edit" && initialData) {
    return {
      name: initialData.name,
      level: initialData.level,
      category: initialData.category,
      icon: initialData.icon,
      highlight: initialData.highlight ?? false,
    };
  }
  return emptyForm;
}

export default function SkillFormModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
}: SkillFormModalProps) {
  const [form, setForm] = useState<SkillFormData>(() =>
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

  const toggleCategory = (category: SkillCategory) => {
    setForm((prev) => {
      const hasCategory = prev.category.includes(category);
      const nextCategories = hasCategory
        ? prev.category.filter((item) => item !== category)
        : [...prev.category, category];
      return { ...prev, category: nextCategories };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();
    const level = form.level.trim();
    const icon = form.icon.trim();

    if (!name || !level || !icon || form.category.length === 0) {
      setError("Name, level, icon, and at least one category are required.");
      return;
    }

    await onSave(
      {
        name,
        level,
        icon,
        category: form.category,
        highlight: form.highlight,
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
      aria-labelledby="skill-form-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close skill form"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto border border-terminal-white/20 bg-bg-card p-5 sm:p-6 box-retro border-glow animate-fadeInUp">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] text-terminal-muted tracking-widest uppercase mb-1">
              {mode === "add" ? "New Skill" : "Edit Skill"}
            </p>
            <h3
              id="skill-form-title"
              className="text-terminal-green text-sm sm:text-base font-bold uppercase tracking-wider text-glow-sm"
            >
              {mode === "add" ? "ADD_NEW_SKILL" : "UPDATE_SKILL_DATA"}
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
              Skill_Name
            </span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className={inputClass}
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
                Level_Label
              </span>
              <input
                value={form.level}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, level: event.target.value }))
                }
                placeholder="LVL. 99"
                className={inputClass}
                required
              />
            </label>

            <label className="block">
              <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
                Icon
              </span>
              <input
                value={form.icon}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, icon: event.target.value }))
                }
                placeholder="TS"
                className={inputClass}
                required
              />
            </label>
          </div>

          <div>
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Categories
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {categoryOptions.map((option) => {
                const selected = form.category.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleCategory(option.id)}
                    className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border transition-colors ${
                      selected
                        ? "border-terminal-green text-terminal-green bg-terminal-green/10"
                        : "border-terminal-white/20 text-terminal-muted hover:border-terminal-green/40"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.highlight ?? false}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  highlight: event.target.checked,
                }))
              }
              className="accent-terminal-green"
            />
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Highlight_Skill
            </span>
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
              {mode === "add" ? "SAVE_SKILL" : "COMMIT_CHANGES"}
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
