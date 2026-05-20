const AUTH_STORAGE_KEY = "rupank_projects_admin";
const AUTH_DURATION_MS = 60 * 60 * 1000;

interface AuthSession {
  expiresAt: number;
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as AuthSession;
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      clearAuthSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function isProjectsAdmin(): boolean {
  return getAuthSession() !== null;
}

export function setAuthSession(): void {
  const session: AuthSession = {
    expiresAt: Date.now() + AUTH_DURATION_MS,
  };
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; error: string };

export async function verifyAdminKey(key: string): Promise<AdminAuthResult> {
  try {
    const response = await fetch("/api/projects/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    const data = (await response.json()) as {
      authorized?: boolean;
      error?: string;
    };

    if (response.ok && data.authorized) {
      setAuthSession();
      return { ok: true };
    }

    if (response.status === 503) {
      return {
        ok: false,
        error:
          "ACCESS_DENIED // Admin key not configured. Set PROJECTS_ADMIN_KEY in .env.local and restart the dev server.",
      };
    }

    return {
      ok: false,
      error: data.error
        ? `ACCESS_DENIED // ${data.error}`
        : "ACCESS_DENIED // Invalid security key",
    };
  } catch {
    return {
      ok: false,
      error: "ACCESS_DENIED // Authentication service unavailable",
    };
  }
}
