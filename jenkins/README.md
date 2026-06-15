# GenAIHub Jenkins Pipeline

CI/CD pipeline for the GenAIHub DevOps project.

## Pipeline Stages

1. **Build** — Install dependencies and build frontend
2. **Test** — Run backend syntax checks and frontend lint
3. **Docker Build** — Build frontend and backend Docker images
4. **Deploy** — Deploy with Docker Compose and Kubernetes

## Setup

1. Install Jenkins
2. Create a **Pipeline** job
3. Point it to `jenkins/Jenkinsfile` in this repository

## Viva Answer

**Jenkins automates CI/CD.**

It runs build, test, and deployment steps automatically whenever code changes, reducing manual work and deployment errors.
