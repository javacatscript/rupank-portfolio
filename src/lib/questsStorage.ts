import { INITIAL_QUESTS } from "@/data/initialQuests";
import type { Quest } from "@/types/quest";

const STORAGE_KEY = "rupank_portfolio_quests";

function isValidQuest(value: unknown): value is Quest {
  if (!value || typeof value !== "object") return false;
  const quest = value as Quest;
  return (
    typeof quest.id === "string" &&
    typeof quest.status === "string" &&
    typeof quest.title === "string" &&
    typeof quest.company === "string" &&
    typeof quest.period === "string" &&
    typeof quest.description === "string"
  );
}

export function loadQuests(): Quest[] {
  if (typeof window === "undefined") return INITIAL_QUESTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_QUESTS;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isValidQuest)) {
      return INITIAL_QUESTS;
    }

    return parsed.length > 0 ? parsed : INITIAL_QUESTS;
  } catch {
    return INITIAL_QUESTS;
  }
}

export function saveQuests(quests: Quest[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quests));
}

export function createQuestId(): string {
  return `quest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
