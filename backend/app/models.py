from datetime import datetime
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field, field_validator

HttpMethod = Literal["GET", "POST", "PUT", "PATCH", "DELETE"]


def endpoint_id() -> str:
    return f"endpoint_{uuid4().hex[:10]}"


class MockEndpointInput(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    method: HttpMethod
    path: str = Field(min_length=1, max_length=240)
    statusCode: int = Field(ge=100, le=599)
    responseBody: dict[str, Any] = Field(default_factory=dict)
    enabled: bool = True

    @field_validator("method", mode="before")
    @classmethod
    def normalize_method(cls, value: str) -> str:
        return value.upper()

    @field_validator("path")
    @classmethod
    def normalize_path(cls, value: str) -> str:
        path = value.strip()
        if not path.startswith("/"):
            path = f"/{path}"
        if len(path) > 1:
            path = path.rstrip("/")
        return path


class MockEndpoint(MockEndpointInput):
    id: str = Field(default_factory=endpoint_id)
    createdAt: datetime
    updatedAt: datetime


class RequestLog(BaseModel):
    id: str
    method: str
    path: str
    requestBody: dict[str, Any] | list[Any] | str | None
    matchedEndpointId: str | None
    timestamp: datetime
