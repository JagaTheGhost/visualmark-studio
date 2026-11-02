"""
VisualMark Studio — VMarks Co-Pilot & Studio Guide Agent
================================================================================
Active Co-Pilot & Documentation Architect for VisualMark Studio.

Philosophy:
1. Guide & Accelerate: Provides structural scaffolding, templates, and architectural advice
   rather than dumping an entire autonomous document that bypasses the Studio.
2. Studio Feature Discovery: Teaches the user how to leverage VisualMark Studio's visual
   tools (Badge Studio, Flowchart Builder, In-Editor Live Diff, Split Preview).
3. Direct Technical Problem Solving: Diagnoses issues, fixes syntax/errors, and writes
   precise code/Mermaid blocks with zero placeholders.
================================================================================
"""

import os
import json
from typing import Dict, Any, Optional, List
try:
    from .utils import (
        call_llm_with_fallback,
        call_gemini_with_fallback,
        extract_json_from_llm,
    )
except (ImportError, ValueError):
    from agents.utils import (
        call_llm_with_fallback,
        call_gemini_with_fallback,
        extract_json_from_llm,
    )


COPILOT_SYSTEM_INSTRUCTION = """You are VMarks, the VisualMark Studio Co-Pilot & Interactive Guide (V=Visual, Mark=Markdown, s=Studio).
Your mission is to be the ultimate creative and technical partner for developers authoring documentation inside VisualMark Studio.

CORE PHILOSOPHY & BEHAVIOR:
1. PARTNER & GUIDE, NOT A BLACK-BOX REPLACEMENT:
   - Do not dump hundreds of lines of generic, autonomous documentation that renders the Studio editor useless.
   - Instead, act as an Architect and Mentor: propose clean outlines, provide scaffolded starter templates, explain how to organize information, and encourage the user to craft their documentation using VisualMark Studio's visual tools.
   - When asked to "write a README" or "document this project", provide:
     a) A clear high-impact structural outline tailored to their project stack.
     b) A scaffolded template with key sections, placeholders for their domain decisions, and starter snippets.
     c) Concrete recommendations on which VisualMark Studio tools to use for each section.

2. CHAMPION VISUALMARK STUDIO TOOLS & FEATURES:
   Actively guide the user on how and when to use Studio capabilities:
   - **Shields.io Badge Studio** (Ctrl+Shift+B or Studio Tab): Recommend generating official tech badges (brand-plate or split) with logos and official HEX colors. Mention they can run `/badges` or click "Edit in Badge Studio".
   - **Flowchart & Mermaid Diagrams**: Recommend visual architecture maps and workflows. When suggesting diagrams, provide syntactically flawless Mermaid blocks (flowchart TD/LR, sequenceDiagram, etc.).
   - **In-Editor Live Diff**: Remind the user they can highlight any text in the editor to reformat into tables, polish prose, or fix syntax via live diff.
   - **Rich Markdown Elements**: Teach users how to use GitHub callouts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`), markdown tables, and language-tagged code fences.

3. DIRECT PROBLEM SOLVING & ZERO PLACEHOLDERS:
   - If the user asks a specific coding, debugging, or syntax question (e.g., broken Mermaid diagram, markdown table alignment, error message), answer DIRECTLY and COMPLETELY.
   - Explain what was wrong and how to fix it.
   - NEVER use placeholder tokens like '[INSERT DIAGRAM HERE]', '[TODO]', or '// ...' inside code or diagram blocks. Always produce complete, valid, working snippets.

4. MERMAID SYNTAX STRICTNESS:
   Every Mermaid block must be 100% valid for Mermaid v10+:
   - Flowcharts: Line 1 must be 'flowchart TD' or 'flowchart LR'. Subgraphs must use 'subgraph Name ["Title"]' and close with 'end'.
   - Sequences: Line 1 must be 'sequenceDiagram' followed by autonumber and explicit participants.

5. CONTEXT AWARENESS:
   - Use the active file content and workspace manifests (e.g. package.json, requirements.txt) provided in background context to understand their tech stack, dependencies, and structure.
   - Never recite raw manifests or project files unless specifically asked for an overview.

6. PERSISTENT PROJECT MEMORY & LEARNING:
   - When PERSISTENT PROJECT MEMORY is provided in context, strictly respect all workspace rules, architectural guidelines, and learned preferences.
   - When the user asks you to remember something (e.g., "remember that...", "note down that...", "keep in mind that we use..."), acknowledge it warmly and append `[MEMORY_ADD: <concise rule or fact>]` at the very end of your response so VisualMark Studio can persist it into the workspace memory.
"""


def run_gemini_general_chat(
    prompt: str,
    history: List[Dict[str, str]],
    api_key: Optional[str] = None,
    provider: str = "gemini",
    model: Optional[str] = None,
    base_url: Optional[str] = None,
    active_file: Optional[str] = None,
    file_content: Optional[str] = None,
    workspace_path: Optional[str] = None,
    project_memory_text: Optional[str] = None
) -> dict:
    """Conversational Co-Pilot & Studio Guide with visibility into active document, workspace, and memory."""
    context_prefix = ""
    if project_memory_text and project_memory_text.strip():
        context_prefix += f"\n{project_memory_text.strip()}\n"

    if file_content and file_content.strip():
        sample = file_content[:64000]
        context_prefix += f"\n\n--- ACTIVE LOCAL DOCUMENT ({active_file or 'Document'}) ---\n```markdown\n{sample}\n```\n"

    if workspace_path and os.path.isdir(workspace_path):
        context_prefix += f"\nWORKSPACE ROOT: {workspace_path}\n"
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
    # Add sanitized conversation history with alternating turns
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

    # Gemini & generic turns: ensure first turn is 'user'
    while contents and contents[0]["role"] != "user":
        contents.pop(0)

    full_prompt = f"{context_prefix}\n\nUSER PROMPT: {prompt}" if context_prefix else prompt
    if contents and contents[-1]["role"] == "user":
        contents[-1]["parts"][0]["text"] += f"\n\n{full_prompt}"
    else:
        contents.append({
            "role": "user",
            "parts": [{"text": full_prompt}]
        })

    res = call_llm_with_fallback(
        system_instruction=COPILOT_SYSTEM_INSTRUCTION,
        contents=contents,
        provider=provider or "gemini",
        model=model,
        api_key=api_key,
        base_url=base_url,
        temperature=0.35,
        max_tokens=4096,
        timeout=60.0
    )
    return res


def run_gemini_analysis(
    repo_context: dict,
    api_key: Optional[str] = None,
    provider: str = "gemini",
    model: Optional[str] = None,
    base_url: Optional[str] = None,
    user_instruction: Optional[str] = None,
    mode: str = "badge"
) -> dict:
    """Analyze workspace manifests and synthesize Shields.io Badge Studio parameters."""
    system_instruction = (
        "You are VMarks, the VisualMark Studio Copilot. "
        "Your task is to analyze project dependencies and manifests to configure Shields.io Badge Studio. "
        "Return strictly valid JSON matching the requested schema."
    )

    user_note = f"\nUser specific instructions: {user_instruction}\n" if user_instruction else ""
    meta_json = json.dumps(repo_context.get('meta', {}), indent=2)
    files_json = json.dumps(repo_context.get('files', {}), indent=2)

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

    contents = [
        {
            "role": "user",
            "parts": [{"text": prompt}]
        }
    ]

    res = call_llm_with_fallback(
        system_instruction=system_instruction,
        contents=contents,
        provider=provider or "gemini",
        model=model,
        api_key=api_key,
        base_url=base_url,
        temperature=0.2,
        json_mode=True,
        timeout=90.0
    )

    raw_text = res["text"].strip()
    result = extract_json_from_llm(raw_text)
    result["mode"] = mode
    result["used_model"] = res.get("used_model")
    result["provider"] = res.get("provider")
    result["fallback_occurred"] = res.get("fallback_occurred", False)

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


def run_gemini_editor_diff(
    original_text: str,
    instruction: str,
    api_key: Optional[str] = None,
    provider: str = "gemini",
    model: Optional[str] = None,
    base_url: Optional[str] = None,
    context_before: Optional[str] = None,
    context_after: Optional[str] = None,
    project_memory_text: Optional[str] = None
) -> dict:
    """Produce precise replacement text and metadata for in-editor live diff review."""
    system_instruction = (
        "You are VMarks, the VisualMark Studio AI editor. Your role is to rewrite, refine, or transform "
        "the user's highlighted text according to their instruction. Return ONLY valid JSON with keys: "
        "'summary' (short 1-sentence description of changes made), "
        "'replacement_text' (the final text to replace the selection with), "
        "'action_type' ('polish' | 'table' | 'diagram' | 'general'). "
        "Do NOT include markdown backtick fences around the JSON. Do not alter text unnecessarily. "
        "If project memory rules or facts are present, strictly respect them."
    )

    ctx_info = ""
    if project_memory_text and project_memory_text.strip():
        ctx_info += f"{project_memory_text.strip()}\n\n"
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

    contents = [
        {
            "role": "user",
            "parts": [{"text": prompt}]
        }
    ]

    res = call_llm_with_fallback(
        system_instruction=system_instruction,
        contents=contents,
        provider=provider or "gemini",
        model=model,
        api_key=api_key,
        base_url=base_url,
        temperature=0.2,
        json_mode=True,
        timeout=45.0
    )

    raw_text = res["text"].strip()
    result = extract_json_from_llm(raw_text)
    result["used_model"] = res.get("used_model")
    result["provider"] = res.get("provider")
    result["fallback_occurred"] = res.get("fallback_occurred", False)
    return result
