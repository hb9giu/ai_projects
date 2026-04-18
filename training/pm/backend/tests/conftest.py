import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.database import init_db
from app.main import app

TEST_API_KEY = "test-key"


@pytest.fixture
def tmp_db(tmp_path: Path, monkeypatch):
    monkeypatch.setenv("PM_DB_PATH", str(tmp_path / "test.db"))
    init_db()
    return tmp_path


@pytest.fixture
def client(tmp_db):
    return TestClient(app)
