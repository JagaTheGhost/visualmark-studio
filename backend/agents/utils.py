"""
VisualMark Studio — Multi-Provider Agent Utilities & LLM Integration Engine
Provides workspace inspection, GitHub context extraction, multi-model failover, and JSON parsing.
Supported Providers: Google Gemini, OpenAI, Anthropic Claude, Groq Cloud, Ollama (Local Offline).
"""

import os
import json
import re
import httpx
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv
from fastapi import HTTPException

# Load .env from cwd as well as backend/.env and project root
load_dotenv()
_utils_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_utils_dir, "..", ".env"))
load_dotenv(os.path.join(_utils_dir, "..", "..", ".env"))

PROVIDER_FALLBACK_MODELS = {
    "gemini": [
        "gemini-3.5-flash",
        "gemini-3-flash-preview",
        "gemini-3.1-flash-lite",
    ],
    "openai": [
        "gpt-4o-mini",
        "gpt-4o",
    ],
    "anthropic": [
        "claude-3-5-sonnet-latest",
        "claude-3-5-haiku-latest",
    ],
    "groq": [
        "llama-3.3-70b-versatile",
        "deepseek-r1-distill-llama-70b",
    ],
    "ollama": [
        "llama3.2",
        "qwen2.5",
        "mistral",
    ]
}

PREFERRED_MODELS = PROVIDER_FALLBACK_MODELS["gemini"]


def get_provider_api_key(provider: str = "gemini", custom_key: Optional[str] = None) -> Optional[str]:
    """Retrieve API key for given provider from request or environment."""
    if custom_key and custom_key.strip():
        return custom_key.strip()
    p = (provider or "gemini").lower()
    if p == "gemini":
        return os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    elif p == "openai":
        return os.environ.get("OPENAI_API_KEY")
    elif p == "anthropic":
        return os.environ.get("ANTHROPIC_API_KEY")
    elif p == "groq":
        return os.environ.get("GROQ_API_KEY")
    elif p == "ollama":
        return ""
    return None


def get_gemini_api_key(custom_key: Optional[str] = None) -> Optional[str]:
    """Retrieve Gemini API key from request or environment (legacy wrapper)."""
    return get_provider_api_key("gemini", custom_key)


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
    """Scan local directory structure and manifests to provide deterministic context."""
    context = {"meta": {}, "files": {}, "source": "local"}
    if not os.path.isdir(folder_path):
        return context

    # 1. Project Root & Core Files Scan
    root_dir = find_project_root(folder_path)
    core_manifests = [
        "package.json", "requirements.txt", "pyproject.toml", "Cargo.toml",
        "go.mod", "docker-compose.yml", "Makefile", "README.md"
    ]
    for m in core_manifests:
        p = os.path.join(root_dir, m)
        if os.path.exists(p) and os.path.isfile(p):
            try:
                with open(p, "r", encoding="utf-8", errors="ignore") as f:
                    context["files"][m] = f.read(8000)
            except Exception:
                pass

    # 2. Extract structured dependencies
    pkg_json_str = context["files"].get("package.json")
    if pkg_json_str:
        try:
            pkg = json.loads(pkg_json_str)
            deps = list(pkg.get("dependencies", {}).keys()) + list(pkg.get("devDependencies", {}).keys())
            context["meta"]["dependencies"] = deps[:25]
            context["meta"]["project_name"] = pkg.get("name")
            context["meta"]["description"] = pkg.get("description")
        except Exception:
            pass

    reqs_str = context["files"].get("requirements.txt")
    if reqs_str:
        lines = [l.strip().split("==")[0] for l in reqs_str.splitlines() if l.strip() and not l.startswith("#")]
        context["meta"]["dependencies"] = (context["meta"].get("dependencies") or []) + lines[:25]

    # 3. Detect framework / tech stack heuristics
    detected_tech = []
    all_content = " ".join(context["files"].values()).lower()
    tech_keywords = {
        "react": "React", "vue": "Vue.js", "vite": "Vite", "electron": "Electron",
        "fastapi": "FastAPI", "flask": "Flask", "django": "Django", "docker": "Docker",
        "tailwind": "TailwindCSS", "monaco": "Monaco Editor", "next": "Next.js",
        "rust": "Rust", "python": "Python", "typescript": "TypeScript"
    }
    for k, v in tech_keywords.items():
        if k in all_content:
            detected_tech.append(v)
    context["meta"]["detected_tech"] = detected_tech

    return context


def fetch_repo_context_from_github(repo_url: str, token: Optional[str] = None) -> dict:
    """Fetch GitHub repository metadata and root files via GitHub REST API."""
    context = {"meta": {}, "files": {}, "source": "github"}
    match = re.search(r"github\.com[/:]([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+?)(?:\.git)?$", repo_url)
    if not match:
        return context

    owner, repo = match.groups()
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "VisualMark-Studio-AI"}
    if token:
        headers["Authorization"] = f"token {token}"

    api_base = f"https://api.github.com/repos/{owner}/{repo}"
    with httpx.Client(timeout=10.0) as client:
        try:
            repo_resp = client.get(api_base, headers=headers)
            if repo_resp.status_code == 200:
                data = repo_resp.json()
                context["meta"]["project_name"] = data.get("name")
                context["meta"]["description"] = data.get("description")
                context["meta"]["stars"] = data.get("stargazers_count")
                context["meta"]["language"] = data.get("language")
                context["meta"]["license"] = data.get("license", {}).get("spdx_id") if data.get("license") else None
                context["meta"]["topics"] = data.get("topics", [])
        except Exception:
            pass

        key_files = ["package.json", "requirements.txt", "README.md", "pyproject.toml", "Cargo.toml"]
        for f in key_files:
            try:
                f_resp = client.get(f"{api_base}/contents/{f}", headers=headers)
                if f_resp.status_code == 200:
                    import base64
                    raw_content = base64.b64decode(f_resp.json().get("content", "")).decode("utf-8", errors="ignore")
                    context["files"][f] = raw_content[:8000]
            except Exception:
                pass

    return context


def extract_json_from_llm(text: str) -> dict:
    """Extract valid JSON object from LLM response string."""
    cleaned = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"\s*```$", "", cleaned.strip(), flags=re.MULTILINE)
    try:
        return json.loads(cleaned.strip())
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


def _contents_to_openai_messages(system_instruction: str, contents: List[dict]) -> List[dict]:
    """Convert contents list to standard OpenAI message list."""
    messages = []
    if system_instruction and system_instruction.strip():
        messages.append({"role": "system", "content": system_instruction.strip()})

    for c in contents:
        role = c.get("role", "user")
        if role == "model":
            role = "assistant"
        text = ""
        if "parts" in c:
            text = "\n".join([p.get("text", "") for p in c["parts"] if isinstance(p, dict)])
        elif "content" in c:
            text = str(c["content"])
        messages.append({"role": role, "content": text})
    return messages


def _contents_to_anthropic_messages(contents: List[dict]) -> List[dict]:
    """Convert contents list to Anthropic user/assistant alternating turns."""
    messages = []
    for c in contents:
        role = "assistant" if c.get("role") in ("model", "assistant") else "user"
        text = ""
        if "parts" in c:
            text = "\n".join([p.get("text", "") for p in c["parts"] if isinstance(p, dict)])
        elif "content" in c:
            text = str(c["content"])

        if messages and messages[-1]["role"] == role:
            messages[-1]["content"] += f"\n\n{text}"
        else:
            messages.append({"role": role, "content": text})

    # Anthropic requires the first message to be from user
    while messages and messages[0]["role"] != "user":
        messages.pop(0)
    return messages


def call_llm_with_fallback(
    system_instruction: str,
    contents: List[dict],
    provider: str = "gemini",
    model: Optional[str] = None,
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
    temperature: float = 0.35,
    max_tokens: int = 4096,
    timeout: float = 90.0,
    json_mode: bool = False
) -> dict:
    """
    Universal Multi-Provider LLM caller with automatic graceful fallback.
    Supported Providers: gemini, openai, anthropic, groq, ollama.
    """
    p = (provider or "gemini").lower()
    # Auto-detect provider if model prefix indicates provider
    if model:
        if model.startswith("gpt-"):
            p = "openai"
        elif model.startswith("claude-"):
            p = "anthropic"
        elif model.startswith("llama-") or model.startswith("deepseek-"):
            p = "groq"

    resolved_key = get_provider_api_key(p, api_key)
    if p != "ollama" and not resolved_key:
        raise HTTPException(
            status_code=400,
            detail=f"API key is missing for provider '{p}'. Please configure your key in settings or the Copilot key prompt."
        )

    fallback_list = list(PROVIDER_FALLBACK_MODELS.get(p, ["gemini-3.5-flash"]))
    requested_model = model or fallback_list[0]
    if requested_model in fallback_list:
        fallback_list.remove(requested_model)
    models_to_try = [requested_model] + fallback_list

    last_error = None
    with httpx.Client(timeout=timeout) as client:
        # =====================================================================
        # 1. Google Gemini Native
        # =====================================================================
        if p == "gemini":
            for m in models_to_try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={resolved_key}"
                generation_config = {"temperature": temperature, "maxOutputTokens": max_tokens}
                if json_mode:
                    generation_config["responseMimeType"] = "application/json"

                payload = {
                    "contents": contents,
                    "generationConfig": generation_config
                }
                if system_instruction:
                    payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

                try:
                    res = client.post(url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        text = data["candidates"][0]["content"]["parts"][0]["text"]
                        return {
                            "text": text,
                            "used_model": m,
                            "provider": "gemini",
                            "fallback_occurred": (m != requested_model),
                            "raw": data
                        }

                    # Fail fast on bad API key
                    if res.status_code in (400, 401, 403):
                        try:
                            err_msg = res.json().get("error", {}).get("message", "")
                            if "API_KEY_INVALID" in res.text or "API key not valid" in err_msg or "API key expired" in err_msg:
                                raise HTTPException(
                                    status_code=400,
                                    detail="Invalid Gemini API key. Please check your key from Google AI Studio (https://aistudio.google.com/app/apikey)."
                                )
                        except HTTPException:
                            raise
                        except Exception:
                            pass

                    last_error = f"Gemini {m} ({res.status_code}): {res.text[:200]}"
                    continue
                except HTTPException:
                    raise
                except httpx.RequestError as exc:
                    last_error = f"Gemini {m} network error: {exc}"
                    continue

        # =====================================================================
        # 2. OpenAI / Groq / Ollama (OpenAI Compatible)
        # =====================================================================
        elif p in ("openai", "groq", "ollama"):
            messages = _contents_to_openai_messages(system_instruction, contents)
            default_endpoints = {
                "openai": "https://api.openai.com/v1/chat/completions",
                "groq": "https://api.groq.com/openai/v1/chat/completions",
                "ollama": f"{base_url or 'http://localhost:11434'}/v1/chat/completions"
            }
            target_url = default_endpoints.get(p)
            headers = {"Content-Type": "application/json"}
            if p != "ollama":
                headers["Authorization"] = f"Bearer {resolved_key}"

            for m in models_to_try:
                body = {
                    "model": m,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                if json_mode and p != "ollama":
                    body["response_format"] = {"type": "json_object"}

                try:
                    res = client.post(target_url, json=body, headers=headers)
                    if res.status_code == 200:
                        data = res.json()
                        text = data["choices"][0]["message"]["content"]
                        return {
                            "text": text,
                            "used_model": m,
                            "provider": p,
                            "fallback_occurred": (m != requested_model),
                            "raw": data
                        }

                    if res.status_code in (401, 403):
                        raise HTTPException(
                            status_code=401,
                            detail=f"Invalid {p.title()} API key. Please check your credentials in settings."
                        )

                    last_error = f"{p.title()} {m} ({res.status_code}): {res.text[:200]}"
                    continue
                except HTTPException:
                    raise
                except httpx.RequestError as exc:
                    last_error = f"{p.title()} {m} network error: {exc}"
                    continue

        # =====================================================================
        # 3. Anthropic Claude
        # =====================================================================
        elif p == "anthropic":
            messages = _contents_to_anthropic_messages(contents)
            url = "https://api.anthropic.com/v1/messages"
            headers = {
                "x-api-key": resolved_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            for m in models_to_try:
                body = {
                    "model": m,
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": temperature
                }
                if system_instruction:
                    body["system"] = system_instruction

                try:
                    res = client.post(url, json=body, headers=headers)
                    if res.status_code == 200:
                        data = res.json()
                        text = data["content"][0]["text"]
                        return {
                            "text": text,
                            "used_model": m,
                            "provider": "anthropic",
                            "fallback_occurred": (m != requested_model),
                            "raw": data
                        }

                    if res.status_code in (401, 403):
                        raise HTTPException(
                            status_code=401,
                            detail="Invalid Anthropic API key. Please check your credentials in settings."
                        )

                    last_error = f"Claude {m} ({res.status_code}): {res.text[:200]}"
                    continue
                except HTTPException:
                    raise
                except httpx.RequestError as exc:
                    last_error = f"Claude {m} network error: {exc}"
                    continue

    raise HTTPException(status_code=502, detail=f"All models for provider '{p}' failed. Last error: {last_error}")


def call_gemini_with_fallback(payload: dict, api_key: str, timeout: float = 90.0) -> dict:
    """Legacy wrapper for Gemini payload requests."""
    res = call_llm_with_fallback(
        system_instruction=payload.get("systemInstruction", {}).get("parts", [{}])[0].get("text", ""),
        contents=payload.get("contents", []),
        provider="gemini",
        api_key=api_key,
        timeout=timeout
    )
    return res.get("raw") or {"candidates": [{"content": {"parts": [{"text": res["text"]}]}}]}
