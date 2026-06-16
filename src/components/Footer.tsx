"use client";

import { useLocation } from "@/context/LocationContext";

function formatCoord(value: number, isLat: boolean): string {
  const abs = Math.abs(value);
  const dir = isLat ? (value >= 0 ? "N" : "S") : (value >= 0 ? "E" : "W");
  return `${abs.toFixed(4)}° ${dir}`;
}

export default function Footer() {
  const { locationState, coords } = useLocation();

  const locationText =
    locationState === "ready" && coords != null
      ? `LOC: ${formatCoord(coords.lat, true)}, ${formatCoord(coords.lng, false)}`
      : locationState === "denied"
        ? "LOC: permission denied"
        : locationState === "unavailable"
          ? "LOC: unavailable"
          : locationState === "locating"
            ? "LOC: acquiring..."
            : "LOC: --";

  return (
    <footer className="bg-bg-card border-t border-terminal-white/10 py-6">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
            <span className="text-terminal-green text-xs font-bold tracking-wider">
              PORTFOLIO &copy; {new Date().getFullYear()}
            </span>
            <span className="text-terminal-muted/70 text-[10px] tracking-widest uppercase hidden sm:inline flex items-center gap-1">
              Designed with Google Stitch
              <span className="text-md px-1" aria-hidden="true">♥</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#hero"
              className="text-terminal-green text-xs tracking-widest hover:text-glow transition-all"
            >
              TERMINAL
            </a>
            <a
              href="#skills"
              className="text-terminal-muted text-xs tracking-widest hover:text-terminal-green transition-colors"
            >
              SYSTEM_LOG
            </a>
            <a
              href="#contact"
              className="text-terminal-muted text-xs tracking-widest hover:text-terminal-green transition-colors"
            >
              ROOT
            </a>
          </div>

          <span className="text-terminal-muted text-xs tracking-wider hidden sm:block tabular-nums">
            {locationText}
          </span>
        </div>
      </div>
    </footer>
  );
}
