import type { GameState } from "./types";

export const SNAKE_STORAGE_KEY = "portfolio.arcade.snake.v1";
export const SNAKE_STORAGE_EVENT = "portfolio:snake-save-updated";

export type SavedGame = {
  schemaVersion: 1;
  savedAt: number;
  highScore: number;
  snapshot: GameState | null;
};

const EMPTY_SAVE: SavedGame = {
  schemaVersion: 1,
  savedAt: 0,
  highScore: 0,
  snapshot: null,
};

export function loadSavedGame(): SavedGame {
  if (typeof window === "undefined") return EMPTY_SAVE;

  try {
    const raw = localStorage.getItem(SNAKE_STORAGE_KEY);
    if (!raw) return EMPTY_SAVE;

    const parsed = JSON.parse(raw) as SavedGame;
    if (parsed.schemaVersion !== 1) return EMPTY_SAVE;

    return {
      schemaVersion: 1,
      savedAt: parsed.savedAt ?? 0,
      highScore: typeof parsed.highScore === "number" ? parsed.highScore : 0,
      snapshot: parsed.snapshot ?? null,
    };
  } catch {
    return EMPTY_SAVE;
  }
}

export function persistSavedGame(data: SavedGame): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SNAKE_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent<SavedGame>(SNAKE_STORAGE_EVENT, { detail: data }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function saveSnapshot(snapshot: GameState, highScore: number): void {
  const current = loadSavedGame();
  persistSavedGame({
    schemaVersion: 1,
    savedAt: Date.now(),
    highScore: Math.max(current.highScore, highScore),
    snapshot,
  });
}

export function saveHighScore(highScore: number): void {
  const current = loadSavedGame();
  persistSavedGame({
    ...current,
    highScore: Math.max(current.highScore, highScore),
  });
}

export function clearSavedGame(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(SNAKE_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent<SavedGame>(SNAKE_STORAGE_EVENT, { detail: EMPTY_SAVE }),
    );
  } catch {
    /* ignore */
  }
}
