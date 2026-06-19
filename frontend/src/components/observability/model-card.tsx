import { ArrowRight, Brain, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/lib/observability-data";
import { HealthIndicator } from "./health-indicator";

interface ModelCardProps {
  name: string;
  version: string;
  endpoint: string;
  status: HealthStatus;
  traffic: number;
  latency: number;
  accuracy: number;
  isActive: boolean;
}

export function ModelCard({
  name,
  version,
  endpoint,
  status,
  traffic,
  latency,
  accuracy,
  isActive,
}: ModelCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-slate-900/50 p-4 backdrop-blur-sm transition-all hover:border-slate-600/60",
        isActive ? "border-slate-700/50" : "border-red-500/20 opacity-70"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-violet-400" />
          <div>
            <p className="font-medium text-white">{name}</p>
            <p className="font-mono text-xs text-slate-500">{version}</p>
          </div>
        </div>
        <HealthIndicator status={status} />
      </div>

      <p className="mt-2 font-mono text-xs text-cyan-400/70">{endpoint}</p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-slate-500">Traffic</p>
          <p className="text-sm font-semibold tabular-nums text-white">
            {traffic}%
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Latency</p>
          <p className="text-sm font-semibold tabular-nums text-white">
            {latency > 0 ? `${latency}ms` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Accuracy</p>
          <p className="text-sm font-semibold tabular-nums text-white">
            {accuracy > 0 ? `${accuracy}%` : "—"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-3">
        <span
          className={cn(
            "text-xs font-medium",
            isActive ? "text-emerald-400" : "text-red-400"
          )}
        >
          {isActive ? "Serving traffic" : "Offline"}
        </span>
        {isActive && (
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400"
          >
            <RotateCcw className="size-3" />
            Rollback
          </button>
        )}
      </div>
    </div>
  );
}

interface VersionTimelineProps {
  versions: { version: string; date: string; status: string }[];
}

export function VersionTimeline({ versions }: VersionTimelineProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {versions.map((v, i) => (
        <div key={v.version} className="flex items-center gap-2">
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-center",
              v.status === "production"
                ? "border-emerald-500/40 bg-emerald-500/10"
                : v.status === "canary"
                  ? "border-amber-500/40 bg-amber-500/10"
                  : "border-slate-700/50 bg-slate-800/50"
            )}
          >
            <p className="font-mono text-sm font-medium text-white">
              {v.version}
            </p>
            <p className="text-xs capitalize text-slate-400">{v.status}</p>
          </div>
          {i < versions.length - 1 && (
            <ArrowRight className="size-4 text-slate-600" />
          )}
        </div>
      ))}
    </div>
  );
}
