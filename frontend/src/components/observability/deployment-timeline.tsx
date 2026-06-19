import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStage } from "@/lib/observability-data";

interface DeploymentTimelineProps {
  stages: PipelineStage[];
}

const statusIcon = {
  success: CheckCircle2,
  running: Loader2,
  failed: XCircle,
  waiting: Circle,
};

const statusColor = {
  success: "text-emerald-400 border-emerald-500/30",
  running: "text-cyan-400 border-cyan-500/30",
  failed: "text-red-400 border-red-500/30",
  waiting: "text-slate-500 border-slate-600/30",
};

export function DeploymentTimeline({ stages }: DeploymentTimelineProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex min-w-max items-start gap-0">
        {stages.map((stage, index) => {
          const Icon = statusIcon[stage.status];
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.name} className="flex items-start">
              <div className="flex w-36 flex-col items-center">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 bg-slate-800/80",
                    statusColor[stage.status]
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5",
                      stage.status === "running" && "animate-spin"
                    )}
                  />
                </div>
                <p className="mt-2 text-center text-xs font-medium text-slate-300">
                  {stage.name}
                </p>
                {stage.duration && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {stage.duration}
                  </p>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mt-5 h-0.5 w-8",
                    stage.status === "success"
                      ? "bg-emerald-500/50"
                      : "bg-slate-600"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
