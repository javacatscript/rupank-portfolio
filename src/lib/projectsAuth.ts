const AUTH_STORAGE_KEY = "rupank_portfolio_admin";

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; error: string };

export function setClientAdminFlag(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_STORAGE_KEY, "1");
}

export function clearClientAdminFlag(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isClientAdminFlagSet(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === "1";
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { isAdmin?: boolean };
    return Boolean(data.isAdmin);
  } catch {
    return false;
  }
}

export async function verifyAdminKey(key: string): Promise<AdminAuthResult> {
  try {
    const response = await fetch("/api/projects/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ key }),
    });

    const data = (await response.json()) as {
      authorized?: boolean;
      error?: string;
    };

    if (response.ok && data.authorized) {
      setClientAdminFlag();
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

export async function clearAuthSession(): Promise<void> {
  clearClientAdminFlag();
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Ignore network errors during logout
  }
}

/** @deprecated Use isClientAdminFlagSet or checkAdminSession */
export function isProjectsAdmin(): boolean {
  return isClientAdminFlagSet();
}
