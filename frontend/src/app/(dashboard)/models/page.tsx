import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ModelStatusBadge } from "@/components/dashboard/status-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { models } from "@/lib/data";

export default function ModelsPage() {
  return (
    <DashboardLayout title="Available Models">
      <Card className="rounded-lg shadow-none">
        <CardHeader>
          <CardTitle>Available Models</CardTitle>
          <CardDescription>
            List of AI models available in the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.name}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.version}</TableCell>
                    <TableCell>
                      <ModelStatusBadge status={model.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
