export const ACCENT_STORAGE_KEY = "portfolio-accent-color";
export const DEFAULT_ACCENT = "#00ff00";

export interface AccentPreset {
  id: string;
  name: string;
  hex: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: "terminal", name: "Terminal Green", hex: "#00ff00" },
  { id: "lavender", name: "Lavender", hex: "#c4b5fd" },
  { id: "golden", name: "Golden", hex: "#fbbf24" },
  { id: "orange", name: "Dark Orange", hex: "#ea580c" },
  { id: "pink", name: "Bright Pink", hex: "#ff2d95" },
];

export function normalizeHex(input: string): string | null {
  const trimmed = input.trim().toLowerCase();
  const short = /^#?([0-9a-f]{3})$/i.exec(trimmed);
  if (short) {
    const [, h] = short;
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }
  const long = /^#?([0-9a-f]{6})$/i.exec(trimmed);
  if (long) return `#${long[1]}`;
  return null;
}

export function hexToRgbChannels(hex: string): string | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const value = normalized.slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function applyAccentColor(hex: string): string | null {
  const normalized = normalizeHex(hex);
  const channels = hexToRgbChannels(normalized ?? hex);
  if (!normalized || !channels) return null;

  const root = document.documentElement;
  root.style.setProperty("--accent", normalized);
  root.style.setProperty("--accent-rgb", channels);
  return normalized;
}

export function readStoredAccent(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
    return stored ? normalizeHex(stored) : null;
  } catch {
    return null;
  }
}

export function storeAccent(hex: string): void {
  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, hex);
  } catch {
    /* ignore quota / private mode */
  }
}

export function isValidAccentHex(hex: string): boolean {
  return normalizeHex(hex) !== null;
}

export function shadeHex(hex: string, amount: number): string {
  const normalized = normalizeHex(hex);
  if (!normalized) return hex;
  const value = normalized.slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const mix = (channel: number) =>
    Math.round(channel + (amount < 0 ? channel * amount : (255 - channel) * amount));
  const clamp = (n: number) => Math.max(0, Math.min(255, n));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}
