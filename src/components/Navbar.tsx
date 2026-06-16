"use client";

import { useState } from "react";
import ColorPalettePicker from "@/components/ColorPalettePicker";
import { useArcade } from "@/context/ArcadeContext";

interface NavbarProps {
  activeSection: string;
}

const navLinks = [
  { id: "start", label: "START", sub: "home", href: "#hero" },
  { id: "inventory", label: "INVENTORY", sub: "skills", href: "#skills" },
  { id: "questlog", label: "QUEST LOG", sub: "experience", href: "#experience" },
  { id: "projects", label: "PROJECTS", sub: "work", href: "#projects" },
  { id: "savepoint", label: "SAVE POINT", sub: "contact", href: "#contact" },
];

export default function Navbar({ activeSection }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isOpen, open, requestSave } = useArcade();

  const getActiveId = () => {
    if (activeSection === "hero") return "start";
    if (activeSection === "skills") return "inventory";
    if (activeSection === "experience") return "questlog";
    if (activeSection === "projects") return "projects";
    if (activeSection === "contact") return "savepoint";
    return "start";
  };

  const handleSaveGame = async () => {
    if (isOpen) {
      await requestSave();
      return;
    }
    open("navSave");
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  const saveButtonClass =
    "bg-terminal-green text-black text-xs font-bold tracking-wider hover:bg-terminal-green/90 transition-colors";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-terminal-white/20 box-retro">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="#hero" className="text-terminal-green font-bold text-sm tracking-wider">
            _hellorupank
          </a>

          <div className="hidden md:flex items-end gap-6">
            {navLinks.map((link) => {
              const isActive = getActiveId() === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`group flex flex-col items-center leading-none transition-colors duration-200 ${
                    isActive
                      ? "text-terminal-green"
                      : "text-terminal-muted hover:text-terminal-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs tracking-widest">
                    {isActive && (
                      <span className="text-terminal-green">&gt;</span>
                    )}
                    {link.label}
                  </span>
                  {link.sub && (
                    <span className="mt-1 text-[9px] tracking-[0.2em] lowercase text-terminal-muted/40 group-hover:text-terminal-muted/70 transition-colors">
                      {link.sub}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/resume.pdf"
              download="Rupank_Joshi_Resume.pdf"
              title="Download Resume"
              className="text-terminal-green hover:text-terminal-green/70 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
            <ColorPalettePicker />
            {/* <button
              type="button"
              onClick={() => void handleSaveGame()}
              className={`${saveButtonClass} px-4 py-1.5`}
            >
              SAVE GAME
            </button> */}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <a
              href="/resume.pdf"
              download="Rupank_Joshi_Resume.pdf"
              title="Download Resume"
              className="text-terminal-green hover:text-terminal-green/70 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
            <ColorPalettePicker />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-terminal-green"
              aria-label="Toggle menu"
            >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-terminal-white/10 bg-bg-primary/98">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => {
              const isActive = getActiveId() === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-baseline gap-2 text-xs tracking-widest py-1 ${
                    isActive
                      ? "text-terminal-green"
                      : "text-terminal-muted"
                  }`}
                >
                  <span>
                    {isActive && "> "}
                    {link.label}
                  </span>
                  {link.sub && (
                    <span className="text-[10px] tracking-[0.2em] lowercase text-terminal-muted/40">
                      {link.sub}
                    </span>
                  )}
                </a>
              );
            })}
            {/* <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                void handleSaveGame();
              }}
              className={`block w-full ${saveButtonClass} px-4 py-2 text-center mt-3`}
            >
              SAVE GAME
            </button> */}
          </div>
        </div>
      )}
    </nav>
  );
}
