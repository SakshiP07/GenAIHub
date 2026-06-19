"use client";

import {
  Activity,
  AlertTriangle,
  Boxes,
  Brain,
  Cpu,
  Gauge,
  Globe,
  ShieldCheck,
  Timer,
  TrendingDown,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import type { HealthStatus, PlatformKpi } from "@/lib/observability-data";
import { HealthIndicator } from "./health-indicator";

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  boxes: Boxes,
  cpu: Cpu,
  activity: Activity,
  "alert-triangle": AlertTriangle,
  brain: Brain,
  timer: Timer,
  "shield-check": ShieldCheck,
  globe: Globe,
  gauge: Gauge,
};

const statusBorder: Record<HealthStatus, string> = {
  healthy: "border-emerald-500/20",
  warning: "border-amber-500/30",
  critical: "border-red-500/30",
};

const statusGlow: Record<HealthStatus, string> = {
  healthy: "shadow-emerald-500/5",
  warning: "shadow-amber-500/10",
  critical: "shadow-red-500/10",
};

const sparkColors: Record<HealthStatus, string> = {
  healthy: "#34d399",
  warning: "#fbbf24",
  critical: "#f87171",
};

interface ObservabilityMetricCardProps {
  kpi: PlatformKpi;
}

export function ObservabilityMetricCard({ kpi }: ObservabilityMetricCardProps) {
  const Icon = iconMap[kpi.icon] ?? Activity;
  const isPositive = kpi.trend >= 0;
  const chartData = kpi.sparkline.map((value, i) => ({ i, value }));

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-slate-900/60 p-4 backdrop-blur-md transition-all duration-300 hover:border-slate-600/50 hover:shadow-lg",
        statusBorder[kpi.status],
        statusGlow[kpi.status]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-slate-800/80 text-cyan-400">
          <Icon className="size-4" />
        </div>
        <HealthIndicator status={kpi.status} />
      </div>

      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400">
        {kpi.label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-white">
        {kpi.value}
      </p>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}
        >
          {isPositive ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {Math.abs(kpi.trend)}%
        </span>
        <div className="h-8 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke={sparkColors[kpi.status]}
                fill={sparkColors[kpi.status]}
                fillOpacity={0.2}
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
