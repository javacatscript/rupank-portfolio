export default function Footer() {
  return (
    <footer className="bg-bg-card border-t border-terminal-white/10 py-6">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-terminal-green text-xs font-bold tracking-wider">
            PORTFOLIO &copy; {new Date().getFullYear()}
          </span>

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

          <span className="text-terminal-muted text-xs tracking-wider hidden sm:block">
            LOC: 34.0522&deg; N, 118.2437&deg; W
          </span>
        </div>
      </div>
    </footer>
  );
}
