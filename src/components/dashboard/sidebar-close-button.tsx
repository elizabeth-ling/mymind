"use client";

import { PanelLeftClose } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useSidebarControls } from "./dashboard-shell";

export function SidebarCloseButton() {
  const { closeMobile } = useSidebarControls();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Close sidebar"
      className="-mb-1 size-8 md:hidden"
      onClick={closeMobile}
    >
      <PanelLeftClose />
    </Button>
  );
}
