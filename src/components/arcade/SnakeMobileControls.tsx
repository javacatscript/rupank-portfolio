"use client";

import type { Direction } from "@/lib/arcade/snake/types";

type SnakeMobileControlsProps = {
  onDirection: (dir: Direction) => void;
  onPause: () => void;
  disabled?: boolean;
};

export default function SnakeMobileControls({
  onDirection,
  onPause,
  disabled = false,
}: SnakeMobileControlsProps) {
  const btn =
    "flex h-11 w-11 items-center justify-center border border-terminal-white/25 text-terminal-green text-sm font-bold active:bg-terminal-green/20 disabled:opacity-40 disabled:pointer-events-none";

  return (
    <div className="flex flex-col items-center gap-2 md:hidden">
      <button
        type="button"
        className={btn}
        disabled={disabled}
        onClick={() => onDirection("up")}
        aria-label="Move up"
      >
        ▲
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={btn}
          disabled={disabled}
          onClick={() => onDirection("left")}
          aria-label="Move left"
        >
          ◀
        </button>
        <button
          type="button"
          className={`${btn} text-[10px] tracking-wider`}
          disabled={disabled}
          onClick={onPause}
          aria-label="Pause"
        >
          P
        </button>
        <button
          type="button"
          className={btn}
          disabled={disabled}
          onClick={() => onDirection("right")}
          aria-label="Move right"
        >
          ▶
        </button>
      </div>
      <button
        type="button"
        className={btn}
        disabled={disabled}
        onClick={() => onDirection("down")}
        aria-label="Move down"
      >
        ▼
      </button>
    </div>
  );
}
