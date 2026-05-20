import { INITIAL_PROJECTS } from "@/data/initialProjects";
import type { Project } from "@/types/project";

const STORAGE_KEY = "rupank_portfolio_projects";

function isValidProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") return false;
  const p = value as Project;
  return (
    typeof p.id === "string" &&
    typeof p.title === "string" &&
    typeof p.description === "string" &&
    Array.isArray(p.techStack) &&
    p.techStack.every((t) => typeof t === "string")
  );
}

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return INITIAL_PROJECTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROJECTS;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isValidProject)) {
      return INITIAL_PROJECTS;
    }

    return parsed.length > 0 ? parsed : INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createProjectId(): string {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function resetProjectsToInitial(): Project[] {
  saveProjects(INITIAL_PROJECTS);
  return INITIAL_PROJECTS;
}
