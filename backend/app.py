"""
README Studio Backend API
FastAPI service compatible with local development, Docker, and Vercel Serverless Functions.
"""

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
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

# Enable CORS with configurable origins (supports local dev and cloud deployments)
env_cors = os.environ.get("ALLOWED_CORS_ORIGINS")
allowed_origins = [o.strip() for o in env_cors.split(",") if o.strip()] if env_cors else [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
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


ALLOWED_RESOLVE_DOMAINS = {
    "share.google",
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "google.com",
    "googleusercontent.com",
    "unsplash.com",
    "githubusercontent.com",
    "imgur.com",
}


def is_allowed_resolve_host(hostname: str) -> bool:
    """Validate that hostname strictly equals an allowed domain or is a subdomain of it."""
    if not hostname:
        return False
    host = hostname.lower()
    for domain in ALLOWED_RESOLVE_DOMAINS:
        if host == domain or host.endswith("." + domain):
            return True
    return False


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
        parsed_target = urllib.parse.urlsplit(clean_target)
        if parsed_target.scheme.lower() not in ("http", "https"):
            raise HTTPException(status_code=400, detail="Only HTTP/HTTPS URLs are permitted")

        target_host = (parsed_target.hostname or "").lower()
        if not is_allowed_resolve_host(target_host):
            raise HTTPException(status_code=400, detail="Domain not permitted for image resolution")

        # Check if already a Google Image search result with imgurl
        target_qs = urllib.parse.parse_qs(parsed_target.query)
        if "imgurl" in target_qs and target_qs["imgurl"]:
            candidate_imgurl = target_qs["imgurl"][0]
            if is_safe_public_url(candidate_imgurl):
                return {"success": True, "direct_url": candidate_imgurl, "original_url": clean_target}

        # Reconstruct sanitized request target URL breaking taint flow from raw user input
        path_part = parsed_target.path or "/"
        query_part = f"?{parsed_target.query}" if parsed_target.query else ""
        port_part = f":{parsed_target.port}" if parsed_target.port and parsed_target.port in (80, 443) else ""
        scheme = "https" if parsed_target.scheme.lower() == "https" else "http"
        safe_request_url = f"{scheme}://{target_host}{port_part}{path_part}{query_part}"

        req = urllib.request.Request(
            safe_request_url,
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
    except HTTPException:
        raise
    except Exception:
        return {"success": False, "error": "Unable to resolve target image URL", "original_url": clean_target}


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

    # Expand GitHub shorthand e.g. owner/repo or github.com/owner/repo
    if "://" not in clean_url and not clean_url.startswith("git@"):
        gh_match = re.match(
            r"^(?:(?:https?://)?(?:www\.)?github\.com/)?([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+?)(?:\.git)?/?$",
            clean_url
        )
        if gh_match:
            owner, repo = gh_match.groups()
            if not owner.startswith("-") and not repo.startswith("-"):
                clean_url = f"https://github.com/{owner}/{repo}.git"
        else:
            raise HTTPException(status_code=400, detail="Invalid repository URL format.")

    # Validate allowed protocols
    parsed_git = urllib.parse.urlparse(clean_url)
    if parsed_git.scheme not in ("https", "http", "ssh") and not clean_url.startswith("git@"):
        raise HTTPException(status_code=400, detail="Only HTTPS, HTTP, and SSH git repository URLs are supported.")

    # Determine safe root directory for destination confinement
    safe_base = os.path.normpath(os.path.realpath(os.path.expanduser("~")))
    safe_base_with_sep = safe_base if safe_base.endswith(os.sep) else safe_base + os.sep

    raw_target_dir = (req.target_dir and req.target_dir.strip()) or os.path.join(safe_base, "Documents")
    resolved_target = os.path.normpath(os.path.realpath(raw_target_dir))

    # Guard: verify target directory is bounded to safe user home or current project directory
    if not (resolved_target.startswith(safe_base_with_sep) or resolved_target == safe_base):
        cwd_base = os.path.normpath(os.path.realpath(os.getcwd()))
        cwd_base_with_sep = cwd_base if cwd_base.endswith(os.sep) else cwd_base + os.sep
        if not (resolved_target.startswith(cwd_base_with_sep) or resolved_target == cwd_base):
            raise HTTPException(
                status_code=400,
                detail="Target directory must be within your user profile or project directory."
            )

    target_dir = resolved_target

    dest_folder = (req.folder_name and req.folder_name.strip())
    if not dest_folder:
        url_stripped = clean_url.rstrip("/")
        if url_stripped.endswith(".git"):
            url_stripped = url_stripped[:-4]
        dest_folder = url_stripped.split("/")[-1] or "cloned-repo"

    # Sanitize folder name: must be strictly alphanumeric with safe punctuation
    if not re.match(r"^[A-Za-z0-9_.-]+$", dest_folder) or dest_folder in (".", "..") or dest_folder.startswith("-"):
        raise HTTPException(status_code=400, detail="Invalid target folder name.")

    # Prevent path traversal: ensure full destination path is strictly within target_dir
    target_dir_with_sep = target_dir if target_dir.endswith(os.sep) else target_dir + os.sep
    resolved_dest = os.path.normpath(os.path.realpath(os.path.join(target_dir, dest_folder)))

    if not resolved_dest.startswith(target_dir_with_sep):
        raise HTTPException(status_code=400, detail="Invalid target destination path.")

    full_dest_path = resolved_dest

    if not os.path.exists(target_dir):
        try:
            os.makedirs(target_dir, exist_ok=True)
        except Exception:
            raise HTTPException(status_code=400, detail="Cannot create destination directory")

    if os.path.exists(full_dest_path):
        try:
            if os.listdir(full_dest_path):
                raise HTTPException(status_code=400, detail=f'Folder "{dest_folder}" already exists in destination and is not empty.')
        except HTTPException:
            raise
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
    except Exception:
        return {"success": False, "error": "Git clone operation failed. Please check repository URL and network access."}

@api_router.get("/")
def root():
    """Root metadata endpoint."""
    return {
        "message": "VisualMark Studio API",
        "version": "1.2.1",
        "endpoints": {
            "health": "/health or /api/health",
            "generate": "/generate-readme or /api/generate-readme (POST)",
            "docs": "/docs"
        }
    }




# ==============================================================================
# AI Studio Agent (Multi-Provider: Gemini, OpenAI, Claude, Groq, Ollama)
# ==============================================================================
from ai_agent import (
    get_gemini_api_key,
    get_provider_api_key,
    fetch_local_workspace_context,
    fetch_repo_context_from_github,
    run_gemini_analysis,
    run_gemini_general_chat,
    run_gemini_editor_diff
)


class AiAgentAnalyzeRequest(BaseModel):
    repo_url: Optional[str] = None
    workspace_path: Optional[str] = None
    query: Optional[str] = None
    gemini_api_key: Optional[str] = None
    api_key: Optional[str] = None
    provider: Optional[str] = "gemini"
    model: Optional[str] = None
    base_url: Optional[str] = None
    github_token: Optional[str] = None
    mode: Optional[str] = "all"


class AiEditorDiffRequest(BaseModel):
    original_text: str
    instruction: str
    context_before: Optional[str] = None
    context_after: Optional[str] = None
    gemini_api_key: Optional[str] = None
    api_key: Optional[str] = None
    provider: Optional[str] = "gemini"
    model: Optional[str] = None
    base_url: Optional[str] = None
    project_memory_text: Optional[str] = None


class AiChatRequest(BaseModel):
    prompt: str
    history: Optional[List[dict]] = None
    gemini_api_key: Optional[str] = None
    api_key: Optional[str] = None
    provider: Optional[str] = "gemini"
    model: Optional[str] = None
    base_url: Optional[str] = None
    active_file: Optional[str] = None
    file_content: Optional[str] = None
    workspace_path: Optional[str] = None
    project_memory_text: Optional[str] = None


@api_router.post("/ai/agent-analyze")
def ai_agent_analyze_endpoint(req: AiAgentAnalyzeRequest):
    provider = (req.provider or "gemini").lower()
    user_key = req.api_key or req.gemini_api_key
    resolved_key = get_provider_api_key(provider, user_key)
    if provider != "ollama" and not resolved_key:
        raise HTTPException(
            status_code=400,
            detail=f"API key is required for provider '{provider}'. Please configure it in settings or the prompt."
        )

    context = {}
    # 1. Prefer local workspace scanning if directory is provided and exists
    if req.workspace_path and os.path.isdir(req.workspace_path):
        context = fetch_local_workspace_context(req.workspace_path)

    # 2. If not a local workspace, or local files empty, fall back to GitHub URL
    if not context.get("files") and not context.get("meta", {}).get("dependencies"):
        clean_repo = clean_url(req.repo_url) if req.repo_url else ""
        if clean_repo:
            context = fetch_repo_context_from_github(clean_repo, token=req.github_token)

    if not context.get("meta") and not context.get("files"):
        raise HTTPException(status_code=404, detail="Could not retrieve repository or workspace context.")

    try:
        data = run_gemini_analysis(
            context,
            api_key=resolved_key,
            provider=provider,
            model=req.model,
            base_url=req.base_url,
            user_instruction=req.query,
            mode=req.mode or "all"
        )
        return {"success": True, "data": data, "source": context.get("source", "github")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/ai/editor-diff")
def ai_editor_diff_endpoint(req: AiEditorDiffRequest):
    provider = (req.provider or "gemini").lower()
    user_key = req.api_key or req.gemini_api_key
    resolved_key = get_provider_api_key(provider, user_key)
    if provider != "ollama" and not resolved_key:
        raise HTTPException(
            status_code=400,
            detail=f"API key is required for provider '{provider}'. Please configure it in settings or the prompt."
        )
    try:
        data = run_gemini_editor_diff(
            original_text=req.original_text,
            instruction=req.instruction,
            api_key=resolved_key,
            provider=provider,
            model=req.model,
            base_url=req.base_url,
            context_before=req.context_before,
            context_after=req.context_after,
            project_memory_text=req.project_memory_text
        )
        return {"success": True, "data": data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/ai/chat")
def ai_chat_endpoint(req: AiChatRequest):
    provider = (req.provider or "gemini").lower()
    user_key = req.api_key or req.gemini_api_key
    resolved_key = get_provider_api_key(provider, user_key)
    if provider != "ollama" and not resolved_key:
        raise HTTPException(
            status_code=400,
            detail=f"API key is required for provider '{provider}'. Please configure it in settings or the prompt."
        )
    try:
        res = run_gemini_general_chat(
            req.prompt,
            req.history or [],
            api_key=resolved_key,
            provider=provider,
            model=req.model,
            base_url=req.base_url,
            active_file=req.active_file,
            file_content=req.file_content,
            workspace_path=req.workspace_path,
            project_memory_text=req.project_memory_text
        )
        return {
            "success": True,
            "reply": res.get("text", ""),
            "used_model": res.get("used_model"),
            "provider": res.get("provider", provider),
            "fallback_occurred": res.get("fallback_occurred", False)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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