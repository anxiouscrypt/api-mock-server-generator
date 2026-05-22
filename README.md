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

Setup instructions will be completed with the MVP.

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
