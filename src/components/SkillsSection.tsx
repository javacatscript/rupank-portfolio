"use client";

import { useState } from "react";

type SkillCategory = "all" | "languages" | "frontend" | "backend" | "perf_ai" | "tools";

interface Skill {
  name: string;
  level: string;
  category: SkillCategory[];
  icon: string;
  highlight?: boolean;
}

const skills: Skill[] = [
  { name: "JS (ES6+)", level: "LVL. 99", category: ["languages"], icon: "{ }" },
  { name: "React.js", level: "LVL. 97", category: ["frontend"], icon: "⚛" },
  { name: "Next.js", level: "LVL. 95", category: ["frontend"], icon: "NX" },
  { name: "Redux", level: "LVL. 90", category: ["frontend"], icon: "RX" },
  { name: "TypeScript", level: "LVL. 93", category: ["languages"], icon: "TS" },
  { name: "REST APIs", level: "LVL. 90", category: ["backend"], icon: "AP" },
  { name: "GraphQL", level: "LVL. 82", category: ["backend"], icon: "GQ" },
  { name: "Node.js", level: "LVL. 85", category: ["backend"], icon: "ND" },
  { name: "MUI", level: "LVL. 90", category: ["frontend"], icon: "UI" },
  { name: "Tailwind CSS", level: "LVL. 88", category: ["frontend"], icon: "TW" },
  { name: "Python", level: "LVL. 80", category: ["languages"], icon: "PY" },
  { name: "SQL", level: "LVL. 85", category: ["languages"], icon: "DB" },
  { name: "MongoDB", level: "LVL. 78", category: ["backend"], icon: "MG" },
  { name: "Web Vitals", level: "EPIC", category: ["perf_ai"], icon: "⚡" },
  { name: "AI/LLM", level: "NEW", category: ["perf_ai"], icon: "🤖" },
  { name: "Git", level: "LVL. 95", category: ["tools"], icon: "GT" },
  { name: "CI/CD", level: "LVL. 80", category: ["tools"], icon: "▶" },
  { name: "Figma", level: "LVL. 85", category: ["tools"], icon: "FG" },
  { name: "Claude Code", level: "LVL. 95", category: ["tools"], icon: "CL" },
  { name: "Cursor IDE", level: "LVL. 99", category: ["tools"], icon: "CI" },
];

const categories: { id: SkillCategory; label: string; count: string }[] = [
  { id: "all", label: "ALL_ITEMS", count: "[19]" },
  { id: "languages", label: "LANGUAGES", count: "[04]" },
  { id: "frontend", label: "FRONTEND", count: "[05]" },
  { id: "backend", label: "BACKEND_APIS", count: "[04]" },
  { id: "perf_ai", label: "PERF_AI", count: "[02]" },
  { id: "tools", label: "TOOLS", count: "[04]" },
];

const equippedGear = [
  { name: "CURSOR_IDE", type: "PRIMARY_TOOL" },
  { name: "REST/GRAPHQL_LINK", type: "DATA_TRANSFER" },
  { name: "CI/CD_PIPELINE", type: "DEPLOY_SHIELD" },
];

const coreAttributes = [
  { name: "Web_Vitals_Optimization", value: 95 },
  { name: "AI_Integration", value: 88 },
];

const systemLog = [
  "> Loading _hellorupank.profile...",
  "> [OK] React 18 & Next.js App Router",
  "> [OK] Core Web Vitals optimized",
  "> [OK] OpenAI API connection active",
  "> _",
];

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("all");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((s) => s.category.includes(activeCategory));

  return (
    <section id="skills" className="bg-bg-primary py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-terminal-white/20 pb-6 mb-8 md:mb-12">
          <h2 className="text-terminal-green text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider uppercase">
            Technical_Manifest
          </h2>
          <p className="text-terminal-muted text-xs sm:text-sm mt-2 tracking-wider">
            User_ID: _hellorupank // Level: 3+ Software_Engineer
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-56 shrink-0 space-y-6">
            <div className="bg-bg-card p-4 box-retro">
              <h3 className="text-terminal-green text-xs font-bold uppercase tracking-wider pb-3 mb-3 border-b border-terminal-white/20">
                Filter_Types
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-xs tracking-wider transition-all duration-150 ${
                      activeCategory === cat.id
                        ? "text-terminal-green bg-terminal-green/10"
                        : "text-terminal-muted hover:text-terminal-white opacity-60 hover:opacity-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          activeCategory === cat.id
                            ? "bg-terminal-green"
                            : "bg-terminal-muted"
                        }`}
                      />
                      {cat.label}
                    </span>
                    <span className="text-terminal-muted">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-bg-card-alt border border-terminal-white/10 p-4">
              <h3 className="text-terminal-muted text-xs uppercase tracking-wider mb-3">
                Core_Attributes
              </h3>
              {coreAttributes.map((attr) => (
                <div key={attr.name} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-terminal-muted">{attr.name}</span>
                    <span className="text-terminal-muted">{attr.value}%</span>
                  </div>
                  <div className="h-1.5 bg-terminal-white/10 w-full">
                    <div
                      className="h-full bg-terminal-green/40 transition-all duration-1000"
                      style={{ width: `${attr.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredSkills.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() =>
                    setSelectedSkill(
                      selectedSkill?.name === skill.name ? null : skill
                    )
                  }
                  className={`group relative bg-bg-card border p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-200 hover:border-terminal-green/60 ${
                    selectedSkill?.name === skill.name
                      ? "border-terminal-green bg-terminal-green/5"
                      : skill.highlight
                        ? "border-terminal-green/30"
                        : "border-terminal-white/10"
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-2 h-8 flex items-center justify-center text-terminal-green/70 group-hover:text-terminal-green transition-colors">
                    {skill.icon}
                  </div>
                  <span className="text-xs text-terminal-muted tracking-wider mb-1 truncate w-full">
                    {skill.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold tracking-widest ${
                      skill.highlight
                        ? "text-terminal-green text-glow-sm"
                        : "text-terminal-green"
                    }`}
                  >
                    {skill.level}
                  </span>
                </button>
              ))}
              {[...Array(Math.max(0, 2))].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="border border-dashed border-terminal-white/10 p-4 flex items-center justify-center"
                >
                  <span className="text-2xl text-terminal-white/10">+</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-64 shrink-0 space-y-6">
            <div className="bg-bg-card-alt border-l-2 border-terminal-white/20 p-4 box-retro">
              <h3 className="text-terminal-green text-xs font-bold uppercase tracking-wider mb-4">
                Equipped_Gear
              </h3>
              <div className="space-y-3">
                {equippedGear.map((gear, i) => (
                  <div
                    key={gear.name}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`w-8 h-8 shrink-0 flex items-center justify-center text-xs ${
                        i === 0
                          ? "bg-terminal-green text-black"
                          : "border border-terminal-white/20 text-terminal-muted"
                      }`}
                    >
                      {i === 0 ? "⚙" : i === 1 ? "⇄" : "▶"}
                    </div>
                    <div>
                      <div className="text-xs text-terminal-muted tracking-wider">
                        {gear.name}
                      </div>
                      <div className="text-[10px] text-terminal-muted/60 tracking-wider">
                        {gear.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-card p-4 box-retro">
              <h3 className="text-terminal-muted text-xs uppercase tracking-wider mb-3">
                System_Log:
              </h3>
              <div className="space-y-1">
                {systemLog.map((line, i) => (
                  <p
                    key={i}
                    className={`text-[11px] leading-relaxed ${
                      line === "> _"
                        ? "text-terminal-green animate-blink"
                        : "text-terminal-green/50"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <button className="w-full bg-bg-card border border-terminal-white/10 py-2.5 text-terminal-green text-xs font-bold uppercase tracking-widest hover:bg-terminal-green/10 hover:border-terminal-green/30 transition-all duration-200">
              SYNC_PORTFOLIO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
