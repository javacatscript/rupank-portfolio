import type { Project, ProjectFormData } from "@/types/project";
import type { Quest, QuestFormData } from "@/types/quest";
import type { Skill, SkillFormData } from "@/types/skill";

export interface DbProject {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface DbSkill {
  id: string;
  name: string;
  level: string;
  category: string[];
  icon: string;
  highlight: boolean;
  sort_order: number;
}

export interface DbQuest {
  id: string;
  status: string;
  title: string;
  company: string;
  period: string;
  description: string;
  sort_order: number;
}

export function projectFromDb(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    techStack: row.tech_stack ?? [],
    liveUrl: row.live_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    imageUrl: row.image_url ?? undefined,
  };
}

export function projectToDb(
  data: ProjectFormData,
  id: string,
  sortOrder: number
): DbProject {
  return {
    id,
    title: data.title,
    description: data.description,
    tech_stack: data.techStack,
    live_url: data.liveUrl ?? null,
    github_url: data.githubUrl ?? null,
    image_url: data.imageUrl ?? null,
    sort_order: sortOrder,
  };
}

export function skillFromDb(row: DbSkill): Skill {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    category: row.category as Skill["category"],
    icon: row.icon,
    highlight: row.highlight,
  };
}

export function skillToDb(
  data: SkillFormData,
  id: string,
  sortOrder: number
): DbSkill {
  return {
    id,
    name: data.name,
    level: data.level,
    category: data.category,
    icon: data.icon,
    highlight: data.highlight ?? false,
    sort_order: sortOrder,
  };
}

export function questFromDb(row: DbQuest): Quest {
  return {
    id: row.id,
    status: row.status as Quest["status"],
    title: row.title,
    company: row.company,
    period: row.period,
    description: row.description,
  };
}

export function questToDb(
  data: QuestFormData,
  id: string,
  sortOrder: number
): DbQuest {
  return {
    id,
    status: data.status,
    title: data.title,
    company: data.company,
    period: data.period,
    description: data.description,
    sort_order: sortOrder,
  };
}
