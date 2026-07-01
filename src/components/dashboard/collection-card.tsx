import { Folder, Star } from "lucide-react";

import type { CollectionCardData } from "@/lib/db/collections";

export function CollectionCard({
  collection,
}: {
  collection: CollectionCardData;
}) {
  const itemCount = collection._count.items;

  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Folder className="size-4 shrink-0 text-muted-foreground" />
          <h3 className="truncate text-sm font-semibold text-foreground">
            {collection.name}
          </h3>
        </div>
        {collection.isFavorite ? (
          <Star className="size-4 shrink-0 fill-accent text-accent" />
        ) : null}
      </div>

      {collection.description ? (
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {collection.description}
        </p>
      ) : null}

      <p className="mt-auto text-xs text-muted-foreground">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </p>
    </article>
  );
}
