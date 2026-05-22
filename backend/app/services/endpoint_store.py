import json
from datetime import datetime, timezone

from app.database import get_connection
from app.models import MockEndpoint, MockEndpointInput, endpoint_id


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _row_to_endpoint(row) -> MockEndpoint:
    return MockEndpoint(
        id=row["id"],
        name=row["name"],
        method=row["method"],
        path=row["path"],
        statusCode=row["status_code"],
        responseBody=json.loads(row["response_body"]),
        enabled=bool(row["enabled"]),
        createdAt=datetime.fromisoformat(row["created_at"]),
        updatedAt=datetime.fromisoformat(row["updated_at"]),
    )


def create_endpoint(data: MockEndpointInput) -> MockEndpoint:
    timestamp = _now()
    endpoint = MockEndpoint(
        id=endpoint_id(),
        createdAt=datetime.fromisoformat(timestamp),
        updatedAt=datetime.fromisoformat(timestamp),
        **data.model_dump(),
    )

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO endpoints
              (id, name, method, path, status_code, response_body, enabled, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                endpoint.id,
                endpoint.name,
                endpoint.method,
                endpoint.path,
                endpoint.statusCode,
                json.dumps(endpoint.responseBody),
                int(endpoint.enabled),
                timestamp,
                timestamp,
            ),
        )

    return endpoint


def list_endpoints() -> list[MockEndpoint]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM endpoints ORDER BY updated_at DESC"
        ).fetchall()

    return [_row_to_endpoint(row) for row in rows]


def get_endpoint(endpoint_id_value: str) -> MockEndpoint | None:
    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM endpoints WHERE id = ?", (endpoint_id_value,)
        ).fetchone()

    return _row_to_endpoint(row) if row else None


def update_endpoint(endpoint_id_value: str, data: MockEndpointInput) -> MockEndpoint | None:
    timestamp = _now()

    with get_connection() as connection:
        existing = connection.execute(
            "SELECT id FROM endpoints WHERE id = ?", (endpoint_id_value,)
        ).fetchone()

        if existing is None:
            return None

        connection.execute(
            """
            UPDATE endpoints
            SET name = ?, method = ?, path = ?, status_code = ?, response_body = ?,
                enabled = ?, updated_at = ?
            WHERE id = ?
            """,
            (
                data.name,
                data.method,
                data.path,
                data.statusCode,
                json.dumps(data.responseBody),
                int(data.enabled),
                timestamp,
                endpoint_id_value,
            ),
        )

    return get_endpoint(endpoint_id_value)


def delete_endpoint(endpoint_id_value: str) -> bool:
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM endpoints WHERE id = ?", (endpoint_id_value,)
        )
        return cursor.rowcount > 0
