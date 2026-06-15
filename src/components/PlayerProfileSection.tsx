"use client";

// Character-sheet style intro. Content is sourced from the résumé summary +
// experience so the "player profile" stays factual under the RPG framing.

const CHARACTER_STATS = [
  { label: "CLASS", value: "Frontend Engineer" },
  { label: "LEVEL", value: "3+ yrs in production" },
  { label: "BASE", value: "New Delhi, IN" },
  { label: "GUILD", value: "The Squa.re · Kraya AI" },
  { label: "ORIGIN", value: "Earth" },
  { label: "STATUS", value: "Ready to engage" },
];

const SPEC_TAGS = [
  "Core Web Vitals",
  "SSR / SSG",
  "AI Integration",
  "React · Next.js · TS",
];

export default function PlayerProfileSection() {
  return (
    <section id="profile" className="bg-bg-primary py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-terminal-green text-xs font-bold uppercase tracking-widest border border-terminal-green/40 px-3 py-1">
            Player Profile
          </span>
          <span className="h-px flex-1 bg-terminal-white/10" />
          <span className="text-[10px] uppercase tracking-widest text-terminal-muted/60">
            character_sheet.dat
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Bio / dossier */}
          <div className="lg:w-7/12 space-y-6">
            <p className="text-terminal-green text-sm tracking-wider">
              <span className="text-terminal-muted">&gt; whoami</span>
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-terminal-white/90">
              Software Engineer with{" "}
              <span className="text-terminal-green">3+ years</span> building
              high-performance, scalable web apps in{" "}
              <span className="text-terminal-green">
                React, Next.js, and TypeScript
              </span>
              . I specialize in Core Web Vitals optimization, SSR/SSG
              architectures, and AI-integrated experiences — turning heavy
              product requirements into fast, resilient interfaces.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-terminal-muted">
              Recent missions: cut Core Web Vitals by{" "}
              <span className="text-terminal-green">40%</span> via a full
              Next.js 11→13 / React 17→18 migration, lifted demo-to-paid
              conversion by{" "}
              <span className="text-terminal-green">25%</span>, and automated{" "}
              <span className="text-terminal-green">8–10 dev hours/week</span>{" "}
              with LLM tooling — earning Employee of the Month for zero-downtime
              releases.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {SPEC_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] uppercase tracking-wider border border-terminal-white/15 text-terminal-muted px-2.5 py-1 hover:border-terminal-green/40 hover:text-terminal-green transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Character stat block */}
          <div className="lg:w-5/12">
            <div className="border-l-2 border-terminal-white/20 bg-bg-primary/50 p-5 sm:p-6 box-retro border-glow">
              <h3 className="text-xs font-bold uppercase tracking-wider text-terminal-green mb-4">
                Attributes
              </h3>
              <dl className="space-y-3">
                {CHARACTER_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-baseline justify-between gap-4 border-b border-dashed border-terminal-white/10 pb-2"
                  >
                    <dt className="text-[11px] uppercase tracking-widest text-terminal-muted shrink-0">
                      {stat.label}
                    </dt>
                    <dd className="text-xs sm:text-sm text-right text-terminal-white/90">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
