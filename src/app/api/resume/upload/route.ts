import { NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/api/requireAdmin";
import { jsonError, jsonSupabaseUnavailable } from "@/lib/api/responses";
import { formatFileSize } from "@/lib/formatFileSize";
import {
  getSupabaseActionableMessage,
  isMissingSiteContentTable,
} from "@/lib/supabase/errors";
import { uploadResumePdf } from "@/lib/supabase/storage";
import { upsertSiteContentKey } from "@/lib/supabase/siteContentDb";
import { assertSupabaseReady, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ResumeArchiveContent } from "@/types/siteContent";

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const admin = await requireAdminMutation();
  if (!admin.ok) return admin.response;

  if (!isSupabaseConfigured()) return jsonSupabaseUnavailable();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "").trim();
    const downloadName = String(formData.get("downloadName") ?? "").trim();
    const format = String(formData.get("format") ?? "PDF").trim();

    if (!(file instanceof File) || file.size === 0) {
      return jsonError("PDF file is required", 400);
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return jsonError("Only PDF files are allowed", 400);
    }

    if (file.size > MAX_BYTES) {
      return jsonError("File must be 10MB or smaller", 400);
    }

    assertSupabaseReady();
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadResumePdf(buffer);

    const resume: ResumeArchiveContent = {
      title: title || "Resume_Rupank.v1",
      downloadName: downloadName || "Rupank_Joshi_Resume.pdf",
      format: format || "PDF",
      sizeLabel: formatFileSize(file.size),
      fileUrl,
      updatedAt: new Date().toISOString(),
    };

    const saved = await upsertSiteContentKey("resume_archive", resume);
    return NextResponse.json({ data: saved });
  } catch (err) {
    console.error("[api/resume/upload] POST", err);
    const message = getSupabaseActionableMessage(err);
    if (isMissingSiteContentTable(err)) {
      return jsonError(message, 503);
    }
    if (message.includes("Storage upload failed")) {
      return jsonError(
        "Resume storage is not ready. Run supabase/resume-storage.sql in the Supabase SQL Editor.",
        503
      );
    }
    return jsonError(message, 500);
  }
}
