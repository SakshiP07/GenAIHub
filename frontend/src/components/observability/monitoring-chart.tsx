"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import type { TimeSeriesPoint } from "@/lib/observability-data";

interface MonitoringChartProps {
  title: string;
  data: TimeSeriesPoint[];
  type?: "line" | "area" | "bar";
  dataKey?: string;
  dataKey2?: string;
  label?: string;
  label2?: string;
  color?: string;
  color2?: string;
  unit?: string;
  className?: string;
  height?: number;
}

const tooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(51, 65, 85, 0.8)",
  borderRadius: "8px",
  color: "#e2e8f0",
  fontSize: "12px",
};

export function MonitoringChart({
  title,
  data,
  type = "line",
  dataKey = "value",
  dataKey2 = "value2",
  label = "Value",
  label2 = "Value 2",
  color = "#22d3ee",
  color2 = "#a78bfa",
  unit = "",
  className,
  height = 200,
}: MonitoringChartProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-sm",
        className
      )}
    >
      <h4 className="mb-3 text-sm font-medium text-slate-300">{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        {type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`${v ?? 0}${unit}`, label]}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : type === "area" ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`${v ?? 0}${unit}`, label]}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
            <Line
              type="monotone"
              dataKey={dataKey}
              name={label}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
            {data.some((d) => d.value2 !== undefined) && (
              <Line
                type="monotone"
                dataKey={dataKey2}
                name={label2}
                stroke={color2}
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
