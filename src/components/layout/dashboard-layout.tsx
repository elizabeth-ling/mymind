"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface SidebarControls {
  toggleMobile: () => void;
  toggleDesktop: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarControls | null>(null);

export function useSidebarControls(): SidebarControls {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebarControls must be used within DashboardShell");
  }
  return ctx;
}

interface DashboardShellProps {
  sidebar: React.ReactNode;
  topBar: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({ sidebar, topBar, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const controls: SidebarControls = {
    toggleMobile: () => setMobileOpen((v) => !v),
    toggleDesktop: () => setDesktopCollapsed((v) => !v),
    closeMobile: () => setMobileOpen(false),
  };

  // Lock body scroll and enable Escape-to-close while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [mobileOpen]);

  return (
    <SidebarContext.Provider value={controls}>
      <div className="flex h-screen bg-background text-foreground">
        <aside
          className={cn(
            "hidden shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out md:block",
            desktopCollapsed ? "w-0" : "w-60"
          )}
          aria-hidden={desktopCollapsed}
        >
          <div className="h-full w-60">{sidebar}</div>
        </aside>

        <aside
          className={cn(
            "fixed inset-0 z-40 transition-transform duration-200 ease-in-out md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-hidden={!mobileOpen}
          onClick={(e) => {
            // Close the drawer when a navigation link inside it is tapped.
            if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
          }}
        >
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {topBar}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
