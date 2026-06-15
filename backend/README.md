# GenAIHub Backend

Express API for the GenAIHub platform.

## Tech Stack

- Node.js
- Express.js

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Server runs at [http://localhost:5000](http://localhost:5000).

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |

## Docker

```bash
docker compose up --build
```

Runs on port **5000** inside Docker (mapped to host port 5000).

## API Endpoints

### GET /health

```json
{ "status": "healthy" }
```

### GET /models

```json
[
  {
    "id": 1,
    "name": "GenAIHub-GPT",
    "version": "1.0",
    "status": "active"
  }
]
```

### POST /generate

Request:

```json
{ "prompt": "Hello" }
```

Response:

```json
{
  "response": "This is a simulated AI response for the entered prompt."
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Environment config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Error handling
│   ├── models/         # Data layer
│   ├── routes/         # API routes
│   ├── app.js          # Express app setup
│   └── server.js       # Entry point
├── .env.example
└── package.json
```
