import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ServiceStatusBadge } from "@/components/dashboard/status-badges";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  monitoringServices,
  recentLogs,
  resourceUsage,
} from "@/lib/data";

export default function MonitoringPage() {
  return (
    <DashboardLayout title="System Monitoring">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Monitor application performance and services.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-lg shadow-none">
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {resourceUsage.map((resource) => (
                <Progress key={resource.label} value={resource.value}>
                  <div className="flex w-full items-center justify-between">
                    <ProgressLabel>{resource.label}</ProgressLabel>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {resource.value}%
                    </span>
                  </div>
                </Progress>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-none">
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {monitoringServices.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-md border px-4 py-3"
                >
                  <span className="text-sm font-medium">{service.name}</span>
                  <ServiceStatusBadge status={service.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-lg shadow-none">
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentLogs.map((log, index) => (
                <li key={log}>
                  <span className="text-sm">{log}</span>
                  {index < recentLogs.length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
