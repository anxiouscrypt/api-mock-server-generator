# Decisions

## Admin API and Runtime API Split

Endpoint definitions are managed through `/admin/*`, while configured mock responses are served through `/mock/*`. This keeps setup traffic separate from runtime test traffic.

## SQLite Storage

SQLite keeps endpoint definitions and request logs durable without adding an external database dependency.

## Exact Path Matching for MVP

The first version matches method plus normalized path exactly. Dynamic path params are useful, but exact matching keeps the routing behavior clear and testable.

## JSON-Only Responses

The MVP returns JSON response bodies. This covers the most common frontend integration use case without adding content negotiation or binary response handling.

## Request Logs Are Recent-First

Logs are optimized for debugging current development work, so the API returns the most recent entries first.
