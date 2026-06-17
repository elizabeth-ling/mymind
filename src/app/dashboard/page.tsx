import Link from "next/link";

import { CollectionCard } from "@/components/dashboard/collection-card";
import { ItemCard } from "@/components/dashboard/item-card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { collections, items } from "@/lib/mock-data";

export default function DashboardPage() {
  const pinnedItems = items.filter((i) => i.isPinned);

  const recentItems = [...items]
    .sort(
      (a, b) =>
        new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
    )
    .slice(0, 10);

  const recentCollections = collections.slice(0, 6);

  const totalItems = items.length;
  const totalCollections = collections.length;
  const favoriteItems = items.filter((i) => i.isFavorite).length;
  const favoriteCollections = collections.filter((c) => c.isFavorite).length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your developer knowledge, saved once and findable everywhere.
        </p>
      </header>

      <StatsCards
        totalItems={totalItems}
        totalCollections={totalCollections}
        favoriteItems={favoriteItems}
        favoriteCollections={favoriteCollections}
      />

      {pinnedItems.length > 0 ? (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Pinned" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <SectionHeader
          title="Collections"
          trailing={
            <Link
              href="/collections"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="Recent items" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  trailing,
}: {
  title: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {trailing}
    </div>
  );
}
