import { NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/api/requireAdmin";
import { jsonError, jsonSupabaseUnavailable } from "@/lib/api/responses";
import { deleteSkill, updateSkill } from "@/lib/supabase/skillsDb";
import { assertSupabaseReady, isSupabaseConfigured } from "@/lib/supabase/server";
import type { SkillFormData } from "@/types/skill";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const { id } = await context.params;
    const data = (await request.json()) as SkillFormData;

    if (!data.name?.trim() || !data.level?.trim() || !data.icon?.trim() || !data.category?.length) {
      return jsonError("Name, level, icon, and category are required", 400);
    }

    assertSupabaseReady();
    const skill = await updateSkill(id, data);
    return NextResponse.json({ data: skill });
  } catch (err) {
    console.error("[api/skills/[id]] PATCH", err);
    return jsonError("Failed to update skill", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const { id } = await context.params;
    assertSupabaseReady();
    await deleteSkill(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[api/skills/[id]] DELETE", err);
    return jsonError("Failed to delete skill", 500);
  }
}
