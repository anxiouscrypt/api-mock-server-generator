def test_endpoint_crud(client, endpoint_payload):
    create_response = client.post("/admin/endpoints", json=endpoint_payload)

    assert create_response.status_code == 200
    endpoint = create_response.json()
    assert endpoint["id"].startswith("endpoint_")
    assert endpoint["path"] == "/orders"

    list_response = client.get("/admin/endpoints")

    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    endpoint_payload["statusCode"] = 202
    update_response = client.put(
        f"/admin/endpoints/{endpoint['id']}", json=endpoint_payload
    )

    assert update_response.status_code == 200
    assert update_response.json()["statusCode"] == 202

    delete_response = client.delete(f"/admin/endpoints/{endpoint['id']}")

    assert delete_response.status_code == 204
    assert client.get(f"/admin/endpoints/{endpoint['id']}").status_code == 404


def test_duplicate_method_and_path_is_rejected(client, endpoint_payload):
    assert client.post("/admin/endpoints", json=endpoint_payload).status_code == 200

    response = client.post("/admin/endpoints", json=endpoint_payload)

    assert response.status_code == 409
