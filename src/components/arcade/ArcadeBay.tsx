"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import SnakeMobileControls from "@/components/arcade/SnakeMobileControls";
import SnakePlayfieldCanvas from "@/components/arcade/SnakePlayfieldCanvas";
import { useArcade } from "@/context/ArcadeContext";
import {
  createInitialState,
  queueDirection,
  restart,
  step,
  togglePause,
} from "@/lib/arcade/snake/engine";
import {
  clearSavedGame,
  loadSavedGame,
  saveHighScore,
  saveSnapshot,
} from "@/lib/arcade/snake/storage";
import type { Direction, GameConfig, GameState } from "@/lib/arcade/snake/types";

const GAME_CONFIG: GameConfig = {
  gridWidth: 24,
  gridHeight: 15,
  tickMs: 140,
  minTickMs: 80,
  tickStepMs: 4,
};

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  s: "down",
  S: "down",
  a: "left",
  A: "left",
  d: "right",
  D: "right",
};

function formatStatus(status: GameState["status"]): string {
  const labels: Record<GameState["status"], string> = {
    ready: "READY",
    playing: "PLAYING",
    paused: "PAUSED",
    gameover: "GAME OVER",
  };
  return labels[status];
}

type GameAction =
  | { type: "set"; state: GameState }
  | { type: "update"; updater: (state: GameState) => GameState };

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "set") return action.state;
  return action.updater(state);
}

const OPEN_MESSAGES: Record<string, string> = {
  start: "SYSTEM BOOT — ARCADE ONLINE",
  coin: "COIN INSERTED — CREDIT OK",
  navSave: "NO ACTIVE RUN — START PLAYING, THEN SAVE",
};

export default function ArcadeBay() {
  const { close, registerHandlers, lastOpenReason } = useArcade();
  const playfieldRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);

  const [gameState, dispatch] = useReducer(
    gameReducer,
    GAME_CONFIG,
    (config) => createInitialState(config),
  );
  const [highScore, setHighScore] = useState(0);
  const [hasSnapshot, setHasSnapshot] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  stateRef.current = gameState;

  const syncHighScore = useCallback((score: number) => {
    setHighScore((prev) => {
      const next = Math.max(prev, score);
      if (next > prev) saveHighScore(next);
      return next;
    });
  }, []);

  const handleRestart = useCallback(() => {
    dispatch({ type: "set", state: restart(GAME_CONFIG) });
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!audioContextRef.current) {
      audioContextRef.current = new Ctor();
    }
    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playBeep = useCallback(
    (frequency: number, durationMs: number, type: OscillatorType = "square") => {
      if (!soundEnabled) return;
      const ctx = ensureAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
      osc.start(now);
      osc.stop(now + durationMs / 1000 + 0.01);
    },
    [ensureAudioContext, soundEnabled],
  );

  const handleDirection = useCallback((dir: Direction) => {
    dispatch({
      type: "update",
      updater: (current) => {
        let next = queueDirection(current, dir);
        if (current.status === "ready") {
          next = { ...next, status: "playing" };
        }
        return next;
      },
    });
  }, []);

  const handleSave = useCallback(async () => {
    const current = stateRef.current;
    if (!current || current.status === "ready") {
      setFlashMessage("NO ACTIVE RUN — START PLAYING FIRST");
      return;
    }
    saveSnapshot(current, Math.max(highScore, current.score));
    setHasSnapshot(true);
    setFlashMessage("GAME SAVED");
    playBeep(660, 90, "triangle");
  }, [highScore, playBeep]);

  const handleLoad = useCallback(async () => {
    const saved = loadSavedGame();
    if (!saved.snapshot) {
      setFlashMessage("NO SAVE FOUND");
      return;
    }
    dispatch({
      type: "set",
      state: { ...saved.snapshot, status: "paused", nextDirection: null },
    });
    setHighScore(saved.highScore);
    setFlashMessage("SAVE LOADED — PRESS P TO RESUME");
    playBeep(740, 120, "triangle");
  }, [playBeep]);

  const handleResetSave = useCallback(() => {
    clearSavedGame();
    setHasSnapshot(false);
    setHighScore(0);
    setFlashMessage("SAVE DATA CLEARED");
    playBeep(240, 100, "sawtooth");
  }, [playBeep]);

  useEffect(() => {
    const saved = loadSavedGame();
    setHighScore(saved.highScore);
    setHasSnapshot(saved.snapshot !== null);

    if (lastOpenReason === "coin" && saved.snapshot) {
      setFlashMessage("COIN INSERTED — PRESS LOAD TO CONTINUE");
      return;
    }
    // if (lastOpenReason && OPEN_MESSAGES[lastOpenReason]) {
    //   setFlashMessage(OPEN_MESSAGES[lastOpenReason]);
    // }
  }, [lastOpenReason]);

  useEffect(() => {
    const unregister = registerHandlers({
      requestSave: handleSave,
      requestLoad: handleLoad,
    });
    return unregister;
  }, [registerHandlers, handleSave, handleLoad]);

  useEffect(() => {
    playfieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!flashMessage) return;
    const timer = window.setTimeout(() => setFlashMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  useEffect(() => {
    if (gameState.status !== "playing") return;

    const id = window.setInterval(() => {
      dispatch({
        type: "update",
        updater: (current) => {
          if (current.status !== "playing") return current;
          const next = step(current, GAME_CONFIG);
          if (next.score > current.score) {
            playBeep(820, 70, "square");
          }
          if (next.status === "gameover" && next.score > 0) {
            syncHighScore(next.score);
          }
          if (next.status === "gameover") {
            playBeep(180, 180, "sawtooth");
          }
          return next;
        },
      });
    }, gameState.tickMs);

    return () => window.clearInterval(id);
  }, [gameState.status, gameState.tickMs, playBeep, syncHighScore]);

  useEffect(() => {
    if (gameState.status === "gameover") {
      syncHighScore(gameState.score);
    }
  }, [gameState.status, gameState.score, syncHighScore]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const dir = KEY_TO_DIRECTION[event.key];
      if (dir) {
        event.preventDefault();
        handleDirection(dir);
        return;
      }

      if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        dispatch({
          type: "update",
          updater: (current) => {
            if (current.status === "ready") {
              return { ...current, status: "playing" };
            }
            return togglePause(current);
          },
        });
        return;
      }

      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        handleRestart();
      }
    },
    [handleDirection, handleRestart],
  );

  useEffect(() => {
    const pauseOnHide = () => {
      dispatch({
        type: "update",
        updater: (current) =>
          current.status === "playing" ? { ...current, status: "paused" } : current,
      });
    };

    window.addEventListener("blur", pauseOnHide);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") pauseOnHide();
    });

    return () => {
      window.removeEventListener("blur", pauseOnHide);
    };
  }, []);

  const hudStatus = useMemo(() => formatStatus(gameState.status), [gameState.status]);
  const speed = useMemo(
    () => Math.round((1000 / Math.max(1, gameState.tickMs)) * 10) / 10,
    [gameState.tickMs],
  );

  return (
    <div className="w-full max-w-3xl border-b-4 border-terminal-white box-retro bg-bg-primary/50">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-2 border-terminal-white/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-terminal-green">
            Arcade Bay
          </span>
          <span className="text-xs font-mono uppercase text-terminal-white/40">/</span>
          <span className="text-xs font-bold uppercase tracking-wider">Snake</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono uppercase">
          <span>
            Status{" "}
            <span className="text-terminal-green">({hudStatus})</span>
          </span>
          <span>
            Score{" "}
            <span className="text-terminal-green tabular-nums">{gameState.score}</span>
          </span>
          <span>
            Hi{" "}
            <span className="text-terminal-green tabular-nums">{highScore}</span>
          </span>
          <span>
            Speed{" "}
            <span className="text-terminal-green tabular-nums">{speed}x</span>
          </span>
        </div>
      </div>

      {flashMessage && (
        <p className="border-b border-terminal-green/30 bg-terminal-green/10 px-4 py-2 text-center text-[10px] font-mono uppercase tracking-wider text-terminal-green">
          {flashMessage}
        </p>
      )}

      <div
        ref={playfieldRef}
        tabIndex={0}
        role="application"
        aria-label="Snake playfield"
        onKeyDown={onKeyDown}
        className="mx-4 my-4 aspect-[16/10] border-2 border-terminal-white/25 bg-black outline-none focus:border-terminal-green/60 focus:ring-2 focus:ring-terminal-green/30 transition-colors"
      >
        <SnakePlayfieldCanvas state={gameState} className="h-full w-full" />
      </div>

      <div className="border-t-2 border-terminal-white/20 px-4 py-3 space-y-3">
        <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-terminal-white/60 text-center">
          Controls: Arrows / WASD • P pause • R restart
        </p>

        <SnakeMobileControls
          onDirection={handleDirection}
          onPause={() =>
            dispatch({
              type: "update",
              updater: (current) => togglePause(current),
            })
          }
          disabled={gameState.status === "gameover"}
        />

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <ArcadeButton onClick={() => setSoundEnabled((prev) => !prev)}>
            {soundEnabled ? "Sound On" : "Sound Off"}
          </ArcadeButton>
          {/* <ArcadeButton onClick={() => void handleSave()}>Save Game</ArcadeButton> */}
          {/* <ArcadeButton onClick={() => void handleLoad()} disabled={!hasSnapshot}>
            Load
          </ArcadeButton> */}
          {/* <ArcadeButton onClick={handleResetSave}>Reset Save</ArcadeButton> */}
          <ArcadeButton onClick={handleRestart}>Restart</ArcadeButton>
          <ArcadeButton onClick={close} variant="accent">
            Exit Arcade
          </ArcadeButton>
        </div>
      </div>
    </div>
  );
}

function ArcadeButton({
  children,
  onClick,
  variant = "default",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "accent";
  disabled?: boolean;
}) {
  const base =
    "text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 sm:px-4 py-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const styles =
    variant === "accent"
      ? "bg-terminal-green text-black hover:bg-terminal-green/90 disabled:hover:bg-terminal-green"
      : "border border-terminal-white/20 text-terminal-green hover:border-terminal-green hover:bg-terminal-green/10 disabled:hover:border-terminal-white/20 disabled:hover:bg-transparent";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}
