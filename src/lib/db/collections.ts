import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

const collectionCardSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  isFavorite: true,
  _count: {
    select: { items: true },
  },
} satisfies Prisma.CollectionSelect;

export type CollectionCardData = Prisma.CollectionGetPayload<{
  select: typeof collectionCardSelect;
}>;

export function getRecentCollections(
  userId: string,
  limit = 6,
): Promise<CollectionCardData[]> {
  return prisma.collection.findMany({
    where: { userId },
    select: collectionCardSelect,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}
