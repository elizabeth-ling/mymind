"use client";

import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useSidebarControls } from "./dashboard-shell";

export function SidebarToggles() {
  const { toggleMobile, toggleDesktop } = useSidebarControls();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open sidebar"
        className="md:hidden"
        onClick={toggleMobile}
      >
        <PanelLeft />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle sidebar"
        className="hidden md:inline-flex"
        onClick={toggleDesktop}
      >
        <PanelLeft />
      </Button>
    </>
  );
}
