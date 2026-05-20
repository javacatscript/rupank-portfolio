"use client";

import { useEffect, useState } from "react";
import type { Project, ProjectFormData } from "@/types/project";

interface ProjectFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData?: Project;
  onClose: () => void;
  onSave: (data: ProjectFormData, id?: string) => void | Promise<void>;
}

const inputClass =
  "mt-2 w-full bg-bg-card-alt border border-terminal-white/20 px-3 py-2.5 text-sm text-terminal-white placeholder:text-terminal-muted/60 focus:outline-none focus:border-terminal-green/60 transition-colors";

const emptyForm: ProjectFormData = {
  title: "",
  description: "",
  techStack: [],
  liveUrl: "",
  githubUrl: "",
  imageUrl: "",
};

function getInitialForm(mode: "add" | "edit", initialData?: Project): ProjectFormData {
  if (mode === "edit" && initialData) {
    return {
      title: initialData.title,
      description: initialData.description,
      techStack: initialData.techStack,
      liveUrl: initialData.liveUrl ?? "",
      githubUrl: initialData.githubUrl ?? "",
      imageUrl: initialData.imageUrl ?? "",
    };
  }

  return emptyForm;
}

export default function ProjectFormModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
}: ProjectFormModalProps) {
  const [form, setForm] = useState<ProjectFormData>(() =>
    getInitialForm(mode, initialData)
  );
  const [techInput, setTechInput] = useState(() =>
    mode === "edit" && initialData ? initialData.techStack.join(", ") : ""
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
    const description = form.description.trim();
    const techStack = techInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!title || !description || techStack.length === 0) {
      setError("Title, description, and at least one tech tag are required.");
      return;
    }

    await onSave(
      {
        title,
        description,
        techStack,
        liveUrl: form.liveUrl?.trim() || undefined,
        githubUrl: form.githubUrl?.trim() || undefined,
        imageUrl: form.imageUrl?.trim() || undefined,
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
      aria-labelledby="project-form-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close project form"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-terminal-white/20 bg-bg-card p-5 sm:p-6 box-retro border-glow animate-fadeInUp">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] text-terminal-muted tracking-widest uppercase mb-1">
              {mode === "add" ? "New Entry" : "Edit Entry"}
            </p>
            <h3
              id="project-form-title"
              className="text-terminal-green text-sm sm:text-base font-bold uppercase tracking-wider text-glow-sm"
            >
              {mode === "add" ? "ADD_NEW_LOOT" : "UPDATE_LOOT_DATA"}
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
          <FormField label="Project_Title">
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className={inputClass}
              required
            />
          </FormField>

          <FormField label="Short_Description">
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={4}
              className={`${inputClass} resize-y min-h-[96px]`}
              required
            />
          </FormField>

          <FormField label="Tech_Stack (comma separated)">
            <input
              value={techInput}
              onChange={(event) => setTechInput(event.target.value)}
              placeholder="React, Next.js, TypeScript"
              className={inputClass}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Live_Link (optional)">
              <input
                value={form.liveUrl ?? ""}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, liveUrl: event.target.value }))
                }
                placeholder="https://"
                className={inputClass}
              />
            </FormField>

            <FormField label="GitHub_Link (optional)">
              <input
                value={form.githubUrl ?? ""}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    githubUrl: event.target.value,
                  }))
                }
                placeholder="https://github.com/..."
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Thumbnail_URL (optional)">
            <input
              value={form.imageUrl ?? ""}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
              }
              placeholder="https://..."
              className={inputClass}
            />
          </FormField>

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
              {mode === "add" ? "SAVE_NEW_LOOT" : "COMMIT_CHANGES"}
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

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
