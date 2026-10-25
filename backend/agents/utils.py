"""
VisualMark Studio — Agent Utilities & Gemini Integration Engine
Provides workspace inspection, GitHub context extraction, model failover, and JSON parsing.
"""

import os
import json
import re
import httpx
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

load_dotenv()

PREFERRED_MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
]


def get_gemini_api_key(custom_key: Optional[str] = None) -> Optional[str]:
    """Retrieve Gemini API key from request or environment."""
    if custom_key and custom_key.strip():
        return custom_key.strip()
    return os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")


def find_project_root(start_path: str) -> str:
    """Find the root directory of a project by searching upwards for key project manifests or .git."""
    if not start_path or not os.path.exists(start_path):
        return start_path
    curr = os.path.abspath(start_path)
    if os.path.isfile(curr):
        curr = os.path.dirname(curr)
    indicators = [
        "package.json", "requirements.txt", "pyproject.toml",
        "Cargo.toml", "go.mod", ".git", "docker-compose.yml"
    ]
    for _ in range(4):
        if any(os.path.exists(os.path.join(curr, ind)) for ind in indicators):
            return curr
        parent = os.path.dirname(curr)
        if parent == curr:
            break
        curr = parent
    return start_path


def fetch_local_workspace_context(folder_path: str) -> dict:
    """Scan local directory on disk for manifests, file structure, and project metadata."""
    if not folder_path or not os.path.exists(folder_path):
        return {"error": f"Directory not found: {folder_path}", "files": {}, "meta": {}}

    folder_path = find_project_root(folder_path)
    folder_name = os.path.basename(os.path.abspath(folder_path))
    context = {
        "source": "local_workspace",
        "slug": folder_name,
        "files": {},
        "meta": {"name": folder_name, "is_local": True}
    }

    # 1. Check git remote & branch if available
    git_config_path = os.path.join(folder_path, ".git", "config")
    if os.path.isfile(git_config_path):
        try:
            with open(git_config_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                match = re.search(r'url\s*=\s*(.+)', content)
                if match:
                    remote_url = match.group(1).strip()
                    context["meta"]["remote_git_url"] = remote_url
                    gh_match = re.search(r'github\.com[/:]([^/]+/[^/\.]+)', remote_url)
                    if gh_match:
                        context["slug"] = gh_match.group(1)
        except Exception:
            pass

    git_head_path = os.path.join(folder_path, ".git", "HEAD")
    if os.path.isfile(git_head_path):
        try:
            with open(git_head_path, "r", encoding="utf-8", errors="ignore") as f:
                head_content = f.read().strip()
                if head_content.startswith("ref: refs/heads/"):
                    context["meta"]["git_branch"] = head_content.replace("ref: refs/heads/", "")
        except Exception:
            pass

    # 2. Key manifests and license files to inspect
    manifest_candidates = [
        "package.json", "frontend/package.json",
        "requirements.txt", "pyproject.toml",
        "Cargo.toml", "go.mod", "pom.xml",
        ".env.example", "docker-compose.yml",
        "README.md", "LICENSE", "LICENSE.md"
    ]
    for rel_path in manifest_candidates:
        full_path = os.path.join(folder_path, rel_path)
        if os.path.isfile(full_path):
            try:
                with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read(3500)
                    context["files"][rel_path] = content

                    if rel_path.endswith("package.json"):
                        try:
                            pkg = json.loads(content)
                            if pkg.get("name") and "name" not in context["meta"]:
                                context["meta"]["name"] = pkg["name"]
                            if pkg.get("description") and "description" not in context["meta"]:
                                context["meta"]["description"] = pkg["description"]
                            if pkg.get("version") and "version" not in context["meta"]:
                                context["meta"]["version"] = pkg["version"]
                            if pkg.get("license") and "license" not in context["meta"]:
                                context["meta"]["license"] = pkg["license"]
                            if pkg.get("dependencies"):
                                context["meta"]["dependencies"] = list(pkg["dependencies"].keys())[:20]
                            if pkg.get("devDependencies"):
                                context["meta"]["devDependencies"] = list(pkg["devDependencies"].keys())[:20]
                        except Exception:
                            pass

                    elif rel_path == "requirements.txt":
                        req_lines = [
                            re.split(r'[=><~]', line)[0].strip()
                            for line in content.splitlines()
                            if line.strip() and not line.strip().startswith("#")
                        ]
                        if req_lines:
                            context["meta"]["python_dependencies"] = req_lines[:20]

                    elif rel_path in ("LICENSE", "LICENSE.md") and "license" not in context["meta"]:
                        if "MIT" in content:
                            context["meta"]["license"] = "MIT"
                        elif "Apache" in content:
                            context["meta"]["license"] = "Apache-2.0"
                        elif "General Public License" in content or "GPL" in content:
                            context["meta"]["license"] = "GPL-3.0"
                        elif "BSD" in content:
                            context["meta"]["license"] = "BSD"
            except Exception:
                pass

    # 3. Directory layout (tree preview, 2 levels deep)
    ignore_dirs = {".git", "node_modules", "dist", "build", "__pycache__", "venv", ".venv", ".next", ".cache", "release"}
    tree_lines = [f"{folder_name}/"]
    try:
        for entry in sorted(os.scandir(folder_path), key=lambda e: (not e.is_dir(), e.name.lower()))[:25]:
            if entry.name in ignore_dirs or entry.name.startswith("."):
                continue
            if entry.is_dir():
                tree_lines.append(f"├── {entry.name}/")
                try:
                    for sub in sorted(os.scandir(entry.path), key=lambda e: (not e.is_dir(), e.name.lower()))[:6]:
                        if sub.name in ignore_dirs or sub.name.startswith("."):
                            continue
                        slash = "/" if sub.is_dir() else ""
                        tree_lines.append(f"│   ├── {sub.name}{slash}")
                except Exception:
                    pass
            else:
                tree_lines.append(f"├── {entry.name}")
        context["meta"]["directory_tree_sample"] = "\n".join(tree_lines)
    except Exception:
        pass

    return context


def fetch_repo_context_from_github(repo_slug: str, token: Optional[str] = None) -> dict:
    """Fetch repository metadata and manifests via GitHub API."""
    clean_slug = repo_slug.strip().replace("https://github.com/", "").rstrip("/")
    if clean_slug.endswith(".git"):
        clean_slug = clean_slug[:-4]

    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "VisualMark-AI-Agent"
    }
    if token:
        headers["Authorization"] = f"token {token}"

    context = {"slug": clean_slug, "files": {}, "meta": {}}

    try:
        with httpx.Client(headers=headers, timeout=12.0) as client:
            meta_res = client.get(f"https://api.github.com/repos/{clean_slug}")
            if meta_res.status_code == 200:
                m = meta_res.json()
                context["meta"] = {
                    "name": m.get("name"),
                    "description": m.get("description"),
                    "stars": m.get("stargazers_count", 0),
                    "forks": m.get("forks_count", 0),
                    "license": m.get("license", {}).get("spdx_id") if m.get("license") else "None",
                    "language": m.get("language"),
                    "topics": m.get("topics", [])
                }

            for filename in ["package.json", "frontend/package.json", "requirements.txt", "Cargo.toml", "go.mod"]:
                for branch in ["main", "master"]:
                    url = f"https://raw.githubusercontent.com/{clean_slug}/{branch}/{filename}"
                    file_res = client.get(url)
                    if file_res.status_code == 200:
                        context["files"][filename] = file_res.text[:2500]
                        break
                if context["files"]:
                    break
    except Exception as e:
        context["error"] = str(e)

    return context


def extract_json_from_llm(text: str) -> dict:
    """Robustly extract JSON object from LLM response even with conversational preambles or code fences."""
    text = text.strip()
    try:
        return json.loads(text)
    except Exception:
        pass
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if fence_match:
        try:
            return json.loads(fence_match.group(1).strip())
        except Exception:
            pass
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start:end+1])
        except Exception:
            pass
    raise ValueError(f"Could not parse valid JSON from LLM response: {text[:150]}")


def call_gemini_with_fallback(payload: dict, api_key: str, timeout: float = 90.0) -> dict:
    """Execute Gemini request with automatic failover across models to survive 503 high demand spikes."""
    last_error = None
    with httpx.Client(timeout=timeout) as client:
        for model in PREFERRED_MODELS:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            try:
                res = client.post(url, json=payload)
                if res.status_code == 200:
                    return res.json()
                last_error = f"Model {model} returned {res.status_code}: {res.text}"
                continue
            except httpx.RequestError as exc:
                last_error = f"Model {model} network error: {exc}"
                continue

    raise RuntimeError(f"All Gemini models exhausted. Last error: {last_error}")
