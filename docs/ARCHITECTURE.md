# Architecture

## System Components

- React frontend for endpoint definition, request testing, curl export, and log review.
- FastAPI admin API for endpoint CRUD.
- FastAPI runtime router for `/mock/{path}` responses.
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
