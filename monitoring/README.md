# GenAIHub Monitoring

Prometheus and Grafana stack for GenAIHub infrastructure and container monitoring.

## Components

| Service | Port | Purpose |
|---------|------|---------|
| Prometheus | 9090 | Collects metrics |
| Grafana | 3001 | Visualizes metrics |
| Node Exporter | 9100 | Host CPU and memory metrics |
| cAdvisor | 8080 | Container metrics |

## Dashboard Panels

- CPU Usage
- Memory Usage
- Container Status

## Start Monitoring

```bash
cd monitoring
docker compose up -d
```

Open Grafana: [http://localhost:3001](http://localhost:3001)

- Username: `admin`
- Password: `admin`

Dashboard: **GenAIHub Monitoring**

Prometheus UI: [http://localhost:9090](http://localhost:9090)

Stop monitoring:

```bash
docker compose down
```

## Viva Answer

**Prometheus collects metrics and Grafana visualizes them.**

Prometheus scrapes time-series data from services and exporters. Grafana connects to Prometheus and displays dashboards for CPU, memory, and container health.
