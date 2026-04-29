import { auth } from "@/auth";
import type { Role } from "@prisma/client";
import { redirectTo } from "@/lib/redirect-locale";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    await redirectTo("/connexion");
  }
  return session!;
}

export async function requireRole(role: Role) {
  const session = await requireAuth();
  if (session.user.role !== role) {
    await redirectTo("/");
  }
  return session;
}
