import json

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.services.request_logger import create_request_log
from app.services.route_matcher import match_route, normalize_mock_path

router = APIRouter(tags=["mock"])


@router.api_route(
    "/mock/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def handle_mock_request(path: str, request: Request) -> JSONResponse:
    normalized_path = normalize_mock_path(path)
    endpoint = match_route(request.method, normalized_path)
    request_body = await parse_request_body(request)

    if endpoint is None:
        create_request_log(request.method, normalized_path, request_body, None)
        return JSONResponse(
            status_code=404,
            content={
                "detail": f"No enabled mock endpoint for {request.method} {normalized_path}"
            },
        )

    create_request_log(request.method, normalized_path, request_body, endpoint.id)
    return JSONResponse(
        status_code=endpoint.statusCode,
        content=endpoint.responseBody,
    )


async def parse_request_body(request: Request) -> dict | list | str | None:
    body = await request.body()

    if not body:
        return None

    try:
        return json.loads(body)
    except json.JSONDecodeError:
        return body.decode("utf-8", errors="replace")
