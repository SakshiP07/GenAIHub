# GenAIHub Monitoring

Monitoring stack for the **genaihub-devops-project** Docker Compose project.

## Recommended: Run with App Stack

From project root (monitors `genaihub-frontend` and `genaihub-backend`):

```bash
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d --build
```

## Standalone (app must already be running)

```bash
cd monitoring
docker compose up -d
```

Uses external network `genaihub-devops-project_genaihub-network`.

## URLs

| Service | URL |
|---------|-----|
| Grafana | http://localhost:3001 (admin / admin) |
| Prometheus | http://localhost:9090 |
| cAdvisor | http://localhost:8080 |

Full guide: [docs/MONITORING.md](../docs/MONITORING.md)

## Viva Answer

**Prometheus collects metrics and Grafana visualizes them.**

Metrics come from Docker containers in the `genaihub-devops-project` stack via cAdvisor and HTTP health checks via Blackbox Exporter.
