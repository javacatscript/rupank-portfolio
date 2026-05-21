"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ACCENT_PRESETS,
  applyAccentColor,
  DEFAULT_ACCENT,
  readStoredAccent,
  storeAccent,
} from "@/lib/themeColors";

interface ThemeContextValue {
  accent: string;
  setAccent: (hex: string) => void;
  presets: typeof ACCENT_PRESETS;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState(DEFAULT_ACCENT);

  useEffect(() => {
    const stored = readStoredAccent();
    const initial = stored ?? DEFAULT_ACCENT;
    const applied = applyAccentColor(initial) ?? DEFAULT_ACCENT;
    setAccentState(applied);
  }, []);

  const setAccent = useCallback((hex: string) => {
    const applied = applyAccentColor(hex);
    if (!applied) return;
    setAccentState(applied);
    storeAccent(applied);
  }, []);

  const value = useMemo(
    () => ({ accent, setAccent, presets: ACCENT_PRESETS }),
    [accent, setAccent]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
