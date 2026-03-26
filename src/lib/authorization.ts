import { auth } from "@/lib/auth";

export const ADMIN_ROLE = "admin";

export function isAdminRole(role?: string | null): boolean {
  return String(role ?? "").toLowerCase() === ADMIN_ROLE;
}

export async function requireAdminAction() {
  const session = await auth();

  if (!session?.user?.id || !isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }

  return session;
}
