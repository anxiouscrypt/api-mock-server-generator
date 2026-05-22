# API Mock Server Generator

A developer tool for defining mock API endpoints and testing integrations before real services are ready.

## Problem

Frontend and integration work often waits on unfinished, unstable, or third-party APIs. A local mock server removes that bottleneck by returning predictable responses from developer-defined routes.

## Demo

Screenshot placeholder: `docs/screenshots/api-mock-server-generator.png`

## Features

- Define mock endpoints with method, path, status code, JSON response body, and enabled state
- Serve configured responses through `/mock/{path}`
- Test mock requests from the UI
- Copy curl commands
- View recent request logs

## Architecture

React admin UI -> FastAPI admin API -> SQLite endpoint store -> runtime mock router -> request log.

```txt
React UI
  -> endpoint builder
  -> FastAPI admin API
  -> SQLite endpoint store

Client test request
  -> /mock/{path}
  -> method/path matcher
  -> configured response
  -> request log
```

## Tech Stack

- React, TypeScript, Vite
- Tailwind CSS
- FastAPI, Pydantic, SQLite
- Pytest

## Local Setup

Prerequisites:

- Node.js 20 or newer
- Python 3.11 or newer

Run both services:

```bash
chmod +x scripts/dev.sh
./scripts/dev.sh
```

The frontend runs at `http://localhost:5173`.
The backend runs at `http://localhost:8000`.

Manual backend:

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
PYTHONPATH=backend .venv/bin/uvicorn app.main:app --reload --port 8000
```

Manual frontend:

```bash
cd frontend
npm install
npm run dev
```

Run checks:

```bash
PYTHONPATH=backend .venv/bin/pytest backend/tests
cd frontend && npm run build
```

## Example Usage

Create a mock endpoint:

```json
{
  "name": "Create Order",
  "method": "POST",
  "path": "/orders",
  "statusCode": 201,
  "responseBody": {
    "id": "order_123",
    "status": "PAID"
  },
  "enabled": true
}
```

Call it through the runtime router:

```bash
curl -X POST http://localhost:8000/mock/orders \
  -H 'Content-Type: application/json' \
  --data '{"sku":"latte"}'
```

## API Endpoints

Admin:

- `GET /health`
- `POST /admin/endpoints`
- `GET /admin/endpoints`
- `GET /admin/endpoints/{id}`
- `PUT /admin/endpoints/{id}`
- `DELETE /admin/endpoints/{id}`
- `GET /admin/logs`

Runtime:

- `ANY /mock/{path:path}`

## Future Improvements

See `docs/ROADMAP.md`.

## What I Learned

- Separating admin routes from runtime routes makes the mental model cleaner.
- Request logs are essential for understanding whether a mock was actually hit.
- A useful mock tool needs both route definition and quick request testing in the same UI.
