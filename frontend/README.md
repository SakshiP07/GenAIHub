# GenAIHub Frontend

Enterprise DevOps dashboard for the GenAIHub AI operations platform.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `BACKEND_URL` | Server-side backend URL for `/api/generate` proxy | `http://localhost:5000` |

In Docker, this is set automatically to `http://backend:5000`.

## Docker

```bash
docker compose up --build
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000

## Pages

- **Dashboard** — Metrics, recent activity, platform snapshot
- **AI Inference** — Prompt input with `POST /generate` integration
- **Models** — Model registry table
- **Monitoring** — Resource usage, service status, recent logs

## Project Structure

```
src/
├── app/(dashboard)/          # App routes
├── components/
│   ├── dashboard/            # Dashboard-specific components
│   ├── layout/               # Sidebar, top bar, shell
│   └── ui/                   # shadcn/ui components
└── lib/
    ├── api.ts                # Backend API client
    ├── config.ts             # Environment config
    └── data.ts               # Sample dashboard data
```
