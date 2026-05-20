import { questFromDb, questToDb, type DbQuest } from "@/lib/supabase/mappers";
import { supabaseRest } from "@/lib/supabase/rest";
import type { Quest, QuestFormData } from "@/types/quest";

export async function listQuests(): Promise<Quest[]> {
  const rows = await supabaseRest<DbQuest[]>("quests", {
    query: {
      select: "*",
      order: "sort_order.asc",
    },
  });
  return rows.map(questFromDb);
}

export async function createQuest(data: QuestFormData, id: string): Promise<Quest> {
  const sortOrder = await getNewQuestSortOrder();
  const rows = await supabaseRest<DbQuest[]>("quests", {
    method: "POST",
    body: questToDb(data, id, sortOrder),
    prefer: "return=representation",
  });
  return questFromDb(rows[0]);
}

export async function updateQuest(id: string, data: QuestFormData): Promise<Quest> {
  const existing = await supabaseRest<DbQuest[]>("quests", {
    query: { select: "*", id: `eq.${id}` },
  });
  const sortOrder = existing[0]?.sort_order ?? 0;
  const rows = await supabaseRest<DbQuest[]>("quests", {
    method: "PATCH",
    query: { id: `eq.${id}` },
    body: questToDb(data, id, sortOrder),
    prefer: "return=representation",
  });
  return questFromDb(rows[0]);
}

export async function deleteQuest(id: string): Promise<void> {
  await supabaseRest("quests", {
    method: "DELETE",
    query: { id: `eq.${id}` },
  });
}

async function getNewQuestSortOrder(): Promise<number> {
  const rows = await supabaseRest<{ sort_order: number }[]>("quests", {
    query: {
      select: "sort_order",
      order: "sort_order.asc",
      limit: "1",
    },
  });
  return (rows[0]?.sort_order ?? 1) - 1;
}
