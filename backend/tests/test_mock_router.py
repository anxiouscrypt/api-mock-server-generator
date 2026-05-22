def test_runtime_mock_route_returns_configured_response(client, endpoint_payload):
    client.post("/admin/endpoints", json=endpoint_payload)

    response = client.post("/mock/orders", json={"sku": "latte"})

    assert response.status_code == 201
    assert response.json() == {"id": "order_123", "status": "PAID"}

    logs = client.get("/admin/logs").json()
    assert len(logs) == 1
    assert logs[0]["matchedEndpointId"] is not None
    assert logs[0]["requestBody"] == {"sku": "latte"}


def test_disabled_endpoint_does_not_match(client, endpoint_payload):
    endpoint_payload["enabled"] = False
    client.post("/admin/endpoints", json=endpoint_payload)

    response = client.post("/mock/orders", json={"sku": "latte"})

    assert response.status_code == 404
    assert client.get("/admin/logs").json()[0]["matchedEndpointId"] is None


def test_unmatched_route_returns_404(client):
    response = client.get("/mock/unknown")

    assert response.status_code == 404
    assert response.json()["detail"] == "No enabled mock endpoint for GET /unknown"
