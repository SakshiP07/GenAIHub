import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ModelStatus, ServiceState } from "@/lib/data";

const modelStatusStyles: Record<ModelStatus, string> = {
  Active: "border-green-200 bg-green-50 text-green-800",
};

const serviceStatusStyles: Record<ServiceState, string> = {
  Online: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function ModelStatusBadge({ status }: { status: ModelStatus }) {
  return (
    <Badge variant="outline" className={cn(modelStatusStyles[status])}>
      {status}
    </Badge>
  );
}

export function ServiceStatusBadge({ status }: { status: ServiceState }) {
  return (
    <Badge variant="outline" className={cn(serviceStatusStyles[status])}>
      {status}
    </Badge>
  );
}
