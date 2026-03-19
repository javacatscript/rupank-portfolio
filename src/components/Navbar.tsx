"use client";

import { useState } from "react";

interface NavbarProps {
  activeSection: string;
}

const navLinks = [
  { id: "start", label: "START", href: "#hero" },
  { id: "inventory", label: "INVENTORY", href: "#skills" },
  { id: "questlog", label: "QUEST LOG", href: "#experience" },
];

export default function Navbar({ activeSection }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const getActiveId = () => {
    if (activeSection === "hero") return "start";
    if (activeSection === "skills") return "inventory";
    if (activeSection === "experience") return "questlog";
    return "start";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-terminal-white/20 box-retro">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="#hero" className="text-terminal-green font-bold text-sm tracking-wider">
            _hellorupank
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = getActiveId() === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-xs tracking-widest transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-terminal-green"
                      : "text-terminal-muted hover:text-terminal-white"
                  }`}
                >
                  {isActive && (
                    <span className="text-terminal-green">&gt;</span>
                  )}
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              className="bg-terminal-green text-black text-xs font-bold px-4 py-1.5 tracking-wider hover:bg-terminal-green/90 transition-colors"
            >
              SAVE GAME
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-terminal-green"
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
                  className={`block text-xs tracking-widest py-1 ${
                    isActive
                      ? "text-terminal-green"
                      : "text-terminal-muted"
                  }`}
                >
                  {isActive && "> "}
                  {link.label}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block bg-terminal-green text-black text-xs font-bold px-4 py-2 tracking-wider text-center mt-3"
            >
              SAVE GAME
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
