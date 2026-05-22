import pytest
from fastapi.testclient import TestClient

from app.database import init_db
from app.main import app


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{tmp_path}/test.db")
    init_db()

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def endpoint_payload():
    return {
        "name": "Create Order",
        "method": "POST",
        "path": "/orders",
        "statusCode": 201,
        "responseBody": {"id": "order_123", "status": "PAID"},
        "enabled": True,
    }
