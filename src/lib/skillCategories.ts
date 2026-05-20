import type { Skill, SkillFilterCategory } from "@/types/skill";

export function getSkillCategoryFilters(skills: Skill[]) {
  const countByCategory = (category: SkillFilterCategory) => {
    if (category === "all") return skills.length;
    return skills.filter((skill) => skill.category.includes(category)).length;
  };

  return [
    { id: "all" as const, label: "ALL_ITEMS", count: `[${String(countByCategory("all")).padStart(2, "0")}]` },
    { id: "languages" as const, label: "LANGUAGES", count: `[${String(countByCategory("languages")).padStart(2, "0")}]` },
    { id: "frontend" as const, label: "FRONTEND", count: `[${String(countByCategory("frontend")).padStart(2, "0")}]` },
    { id: "backend" as const, label: "BACKEND_APIS", count: `[${String(countByCategory("backend")).padStart(2, "0")}]` },
    { id: "perf_ai" as const, label: "PERF_AI", count: `[${String(countByCategory("perf_ai")).padStart(2, "0")}]` },
    { id: "tools" as const, label: "TOOLS", count: `[${String(countByCategory("tools")).padStart(2, "0")}]` },
  ];
}
