from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.services.route_matcher import match_route, normalize_mock_path

router = APIRouter(tags=["mock"])


@router.api_route(
    "/mock/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def handle_mock_request(path: str, request: Request) -> JSONResponse:
    normalized_path = normalize_mock_path(path)
    endpoint = match_route(request.method, normalized_path)

    if endpoint is None:
        return JSONResponse(
            status_code=404,
            content={
                "detail": f"No enabled mock endpoint for {request.method} {normalized_path}"
            },
        )

    return JSONResponse(
        status_code=endpoint.statusCode,
        content=endpoint.responseBody,
    )
