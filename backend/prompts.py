"""
VisualMark Studio - Next-Generation Documentation Engine
Modular, context-aware Markdown and Doc Pack generator.
Performs repository metadata extraction, multi-language detection, domain-specific NLP heuristics,
and generates tailored, non-generic README documents across 6 distinct themes:
  - modern / default: Professional Technical Workspace & Developer Documentation
  - showcase: Startup Product Landing & Feature Showcase
  - minimalist: Clean, Compact & Distraction-Free
  - cli: Developer CLI & System Utility with Terminal Mockups
  - hacker: Cyberpunk Matrix ASCII Art & Hex-Indexed Headers
  - academic: Research Paper, Formal Specifications & BibTeX Citations
"""

import os
import re
import datetime
import urllib.parse
from typing import Dict, List, Optional, Tuple, Any
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
    "Electron": {"label": "Electron", "color": "47848F", "logo": "electron", "logo_color": "white", "category": "Desktop"},

    # Languages
    "TypeScript": {"label": "TypeScript", "color": "3178C6", "logo": "typescript", "logo_color": "white", "category": "Language"},
    "JavaScript": {"label": "JavaScript", "color": "F7DF1E", "logo": "javascript", "logo_color": "black", "category": "Language"},
    "Python": {"label": "Python", "color": "3776AB", "logo": "python", "logo_color": "white", "category": "Language"},
    "Rust": {"label": "Rust", "color": "000000", "logo": "rust", "logo_color": "white", "category": "Language"},
    "Go": {"label": "Go", "color": "00ADD8", "logo": "go", "logo_color": "white", "category": "Language"},
    "Java": {"label": "Java", "color": "ED8B00", "logo": "openjdk", "logo_color": "white", "category": "Language"},
    "C++": {"label": "C++", "color": "00599C", "logo": "cplusplus", "logo_color": "white", "category": "Language"},
    "C#": {"label": "C_Sharp", "color": "239120", "logo": "csharp", "logo_color": "white", "category": "Language"},
    "Kotlin": {"label": "Kotlin", "color": "7F52FF", "logo": "kotlin", "logo_color": "white", "category": "Language"},
    "Swift": {"label": "Swift", "color": "FA7343", "logo": "swift", "logo_color": "white", "category": "Language"},

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

    # AI, ML & Data
    "PyTorch": {"label": "PyTorch", "color": "EE4C2C", "logo": "pytorch", "logo_color": "white", "category": "AI/ML"},
    "TensorFlow": {"label": "TensorFlow", "color": "FF6F00", "logo": "tensorflow", "logo_color": "white", "category": "AI/ML"},
    "LangChain": {"label": "LangChain", "color": "1C3C3C", "logo": "langchain", "logo_color": "white", "category": "AI/ML"},
    "OpenAI": {"label": "OpenAI", "color": "412991", "logo": "openai", "logo_color": "white", "category": "AI/ML"},

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

_SAFE_IDENTIFIER_REGEX = re.compile(r"^[a-zA-Z0-9_\-\.]+$")
_SAFE_PATH_REGEX = re.compile(r"^[a-zA-Z0-9_\-\./]+$")


# ==============================================================================
# 2. GITHUB REPOSITORY METADATA & TREE EXTRACTOR
# ==============================================================================
def extract_owner_repo(url: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract and validate owner and repository name from GitHub URL."""
    if not url or not isinstance(url, str):
        return None, None
    m = re.search(r"github\.com/([a-zA-Z0-9_\-\.]+)/([a-zA-Z0-9_\-\.]+)", url)
    if not m:
        return None, None
    owner = m.group(1).strip()
    repo = m.group(2).rstrip("/").strip()
    if repo.endswith(".git"):
        repo = repo[:-4]
    if not _SAFE_IDENTIFIER_REGEX.match(owner) or not _SAFE_IDENTIFIER_REGEX.match(repo) or ".." in owner or ".." in repo:
        return None, None
    return urllib.parse.quote(owner, safe=""), urllib.parse.quote(repo, safe="")


def _fetch_file_content(client: httpx.Client, owner: str, repo: str, branch: str, file_path: str) -> str:
    """Fetch raw file content from GitHub usercontent safely."""
    if not _SAFE_IDENTIFIER_REGEX.match(owner) or not _SAFE_IDENTIFIER_REGEX.match(repo):
        return ""
    if not _SAFE_PATH_REGEX.match(branch) or not _SAFE_PATH_REGEX.match(file_path) or ".." in branch or ".." in file_path:
        return ""
    try:
        safe_owner = urllib.parse.quote(owner, safe="")
        safe_repo = urllib.parse.quote(repo, safe="")
        safe_branch = urllib.parse.quote(branch, safe="/")
        safe_path = urllib.parse.quote(file_path, safe="/")
        url = f"https://raw.githubusercontent.com/{safe_owner}/{safe_repo}/{safe_branch}/{safe_path}"
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

    tree: Dict[str, Any] = {}
    for item in tree_items:
        path = item.get("path", "")
        parts = path.split("/")
        if any(part in ignore_prefixes for part in parts):
            continue
        if len(parts) > max_depth + 1:
            continue

        curr = tree
        for part in parts:
            if part not in curr:
                curr[part] = {}
            curr = curr[part]

    lines = ["."]

    def render(node: dict, prefix: str = ""):
        keys = sorted(node.keys())
        for idx, k in enumerate(keys):
            is_last = (idx == len(keys) - 1)
            connector = "└── " if is_last else "├── "
            child_prefix = "    " if is_last else "│   "
            lines.append(f"{prefix}{connector}{k}")
            if node[k]:
                render(node[k], prefix + child_prefix)

    render(tree)
    return "\n".join(lines[:35])


def fetch_github_repo_metadata(repo_url: str, custom_token: str = None) -> dict:
    """Query GitHub API to extract repository details, language breakdown, and tech stack."""
    owner, repo = extract_owner_repo(repo_url)
    if not owner or not repo:
        return {}

    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "VisualMark-Studio-Engine/1.1.1",
    }
    token = custom_token or os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token.strip()}"

    metadata = {
        "owner": owner,
        "name": repo,
        "slug": repo.lower(),
        "full_name": f"{owner}/{repo}",
        "clone_url": f"https://github.com/{owner}/{repo}.git",
        "detected_tech": [],
        "languages": {},
        "tree_structure": "",
        "rate_limited": False,
    }

    try:
        with httpx.Client(headers=headers, timeout=5.0) as client:
            resp = client.get(f"https://api.github.com/repos/{owner}/{repo}")
            if resp.status_code == 403 and "rate limit" in resp.text.lower():
                metadata["rate_limited"] = True
                return metadata
            if resp.status_code != 200:
                return metadata

            data = resp.json()
            metadata["name"] = data.get("name") or repo
            metadata["slug"] = metadata["name"].lower()
            metadata["description"] = data.get("description") or ""
            metadata["stars"] = data.get("stargazers_count", 0)
            metadata["forks"] = data.get("forks_count", 0)
            metadata["open_issues"] = data.get("open_issues_count", 0)
            metadata["license"] = data.get("license", {}).get("spdx_id") if data.get("license") else "MIT"
            metadata["default_branch"] = data.get("default_branch") or "main"
            branch = metadata["default_branch"]

            # Languages
            lang_resp = client.get(f"https://api.github.com/repos/{owner}/{repo}/languages")
            if lang_resp.status_code == 200:
                metadata["languages"] = lang_resp.json()

            # Tree
            tree_resp = client.get(f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1")
            tree_paths = []
            if tree_resp.status_code == 200:
                t_data = tree_resp.json()
                items = t_data.get("tree", [])
                metadata["tree_structure"] = _build_tree_from_git_tree(items, max_depth=2)
                tree_paths = [it.get("path", "") for it in items]

            # Detect Tech
            detected = []
            for lang in metadata["languages"].keys():
                if lang in TECH_BADGE_MAP and lang not in detected:
                    detected.append(lang)

            detection_rules = [
                ("Dockerfile", "Docker"),
                ("docker-compose", "Docker"),
                (".github/workflows", "GitHub Actions"),
                ("vite.config", "Vite"),
                ("tailwind.config", "Tailwind CSS"),
                ("next.config", "Next.js"),
                ("tsconfig.json", "TypeScript"),
                ("Cargo.toml", "Rust"),
                ("go.mod", "Go"),
            ]
            for needle, tech in detection_rules:
                if any(needle in p for p in tree_paths) and tech not in detected:
                    detected.append(tech)

            # Inspect package manifests
            pkg_json = _fetch_file_content(client, owner, repo, branch, "package.json")
            if pkg_json:
                for tech in ["Node.js", "JavaScript"]:
                    if tech not in detected:
                        detected.append(tech)
                pkg_map = {
                    "react": "React",
                    "next": "Next.js",
                    "vue": "Vue",
                    "tailwindcss": "Tailwind CSS",
                    "typescript": "TypeScript",
                    "vite": "Vite",
                    "electron": "Electron",
                    "express": "Express",
                    "cypress": "Cypress",
                    "playwright": "Playwright",
                    "jest": "Jest",
                    "vitest": "Vitest",
                }
                for pkg_key, tech_name in pkg_map.items():
                    if pkg_key in pkg_json and tech_name not in detected:
                        detected.append(tech_name)

            req_txt = _fetch_file_content(client, owner, repo, branch, "requirements.txt")
            pyproject = _fetch_file_content(client, owner, repo, branch, "pyproject.toml")
            if req_txt or pyproject:
                if "Python" not in detected:
                    detected.append("Python")
                content = (req_txt or "").lower() + "\n" + (pyproject or "").lower()
                py_map = {
                    "fastapi": "FastAPI",
                    "flask": "Flask",
                    "django": "Django",
                    "pytest": "Pytest",
                    "torch": "PyTorch",
                    "tensorflow": "TensorFlow",
                    "langchain": "LangChain",
                    "openai": "OpenAI",
                }
                for py_key, tech_name in py_map.items():
                    if py_key in content and tech_name not in detected:
                        detected.append(tech_name)

            metadata["detected_tech"] = detected
    except Exception:
        pass

    return metadata


# ==============================================================================
# 3. DOMAIN INTELLIGENCE & HEURISTIC ENGINE (ANTI-GENERIC REASONING)
# ==============================================================================
def detect_project_domain(
    name: str,
    description: str,
    tech_stack: List[str],
    tree_text: str = ""
) -> str:
    """
    Intelligently classify project into an architectural domain to drive non-generic content:
      - ai_ml: Machine learning, LLMs, neural networks, agents, embeddings
      - devtools_ide: Code editors, compilers, parsers, linters, developer tools
      - web_fullstack: Web SaaS platforms, interactive portals, dashboards
      - api_backend: Microservices, REST/GraphQL gateways, backend engines
      - cli_tool: Command-line utilities, terminal tools, automation scripts
      - library_sdk: Component packages, client libraries, utilities
      - general: Fallback software engineering domain
    """
    corpus = f"{name} {description} {' '.join(tech_stack)} {tree_text}".lower()

    if any(k in corpus for k in ["llm", "gpt", "agent", "embedding", "pytorch", "tensorflow", "neural", "langchain", "prompt", "model", "inference"]):
        return "ai_ml"
    if any(k in corpus for k in ["ide", "editor", "compiler", "parser", "linter", "ast", "studio", "extension", "monaco", "markdown", "syntax"]):
        return "devtools_ide"
    if any(k in corpus for k in ["cli", "terminal", "command line", "subcommand", "stdout", "argv", "typer", "click"]):
        return "cli_tool"
    if any(k in corpus for k in ["sdk", "client library", "package", "component library", "crate", "gem"]):
        return "library_package"
    if any(k in corpus for k in ["microservice", "gateway", "rest api", "graphql", "fastapi", "django", "express", "endpoint", "grpc"]):
        return "api_backend"
    if any(k in corpus for k in ["saas", "dashboard", "portal", "react", "next.js", "vue", "svelte", "frontend", "web app", "ui"]):
        return "web_fullstack"

    return "general"


def _synthesize_features(
    domain: str,
    description: str,
    techs: List[str],
    repo_meta: dict = None
) -> str:
    """
    Dynamically synthesize domain-specific, contextual capabilities rather than static generic bullet points.
    """
    raw_desc = (description or "").strip()
    features = []

    # 1. Primary domain-driven headline feature
    if domain == "ai_ml":
        features.append("- **High-Throughput Model Inference:** Accelerated batch prediction pipeline optimized for low-latency embeddings and token streaming.")
        features.append("- **Dynamic Prompt & Context Orchestration:** Intelligent prompt templating with automated token truncation and retrieval augmentation.")
        features.append("- **Experiment & Checkpoint Lifecycle:** Automated metric telemetry, model weights caching, and checkpoint serialization.")
    elif domain == "devtools_ide":
        features.append("- **Zero-Latency AST & Diagnostics:** Real-time incremental syntax parsing with deterministic error boundaries and diagnostic reporting.")
        features.append("- **Multi-Pane Visual Workspace:** Decoupled split-view synchronization pairing code editor buffers with live reactive previews.")
        features.append("- **Local-First Offline Architecture:** Direct native filesystem I/O without cloud dependency, telemetry leakage, or network latency.")
    elif domain == "cli_tool":
        features.append("- **Zero-Dependency Native Execution:** Highly optimized single-binary deployment with instantaneous cold-start execution.")
        features.append("- **Command Matrix & Subcommand Dispatch:** Intuitive flag parsing, positional argument handling, and interactive terminal prompts.")
        features.append("- **Colorized Diagnostics & Progress Spinners:** Beautifully formatted ANSI output, structured JSON export flags, and POSIX exit codes.")
    elif domain == "api_backend":
        features.append("- **Type-Safe Contract Validation:** Strict request/response payload serialization with automated OpenAPI 3.1 & Swagger specifications.")
        features.append("- **Distributed Rate Limiting & Auth:** Granular API token authorization, JWT session verification, and tiered request rate-limiting.")
        features.append("- **Connection-Pooled Persistence:** High-concurrency database queries with automated connection recycling and transaction rollbacks.")
    elif domain == "web_fullstack":
        features.append("- **Reactive Component Hydration:** Responsive user interface with optimistic state updates, zero layout shift, and instant hot-reloading.")
        features.append("- **Modern Visual Hierarchy:** Tailwind-engineered dark glassmorphism, tailored typography, and accessible WCAG contrast standards.")
        features.append("- **End-to-End Type Safety:** Synchronized contracts bridging server payloads directly to client UI component props.")
    else:
        features.append(f"- **Core Architecture:** Engineered specifically to solve {raw_desc[:60]} with maximum efficiency and modular separation.")
        features.append("- **Extensible Modular Boundaries:** Clean decoupling between domain business logic, data adapters, and presentation layers.")
        features.append("- **Resilient Fault Isolation:** Built-in circuit breakers, grace-period retries, and comprehensive error containment.")

    # 2. Technology-specific capabilities (Accurate to active stack)
    if "Docker" in techs:
        features.append("- **Containerized Orchestration:** Production-ready multi-stage Docker builds and unified compose configurations for reproducible dev/prod parity.")
    if "Redis" in techs:
        features.append("- **Sub-Millisecond In-Memory Caching:** Low-overhead cache layer with deterministic key invalidation and distributed lock management.")
    if "FastAPI" in techs or "Python" in techs:
        features.append("- **Asynchronous Concurrency:** Non-blocking async event loop execution maximizing single-instance throughput.")
    if "TypeScript" in techs or "React" in techs:
        features.append("- **Strict Type Conformance:** Comprehensive TypeScript definitions preventing runtime null-reference exceptions.")
    if "Pytest" in techs or "Vitest" in techs:
        features.append("- **Automated QA Test Suite:** High-coverage unit, integration, and regression test suites with continuous CI verification.")

    return "\n".join(features[:6])


def _synthesize_prerequisites(techs: List[str]) -> str:
    """Generate precise runtime versions according to active technology stack."""
    prereqs = []
    if any(t in techs for t in ["Python", "FastAPI", "Flask", "Django"]):
        prereqs.append("- **Python**: `3.10+` (Recommended via `pyenv` or `conda`)")
    if any(t in techs for t in ["Node.js", "React", "Next.js", "Vue", "TypeScript", "JavaScript", "Vite"]):
        prereqs.append("- **Node.js**: `18.0.0+` (LTS) & `npm` `9.0+` (or `pnpm` / `bun`)")
    if "Rust" in techs:
        prereqs.append("- **Rust & Cargo**: `1.75+` (`rustup default stable`)")
    if "Go" in techs:
        prereqs.append("- **Go**: `1.21+`")
    if "Docker" in techs:
        prereqs.append("- **Docker Engine**: `24.0+` & **Docker Compose**: `v2.20+`")

    if not prereqs:
        prereqs.append("- **Git**: `2.34+`")
        prereqs.append("- **Node.js**: `18+` or **Python**: `3.10+`")

    return "\n".join(prereqs)


def _synthesize_installation(techs: List[str], clone_url: str, slug: str) -> str:
    """Generate exact, step-by-step installation instructions with multi-package manager tabs."""
    has_node = any(t in techs for t in ["React", "Next.js", "Vue", "Node.js", "Vite", "TypeScript"])
    has_python = any(t in techs for t in ["FastAPI", "Flask", "Django", "Python"])
    has_rust = "Rust" in techs
    has_go = "Go" in techs

    commands = [
        f"# 1. Clone working repository\n$ git clone {clone_url}\n$ cd {slug}"
    ]

    if has_python and has_node:
        commands.append(
            "# 2. Configure & initialize backend runtime\n"
            "$ cd backend\n"
            "$ python -m venv .venv\n"
            "# Windows: .\\.venv\\Scripts\\Activate.ps1 | macOS/Linux: source .venv/bin/activate\n"
            "$ pip install --upgrade pip\n"
            "$ pip install -r requirements.txt\n"
            "$ cp .env.example .env\n"
            "$ cd .."
        )
        commands.append(
            "# 3. Configure & initialize frontend client\n"
            "$ cd frontend\n"
            "$ npm install\n"
            "$ cd .."
        )
    elif has_python:
        commands.append(
            "# 2. Create isolated virtual environment\n"
            "$ python -m venv .venv\n"
            "# Windows: .\\.venv\\Scripts\\Activate.ps1 | macOS/Linux: source .venv/bin/activate\n"
            "$ pip install --upgrade pip\n"
            "$ pip install -r requirements.txt\n"
            "$ cp .env.example .env"
        )
    elif has_node:
        commands.append(
            "# 2. Install project dependencies\n"
            "$ npm install\n"
            "$ cp .env.example .env"
        )
    elif has_rust:
        commands.append(
            "# 2. Build release binary\n"
            "$ cargo build --release"
        )
    elif has_go:
        commands.append(
            "# 2. Download dependencies & compile\n"
            "$ go mod download\n"
            "$ go build -o bin/app"
        )
    else:
        commands.append(
            "# 2. Install dependencies\n"
            "$ npm install || pip install -r requirements.txt"
        )

    code_block = "\n\n".join(commands)
    return f"```bash\n{code_block}\n```"


def _synthesize_usage(domain: str, techs: List[str], slug: str) -> str:
    """Generate realistic, non-generic usage commands and code snippets."""
    has_node = any(t in techs for t in ["React", "Next.js", "Vue", "Node.js", "Vite", "TypeScript"])
    has_python = any(t in techs for t in ["FastAPI", "Flask", "Django", "Python"])

    if domain == "cli_tool":
        return (
            "```bash\n"
            f"# Run CLI tool directly\n"
            f"$ {slug} --help\n\n"
            f"# Execute primary task with verbose telemetry\n"
            f"$ {slug} run --input ./data.json --output ./results/ --verbose\n\n"
            f"# Check operational status\n"
            f"$ {slug} status\n"
            "```"
        )
    elif domain == "api_backend":
        return (
            "```bash\n"
            "# Launch API backend service with live reloader\n"
            "$ uvicorn app.main:app --reload --port 8000\n\n"
            "# Inbound test request via cURL\n"
            "$ curl -X POST http://localhost:8000/api/v1/process \\\n"
            '  -H "Content-Type: application/json" \\\n'
            '  -d \'{"query": "healthcheck", "limit": 10}\'\n'
            "```\n\n"
            "> [!NOTE]\n"
            "> Interactive OpenAPI Swagger console is served at `http://localhost:8000/docs`."
        )
    elif has_python and has_node:
        return (
            "```bash\n"
            "# Terminal 1: Launch Backend API\n"
            "$ cd backend && uvicorn app:app --reload --port 8000\n\n"
            "# Terminal 2: Launch Frontend Client\n"
            "$ cd frontend && npm run dev\n"
            "```\n\n"
            "> [!TIP]\n"
            "> Access the live client application in your browser at `http://localhost:5173` or `http://localhost:3000`."
        )
    elif has_python:
        return (
            "```bash\n"
            "# Start application\n"
            "$ python main.py\n"
            "```"
        )
    else:
        return (
            "```bash\n"
            "# Launch development server\n"
            "$ npm run dev\n\n"
            "# Build production assets\n"
            "$ npm run build\n"
            "```"
        )


def _synthesize_configuration(domain: str, techs: List[str]) -> str:
    """Generate a realistic, tailored environment variables file and table."""
    env_vars = ["# Server Configuration", "PORT=8000", "ENV=development", "LOG_LEVEL=info"]

    if any(t in techs for t in ["PostgreSQL", "Database"]):
        env_vars.append("DATABASE_URL=postgresql://postgres:password@localhost:5432/app_db")
    elif "MongoDB" in techs:
        env_vars.append("MONGODB_URI=mongodb://localhost:27017/app_db")
    else:
        env_vars.append("DATABASE_URL=sqlite:///./data.db")

    if "Redis" in techs:
        env_vars.append("REDIS_URL=redis://localhost:6379/0")

    if any(t in techs for t in ["React", "Next.js", "Vite"]):
        env_vars.append("VITE_API_BASE_URL=http://localhost:8000")

    if domain == "ai_ml" or "OpenAI" in techs:
        env_vars.append("OPENAI_API_KEY=sk-your-secret-api-key")

    env_block = "\n".join(env_vars)

    table = (
        "| Environment Variable | Description | Default | Required |\n"
        "| :--- | :--- | :--- | :--- |\n"
        "| `PORT` | Local network binding port | `8000` | No |\n"
        "| `ENV` | Execution environment (`development` / `production`) | `development` | Yes |\n"
        "| `LOG_LEVEL` | Logging verbosity (`debug`, `info`, `warn`, `error`) | `info` | No |\n"
        "| `DATABASE_URL` | Primary persistent datastore connection URI | *Local URI* | Yes |"
    )

    return f"```env\n{env_block}\n```\n\n### ⚙️ Environment Parameters Specification\n\n{table}"


def _synthesize_architecture(techs: List[str]) -> str:
    """Infer architectural pattern using structured Topology Matrix tables."""
    ui_tech = "Web Client (React / Vite)"
    for t in ["Next.js", "Vue", "Svelte", "Angular", "Electron"]:
        if t in techs:
            ui_tech = f"{t} Interface"
            break

    api_tech = "API Gateway (FastAPI)"
    for t in ["Express", "Node.js", "Django", "Flask", "Go", "Rust"]:
        if t in techs:
            api_tech = f"{t} Service"
            break

    db_tech = "Data Store (PostgreSQL)"
    for t in ["MongoDB", "MySQL", "SQLite", "Supabase"]:
        if t in techs:
            db_tech = f"{t} Storage"
            break

    topology_table = (
        "### 🏛️ System Topology & Component Matrix\n\n"
        "| Layer | Component Identifier | Technology | Protocol / Transport | Architectural Boundary |\n"
        "| :--- | :--- | :--- | :--- | :--- |\n"
        f'| **Presentation Layer** | `Client["Web Client ({ui_tech})"]` | Responsive Client Interface | `|"HTTPS / REST"|` | Client state hydration, optimistic rendering |\n'
        f'| **API Gateway Layer** | `API["API Gateway ({api_tech})"]` | Asynchronous Service Engine | OpenAPI / HTTP 1.1 & 2 | Route dispatching, serialization & auth tokens |\n'
        f'| **Persistence Layer** | `DB["Data Store ({db_tech})"]` | Persistent Storage Engine | TCP / Connection Pool | ACID transactions, indexed models & migrations |\n'
        '| **State & Cache Layer** | `Cache["State Cache (Redis)"]` | In-Memory Cache Store | Binary Socket Protocol | Session storage, rate limits & 300s TTL cache |'
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


def _synthesize_testing(techs: List[str], repo_metadata: dict = None) -> str:
    """Generate exact test suite execution commands and strategy matrix."""
    commands = []
    if any(t in techs for t in ["Python", "FastAPI", "Flask", "Django"]):
        commands.append("# Run backend test suite with coverage report\n$ pytest -v --cov=.")
    if any(t in techs for t in ["React", "Next.js", "Node.js", "Vite", "TypeScript"]):
        commands.append("# Run frontend test suite\n$ npm test")
    if "Rust" in techs:
        commands.append("# Run Rust unit & integration tests\n$ cargo test")
    if "Go" in techs:
        commands.append("# Run Go test suite\n$ go test -v ./...")

    cmd_block = "\n\n".join(commands) if commands else "$ npm test"

    qa_table = (
        "### 🧪 Testing Strategy Matrix\n\n"
        "| Test Suite | Runner / Framework | Target Scope | Coverage Target |\n"
        "| :--- | :--- | :--- | :--- |\n"
        "| **Unit Tests** | `pytest` / `vitest` | Pure functions, models, utility helpers | 90%+ code coverage |\n"
        "| **Integration Tests** | `pytest-asyncio` / `supertest` | Route handlers, auth middleware, DB transactions | All critical workflows |\n"
        "| **Lint & Formatting** | `ruff` / `eslint` / `prettier` | Syntax conformance & type-checking | 0 lint warnings |"
    )

    return f"```bash\n{cmd_block}\n```\n\n{qa_table}"


def _synthesize_troubleshooting(techs: List[str]) -> str:
    """Generate realistic FAQ accordions addressing real developer pitfalls."""
    return (
        "<details>\n"
        "<summary><b>Q: Port 8000 or 3000 is already occupied?</b></summary>\n\n"
        "Terminate any orphaned processes holding the local socket:\n\n"
        "```bash\n"
        "# macOS / Linux\n"
        "lsof -ti:8000 | xargs kill -9\n\n"
        "# Windows PowerShell\n"
        "Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process\n"
        "```\n\n"
        "</details>\n\n"
        "<details>\n"
        "<summary><b>Q: Database connection refused or connection timeout?</b></summary>\n\n"
        "Verify your local database service or Docker container is healthy:\n\n"
        "```bash\n"
        "docker compose ps\n"
        "docker compose up -d\n"
        "```\n\n"
        "</details>\n\n"
        "<details>\n"
        "<summary><b>Q: Corrupted dependencies or lockfile desynchronization?</b></summary>\n\n"
        "Perform a clean purge and fresh install:\n\n"
        "```bash\n"
        "# Node.js\n"
        "rm -rf node_modules package-lock.json && npm install\n\n"
        "# Python\n"
        "pip install --force-reinstall -r requirements.txt\n"
        "```\n\n"
        "</details>\n\n"
        "> [!TIP]\n"
        "> Append `--verbose` or run with `LOG_LEVEL=debug` to output granular stack traces."
    )


def _synthesize_deployment(techs: List[str]) -> str:
    """Generate cloud and container deployment specifications."""
    return (
        "### ☁️ Instant Cloud Deployment\n\n"
        "[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new) &nbsp; "
        "[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)\n\n"
        "### 🐳 Multi-Stage Docker Containerization\n\n"
        "```bash\n"
        "# Build images and launch services in background\n"
        "$ docker compose up --build -d\n\n"
        "# Inspect cluster runtime status\n"
        "$ docker compose ps\n"
        "```"
    )


# ==============================================================================
# 4. BADGE GENERATION ENGINE (LIVE REPO STATS + BRAND SHIELDS)
# ==============================================================================
def _build_badges(
    project_slug: str,
    repo_metadata: dict = None,
    tech_stack_items: list = None,
) -> str:
    """Build dynamic markdown badges combining live GitHub repo stats and brand tech shields."""
    repo_badges = []
    tech_badges = []

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
    else:
        repo_badges.append("![Build Status](https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge)")
        repo_badges.append("![License](https://img.shields.io/badge/License-MIT-0969da?style=for-the-badge)")
        repo_badges.append("![Release](https://img.shields.io/badge/Release-v1.0.0-6366f1?style=for-the-badge)")
        repo_badges.append("![Maintained](https://img.shields.io/badge/Maintained-Active-f59e0b?style=for-the-badge)")

    techs = tech_stack_items or []
    for tech in techs[:8]:
        meta = TECH_BADGE_MAP.get(tech)
        if meta:
            badge_url = (
                f"https://img.shields.io/badge/{meta['label']}-{meta['color']}"
                f"?style=for-the-badge&logo={meta['logo']}&logoColor={meta['logo_color']}"
            )
            tech_badges.append(f"![{tech}]({badge_url})")

    row1 = " ".join(repo_badges)
    row2 = " ".join(tech_badges)
    if row2:
        return f"{row1}\n<br/>\n{row2}"
    return row1


# ==============================================================================
# 5. DYNAMIC README COMPILER WITH 6 DISTINCT THEMES
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
    Compile a complete, non-generic README tailored to project domain, tech stack,
    and user-selected theme.
    """
    repo_metadata = {}
    if repo_url:
        repo_metadata = fetch_github_repo_metadata(repo_url, custom_token=github_token)

    project_name = repo_metadata.get("name") or "My Awesome Project"
    project_name_slug = repo_metadata.get("slug") or "my-awesome-project"
    clone_url = repo_metadata.get("clone_url") or "https://github.com/username/repo.git"
    short_description = (
        repo_metadata.get("description")
        or "A modern, production-ready solution built with high performance and clean architecture."
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

    tree_text = repo_metadata.get("tree_structure") or ""
    domain = detect_project_domain(project_name, short_description, combined_tech, tree_text)

    # Synthesize content dynamically (non-generic)
    features_text = _synthesize_features(domain, short_description, combined_tech, repo_metadata)
    tech_stack_text = " | ".join([f"`{t}`" for t in combined_tech]) if combined_tech else "`Python` | `TypeScript`"
    installation_steps_text = _synthesize_installation(combined_tech, clone_url, project_name_slug)
    usage_instructions_text = _synthesize_usage(domain, combined_tech, project_name_slug)
    config_text = _synthesize_configuration(domain, combined_tech)
    structure_text = tree_text or ".\n├── src/\n├── tests/\n├── package.json\n└── README.md"
    architecture_text = _synthesize_architecture(combined_tech)
    testing_text = _synthesize_testing(combined_tech, repo_metadata)
    troubleshooting_text = _synthesize_troubleshooting(combined_tech)
    deployment_guide_text = _synthesize_deployment(combined_tech)
    badges_text = _build_badges(project_name_slug, repo_metadata, combined_tech)
    prerequisites_text = _synthesize_prerequisites(combined_tech)

    response_data = {
        "project_name": project_name,
        "project_name_slug": project_name_slug,
        "description": short_description,
        "domain": domain,
        "features": features_text,
        "tech_stack": tech_stack_text,
        "clone_url": clone_url,
        "installation_steps": installation_steps_text,
        "usage_instructions": usage_instructions_text,
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

    # ==================== THEME HEADERS ====================
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
    elif theme == "showcase":
        enc_title = urllib.parse.quote(project_name)
        enc_desc = urllib.parse.quote(short_description[:80])
        banner_url = (
            f"https://capsule-render.vercel.app/api?type=soft&color=0:4f46e5,100:06b6d4&height=220&section=header"
            f"&text={enc_title}&fontSize=44&fontAlignY=38&desc={enc_desc}&descAlignY=62&descAlign=50"
        )
        dynamic_content.append(
            f'<p align="center">\n'
            f'  <img src="{banner_url}" width="100%" alt="{project_name} Showcase" />\n'
            f'</p>\n\n'
            f'<div align="center">\n\n'
            f"# {project_name}\n\n"
            f"**{short_description}**\n\n"
            f"{badges_text}\n\n"
            f"</div>"
        )
    elif theme == "cli":
        dynamic_content.append(
            f"# {project_name} ⌨️\n\n"
            f"> {short_description}\n\n"
            f"{badges_text}\n\n"
            f"```bash\n"
            f"# Terminal Quickstart\n"
            f"$ {project_name_slug} --version\n"
            f"{project_name_slug} v1.0.0 (x86_64-pc-windows-msvc)\n"
            f"```"
        )
    elif theme == "academic":
        dynamic_content.append(
            f"# {project_name}: An Architecture for {domain.replace('_', ' ').title()}\n\n"
            f"**Author(s):** {repo_metadata.get('owner', 'Project Contributors')}\n\n"
            f"### Abstract\n\n"
            f"{short_description}. This paper documents the system specification, algorithmic topologies, "
            f"data contracts, and reproducible benchmarks for the implementation.\n\n"
            f"{badges_text}"
        )
    else:  # default / modern
        enc_title = urllib.parse.quote(project_name or "Project")
        enc_desc = urllib.parse.quote((short_description or "")[:85].strip())
        banner_url = (
            f"https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,70:3b82f6,100:10b981&height=220&section=header"
            f"&text={enc_title}&fontSize=42&fontAlignY=36&desc={enc_desc}&descAlignY=60&descAlign=50"
        )
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
            f'<p align="center">\n'
            f'  <img src="{banner_url}" width="100%" alt="{project_name} Banner" />\n'
            f'</p>\n\n'
            f"# {project_name}\n\n"
            f"> **{short_description}**\n\n"
            f'<div align="center">\n\n{badges_text}\n\n</div>\n\n'
            f'<div align="center">\n\n{nav_anchors}\n\n</div>'
        )

    # ==================== THEMED SECTION COMPILATION ====================
    for sec_id in section_order:
        if sec_id == "features":
            if theme == "hacker":
                dynamic_content.append(f"## [0x01] FEATURES\n\n{features_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Features\n\n{features_text}")
            elif theme == "academic":
                dynamic_content.append(f"## 1. System Capabilities & Features\n\n{features_text}")
            else:
                dynamic_content.append(f"## ✨ Features\n\n{features_text}")

        elif sec_id == "tech_stack":
            if theme == "hacker":
                dynamic_content.append(f"## [0x02] TECH STACK\n\n{tech_stack_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Tech Stack\n\n{tech_stack_text}")
            elif theme == "academic":
                dynamic_content.append(f"## 2. Technology Stack & Foundations\n\n{tech_stack_text}")
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
                dynamic_content.append(f"## [0x04] INSTALLATION\n\n{installation_steps_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Setup\n\n{installation_steps_text}")
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
                dynamic_content.append(f"## [0x05] USAGE\n\n{usage_instructions_text}")
            elif theme == "minimalist":
                dynamic_content.append(f"## Usage\n\n{usage_instructions_text}")
            else:
                dynamic_content.append(f"## 📖 Usage\n\n{usage_instructions_text}")

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
            elif theme == "academic":
                dynamic_content.append(
                    f"## Citation & License\n\n"
                    f"If you utilize this work in research, please cite:\n\n"
                    f"```bibtex\n"
                    f"@software{{{project_name_slug}_{year},\n"
                    f"  author = {{{author}}},\n"
                    f"  title = {{{project_name}}},\n"
                    f"  year = {{{year}}},\n"
                    f"  url = {{{clone_url}}}\n"
                    f"}}\n"
                    f"```\n\n"
                    f"Distributed under the {lic} License."
                )
            else:
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
                dynamic_content.append(
                    f"## 🤝 Contributing & License\n\n"
                    f"Contributions are what make the open-source community an amazing place to learn, inspire, and create. "
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
# 6. DOCUMENTATION SUITE (DOC PACK) GENERATORS
# ==============================================================================
def generate_contributing(project_name: str, repo_metadata: dict = None) -> str:
    """Generate a comprehensive, modern CONTRIBUTING.md file."""
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
    prereqs = _synthesize_prerequisites(techs)

    return f"""# Setup & Local Development Guide: {project_name} 💻

This guide provides end-to-end instructions for configuring your local development workstation, configuring environment parameters, and running **{project_name}**.

---

## 📋 System Prerequisites

Ensure you have the following runtimes and tools active on your workstation:

{prereqs}
- **Git**: `2.34+`

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
$ git clone https://github.com/owner/project.git
$ cd project
```

### 2. Configure Environment Parameters
```bash
$ cp .env.example .env
```

> [!TIP]
> Open `.env` and verify database connection strings and secrets before launching services.

### 3. Multi-Package Manager Installation

<details open>
<summary><b>Standard (npm & pip)</b></summary>

```bash
# Backend installation
$ cd backend && pip install -r requirements.txt
$ python -m uvicorn app:app --reload --port 8000

# In a separate terminal: Frontend installation
$ cd frontend && npm install
$ npm run dev
```

</details>

<details>
<summary><b>Fast (pnpm & uv)</b></summary>

```bash
# Backend installation
$ cd backend && uv pip install -r requirements.txt
$ python -m uvicorn app:app --reload --port 8000

# Frontend installation
$ cd frontend && pnpm install
$ pnpm dev
```

</details>

---

## 🐳 Docker Container Quickstart

To launch the full containerized cluster with persistent volume mounts:

```bash
# Build images and start services in background
$ docker compose up --build -d

# Inspect live cluster health
$ docker compose ps
```

---

## 🔧 Troubleshooting FAQ

<details>
<summary><b>Port 8000 or 3000 Conflict?</b></summary>

```bash
# Terminate lingering processes on port 8000
$ lsof -ti:8000 | xargs kill -9
```

</details>

<details>
<summary><b>Database Authentication Failure?</b></summary>

Verify that PostgreSQL credentials in `.env` match those declared in `docker-compose.yml`.

</details>
"""


def generate_architecture(project_name: str, tech_stack_items: list = None, repo_metadata: dict = None) -> str:
    """Generate a comprehensive ARCHITECTURE.md file with layer topologies and sequence pipelines."""
    techs = tech_stack_items or ["React", "FastAPI", "PostgreSQL", "Docker"]

    return f"""# System Architecture: {project_name} 🏛️

This document details the architectural topology, data pipelines, layer boundaries, and reliability principles governing **{project_name}**.

```mermaid
graph TD
    Client["Web Client (React / TypeScript)"] -->|"HTTPS / REST"| API["API Gateway (FastAPI)"]
    API -->|"Async Pipe"| Cache["Session Cache (Redis)"]
    API -->|"Pooled SQL"| DB["Primary Datastore (PostgreSQL)"]
```

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
