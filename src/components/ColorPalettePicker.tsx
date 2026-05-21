"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { isValidAccentHex, shadeHex } from "@/lib/themeColors";

function PaletteIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <rect x="2" y="2" width="5" height="5" fill="currentColor" opacity="0.9" />
      <rect x="9" y="2" width="5" height="5" fill="currentColor" opacity="0.55" />
      <rect x="2" y="9" width="5" height="5" fill="currentColor" opacity="0.55" />
      <rect x="9" y="9" width="5" height="5" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function ColorCube({
  color,
  name,
  selected,
  onSelect,
}: {
  color: string;
  name: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const shadow = shadeHex(color, -0.35);
  const highlight = shadeHex(color, 0.25);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Use ${name} accent`}
      aria-pressed={selected}
      title={name}
      className={`group relative h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-white/80 ${
        selected ? "scale-105" : ""
      }`}
    >
      <span
        className="absolute left-0 top-1 h-7 w-7 border border-black/30"
        style={{
          background: shadow,
          transform: "skewY(-8deg)",
        }}
      />
      <span
        className="absolute left-1 top-0 h-7 w-7 border border-black/20"
        style={{
          background: highlight,
          transform: "skewX(-12deg)",
        }}
      />
      <span
        className="absolute left-1.5 top-1.5 h-7 w-7 border border-black/40"
        style={{
          background: color,
          boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.35)",
        }}
      />
      {selected && (
        <span className="absolute -bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 bg-terminal-green" />
      )}
    </button>
  );
}

export default function ColorPalettePicker({
  className = "",
}: {
  className?: string;
}) {
  const { accent, setAccent, presets } = useTheme();
  const [open, setOpen] = useState(false);
  const [customHex, setCustomHex] = useState(accent);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomHex(accent);
  }, [accent]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const commitCustom = (value: string) => {
    setCustomHex(value);
    if (isValidAccentHex(value)) setAccent(value);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open color palette"
        className="flex h-8 w-8 items-center justify-center border border-terminal-white/25 text-terminal-green transition-colors hover:border-terminal-green hover:bg-terminal-green/10"
      >
        <PaletteIcon />
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Accent color palette"
          className="absolute right-0 top-full z-[60] mt-2 w-[min(100vw-2rem,280px)] border border-terminal-white/20 bg-bg-card p-4 box-retro border-glow animate-fadeInUp"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-terminal-muted mb-3">
            Signal_Palette
          </p>

          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            {presets.map((preset) => (
              <ColorCube
                key={preset.id}
                color={preset.hex}
                name={preset.name}
                selected={accent.toLowerCase() === preset.hex.toLowerCase()}
                onSelect={() => {
                  setAccent(preset.hex);
                  setCustomHex(preset.hex);
                }}
              />
            ))}
          </div>

          <div className="border-t border-terminal-white/10 pt-3">
            <p className="text-[10px] uppercase tracking-widest text-terminal-muted mb-2">
              Custom_Frequency
            </p>
            <div className="flex items-center gap-3">
              <label className="relative h-9 w-9 shrink-0 cursor-pointer border border-terminal-white/20 overflow-hidden hover:border-terminal-green/60 transition-colors">
                <span className="sr-only">Pick custom accent color</span>
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => commitCustom(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <span
                  className="block h-full w-full"
                  style={{ background: accent }}
                  aria-hidden
                />
              </label>
              <input
                type="text"
                value={customHex}
                onChange={(e) => commitCustom(e.target.value)}
                onBlur={() => {
                  if (!isValidAccentHex(customHex)) setCustomHex(accent);
                }}
                spellCheck={false}
                className="flex-1 bg-bg-card-alt border border-terminal-white/20 px-2 py-1.5 text-xs uppercase tracking-wider text-terminal-white focus:outline-none focus:border-terminal-green/60"
                placeholder="#00ff00"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
