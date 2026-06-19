import { KeyRound, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SecretMeta } from "@/lib/observability-data";
import { HealthIndicator } from "./health-indicator";

const statusMap = {
  active: "healthy" as const,
  expiring: "warning" as const,
  rotated: "healthy" as const,
};

interface SecretCardProps {
  secret: SecretMeta;
}

export function SecretCard({ secret }: SecretCardProps) {
  const health = statusMap[secret.status];

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-sm transition-all hover:border-slate-600/60">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-amber-400" />
          <span className="font-mono text-sm font-medium text-white">
            {secret.name}
          </span>
        </div>
        <HealthIndicator status={health} pulse={secret.status === "expiring"} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-slate-500">Status</p>
          <p className="capitalize text-slate-300">{secret.status}</p>
        </div>
        <div>
          <p className="text-slate-500">Expires In</p>
          <p
            className={cn(
              secret.status === "expiring" ? "text-amber-400" : "text-slate-300"
            )}
          >
            {secret.expiresIn}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Last Rotation</p>
          <p className="text-slate-300">{secret.lastRotation}</p>
        </div>
        <div>
          <p className="text-slate-500">Access Count</p>
          <p className="tabular-nums text-slate-300">
            {secret.accessCount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-3">
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Shield className="size-3" />
          {secret.policy}
        </span>
        <span className="text-xs font-medium text-emerald-400">
          Score: {secret.healthScore}%
        </span>
      </div>
    </div>
  );
}
