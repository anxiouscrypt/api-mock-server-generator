# Build Log

## Phase 1: Repository Initialization

- Created repository structure, docs skeletons, environment example, license, and ignore rules.

## Phase 2: Architecture Definition

- Defined the split between the admin API and runtime mock API.
- Documented exact method/path matching for the MVP.
- Captured request logging as part of the developer feedback loop.

## Phase 3: Backend Admin API

- Added FastAPI, Pydantic models, and SQLite endpoint storage.
- Implemented create, list, read, update, and delete admin routes.

## Phase 4: Runtime Mock Router

- Added `/mock/{path}` runtime handling.
- Implemented exact method/path matching against enabled endpoints.
- Returned configured JSON response body and status code.

## Phase 5: Request Logging

- Added SQLite request log storage.
- Logged matched and unmatched runtime mock requests.
- Exposed recent logs through `GET /admin/logs`.

## Phase 6: Frontend Endpoint Builder

- Created the Vite React TypeScript frontend.
- Added endpoint create, edit, delete, and list UI.
- Added JSON response editing.

## Phase 7: Request Tester

- Added endpoint selection for test calls.
- Sent requests through the runtime `/mock` route.
- Displayed response status and body.
- Generated copyable curl commands.
