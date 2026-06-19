const baseData = require("../models/observabilityData");

const HPA = {
  minReplicas: 3,
  maxReplicas: 100,
  targetCpu: 70,
};

const REQUESTS_PER_POD = 150;
const BASE_PODS = () => baseData.hpaMetrics.currentPods;

let demoState = {
  active: false,
  tick: 0,
  requestCount: 0,
  currentPods: 12,
  desiredReplicas: 14,
  currentCpu: 82,
  gpuValue: 78,
  loadFactor: 1,
  intervalId: null,
  scalingEvents: [],
  extraLogs: [],
  lastScaleTick: 0,
};

let responseCache = null;
let cacheTimestamp = 0;
const CACHE_MS = 400;

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowTime() {
  return new Date().toISOString().slice(11, 19);
}

function formatPods(count) {
  return String(count);
}

function formatTraffic(rpm) {
  if (rpm >= 1000) return `${(rpm / 1000).toFixed(1)}K/min`;
  return `${rpm}/min`;
}

function scaleInferenceSeries(series, factor) {
  return series.map((point) => ({
    ...point,
    value: Math.round(point.value * factor),
    ...(point.value2 !== undefined
      ? { value2: Math.round(point.value2 * factor) }
      : {}),
  }));
}

function buildExtraPods(count) {
  const pods = [];
  for (let i = 0; i < count; i += 1) {
    pods.push({
      name: `inference-api-demo-${demoState.tick}-${i}`,
      namespace: "genaihub-prod",
      deployment: "inference-api",
      status: "Running",
      cpu: `${300 + (i % 5) * 40}m`,
      memory: `${1 + (i % 3) * 0.1}Gi`,
      restarts: 0,
      uptime: `${demoState.tick * 2}s`,
      node: `node-pool-a-${(i % 3) + 1}`,
    });
  }
  return pods;
}

function getPodProgress() {
  const base = BASE_PODS();
  const range = HPA.maxReplicas - base;
  if (range <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, (demoState.currentPods - base) / range));
}

function updateDemoMetrics() {
  if (!demoState.active) {
    return;
  }

  const progress = getPodProgress();

  // CPU drops as pods absorb load (HPA spreading traffic)
  demoState.currentCpu = Math.round(86 - progress * 50);

  // GPU climbs slowly with pod count — critical only near max capacity
  demoState.gpuValue = Math.round(40 + progress * 56);
}

function getGpuHealthStatus() {
  const progress = getPodProgress();
  if (demoState.currentPods >= 98 || demoState.gpuValue >= 93) {
    return "critical";
  }
  if (progress >= 0.72 || demoState.gpuValue >= 78) {
    return "warning";
  }
  return "healthy";
}

function getCpuHealthStatus() {
  const progress = getPodProgress();
  if (demoState.currentCpu >= 90 && progress < 0.25) {
    return "warning";
  }
  if (demoState.currentCpu >= 80 && progress < 0.1) {
    return "warning";
  }
  return "healthy";
}

function trackDemoRequests(count = 1) {
  if (!demoState.active) {
    return;
  }

  demoState.requestCount += count;

  const targetPods = Math.min(
    HPA.maxReplicas,
    BASE_PODS() + Math.floor(demoState.requestCount / REQUESTS_PER_POD)
  );

  if (targetPods > demoState.currentPods) {
    const prevPods = demoState.currentPods;
    demoState.currentPods = targetPods;
    demoState.desiredReplicas = targetPods;

    demoState.scalingEvents.unshift({
      time: nowTime(),
      event: `HPA scale-up: ${prevPods} → ${targetPods} pods (${demoState.requestCount.toLocaleString()} reqs — ${REQUESTS_PER_POD} req/pod)`,
      type: "scale-up",
    });

    demoState.extraLogs.unshift({
      id: `demo-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: "info",
      service: "k8s-scheduler",
      message: `Auto-scaled to ${targetPods} pods — CPU load distributing across cluster`,
    });

    if (demoState.scalingEvents.length > 15) {
      demoState.scalingEvents.length = 15;
    }
    if (demoState.extraLogs.length > 20) {
      demoState.extraLogs.length = 20;
    }
  }

  updateDemoMetrics();
  responseCache = null;
}

function autoScale() {

  if (
    demoState.currentCpu < 55 &&
    demoState.currentPods > HPA.minReplicas &&
    demoState.tick - demoState.lastScaleTick > 5
  ) {
    demoState.currentPods = Math.max(
      HPA.minReplicas,
      demoState.currentPods - 1
    );
    demoState.desiredReplicas = demoState.currentPods;
    demoState.lastScaleTick = demoState.tick;
    demoState.scalingEvents.unshift({
      time: nowTime(),
      event: `HPA scale-down: ${prevPods} → ${demoState.currentPods} pods after load normalization`,
      type: "scale-down",
    });
    responseCache = null;
  }
}

function tickDemo() {
  demoState.tick += 1;
  demoState.loadFactor = Math.min(3.5, 1 + demoState.tick * 0.04);
  updateDemoMetrics();

  if (demoState.tick % 2 === 0) {
    const rpm = Math.round(1200 * demoState.loadFactor);
    demoState.extraLogs.unshift({
      id: `demo-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: getCpuHealthStatus() === "warning" ? "warning" : "info",
      service: "inference-api",
      message: `Demo traffic — ${rpm} req/min · ${demoState.currentPods} pods · CPU ${demoState.currentCpu}% · GPU ${demoState.gpuValue}%`,
    });
    trackDemoRequests(Math.max(1, Math.round(rpm / 30)));
  }

  if (demoState.tick % 4 === 0 && getPodProgress() < 0.85) {
    demoState.scalingEvents.unshift({
      time: nowTime(),
      event: `Traffic rising — CPU ${demoState.currentCpu}% falling as ${demoState.currentPods} pods absorb load`,
      type: "traffic",
    });
  }

  responseCache = null;
}

function startDemo() {
  if (demoState.active) {
    return getDemoStatus();
  }

  demoState = {
    active: true,
    tick: 0,
    requestCount: 0,
    currentPods: baseData.hpaMetrics.currentPods,
    desiredReplicas: baseData.hpaMetrics.desiredReplicas,
    currentCpu: baseData.hpaMetrics.currentCpu,
    gpuValue: 78,
    loadFactor: 1,
    intervalId: null,
    scalingEvents: [],
    extraLogs: [],
    lastScaleTick: 0,
  };

  demoState.intervalId = setInterval(tickDemo, 2000);
  updateDemoMetrics();
  tickDemo();
  return getDemoStatus();
}

function stopDemo() {
  if (demoState.intervalId) {
    clearInterval(demoState.intervalId);
    demoState.intervalId = null;
  }
  demoState.active = false;
  demoState.tick = 0;
  responseCache = null;
  return getDemoStatus();
}

function getDemoStatus() {
  const requestsUntilNextPod =
    REQUESTS_PER_POD - (demoState.requestCount % REQUESTS_PER_POD);

  return {
    active: demoState.active,
    tick: demoState.tick,
    requestCount: demoState.requestCount,
    requestsPerPod: REQUESTS_PER_POD,
    requestsUntilNextPod:
      demoState.currentPods >= HPA.maxReplicas ? 0 : requestsUntilNextPod,
    currentPods: demoState.currentPods,
    desiredReplicas: demoState.desiredReplicas,
    currentCpu: demoState.currentCpu,
    gpuValue: demoState.gpuValue,
    loadFactor: Number(demoState.loadFactor.toFixed(2)),
    autoScaling: demoState.active,
    message: demoState.active
      ? `Demo — ${demoState.currentPods}/${HPA.maxReplicas} pods · ${demoState.requestCount.toLocaleString()} reqs · ${REQUESTS_PER_POD} req = 1 pod`
      : "Demo mode inactive",
  };
}

function applyDemoTransforms(snapshot) {
  const factor = demoState.loadFactor;
  const extraPodCount = Math.max(0, demoState.currentPods - baseData.hpaMetrics.currentPods);

  snapshot.platformKpis = snapshot.platformKpis.map((kpi) => {
    if (kpi.id === "inference") {
      const totalReqs = demoState.requestCount;
      const display =
        totalReqs >= 1_000_000
          ? `${(totalReqs / 1_000_000).toFixed(1)}M`
          : totalReqs >= 1000
            ? `${(totalReqs / 1000).toFixed(1)}K`
            : String(totalReqs);
      return {
        ...kpi,
        value: display,
        trend: 12.4 + demoState.tick * 2,
        status: factor > 2.5 ? "warning" : "healthy",
      };
    }
    if (kpi.id === "pods") {
      const progress = getPodProgress();
      return {
        ...kpi,
        value: formatPods(demoState.currentPods),
        trend: 8.2 + demoState.tick * 0.5,
        status:
          demoState.currentPods >= 98
            ? "critical"
            : progress >= 0.75
              ? "warning"
              : "healthy",
      };
    }
    if (kpi.id === "gpu") {
      return {
        ...kpi,
        value: `${demoState.gpuValue}%`,
        status: getGpuHealthStatus(),
      };
    }
    if (kpi.id === "cluster") {
      const progress = getPodProgress();
      return {
        ...kpi,
        value: progress >= 0.95 ? "Stressed" : progress >= 0.7 ? "Stable" : "Healthy",
        status:
          demoState.currentPods >= 98
            ? "critical"
            : progress >= 0.75
              ? "warning"
              : "healthy",
      };
    }
    if (kpi.id === "latency") {
      const latency = Math.round(142 * (0.8 + factor * 0.25));
      return {
        ...kpi,
        value: `${latency}ms`,
        status: latency > 200 ? "warning" : "healthy",
      };
    }
    if (kpi.id === "traffic") {
      const rpm = Math.round(18200 * factor);
      return { ...kpi, value: formatTraffic(rpm), trend: 22.1 + demoState.tick * 3 };
    }
    if (kpi.id === "resources") {
      const pct = Math.round(
        demoState.currentCpu * 0.45 + demoState.gpuValue * 0.55
      );
      const progress = getPodProgress();
      return {
        ...kpi,
        value: `${pct}%`,
        status:
          progress >= 0.95
            ? "critical"
            : progress >= 0.72
              ? "warning"
              : "healthy",
      };
    }
    return kpi;
  });

  const progress = getPodProgress();
  const cpuScale = 1 - progress * 0.42;
  const gpuScale = 0.55 + progress * 0.48;

  snapshot.inferenceRpm = scaleInferenceSeries(snapshot.inferenceRpm, factor);
  snapshot.cpuByNode = snapshot.cpuByNode.map((p) => ({
    ...p,
    value: Math.max(18, Math.round(p.value * cpuScale)),
    ...(p.value2 !== undefined
      ? { value2: Math.max(15, Math.round(p.value2 * cpuScale)) }
      : {}),
  }));
  snapshot.memoryUsage = snapshot.memoryUsage.map((p, i) => ({
    ...p,
    value: Math.min(92, Math.round(p.value + progress * 22 + i * 0.5)),
  }));
  snapshot.gpuUtilization = snapshot.gpuUtilization.map((p) => ({
    ...p,
    value: Math.min(97, Math.round(p.value * gpuScale)),
  }));
  snapshot.apiLatency = snapshot.apiLatency.map((p) => ({
    ...p,
    value: Math.round(p.value * (0.85 + factor * 0.2)),
  }));
  snapshot.networkThroughput = scaleInferenceSeries(snapshot.networkThroughput, factor);

  snapshot.hpaMetrics = {
    ...snapshot.hpaMetrics,
    currentPods: demoState.currentPods,
    desiredReplicas: demoState.desiredReplicas,
    maxReplicas: HPA.maxReplicas,
    currentCpu: demoState.currentCpu,
  };

  const lastPodPoint = snapshot.podCountOverTime[snapshot.podCountOverTime.length - 1];
  snapshot.podCountOverTime = [
    ...snapshot.podCountOverTime.slice(0, -1),
    { ...lastPodPoint, value: demoState.currentPods - 2 },
    {
      time: nowTime().slice(0, 5),
      value: demoState.currentPods,
    },
  ];

  const lastCpuPoint = snapshot.hpaCpuTrend[snapshot.hpaCpuTrend.length - 1];
  snapshot.hpaCpuTrend = [
    ...snapshot.hpaCpuTrend.slice(0, -1),
    { ...lastCpuPoint, value: demoState.currentCpu - 4 },
    { time: nowTime().slice(0, 5), value: demoState.currentCpu },
  ];

  snapshot.scalingEvents = [
    ...demoState.scalingEvents,
    ...snapshot.scalingEvents,
  ].slice(0, 10);

  snapshot.pods = [
    ...buildExtraPods(Math.min(extraPodCount, 10)),
    ...snapshot.pods,
  ];

  snapshot.logEntries = [...demoState.extraLogs, ...snapshot.logEntries].slice(0, 25);

  snapshot.clusterSummary = {
    ...snapshot.clusterSummary,
    deployments: snapshot.clusterSummary.deployments + Math.floor(extraPodCount / 2),
  };

  if (demoState.currentPods >= 95) {
    snapshot.alerts = [
      {
        id: `demo-alert-${demoState.tick}`,
        severity: demoState.currentPods >= 98 ? "critical" : "high",
        title:
          demoState.currentPods >= 98
            ? "Cluster near capacity — GPU saturation at max pods"
            : "High pod count — GPU utilization rising",
        component: "inference-api / gpu-node-1",
        timestamp: "just now",
        action: `At ${demoState.currentPods}/${HPA.maxReplicas} pods — CPU ${demoState.currentCpu}% · GPU ${demoState.gpuValue}%`,
      },
      ...snapshot.alerts,
    ].slice(0, 8);
  }

  snapshot.modelServingPerf = snapshot.modelServingPerf.map((m) => ({
    ...m,
    value: Math.round(m.value * factor),
  }));

  return snapshot;
}

function getObservabilityData() {
  if (demoState.active) {
    trackDemoRequests(1);
  }

  const now = Date.now();
  if (
    !demoState.active &&
    responseCache &&
    now - cacheTimestamp < CACHE_MS
  ) {
    return responseCache;
  }

  const snapshot = {
    platformKpis: deepClone(baseData.platformKpis),
    inferenceRpm: deepClone(baseData.inferenceRpm),
    cpuByNode: deepClone(baseData.cpuByNode),
    memoryUsage: deepClone(baseData.memoryUsage),
    gpuUtilization: deepClone(baseData.gpuUtilization),
    apiLatency: deepClone(baseData.apiLatency),
    networkThroughput: deepClone(baseData.networkThroughput),
    successRate: deepClone(baseData.successRate),
    modelServingPerf: deepClone(baseData.modelServingPerf),
    pods: deepClone(baseData.pods),
    clusterSummary: deepClone(baseData.clusterSummary),
    pipelineStages: deepClone(baseData.pipelineStages),
    deploymentHistory: deepClone(baseData.deploymentHistory),
    hpaMetrics: deepClone(baseData.hpaMetrics),
    podCountOverTime: deepClone(baseData.podCountOverTime),
    hpaCpuTrend: deepClone(baseData.hpaCpuTrend),
    scalingEvents: deepClone(baseData.scalingEvents),
    logEntries: deepClone(baseData.logEntries),
    secrets: deepClone(baseData.secrets),
    vaultStatus: deepClone(baseData.vaultStatus),
    drStatus: deepClone(baseData.drStatus),
    backupHistory: deepClone(baseData.backupHistory),
    alerts: deepClone(baseData.alerts),
    modelOps: deepClone(baseData.modelOps),
    modelVersions: deepClone(baseData.modelVersions),
    architectureNodes: deepClone(baseData.architectureNodes),
    architectureEdges: deepClone(baseData.architectureEdges),
    demoMode: getDemoStatus(),
    updatedAt: new Date().toISOString(),
  };

  if (demoState.active) {
    applyDemoTransforms(snapshot);
    snapshot.demoMode = getDemoStatus();
  }

  responseCache = snapshot;
  cacheTimestamp = now;
  return snapshot;
}

module.exports = {
  getObservabilityData,
  startDemo,
  stopDemo,
  getDemoStatus,
};
