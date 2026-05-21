"use client";

import { useEffect, useState } from "react";
import type { ResumeArchiveContent } from "@/types/siteContent";

const inputClass =
  "mt-2 w-full bg-bg-card-alt border border-terminal-white/20 px-3 py-2.5 text-sm text-terminal-white placeholder:text-terminal-muted/60 focus:outline-none focus:border-terminal-green/60 transition-colors";

interface ResumeArchiveEditModalProps {
  isOpen: boolean;
  initial: ResumeArchiveContent;
  onClose: () => void;
  onSaveMetadata: (data: ResumeArchiveContent) => void | Promise<void>;
  onUpload: (
    data: ResumeArchiveContent,
    file: File
  ) => void | Promise<void>;
}

export default function ResumeArchiveEditModal({
  isOpen,
  initial,
  onClose,
  onSaveMetadata,
  onUpload,
}: ResumeArchiveEditModalProps) {
  const [title, setTitle] = useState(initial.title);
  const [downloadName, setDownloadName] = useState(initial.downloadName);
  const [format, setFormat] = useState(initial.format);
  const [sizeLabel, setSizeLabel] = useState(initial.sizeLabel);
  const [fileUrl, setFileUrl] = useState(initial.fileUrl);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initial.title);
    setDownloadName(initial.downloadName);
    setFormat(initial.format);
    setSizeLabel(initial.sizeLabel);
    setFileUrl(initial.fileUrl);
    setFile(null);
    setError("");
  }, [isOpen, initial]);

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
    if (!title.trim() || !downloadName.trim()) {
      setError("Title and download filename are required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const metadata: ResumeArchiveContent = {
        title: title.trim(),
        downloadName: downloadName.trim(),
        format: format.trim() || "PDF",
        sizeLabel: sizeLabel.trim() || initial.sizeLabel,
        fileUrl: fileUrl.trim() || initial.fileUrl,
        updatedAt: initial.updatedAt,
      };

      if (file) {
        await onUpload(metadata, file);
      } else {
        await onSaveMetadata(metadata);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save resume");
    } finally {
      setIsSaving(false);
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

      <div className="relative w-full max-w-lg border border-terminal-white/20 bg-bg-card p-5 sm:p-6 box-retro border-glow animate-fadeInUp max-h-[90vh] overflow-y-auto">
        <p className="text-[10px] text-terminal-muted tracking-widest uppercase mb-1">
          Contact Module
        </p>
        <h3 className="text-terminal-green text-sm font-bold uppercase tracking-wider text-glow-sm mb-5">
          EDIT_ARCHIVE_DATA
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Archive_Title
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Resume_Rupank.v2"
            />
          </label>

          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Download_Filename
            </span>
            <input
              value={downloadName}
              onChange={(e) => setDownloadName(e.target.value)}
              className={inputClass}
              placeholder="Rupank_Joshi_Resume.pdf"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
                Format
              </span>
              <input
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
                Size_Label
              </span>
              <input
                value={sizeLabel}
                onChange={(e) => setSizeLabel(e.target.value)}
                className={inputClass}
                placeholder="143KB"
                disabled={!!file}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              File_URL
            </span>
            <input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className={inputClass}
              placeholder="/resume.pdf"
              disabled={!!file}
            />
            <p className="mt-1 text-[10px] text-terminal-muted/70 tracking-wider">
              Leave as-is when uploading a new PDF below (URL updates automatically).
            </p>
          </label>

          <label className="block">
            <span className="text-[10px] text-terminal-muted tracking-widest uppercase">
              Upload_New_PDF
            </span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => {
                const next = e.target.files?.[0] ?? null;
                setFile(next);
                if (next) setError("");
              }}
              className="mt-2 w-full text-xs text-terminal-muted file:mr-3 file:border file:border-terminal-white/20 file:bg-bg-card-alt file:px-3 file:py-2 file:text-terminal-green file:uppercase file:tracking-widest file:text-[10px] hover:file:border-terminal-green/60"
            />
            <p className="mt-1 text-[10px] text-terminal-muted/70 tracking-wider">
              Max 10MB. Replaces the stored resume when selected.
            </p>
          </label>

          {error && (
            <p className="text-red-400 text-xs tracking-wider">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border border-terminal-white/20 hover:border-terminal-muted transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border border-terminal-green text-terminal-green hover:bg-terminal-green/10 transition-colors disabled:opacity-50"
            >
              {isSaving ? "SAVING..." : file ? "UPLOAD & SAVE" : "SAVE_METADATA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
