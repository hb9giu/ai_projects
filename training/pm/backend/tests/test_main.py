import os

from fastapi.testclient import TestClient

from app.main import app
from app.config import resolve_static_dir
from app.routes import static as static_module

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root_html() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert "Kanban" in response.text


def test_api_hello() -> None:
    response = client.get("/api/hello")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from FastAPI"}


def test_root_serves_static_index(tmp_path, monkeypatch) -> None:
    index_path = tmp_path / "index.html"
    index_path.write_text("Kanban Studio")
    monkeypatch.setattr(static_module, "STATIC_DIR", tmp_path)

    response = client.get("/")
    assert response.status_code == 200
    assert "Kanban Studio" in response.text


def test_static_fallback_serves_files(tmp_path, monkeypatch) -> None:
    (tmp_path / "index.html").write_text("Index content")
    (tmp_path / "hello.txt").write_text("Hello file")
    monkeypatch.setattr(static_module, "STATIC_DIR", tmp_path)

    response = client.get("/hello.txt")
    assert response.status_code == 200
    assert response.text == "Hello file"


def test_static_fallback_returns_index(tmp_path, monkeypatch) -> None:
    (tmp_path / "index.html").write_text("Index content")
    monkeypatch.setattr(static_module, "STATIC_DIR", tmp_path)

    response = client.get("/unknown/path")
    assert response.status_code == 200
    assert "Index content" in response.text


def test_static_fallback_404_when_missing(monkeypatch) -> None:
    monkeypatch.setattr(static_module, "STATIC_DIR", None)

    response = client.get("/missing")
    assert response.status_code == 404


def test_resolve_static_dir_uses_env(tmp_path, monkeypatch) -> None:
    monkeypatch.setenv("PM_STATIC_DIR", str(tmp_path))
    resolved = resolve_static_dir()
    assert resolved == tmp_path


def test_mount_static_assets(tmp_path) -> None:
    from app.main import _mount_static_assets
    (tmp_path / "_next").mkdir()
    (tmp_path / "static").mkdir()
    _mount_static_assets(tmp_path)


def test_static_fallback_directory_index(tmp_path, monkeypatch) -> None:
    nested_dir = tmp_path / "nested"
    nested_dir.mkdir()
    (nested_dir / "index.html").write_text("Nested index")
    (tmp_path / "index.html").write_text("Root index")
    monkeypatch.setattr(static_module, "STATIC_DIR", tmp_path)

    response = client.get("/nested")
    assert response.status_code == 200
    assert "Nested index" in response.text


def test_static_fallback_404_without_index(tmp_path, monkeypatch) -> None:
    monkeypatch.setattr(static_module, "STATIC_DIR", tmp_path)

    response = client.get("/no-index")
    assert response.status_code == 404
