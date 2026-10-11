"""
README Studio Backend API
FastAPI service compatible with local development, Docker, and Vercel Serverless Functions.
"""

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import re
import urllib.request
import urllib.parse

from prompts import (
    build_readme_from_inputs,
    generate_contributing,
    generate_setup,
    generate_architecture,
    generate_license,
    generate_changelog,
    fetch_github_repo_metadata,
)

# Initialize FastAPI app
app = FastAPI(
    title="README Studio API",
    version="1.0.0",
    description="Generate professional README.md files and documentation suites automatically"
)

# Enable CORS (standard compliant: wildcard origin without credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request schema
class ReadmeRequest(BaseModel):
    repo_url: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    generate_suite: Optional[bool] = False
    selected_documents: Optional[List[str]] = None
    theme: Optional[str] = "default"
    section_order: Optional[List[str]] = None
    github_token: Optional[str] = None


class ScanRepoRequest(BaseModel):
    repo_url: str
    github_token: Optional[str] = None


# Response schema
class ReadmeResponse(BaseModel):
    markdown: str
    metadata: dict
    additional_files: Optional[dict] = None
    rate_limited: Optional[bool] = False


def validate_inputs(req: ReadmeRequest) -> bool:
    """Validate that at least one meaningful input is provided."""
    if not (req.repo_url and req.repo_url.strip()) and not (req.description and req.description.strip()):
        return False
    return True


def clean_url(url: str) -> str:
    """Clean and normalize GitHub URL."""
    if not url:
        return ""
    url = url.strip().rstrip("/")
    if url.endswith(".git"):
        url = url[:-4]
    return url.rstrip("/")


# Create router to mount on both "/" and "/api"
api_router = APIRouter()


@api_router.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "README Studio API", "version": "1.0.0"}


@api_router.post("/scan-repo")
def scan_repository(req: ScanRepoRequest):
    """
    Deep scan a GitHub repository to extract tech stack, topics,
    scripts, dependencies, stars, license, and directory tree.
    """
    clean_repo = clean_url(req.repo_url)
    if not clean_repo:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL")

    meta = fetch_github_repo_metadata(clean_repo, custom_token=req.github_token)
    if not meta or not meta.get("slug"):
        raise HTTPException(
            status_code=404,
            detail="Repository not found, is private, or GitHub API rate limit reached."
        )

    return {
        "success": True,
        "repo_name": meta.get("slug", ""),
        "full_name": meta.get("full_name", ""),
        "description": meta.get("description", ""),
        "detected_tech": meta.get("detected_tech", []),
        "primary_language": meta.get("language", ""),
        "stars": meta.get("stars", 0),
        "forks": meta.get("forks", 0),
        "license": meta.get("license", "MIT"),
        "topics": meta.get("topics", []),
        "directory_tree": meta.get("directory_tree", ""),
        "custom_install": meta.get("custom_install"),
        "custom_usage": meta.get("custom_usage"),
        "custom_test": meta.get("custom_test"),
        "rate_limited": meta.get("rate_limited", False)
    }


@api_router.post("/generate-readme", response_model=ReadmeResponse)
def generate_readme(req: ReadmeRequest):
    """
    Generate a README.md file and optional documentation suite
    from a repository URL or project description.
    """
    if not validate_inputs(req):
        raise HTTPException(
            status_code=400,
            detail="Please provide either a GitHub repository URL or a project description."
        )

    clean_repo_url = clean_url(req.repo_url) if req.repo_url else None
    clean_desc = req.description.strip()[:10000] if req.description else None

    try:
        readme_data = build_readme_from_inputs(
            repo_url=clean_repo_url,
            description=clean_desc,
            tech_stack_items=req.tech_stack or [],
            theme=req.theme or "default",
            section_order=req.section_order or None,
            github_token=req.github_token
        )

        markdown = readme_data.get("dynamic_markdown", "")

        additional_files = {}
        target_docs = req.selected_documents if req.selected_documents is not None else (
            ["CONTRIBUTING.md", "SETUP.md", "ARCHITECTURE.md", "LICENSE"] if req.generate_suite else []
        )
        if target_docs:
            proj_name = readme_data["project_name"]
            techs = req.tech_stack or []
            repo_meta = readme_data.get("repo_metadata") or {}
            if "CONTRIBUTING.md" in target_docs:
                additional_files["CONTRIBUTING.md"] = generate_contributing(proj_name, repo_meta)
            if "SETUP.md" in target_docs:
                additional_files["SETUP.md"] = generate_setup(proj_name, techs, repo_meta)
            if "ARCHITECTURE.md" in target_docs:
                additional_files["ARCHITECTURE.md"] = generate_architecture(proj_name, techs, repo_meta)
            if "CHANGELOG.md" in target_docs:
                additional_files["CHANGELOG.md"] = generate_changelog(proj_name, repo_meta)
            if "LICENSE" in target_docs:
                additional_files["LICENSE"] = generate_license(proj_name, repo_meta)

        return ReadmeResponse(
            markdown=markdown,
            metadata={
                "project_name": readme_data["project_name"],
                "tech_stack": readme_data["tech_stack"],
                "generated": True,
            },
            additional_files=additional_files,
            rate_limited=readme_data.get("rate_limited", False)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating README: {str(e)}"
        )


@api_router.get("/resolve-image")
def resolve_image_url(url: str):
    """
    Resolve redirect URLs (such as share.google, Google Image search links,
    URL shorteners, etc.) to their direct image asset URLs.
    """
    if not url or not url.strip():
        raise HTTPException(status_code=400, detail="Missing URL parameter")

    clean_target = url.strip()
    try:
        # Check if already a Google Image search result with imgurl
        parsed_target = urllib.parse.urlparse(clean_target)
        target_qs = urllib.parse.parse_qs(parsed_target.query)
        if "imgurl" in target_qs and target_qs["imgurl"]:
            return {"success": True, "direct_url": target_qs["imgurl"][0], "original_url": clean_target}

        req = urllib.request.Request(
            clean_target,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            final_url = response.geturl()
            parsed = urllib.parse.urlparse(final_url)
            query = urllib.parse.parse_qs(parsed.query)

            # 1. Google Image redirects containing imgurl parameter
            if "imgurl" in query and query["imgurl"]:
                return {"success": True, "direct_url": query["imgurl"][0], "original_url": clean_target}

            # 2. Direct image content type
            content_type = response.headers.get("Content-Type", "").lower()
            if "image/" in content_type:
                return {"success": True, "direct_url": final_url, "original_url": clean_target}

            # 3. Fallback: Parse og:image or twitter:image from HTML
            if "text/html" in content_type:
                html_chunk = response.read(65536).decode("utf-8", errors="ignore")
                og_match = re.search(r'<meta[^>]+property=[\'"]og:image[\'"][^>]+content=[\'"]([^\'"]+)[\'"]', html_chunk, re.IGNORECASE)
                if not og_match:
                    og_match = re.search(r'<meta[^>]+content=[\'"]([^\'"]+)[\'"][^>]+property=[\'"]og:image[\'"]', html_chunk, re.IGNORECASE)
                if og_match:
                    return {"success": True, "direct_url": og_match.group(1), "original_url": clean_target}

            return {"success": True, "direct_url": final_url, "original_url": clean_target}
    except Exception as e:
        return {"success": False, "error": str(e), "original_url": clean_target}


@api_router.get("/")
def root():
    """Root metadata endpoint."""
    return {
        "message": "README Studio API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health or /api/health",
            "generate": "/generate-readme or /api/generate-readme (POST)",
            "docs": "/docs"
        }
    }


# Mount the router both with and without /api prefix for maximum deployment flexibility
app.include_router(api_router)
app.include_router(api_router, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
