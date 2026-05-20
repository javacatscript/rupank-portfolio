export type SkillCategory =
  | "languages"
  | "frontend"
  | "backend"
  | "perf_ai"
  | "tools";

export type SkillFilterCategory = "all" | SkillCategory;

export interface Skill {
  id: string;
  name: string;
  level: string;
  category: SkillCategory[];
  icon: string;
  highlight?: boolean;
}

export type SkillFormData = Omit<Skill, "id">;
