# GenAIHub DevOps Project

Enterprise GenAI platform with frontend dashboard, backend API, and DevOps tooling.

## Project Structure

```
GenAIHub-DevOps-Project/
├── frontend/          # Next.js dashboard + Dockerfile
├── backend/           # Express API + Dockerfile
├── docker-compose.yml # Runs both services
├── kubernetes/
├── terraform/
├── jenkins/
├── monitoring/
└── docs/
```

## Docker (recommended for demo)

Run both services together on a shared network:

```bash
docker compose up --build
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |

The frontend proxies inference requests to the backend over the internal Docker network (`BACKEND_URL=http://backend:5000`).

Stop services:

```bash
docker compose down
```

## Kubernetes

Build Docker images first:

```bash
docker build -t genaihub-backend:latest ./backend
docker build -t genaihub-frontend:latest ./frontend
```

Deploy to Kubernetes:

```bash
kubectl apply -f kubernetes/
```

Check status:

```bash
kubectl get pods
kubectl get services
```

Frontend is exposed via `frontend-service` (LoadBalancer) on port 3000.  
Backend runs internally as `backend-service` on port 5000.

**Viva answer:** Kubernetes manages and scales containers automatically.

## Terraform

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

Resources: VPC, Public Subnet, Security Group, EC2.

**Viva answer:** Terraform provisions infrastructure using code.

## Jenkins

Pipeline file: `jenkins/Jenkinsfile`

Stages: Build → Test → Docker Build → Deploy

**Viva answer:** Jenkins automates CI/CD.

## Monitoring

```bash
cd monitoring
docker compose up -d
```

| Service | URL |
|---------|-----|
| Grafana | http://localhost:3001 (admin / admin) |
| Prometheus | http://localhost:9090 |

Dashboard panels: CPU Usage, Memory Usage, Container Status.

**Viva answer:** Prometheus collects metrics and Grafana visualizes them.

## Backend

See [backend/README.md](./backend/README.md) for setup and usage.

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API runs at [http://localhost:5000](http://localhost:5000).

## Frontend

See [frontend/README.md](./frontend/README.md) for setup and usage.

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
