import { Star } from "lucide-react";

import type { ItemCardData } from "@/lib/db/items";
import { formatRelativeTime } from "@/lib/format";

import { iconMap } from "./icon-map";

export function ItemCard({ item }: { item: ItemCardData }) {
  const { itemType } = item;
  const Icon = itemType ? iconMap[itemType.icon] : null;

  return (
    <article className="flex flex-col gap-2.5 rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        {itemType ? (
          <span
            className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: itemType.softBg ?? undefined,
              borderColor: itemType.borderColor ?? undefined,
              color: itemType.color,
            }}
          >
            {Icon ? <Icon className="size-3" /> : null}
            {itemType.name}
          </span>
        ) : null}
        {item.isFavorite ? (
          <Star className="size-4 shrink-0 fill-accent text-accent" />
        ) : null}
      </div>

      <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
        {item.title}
      </h3>

      {item.description ? (
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {item.description}
        </p>
      ) : null}

      {item.content ? (
        <pre className="line-clamp-3 overflow-hidden whitespace-pre-wrap break-words rounded-md bg-surface-muted/60 p-2 font-mono text-[11px] leading-relaxed text-foreground/80">
          {item.content}
        </pre>
      ) : null}

      {item.url ? (
        <p className="truncate rounded-md bg-surface-muted/60 p-2 font-mono text-[11px] text-foreground/80">
          {item.url}
        </p>
      ) : null}

      {item.lastUsedAt ? (
        <p className="mt-auto text-xs text-muted-foreground">
          {formatRelativeTime(item.lastUsedAt)}
        </p>
      ) : null}
    </article>
  );
}
