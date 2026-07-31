"use client";

import Link from "next/link";
import { Clock, Folder, LayoutDashboard, Lock, PanelLeftClose, Pin, Settings, Star, LayoutDashboardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { collections, currentUser, items, itemTypes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

import { iconMap } from "./icon-map";

interface SidebarProps {
  onClose: () => void;
  closeOnNavigate?: boolean;
}

export function Sidebar({ onClose, closeOnNavigate = false }: SidebarProps) {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite).slice(0, 4);
  const pinnedItems = items.filter((i) => i.isPinned).slice(0, 6);
  const starredItems = items.filter((i) => i.isFavorite).slice(0, 6);

  const itemCountByType = new Map<string, number>();
  for (const item of items) {
    itemCountByType.set(
      item.itemTypeId,
      (itemCountByType.get(item.itemTypeId) ?? 0) + 1
    );
  }

  const getDominantTypeColor = (collectionId: string): string | undefined => {
    const counts = new Map<string, number>();
    for (const item of items) {
      if (!item.collectionIds.includes(collectionId)) continue;
      counts.set(item.itemTypeId, (counts.get(item.itemTypeId) ?? 0) + 1);
    }

    let topTypeId: string | undefined;
    let topCount = 0;
    for (const [typeId, count] of counts) {
      if (count > topCount) {
        topCount = count;
        topTypeId = typeId;
      }
    }

    return itemTypes.find((type) => type.id === topTypeId)?.color;
  };

  const userInitials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleNavigate = closeOnNavigate ? onClose : undefined;

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-surface-muted">
      <div className="flex h-14 shrink-0 items-end justify-between px-4 pb-2">
        <Link
          href="/dashboard"
          onClick={handleNavigate}
          className="text-lg font-semibold leading-none tracking-tight text-foreground"
        >
          mymind
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close sidebar"
          className="-mb-1 size-8 md:hidden"
          onClick={onClose}
        >
          <PanelLeftClose />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        <SectionHeading>Workspace</SectionHeading>
        <ul className="space-y-0.5">
          <li>
            <SidebarLink
              href="/recent"
              icon={<LayoutDashboardIcon className="size-4" />}
              onNavigate={handleNavigate}
            >
              Dashboard
            </SidebarLink>
          </li>
          <li>
            <SidebarLink
              href="/recent"
              icon={<Clock className="size-4" />}
              onNavigate={handleNavigate}
            >
              Recent
            </SidebarLink>
          </li>
          <li>
            <SidebarLink
              href="/favorites"
              icon={<Star className="size-4" />}
              onNavigate={handleNavigate}
            >
              Favorites
            </SidebarLink>
          </li>
        </ul>

        {pinnedItems.length > 0 && (
          <>
            <SectionHeading>Pinned</SectionHeading>
            <ul className="space-y-0.5">
              {pinnedItems.map((item) => (
                <li key={item.id}>
                  <SidebarLink
                    href={`/items/${item.id}`}
                    icon={<Pin className="size-4 text-muted-foreground" />}
                    onNavigate={handleNavigate}
                  >
                    {item.title}
                  </SidebarLink>
                </li>
              ))}
            </ul>
          </>
        )}

        {starredItems.length > 0 && (
          <>
            <SectionHeading>Starred</SectionHeading>
            <ul className="space-y-0.5">
              {starredItems.map((item) => (
                <li key={item.id}>
                  <SidebarLink
                    href={`/items/${item.id}`}
                    icon={<Star className="size-4 text-muted-foreground" />}
                    onNavigate={handleNavigate}
                  >
                    {item.title}
                  </SidebarLink>
                </li>
              ))}
            </ul>
          </>
        )}

        <SectionHeading>Item Types</SectionHeading>
        <ul className="space-y-0.5">
          {itemTypes.map((type) => {
            const Icon = iconMap[type.icon];
            return (
              <li key={type.id}>
                <SidebarLink
                  href={`/items/${type.slug}s`}
                  onNavigate={handleNavigate}
                  icon={
                    Icon ? (
                      <Icon className="size-4" style={{ color: type.color }} />
                    ) : null
                  }
                  trailing={
                    type.isProOnly ? (
                      <Lock className="size-3 text-muted-foreground" />
                    ) : (
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {itemCountByType.get(type.id) ?? 0}
                      </span>
                    )
                  }
                >
                  {type.name}
                </SidebarLink>
              </li>
            );
          })}
        </ul>

        {recentCollections.length > 0 && (
          <>
            <SectionHeading>Recent Collections</SectionHeading>
            <ul className="space-y-0.5">
              {recentCollections.map((collection) => {
                const folderColor = getDominantTypeColor(collection.id);
                return (
                  <li key={collection.id}>
                    <SidebarLink
                      href={`/collections/${collection.slug}`}
                      icon={
                        <Folder
                          className={cn(
                            "size-4",
                            !folderColor && "text-muted-foreground"
                          )}
                          style={folderColor ? { color: folderColor } : undefined}
                        />
                      }
                      onNavigate={handleNavigate}
                    >
                      {collection.name}
                    </SidebarLink>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      <div className="shrink-0 border-t border-border px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
            className="size-8 shrink-0 text-muted-foreground"
            asChild
          >
            <Link href="/settings">
              <Settings />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

interface SidebarLinkProps {
  href: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
  onNavigate?: () => void;
}

function SidebarLink({ href, icon, trailing, children, onNavigate }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors",
        "hover:bg-surface"
      )}
    >
      {icon ? (
        <span className="flex size-4 shrink-0 items-center justify-center">
          {icon}
        </span>
      ) : null}
      <span className="flex-1 truncate">{children}</span>
      {trailing}
    </Link>
  );
}
