import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminSession";

export async function GET() {
  const isAdmin = await isAdminRequest();
  return NextResponse.json({ isAdmin });
}
