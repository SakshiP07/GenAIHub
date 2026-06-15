"use client";

import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="size-4" />
        </Button>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="hidden text-xs text-muted-foreground sm:block">
            DevOps Project Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
        <Avatar className="size-8">
          <AvatarFallback className="bg-teal-700 text-xs text-white">
            GH
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
