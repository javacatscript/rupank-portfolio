export function getSupabaseActionableMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("PGRST205") || message.includes("site_content")) {
    return "Site content table is missing. Run supabase/site-content.sql (or the site_content section in supabase/schema.sql) in the Supabase SQL Editor, then retry.";
  }

  if (message.includes("SUPABASE_NOT_CONFIGURED")) {
    return "Database is not configured. Add Supabase env vars to .env.local and restart the dev server.";
  }

  return message || "Database request failed";
}

export function isMissingSiteContentTable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("PGRST205") && message.includes("site_content");
}
