import { skillFromDb, skillToDb, type DbSkill } from "@/lib/supabase/mappers";
import { supabaseRest } from "@/lib/supabase/rest";
import type { Skill, SkillFormData } from "@/types/skill";

export async function listSkills(): Promise<Skill[]> {
  const rows = await supabaseRest<DbSkill[]>("skills", {
    query: {
      select: "*",
      order: "sort_order.asc",
    },
  });
  return rows.map(skillFromDb);
}

export async function createSkill(data: SkillFormData, id: string): Promise<Skill> {
  const sortOrder = await getNewSkillSortOrder();
  const rows = await supabaseRest<DbSkill[]>("skills", {
    method: "POST",
    body: skillToDb(data, id, sortOrder),
    prefer: "return=representation",
  });
  return skillFromDb(rows[0]);
}

export async function updateSkill(id: string, data: SkillFormData): Promise<Skill> {
  const existing = await supabaseRest<DbSkill[]>("skills", {
    query: { select: "*", id: `eq.${id}` },
  });
  const sortOrder = existing[0]?.sort_order ?? 0;
  const rows = await supabaseRest<DbSkill[]>("skills", {
    method: "PATCH",
    query: { id: `eq.${id}` },
    body: skillToDb(data, id, sortOrder),
    prefer: "return=representation",
  });
  return skillFromDb(rows[0]);
}

export async function deleteSkill(id: string): Promise<void> {
  await supabaseRest("skills", {
    method: "DELETE",
    query: { id: `eq.${id}` },
  });
}

async function getNewSkillSortOrder(): Promise<number> {
  const rows = await supabaseRest<{ sort_order: number }[]>("skills", {
    query: {
      select: "sort_order",
      order: "sort_order.asc",
      limit: "1",
    },
  });
  return (rows[0]?.sort_order ?? 1) - 1;
}
