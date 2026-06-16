"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ArcadeBay from "@/components/arcade/ArcadeBay";
import EditTrigger from "@/components/admin/EditTrigger";
import HeroEditModal from "@/components/admin/HeroEditModal";
import { useArcade } from "@/context/ArcadeContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocation } from "@/context/LocationContext";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  Sphere,
} from "react-simple-maps";

export default function HeroSection() {
  const { content, updateContent } = useSiteContent();
  const { isOpen, open } = useArcade();
  const [bootText, setBootText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [heroEditOpen, setHeroEditOpen] = useState(false);
  const [showArcadeShell, setShowArcadeShell] = useState(false);
  const [playClicks, setPlayClicks] = useState(0);
  const [questClicks, setQuestClicks] = useState(0);
  const arcadeWrapperRef = useRef<HTMLDivElement | null>(null);
  const diagnostics = useMemo(
    () => ({
      playClicks,
      questClicks,
      totalClicks: playClicks + questClicks,
    }),
    [playClicks, questClicks],
  );

  const fullBootText = "SYSTEM BOOT SEQUENCING";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullBootText.length) {
        setBootText(fullBootText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowContent(true), 300);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Keep the arcade shell mounted briefly when closing so animations can play
  useEffect(() => {
    if (isOpen) {
      setShowArcadeShell(true);
      return;
    }

    const timeout = window.setTimeout(() => setShowArcadeShell(false), 260);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  // When opening the arcade, scroll enough so the full card + controls are visible.
  useEffect(() => {
    if (!isOpen) return;

    const timeout = window.setTimeout(() => {
      const el = arcadeWrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const topPadding = 88; // fixed navbar + breathing room
      const bottomPadding = 20;

      let delta = 0;
      if (rect.top < topPadding) {
        delta = rect.top - topPadding;
      }
      if (rect.bottom > viewportHeight - bottomPadding) {
        delta = Math.max(delta, rect.bottom - viewportHeight + bottomPadding);
      }

      if (Math.abs(delta) > 2) {
        window.scrollBy({ top: delta, behavior: "smooth" });
      }
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);


  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center bg-bg-primary overflow-hidden"
    >
      <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30" />

      <div className="relative z-10 w-full max-w-[1152px] mx-auto px-4 sm:px-6 pt-32 pb-20 md:pt-52 md:pb-36">
        <div className="flex flex-col items-center gap-8 pb-12">
          <div className="inline-flex items-center gap-1 border-2 border-terminal-white px-4 py-1">
            <span className="text-xs sm:text-sm font-bold tracking-[0.1em] uppercase">
              {bootText}
            </span>
            <span className="animate-blink text-terminal-green text-sm">▋</span>
          </div>

          <div
            className={`flex flex-col items-center transition-all duration-700 ${
              showContent
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="group/edit relative flex items-center justify-center gap-2 max-w-full">
              <h1 className="text-terminal-green text-center font-black text-5xl sm:text-5xl md:text-6xl lg:text-[118px] leading-none tracking-[0.025em] text-glow">
                {content.hero.name}
              </h1>
              <EditTrigger
                label="hero name"
                onEdit={() => setHeroEditOpen(true)}
                className="absolute -right-9 top-1/2 -translate-y-1/2 md:static md:translate-y-0"
              />
            </div>

            <div className="group/edit relative mt-8 max-w-[690px] opacity-90 flex items-start justify-center gap-2">
              <p className="text-terminal-green text-sm sm:text-base md:text-xl font-bold tracking-wider text-center leading-relaxed flex-1">
                {content.hero.tagline}
              </p>
              <EditTrigger
                label="hero tagline"
                onEdit={() => setHeroEditOpen(true)}
                className="mt-1 shrink-0"
              />
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col items-center justify-center pb-16 transition-all duration-700 delay-300 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {showArcadeShell ? (
            <div
              ref={arcadeWrapperRef}
              className={`w-full flex justify-center transition-all duration-300 ease-out origin-top ${
                isOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              <ArcadeBay />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <button
                type="button"
                onClick={() => {
                  setPlayClicks((value) => value + 1);
                  open("start");
                }}
                className="group border-4 border-transparent hover:border-terminal-green px-8 sm:px-12 py-4 sm:py-5 box-retro transition-all duration-200 hover:shadow-accent-md"
              >
                <span className="text-base sm:text-xl font-black tracking-[0.1em] uppercase group-hover:text-terminal-green transition-colors">
                  PLAY GAME
                </span>
              </button>
              <a
                href="#experience"
                onClick={() => setQuestClicks((value) => value + 1)}
                className="border-4 border-terminal-white px-8 sm:px-12 py-4 sm:py-5 box-retro hover:bg-terminal-white hover:text-black transition-all duration-200"
              >
                <span className="text-base sm:text-xl font-black tracking-[0.1em] uppercase">
                  VIEW QUEST LOG
                </span>
              </a>
            </div>
          )}
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 transition-all duration-700 delay-500 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <DiagnosticPanel isArcadeOpen={isOpen} diagnostics={diagnostics} />
          <WorldMapPanel />
          <PlayerStatsPanel />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none z-10" />

      <HeroEditModal
        key={`hero-edit-${heroEditOpen}-${content.hero.name}`}
        isOpen={heroEditOpen}
        initial={content.hero}
        onClose={() => setHeroEditOpen(false)}
        onSave={async (data) => {
          await updateContent("hero", data);
        }}
      />
    </section>
  );
}

function DiagnosticPanel({
  isArcadeOpen,
  diagnostics,
}: {
  isArcadeOpen: boolean;
  diagnostics: { playClicks: number; questClicks: number; totalClicks: number };
}) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [visibility, setVisibility] = useState<"visible" | "hidden">("visible");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [networkType, setNetworkType] = useState("unknown");
  const [eventLog, setEventLog] = useState<string[]>(["System online"]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSessionSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const onMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    media.addEventListener("change", onMotionChange);
    return () => media.removeEventListener("change", onMotionChange);
  }, []);

  useEffect(() => {
    const connection = (
      navigator as Navigator & {
        connection?: { effectiveType?: string };
      }
    ).connection;
    setNetworkType(connection?.effectiveType ?? "unknown");
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      const state = document.visibilityState === "visible" ? "visible" : "hidden";
      setVisibility(state);
    };
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    setEventLog((entries) => [
      `Arcade ${isArcadeOpen ? "opened" : "closed"}`,
      ...entries,
    ].slice(0, 6));
  }, [isArcadeOpen]);

  useEffect(() => {
    if (diagnostics.totalClicks === 0) {
      return;
    }
    setEventLog((entries) => [
      `CTA clicks updated (${diagnostics.totalClicks})`,
      ...entries,
    ].slice(0, 6));
  }, [diagnostics.totalClicks]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remSeconds).padStart(2, "0")}`;
  };

  const jumpTo = (targetId: string) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setEventLog((entries) => [`Jumped to ${targetId}`, ...entries].slice(0, 6));
  };

  return (
    <div className="border-b-4 border-terminal-white p-6 box-retro bg-bg-primary/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green">
          System Console
        </h3>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="text-terminal-green"
        >
          <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="6" cy="6" r="2" fill="currentColor" />
        </svg>
      </div>

      <div className="space-y-2">
        <StatusRow label="Session" value={formatDuration(sessionSeconds)} />
        <StatusRow label="Arcade" value={isArcadeOpen ? "OPEN" : "IDLE"} />
        <StatusRow label="CTA Interactions" value={String(diagnostics.totalClicks)} />
        <StatusRow label="Visibility" value={visibility.toUpperCase()} />
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((value) => !value)}
        className="mt-4 w-full border border-terminal-white/30 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-terminal-green hover:border-terminal-green/70 transition-colors"
      >
        {showAdvanced ? "Hide Advanced" : "Show Advanced"}
      </button>

      {showAdvanced ? (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <StatusRow
              label="Reduced Motion"
              value={reducedMotion ? "ENABLED" : "DISABLED"}
            />
            <StatusRow label="Connection" value={networkType.toUpperCase()} />
            <StatusRow
              label="Play / Quest"
              value={`${diagnostics.playClicks} / ${diagnostics.questClicks}`}
            />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-terminal-green">
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => jumpTo("projects")}
                className="border border-terminal-white/30 px-2 py-1.5 text-[10px] font-mono uppercase hover:border-terminal-green/70 transition-colors"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => jumpTo("experience")}
                className="border border-terminal-white/30 px-2 py-1.5 text-[10px] font-mono uppercase hover:border-terminal-green/70 transition-colors"
              >
                Quest
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-terminal-green">
              Event Log
            </p>
            <div className="space-y-1.5">
              {eventLog.map((entry, index) => (
                <p
                  key={`${entry}-${index}`}
                  className="text-[10px] font-mono uppercase text-terminal-white/80"
                >
                  [{index + 1}] {entry}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-xs font-mono uppercase text-terminal-white/80">
        {label}
      </span>
      <span className="text-xs font-mono uppercase text-terminal-green text-right">
        {value}
      </span>
    </div>
  );
}

function WorldMapPanel() {
  const { locationState, coords, requestLocation: locateUser } = useLocation();
  const [mapScale, setMapScale] = useState(153);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (locationState !== "ready" || !coords) return;

    const startScale = 153;
    const startCenter: [number, number] = [0, 0];
    const targetScale = 620;
    const targetCenter: [number, number] = [coords.lng, coords.lat];
    const duration = 1200;
    const startTime = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setMapScale(startScale + (targetScale - startScale) * eased);
      setMapCenter([
        startCenter[0] + (targetCenter[0] - startCenter[0]) * eased,
        startCenter[1] + (targetCenter[1] - startCenter[1]) * eased,
      ]);
      if (t < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [locationState, coords]);

  const statusLabel =
    locationState === "denied"
      ? "Location access denied"
      : locationState === "unavailable"
        ? "Geolocation unavailable"
        : null;

  return (
    <div className="border-b-4 border-terminal-white p-6 box-retro bg-bg-primary/50 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green">
          World Map
        </h3>
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-terminal-green">
          <rect x="1" y="1" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative">
        <div className="relative aspect-video bg-terminal-green/5 overflow-hidden border border-terminal-green/20">
          <ComposableMap
            projection="geoEquirectangular"
            projectionConfig={{ scale: mapScale, center: mapCenter }}
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            {/* Ocean sphere */}
            <Sphere id="rsm-sphere" fill="transparent" stroke="var(--accent)" strokeWidth={0.3} strokeOpacity={0.15} />

            {/* Lat/lng grid */}
            <Graticule stroke="var(--accent)" strokeWidth={0.3} strokeOpacity={0.12} />

            {/* Country shapes */}
            <Geographies geography="/countries-110m.json">
              {({ geographies }: { geographies: unknown[] }) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgb(var(--accent-rgb) / 0.13)"
                    stroke="rgb(var(--accent-rgb) / 0.4)"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none" },
                      hover:   { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Location marker */}
            {coords && locationState === "ready" && (
              <Marker coordinates={[coords.lng, coords.lat]}>
                {/* Ripple ring */}
                <circle r="4" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.5">
                  <animate attributeName="r" from="2" to="12" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
                </circle>
                {/* Outer ring */}
                <circle r="3" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.8" />
                {/* Center dot */}
                <circle r="1.5" fill="var(--accent)" />
                {/* Crosshair */}
                <line x1="-8" y1="0" x2="-4" y2="0" stroke="var(--accent)" strokeWidth="0.6" opacity="0.6" />
                <line x1="4"  y1="0" x2="8"  y2="0" stroke="var(--accent)" strokeWidth="0.6" opacity="0.6" />
                <line x1="0" y1="-8" x2="0" y2="-4" stroke="var(--accent)" strokeWidth="0.6" opacity="0.6" />
                <line x1="0" y1="4"  x2="0" y2="8"  stroke="var(--accent)" strokeWidth="0.6" opacity="0.6" />
              </Marker>
            )}
          </ComposableMap>

          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)" }}
          />

          {/* Locating overlay */}
          {locationState === "locating" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-bg-primary/80 px-3 py-1.5 border border-terminal-green/30">
                <div className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-terminal-green">
                  Acquiring signal...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Coords readout */}
        {locationState === "ready" && coords && (
          <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-terminal-green/80 tabular-nums">
            LAT {coords.lat.toFixed(4)} | LNG {coords.lng.toFixed(4)}
          </p>
        )}

        <div className="mt-3 space-y-2">
          {locationState !== "ready" && (
            <button
              type="button"
              onClick={locateUser}
              disabled={locationState === "locating"}
              className="w-full border border-terminal-white/30 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-terminal-green transition-colors hover:border-terminal-green/70 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {locationState === "locating" ? "Locating..." : "Locate Me"}
            </button>
          )}
          {statusLabel && (
            <p className="text-[10px] font-mono uppercase tracking-wider text-terminal-white/75">
              {statusLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// First professional role (Teaching Assistant @ Coding Ninjas, Dec 2022) — the
// Player Stats level is years-of-experience, so it ticks up on its own over time.
const CAREER_START = new Date("2022-12-01").getTime();
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

const ABILITIES = [
  { label: "PERFORMANCE", value: 95 },
  { label: "AI / LLM OPS", value: 90 },
  { label: "ARCHITECTURE", value: 88 },
  // { label: "DX TOOLING",   value: 75 },
] as const;

const ACHIEVEMENTS = [
  "LCP ↓ 40%",
  "SALES ↑ 25%",
  "EMP_OF_MONTH",
  "4.9★ RATING",
  "300+ PROBLEMS SOLVED",
] as const;

function PlayerStatsPanel() {
  const [stats, setStats] = useState<{ level: number; pct: number; years: number }>(
    { level: 3, pct: 0, years: 3 }
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const years = (Date.now() - CAREER_START) / MS_PER_YEAR;
    const level = Math.floor(years);
    const target = Math.round((years - level) * 100);
    const timer = setTimeout(() => {
      setStats({ level, pct: target, years });
      setMounted(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="border-b-4 border-terminal-white p-6 box-retro bg-bg-primary/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green">
          Player Stats
        </h3>
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-terminal-green">
          <polygon points="6,1 11,11 1,11" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Level + XP bar */}
      <div className="flex items-center gap-4 mb-1">
        <div className="text-4xl sm:text-5xl font-black text-terminal-green leading-none">
          L{stats.level}
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="text-xs uppercase tracking-wider">Experience</span>
            <span className="text-xs uppercase tracking-wider tabular-nums">
              {stats.years.toFixed(1)} YRS SHIPPED
            </span>
          </div>
          <div className="h-2 bg-terminal-white/10 w-full">
            <div
              className="h-full bg-terminal-green transition-all duration-1000 ease-out"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-terminal-muted">
        Lvl {stats.level + 1} loading — {stats.pct}% to next year
      </p>

      <div className="border-t border-terminal-white/10 my-4" />

      {/* Class + current quest */}
      {/* <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[9px] text-terminal-muted uppercase tracking-widest mb-0.5">Class</p>
          <p className="text-[11px] font-bold text-terminal-green uppercase tracking-wider">
            Frontend_Engineer
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-terminal-muted uppercase tracking-widest mb-0.5">Current Quest</p>
          <p className="text-[11px] text-terminal-white/80 uppercase tracking-wider">
            The Squa.re · Kraya AI
          </p>
        </div>
      </div> */}

      {/* Ability bars */}
      <div className="space-y-2 mb-4">
        {ABILITIES.map(({ label, value }, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-wider text-terminal-muted shrink-0 w-[82px]">
              {label}
            </span>
            <div className="flex-1 h-1.5 bg-terminal-white/10">
              <div
                className="h-full bg-terminal-green/80 transition-all duration-700 ease-out"
                style={{ width: mounted ? `${value}%` : "0%", transitionDelay: `${i * 100}ms` }}
              />
            </div>
            <span className="text-[9px] tabular-nums text-terminal-green/80 w-5 text-right shrink-0">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-terminal-white/10 mb-3" />

      {/* Achievement badges */}
      <p className="text-[9px] text-terminal-muted uppercase tracking-widest mb-2">Unlocked</p>
      <div className="flex flex-wrap gap-1.5">
        {ACHIEVEMENTS.map((badge) => (
          <span
            key={badge}
            className="text-[9px] border border-terminal-green/30 px-1.5 py-0.5 text-terminal-green/80 uppercase tracking-wider"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}
