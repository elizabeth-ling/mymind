"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside
        className={cn(
          "hidden shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out md:block",
          desktopCollapsed ? "w-0" : "w-60"
        )}
        aria-hidden={desktopCollapsed}
      >
        <div className="h-full w-60">
          <Sidebar onClose={() => setDesktopCollapsed(true)} />
        </div>
      </aside>

      <aside
        className={cn(
          "fixed inset-0 z-40 transition-transform duration-200 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
      >
        <Sidebar onClose={closeMobile} closeOnNavigate />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          onToggleMobileSidebar={() => setMobileOpen((v) => !v)}
          onToggleDesktopSidebar={() => setDesktopCollapsed((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
