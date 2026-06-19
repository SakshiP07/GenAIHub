import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/lib/observability-data";

const statusColors: Record<HealthStatus, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

interface HealthIndicatorProps {
  status: HealthStatus;
  pulse?: boolean;
  className?: string;
}

export function HealthIndicator({
  status,
  pulse = true,
  className,
}: HealthIndicatorProps) {
  return (
    <span className={cn("relative inline-flex size-2.5", className)}>
      {pulse && status !== "healthy" && (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            statusColors[status]
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex size-2.5 rounded-full",
          statusColors[status]
        )}
      />
    </span>
  );
}
