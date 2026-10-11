"""
README Studio - Documentation Generation Engine
Designed with Stitch Developer Workspace principles.
Provides multi-language GitHub repo analysis, directory tree extraction,
live Shields badges, responsive hero banners, multi-package manager tabs,
macOS CLI terminal frames, structured specification tables, collapsible FAQ accordions,
and full documentation suites (Doc Pack).
"""
import os
import re
import datetime
import urllib.parse
from typing import Dict, List, Optional, Tuple
import httpx

# ==============================================================================
# 1. OFFICIAL TECH STACK BRAND MAP (Shields.io + SimpleIcons / Devicon)
# ==============================================================================
TECH_BADGE_MAP: Dict[str, Dict[str, str]] = {
    # Frontend Frameworks & Libraries
    "React": {"label": "React", "color": "20232A", "logo": "react", "logo_color": "61DAFB", "category": "Frontend"},
    "Next.js": {"label": "Next.js", "color": "000000", "logo": "nextdotjs", "logo_color": "white", "category": "Frontend"},
    "Vue": {"label": "Vue.js", "color": "35495E", "logo": "vuedotjs", "logo_color": "4FC08D", "category": "Frontend"},
    "Svelte": {"label": "Svelte", "color": "FF3E00", "logo": "svelte", "logo_color": "white", "category": "Frontend"},
    "Angular": {"label": "Angular", "color": "DD0031", "logo": "angular", "logo_color": "white", "category": "Frontend"},
    "HTML5": {"label": "HTML5", "color": "E34F26", "logo": "html5", "logo_color": "white", "category": "Frontend"},
    "CSS3": {"label": "CSS3", "color": "1572B6", "logo": "css3", "logo_color": "white", "category": "Frontend"},
    "Tailwind CSS": {"label": "Tailwind_CSS", "color": "38B2AC", "logo": "tailwindcss", "logo_color": "white", "category": "Frontend"},
    "Bootstrap": {"label": "Bootstrap", "color": "7952B3", "logo": "bootstrap", "logo_color": "white", "category": "Frontend"},
    "Vite": {"label": "Vite", "color": "646CFF", "logo": "vite", "logo_color": "FFD62E", "category": "Tooling"},
    "Webpack": {"label": "Webpack", "color": "8DD6F9", "logo": "webpack", "logo_color": "black", "category": "Tooling"},

    # Languages
    "TypeScript": {"label": "TypeScript", "color": "3178C6", "logo": "typescript", "logo_color": "white", "category": "Language"},
    "JavaScript": {"label": "JavaScript", "color": "F7DF1E", "logo": "javascript", "logo_color": "black", "category": "Language"},
    "Python": {"label": "Python", "color": "3776AB", "logo": "python", "logo_color": "white", "category": "Language"},
    "Rust": {"label": "Rust", "color": "000000", "logo": "rust", "logo_color": "white", "category": "Language"},
    "Go": {"label": "Go", "color": "00ADD8", "logo": "go", "logo_color": "white", "category": "Language"},
    "Java": {"label": "Java", "color": "ED8B00", "logo": "openjdk", "logo_color": "white", "category": "Language"},
    "C++": {"label": "C++", "color": "00599C", "logo": "cplusplus", "logo_color": "white", "category": "Language"},

    # Backend Frameworks & Runtimes
    "Node.js": {"label": "Node.js", "color": "339933", "logo": "node.js", "logo_color": "white", "category": "Backend"},
    "FastAPI": {"label": "FastAPI", "color": "005571", "logo": "fastapi", "logo_color": "white", "category": "Backend"},
    "Flask": {"label": "Flask", "color": "000000", "logo": "flask", "logo_color": "white", "category": "Backend"},
    "Django": {"label": "Django", "color": "092E20", "logo": "django", "logo_color": "white", "category": "Backend"},
    "Express": {"label": "Express.js", "color": "404D59", "logo": "express", "logo_color": "white", "category": "Backend"},
    "Spring Boot": {"label": "Spring_Boot", "color": "6DB33F", "logo": "springboot", "logo_color": "white", "category": "Backend"},
    "GraphQL": {"label": "GraphQL", "color": "E10098", "logo": "graphql", "logo_color": "white", "category": "API"},
    "Bun": {"label": "Bun", "color": "000000", "logo": "bun", "logo_color": "white", "category": "Backend"},

    # Databases & Storage
    "PostgreSQL": {"label": "PostgreSQL", "color": "316192", "logo": "postgresql", "logo_color": "white", "category": "Database"},
    "MySQL": {"label": "MySQL", "color": "4479A1", "logo": "mysql", "logo_color": "white", "category": "Database"},
    "MongoDB": {"label": "MongoDB", "color": "47A248", "logo": "mongodb", "logo_color": "white", "category": "Database"},
    "Redis": {"label": "Redis", "color": "DC382D", "logo": "redis", "logo_color": "white", "category": "Database"},
    "SQLite": {"label": "SQLite", "color": "003B57", "logo": "sqlite", "logo_color": "white", "category": "Database"},
    "Supabase": {"label": "Supabase", "color": "3ECF8E", "logo": "supabase", "logo_color": "white", "category": "Database"},

    # DevOps, Cloud & CI/CD
    "Docker": {"label": "Docker", "color": "2496ED", "logo": "docker", "logo_color": "white", "category": "DevOps"},
    "Kubernetes": {"label": "Kubernetes", "color": "326CE5", "logo": "kubernetes", "logo_color": "white", "category": "DevOps"},
    "GitHub Actions": {"label": "GitHub_Actions", "color": "2088FF", "logo": "githubactions", "logo_color": "white", "category": "CI/CD"},
    "Vercel": {"label": "Vercel", "color": "000000", "logo": "vercel", "logo_color": "white", "category": "Cloud"},
    "AWS": {"label": "AWS", "color": "232F3E", "logo": "amazonwebservices", "logo_color": "white", "category": "Cloud"},

    # Testing Frameworks
    "Pytest": {"label": "Pytest", "color": "0A9EDC", "logo": "pytest", "logo_color": "white", "category": "Testing"},
    "Jest": {"label": "Jest", "color": "C21325", "logo": "jest", "logo_color": "white", "category": "Testing"},
    "Vitest": {"label": "Vitest", "color": "6E9F18", "logo": "vitest", "logo_color": "white", "category": "Testing"},
    "Cypress": {"label": "Cypress", "color": "17202C", "logo": "cypress", "logo_color": "white", "category": "Testing"},
    "Playwright": {"label": "Playwright", "color": "2EAD33", "logo": "playwright", "logo_color": "white", "category": "Testing"},
}

# ==============================================================================
# 2. DOCUMENTATION SECTIONS SPECIFICATION
# ==============================================================================
ALL_SECTIONS = [
    {"id": "features", "label": "Features & Capability Matrix"},
    {"id": "tech_stack", "label": "Tech Stack Specification"},
    {"id": "project_structure", "label": "Project Structure"},
    {"id": "installation", "label": "Installation & Setup"},
    {"id": "usage", "label": "Usage Guide & Shortcuts"},
    {"id": "configuration", "label": "Environment & Config"},
    {"id": "architecture", "label": "Architecture & Topology"},
    {"id": "testing", "label": "Testing & QA"},
    {"id": "troubleshooting", "label": "Troubleshooting & FAQ"},
    {"id": "deployment", "label": "Deployment"},
    {"id": "contributing", "label": "Contributing & License"},
]

DEFAULT_SECTION_IDS = [s["id"] for s in ALL_SECTIONS]


# ==============================================================================
# 3. GITHUB REPOSITORY METADATA & FILE ANALYZER
# ==============================================================================
def extract_owner_repo(url: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract owner and repository name from GitHub URL."""
    if not url:
        return None, None
    m = re.search(r"github\.com/([a-zA-Z0-9_\-\.]+)/([a-zA-Z0-9_\-\.]+)", url)
    if not m:
        return None, None
    owner = m.group(1).strip()
    repo = m.group(2).rstrip("/").strip()
    if repo.endswith(".git"):
        repo = repo[:-4]
    return owner, repo


def _fetch_file_content(client: httpx.Client, owner: str, repo: str, branch: str, file_path: str) -> str:
    """Fetch raw file content from GitHub usercontent safely."""
    try:
        url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{file_path}"
        resp = client.get(url, timeout=3.5)
        if resp.status_code == 200:
            return resp.text
    except Exception:
        pass
    return ""


def _build_tree_from_git_tree(tree_items: list, max_depth: int = 2) -> str:
    """Construct a clean, professional ASCII directory tree from GitHub tree items."""
    ignore_prefixes = {
        ".git", "node_modules", ".next", "dist", "build", "__pycache__",
        ".pytest_cache", ".venv", "venv", ".vscode", ".idea", ".DS_Store"
    }

    tree = {}
    for item in tree_items:
        path = item.get("path", "")
        parts = path.split("/")
        if any(part in ignore_prefixes for part in parts):
            continue
        if len(parts) > max_depth:
            continue

        curr = tree
        for i, part in enumerate(parts):
            is_dir = (item.get("type") == "tree") or (i < len(parts) - 1)
            if part not in curr:
                curr[part] = {} if is_dir else None
            if curr[part] is not None:
                curr = curr[part]

    if not tree:
        return ""

    lines = ["."]

    def _render(node: dict, prefix: str = ""):
        items = sorted(node.keys(), key=lambda k: (node[k] is None, k.lower()))
        for idx, key in enumerate(items):
            is_last = (idx == len(items) - 1)
            connector = "└── " if is_last else "├── "
            child_prefix = "    " if is_last else "│   "
            is_dir = node[key] is not None
            display_name = f"{key}/" if is_dir else key
            lines.append(f"{prefix}{connector}{display_name}")
            if is_dir and node[key]:
                _render(node[key], prefix + child_prefix)

    _render(tree)
    if len(lines) > 35:
        lines = lines[:35] + ["└── ... (additional repository files)"]

    return "\n".join(lines)


def fetch_github_repo_metadata(url: str, custom_token: Optional[str] = None) -> dict:
    """
    Fetch comprehensive repository intelligence from GitHub API:
    - Repository metadata (stars, forks, open issues, license, topics, homepage)
    - Directory hierarchy & file trees
    - Language ecosystem, package manifests, and package managers
    """
    owner, repo = extract_owner_repo(url)
    if not owner or not repo:
        return {}

    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "README-Studio-Engine"}
    token = (custom_token and custom_token.strip()) or os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    metadata = {
        "owner": owner,
        "name": repo,
        "full_name": f"{owner}/{repo}",
        "slug": repo.lower(),
        "clone_url": f"https://github.com/{owner}/{repo}.git",
        "description": "",
        "homepage": "",
        "stars": 0,
        "forks": 0,
        "open_issues": 0,
        "license": "MIT",
        "languages": {},
        "topics": [],
        "default_branch": "main",
        "detected_tech": [],
        "package_manager": "npm",
        "directory_tree": "",
        "custom_install": None,
        "custom_usage": None,
        "custom_test": None,
        "rate_limited": False,
    }

    try:
        with httpx.Client(headers=headers, timeout=5.0) as client:
            repo_res = client.get(f"https://api.github.com/repos/{owner}/{repo}")
            if repo_res.status_code == 403:
                metadata["rate_limited"] = True
                return metadata
            elif repo_res.status_code != 200:
                return metadata

            data = repo_res.json()
            metadata["description"] = data.get("description") or ""
            metadata["homepage"] = data.get("homepage") or ""
            metadata["stars"] = data.get("stargazers_count", 0)
            metadata["forks"] = data.get("forks_count", 0)
            metadata["open_issues"] = data.get("open_issues_count", 0)
            metadata["topics"] = data.get("topics", [])
            metadata["default_branch"] = data.get("default_branch", "main")
            branch = metadata["default_branch"]

            lic = data.get("license")
            if lic and isinstance(lic, dict):
                metadata["license"] = lic.get("spdx_id") or lic.get("name") or "MIT"

            # 1. Fetch language distribution
            lang_res = client.get(f"https://api.github.com/repos/{owner}/{repo}/languages")
            if lang_res.status_code == 200:
                metadata["languages"] = lang_res.json()

            # 2. Fetch Git tree for architecture and ecosystem identification
            tree_res = client.get(
                f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
            )
            tree_paths = []
            if tree_res.status_code == 200:
                tree_data = tree_res.json()
                if "tree" in tree_data:
                    metadata["directory_tree"] = _build_tree_from_git_tree(tree_data["tree"], max_depth=2)
                    tree_paths = [t.get("path", "") for t in tree_data["tree"]]

            # 3. Detect package manager and ecosystem configs from tree paths
            if any("pnpm-lock.yaml" in p for p in tree_paths):
                metadata["package_manager"] = "pnpm"
            elif any("bun.lock" in p or "bun.lockb" in p for p in tree_paths):
                metadata["package_manager"] = "bun"
            elif any("yarn.lock" in p for p in tree_paths):
                metadata["package_manager"] = "yarn"
            elif any("poetry.lock" in p for p in tree_paths):
                metadata["package_manager"] = "poetry"
            elif any("uv.lock" in p for p in tree_paths):
                metadata["package_manager"] = "uv"
            elif any("Cargo.lock" in p for p in tree_paths):
                metadata["package_manager"] = "cargo"
            elif any("go.mod" in p for p in tree_paths):
                metadata["package_manager"] = "go"

            # 4. Detect tech stack from languages & topics
            detected = []
            for lang in metadata["languages"].keys():
                if lang in TECH_BADGE_MAP and lang not in detected:
                    detected.append(lang)

            for topic in metadata["topics"]:
                for tech_key in TECH_BADGE_MAP.keys():
                    if tech_key.lower() == topic.lower() and tech_key not in detected:
                        detected.append(tech_key)

            # 5. Detect infra & configs from tree
            if any("docker-compose" in p or "compose.yaml" in p for p in tree_paths):
                if "Docker" not in detected:
                    detected.append("Docker")
            if any("Dockerfile" in p for p in tree_paths):
                if "Docker" not in detected:
                    detected.append("Docker")
            if any(".github/workflows" in p for p in tree_paths):
                if "GitHub Actions" not in detected:
                    detected.append("GitHub Actions")
            if any("vite.config" in p for p in tree_paths):
                if "Vite" not in detected:
                    detected.append("Vite")
            if any("tailwind.config" in p for p in tree_paths):
                if "Tailwind CSS" not in detected:
                    detected.append("Tailwind CSS")
            if any("next.config" in p for p in tree_paths):
                if "Next.js" not in detected:
                    detected.append("Next.js")
            if any("tsconfig.json" in p for p in tree_paths):
                if "TypeScript" not in detected:
                    detected.append("TypeScript")

            # 6. Inspect package manifests for explicit frameworks
            pkg_json = _fetch_file_content(client, owner, repo, branch, "package.json")
            if pkg_json:
                detected.extend([t for t in ["Node.js", "JavaScript"] if t not in detected])
                if "react" in pkg_json and "React" not in detected:
                    detected.append("React")
                if "next" in pkg_json and "Next.js" not in detected:
                    detected.append("Next.js")
                if "vue" in pkg_json and "Vue" not in detected:
                    detected.append("Vue")
                if "tailwindcss" in pkg_json and "Tailwind CSS" not in detected:
                    detected.append("Tailwind CSS")
                if "typescript" in pkg_json and "TypeScript" not in detected:
                    detected.append("TypeScript")
                if "vite" in pkg_json and "Vite" not in detected:
                    detected.append("Vite")

            req_txt = _fetch_file_content(client, owner, repo, branch, "requirements.txt")
            pyproject = _fetch_file_content(client, owner, repo, branch, "pyproject.toml")
            if req_txt or pyproject:
                if "Python" not in detected:
                    detected.append("Python")
                content = (req_txt or "") + "\n" + (pyproject or "")
                if "fastapi" in content.lower() and "FastAPI" not in detected:
                    detected.append("FastAPI")
                if "flask" in content.lower() and "Flask" not in detected:
                    detected.append("Flask")
                if "django" in content.lower() and "Django" not in detected:
                    detected.append("Django")
                if "pytest" in content.lower() and "Pytest" not in detected:
                    detected.append("Pytest")

            metadata["detected_tech"] = detected

    except Exception:
        pass

    return metadata


# ==============================================================================
# 4. INFERENCE ENGINE (STITCH ARCHITECTURE & STUDIO TOOL INTEGRATIONS)
# ==============================================================================
def _build_hero_banner(
    project_name: str,
    description: str,
    theme: str = "default",
    repo_metadata: dict = None,
) -> str:
    """
    Build a modern hero banner header using the Capsule Render API (from Image & Banner Studio).
    Creates an eye-catching waving gradient with high-contrast typography.
    """
    if theme == "hacker":
        return ""

    enc_title = urllib.parse.quote(project_name or "Project")
    raw_desc = (description or "")[:85].strip()
    enc_desc = urllib.parse.quote(raw_desc)

    banner_url = (
        f"https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,70:3b82f6,100:10b981&height=220&section=header"
        f"&text={enc_title}&fontSize=42&fontAlignY=36"
        f"&desc={enc_desc}&descAlignY=60&descAlign=50"
    )

    return (
        f'<p align="center">\n'
        f'  <img src="{banner_url}" width="100%" alt="{project_name} Banner" />\n'
        f'</p>'
    )


def _build_badges(
    project_slug: str,
    repo_metadata: dict = None,
    tech_stack_items: list = None,
) -> str:
    """
    Build dynamic markdown badges combining live GitHub repo stats and brand tech shields
    (from Badge Studio).
    """
    repo_badges = []
    tech_badges = []

    # 1. Repository status & activity badges (Badge Studio)
    if repo_metadata and repo_metadata.get("full_name"):
        full_name = repo_metadata["full_name"]
        lic = repo_metadata.get("license") or "MIT"
        repo_badges.append(
            f"[![GitHub Stars](https://img.shields.io/github/stars/{full_name}?style=for-the-badge&logo=github&color=0969da)](https://github.com/{full_name}/stargazers)"
        )
        repo_badges.append(
            f"[![GitHub Forks](https://img.shields.io/github/forks/{full_name}?style=for-the-badge&logo=github&color=0969da)](https://github.com/{full_name}/network/members)"
        )
        repo_badges.append(
            f"[![Issues](https://img.shields.io/github/issues/{full_name}?style=for-the-badge&logo=github&color=e11d48)](https://github.com/{full_name}/issues)"
        )
        repo_badges.append(
            f"[![License](https://img.shields.io/badge/License-{lic}-10b981.svg?style=for-the-badge)](https://github.com/{full_name}/blob/main/LICENSE)"
        )
        repo_badges.append(
            f"[![Code Size](https://img.shields.io/github/languages/code-size/{full_name}?style=for-the-badge&color=8b5cf6)](https://github.com/{full_name})"
        )
    else:
        repo_badges.append("![Build Status](https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge)")
        repo_badges.append("![License](https://img.shields.io/badge/License-MIT-0969da?style=for-the-badge)")
        repo_badges.append("![Release](https://img.shields.io/badge/Release-v1.0.0-6366f1?style=for-the-badge)")
        repo_badges.append("![Maintenance](https://img.shields.io/badge/Maintained-Active-f59e0b?style=for-the-badge)")

    # 2. Technology brand badges with official logos (Badge Studio)
    techs = tech_stack_items or []
    for tech in techs[:8]:
        meta = TECH_BADGE_MAP.get(tech)
        if meta:
            badge_url = (
                f"https://img.shields.io/badge/{meta['label']}-{meta['color']}"
                f"?style=for-the-badge&logo={meta['logo']}&logoColor={meta['logo_color']}"
            )
            tech_badges.append(f"![{tech}]({badge_url})")

    # Combine into two cleanly spaced lines
    row1 = " ".join(repo_badges)
    row2 = " ".join(tech_badges)
    if row2:
        return f"{row1}\n<br/>\n{row2}"
    return row1


def _infer_features(
    repo_url: str,
    description: str,
    tech_stack_items: list,
    repo_metadata: dict = None,
) -> str:
    """
    Generate high-impact feature highlights formatted as modern technical cards,
    a structured capability comparison matrix (from Table Studio), and GitHub alerts (from Snippet Studio).
    """
    features = []
    features.append(
        "- **⚡ Autonomous High-Throughput Core:** Built from the ground up for low-latency execution, minimal memory overhead, and instantaneous response cycles."
    )
    features.append(
        "- **🎨 Stitch-Engineered Developer Workspace:** Polished UI/UX visual hierarchy, dark glassmorphic styling, and fluid responsive layouts."
    )

    techs = tech_stack_items or []
    if any(t in techs for t in ["FastAPI", "Express", "Node.js", "Django", "Flask"]):
        features.append(
            "- **🔒 Validated REST & API Gateways:** Strictly typed serialization schemas, automated OpenAPI/Swagger documentation, and resilient error recovery."
        )
    if any(t in techs for t in ["React", "Next.js", "Vue", "Vite"]):
        features.append(
            "- **🌐 Reactive Real-Time Client:** Reactive component tree with optimistic updates, instant state hydration, and zero layout shift."
        )
    if any(t in techs for t in ["Docker", "Kubernetes"]):
        features.append(
            "- **🐳 Containerized Orchestration:** Production-ready multi-stage Docker builds and unified compose configurations."
        )
    if any(t in techs for t in ["PostgreSQL", "MongoDB", "MySQL", "Redis"]):
        features.append(
            "- **🗄️ Resilient Persistence & Caching:** Automated connection pooling, transactional schema migrations, and high-concurrency memory caching."
        )

    features.append(
        "- **🛡️ Zero-Trust Security Posture:** Rigid input sanitation, sanitized environment configurations, and WCAG AAA contrast accessibility."
    )

    feature_body = "\n".join(features)

    # Capability Matrix Table (Table Studio)
    matrix_table = (
        "### 📊 Capability & Feature Matrix\n\n"
        "| Module / Capability | Status | Target / Protocol | Scope & Architecture |\n"
        "| :--- | :---: | :--- | :--- |\n"
        "| **Core Processing Engine** | ✅ Active | Sub-millisecond Async | High-throughput asynchronous pipeline |\n"
        "| **Reactive Web Client** | ✅ Active | React 18 / Vite HMR | Modern responsive interface with instant feedback |\n"
        "| **REST API Gateway** | ✅ Active | OpenAPI 3.1 / Pydantic | Validated request/response serialization |\n"
        "| **State & Cache Store** | ✅ Active | Redis / Memory Cache | Transient session state & distributed caching |\n"
        "| **Containerized Deploy** | ✅ Active | Multi-Stage Docker | Optimized production builds under 150MB |"
    )

    # Curated Alert Callout (Snippet Studio)
    callout = (
        "> [!NOTE]\n"
        "> **Production-Ready & Actively Maintained**\n"
        "> Seamlessly toggle between local development and containerized modes with unified environment variable flags."
    )

    return f"{feature_body}\n\n{matrix_table}\n\n{callout}"


def _infer_tech_stack(tech_stack_items: list) -> str:
    """
    Generate categorized technical stack list and a structured specification matrix table (from Table Studio).
    """
    techs = tech_stack_items or ["Python", "FastAPI", "React", "TypeScript", "Tailwind CSS", "Docker"]

    categories = {
        "Frontend & UI": [],
        "Backend & APIs": [],
        "Data & Persistence": [],
        "DevOps & Tooling": []
    }

    for t in techs:
        meta = TECH_BADGE_MAP.get(t)
        cat = meta.get("category", "") if meta else ""
        if cat in ["Frontend", "Language"] and t in ["React", "Next.js", "Vue", "Tailwind CSS", "TypeScript", "JavaScript", "HTML5", "CSS3"]:
            categories["Frontend & UI"].append(t)
        elif cat in ["Backend", "API"] or t in ["FastAPI", "Flask", "Django", "Node.js", "Express", "Go", "Rust", "Python", "Bun"]:
            categories["Backend & APIs"].append(t)
        elif cat == "Database" or t in ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Supabase"]:
            categories["Data & Persistence"].append(t)
        else:
            categories["DevOps & Tooling"].append(t)

    sections = []
    for cat_name, items in categories.items():
        if items:
            items_str = ", ".join(f"`{item}`" for item in items)
            sections.append(f"- **{cat_name}:** {items_str}")

    if not sections:
        sections = [f"- **Core Stack:** {', '.join(f'`{t}`' for t in techs)}"]

    list_block = "\n".join(sections)

    # Structured Tech Stack Specification Table (Table Studio)
    table_rows = []
    for t in techs[:7]:
        meta = TECH_BADGE_MAP.get(t, {})
        cat = meta.get("category", "Core Engine")
        table_rows.append(f"| `{t}` | {cat} | Production integration | High performance, typed architecture |")

    spec_table = (
        "### 🛠️ Architecture Specification Matrix\n\n"
        "| Technology | Layer | Role | Purpose & Implementation |\n"
        "| :--- | :--- | :--- | :--- |\n" +
        "\n".join(table_rows)
    )

    return f"{list_block}\n\n{spec_table}"


def _infer_project_structure(tech_stack_items: list, repo_metadata: dict = None) -> str:
    """Generate realistic, production-grade project directory tree tailored to tech stack."""
    if repo_metadata and repo_metadata.get("directory_tree"):
        return repo_metadata["directory_tree"]

    techs = tech_stack_items or []
    has_frontend = any(t in techs for t in ["React", "Vue", "Next.js", "Svelte", "Angular"])
    has_backend = any(t in techs for t in ["FastAPI", "Python", "Flask", "Django", "Node.js", "Express", "Go", "Rust", "Bun"])

    if has_frontend and has_backend:
        backend_name = "FastAPI / Python" if any(t in techs for t in ["FastAPI", "Python", "Flask", "Django"]) else "Express / Node"
        frontend_name = "React" if "React" in techs else ("Next.js" if "Next.js" in techs else "Frontend")
        return (
            ".\n"
            f"├── backend/                 # API server & database services ({backend_name})\n"
            "│   ├── api/                 # Endpoint controllers and route handlers\n"
            "│   ├── core/                # Configuration, security & database engine\n"
            "│   ├── models/              # Schema definitions & database entities\n"
            "│   ├── services/            # Business domain logic & data processing\n"
            "│   ├── tests/               # Automated backend test suite\n"
            "│   └── requirements.txt     # Runtime dependencies\n"
            f"├── frontend/                # Client user interface ({frontend_name})\n"
            "│   ├── src/                 # Application components, views & hooks\n"
            "│   ├── public/              # Static assets, fonts & brand media\n"
            "│   ├── package.json         # Client manifest & build scripts\n"
            "│   └── vite.config.js       # Client bundler configuration\n"
            "├── docker-compose.yml       # Multi-service container orchestration\n"
            "├── .env.example             # Environment template variables\n"
            "└── README.md                # Project documentation"
        )

    if "Next.js" in techs:
        return (
            ".\n"
            "├── app/                     # Next.js App Router (pages & server actions)\n"
            "│   ├── api/                 # Route handlers & serverless endpoints\n"
            "│   ├── layout.tsx           # Global shell & font configuration\n"
            "│   └── page.tsx             # Main landing view\n"
            "├── components/              # Reusable design system & UI components\n"
            "│   └── ui/                  # Component library primitives\n"
            "├── lib/                     # Utilities, API client & database helpers\n"
            "├── public/                  # Public assets, SVGs & icons\n"
            "├── tests/                   # Integration and component tests\n"
            "├── package.json             # Manifest, dependencies & scripts\n"
            "├── tsconfig.json            # TypeScript configuration\n"
            "├── .env.example             # Sanitized environment template\n"
            "└── README.md                # Project documentation"
        )

    if any(t in techs for t in ["FastAPI", "Flask", "Django", "Python"]):
        return (
            ".\n"
            "├── app/                     # Core application package\n"
            "│   ├── api/                 # REST endpoints & versioned route handlers\n"
            "│   ├── core/                # Configuration, security & database session\n"
            "│   ├── models/              # ORM database entities\n"
            "│   ├── schemas/             # Pydantic serialization schemas\n"
            "│   ├── services/            # Business workflows & domain operations\n"
            "│   └── main.py              # Application entry point & lifespan events\n"
            "├── tests/                   # Automated unit & integration tests\n"
            "├── Dockerfile               # Container build instructions\n"
            "├── requirements.txt         # Production runtime dependencies\n"
            "├── .env.example             # Environment configuration template\n"
            "└── README.md                # Project documentation"
        )

    return (
        ".\n"
        "├── src/                     # Core source code\n"
        "│   ├── components/          # Reusable UI / system modules\n"
        "│   ├── hooks/               # Custom state & lifecycle hooks\n"
        "│   └── utils/               # Helper utilities & data transformers\n"
        "├── tests/                   # Automated unit & integration tests\n"
        "├── public/                  # Static assets & public resources\n"
        "├── package.json             # Manifest & dependencies\n"
        "├── .env.example             # Environment configuration template\n"
        "└── README.md                # Project documentation"
    )


def _infer_prerequisites(tech_stack_items: list) -> str:
    """Infer runtime prerequisites from tech stack formatted with keyboard tags."""
    techs = tech_stack_items or []
    prereqs = []

    if any(t in techs for t in ["React", "Next.js", "Vue", "Node.js", "Vite", "TypeScript"]):
        prereqs.append("- **Node.js**: `v18.0.0+` (Recommended `v20+`) & **npm** `v9.0.0+`")
    if any(t in techs for t in ["FastAPI", "Flask", "Django", "Python"]):
        prereqs.append("- **Python**: `3.10+` (Recommended `3.11+`) & **pip**")
    if any(t in techs for t in ["Docker"]):
        prereqs.append("- **Docker Engine**: `v24.0+` & **Docker Compose**")
    if any(t in techs for t in ["Rust"]):
        prereqs.append("- **Rust & Cargo**: `latest stable`")
    if any(t in techs for t in ["Go"]):
        prereqs.append("- **Go**: `1.21+`")

    if not prereqs:
        prereqs = ["- **Git**: `2.30+`", "- **Node.js**: `18.0+`", "- **Python**: `3.10+`"]

    return "\n".join(prereqs)


def _infer_installation(tech_stack_items: list, repo_metadata: dict = None) -> str:
    """
    Generate command-line installation instructions using macOS CLI Terminal Frame
    and Multi-Package Manager & CLI Sync Tabs (from Snippet Studio).
    """
    if repo_metadata and repo_metadata.get("custom_install"):
        return repo_metadata["custom_install"]

    techs = tech_stack_items or []
    has_node = any(t in techs for t in ["React", "Next.js", "Vue", "Node.js", "Vite", "TypeScript"])
    has_python = any(t in techs for t in ["FastAPI", "Flask", "Django", "Python"])
    clone_target = repo_metadata.get("clone_url", "https://github.com/owner/project.git") if repo_metadata else "https://github.com/owner/project.git"
    slug = repo_metadata.get("slug", "project") if repo_metadata else "project"

    # 1. macOS CLI Terminal Frame (Snippet Studio)
    term_frame = (
        "```bash\n"
        f"# [zsh — 80×24]\n"
        f"$ git clone {clone_target} && cd {slug}\n"
        "➜ Verifying runtime prerequisites (Node.js / Python)... Done\n"
        "✓ Repository cloned and ready for package installation.\n"
        "```"
    )

    # 2. Multi-Package Manager Collapsible Tabs (Snippet Studio)
    pm_tabs = []
    if has_python and has_node:
        pm_tabs.append(
            "<details open>\n"
            "<summary><b>npm & pip (Standard)</b></summary>\n\n"
            "```bash\n"
            "# 1. Setup backend virtual environment & dependencies\n"
            "cd backend && pip install -r requirements.txt\n\n"
            "# 2. Setup frontend dependencies\n"
            "cd ../frontend && npm install\n"
            "```\n\n"
            "</details>"
        )
        pm_tabs.append(
            "<details>\n"
            "<summary><b>pnpm & uv (High-Speed)</b></summary>\n\n"
            "```bash\n"
            "# 1. Fast backend sync with uv\n"
            "cd backend && uv pip install -r requirements.txt\n\n"
            "# 2. Fast frontend sync with pnpm\n"
            "cd ../frontend && pnpm install\n"
            "```\n\n"
            "</details>"
        )
        pm_tabs.append(
            "<details>\n"
            "<summary><b>bun & poetry</b></summary>\n\n"
            "```bash\n"
            "# 1. Backend with poetry\n"
            "cd backend && poetry install\n\n"
            "# 2. Frontend with bun\n"
            "cd ../frontend && bun install\n"
            "```\n\n"
            "</details>"
        )
    elif has_python:
        pm_tabs.append(
            "<details open>\n"
            "<summary><b>pip</b></summary>\n\n"
            "```bash\n"
            "pip install -r requirements.txt\n"
            "```\n\n"
            "</details>"
        )
        pm_tabs.append(
            "<details>\n"
            "<summary><b>uv (Recommended)</b></summary>\n\n"
            "```bash\n"
            "uv pip install -r requirements.txt\n"
            "```\n\n"
            "</details>"
        )
        pm_tabs.append(
            "<details>\n"
            "<summary><b>poetry</b></summary>\n\n"
            "```bash\n"
            "poetry install\n"
            "```\n\n"
            "</details>"
        )
    else:
        pm_tabs.append(
            "<details open>\n"
            "<summary><b>npm</b></summary>\n\n"
            "```bash\n"
            "npm install\n"
            "```\n\n"
            "</details>"
        )
        pm_tabs.append(
            "<details>\n"
            "<summary><b>pnpm</b></summary>\n\n"
            "```bash\n"
            "pnpm install\n"
            "```\n\n"
            "</details>"
        )
        pm_tabs.append(
            "<details>\n"
            "<summary><b>yarn</b></summary>\n\n"
            "```bash\n"
            "yarn install\n"
            "```\n\n"
            "</details>"
        )
        pm_tabs.append(
            "<details>\n"
            "<summary><b>bun</b></summary>\n\n"
            "```bash\n"
            "bun install\n"
            "```\n\n"
            "</details>"
        )

    callout = (
        "> [!IMPORTANT]\n"
        "> Always duplicate `.env.example` into `.env` and fill in necessary API credentials before starting development services."
    )

    return f"{term_frame}\n\n#### Dependency Installation Across Package Managers\n\n" + "\n\n".join(pm_tabs) + f"\n\n{callout}"


def _infer_usage(tech_stack_items: list, repo_metadata: dict = None) -> str:
    """Infer primary usage and dev server launch commands."""
    if repo_metadata and repo_metadata.get("custom_usage"):
        return repo_metadata["custom_usage"]

    techs = tech_stack_items or []
    has_node = any(t in techs for t in ["React", "Next.js", "Vue", "Node.js", "Vite", "TypeScript"])
    has_python = any(t in techs for t in ["FastAPI", "Flask", "Django", "Python"])

    if has_python and has_node:
        return (
            "# Terminal 1: Launch API Backend Service\n"
            "cd backend && python -m uvicorn app:app --reload --port 8000\n\n"
            "# Terminal 2: Launch Web Frontend Client\n"
            "cd frontend && npm run dev"
        )
    elif has_python:
        return "python main.py"
    elif has_node:
        return "npm run dev"
    elif any(t in techs for t in ["Rust"]):
        return "cargo run"
    elif any(t in techs for t in ["Go"]):
        return "go run main.go"

    return "npm start"


def _infer_detailed_usage(tech_stack_items: list) -> str:
    """
    Infer detailed workflow guide with keyboard shortcuts table (from Snippet Studio)
    and interactive API documentation links.
    """
    techs = tech_stack_items or []
    has_api = any(t in techs for t in ["FastAPI", "Flask", "Django", "Express"])

    guide = (
        "1. **Launch the development servers** using the multi-service command sequence above.\n"
        "2. **Open the client application** at `http://localhost:3000` (or `http://localhost:8000`).\n"
        "3. **Experience live synchronization** via automated hot module reloading."
    )

    # Keycaps & Shortcuts Table (Snippet Studio)
    shortcuts_table = (
        "### ⌨️ Keycaps & Global Keyboard Shortcuts\n\n"
        "| Shortcut | Action | Scope |\n"
        "| :--- | :--- | :--- |\n"
        "| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd> | Open Global Command Palette | Global Application |\n"
        "| <kbd>Ctrl</kbd> + <kbd>S</kbd> / <kbd>⌘</kbd> + <kbd>S</kbd> | Save Active Document & State | Editor Workspace |\n"
        "| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Trigger Autonomous Execution | Action Runner |\n"
        "| <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd> | Format Code & Markdown | Active File |"
    )

    if has_api:
        api_section = (
            "### 📡 Interactive API Documentation\n\n"
            "- **Swagger UI:** Visit `http://localhost:8000/docs` to test all endpoints interactively.\n"
            "- **ReDoc Console:** Visit `http://localhost:8000/redoc` for detailed OpenAPI specifications."
        )
        return f"{guide}\n\n{shortcuts_table}\n\n{api_section}"

    return f"{guide}\n\n{shortcuts_table}"


def _infer_configuration(tech_stack_items: list) -> str:
    """
    Generate structured configuration specification table (from Table Studio)
    and annotated .env.example template (from Snippet Studio).
    """
    techs = tech_stack_items or []
    env_vars = [
        ("PORT", "8000", "`number`", "✅ Required", "Local server HTTP listening port"),
        ("NODE_ENV", "development", "`string`", "✅ Required", "Runtime mode (`development` | `production`)"),
    ]
    if any(t in techs for t in ["PostgreSQL", "MySQL", "MongoDB"]):
        env_vars.append(("DATABASE_URL", "postgresql://user:pass@localhost:5432/app_db", "`string`", "✅ Required", "Primary relational database connection string"))
    if any(t in techs for t in ["Redis"]):
        env_vars.append(("REDIS_URL", "redis://localhost:6379/0", "`string`", "⚪ Optional", "In-memory cache & pub/sub connection URI"))
    env_vars.append(("SECRET_KEY", "your_super_secret_key_here", "`string`", "✅ Required", "Cryptographic signing and session JWT secret"))
    env_vars.append(("LOG_LEVEL", "info", "`string`", "⚪ Optional", "Verbosity level (`debug`, `info`, `warn`, `error`)"))

    env_lines = []
    for var, default, _, req, desc in env_vars:
        req_tag = "# [Required]" if "Required" in req else "# [Optional]"
        env_lines.append(f"# {desc} {req_tag}\n{var}={default}")

    env_sample = "\n\n".join(env_lines)

    table_rows = "\n".join(
        f"| `{var}` | {vtype} | `{default}` | {req} | {desc} |"
        for var, default, vtype, req, desc in env_vars
    )

    spec_table = (
        "| Variable | Type | Default | Requirement | Description |\n"
        "| :--- | :--- | :--- | :--- | :--- |\n" +
        table_rows
    )

    callout = (
        "> [!CAUTION]\n"
        "> **Security Advisory: Protect Credentials**\n"
        "> Never commit production secrets, database credentials, or API keys to version control. Maintain private parameters in `.env.local`."
    )

    return (
        "Create a `.env` file in the root directory:\n\n"
        "```env\n"
        f"{env_sample}\n"
        "```\n\n"
        "### ⚙️ Environment Specification Table\n\n"
        f"{spec_table}\n\n"
        f"{callout}"
    )

def _infer_architecture(tech_stack_items: list) -> str:
    """
    Infer architectural pattern using structured Topology Matrix tables (from Table Studio)
    and Decoupled Principles (NO Diagram Studio / Mermaid diagrams, as per user requirement).
    """
    techs = tech_stack_items or []
    ui_tech = "Web Client"
    for t in ["React", "Next.js", "Vue", "Svelte", "Angular"]:
        if t in techs:
            ui_tech = f"{t} Interface"
            break

    api_tech = "API Gateway"
    for t in ["FastAPI", "Express", "Node.js", "Django", "Flask", "Go", "Rust"]:
        if t in techs:
            api_tech = f"{t} Service"
            break

    db_tech = "Database"
    for t in ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Supabase"]:
        if t in techs:
            db_tech = f"{t} Storage"
            break

    topology_table = (
        "### 🏛️ System Topology & Component Matrix\n\n"
        "| Layer | Component Identifier | Technology | Protocol / Transport | Architectural Boundary |\n"
        "| :--- | :--- | :--- | :--- | :--- |\n"
        f'| **Presentation Layer** | `Client["Web Client ({ui_tech})"]` | Responsive SPA / SSR | `|"HTTPS / REST"|` | Client state hydration, optimistic rendering |\n'
        f'| **API Gateway Layer** | `API["API Gateway ({api_tech})"]` | Asynchronous Service | OpenAPI / HTTP 1.1 & 2 | Route dispatching, serialization & auth tokens |\n'
        f'| **Persistence Layer** | `DB["Data Store ({db_tech})"]` | Relational Storage | TCP / Connection Pool | ACID transactions, indexed models & migrations |\n'
        '| **State & Cache Layer** | `Cache["State Cache (Redis)"]` | In-Memory Cache | Binary Socket Protocol | Session storage, rate limits & 300s TTL cache |'
    )

    dataflow_table = (
        "### 🔄 Dataflow & Pipeline Execution\n\n"
        "| Stage | Source | Destination | Transport | Payload Type | Caching Policy |\n"
        "| :--- | :--- | :--- | :--- | :--- | :--- |\n"
        '| **Client Request** | `Client["Web Client"]` | `API["API Gateway"]` | `|"HTTPS / REST"|` | JSON Payload | No-Store / ETag |\n'
        '| **Authentication** | `API["API Gateway"]` | Session Cache | Memory Query | Bearer Token | In-Memory Token Verify |\n'
        '| **Data Query** | `API["API Gateway"]` | Database Store | Pooled Connection | Parameterized SQL | Query Result Caching |\n'
        '| **Response Pipeline**| `API["API Gateway"]` | Client Browser | HTTP 200 OK | Serialized JSON | Client SWR Cache |'
    )

    principles = (
        "- **Decoupled Architecture:** Presentation logic is strictly isolated from core domain rules.\n"
        "- **Stateless Compute:** Backend workers scale horizontally behind reverse proxies without session lock-in.\n"
        "- **Predictable Data Contracts:** Strictly typed Pydantic and TypeScript definitions eliminate runtime boundary mismatches."
    )

    return f"{topology_table}\n\n{dataflow_table}\n\n{principles}"



def _infer_testing(tech_stack_items: list, repo_metadata: dict = None) -> str:
    """Infer testing commands and structured QA matrix (from Table Studio)."""
    if repo_metadata and repo_metadata.get("custom_test"):
        return repo_metadata["custom_test"]

    techs = tech_stack_items or []
    commands = []
    if any(t in techs for t in ["Python", "FastAPI", "Flask", "Django"]):
        commands.append("# Run backend test suite with coverage\npytest -v --cov=.")
    if any(t in techs for t in ["React", "Next.js", "Node.js", "Vite", "TypeScript"]):
        commands.append("# Run frontend unit & integration tests\nnpm test")
    if any(t in techs for t in ["Rust"]):
        commands.append("cargo test")
    if any(t in techs for t in ["Go"]):
        commands.append("go test -v ./...")

    cmd_block = "\n\n".join(commands) if commands else "npm test"

    qa_table = (
        "### 🧪 Testing Strategy Matrix\n\n"
        "| Test Suite | Runner / Framework | Target Scope | Coverage Target |\n"
        "| :--- | :--- | :--- | :--- |\n"
        "| **Unit Tests** | `pytest` / `vitest` | Pure functions, models, utility helpers | 90%+ code coverage |\n"
        "| **Integration Tests** | `pytest-asyncio` / `supertest` | Route handlers, auth middleware, DB transactions | All critical workflows |\n"
        "| **Lint & Formatting** | `ruff` / `eslint` / `prettier` | Syntax conformance & type-checking | 0 lint warnings |"
    )

    return f"```bash\n{cmd_block}\n```\n\n{qa_table}"


def _infer_troubleshooting(tech_stack_items: list) -> str:
    """
    Generate multi-item FAQ & troubleshooting collapsible accordions (from Snippet Studio).
    """
    return (
        "<details>\n"
        "<summary><b>Q: Port 8000 or 3000 is already in use?</b></summary>\n\n"
        "Terminate any orphaned processes occupying the port:\n\n"
        "```bash\n"
        "# macOS / Linux\n"
        "lsof -ti:8000 | xargs kill -9\n\n"
        "# Windows PowerShell\n"
        "Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process\n"
        "```\n\n"
        "</details>\n\n"
        "<details>\n"
        "<summary><b>Q: Database connection refused or timeout?</b></summary>\n\n"
        "Ensure your local PostgreSQL service or Docker container is healthy:\n\n"
        "```bash\n"
        "docker compose ps\n"
        "docker compose up -d postgres\n"
        "```\n\n"
        "</details>\n\n"
        "<details>\n"
        "<summary><b>Q: Dependencies failing or corrupted lockfile?</b></summary>\n\n"
        "Purge local lockfiles and perform a clean installation:\n\n"
        "```bash\n"
        "# Node.js / Frontend\n"
        "rm -rf node_modules package-lock.json && npm install\n\n"
        "# Python / Backend\n"
        "pip install --no-cache-dir -r requirements.txt\n"
        "```\n\n"
        "</details>\n\n"
        "> [!TIP]\n"
        "> Enable verbose logs by running with `LOG_LEVEL=debug` or appending `--verbose` to any CLI command."
    )


def _infer_deployment(tech_stack_items: list) -> str:
    """Infer deployment instructions, prioritizing Vercel, Render, and Docker."""
    return (
        "### ☁️ One-Click Cloud Deployments\n\n"
        "[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new) &nbsp; "
        "[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)\n\n"
        "### 🐳 Multi-Stage Docker Deployment\n\n"
        "```bash\n"
        "# Build and launch all services in detached container mode\n"
        "docker compose up --build -d\n\n"
        "# Inspect container cluster status\n"
        "docker compose ps\n"
        "```"
    )


# ==============================================================================
# 5. MAIN README COMPILER (DYNAMIC ORDERING & THEMES)
# ==============================================================================
def build_readme_from_inputs(
    repo_url: str = None,
    description: str = None,
    tech_stack_items: list = None,
    theme: str = "default",
    section_order: list = None,
    github_token: str = None,
) -> dict:
    """
    Build a complete README from user inputs and live GitHub metadata,
    assembling the best skeleton structure powered by Studio Tools.
    """
    repo_metadata = {}
    if repo_url:
        repo_metadata = fetch_github_repo_metadata(repo_url, custom_token=github_token)

    project_name = repo_metadata.get("name") or "My Awesome Project"
    project_name_slug = repo_metadata.get("slug") or "my-awesome-project"
    clone_url = repo_metadata.get("clone_url") or "https://github.com/username/repo.git"
    short_description = (
        repo_metadata.get("description")
        or "A modern, production-ready project built with high performance and clean architecture."
    )

    if not repo_metadata and repo_url:
        parts = repo_url.rstrip("/").split("/")
        if len(parts) >= 2:
            project_name = parts[-1].replace("-", " ").replace("_", " ").title()
            project_name_slug = parts[-1].lower()
            clone_url = repo_url.rstrip("/") + ".git"
            short_description = f"A modern solution built for {parts[-1]}."

    if description and description.strip():
        short_description = description.strip()

    combined_tech = list(tech_stack_items or [])
    for dt in repo_metadata.get("detected_tech", []):
        if dt not in combined_tech:
            combined_tech.append(dt)

    # Infer content blocks utilizing all Studio Tools
    features_text = _infer_features(repo_url, short_description, combined_tech, repo_metadata)
    tech_stack_text = _infer_tech_stack(combined_tech)
    installation_steps_text = _infer_installation(combined_tech, repo_metadata)
    usage_instructions_text = _infer_usage(combined_tech, repo_metadata)
    detailed_usage_text = _infer_detailed_usage(combined_tech)
    config_text = _infer_configuration(combined_tech)
    structure_text = _infer_project_structure(combined_tech, repo_metadata)
    architecture_text = _infer_architecture(combined_tech)
    testing_text = _infer_testing(combined_tech, repo_metadata)
    troubleshooting_text = _infer_troubleshooting(combined_tech)
    deployment_guide_text = _infer_deployment(combined_tech)
    badges_text = _build_badges(project_name_slug, repo_metadata, combined_tech)
    prerequisites_text = _infer_prerequisites(combined_tech)

    response_data = {
        "project_name": project_name,
        "project_name_slug": project_name_slug,
        "description": short_description,
        "features": features_text,
        "tech_stack": tech_stack_text,
        "clone_url": clone_url,
        "installation_steps": installation_steps_text,
        "usage_instructions": usage_instructions_text,
        "detailed_usage": detailed_usage_text,
        "configuration": config_text,
        "project_structure": structure_text,
        "architecture": architecture_text,
        "testing": testing_text,
        "troubleshooting": troubleshooting_text,
        "deployment_guide": deployment_guide_text,
        "badges": badges_text,
        "prerequisites": prerequisites_text,
        "rate_limited": repo_metadata.get("rate_limited", False),
        "repo_metadata": repo_metadata,
    }

    if not section_order:
        section_order = DEFAULT_SECTION_IDS

    dynamic_content = []

    # 1. Header & Title Block with Hero Banner (Image & Banner Studio + Badge Studio)
    if theme == "hacker":
        dynamic_content.append(
            f"```\n"
            f"███╗   ███╗██╗███╗   ██╗██╗███╗   ███╗ █████╗ ██╗\n"
            f"████╗ ████║██║████╗  ██║██║████╗ ████║██╔══██╗██║\n"
            f"██╔████╔██║██║██╔██╗ ██║██║██╔████╔██║███████║██║\n"
            f"██║╚██╔╝██║██║██║╚██╗██║██║██║╚██╔╝██║██╔══██║██║\n"
            f"██║ ╚═╝ ██║██║██║ ╚████║██║██║ ╚═╝ ██║██║  ██║███████╗\n"
            f"╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝\n"
            f"```\n\n"
            f"> **Project:** {project_name}\n"
            f"> **Overview:** {short_description}\n\n"
            f"{badges_text}"
        )
    elif theme == "minimalist":
        dynamic_content.append(f"# {project_name}\n\n> {short_description}\n\n{badges_text}")
    else:
        hero_banner = _build_hero_banner(project_name, short_description, theme, repo_metadata)
        nav_anchors = (
            "[🚀 Getting Started](#getting-started) &nbsp;•&nbsp; "
            "[✨ Features](#features) &nbsp;•&nbsp; "
            "[🛠️ Tech Stack](#tech-stack) &nbsp;•&nbsp; "
            "[🏛️ Architecture](#architecture) &nbsp;•&nbsp; "
            "[📖 Usage](#usage) &nbsp;•&nbsp; "
            "[⚙️ Configuration](#configuration) &nbsp;•&nbsp; "
            "[🔧 Troubleshooting](#troubleshooting) &nbsp;•&nbsp; "
            "[🤝 Contributing](#contributing)"
        )
        dynamic_content.append(
            f"{hero_banner}\n\n"
            f"# {project_name}\n\n"
            f"> **{short_description}**\n\n"
            f"<div align=\"center\">\n\n{badges_text}\n\n</div>\n\n"
            f"<div align=\"center\">\n\n{nav_anchors}\n\n</div>"
        )

    # 2. Render each section in configured order
    for sec_id in section_order:
        if sec_id == "features":
            if theme == "hacker":
                dynamic_content.append(f"## [0x01] FEATURES\n\n{features_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Features\n\n{features_text}")
            else:
                dynamic_content.append(f"## ✨ Features\n\n{features_text}")

        elif sec_id == "tech_stack":
            if theme == "hacker":
                dynamic_content.append(f"## [0x02] TECH STACK\n\n{tech_stack_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Tech Stack\n\n{tech_stack_text}")
            else:
                dynamic_content.append(f"## 🛠️ Tech Stack\n\n{tech_stack_text}")

        elif sec_id == "project_structure":
            if theme == "hacker":
                dynamic_content.append(f"## [0x03] DIRECTORY TREE\n\n```\n{structure_text}\n```")
            elif theme == "minimalist":
                dynamic_content.append(f"## Project Structure\n\n```\n{structure_text}\n```")
            else:
                dynamic_content.append(f"## 🏗️ Project Structure\n\n```\n{structure_text}\n```")

        elif sec_id == "installation":
            if theme == "hacker":
                dynamic_content.append(
                    f"## [0x04] INSTALLATION\n\n```bash\n# Clone & Setup\ngit clone {clone_url}\ncd {project_name_slug}\n```\n\n{installation_steps_text}"
                )
            elif theme == "minimalist":
                dynamic_content.append(
                    f"## Setup\n\n```bash\ngit clone {clone_url}\ncd {project_name_slug}\n```\n\n{installation_steps_text}"
                )
            else:
                dynamic_content.append(
                    f"## 🚀 Getting Started\n\n"
                    f"### Prerequisites\n\n"
                    f"{prerequisites_text}\n\n"
                    f"### Quick Start\n\n"
                    f"{installation_steps_text}"
                )

        elif sec_id == "usage":
            if theme == "hacker":
                dynamic_content.append(f"## [0x05] USAGE\n\n```bash\n{usage_instructions_text}\n```")
            elif theme == "minimalist":
                dynamic_content.append(f"## Usage\n\n```bash\n{usage_instructions_text}\n```")
            else:
                dynamic_content.append(
                    f"## 📖 Usage\n\n"
                    f"```bash\n{usage_instructions_text}\n```\n\n"
                    f"{detailed_usage_text}"
                )

        elif sec_id == "configuration":
            if theme == "hacker":
                dynamic_content.append(f"## [0x06] CONFIGURATION\n\n{config_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Configuration\n\n{config_text}")
            else:
                dynamic_content.append(f"## ⚙️ Configuration\n\n{config_text}")

        elif sec_id == "architecture":
            if theme == "hacker":
                dynamic_content.append(f"## [0x07] ARCHITECTURE\n\n{architecture_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Architecture\n\n{architecture_text}")
            else:
                dynamic_content.append(f"## 🏛️ Architecture\n\n{architecture_text}")

        elif sec_id == "testing":
            if theme == "hacker":
                dynamic_content.append(f"## [0x08] TESTING\n\n{testing_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Testing\n\n{testing_text}")
            else:
                dynamic_content.append(f"## 🧪 Testing\n\n{testing_text}")

        elif sec_id == "troubleshooting":
            if theme == "hacker":
                dynamic_content.append(f"## [0x09] TROUBLESHOOTING\n\n{troubleshooting_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Troubleshooting\n\n{troubleshooting_text}")
            else:
                dynamic_content.append(f"## 🔧 Troubleshooting\n\n{troubleshooting_text}")

        elif sec_id == "deployment":
            if theme == "hacker":
                dynamic_content.append(f"## [0x0A] DEPLOYMENT\n\n{deployment_guide_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Deployment\n\n{deployment_guide_text}")
            else:
                dynamic_content.append(f"## 🚢 Deployment\n\n{deployment_guide_text}")

        elif sec_id == "contributing":
            lic = repo_metadata.get("license", "MIT") if repo_metadata else "MIT"
            year = datetime.datetime.now().year
            author = repo_metadata.get("owner", "Project Maintainers & Contributors") if repo_metadata else "Project Maintainers & Contributors"

            commits_table = (
                "### 📝 Conventional Commits Reference\n\n"
                "| Type | Badge | Scope & Description |\n"
                "| :--- | :--- | :--- |\n"
                "| `feat` | `![Feat](https://img.shields.io/badge/-Feature-007ACC?style=flat-square)` | New user-facing feature or enhancement |\n"
                "| `fix` | `![Fix](https://img.shields.io/badge/-Fix-E05D44?style=flat-square)` | Bug fix or patch |\n"
                "| `docs` | `![Docs](https://img.shields.io/badge/-Docs-4C1?style=flat-square)` | Documentation adjustments only |\n"
                "| `refactor` | `![Refactor](https://img.shields.io/badge/-Refactor-9B59B6?style=flat-square)` | Code change without behavioral change |\n"
                "| `test` | `![Test](https://img.shields.io/badge/-Test-00C7B7?style=flat-square)` | Adding or fixing test suites |\n"
                "| `chore` | `![Chore](https://img.shields.io/badge/-Chore-7F8C8D?style=flat-square)` | Maintenance tasks, deps, and build tooling |"
            )

            if theme == "hacker":
                dynamic_content.append(
                    f"## [0x0B] CONTRIBUTING & LICENSE\n\n"
                    f"See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.\n"
                    f"Licensed under the {lic} License.\n"
                    f"Copyright (c) {year} {author}."
                )
            elif theme == "minimalist":
                dynamic_content.append(
                    f"## Contributing & License\n\n"
                    f"Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md).\n\n"
                    f"Released under the **{lic} License**. Copyright (c) {year} {author}."
                )
            else:
                dynamic_content.append(
                    f"## 🤝 Contributing & License\n\n"
                    f"Contributions are what make the open-source community such an amazing place to learn, inspire, and create. "
                    f"Any contributions you make are **greatly appreciated**.\n\n"
                    f"{commits_table}\n\n"
                    f"> [!TIP]\n"
                    f"> Please review [CONTRIBUTING.md](CONTRIBUTING.md) for details on code of conduct and pull request etiquette.\n\n"
                    f"### 📄 License\n\n"
                    f"Distributed under the **{lic} License**. See [`LICENSE`](./LICENSE) for full details.\n\n"
                    f"Copyright (c) {year} {author}. All rights reserved."
                )

    response_data["dynamic_markdown"] = "\n\n".join(dynamic_content)
    return response_data


# ==============================================================================
# 6. DOCUMENTATION SUITE (DOC PACK) GENERATORS (POWERED BY STUDIO TOOLS)
# ==============================================================================
def generate_contributing(project_name: str, repo_metadata: dict = None) -> str:
    """Generate a comprehensive CONTRIBUTING.md file using Studio Tools."""
    owner = repo_metadata.get("owner", "owner") if repo_metadata else "owner"
    repo = repo_metadata.get("name", project_name.lower().replace(" ", "-")) if repo_metadata else project_name.lower().replace(" ", "-")

    return f"""# Contributing to {project_name} 🤝

First off, thank you for considering contributing to **{project_name}**! 🎉

Every contribution—whether it is a bug report, feature enhancement, code optimization, or documentation patch—is deeply valued.

<p align="left">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Conventional-Commits-FE5196?style=for-the-badge&logo=conventionalcommits&logoColor=white" alt="Conventional Commits" />
</p>

---

## 📜 Code of Conduct

> [!NOTE]
> By participating in this project, you agree to uphold an inclusive, respectful, and harassment-free environment for all contributors, maintainers, and community members.

---

## 🐛 Bug Reports & Feature Proposals

### 1. Reporting Bugs
- Search existing GitHub issues to verify the bug has not already been tracked.
- If unfiled, open a new **Bug Report** with:
  - Clear steps to reproduce the defect.
  - Expected behavior vs. actual outcome.
  - Runtime environment details (Node version, Python version, OS).
  - Terminal console error traces or screenshots.

### 2. Proposing Features
- Open an **Enhancement Proposal** issue to discuss the motivation and design before starting work.
- Outline user benefits, edge cases, and proposed architectural approach.

---

## 📝 Conventional Commits Specification

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification for automated semantic versioning:

| Type | Badge | Description |
| :--- | :--- | :--- |
| `feat` | `![Feat](https://img.shields.io/badge/-Feature-007ACC?style=flat-square)` | A new user-facing capability |
| `fix` | `![Fix](https://img.shields.io/badge/-Fix-E05D44?style=flat-square)` | A bug fix or critical patch |
| `docs` | `![Docs](https://img.shields.io/badge/-Docs-4C1?style=flat-square)` | Documentation adjustments only |
| `style` | `![Style](https://img.shields.io/badge/-Style-FFB13B?style=flat-square)` | Formatting or whitespace adjustments |
| `refactor` | `![Refactor](https://img.shields.io/badge/-Refactor-9B59B6?style=flat-square)` | Code restructuring without behavior change |
| `perf` | `![Perf](https://img.shields.io/badge/-Performance-FF8000?style=flat-square)` | Optimization that improves runtime throughput |
| `test` | `![Test](https://img.shields.io/badge/-Test-00C7B7?style=flat-square)` | Adding or correcting automated tests |
| `chore` | `![Chore](https://img.shields.io/badge/-Chore-7F8C8D?style=flat-square)` | Build tooling, dependency, or config updates |

---

## 🚀 Git Branching & Pull Request Workflow

Follow this standard developer workflow using the terminal frame below:

```bash
# [zsh — 80×24]
# 1. Fork repository and checkout dedicated feature branch
$ git checkout -b feat/my-awesome-feature

# 2. Make atomic changes, run test suites, and commit
$ git add .
$ git commit -m "feat(core): implement high-throughput asynchronous pipeline"

# 3. Rebase onto latest upstream main and push branch
$ git fetch origin
$ git rebase origin/main
$ git push origin feat/my-awesome-feature
```

> [!IMPORTANT]
> Ensure all local test suites and linters pass with zero warnings before requesting review:
> ```bash
> npm test        # Frontend test suite
> pytest -v       # Backend test suite
> ```

Thank you for helping make **{project_name}** extraordinary! ❤️
"""


def generate_setup(project_name: str, tech_stack_items: list = None, repo_metadata: dict = None) -> str:
    """Generate a dedicated SETUP.md guide with ports, multi-PM steps, and troubleshooting."""
    techs = tech_stack_items or []
    has_node = any(t in techs for t in ["React", "Next.js", "Vue", "Node.js", "Vite", "TypeScript"])
    has_python = any(t in techs for t in ["FastAPI", "Flask", "Django", "Python"])
    prereqs = _infer_prerequisites(techs)

    return f"""# Setup & Local Development Guide: {project_name} 💻

This guide provides end-to-end instructions for configuring your local development workstation, configuring environment parameters, and running {project_name}.

---

## 📋 System Prerequisites

Ensure you have the following runtimes and tools active on your workstation:

{prereqs}
- **Git**: `2.30+`

---

## 🔌 Default Service Ports & Endpoints

| Service | Protocol | Default URL / Port | Role & Responsibility |
| :--- | :--- | :--- | :--- |
| **Web Frontend Client** | HTTP | `http://localhost:3000` | User interface and live hot-reloader |
| **REST API Backend** | HTTP | `http://localhost:8000` | Primary application REST endpoints |
| **OpenAPI Swagger UI** | HTTP | `http://localhost:8000/docs` | Interactive API documentation console |
| **ReDoc Specification** | HTTP | `http://localhost:8000/redoc` | OpenAPI schema reference |
| **PostgreSQL / Storage**| TCP | `localhost:5432` | Relational persistent database |
| **Redis Cache** | TCP | `localhost:6379` | In-memory cache & session store |

---

## 🛠️ Step-by-Step Local Setup

### 1. Clone Working Tree
```bash
git clone https://github.com/owner/project.git
cd project
```

### 2. Configure Environment Parameters
```bash
cp .env.example .env
```

> [!TIP]
> Open `.env` and verify database connection strings and secrets before launching services.

### 3. Multi-Package Manager Installation

<details open>
<summary><b>npm & pip (Standard)</b></summary>

```bash
# Backend installation
cd backend && pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000

# In a separate terminal: Frontend installation
cd frontend && npm install
npm run dev
```

</details>

<details>
<summary><b>pnpm & uv (Blazing Fast)</b></summary>

```bash
# Backend installation
cd backend && uv pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000

# Frontend installation
cd frontend && pnpm install
pnpm dev
```

</details>

---

## 🐳 Docker Container Quickstart

To launch the full containerized cluster with persistent volume mounts:

```bash
# Build images and start services in background
docker compose up --build -d

# Inspect live cluster health
docker compose ps
```

---

## 🔧 Troubleshooting FAQ

<details>
<summary><b>Port 8000 or 3000 Conflict?</b></summary>

```bash
# Terminate lingering processes on port 8000
lsof -ti:8000 | xargs kill -9
```

</details>

<details>
<summary><b>Database Authentication Failure?</b></summary>

Verify that PostgreSQL credentials in `.env` match those declared in `docker-compose.yml`.

</details>
"""


def generate_architecture(project_name: str, tech_stack_items: list = None, repo_metadata: dict = None) -> str:
    """
    Generate a comprehensive ARCHITECTURE.md file using structured Topology Matrix tables
    (from Table Studio).
    Notice: Excludes Diagram Studio / Mermaid diagrams as instructed.
    """
    techs = tech_stack_items or ["React", "FastAPI", "PostgreSQL", "Docker"]

    return f"""# System Architecture: {project_name} 🏛️

<!-- System diagrams can be visually designed and updated using the Mermaid Diagram Studio (mermaid) -->

This document details the architectural topology, data pipelines, layer boundaries, and reliability principles governing **{project_name}**.

---

## 🗺️ Architectural Layer Topology

| Tier | Component / Module | Technology Stack | Transport / Protocol | Key Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| **Client Presentation Layer** | Web Application SPA | React 18 / TypeScript / Vite | HTTPS / JSON REST | Responsive user interface, client routing, optimistic state hydration |
| **API & Routing Gateway** | REST Service Gateway | FastAPI / Python 3.11 | OpenAPI 3.1 / HTTP 2 | Request routing, Pydantic validation, CORS & auth token verification |
| **Domain Logic Layer** | Business Services Engine | Asynchronous Workers | Internal Python Modules | Data processing, schema synthesis, business validation workflows |
| **Data & Persistence Layer**| Primary Database | PostgreSQL / Connection Pool | TCP Wire Protocol | ACID transactional persistence, indexed models & automated schema migrations |
| **Caching & Session Layer** | Memory State Store | Redis Cache | Redis Protocol | Sub-millisecond session validation, rate limiting & 300s TTL cache |

---

## 🔄 End-to-End Request Lifecycle Pipeline

| Step | Initiator | Target Component | Protocol | Description & Error Boundary |
| :--- | :--- | :--- | :--- | :--- |
| **1. Inbound Request** | Client Browser | API Gateway | HTTPS | User dispatches action; TLS terminated at edge |
| **2. Auth & Validation**| API Gateway | Security Middleware | Internal | Bearer JWT parsed; schema checked against typed contract |
| **3. Cache Lookup** | API Gateway | Redis Store | TCP | Checks for cached response key; on hit, returns immediately |
| **4. Domain Execution** | API Gateway | Domain Service | Async Call | Core business execution executed in thread-pool |
| **5. Data Query** | Domain Service | PostgreSQL DB | Pooled SQL | Parameterized SQL query executed within transactional session |
| **6. Cache Writeback** | Domain Service | Redis Store | Async Pipe | Fresh data serialized and stored with time-to-live |
| **7. Outbound Response**| API Gateway | Client Browser | HTTP 200 OK | Serialized JSON payload returned with security headers |

---

## 🏗️ Directory Boundary Architecture

| Directory / Package | Architectural Role | Boundary Rules & Constraints |
| :--- | :--- | :--- |
| `backend/api/` | Route Controllers | Responsible only for HTTP serialization and parameter parsing |
| `backend/core/` | System Configuration | Houses environment variables, security tokens, and DB engines |
| `backend/models/`| Data Schema Entities | Declares persistent entities; strictly isolated from presentation |
| `backend/services/`| Domain Logic | Houses reusable business workflows; fully decoupled and testable |
| `frontend/src/components/`| Presentation Units | UI components with predictable props and zero direct network calls |
| `frontend/src/utils/`| Client Transformers | Pure functions for data formatting, export, and client validations |

---

## 🛡️ Security & Reliability Principles

1. **Strict Input Sanitization:** Every inbound payload is validated against strict Pydantic models before execution.
2. **Stateless Compute:** Backend nodes maintain zero sticky session state, enabling rapid auto-scaling behind reverse proxies.
3. **Least Privilege Governance:** Database credentials and external secrets are injected exclusively via sanitized environment variables.
4. **Resilient Degradation:** In the event of external service rate limits or timeouts, fallback heuristic models maintain operational uptime.
"""


def generate_license(project_name: str = "Project Contributors", repo_metadata: dict = None) -> str:
    """Generate a standard MIT LICENSE file with dynamic year and repository owner."""
    year = datetime.datetime.now().year
    author = repo_metadata.get("owner", project_name) if repo_metadata else project_name

    return f"""MIT License

Copyright (c) {year} {author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""


def generate_changelog(project_name: str = "Project", repo_metadata: dict = None) -> str:
    """Generate a clean Keep-a-Changelog formatted CHANGELOG.md file."""
    today = datetime.date.today().isoformat()
    return f"""# Changelog: {project_name} 📦

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]
### Added
- Advanced developer tooling and comprehensive documentation suites.
- Automated pipeline integrations and continuous test suites.

## [1.0.0] - {today}
### Added
- Initial project release and core architecture implementation.
- Production environment configurations and multi-platform support.
- Fully documented API contracts, setup procedures, and contributing guidelines.
"""
