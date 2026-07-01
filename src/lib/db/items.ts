import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

// Shape used by the dashboard item card: the item's own fields plus the
// display metadata (icon/color/border) derived from its item type.
const itemCardSelect = {
  id: true,
  title: true,
  description: true,
  content: true,
  url: true,
  isFavorite: true,
  isPinned: true,
  lastUsedAt: true,
  itemType: {
    select: {
      name: true,
      icon: true,
      color: true,
      softBg: true,
      borderColor: true,
    },
  },
} satisfies Prisma.ItemSelect;

export type ItemCardData = Prisma.ItemGetPayload<{ select: typeof itemCardSelect }>;

export function getPinnedItems(userId: string): Promise<ItemCardData[]> {
  return prisma.item.findMany({
    where: { userId, isPinned: true },
    select: itemCardSelect,
    orderBy: { lastUsedAt: "desc" },
  });
}

export function getRecentItems(userId: string, limit = 10): Promise<ItemCardData[]> {
  return prisma.item.findMany({
    where: { userId },
    select: itemCardSelect,
    orderBy: { lastUsedAt: "desc" },
    take: limit,
  });
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.collection.count({ where: { userId } }),
      prisma.item.count({ where: { userId, isFavorite: true } }),
      prisma.collection.count({ where: { userId, isFavorite: true } }),
    ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}
