"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface GpuGaugeProps {
  value: number;
  className?: string;
}

function getStatus(value: number) {
  if (value >= 85) return { label: "Critical", color: "#f87171" };
  if (value >= 70) return { label: "Warning", color: "#fbbf24" };
  return { label: "Healthy", color: "#34d399" };
}

export function GpuGauge({ value, className }: GpuGaugeProps) {
  const status = getStatus(value);
  const data = [
    { name: "used", value },
    { name: "free", value: 100 - value },
  ];

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-sm",
        className
      )}
    >
      <h4 className="mb-2 self-start text-sm font-medium text-slate-300">
        GPU Utilization
      </h4>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={220}
            endAngle={-40}
            innerRadius={55}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={status.color} />
            <Cell fill="#1e293b" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center">
        <p className="text-3xl font-bold tabular-nums text-white">{value}%</p>
        <p className="text-sm font-medium" style={{ color: status.color }}>
          {status.label}
        </p>
        <div className="mt-2 flex gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-400" />
            &lt;70%
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-400" />
            70-85%
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-red-400" />
            &gt;85%
          </span>
        </div>
      </div>
    </div>
  );
}
