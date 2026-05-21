import { NextResponse } from "next/server";
import { INITIAL_SITE_CONTENT } from "@/data/initialSiteContent";
import { requireAdminMutation } from "@/lib/api/requireAdmin";
import { jsonError, jsonSupabaseUnavailable } from "@/lib/api/responses";
import {
  getSupabaseActionableMessage,
  isMissingSiteContentTable,
} from "@/lib/supabase/errors";
import {
  loadSiteContent,
  upsertSiteContentKey,
} from "@/lib/supabase/siteContentDb";
import { assertSupabaseReady, isSupabaseConfigured } from "@/lib/supabase/server";
import type { SiteContentKey } from "@/types/siteContent";

const VALID_KEYS: SiteContentKey[] = [
  "hero",
  "equipped_gear",
  "system_log",
  "resume_archive",
];

export async function GET() {
  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    assertSupabaseReady();
    const data = await loadSiteContent();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[api/site-content] GET", err);
    if (isMissingSiteContentTable(err)) {
      return NextResponse.json({
        data: INITIAL_SITE_CONTENT,
        warning: getSupabaseActionableMessage(err),
      });
    }
    return jsonError(getSupabaseActionableMessage(err), 500);
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const body = await request.json();
    const key = body?.key as SiteContentKey;
    const value = body?.value;

    if (!VALID_KEYS.includes(key)) {
      return jsonError("Invalid content key", 400);
    }

    if (value === undefined || value === null) {
      return jsonError("Content value is required", 400);
    }

    assertSupabaseReady();
    const saved = await upsertSiteContentKey(key, value);
    return NextResponse.json({ data: { key, value: saved } });
  } catch (err) {
    console.error("[api/site-content] PATCH", err);
    const status = isMissingSiteContentTable(err) ? 503 : 500;
    return jsonError(getSupabaseActionableMessage(err), status);
  }
}
