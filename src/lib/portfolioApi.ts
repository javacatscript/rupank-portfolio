import type { Project, ProjectFormData } from "@/types/project";
import type { Quest, QuestFormData } from "@/types/quest";
import type { Skill, SkillFormData } from "@/types/skill";

const credentials = "include" as RequestCredentials;

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { data?: T; error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return payload.data as T;
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects", { cache: "no-store" });
  return parseResponse<Project[]>(response);
}

export async function createProjectApi(data: ProjectFormData): Promise<Project> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials,
    body: JSON.stringify(data),
  });
  return parseResponse<Project>(response);
}

export async function updateProjectApi(
  id: string,
  data: ProjectFormData
): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials,
    body: JSON.stringify(data),
  });
  return parseResponse<Project>(response);
}

export async function deleteProjectApi(id: string): Promise<void> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    credentials,
  });

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error ?? "Failed to delete project");
  }
}

export async function fetchSkills(): Promise<Skill[]> {
  const response = await fetch("/api/skills", { cache: "no-store" });
  return parseResponse<Skill[]>(response);
}

export async function createSkillApi(data: SkillFormData): Promise<Skill> {
  const response = await fetch("/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials,
    body: JSON.stringify(data),
  });
  return parseResponse<Skill>(response);
}

export async function updateSkillApi(
  id: string,
  data: SkillFormData
): Promise<Skill> {
  const response = await fetch(`/api/skills/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials,
    body: JSON.stringify(data),
  });
  return parseResponse<Skill>(response);
}

export async function deleteSkillApi(id: string): Promise<void> {
  const response = await fetch(`/api/skills/${id}`, {
    method: "DELETE",
    credentials,
  });

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error ?? "Failed to delete skill");
  }
}

export async function fetchQuests(): Promise<Quest[]> {
  const response = await fetch("/api/quests", { cache: "no-store" });
  return parseResponse<Quest[]>(response);
}

export async function createQuestApi(data: QuestFormData): Promise<Quest> {
  const response = await fetch("/api/quests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials,
    body: JSON.stringify(data),
  });
  return parseResponse<Quest>(response);
}

export async function updateQuestApi(
  id: string,
  data: QuestFormData
): Promise<Quest> {
  const response = await fetch(`/api/quests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials,
    body: JSON.stringify(data),
  });
  return parseResponse<Quest>(response);
}

export async function deleteQuestApi(id: string): Promise<void> {
  const response = await fetch(`/api/quests/${id}`, {
    method: "DELETE",
    credentials,
  });

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error ?? "Failed to delete quest");
  }
}
