# Architecture

## System Components

- React frontend for endpoint definition, request testing, curl export, and log review.
- FastAPI admin API for endpoint CRUD.
- FastAPI runtime router for `/mock/{path}` responses.
- Route matcher that compares request method plus normalized path.
- SQLite storage for endpoint definitions and request logs.

## Data Flow

```txt
React UI -> Admin API -> SQLite endpoint store
Client request -> /mock route -> route matcher -> configured JSON response
                              -> request log store
```

## Known Limitations

- Local developer tool only.
- Exact path matching for MVP.
- No auth, workspaces, or hosted environments.
- JSON response bodies only.

## Admin API

The admin API manages mock endpoint definitions:

- `POST /admin/endpoints`
- `GET /admin/endpoints`
- `GET /admin/endpoints/{id}`
- `PUT /admin/endpoints/{id}`
- `DELETE /admin/endpoints/{id}`

Endpoint definitions include method, path, status code, JSON response body, and enabled state.

## Runtime API

`ANY /mock/{path:path}` handles test requests. For a request like:

```txt
POST /mock/orders
```

the matcher normalizes it to:

```txt
method = POST
path = /orders
```

If an enabled endpoint with that method and path exists, the runtime route returns the configured status code and JSON body. If no route matches, it returns `404`.

## Request Logging

Each runtime request is logged with method, path, parsed request body when available, matched endpoint ID, and timestamp. Logs help developers confirm whether a frontend or integration request hit the expected mock.

## Storage Model

```txt
endpoints
  id TEXT PRIMARY KEY
  method TEXT
  path TEXT
  status_code INTEGER
  response_body TEXT
  enabled INTEGER

request_logs
  id TEXT PRIMARY KEY
  method TEXT
  path TEXT
  request_body TEXT
  matched_endpoint_id TEXT
  timestamp TEXT
```
