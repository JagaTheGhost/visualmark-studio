"""
VisualMark Studio — AI Studio Agent (Experiment 1: Autonomous Studio Synthesizer)
================================================================================
ARCHIVED / LEGACY EXPERIMENT 1

This module contains the original autonomous documentation & badge generator logic.
Preserved for future re-integration as an advanced, opt-in generation toggle once
user feedback on VisualMark Studio has been gathered.
================================================================================
"""

import os
import json
import re
import httpx
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

load_dotenv()


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

    # Automatically resolve upward to true project root if inside a subfolder like /assets or /frontend
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

                    # Node.js / Electron package.json
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

                    # Python requirements.txt
                    elif rel_path == "requirements.txt":
                        req_lines = [
                            re.split(r'[=><~]', line)[0].strip()
                            for line in content.splitlines()
                            if line.strip() and not line.strip().startswith("#")
                        ]
                        if req_lines:
                            context["meta"]["python_dependencies"] = req_lines[:20]

                    # License detection
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

            # Check primary manifests
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


PREFERRED_MODELS = [
    "gemini-3.5-flash",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite",
]


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
                # If model is unavailable (503), rate limited (429), or not found (404), try next model
                last_error = f"Model {model} returned {res.status_code}: {res.text}"
                continue
            except httpx.RequestError as exc:
                last_error = f"Model {model} network error: {exc}"
                continue

    raise RuntimeError(f"All Gemini models exhausted. Last error: {last_error}")


def run_gemini_analysis(repo_context: dict, api_key: str, user_instruction: Optional[str] = None, mode: str = "badge") -> dict:
    """Call Gemini to synthesize Shields.io Badge Studio parameters and Markdown badge rack."""
    system_instruction = (
        "You are VMarks (VisualMark Studio Copilot: V=Visual, Mark=Markdown, s=Studio). "
        "You analyze software repositories and produce production-ready Markdown documentation AND "
        "structured data to populate the IDE's visual studios. "
        "You must respond strictly with valid JSON matching the requested schema."
    )

    user_note = f"\nUser specific instructions: {user_instruction}\n" if user_instruction else ""
    meta_json = json.dumps(repo_context.get('meta', {}), indent=2)
    files_json = json.dumps(repo_context.get('files', {}), indent=2)

    # VMarks Studio Focus: 100% focused on Badges Studio
    schema_guide = """Generate a single JSON object with these exact keys:
1. "project_summary": A concise, engaging 2-sentence summary of what this project does and its core stack architecture.
2. "badge_studio": list of 5-8 primary tech stack, runtime, framework, tool, and license badges tailored specifically for Shields.io Badge Studio.
   Each item MUST have:
   - "format": "brand-plate" or "split"
   - "title": Clean readable display name (e.g. "React 18", "TypeScript 5", "Electron 30", "FastAPI", "Python 3", "Docker", "MIT License")
   - "label": The left-side label or tech name (e.g. "React", "TypeScript", "Electron", "FastAPI", "Python", "Docker", "License")
   - "message": Version or status value (e.g. "v18.2", "v5.8", "v30.0", "v0.110", "v3.10+", "Compose", "MIT")
   - "color": Official brand HEX color code WITHOUT '#' (e.g. React="61DAFB", TypeScript="3178C6", Vite="646CFF", Electron="47848F", Python="3776AB", FastAPI="009688", Docker="2496ED", Tailwind="06B6D4", MIT="10B981", GitHub="181717")
   - "labelColor": Optional left segment hex without '#' (default "18181B")
   - "logo": Official SimpleIcons slug (lowercase letters/numbers only, e.g. "react", "typescript", "electron", "vitedotjs", "fastapi", "python", "docker", "tailwindcss", "github", "opensourceinitiative")
   - "logoColor": "white" (or "black" for light colored badges like React)
   - "style": "for-the-badge"
   - "url": Official documentation or repository URL for the tech
3. "badge_markdown": Centered markdown badge rack strip enclosed in <div align="center">...</div> containing [![Alt](https://img.shields.io/badge/...)] links for all badges."""

    prompt = f"""
Analyze this project and generate tailored documentation and visual studio configurations:
{user_note}
REPOSITORY / WORKSPACE METADATA:
{meta_json}

MANIFEST SAMPLES:
{files_json}

{schema_guide}
"""

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{system_instruction}\n\n{prompt}"}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }

    data = call_gemini_with_fallback(payload, api_key, timeout=90.0)
    raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
    result = extract_json_from_llm(raw_text)
    result["mode"] = mode

    # Ensure consistent keys between badge_studio and badges_studio
    if "badges_studio" in result and "badge_studio" not in result:
        result["badge_studio"] = result["badges_studio"]
    elif "badge_studio" in result and "badges_studio" not in result:
        result["badges_studio"] = result["badge_studio"]

    # Sanitize badge colors & logos
    if "badge_studio" in result and isinstance(result["badge_studio"], list):
        for b in result["badge_studio"]:
            if isinstance(b, dict):
                if "color" in b and isinstance(b["color"], str):
                    b["color"] = b["color"].replace("#", "").strip()
                if "labelColor" in b and isinstance(b["labelColor"], str):
                    b["labelColor"] = b["labelColor"].replace("#", "").strip()
                if "style" not in b or not b["style"]:
                    b["style"] = "for-the-badge"
                if "logo" in b and isinstance(b["logo"], str):
                    clean_logo = b["logo"].lower().strip().replace(" ", "").replace(".", "dot")
                    b["logo"] = clean_logo
                if "logoColor" not in b or not b["logoColor"]:
                    b["logoColor"] = "black" if (b.get("color", "").upper() == "61DAFB") else "white"

    return result


def run_gemini_editor_diff(original_text: str, instruction: str, api_key: str, context_before: Optional[str] = None, context_after: Optional[str] = None) -> dict:
    """Produce precise replacement text and metadata for in-editor live diff review."""
    system_instruction = (
        "You are VMarks, the VisualMark Studio AI editor. Your role is to rewrite, refine, or transform "
        "the user's highlighted text according to their instruction. Return ONLY valid JSON with keys: "
        "'summary' (short 1-sentence description of changes made), "
        "'replacement_text' (the final text to replace the selection with), "
        "'action_type' ('polish' | 'table' | 'diagram' | 'general'). "
        "Do NOT include markdown backtick fences around the JSON. Do not alter text unnecessarily."
    )

    ctx_info = ""
    if context_before:
        ctx_info += f"Context before selection:\n{context_before[-300:]}\n\n"
    if context_after:
        ctx_info += f"Context after selection:\n{context_after[:300]}\n\n"

    prompt = f"""
{ctx_info}USER INSTRUCTION:
{instruction}

ORIGINAL SELECTED TEXT:
```markdown
{original_text}
```

Generate a single JSON object with:
1. "summary": A brief 1-sentence description of what changed.
2. "replacement_text": The complete new replacement text to substitute for the original selected text.
3. "action_type": "polish" | "table" | "diagram" | "general"
"""

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{system_instruction}\n\n{prompt}"}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }

    data = call_gemini_with_fallback(payload, api_key, timeout=45.0)
    raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
    return extract_json_from_llm(raw_text)


def run_gemini_general_chat(
    prompt: str,
    history: List[Dict[str, str]],
    api_key: str,
    active_file: Optional[str] = None,
    file_content: Optional[str] = None,
    workspace_path: Optional[str] = None
) -> str:
    """Conversational assistant with direct visibility into active document and workspace context."""
    system_instruction = (
        "You are VMarks, the VisualMark Studio AI Copilot (V=Visual, Mark=Markdown, s=Studio).\n"
        "You are an expert technical AI assistant specializing in software engineering, debugging, "
        "fixing code, writing and refining documentation, designing Mermaid diagrams, and structuring Markdown.\n\n"
        "CRITICAL BEHAVIOR GUIDELINES:\n"
        "1. DIRECT ANSWERS & COMPLETE CODE: Always answer the user's specific request, question, code snippet, or error message directly. "
        "If the user provides code or a diagram and asks to fix, debug, explain, or edit it, focus 100% on providing the correct solution, "
        "explaining what was wrong and how it was resolved, with full working code blocks.\n"
        "2. ABSOLUTELY NO PLACEHOLDERS: NEVER use placeholder tokens like '[SEQUENCE DIAGRAM CODE HERE]', '[INSERT FLOWCHART HERE]', "
        "'[TODO]', or '// ...' inside code or diagram blocks. You MUST generate the COMPLETE, fully-formed, syntactically-valid code or Mermaid diagram every single time.\n"
        "3. MERMAID SYNTAX STRICTNESS: Every Mermaid block must be 100% syntactically valid for Mermaid v10+:\n"
        "   - Flowcharts: Line 1 must be 'flowchart TD' or 'flowchart LR' followed by a newline (never 'flowchart T' or 'flowchart L'). Subgraphs must use 'subgraph Name [\"Title\"]' and end with 'end'.\n"
        "   - Sequence: Line 1 must be 'sequenceDiagram' followed by a newline, autonumber, and explicit participant definitions.\n"
        "   - Class, State, ER: Use 'classDiagram', 'stateDiagram-v2', 'erDiagram'.\n"
        "4. DO NOT DEFAULT TO REPO SUMMARIES: Never default to repeating a high-level summary of the repository or workspace "
        "unless the user specifically asks for an overview or project summary (e.g. 'summarize this project').\n"
        "5. FORMATTING: Use clean GitHub-flavored Markdown with explicit language fences (```mermaid, ```javascript, ```python, ```bash).\n"
        "6. WORKSPACE CONTEXT: The active document and workspace context provided below are for background reference only. "
        "Do not recite them unless requested."
    )

    context_prefix = ""
    if file_content and file_content.strip():
        sample = file_content[:64000]
        context_prefix += f"\n\n--- ACTIVE LOCAL DOCUMENT ({active_file or 'Document'}) ---\n```markdown\n{sample}\n```\n"

    if workspace_path and os.path.isdir(workspace_path):
        context_prefix += f"\nWORKSPACE ROOT: {workspace_path}\n"
        # If manifests exist in root, add a short summary
        pkg_file = os.path.join(workspace_path, "package.json")
        req_file = os.path.join(workspace_path, "requirements.txt")
        if os.path.exists(pkg_file):
            try:
                with open(pkg_file, "r", encoding="utf-8", errors="ignore") as f:
                    context_prefix += f"\nMANIFEST (package.json):\n{f.read(1500)}\n"
            except Exception:
                pass
        elif os.path.exists(req_file):
            try:
                with open(req_file, "r", encoding="utf-8", errors="ignore") as f:
                    context_prefix += f"\nMANIFEST (requirements.txt):\n{f.read(1500)}\n"
            except Exception:
                pass

    contents = []
    # Add sanitized conversation history with alternating turns and non-empty parts
    for msg in history[-8:]:
        text = (msg.get("content") or "").strip()
        if not text:
            continue
        role = "user" if msg.get("role") == "user" else "model"
        if contents and contents[-1]["role"] == role:
            contents[-1]["parts"][0]["text"] += f"\n\n{text}"
        else:
            contents.append({
                "role": role,
                "parts": [{"text": text}]
            })

    # Gemini API requires the first turn to be 'user'
    while contents and contents[0]["role"] != "user":
        contents.pop(0)

    # Add current prompt with active file context if present
    full_prompt = f"{context_prefix}\n\nUSER PROMPT: {prompt}" if context_prefix else prompt
    if contents and contents[-1]["role"] == "user":
        contents[-1]["parts"][0]["text"] += f"\n\n{full_prompt}"
    else:
        contents.append({
            "role": "user",
            "parts": [{"text": full_prompt}]
        })

    payload = {
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 4096
        }
    }

    data = call_gemini_with_fallback(payload, api_key, timeout=60.0)
    return data["candidates"][0]["content"]["parts"][0]["text"]
