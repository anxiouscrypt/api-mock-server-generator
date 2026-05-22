from app.models import MockEndpoint
from app.services.endpoint_store import find_enabled_endpoint


def normalize_mock_path(path: str) -> str:
    normalized = path.strip()
    if not normalized.startswith("/"):
        normalized = f"/{normalized}"
    if len(normalized) > 1:
        normalized = normalized.rstrip("/")
    return normalized


def match_route(method: str, path: str) -> MockEndpoint | None:
    return find_enabled_endpoint(method.upper(), normalize_mock_path(path))
