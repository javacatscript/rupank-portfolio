import { INITIAL_SITE_CONTENT } from "@/data/initialSiteContent";
import { supabaseRest } from "@/lib/supabase/rest";
import type {
  GearItem,
  HeroContent,
  ResumeArchiveContent,
  SiteContentBundle,
  SiteContentKey,
  SystemLogContent,
} from "@/types/siteContent";

interface SiteContentRow {
  key: string;
  value: unknown;
}

function parseHero(value: unknown): HeroContent {
  const v = value as HeroContent;
  if (typeof v?.name === "string" && typeof v?.tagline === "string") return v;
  return INITIAL_SITE_CONTENT.hero;
}

function parseGear(value: unknown): GearItem[] {
  if (!Array.isArray(value)) return INITIAL_SITE_CONTENT.equipped_gear;
  const items = value.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof (item as GearItem).id === "string" &&
      typeof (item as GearItem).name === "string"
  ) as GearItem[];
  return items.length > 0 ? items : INITIAL_SITE_CONTENT.equipped_gear;
}

function parseSystemLog(value: unknown): SystemLogContent {
  const v = value as SystemLogContent;
  if (Array.isArray(v?.lines) && v.lines.every((l) => typeof l === "string")) {
    return v;
  }
  return INITIAL_SITE_CONTENT.system_log;
}

function parseResumeArchive(value: unknown): ResumeArchiveContent {
  const v = value as ResumeArchiveContent;
  if (typeof v?.title === "string" && typeof v?.fileUrl === "string") {
    return {
      title: v.title,
      sizeLabel:
        typeof v.sizeLabel === "string"
          ? v.sizeLabel
          : INITIAL_SITE_CONTENT.resume_archive.sizeLabel,
      format:
        typeof v.format === "string"
          ? v.format
          : INITIAL_SITE_CONTENT.resume_archive.format,
      downloadName:
        typeof v.downloadName === "string"
          ? v.downloadName
          : INITIAL_SITE_CONTENT.resume_archive.downloadName,
      fileUrl: v.fileUrl,
      updatedAt: typeof v.updatedAt === "string" ? v.updatedAt : undefined,
    };
  }
  return INITIAL_SITE_CONTENT.resume_archive;
}

export async function loadSiteContent(): Promise<SiteContentBundle> {
  const rows = await supabaseRest<SiteContentRow[]>("site_content", {
    query: { select: "key,value" },
  });

  const map = new Map(rows.map((row) => [row.key, row.value]));

  return {
    hero: parseHero(map.get("hero")),
    equipped_gear: parseGear(map.get("equipped_gear")),
    system_log: parseSystemLog(map.get("system_log")),
    resume_archive: parseResumeArchive(map.get("resume_archive")),
  };
}

function parseSavedValue<K extends SiteContentKey>(
  key: K,
  saved: unknown
): SiteContentBundle[K] {
  if (key === "hero") return parseHero(saved) as SiteContentBundle[K];
  if (key === "equipped_gear") return parseGear(saved) as SiteContentBundle[K];
  if (key === "system_log") return parseSystemLog(saved) as SiteContentBundle[K];
  return parseResumeArchive(saved) as SiteContentBundle[K];
}

export async function upsertSiteContentKey<K extends SiteContentKey>(
  key: K,
  value: SiteContentBundle[K]
): Promise<SiteContentBundle[K]> {
  const existing = await supabaseRest<SiteContentRow[]>("site_content", {
    query: { select: "key", key: `eq.${key}` },
  });

  const updatedAt = new Date().toISOString();

  if (existing.length > 0) {
    const rows = await supabaseRest<SiteContentRow[]>("site_content", {
      method: "PATCH",
      query: { key: `eq.${key}` },
      body: { value, updated_at: updatedAt },
      prefer: "return=representation",
    });
    return parseSavedValue(key, rows[0]?.value);
  }

  const rows = await supabaseRest<SiteContentRow[]>("site_content", {
    method: "POST",
    body: { key, value, updated_at: updatedAt },
    prefer: "return=representation",
  });
  return parseSavedValue(key, rows[0]?.value);
}
