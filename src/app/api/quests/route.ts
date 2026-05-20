import { NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/api/requireAdmin";
import { jsonError, jsonSupabaseUnavailable } from "@/lib/api/responses";
import { createQuest, listQuests } from "@/lib/supabase/questsDb";
import { assertSupabaseReady, isSupabaseConfigured } from "@/lib/supabase/server";
import type { QuestFormData } from "@/types/quest";

export async function GET() {
  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    assertSupabaseReady();
    const quests = await listQuests();
    return NextResponse.json({ data: quests });
  } catch (err) {
    console.error("[api/quests] GET", err);
    return jsonError("Failed to load quests", 500);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const body = await request.json();
    const data = body as QuestFormData & { id?: string };

    if (
      !data.title?.trim() ||
      !data.company?.trim() ||
      !data.period?.trim() ||
      !data.description?.trim()
    ) {
      return jsonError("All quest fields are required", 400);
    }

    const id =
      typeof data.id === "string" && data.id.trim()
        ? data.id.trim()
        : `quest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    assertSupabaseReady();
    const quest = await createQuest(data, id);
    return NextResponse.json({ data: quest }, { status: 201 });
  } catch (err) {
    console.error("[api/quests] POST", err);
    return jsonError("Failed to create quest", 500);
  }
}
