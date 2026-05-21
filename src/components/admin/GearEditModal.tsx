"use client";

import { useEffect, useState } from "react";
import type { GearItem } from "@/types/siteContent";

const inputClass =
  "mt-1 w-full bg-bg-card-alt border border-terminal-white/20 px-2 py-1.5 text-xs text-terminal-white focus:outline-none focus:border-terminal-green/60";

interface GearEditModalProps {
  isOpen: boolean;
  initial: GearItem[];
  onClose: () => void;
  onSave: (items: GearItem[]) => void | Promise<void>;
}

function createGearId() {
  return `gear-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function GearEditModal({
  isOpen,
  initial,
  onClose,
  onSave,
}: GearEditModalProps) {
  const [items, setItems] = useState<GearItem[]>(initial);
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

  const updateItem = (id: string, field: keyof GearItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: createGearId(), name: "NEW_GEAR", type: "TYPE", icon: "◆" },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = items
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        type: item.type.trim(),
        icon: item.icon.trim() || "◆",
      }))
      .filter((item) => item.name && item.type);

    if (cleaned.length === 0) return;
    setError("");
    try {
      await onSave(cleaned);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save gear");
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

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto border border-terminal-white/20 bg-bg-card p-5 box-retro border-glow animate-fadeInUp">
        <h3 className="text-terminal-green text-sm font-bold uppercase tracking-wider mb-4">
          EDIT_EQUIPPED_GEAR
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[40px_1fr_1fr_32px] gap-2 items-end border border-terminal-white/10 p-2"
            >
              <label className="block">
                <span className="text-[9px] text-terminal-muted uppercase">Icon</span>
                <input
                  value={item.icon}
                  onChange={(e) => updateItem(item.id, "icon", e.target.value)}
                  className={inputClass}
                  maxLength={2}
                />
              </label>
              <label className="block">
                <span className="text-[9px] text-terminal-muted uppercase">Name</span>
                <input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-[9px] text-terminal-muted uppercase">Type</span>
                <input
                  value={item.type}
                  onChange={(e) => updateItem(item.id, "type", e.target.value)}
                  className={inputClass}
                />
              </label>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-accent-red text-[10px] font-bold uppercase py-1.5 hover:bg-accent-red/10"
              >
                DEL
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="w-full border border-dashed border-terminal-green/40 text-terminal-green text-[10px] font-bold uppercase py-2 hover:bg-terminal-green/10"
          >
            + ADD GEAR SLOT
          </button>

          {error && (
            <p className="text-red-400 text-xs tracking-wider">{error}</p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-terminal-green text-black text-xs font-bold uppercase py-2.5"
            >
              SAVE_GEAR
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
