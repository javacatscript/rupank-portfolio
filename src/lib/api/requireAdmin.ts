import { isAdminRequest } from "@/lib/adminSession";
import { jsonUnauthorized } from "@/lib/api/responses";

export async function requireAdminMutation() {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return { ok: false as const, response: jsonUnauthorized() };
  }
  return { ok: true as const };
}
