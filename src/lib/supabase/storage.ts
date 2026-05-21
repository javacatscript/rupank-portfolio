const RESUME_BUCKET = "resumes";
const RESUME_OBJECT = "resume.pdf";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }

  return { url, key };
}

export function getResumePublicUrl(): string {
  const { url } = getSupabaseConfig();
  return `${url}/storage/v1/object/public/${RESUME_BUCKET}/${RESUME_OBJECT}`;
}

export async function uploadResumePdf(bytes: Buffer): Promise<string> {
  const { url, key } = getSupabaseConfig();
  const endpoint = `${url}/storage/v1/object/${RESUME_BUCKET}/${RESUME_OBJECT}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/pdf",
      "x-upsert": "true",
    },
    body: new Uint8Array(bytes),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Storage upload failed (${response.status}): ${detail}`);
  }

  return getResumePublicUrl();
}
