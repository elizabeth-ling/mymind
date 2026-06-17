import { FileText, Folder, FolderHeart, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsCardsProps {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export function StatsCards({
  totalItems,
  totalCollections,
  favoriteItems,
  favoriteCollections,
}: StatsCardsProps) {
  const stats: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Items", value: totalItems, icon: FileText },
    { label: "Collections", value: totalCollections, icon: Folder },
    { label: "Favorite items", value: favoriteItems, icon: Star },
    { label: "Favorite collections", value: favoriteCollections, icon: FolderHeart },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {s.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
