"use client";

import { useState } from "react";
import { X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertItem } from "@/lib/observability-data";
import { SeverityBadge } from "./status-badge";

interface AlertPanelProps {
  alerts: AlertItem[];
}

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

const severityBorder = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-amber-500",
  low: "border-l-blue-500",
};

export function AlertPanel({ alerts: initialAlerts }: AlertPanelProps) {
  const [alerts, setAlerts] = useState(initialAlerts);

  const sorted = [...alerts].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Bell className="size-4 text-red-400" />
        <span className="text-sm font-medium text-slate-300">
          {alerts.length} active alerts
        </span>
      </div>

      {sorted.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "rounded-lg border border-slate-700/50 border-l-4 bg-slate-900/60 p-4 backdrop-blur-sm transition-all hover:bg-slate-800/60",
            severityBorder[alert.severity]
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={alert.severity} />
                <span className="text-xs text-slate-500">{alert.timestamp}</span>
              </div>
              <p className="font-medium text-white">{alert.title}</p>
              <p className="text-xs text-slate-400">{alert.component}</p>
            </div>
            <button
              type="button"
              onClick={() => dismiss(alert.id)}
              className="shrink-0 rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
              aria-label="Dismiss alert"
            >
              <X className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-cyan-400/80">
            Recommended: {alert.action}
          </p>
        </div>
      ))}

      {alerts.length === 0 && (
        <p className="py-6 text-center text-sm text-emerald-400">
          All clear — no active alerts
        </p>
      )}
    </div>
  );
}
