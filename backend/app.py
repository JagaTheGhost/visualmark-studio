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
import ipaddress
import socket

def is_safe_public_url(target_url: str) -> bool:
    """Validate that target URL uses HTTP/HTTPS and resolves strictly to public IP addresses."""
    if not target_url or not isinstance(target_url, str):
        return False
    try:
        parsed = urllib.parse.urlparse(target_url.strip())
        if parsed.scheme.lower() not in ("http", "https"):
            return False
        # Disallow credentials in URL
        if parsed.username or parsed.password:
            return False
        hostname = parsed.hostname
        if not hostname:
            return False
        hostname_lower = hostname.lower()
        if hostname_lower in ("localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal") or hostname_lower.endswith((".local", ".internal", ".localhost")):
            return False
        # Resolve all DNS addresses and check every resolved IP
        addr_info = socket.getaddrinfo(hostname, None)
        for _, _, _, _, sockaddr in addr_info:
            ip = ipaddress.ip_address(sockaddr[0])
            if (
                ip.is_private
                or ip.is_loopback
                or ip.is_link_local
                or ip.is_reserved
                or ip.is_multicast
                or ip.is_unspecified
                or str(ip).startswith("169.254.")
                or str(ip).startswith("100.64.")
            ):
                return False
        return True
    except Exception:
        return False


class SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Custom redirect handler that validates all redirect destinations against SSRF rules."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not is_safe_public_url(newurl):
            raise urllib.error.HTTPError(newurl, code, "SSRF Protection: Redirect target prohibited", headers, fp)
        return super().redirect_request(req, fp, code, msg, headers, newurl)

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
    version="1.0.1",
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
    if not is_safe_public_url(clean_target):
        raise HTTPException(status_code=400, detail="Invalid URL or access to restricted address prohibited")

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
        opener = urllib.request.build_opener(SafeRedirectHandler())
        with opener.open(req, timeout=10) as response:
            final_url = response.geturl()
            # Double check that final resolved URL is also safe
            if not is_safe_public_url(final_url):
                return {"success": False, "error": "Resolved to prohibited internal host", "original_url": clean_target}
            parsed = urllib.parse.urlparse(final_url)
            query = urllib.parse.parse_qs(parsed.query)

            # 1. Google Image redirects containing imgurl parameter
            if "imgurl" in query and query["imgurl"]:
                candidate = query["imgurl"][0]
                if is_safe_public_url(candidate):
                    return {"success": True, "direct_url": candidate, "original_url": clean_target}

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
                    cand_og = og_match.group(1).strip()
                    if is_safe_public_url(cand_og):
                        return {"success": True, "direct_url": cand_og, "original_url": clean_target}

            return {"success": True, "direct_url": final_url, "original_url": clean_target}
    except Exception as e:
        return {"success": False, "error": str(e), "original_url": clean_target}


class GitCloneRequest(BaseModel):
    repo_url: str
    target_dir: Optional[str] = None
    folder_name: Optional[str] = None


@api_router.post("/git-clone")
def git_clone_endpoint(req: GitCloneRequest):
    """Execute git clone safely to the specified target directory."""
    import subprocess
    import os
    import shutil

    clean_url = req.repo_url.strip()
    if not clean_url:
        raise HTTPException(status_code=400, detail="Repository URL is required.")

    # Guard against git flag injection (e.g. --upload-pack)
    if clean_url.startswith("-"):
        raise HTTPException(status_code=400, detail="Invalid repository URL")

    # Expand GitHub shorthand e.g. owner/repo
    if "://" not in clean_url and not clean_url.startswith("git@") and "/" in clean_url and " " not in clean_url:
        parts = clean_url.split("/")
        if len(parts) == 2:
            clean_url = f"https://github.com/{clean_url}.git"
    elif clean_url.startswith("github.com/"):
        clean_url = f"https://{clean_url}"

    # Validate allowed protocols
    if not (clean_url.startswith("https://") or clean_url.startswith("http://") or clean_url.startswith("git@") or clean_url.startswith("ssh://")):
        raise HTTPException(status_code=400, detail="Only HTTP/HTTPS and SSH git repository URLs are supported.")

    # Determine destination directory
    target_dir = (req.target_dir and req.target_dir.strip()) or os.path.expanduser("~/Documents")
    if not os.path.exists(target_dir):
        try:
            os.makedirs(target_dir, exist_ok=True)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Cannot create destination directory: {e}")

    dest_folder = (req.folder_name and req.folder_name.strip())
    if not dest_folder:
        url_stripped = clean_url.rstrip("/")
        if url_stripped.endswith(".git"):
            url_stripped = url_stripped[:-4]
        dest_folder = url_stripped.split("/")[-1] or "cloned-repo"

    # Sanitize folder name: disallow leading hyphen or path separators
    if dest_folder.startswith("-") or ".." in dest_folder or "/" in dest_folder or "\\" in dest_folder:
        raise HTTPException(status_code=400, detail="Invalid target folder name.")

    full_dest_path = os.path.join(target_dir, dest_folder)
    if os.path.exists(full_dest_path):
        try:
            if os.listdir(full_dest_path):
                raise HTTPException(status_code=400, detail=f'Folder "{dest_folder}" already exists in destination and is not empty.')
        except Exception:
            pass

    try:
        # Use '--' to separate options from arguments and prevent command/argument injection
        res = subprocess.run(
            ["git", "clone", "--", clean_url, dest_folder],
            cwd=target_dir,
            capture_output=True,
            text=True,
            timeout=180
        )
        if res.returncode != 0:
            err = res.stderr.strip() or res.stdout.strip() or "Git clone failed."
            return {"success": False, "error": err}
        return {
            "success": True,
            "destinationPath": full_dest_path.replace("\\", "/"),
            "folderName": dest_folder,
            "output": res.stdout
        }
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Git clone timed out after 3 minutes."}
    except Exception as e:
        return {"success": False, "error": str(e)}


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
