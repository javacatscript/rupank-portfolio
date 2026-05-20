import { NextResponse } from "next/server";

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
      console.error("[projects/auth] PROJECTS_ADMIN_KEY is not set");
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

    return NextResponse.json({ authorized: true });
  } catch (err) {
    console.error("[projects/auth] Error:", err);
    return NextResponse.json(
      { authorized: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
