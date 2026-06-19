import { cn } from "@/lib/utils";
import type { AlertSeverity, PodStatus } from "@/lib/observability-data";

const podStyles: Record<PodStatus, string> = {
  Running: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Failed: "border-red-500/30 bg-red-500/10 text-red-400",
  CrashLoopBackOff: "border-red-500/30 bg-red-500/10 text-red-400",
  Terminating: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};

const severityStyles: Record<AlertSeverity, string> = {
  critical: "border-red-500/40 bg-red-500/15 text-red-400",
  high: "border-orange-500/40 bg-orange-500/15 text-orange-400",
  medium: "border-amber-500/40 bg-amber-500/15 text-amber-400",
  low: "border-blue-500/40 bg-blue-500/15 text-blue-400",
};

export function PodStatusBadge({ status }: { status: PodStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        podStyles[status]
      )}
    >
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium uppercase",
        severityStyles[severity]
      )}
    >
      {severity}
    </span>
  );
}

export function PipelineStatusBadge({
  status,
}: {
  status: "success" | "running" | "failed" | "waiting";
}) {
  const styles = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    running: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    failed: "border-red-500/30 bg-red-500/10 text-red-400",
    waiting: "border-slate-500/30 bg-slate-500/10 text-slate-400",
  };
  const labels = {
    success: "Success",
    running: "Running",
    failed: "Failed",
    waiting: "Waiting",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
