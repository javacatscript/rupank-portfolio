"use client";

import { useEffect, useState } from "react";
import EditTrigger from "@/components/admin/EditTrigger";
import HeroEditModal from "@/components/admin/HeroEditModal";
import { useSiteContent } from "@/context/SiteContentContext";

export default function HeroSection() {
  const { content, updateContent } = useSiteContent();
  const [bootText, setBootText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [heroEditOpen, setHeroEditOpen] = useState(false);
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

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center bg-bg-primary overflow-hidden"
    >
      <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30" />

      <div className="relative z-10 w-full max-w-[1152px] mx-auto px-4 sm:px-6 pt-32 pb-20 md:pt-52 md:pb-36">
        <div className="flex flex-col items-center gap-6 pb-12">
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
              <h1 className="text-terminal-green text-center font-black text-5xl sm:text-7xl md:text-8xl lg:text-[128px] leading-none tracking-[0.025em] text-glow">
                {content.hero.name}
              </h1>
              <EditTrigger
                label="hero name"
                onEdit={() => setHeroEditOpen(true)}
                className="absolute -right-9 top-1/2 -translate-y-1/2 md:static md:translate-y-0"
              />
            </div>

            <div className="group/edit relative mt-4 max-w-[672px] opacity-90 flex items-start justify-center gap-2">
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
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pb-16 transition-all duration-700 delay-300 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href="#experience"
            className="group border-4 border-transparent hover:border-terminal-green px-8 sm:px-12 py-4 sm:py-5 box-retro transition-all duration-200 hover:shadow-accent-md"
          >
            <span className="text-base sm:text-xl font-black tracking-[0.1em] uppercase group-hover:text-terminal-green transition-colors">
              START GAME
            </span>
          </a>
          <a
            href="#contact"
            className="border-4 border-terminal-white px-8 sm:px-12 py-4 sm:py-5 box-retro hover:bg-terminal-white hover:text-black transition-all duration-200"
          >
            <span className="text-base sm:text-xl font-black tracking-[0.1em] uppercase">
              INSERT COIN
            </span>
          </a>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 transition-all duration-700 delay-500 ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <DiagnosticPanel />
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

function DiagnosticPanel() {
  return (
    <div className="border-b-4 border-terminal-white p-6 box-retro bg-bg-primary/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green">
          Hardware Diagnostic
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
        <StatusRow label="CPU STATUS:" value="OPTIMAL" />
        <StatusRow label="MEMORY:" value="640KB LOADED" />
        <StatusRow label="V-SYNC:" value="ENABLED" />
      </div>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs font-mono uppercase">{label}</span>
      <span className="text-xs font-mono uppercase text-terminal-green">{value}</span>
    </div>
  );
}

function WorldMapPanel() {
  return (
    <div className="border-b-4 border-terminal-white p-6 box-retro bg-bg-primary/50 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green">
          World Map
        </h3>
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-terminal-green">
          <rect
            x="1"
            y="1"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="relative">
        <div className="aspect-video bg-terminal-green/5 rounded-sm flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-4 h-full w-full gap-px">
              {[0.3, 0.15, 0.5, 0.22, 0.45, 0.12, 0.55, 0.38, 0.28, 0.48, 0.18, 0.42, 0.35, 0.52, 0.25, 0.4, 0.32, 0.58, 0.2, 0.47, 0.14, 0.53, 0.36, 0.44, 0.27, 0.5, 0.19, 0.41, 0.33, 0.56, 0.23, 0.46].map(
                (opacity, i) => (
                  <div
                    key={i}
                    className="bg-terminal-green/20"
                    style={{ opacity }}
                  />
                )
              )}
            </div>
          </div>
          <div className="absolute w-2 h-2 bg-terminal-green rounded-full animate-pulse top-1/3 left-2/3" />
          <div className="relative flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              LOCATING_SERVER...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerStatsPanel() {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setXp(750), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="border-b-4 border-terminal-white p-6 box-retro bg-bg-primary/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green">
          Player Stats
        </h3>
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-terminal-green">
          <polygon
            points="6,1 11,11 1,11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl sm:text-5xl font-black text-terminal-green">L1</div>
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="text-xs uppercase tracking-wider">Experience</span>
            <span className="text-xs uppercase tracking-wider">{xp} / 1000 XP</span>
          </div>
          <div className="h-2 bg-terminal-white/10 w-full">
            <div
              className="h-full bg-terminal-green transition-all duration-1000 ease-out"
              style={{ width: `${(xp / 1000) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
