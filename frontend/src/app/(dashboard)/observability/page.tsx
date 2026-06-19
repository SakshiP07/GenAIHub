"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  Cloud,
  GitBranch,
  KeyRound,
  Layers,
  LineChart,
  Network,
  Play,
  ScrollText,
  Shield,
  Square,
  TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AlertPanel } from "@/components/observability/alert-panel";
import { ArchitectureDiagram } from "@/components/observability/architecture-diagram";
import { DeploymentTimeline } from "@/components/observability/deployment-timeline";
import { GpuGauge } from "@/components/observability/gpu-gauge";
import { LogViewer } from "@/components/observability/log-viewer";
import { ModelCard, VersionTimeline } from "@/components/observability/model-card";
import { MonitoringChart } from "@/components/observability/monitoring-chart";
import { ObservabilityMetricCard } from "@/components/observability/observability-metric-card";
import { PodTable } from "@/components/observability/pod-table";
import { ScalingChart } from "@/components/observability/scaling-chart";
import { SecretCard } from "@/components/observability/secret-card";
import {
  ObservabilitySection,
  SectionHeader,
} from "@/components/observability/section-shell";
import { HealthIndicator } from "@/components/observability/health-indicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  alerts as staticAlerts,
  apiLatency as staticApiLatency,
  architectureEdges as staticArchitectureEdges,
  architectureNodes as staticArchitectureNodes,
  backupHistory as staticBackupHistory,
  clusterSummary as staticClusterSummary,
  cpuByNode as staticCpuByNode,
  deploymentHistory as staticDeploymentHistory,
  drStatus as staticDrStatus,
  gpuUtilization as staticGpuUtilization,
  hpaCpuTrend as staticHpaCpuTrend,
  hpaMetrics as staticHpaMetrics,
  inferenceRpm as staticInferenceRpm,
  logEntries as staticLogEntries,
  memoryUsage as staticMemoryUsage,
  modelOps as staticModelOps,
  modelServingPerf as staticModelServingPerf,
  modelVersions as staticModelVersions,
  networkThroughput as staticNetworkThroughput,
  pipelineStages as staticPipelineStages,
  platformKpis as staticPlatformKpis,
  podCountOverTime as staticPodCountOverTime,
  pods as staticPods,
  scalingEvents as staticScalingEvents,
  secrets as staticSecrets,
  successRate as staticSuccessRate,
  vaultStatus as staticVaultStatus,
} from "@/lib/observability-data";
import { Button } from "@/components/ui/button";

const STATIC_DEFAULT = {
  platformKpis: staticPlatformKpis,
  inferenceRpm: staticInferenceRpm,
  cpuByNode: staticCpuByNode,
  memoryUsage: staticMemoryUsage,
  gpuUtilization: staticGpuUtilization,
  apiLatency: staticApiLatency,
  networkThroughput: staticNetworkThroughput,
  successRate: staticSuccessRate,
  modelServingPerf: staticModelServingPerf,
  pods: staticPods,
  clusterSummary: staticClusterSummary,
  pipelineStages: staticPipelineStages,
  deploymentHistory: staticDeploymentHistory,
  hpaMetrics: staticHpaMetrics,
  podCountOverTime: staticPodCountOverTime,
  hpaCpuTrend: staticHpaCpuTrend,
  scalingEvents: staticScalingEvents,
  logEntries: staticLogEntries,
  secrets: staticSecrets,
  vaultStatus: staticVaultStatus,
  drStatus: staticDrStatus,
  backupHistory: staticBackupHistory,
  alerts: staticAlerts,
  modelOps: staticModelOps,
  modelVersions: staticModelVersions,
  architectureNodes: staticArchitectureNodes,
  architectureEdges: staticArchitectureEdges,
};

type ObservabilitySnapshot = typeof STATIC_DEFAULT & {
  demoMode?: {
    active: boolean;
    message: string;
    currentPods: number;
    loadFactor: number;
  };
  updatedAt?: string;
};

export default function ObservabilityPage() {
  const [snapshot, setSnapshot] = useState<ObservabilitySnapshot | null>(null);
  const [demoActive, setDemoActive] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const fetchObservability = useCallback(async () => {
    try {
      const res = await fetch("/api/observability", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as ObservabilitySnapshot;
      setSnapshot(data);
      setDemoActive(Boolean(data.demoMode?.active));
    } catch {
      /* keep last snapshot or static fallback */
    }
  }, []);

  useEffect(() => {
    fetchObservability();
  }, [fetchObservability]);

  useEffect(() => {
    if (!demoActive) return;
    const interval = setInterval(fetchObservability, 2000);
    return () => clearInterval(interval);
  }, [demoActive, fetchObservability]);

  const toggleDemoMode = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/observability/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: demoActive ? "stop" : "start" }),
      });
      if (!res.ok) return;
      const payload = await res.json();
      if (payload.data) setSnapshot(payload.data);
      setDemoActive(Boolean(payload.demoMode?.active));
    } finally {
      setDemoLoading(false);
    }
  };

  const {
    platformKpis,
    inferenceRpm,
    cpuByNode,
    memoryUsage,
    gpuUtilization,
    apiLatency,
    networkThroughput,
    successRate,
    modelServingPerf,
    pods,
    clusterSummary,
    pipelineStages,
    deploymentHistory,
    hpaMetrics,
    podCountOverTime,
    hpaCpuTrend,
    scalingEvents,
    logEntries,
    secrets,
    vaultStatus,
    drStatus,
    backupHistory,
    alerts,
    modelOps,
    modelVersions,
    architectureNodes,
    architectureEdges,
  } = snapshot ?? STATIC_DEFAULT;

  const gpuKpi = platformKpis.find((k) => k.id === "gpu");
  const gpuGaugeValue = gpuKpi
    ? parseInt(gpuKpi.value, 10) || 78
    : 78;

  const demoMessage = snapshot?.demoMode?.message;
  const updatedAt = snapshot?.updatedAt;
  return (
    <DashboardLayout title="Observability Dashboard">
      <div className="-m-4 min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-100 lg:-m-6 lg:p-6">
        <header className="mb-6 flex flex-col gap-2 border-b border-slate-700/50 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">
                Platform Health Overview
              </h1>
              <HealthIndicator status="healthy" />
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Centralized monitoring for DevOps, SRE, and MLOps operations
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={demoLoading}
              onClick={toggleDemoMode}
              className={
                demoActive
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                  : "border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
              }
            >
              {demoActive ? (
                <Square className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
              {demoLoading
                ? "Loading..."
                : demoActive
                  ? "Stop Demo Mode"
                  : "Demo Mode"}
            </Button>
            <div
              className={
                demoActive
                  ? "flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-400"
                  : "flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400"
              }
            >
              <span
                className={
                  demoActive
                    ? "size-2 animate-pulse rounded-full bg-amber-400"
                    : "size-2 animate-pulse rounded-full bg-emerald-400"
                }
              />
              {demoActive
                ? demoMessage ?? "Demo scaling active"
                : updatedAt
                  ? `Live — ${new Date(updatedAt).toLocaleTimeString()}`
                  : "Live — Last updated just now"}
            </div>
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {platformKpis.map((kpi) => (
            <ObservabilityMetricCard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        <div className="mt-6 space-y-6">
          <ObservabilitySection>
            <SectionHeader
              icon={LineChart}
              title="Grafana Monitoring"
              description="Infrastructure and application metrics — Prometheus data source"
            />
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <MonitoringChart
                title="Inference Requests / min"
                data={inferenceRpm}
                type="area"
                color="#22d3ee"
                unit=" req"
              />
              <MonitoringChart
                title="CPU Utilization (Nodes)"
                data={cpuByNode}
                label="node-pool-a"
                label2="node-pool-b"
                color="#22d3ee"
                color2="#a78bfa"
              />
              <MonitoringChart
                title="Memory Consumption"
                data={memoryUsage}
                type="area"
                color="#a78bfa"
                unit="%"
              />
              <GpuGauge value={gpuGaugeValue} />
              <MonitoringChart
                title="GPU Utilization Trend"
                data={gpuUtilization}
                type="area"
                color="#fbbf24"
                unit="%"
              />
              <MonitoringChart
                title="API Response Latency"
                data={apiLatency}
                color="#f472b6"
                unit="ms"
              />
              <MonitoringChart
                title="Network Throughput"
                data={networkThroughput}
                type="area"
                color="#34d399"
                unit=" Mbps"
              />
              <MonitoringChart
                title="Request Success Rate"
                data={successRate}
                color="#34d399"
                unit="%"
              />
              <MonitoringChart
                title="Model Serving Performance"
                data={modelServingPerf}
                type="bar"
                color="#818cf8"
                unit=" req/min"
                className="lg:col-span-2"
              />
            </div>
          </ObservabilitySection>

          <ObservabilitySection>
            <SectionHeader
              icon={Boxes}
              title="Kubernetes Cluster Monitoring"
              description="Container infrastructure state and topology"
            />
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: "Nodes", value: clusterSummary.nodes },
                { label: "Deployments", value: clusterSummary.deployments },
                { label: "Services", value: clusterSummary.services },
                { label: "Ingress", value: clusterSummary.ingress },
                { label: "Namespaces", value: clusterSummary.namespaces },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3 text-center"
                >
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
            <PodTable pods={pods} />
            <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <p className="mb-3 text-sm font-medium text-slate-300">
                Request Flow Topology
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                {[
                  "Load Balancer",
                  "→",
                  "API Gateway",
                  "→",
                  "Service",
                  "→",
                  "Deployment",
                  "→",
                  "Pods",
                ].map((item) =>
                  item === "→" ? (
                    <span key={item} className="text-cyan-500">
                      →
                    </span>
                  ) : (
                    <span
                      key={item}
                      className="rounded border border-slate-600/50 bg-slate-700/50 px-3 py-1.5 text-slate-300"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </ObservabilitySection>

          <ObservabilitySection>
            <SectionHeader
              icon={GitBranch}
              title="CI/CD Pipeline Activity"
              description="Jenkins pipeline — genaihub-prod-deploy #847"
            />
            <DeploymentTimeline stages={pipelineStages} />
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-700/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700/50 hover:bg-transparent">
                    <TableHead className="text-slate-400">Version</TableHead>
                    <TableHead className="text-slate-400">Deployed</TableHead>
                    <TableHead className="text-slate-400">Duration</TableHead>
                    <TableHead className="text-slate-400">Environment</TableHead>
                    <TableHead className="text-slate-400">Commit</TableHead>
                    <TableHead className="text-slate-400">Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deploymentHistory.map((d) => (
                    <TableRow
                      key={d.version}
                      className="border-slate-700/30 hover:bg-slate-800/50"
                    >
                      <TableCell className="font-mono text-cyan-400">
                        {d.version}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {d.deployedAt}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {d.duration}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {d.environment}
                      </TableCell>
                      <TableCell className="font-mono text-slate-400">
                        {d.commit}
                      </TableCell>
                      <TableCell
                        className={
                          d.outcome === "Success"
                            ? "text-emerald-400"
                            : d.outcome === "Failed"
                              ? "text-red-400"
                              : "text-amber-400"
                        }
                      >
                        {d.outcome}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ObservabilitySection>

          <ObservabilitySection>
            <SectionHeader
              icon={TrendingUp}
              title="Horizontal Pod Autoscaler"
              description="Auto-scaling behavior under varying AI inference workloads"
            />
            <ScalingChart
              podData={podCountOverTime}
              cpuData={hpaCpuTrend}
              targetCpu={hpaMetrics.targetCpu}
              events={scalingEvents}
              metrics={hpaMetrics}
            />
          </ObservabilitySection>

          <ObservabilitySection>
            <SectionHeader
              icon={ScrollText}
              title="Log Analytics (ELK Stack)"
              description="Centralized logging — Elasticsearch, Logstash, Kibana"
            />
            <LogViewer logs={logEntries} />
          </ObservabilitySection>

          <ObservabilitySection>
            <SectionHeader
              icon={KeyRound}
              title="Vault Secret Management"
              description="Secret governance — values never exposed"
            />
            <div className="mb-4 grid gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Vault Status",
                  value: vaultStatus.connected ? "Connected" : "Disconnected",
                  ok: vaultStatus.connected,
                },
                {
                  label: "Rotation Compliance",
                  value: `${vaultStatus.rotationCompliance}%`,
                  ok: vaultStatus.rotationCompliance >= 90,
                },
                {
                  label: "Audit Logging",
                  value: vaultStatus.auditLogging ? "Enabled" : "Disabled",
                  ok: vaultStatus.auditLogging,
                },
                {
                  label: "Last Audit",
                  value: vaultStatus.lastAudit,
                  ok: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3"
                >
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p
                    className={
                      item.ok ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {secrets.map((secret) => (
                <SecretCard key={secret.name} secret={secret} />
              ))}
            </div>
          </ObservabilitySection>

          <ObservabilitySection>
            <SectionHeader
              icon={Cloud}
              title="Disaster Recovery & High Availability"
              description="Multi-region resilience and backup infrastructure"
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                    <p className="text-xs text-slate-500">Primary Region</p>
                    <p className="text-sm font-medium text-white">
                      {drStatus.primaryRegion}
                    </p>
                  </div>
                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
                    <p className="text-xs text-slate-500">Secondary Region</p>
                    <p className="text-sm font-medium text-white">
                      {drStatus.secondaryRegion}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Replication", value: drStatus.replicationStatus },
                    { label: "Backup", value: drStatus.backupHealth },
                    { label: "RPO", value: drStatus.rpo },
                    { label: "RTO", value: drStatus.rto },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3 text-center"
                    >
                      <p className="text-xs text-slate-500">{m.label}</p>
                      <p className="text-sm font-medium text-emerald-400">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Mumbai</p>
                    <p className="mt-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                      Primary
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-500">
                      Sync {drStatus.syncLag}
                    </span>
                    <div className="h-px w-16 bg-cyan-500/50" />
                    <span className="text-cyan-400">⟷</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Singapore</p>
                    <p className="mt-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
                      Standby
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-300">
                  Backup History
                </p>
                <div className="space-y-2">
                  {backupHistory.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/40 px-4 py-2"
                    >
                      <span className="font-mono text-xs text-cyan-400">
                        {b.id}
                      </span>
                      <span className="text-xs text-slate-400">{b.time}</span>
                      <span className="text-xs text-slate-400">{b.size}</span>
                      <span className="text-xs text-emerald-400">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ObservabilitySection>

          <div className="grid gap-6 lg:grid-cols-2">
            <ObservabilitySection>
              <SectionHeader
                icon={AlertTriangle}
                title="Real-Time Alert Center"
                description="Active incidents across the platform"
              />
              <AlertPanel alerts={alerts} />
            </ObservabilitySection>

            <ObservabilitySection>
              <SectionHeader
                icon={BarChart3}
                title="AI Model Operations (MLOps)"
                description="Deployed models, performance, and version management"
              />
              <div className="mb-4">
                <p className="mb-2 text-xs text-slate-500">Version Progression</p>
                <VersionTimeline versions={modelVersions} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {modelOps.map((model) => (
                  <ModelCard key={model.name} {...model} />
                ))}
              </div>
            </ObservabilitySection>
          </div>

          <ObservabilitySection>
            <SectionHeader
              icon={Network}
              title="System Architecture"
              description="End-to-end platform topology — Terraform, Jenkins, K8s, Prometheus, Grafana, ELK, Vault"
            />
            <ArchitectureDiagram
              nodes={architectureNodes}
              edges={architectureEdges}
            />
          </ObservabilitySection>
        </div>

        <footer className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-slate-700/50 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="size-3" /> Vault Secured
          </span>
          <span className="flex items-center gap-1">
            <Layers className="size-3" /> K8s Orchestrated
          </span>
          <span className="flex items-center gap-1">
            <Activity className="size-3" /> Prometheus Metrics
          </span>
          <span>GenAIHub Observability v1.0 — Backend API with auto-scaling demo mode</span>
        </footer>
      </div>
    </DashboardLayout>
  );
}
