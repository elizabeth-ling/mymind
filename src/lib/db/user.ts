import { prisma } from "@/lib/db";

// No auth yet — resolve the seeded demo user as the active user.
// Replace this with the authenticated session user once auth is implemented.
const DEMO_USER_EMAIL = "demo@mymind.io";

export async function getCurrentUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
}
