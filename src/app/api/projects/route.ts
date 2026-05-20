import { NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/api/requireAdmin";
import { jsonError, jsonSupabaseUnavailable } from "@/lib/api/responses";
import { createProject, listProjects } from "@/lib/supabase/projectsDb";
import { assertSupabaseReady, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ProjectFormData } from "@/types/project";

export async function GET() {
  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    assertSupabaseReady();
    const projects = await listProjects();
    return NextResponse.json({ data: projects });
  } catch (err) {
    console.error("[api/projects] GET", err);
    return jsonError("Failed to load projects", 500);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const body = await request.json();
    const data = body as ProjectFormData & { id?: string };

    if (!data.title?.trim() || !data.description?.trim() || !data.techStack?.length) {
      return jsonError("Title, description, and tech stack are required", 400);
    }

    const id =
      typeof data.id === "string" && data.id.trim()
        ? data.id.trim()
        : `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    assertSupabaseReady();
    const project = await createProject(data, id);
    return NextResponse.json({ data: project }, { status: 201 });
  } catch (err) {
    console.error("[api/projects] POST", err);
    return jsonError("Failed to create project", 500);
  }
}
