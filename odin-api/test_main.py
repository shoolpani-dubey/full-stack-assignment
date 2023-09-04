from fastapi.testclient import TestClient

import main

client = TestClient(main.app)


def test_sar_image_download_link():
    response = client.get("/odin-api/SAR_image_20420212.png")
    assert response.status_code == 200


def test_searmark_get_api():
    response = client.get("/seamark")
    assert response.status_code == 200
