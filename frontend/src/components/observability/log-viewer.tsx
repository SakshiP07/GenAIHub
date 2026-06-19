"use client";

import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LogEntry, LogLevel } from "@/lib/observability-data";

const levelColors: Record<LogLevel, string> = {
  info: "text-slate-300",
  warning: "text-amber-400",
  error: "text-red-400",
  critical: "text-red-500 font-semibold",
  security: "text-purple-400",
  audit: "text-cyan-400",
};

const levelBg: Record<LogLevel, string> = {
  info: "bg-slate-800/30",
  warning: "bg-amber-500/5",
  error: "bg-red-500/5",
  critical: "bg-red-500/10",
  security: "bg-purple-500/5",
  audit: "bg-cyan-500/5",
};

const filters: { label: string; value: LogLevel | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
  { label: "Critical", value: "critical" },
  { label: "Security", value: "security" },
  { label: "Audit", value: "audit" },
];

interface LogViewerProps {
  logs: LogEntry[];
}

export function LogViewer({ logs }: LogViewerProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<LogLevel | "all">("all");

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter =
        activeFilter === "all" || log.level === activeFilter;
      const matchesSearch =
        search === "" ||
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.service.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [logs, search, activeFilter]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/80 backdrop-blur-sm">
      <div className="flex flex-col gap-3 border-b border-slate-700/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="size-4 text-slate-500" />
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                activeFilter === f.value
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto p-2 font-mono text-xs">
        {filtered.map((log) => (
          <div
            key={log.id}
            className={cn(
              "flex gap-3 rounded px-3 py-1.5 hover:bg-slate-800/50",
              levelBg[log.level]
            )}
          >
            <span className="shrink-0 text-slate-500">
              {log.timestamp.slice(11, 23)}
            </span>
            <span
              className={cn(
                "w-16 shrink-0 uppercase",
                levelColors[log.level]
              )}
            >
              [{log.level}]
            </span>
            <span className="w-28 shrink-0 text-slate-500">{log.service}</span>
            <span className={levelColors[log.level]}>{log.message}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">No logs match filter</p>
        )}
      </div>
    </div>
  );
}
