import { NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/api/requireAdmin";
import { jsonError, jsonSupabaseUnavailable } from "@/lib/api/responses";
import { deleteQuest, updateQuest } from "@/lib/supabase/questsDb";
import { assertSupabaseReady, isSupabaseConfigured } from "@/lib/supabase/server";
import type { QuestFormData } from "@/types/quest";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const { id } = await context.params;
    const data = (await request.json()) as QuestFormData;

    if (
      !data.title?.trim() ||
      !data.company?.trim() ||
      !data.period?.trim() ||
      !data.description?.trim()
    ) {
      return jsonError("All quest fields are required", 400);
    }

    assertSupabaseReady();
    const quest = await updateQuest(id, data);
    return NextResponse.json({ data: quest });
  } catch (err) {
    console.error("[api/quests/[id]] PATCH", err);
    return jsonError("Failed to update quest", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const { id } = await context.params;
    assertSupabaseReady();
    await deleteQuest(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[api/quests/[id]] DELETE", err);
    return jsonError("Failed to delete quest", 500);
  }
}
