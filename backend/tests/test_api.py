"""
Unit and integration tests for Auto README Generator API.
"""
import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app, clean_url
from prompts import extract_owner_repo, build_readme_from_inputs

client = TestClient(app)


def test_health_endpoints():
    """Verify health check on both /health and /api/health."""
    for path in ["/health", "/api/health"]:
        resp = client.get(path)
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"


def test_root_endpoint():
    """Verify root documentation info."""
    for path in ["/", "/api/"]:
        resp = client.get(path)
        assert resp.status_code == 200
        assert "endpoints" in resp.json()


def test_validation_requires_input():
    """Verify 400 when neither repo_url nor description is provided."""
    resp = client.post("/generate-readme", json={})
    assert resp.status_code == 400
    assert "Please provide either" in resp.json()["detail"]


def test_generate_readme_with_description():
    """Verify README generation from description alone."""
    payload = {
        "description": "A high-performance caching reverse proxy built with Rust",
        "tech_stack": ["Rust", "Docker"],
        "theme": "default"
    }
    resp = client.post("/generate-readme", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "markdown" in data
    assert "Rust" in data["markdown"]
    assert "Features" in data["markdown"]
    assert data["metadata"]["generated"] is True


def test_generate_suite_includes_contributing_and_license():
    """Verify generate_suite includes full documentation suite (Doc Pack)."""
    payload = {
        "description": "Open source developer tools",
        "tech_stack": ["React", "FastAPI"],
        "generate_suite": True
    }
    resp = client.post("/api/generate-readme", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "additional_files" in data
    assert "CONTRIBUTING.md" in data["additional_files"]
    assert "SETUP.md" in data["additional_files"]
    assert "ARCHITECTURE.md" in data["additional_files"]
    assert "LICENSE" in data["additional_files"]
    assert "MIT License" in data["additional_files"]["LICENSE"]
    assert "mermaid" in data["additional_files"]["ARCHITECTURE.md"]


def test_themes():
    """Verify default, minimalist, and hacker theme outputs."""
    for theme in ["default", "minimalist", "hacker"]:
        data = build_readme_from_inputs(
            description="My CLI tool",
            tech_stack_items=["Python", "FastAPI"],
            theme=theme
        )
        md = data["dynamic_markdown"]
        assert len(md) > 100
        if theme == "hacker":
            assert "[0x01]" in md
        elif theme == "minimalist":
            assert "# My Awesome Project" in md or "# " in md
        elif theme == "default":
            assert "✨ Features" in md


def test_url_helpers():
    """Verify GitHub URL parsing and normalization."""
    assert clean_url("https://github.com/torvalds/linux.git/") == "https://github.com/torvalds/linux"
    owner, repo = extract_owner_repo("https://github.com/facebook/react")
    assert owner == "facebook"
    assert repo == "react"

    owner2, repo2 = extract_owner_repo("https://github.com/tiangolo/fastapi.git")
    assert owner2 == "tiangolo"
    assert repo2 == "fastapi"


def test_all_dynamic_sections():
    """Verify all 11 sections can be rendered dynamically."""
    all_sections = [
        "features", "tech_stack", "project_structure", "installation",
        "usage", "configuration", "architecture", "testing",
        "troubleshooting", "deployment", "contributing"
    ]
    data = build_readme_from_inputs(
        description="Full stack app",
        tech_stack_items=["React", "FastAPI", "Docker", "PostgreSQL"],
        section_order=all_sections
    )
    md = data["dynamic_markdown"]
    assert "Features" in md
    assert "Tech Stack" in md
    assert "Project Structure" in md
    assert "Installation" in md or "Getting Started" in md
    assert "Usage" in md
    assert "Configuration" in md
    assert "Architecture" in md
    assert "Testing" in md
    assert "Troubleshooting" in md
    assert "Deployment" in md
    assert "Contributing" in md


def test_scan_repo_validation():
    """Verify scan-repo validation with invalid URL."""
    resp = client.post("/scan-repo", json={"repo_url": ""})
    assert resp.status_code == 400


def test_resolve_image_endpoints():
    """Verify resolve-image validation and query extraction."""
    # Empty url -> 400
    resp_empty = client.get("/resolve-image?url=")
    assert resp_empty.status_code == 400

    # Google image search URL with imgurl parameter
    test_google_img = "https://www.google.com/imgres?imgurl=https%3A%2F%2Fexample.com%2Fbanner.png&tbnid=123"
    resp = client.get(f"/resolve-image?url={test_google_img}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["direct_url"] == "https://example.com/banner.png"


def test_github_compatibility():
    """Verify that generated markdown adheres to GitHub rendering standards."""
    data = build_readme_from_inputs(
        description="A full-stack analytics dashboard",
        tech_stack_items=["React", "FastAPI", "PostgreSQL", "Docker"],
        theme="default",
    )
    md = data["dynamic_markdown"]

    # 1. Anchor targets must match GitHub's emoji-stripped slug algorithm
    assert "(#getting-started)" in md
    assert "(#features)" in md
    assert "(#architecture)" in md
    assert "(#usage)" in md
    assert "(#contributing)" in md

    # Ensure broken emoji slugs are gone
    assert "(#-getting-started)" not in md
    assert "(#-features)" not in md
    assert "(#%EF%B8%8F-architecture)" not in md

    # 2. Directory tree must not contain hardcoded README Studio engine files
    assert "prompts.py" not in md
    assert "app.py" not in md or "main.py" in md or "backend/" in md

    # 3. Mermaid architecture diagram syntax must be GitHub safe
    assert 'Client["Web Client' in md
    assert 'API["API Gateway' in md
    assert '|"HTTPS / REST"|' in md

    # 4. Badges must not have broken domain typos
    assert "https://github.None" not in md

