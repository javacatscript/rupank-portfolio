"use client";

import { usePortfolioAdmin } from "@/context/PortfolioAdminContext";

interface AdminSectionToolbarProps {
  addLabel: string;
  onAdd: () => void;
  meta?: string;
}

export default function AdminSectionToolbar({
  addLabel,
  onAdd,
  meta,
}: AdminSectionToolbarProps) {
  const { isAdmin, requireAdmin, openAuthLogin, lockSession } = usePortfolioAdmin();

  return (
    <div className="flex flex-col gap-3 sm:items-end">
      <div className="flex flex-wrap items-center gap-2">
        {isAdmin ? (
          <>
            <span className="text-[10px] tracking-widest uppercase text-terminal-green border border-terminal-green/30 px-2 py-1">
              ADMIN_MODE_ACTIVE
            </span>
            <button
              type="button"
              onClick={() => requireAdmin(onAdd)}
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-terminal-green text-black hover:bg-terminal-green/90 transition-colors"
            >
              {addLabel}
            </button>
            <button
              type="button"
              onClick={lockSession}
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-terminal-white/10 text-terminal-muted hover:text-terminal-white hover:bg-terminal-white/20 transition-colors"
            >
              LOCK SESSION
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => openAuthLogin()}
            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-terminal-white/20 text-terminal-muted hover:text-terminal-green hover:border-terminal-green/40 transition-colors"
          >
            ADMIN LOGIN
          </button>
        )}
      </div>
      {meta && (
        <p className="text-terminal-muted text-xs sm:text-sm tracking-wider">
          {meta}
        </p>
      )}
    </div>
  );
}
