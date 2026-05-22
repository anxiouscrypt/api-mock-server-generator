import os
import sqlite3
from pathlib import Path


def database_path() -> Path:
    database_url = os.getenv("DATABASE_URL", "sqlite:///./api_mock_server.db")

    if database_url.startswith("sqlite:///"):
        return Path(database_url.replace("sqlite:///", "", 1))

    return Path(database_url)


def get_connection() -> sqlite3.Connection:
    path = database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS endpoints (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              method TEXT NOT NULL,
              path TEXT NOT NULL,
              status_code INTEGER NOT NULL,
              response_body TEXT NOT NULL,
              enabled INTEGER NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE UNIQUE INDEX IF NOT EXISTS idx_endpoints_method_path
            ON endpoints(method, path)
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS request_logs (
              id TEXT PRIMARY KEY,
              method TEXT NOT NULL,
              path TEXT NOT NULL,
              request_body TEXT,
              matched_endpoint_id TEXT,
              timestamp TEXT NOT NULL
            )
            """
        )
