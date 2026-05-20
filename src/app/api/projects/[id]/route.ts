import { NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/api/requireAdmin";
import { jsonError, jsonSupabaseUnavailable } from "@/lib/api/responses";
import { deleteProject, updateProject } from "@/lib/supabase/projectsDb";
import { assertSupabaseReady, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ProjectFormData } from "@/types/project";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const { id } = await context.params;
    const data = (await request.json()) as ProjectFormData;

    if (!data.title?.trim() || !data.description?.trim() || !data.techStack?.length) {
      return jsonError("Title, description, and tech stack are required", 400);
    }

    assertSupabaseReady();
    const project = await updateProject(id, data);
    return NextResponse.json({ data: project });
  } catch (err) {
    console.error("[api/projects/[id]] PATCH", err);
    return jsonError("Failed to update project", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const { id } = await context.params;
    assertSupabaseReady();
    await deleteProject(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[api/projects/[id]] DELETE", err);
    return jsonError("Failed to delete project", 500);
  }
}
