import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "portfolio_admin_session";
const SESSION_MS = 60 * 60 * 1000;

function getAdminSecret(): string {
  const secret = process.env.PROJECTS_ADMIN_KEY;
  if (!secret) {
    throw new Error("PROJECTS_ADMIN_KEY is not configured");
  }
  return secret;
}

function signPayload(payloadB64: string): string {
  return createHmac("sha256", getAdminSecret())
    .update(payloadB64)
    .digest("base64url");
}

export function createAdminSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_MS })
  ).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

export function verifyAdminSessionToken(token: string): boolean {
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  const expected = signPayload(payloadB64);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const { exp } = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as { exp: number };
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminSessionToken(token);
}

export function adminCookieOptions(maxAgeSeconds = 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
