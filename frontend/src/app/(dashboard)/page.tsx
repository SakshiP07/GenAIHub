import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ServiceStatusBadge } from "@/components/dashboard/status-badges";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  dashboardMetrics,
  recentActivity,
  serviceStatus,
  systemOverview,
} from "@/lib/data";

export default function DashboardPage() {
  return (
    <DashboardLayout title="GenAIHub Dashboard">
      <div className="space-y-6">
        <section>
          <p className="text-sm text-muted-foreground">
            AI Platform Monitoring System
          </p>
        </section>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardMetrics.map((metric) => (
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-lg shadow-none">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentActivity.map((item, index) => (
                  <li key={item}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                    {index < recentActivity.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-none">
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemOverview.map((item, index) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-sm font-semibold tabular-nums">
                      {item.value}
                    </p>
                  </div>
                  {index < systemOverview.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="rounded-lg shadow-none">
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {serviceStatus.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between rounded-md border px-4 py-3"
                  >
                    <span className="text-sm font-medium">{service.name}</span>
                    <ServiceStatusBadge status={service.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
