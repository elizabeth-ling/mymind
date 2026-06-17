"use client";

import { PanelLeft, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  onToggleMobileSidebar: () => void;
  onToggleDesktopSidebar: () => void;
}

export function TopBar({
  onToggleMobileSidebar,
  onToggleDesktopSidebar,
}: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-3 md:px-4">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open sidebar"
        className="md:hidden"
        onClick={onToggleMobileSidebar}
      >
        <PanelLeft />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle sidebar"
        className="hidden md:inline-flex"
        onClick={onToggleDesktopSidebar}
      >
        <PanelLeft />
      </Button>

      <div className="relative max-w-2xl flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search snippets, prompts, commands…"
          className="h-9 pl-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          <Plus />
          New collection
        </Button>
        <Button variant="accent" size="sm">
          <Plus />
          <span className="hidden sm:inline">New item</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
    </header>
  );
}
