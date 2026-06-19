"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import type { ScalingEvent, TimeSeriesPoint } from "@/lib/observability-data";

interface ScalingChartProps {
  podData: TimeSeriesPoint[];
  cpuData: TimeSeriesPoint[];
  targetCpu: number;
  events: ScalingEvent[];
  metrics: {
    currentPods: number;
    minReplicas: number;
    maxReplicas: number;
    desiredReplicas: number;
    currentCpu: number;
  };
}

const eventColors = {
  "scale-up": "text-emerald-400",
  "scale-down": "text-blue-400",
  warning: "text-amber-400",
  traffic: "text-purple-400",
};

const tooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(51, 65, 85, 0.8)",
  borderRadius: "8px",
  color: "#e2e8f0",
  fontSize: "12px",
};

export function ScalingChart({
  podData,
  cpuData,
  targetCpu,
  events,
  metrics,
}: ScalingChartProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Current Pods", value: metrics.currentPods },
          { label: "Desired", value: metrics.desiredReplicas },
          { label: "Min", value: metrics.minReplicas },
          { label: "Max", value: metrics.maxReplicas },
          { label: "CPU", value: `${metrics.currentCpu}%` },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-center"
          >
            <p className="text-xs text-slate-500">{m.label}</p>
            <p className="text-xl font-bold tabular-nums text-white">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
          <h4 className="mb-3 text-sm font-medium text-slate-300">
            Pod Count Over Time
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={podData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="stepAfter"
                dataKey="value"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={{ fill: "#22d3ee", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
          <h4 className="mb-3 text-sm font-medium text-slate-300">
            CPU Utilization vs Target
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine
                y={targetCpu}
                stroke="#fbbf24"
                strokeDasharray="5 5"
                label={{ value: "Target", fill: "#fbbf24", fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
        <h4 className="mb-3 text-sm font-medium text-slate-300">
          Scaling Event Timeline
        </h4>
        <div className="space-y-2">
          {events.map((event, i) => (
            <div
              key={i}
              className="flex gap-3 border-l-2 border-slate-700 pl-3"
            >
              <span className="shrink-0 font-mono text-xs text-slate-500">
                {event.time}
              </span>
              <span className={cn("text-sm", eventColors[event.type])}>
                {event.event}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
