import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonUnauthorized() {
  return jsonError("Unauthorized", 401);
}

export function jsonSupabaseUnavailable() {
  return jsonError(
    "Database is not configured. Add Supabase env vars and run supabase/schema.sql",
    503
  );
}
