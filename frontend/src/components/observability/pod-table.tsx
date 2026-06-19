import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PodRow } from "@/lib/observability-data";
import { PodStatusBadge } from "./status-badge";

interface PodTableProps {
  pods: PodRow[];
}

export function PodTable({ pods }: PodTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700/50 hover:bg-transparent">
            <TableHead className="text-slate-400">Pod</TableHead>
            <TableHead className="text-slate-400">Namespace</TableHead>
            <TableHead className="text-slate-400">Deployment</TableHead>
            <TableHead className="text-slate-400">Status</TableHead>
            <TableHead className="text-slate-400">CPU</TableHead>
            <TableHead className="text-slate-400">Memory</TableHead>
            <TableHead className="text-slate-400">Restarts</TableHead>
            <TableHead className="text-slate-400">Uptime</TableHead>
            <TableHead className="text-slate-400">Node</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pods.map((pod) => (
            <TableRow
              key={pod.name}
              className="border-slate-700/30 hover:bg-slate-800/50"
            >
              <TableCell className="font-mono text-xs text-cyan-400">
                {pod.name}
              </TableCell>
              <TableCell className="text-slate-300">{pod.namespace}</TableCell>
              <TableCell className="text-slate-300">{pod.deployment}</TableCell>
              <TableCell>
                <PodStatusBadge status={pod.status} />
              </TableCell>
              <TableCell className="tabular-nums text-slate-300">
                {pod.cpu}
              </TableCell>
              <TableCell className="tabular-nums text-slate-300">
                {pod.memory}
              </TableCell>
              <TableCell
                className={
                  pod.restarts > 3
                    ? "tabular-nums text-red-400"
                    : "tabular-nums text-slate-300"
                }
              >
                {pod.restarts}
              </TableCell>
              <TableCell className="text-slate-400">{pod.uptime}</TableCell>
              <TableCell className="text-xs text-slate-400">{pod.node}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
