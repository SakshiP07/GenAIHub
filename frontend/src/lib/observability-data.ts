export type HealthStatus = "healthy" | "warning" | "critical";
export type PodStatus =
  | "Running"
  | "Pending"
  | "Failed"
  | "CrashLoopBackOff"
  | "Terminating";
export type PipelineStageStatus = "success" | "running" | "failed" | "waiting";
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type LogLevel =
  | "info"
  | "warning"
  | "error"
  | "critical"
  | "security"
  | "audit";

export interface PlatformKpi {
  id: string;
  label: string;
  value: string;
  trend: number;
  status: HealthStatus;
  sparkline: number[];
  icon: string;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
  value2?: number;
}

export interface PodRow {
  name: string;
  namespace: string;
  deployment: string;
  status: PodStatus;
  cpu: string;
  memory: string;
  restarts: number;
  uptime: string;
  node: string;
}

export interface PipelineStage {
  name: string;
  status: PipelineStageStatus;
  duration?: string;
}

export interface DeploymentRecord {
  version: string;
  deployedAt: string;
  duration: string;
  environment: string;
  commit: string;
  outcome: "Success" | "Failed" | "Rolled Back";
}

export interface ScalingEvent {
  time: string;
  event: string;
  type: "scale-up" | "scale-down" | "warning" | "traffic";
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
}

export interface SecretMeta {
  name: string;
  status: "active" | "expiring" | "rotated";
  lastRotation: string;
  expiresIn: string;
  accessCount: number;
  policy: string;
  healthScore: number;
}

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  title: string;
  component: string;
  timestamp: string;
  action: string;
}

export interface ModelOpsRow {
  name: string;
  version: string;
  endpoint: string;
  status: HealthStatus;
  traffic: number;
  latency: number;
  accuracy: number;
  isActive: boolean;
}

const spark = (base: number, variance = 8) =>
  Array.from({ length: 12 }, (_, i) =>
    Math.max(0, base + Math.sin(i * 0.9) * variance + (i % 3) * 2)
  );

export const platformKpis: PlatformKpi[] = [
  {
    id: "inference",
    label: "Total Inference Requests",
    value: "2.4M",
    trend: 12.4,
    status: "healthy",
    sparkline: spark(82),
    icon: "zap",
  },
  {
    id: "pods",
    label: "Active Kubernetes Pods",
    value: "47",
    trend: 8.2,
    status: "healthy",
    sparkline: spark(45, 5),
    icon: "boxes",
  },
  {
    id: "gpu",
    label: "GPU Utilization",
    value: "78%",
    trend: -3.1,
    status: "warning",
    sparkline: spark(78, 12),
    icon: "cpu",
  },
  {
    id: "cluster",
    label: "Cluster Health",
    value: "Healthy",
    trend: 0,
    status: "healthy",
    sparkline: spark(95, 3),
    icon: "activity",
  },
  {
    id: "deployments",
    label: "Failed Deployments",
    value: "2",
    trend: -50,
    status: "warning",
    sparkline: spark(4, 6),
    icon: "alert-triangle",
  },
  {
    id: "models",
    label: "Active AI Models",
    value: "6",
    trend: 16.7,
    status: "healthy",
    sparkline: spark(6, 2),
    icon: "brain",
  },
  {
    id: "latency",
    label: "Avg Response Time",
    value: "142ms",
    trend: -8.5,
    status: "healthy",
    sparkline: spark(140, 20),
    icon: "timer",
  },
  {
    id: "availability",
    label: "System Availability",
    value: "99.97%",
    trend: 0.02,
    status: "healthy",
    sparkline: spark(99, 1),
    icon: "shield-check",
  },
  {
    id: "traffic",
    label: "Total API Traffic",
    value: "18.2K/min",
    trend: 22.1,
    status: "healthy",
    sparkline: spark(70, 15),
    icon: "globe",
  },
  {
    id: "resources",
    label: "Resource Consumption",
    value: "64%",
    trend: 5.3,
    status: "warning",
    sparkline: spark(64, 10),
    icon: "gauge",
  },
];

export const inferenceRpm: TimeSeriesPoint[] = [
  { time: "00:00", value: 820 },
  { time: "02:00", value: 640 },
  { time: "04:00", value: 510 },
  { time: "06:00", value: 780 },
  { time: "08:00", value: 1240 },
  { time: "10:00", value: 1680 },
  { time: "12:00", value: 1920 },
  { time: "14:00", value: 2100 },
  { time: "16:00", value: 1850 },
  { time: "18:00", value: 1560 },
  { time: "20:00", value: 1340 },
  { time: "22:00", value: 980 },
];

export const cpuByNode: TimeSeriesPoint[] = [
  { time: "10:00", value: 42, value2: 38 },
  { time: "10:15", value: 48, value2: 41 },
  { time: "10:30", value: 55, value2: 44 },
  { time: "10:45", value: 62, value2: 50 },
  { time: "11:00", value: 58, value2: 47 },
  { time: "11:15", value: 71, value2: 55 },
  { time: "11:30", value: 68, value2: 52 },
  { time: "11:45", value: 64, value2: 49 },
];

export const memoryUsage: TimeSeriesPoint[] = [
  { time: "10:00", value: 58 },
  { time: "10:15", value: 61 },
  { time: "10:30", value: 64 },
  { time: "10:45", value: 67 },
  { time: "11:00", value: 70 },
  { time: "11:15", value: 72 },
  { time: "11:30", value: 69 },
  { time: "11:45", value: 71 },
];

export const gpuUtilization: TimeSeriesPoint[] = [
  { time: "10:00", value: 62 },
  { time: "10:15", value: 68 },
  { time: "10:30", value: 74 },
  { time: "10:45", value: 81 },
  { time: "11:00", value: 78 },
  { time: "11:15", value: 85 },
  { time: "11:30", value: 79 },
  { time: "11:45", value: 76 },
];

export const apiLatency: TimeSeriesPoint[] = [
  { time: "10:00", value: 98 },
  { time: "10:15", value: 112 },
  { time: "10:30", value: 128 },
  { time: "10:45", value: 156 },
  { time: "11:00", value: 142 },
  { time: "11:15", value: 135 },
  { time: "11:30", value: 148 },
  { time: "11:45", value: 138 },
];

export const networkThroughput: TimeSeriesPoint[] = [
  { time: "10:00", value: 420 },
  { time: "10:15", value: 480 },
  { time: "10:30", value: 510 },
  { time: "10:45", value: 590 },
  { time: "11:00", value: 620 },
  { time: "11:15", value: 680 },
  { time: "11:30", value: 640 },
  { time: "11:45", value: 610 },
];

export const successRate: TimeSeriesPoint[] = [
  { time: "10:00", value: 99.2 },
  { time: "10:15", value: 99.4 },
  { time: "10:30", value: 98.8 },
  { time: "10:45", value: 99.6 },
  { time: "11:00", value: 99.7 },
  { time: "11:15", value: 99.5 },
  { time: "11:30", value: 99.8 },
  { time: "11:45", value: 99.9 },
];

export const modelServingPerf: TimeSeriesPoint[] = [
  { time: "GPT-4o", value: 1240 },
  { time: "Claude", value: 980 },
  { time: "Llama-3", value: 760 },
  { time: "Mistral", value: 540 },
  { time: "Embeddings", value: 1820 },
  { time: "Vision", value: 420 },
];

export const pods: PodRow[] = [
  {
    name: "inference-api-7d4f9b-xk2lm",
    namespace: "genaihub-prod",
    deployment: "inference-api",
    status: "Running",
    cpu: "420m",
    memory: "1.2Gi",
    restarts: 0,
    uptime: "4d 12h",
    node: "node-pool-a-1",
  },
  {
    name: "inference-api-7d4f9b-mn8pq",
    namespace: "genaihub-prod",
    deployment: "inference-api",
    status: "Running",
    cpu: "385m",
    memory: "1.1Gi",
    restarts: 1,
    uptime: "4d 12h",
    node: "node-pool-a-2",
  },
  {
    name: "model-worker-gpu-0",
    namespace: "genaihub-prod",
    deployment: "model-worker",
    status: "Running",
    cpu: "2100m",
    memory: "8.4Gi",
    restarts: 0,
    uptime: "2d 6h",
    node: "gpu-node-1",
  },
  {
    name: "vector-db-0",
    namespace: "genaihub-data",
    deployment: "vector-db",
    status: "Running",
    cpu: "680m",
    memory: "4.2Gi",
    restarts: 0,
    uptime: "14d 3h",
    node: "node-pool-b-1",
  },
  {
    name: "api-gateway-5c8d7",
    namespace: "genaihub-prod",
    deployment: "api-gateway",
    status: "Running",
    cpu: "120m",
    memory: "256Mi",
    restarts: 0,
    uptime: "7d 1h",
    node: "node-pool-a-1",
  },
  {
    name: "embedding-svc-9xk2",
    namespace: "genaihub-prod",
    deployment: "embedding-svc",
    status: "CrashLoopBackOff",
    cpu: "0m",
    memory: "0Mi",
    restarts: 14,
    uptime: "12m",
    node: "node-pool-a-3",
  },
  {
    name: "batch-job-7h2k",
    namespace: "genaihub-jobs",
    deployment: "batch-processor",
    status: "Pending",
    cpu: "-",
    memory: "-",
    restarts: 0,
    uptime: "-",
    node: "unscheduled",
  },
];

export const clusterSummary = {
  nodes: 6,
  deployments: 18,
  services: 24,
  ingress: 4,
  namespaces: 5,
};

export const pipelineStages: PipelineStage[] = [
  { name: "Source Checkout", status: "success", duration: "12s" },
  { name: "Build", status: "success", duration: "2m 14s" },
  { name: "Unit Testing", status: "success", duration: "1m 48s" },
  { name: "Security Scanning", status: "success", duration: "3m 22s" },
  { name: "Docker Image Build", status: "running", duration: "1m 05s" },
  { name: "Docker Registry Push", status: "waiting" },
  { name: "Kubernetes Deployment", status: "waiting" },
  { name: "Post-Deployment Validation", status: "waiting" },
];

export const deploymentHistory: DeploymentRecord[] = [
  {
    version: "v2.4.1",
    deployedAt: "2026-06-19 14:32 UTC",
    duration: "8m 42s",
    environment: "production",
    commit: "a3f8c21",
    outcome: "Success",
  },
  {
    version: "v2.4.0",
    deployedAt: "2026-06-18 09:15 UTC",
    duration: "9m 18s",
    environment: "production",
    commit: "7b2e904",
    outcome: "Success",
  },
  {
    version: "v2.3.9-hotfix",
    deployedAt: "2026-06-17 22:48 UTC",
    duration: "6m 05s",
    environment: "staging",
    commit: "c91d4fa",
    outcome: "Rolled Back",
  },
  {
    version: "v2.3.8",
    deployedAt: "2026-06-16 16:20 UTC",
    duration: "11m 33s",
    environment: "production",
    commit: "e44a102",
    outcome: "Failed",
  },
];

export const hpaMetrics = {
  currentPods: 12,
  minReplicas: 3,
  maxReplicas: 20,
  desiredReplicas: 14,
  targetCpu: 70,
  currentCpu: 82,
};

export const podCountOverTime: TimeSeriesPoint[] = [
  { time: "10:00", value: 6 },
  { time: "10:10", value: 6 },
  { time: "10:20", value: 8 },
  { time: "10:30", value: 10 },
  { time: "10:40", value: 12 },
  { time: "10:50", value: 14 },
  { time: "11:00", value: 12 },
  { time: "11:10", value: 12 },
];

export const hpaCpuTrend: TimeSeriesPoint[] = [
  { time: "10:00", value: 45 },
  { time: "10:10", value: 52 },
  { time: "10:20", value: 68 },
  { time: "10:30", value: 78 },
  { time: "10:40", value: 85 },
  { time: "10:50", value: 82 },
  { time: "11:00", value: 74 },
  { time: "11:10", value: 71 },
];

export const scalingEvents: ScalingEvent[] = [
  {
    time: "11:02:14",
    event: "Traffic spike detected — 2.1x baseline inference load",
    type: "traffic",
  },
  {
    time: "11:02:18",
    event: "HPA triggered scale-up: 8 → 12 pods (CPU 82% > 70%)",
    type: "scale-up",
  },
  {
    time: "10:48:32",
    event: "Memory pressure warning on gpu-node-1 (87%)",
    type: "warning",
  },
  {
    time: "10:35:10",
    event: "Scale-down: 14 → 12 pods after load normalization",
    type: "scale-down",
  },
  {
    time: "10:12:44",
    event: "HPA scale-up: 6 → 8 pods (request queue depth > 50)",
    type: "scale-up",
  },
];

export const logEntries: LogEntry[] = [
  {
    id: "1",
    timestamp: "2026-06-19T18:42:01.234Z",
    level: "info",
    service: "inference-api",
    message: "Model gpt-4o-v2.4 loaded successfully on gpu-node-1",
  },
  {
    id: "2",
    timestamp: "2026-06-19T18:41:58.891Z",
    level: "info",
    service: "inference-api",
    message: "Inference request completed — 256 tokens, 142ms latency",
  },
  {
    id: "3",
    timestamp: "2026-06-19T18:41:55.102Z",
    level: "warning",
    service: "hpa-controller",
    message: "CPU utilization 82% exceeds target threshold 70%",
  },
  {
    id: "4",
    timestamp: "2026-06-19T18:41:52.445Z",
    level: "error",
    service: "embedding-svc",
    message: "Pod embedding-svc-9xk2 CrashLoopBackOff — exit code 137 OOMKilled",
  },
  {
    id: "5",
    timestamp: "2026-06-19T18:41:48.330Z",
    level: "security",
    service: "auth-gateway",
    message: "Failed authentication attempt from 203.0.113.42 — rate limited",
  },
  {
    id: "6",
    timestamp: "2026-06-19T18:41:44.218Z",
    level: "audit",
    service: "vault",
    message: "Secret JWT_SECRET accessed by inference-api service account",
  },
  {
    id: "7",
    timestamp: "2026-06-19T18:41:40.991Z",
    level: "info",
    service: "jenkins",
    message: "Pipeline genaihub-prod-deploy #847 — Docker image build started",
  },
  {
    id: "8",
    timestamp: "2026-06-19T18:41:36.774Z",
    level: "critical",
    service: "prometheus",
    message: "Alert firing: HighGPUUtilization — gpu-node-1 at 91%",
  },
  {
    id: "9",
    timestamp: "2026-06-19T18:41:32.556Z",
    level: "info",
    service: "k8s-scheduler",
    message: "Scaled deployment inference-api to 12 replicas",
  },
  {
    id: "10",
    timestamp: "2026-06-19T18:41:28.339Z",
    level: "warning",
    service: "vector-db",
    message: "Replication lag 2.3s on secondary shard — within tolerance",
  },
];

export const secrets: SecretMeta[] = [
  {
    name: "DATABASE_URL",
    status: "active",
    lastRotation: "2026-05-15",
    expiresIn: "45 days",
    accessCount: 1240,
    policy: "db-readonly",
    healthScore: 98,
  },
  {
    name: "JWT_SECRET",
    status: "active",
    lastRotation: "2026-06-01",
    expiresIn: "89 days",
    accessCount: 8420,
    policy: "auth-service",
    healthScore: 100,
  },
  {
    name: "OPENAI_API_KEY",
    status: "expiring",
    lastRotation: "2026-03-20",
    expiresIn: "12 days",
    accessCount: 45200,
    policy: "inference-api",
    healthScore: 72,
  },
  {
    name: "VECTOR_DB_TOKEN",
    status: "active",
    lastRotation: "2026-05-28",
    expiresIn: "62 days",
    accessCount: 3180,
    policy: "vector-db",
    healthScore: 95,
  },
  {
    name: "CLOUD_CREDENTIALS",
    status: "active",
    lastRotation: "2026-04-10",
    expiresIn: "120 days",
    accessCount: 890,
    policy: "terraform-deploy",
    healthScore: 92,
  },
  {
    name: "KUBERNETES_ACCESS_TOKEN",
    status: "rotated",
    lastRotation: "2026-06-19",
    expiresIn: "180 days",
    accessCount: 2100,
    policy: "jenkins-cicd",
    healthScore: 100,
  },
];

export const vaultStatus = {
  connected: true,
  rotationCompliance: 94,
  auditLogging: true,
  lastAudit: "2 min ago",
};

export const drStatus = {
  primaryRegion: "ap-south-1 (Mumbai)",
  secondaryRegion: "ap-southeast-1 (Singapore)",
  replicationStatus: "Synchronized",
  backupHealth: "Healthy",
  rpo: "15 min",
  rto: "45 min",
  lastBackup: "2026-06-19 18:30 UTC",
  syncLag: "1.2s",
};

export const backupHistory = [
  { id: "snap-8842", time: "18:30 UTC", size: "42 GB", status: "Completed" },
  { id: "snap-8841", time: "12:30 UTC", size: "41 GB", status: "Completed" },
  { id: "snap-8840", time: "06:30 UTC", size: "40 GB", status: "Completed" },
];

export const alerts: AlertItem[] = [
  {
    id: "a1",
    severity: "critical",
    title: "High GPU utilization on gpu-node-1",
    component: "gpu-node-1 / model-worker",
    timestamp: "2 min ago",
    action: "Consider scaling GPU node pool or throttling batch jobs",
  },
  {
    id: "a2",
    severity: "high",
    title: "Pod CrashLoopBackOff — embedding-svc-9xk2",
    component: "genaihub-prod / embedding-svc",
    timestamp: "8 min ago",
    action: "Review memory limits and recent deployment changes",
  },
  {
    id: "a3",
    severity: "medium",
    title: "API latency P95 exceeded 200ms threshold",
    component: "inference-api",
    timestamp: "15 min ago",
    action: "Check HPA scaling and model cache hit rate",
  },
  {
    id: "a4",
    severity: "medium",
    title: "OPENAI_API_KEY expiring in 12 days",
    component: "Vault / inference-api",
    timestamp: "1 hr ago",
    action: "Schedule secret rotation via Vault policy",
  },
  {
    id: "a5",
    severity: "low",
    title: "Unusual inference pattern detected",
    component: "anomaly-detector",
    timestamp: "2 hr ago",
    action: "Review traffic source and model routing rules",
  },
];

export const modelOps: ModelOpsRow[] = [
  {
    name: "GenAIHub GPT",
    version: "v2.4.1",
    endpoint: "/v1/chat/completions",
    status: "healthy",
    traffic: 62,
    latency: 128,
    accuracy: 96.2,
    isActive: true,
  },
  {
    name: "GenAIHub Vision",
    version: "v2.0.0",
    endpoint: "/v1/vision/analyze",
    status: "healthy",
    traffic: 18,
    latency: 245,
    accuracy: 94.8,
    isActive: true,
  },
  {
    name: "GenAIHub Code",
    version: "v1.8.2",
    endpoint: "/v1/code/generate",
    status: "warning",
    traffic: 12,
    latency: 186,
    accuracy: 91.5,
    isActive: true,
  },
  {
    name: "GenAIHub Embeddings",
    version: "v1.2.0",
    endpoint: "/v1/embeddings",
    status: "critical",
    traffic: 0,
    latency: 0,
    accuracy: 0,
    isActive: false,
  },
];

export const modelVersions = [
  { version: "v1.0", date: "2026-01-15", status: "deprecated" },
  { version: "v1.1", date: "2026-03-02", status: "deprecated" },
  { version: "v2.0", date: "2026-05-10", status: "canary" },
  { version: "v2.4.1", date: "2026-06-19", status: "production" },
];

export const architectureNodes = [
  { id: "users", label: "Users & Apps", type: "source" },
  { id: "lb", label: "Load Balancer", type: "infra" },
  { id: "gateway", label: "API Gateway", type: "infra" },
  { id: "k8s", label: "Kubernetes Cluster", type: "compute" },
  { id: "inference", label: "AI Inference", type: "ai" },
  { id: "vectordb", label: "Vector DB", type: "data" },
  { id: "prometheus", label: "Prometheus", type: "monitor" },
  { id: "grafana", label: "Grafana", type: "monitor" },
  { id: "elk", label: "ELK Stack", type: "logs" },
  { id: "vault", label: "Vault", type: "security" },
  { id: "jenkins", label: "Jenkins CI/CD", type: "cicd" },
  { id: "terraform", label: "Terraform", type: "iac" },
];

export const architectureEdges = [
  ["users", "lb"],
  ["lb", "gateway"],
  ["gateway", "k8s"],
  ["k8s", "inference"],
  ["inference", "vectordb"],
  ["k8s", "prometheus"],
  ["prometheus", "grafana"],
  ["k8s", "elk"],
  ["vault", "k8s"],
  ["jenkins", "k8s"],
  ["terraform", "k8s"],
];
