import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminSessionToken,
} from "@/lib/adminSession";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const key = typeof body?.key === "string" ? body.key.trim() : "";

    if (!key) {
      return NextResponse.json(
        { authorized: false, error: "Access key is required" },
        { status: 400 }
      );
    }

    const adminKey = process.env.PROJECTS_ADMIN_KEY;

    if (!adminKey) {
      console.error("[auth] PROJECTS_ADMIN_KEY is not set");
      return NextResponse.json(
        { authorized: false, error: "Admin access is not configured" },
        { status: 503 }
      );
    }

    if (key !== adminKey) {
      return NextResponse.json(
        { authorized: false, error: "Invalid access key" },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ authorized: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, adminCookieOptions());
    return response;
  } catch (err) {
    console.error("[auth] Error:", err);
    return NextResponse.json(
      { authorized: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
