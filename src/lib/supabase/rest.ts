type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface SupabaseRestOptions {
  method?: HttpMethod;
  query?: Record<string, string>;
  body?: unknown;
  prefer?: string;
}

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

export async function supabaseRest<T>(
  table: string,
  options: SupabaseRestOptions = {}
): Promise<T> {
  const { url, key } = getSupabaseConfig();
  const { method = "GET", query, body, prefer } = options;

  const search = new URLSearchParams(query);
  const endpoint = `${url}/rest/v1/${table}${search.toString() ? `?${search}` : ""}`;

  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };

  if (prefer) headers.Prefer = prefer;
  if (method === "POST" || method === "PATCH") {
    headers.Prefer = prefer ?? "return=representation";
  }

  const response = await fetch(endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Supabase ${method} ${table} failed (${response.status}): ${detail}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

