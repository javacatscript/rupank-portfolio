import { INITIAL_SKILLS } from "@/data/initialSkills";
import type { Skill } from "@/types/skill";

const STORAGE_KEY = "rupank_portfolio_skills";

function isValidSkill(value: unknown): value is Skill {
  if (!value || typeof value !== "object") return false;
  const skill = value as Skill;
  return (
    typeof skill.id === "string" &&
    typeof skill.name === "string" &&
    typeof skill.level === "string" &&
    typeof skill.icon === "string" &&
    Array.isArray(skill.category) &&
    skill.category.every((cat) => typeof cat === "string")
  );
}

export function loadSkills(): Skill[] {
  if (typeof window === "undefined") return INITIAL_SKILLS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SKILLS;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isValidSkill)) {
      return INITIAL_SKILLS;
    }

    return parsed.length > 0 ? parsed : INITIAL_SKILLS;
  } catch {
    return INITIAL_SKILLS;
  }
}

export function saveSkills(skills: Skill[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
}

export function createSkillId(): string {
  return `skill-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
