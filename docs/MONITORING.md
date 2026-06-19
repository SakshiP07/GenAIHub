# GenAIHub Monitoring Setup

Prometheus and Grafana connected to the **genaihub-devops-project** Docker Compose stack.

## What This Monitors

| Target | Tool | Metrics |
|--------|------|---------|
| `genaihub-frontend` container | cAdvisor | CPU, memory, container status |
| `genaihub-backend` container | cAdvisor | CPU, memory, container status |
| Frontend `http://frontend:3000` | Blackbox Exporter | HTTP health (probe_success) |
| Backend `http://backend:5000/health` | Blackbox Exporter | HTTP health (probe_success) |
| Docker host | Node Exporter | Host CPU and memory |

## Architecture

```
genaihub-devops-project (Docker Compose)
├── genaihub-frontend
├── genaihub-backend
├── genaihub-prometheus   → scrapes metrics
├── genaihub-grafana      → shows dashboards
├── genaihub-cadvisor     → container metrics
├── genaihub-node-exporter
└── genaihub-blackbox-exporter → HTTP health checks
```

All services share the **genaihub-network** network.

## Start Everything

From the project root:

```bash
cd GenAIHub-DevOps-Project

# Start app + monitoring together
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d --build
```

## Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000/health |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 (admin / admin) |
| cAdvisor | http://localhost:8080 |

## Verify Prometheus Targets

1. Open http://localhost:9090/targets
2. All jobs should show **UP**:
   - prometheus
   - node-exporter
   - cadvisor
   - blackbox-exporter
   - genaihub-health

## Grafana Dashboard

1. Open http://localhost:3001
2. Login: `admin` / `admin`
3. Go to **Dashboards → GenAIHub → GenAIHub Docker Monitoring**

Panels:
- CPU Usage (GenAIHub Containers)
- Memory Usage (GenAIHub Containers)
- Container Status
- Service Health (Frontend & Backend)

## Useful Prometheus Queries

```promql
# Container CPU for GenAIHub project
rate(container_cpu_usage_seconds_total{container_label_com_docker_compose_project="genaihub-devops-project"}[5m])

# Container memory in MB
container_memory_usage_bytes{container_label_com_docker_compose_project="genaihub-devops-project"} / 1024 / 1024

# Health check (1 = healthy, 0 = down)
probe_success{project="genaihub-devops-project"}
```

## Stop Services

```bash
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml down
```

## Viva Answers

**What is Prometheus?**  
Prometheus collects and stores metrics from applications and containers.

**What is Grafana?**  
Grafana connects to Prometheus and displays metrics on dashboards.

**How is monitoring connected to Docker?**  
cAdvisor reads Docker container stats. Prometheus scrapes cAdvisor. Blackbox Exporter checks if frontend and backend URLs respond. Grafana visualizes all metrics.

**Project name:** `genaihub-devops-project`  
**Containers monitored:** `genaihub-frontend`, `genaihub-backend`

## Deliverables Mapping

| Expected Deliverable | This Project |
|---------------------|--------------|
| Dockerized AI services | frontend + backend containers |
| Monitoring systems | Prometheus + Grafana + cAdvisor |
| Operational excellence | Health probes + dashboards |
| Scalability demo | Docker Compose + Kubernetes manifests |
