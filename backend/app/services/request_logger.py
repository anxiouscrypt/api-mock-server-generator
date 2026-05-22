import json
from datetime import datetime, timezone
from typing import Any

from app.database import get_connection
from app.models import RequestLog, log_id


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _serialize_body(body: dict[str, Any] | list[Any] | str | None) -> str | None:
    if body is None:
        return None
    return json.dumps(body)


def _deserialize_body(body: str | None) -> dict[str, Any] | list[Any] | str | None:
    if body is None:
        return None
    return json.loads(body)


def create_request_log(
    method: str,
    path: str,
    request_body: dict[str, Any] | list[Any] | str | None,
    matched_endpoint_id: str | None,
) -> RequestLog:
    timestamp = _now()
    request_log = RequestLog(
        id=log_id(),
        method=method.upper(),
        path=path,
        requestBody=request_body,
        matchedEndpointId=matched_endpoint_id,
        timestamp=datetime.fromisoformat(timestamp),
    )

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO request_logs
              (id, method, path, request_body, matched_endpoint_id, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                request_log.id,
                request_log.method,
                request_log.path,
                _serialize_body(request_log.requestBody),
                request_log.matchedEndpointId,
                timestamp,
            ),
        )

    return request_log


def list_request_logs(limit: int = 50) -> list[RequestLog]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT * FROM request_logs
            ORDER BY timestamp DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    return [
        RequestLog(
            id=row["id"],
            method=row["method"],
            path=row["path"],
            requestBody=_deserialize_body(row["request_body"]),
            matchedEndpointId=row["matched_endpoint_id"],
            timestamp=datetime.fromisoformat(row["timestamp"]),
        )
        for row in rows
    ]
