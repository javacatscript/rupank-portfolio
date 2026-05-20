import {
  projectFromDb,
  projectToDb,
  type DbProject,
} from "@/lib/supabase/mappers";
import { supabaseRest } from "@/lib/supabase/rest";
import type { Project, ProjectFormData } from "@/types/project";

export async function listProjects(): Promise<Project[]> {
  const rows = await supabaseRest<DbProject[]>("projects", {
    query: {
      select: "*",
      order: "sort_order.asc",
    },
  });
  return rows.map(projectFromDb);
}

export async function createProject(
  data: ProjectFormData,
  id: string
): Promise<Project> {
  const sortOrder = await getNewProjectSortOrder();
  const rows = await supabaseRest<DbProject[]>("projects", {
    method: "POST",
    body: projectToDb(data, id, sortOrder),
    prefer: "return=representation",
  });
  return projectFromDb(rows[0]);
}

export async function updateProject(
  id: string,
  data: ProjectFormData
): Promise<Project> {
  const existing = await supabaseRest<DbProject[]>("projects", {
    query: { select: "*", id: `eq.${id}` },
  });

  const sortOrder = existing[0]?.sort_order ?? 0;
  const rows = await supabaseRest<DbProject[]>("projects", {
    method: "PATCH",
    query: { id: `eq.${id}` },
    body: projectToDb(data, id, sortOrder),
    prefer: "return=representation",
  });
  return projectFromDb(rows[0]);
}

export async function deleteProject(id: string): Promise<void> {
  await supabaseRest("projects", {
    method: "DELETE",
    query: { id: `eq.${id}` },
  });
}

async function getNewProjectSortOrder(): Promise<number> {
  const rows = await supabaseRest<{ sort_order: number }[]>("projects", {
    query: {
      select: "sort_order",
      order: "sort_order.asc",
      limit: "1",
    },
  });
  return (rows[0]?.sort_order ?? 1) - 1;
}
