import { NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/api/requireAdmin";
import { jsonError, jsonSupabaseUnavailable } from "@/lib/api/responses";
import { createSkill, listSkills } from "@/lib/supabase/skillsDb";
import { assertSupabaseReady, isSupabaseConfigured } from "@/lib/supabase/server";
import type { SkillFormData } from "@/types/skill";

export async function GET() {
  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    assertSupabaseReady();
    const skills = await listSkills();
    return NextResponse.json({ data: skills });
  } catch (err) {
    console.error("[api/skills] GET", err);
    return jsonError("Failed to load skills", 500);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const body = await request.json();
    const data = body as SkillFormData & { id?: string };

    if (!data.name?.trim() || !data.level?.trim() || !data.icon?.trim() || !data.category?.length) {
      return jsonError("Name, level, icon, and category are required", 400);
    }

    const id =
      typeof data.id === "string" && data.id.trim()
        ? data.id.trim()
        : `skill-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    assertSupabaseReady();
    const skill = await createSkill(data, id);
    return NextResponse.json({ data: skill }, { status: 201 });
  } catch (err) {
    console.error("[api/skills] POST", err);
    return jsonError("Failed to create skill", 500);
  }
}
