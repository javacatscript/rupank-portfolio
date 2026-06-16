"use client";

import { useEffect } from "react";
import type { Quest } from "@/types/quest";
import { getLootForQuest } from "@/data/lootData";

interface LootChestModalProps {
  quest: Quest | null;
  onClose: () => void;
}

export default function LootChestModal({ quest, onClose }: LootChestModalProps) {
  const isOpen = quest !== null;

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

  if (!quest) return null;

  const loot = getLootForQuest(quest.company);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loot-modal-title"
    >
      {/* Backdrop close */}
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close loot chest"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg border border-terminal-green/40 bg-bg-card p-5 sm:p-6 box-retro border-glow animate-fadeInUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-terminal-green text-base">✦</span>
            <p
              id="loot-modal-title"
              className="text-[10px] text-terminal-muted tracking-widest uppercase"
            >
              LOOT Acquired
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-terminal-muted hover:text-terminal-white transition-colors text-sm leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <h3 className="text-terminal-green font-bold uppercase tracking-tight text-lg mb-0.5">
          {quest.title}
        </h3>
        <p className="text-terminal-muted text-xs tracking-wider mb-4">
          {quest.company} · {quest.period}
        </p>

        {loot ? (
          <div className="space-y-5">
            {/* Tech Equipped */}
            <div>
              <p className="text-[9px] text-terminal-muted uppercase tracking-widest mb-2">
                ── Tech Equipped
              </p>
              <div className="flex flex-wrap gap-1.5">
                {loot.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] border border-terminal-green/40 px-2 py-0.5 text-terminal-green/90 uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Stat Boosts — only when data exists */}
            {loot.stats.length > 0 && (
              <div>
                <p className="text-[9px] text-terminal-muted uppercase tracking-widest mb-2">
                  ── Stat Boosts
                </p>
                <div className="space-y-1">
                  {loot.stats.map(({ value, label }) => (
                    <div key={label} className="flex items-baseline gap-3">
                      <span className="text-terminal-green font-bold tabular-nums text-sm w-14 shrink-0">
                        {value}
                      </span>
                      <span className="text-terminal-white/70 text-xs uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scrolls Unlocked */}
            <div>
              <p className="text-[9px] text-terminal-muted uppercase tracking-widest mb-2">
                ── Scrolls Unlocked
              </p>
              <ul className="space-y-2">
                {loot.scrolls.map((scroll) => (
                  <li key={scroll} className="flex items-start gap-2 text-xs text-terminal-muted leading-relaxed">
                    <span className="text-terminal-green mt-0.5 shrink-0">▶</span>
                    <span>{scroll}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-terminal-muted text-xs tracking-wider">
            No loot data found for this quest.
          </p>
        )}

        <div className="mt-6 border-t border-terminal-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-terminal-white/10 text-terminal-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-terminal-white/20 transition-colors"
          >
            CLOSE CHEST
          </button>
        </div>
      </div>
    </div>
  );
}
