export const dashboardMetrics = [
  {
    title: "Total Requests",
    value: "2450",
    description: "Requests processed today",
  },
  {
    title: "Active Models",
    value: "4",
    description: "Available AI models",
  },
  {
    title: "Container Status",
    value: "Running",
    description: "Application containers running",
  },
  {
    title: "System Health",
    value: "99.8%",
    description: "Platform working normally",
  },
];

export const recentActivity = [
  "Request processed",
  "Backend started",
  "Health check completed",
  "Container restarted",
  "New model added",
];

export const systemOverview = [
  { label: "Response Time", value: "42 ms" },
  { label: "Pending Requests", value: "5" },
  { label: "Error Rate", value: "0.1%" },
];

export const serviceStatus = [
  { name: "Frontend", status: "Online" as const },
  { name: "Backend", status: "Online" as const },
  { name: "Database", status: "Online" as const },
  { name: "Monitoring", status: "Online" as const },
];

export const models = [
  { name: "GenAIHub GPT", version: "1.0", status: "Active" as const },
  { name: "GenAIHub Vision", version: "1.0", status: "Active" as const },
  { name: "GenAIHub Code", version: "1.0", status: "Active" as const },
  { name: "GenAIHub Assistant", version: "1.0", status: "Active" as const },
];

export const resourceUsage = [
  { label: "CPU Usage", value: 58 },
  { label: "Memory Usage", value: 72 },
  { label: "Network Usage", value: 41 },
  { label: "Storage Usage", value: 63 },
];

export const monitoringServices = [
  { name: "Frontend", status: "Online" as const },
  { name: "Backend", status: "Online" as const },
  { name: "Database", status: "Online" as const },
  { name: "Monitoring", status: "Online" as const },
];

export const recentLogs = [
  "Service Started",
  "Health Check Passed",
  "Deployment Successful",
];

export type ModelStatus = (typeof models)[number]["status"];
export type ServiceState = (typeof serviceStatus)[number]["status"];
