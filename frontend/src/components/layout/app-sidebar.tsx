"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Box,
  Gauge,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inference", label: "AI Inference", icon: Sparkles },
  { href: "/models", label: "Models", icon: Box },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/observability", label: "Observability Dashboard", icon: Gauge },
];

interface AppSidebarProps {
  mobileOpen: boolean;
  onNavigate: () => void;
}

export function AppSidebar({ mobileOpen, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onNavigate}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-teal-800 bg-teal-900 text-white lg:static",
          mobileOpen ? "block" : "hidden lg:flex"
        )}
      >
        <div className="border-b border-teal-800 px-6 py-5">
          <h1 className="text-lg font-semibold tracking-tight">GenAIHub</h1>
          <p className="mt-1 text-xs text-teal-200">AI Operations Platform</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                  active
                    ? "bg-teal-700 text-white"
                    : "text-teal-100 hover:bg-teal-800"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-teal-800 px-6 py-4">
          <p className="text-xs text-teal-300">GenAIHub DevOps v1.0</p>
        </div>
      </aside>
    </>
  );
}
