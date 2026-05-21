"use client";

import { usePortfolioAdmin } from "@/context/PortfolioAdminContext";

interface EditTriggerProps {
  label: string;
  onEdit: () => void;
  className?: string;
}

export default function EditTrigger({
  label,
  onEdit,
  className = "",
}: EditTriggerProps) {
  const { requireAdmin } = usePortfolioAdmin();

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        requireAdmin(onEdit, "ADMIN_ACCESS_REQUIRED");
      }}
      aria-label={`Edit ${label}`}
      title="Edit content"
      className={`inline-flex items-center justify-center w-7 h-7 border border-terminal-green/50 bg-bg-card/90 text-terminal-green opacity-0 group-hover/edit:opacity-100 focus:opacity-100 transition-all duration-200 hover:bg-terminal-green hover:text-black hover:border-terminal-green hover:shadow-accent-sm shrink-0 ${className}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden
      >
        <path
          d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path d="M7 3L9 5" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    </button>
  );
}
