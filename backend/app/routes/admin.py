import sqlite3

from fastapi import APIRouter, HTTPException

from app.models import MockEndpoint, MockEndpointInput
from app.services.endpoint_store import (
    create_endpoint,
    delete_endpoint,
    get_endpoint,
    list_endpoints,
    update_endpoint,
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/endpoints", response_model=MockEndpoint)
def create_mock_endpoint(payload: MockEndpointInput) -> MockEndpoint:
    try:
        return create_endpoint(payload)
    except sqlite3.IntegrityError as exc:
        raise HTTPException(
            status_code=409,
            detail="An endpoint with this method and path already exists",
        ) from exc


@router.get("/endpoints", response_model=list[MockEndpoint])
def read_mock_endpoints() -> list[MockEndpoint]:
    return list_endpoints()


@router.get("/endpoints/{endpoint_id}", response_model=MockEndpoint)
def read_mock_endpoint(endpoint_id: str) -> MockEndpoint:
    endpoint = get_endpoint(endpoint_id)

    if endpoint is None:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    return endpoint


@router.put("/endpoints/{endpoint_id}", response_model=MockEndpoint)
def update_mock_endpoint(endpoint_id: str, payload: MockEndpointInput) -> MockEndpoint:
    try:
        endpoint = update_endpoint(endpoint_id, payload)
    except sqlite3.IntegrityError as exc:
        raise HTTPException(
            status_code=409,
            detail="An endpoint with this method and path already exists",
        ) from exc

    if endpoint is None:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    return endpoint


@router.delete("/endpoints/{endpoint_id}", status_code=204)
def delete_mock_endpoint(endpoint_id: str) -> None:
    deleted = delete_endpoint(endpoint_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Endpoint not found")
