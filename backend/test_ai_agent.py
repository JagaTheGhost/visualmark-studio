"""
VisualMark Studio — AI Agent Prototype Test Runner
Demonstrates the AI Agent analyzing a GitHub repository and populating:
1. Tailored Markdown documentation
2. Flowchart Visual Builder nodes & edges
3. Shields.io Badge Studio configuration
4. Repository Card Studio parameters
"""

import os
import sys
import json
import httpx
from dotenv import load_dotenv

# Ensure UTF-8 console output on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Load environment variables from backend/.env if present
load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

DEFAULT_TEST_REPO = "JagaTheGhost/visualmark-studio"


def fetch_github_repo_context(repo_slug: str, token: str = None) -> dict:
    """Fetch real repository metadata, package.json, and tree structure from GitHub API."""
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "VisualMark-AI-Agent"}
    if token:
        headers["Authorization"] = f"token {token}"

    print(f"\n[1/3] 🔍 Fetching repository details from GitHub: {repo_slug}...")
    
    context = {"slug": repo_slug, "files": {}, "meta": {}}

    with httpx.Client(headers=headers, timeout=15.0) as client:
        # 1. Fetch repo metadata
        meta_res = client.get(f"https://api.github.com/repos/{repo_slug}")
        if meta_res.status_code == 200:
            m = meta_res.json()
            context["meta"] = {
                "name": m.get("name"),
                "description": m.get("description"),
                "stars": m.get("stargazers_count"),
                "forks": m.get("forks_count"),
                "license": m.get("license", {}).get("spdx_id") if m.get("license") else "None",
                "language": m.get("language"),
                "topics": m.get("topics", [])
            }
            print(f"      ✓ Repo: {context['meta']['name']} ({context['meta']['stars']} ★) - {context['meta']['language']}")
        else:
            print(f"      ⚠ GitHub API warning: {meta_res.status_code} - {meta_res.text}")

        # 2. Try fetching package.json or requirements.txt
        for filename in ["package.json", "frontend/package.json", "requirements.txt", "pyproject.toml", "Cargo.toml"]:
            file_res = client.get(f"https://raw.githubusercontent.com/{repo_slug}/main/{filename}")
            if file_res.status_code != 200:
                file_res = client.get(f"https://raw.githubusercontent.com/{repo_slug}/master/{filename}")
            
            if file_res.status_code == 200:
                context["files"][filename] = file_res.text[:2500]  # First 2.5k chars
                print(f"      ✓ Extracted manifest: {filename}")
                break

    return context


def run_gemini_agent_analysis(repo_context: dict, api_key: str) -> dict:
    """Send repo context to Google Gemini with structured JSON output matching VisualMark Studios."""
    print(f"\n[2/3] 🤖 Invoking Gemini 2.5 Flash Agent to analyze architecture & design visual studios...")

    system_instruction = (
        "You are the VisualMark Studio AI Design Agent. You analyze software repositories and produce "
        "production-ready Markdown documentation AND structured data to populate the IDE's visual studios "
        "(Flowchart Builder, Badge Studio, Repo Card). "
        "You must respond strictly with valid JSON matching the requested schema."
    )

    prompt = f"""
Analyze this GitHub project and generate tailored documentation and visual studio configurations:

REPOSITORY METADATA:
{json.dumps(repo_context.get('meta', {}), indent=2)}

MANIFEST SAMPLES:
{json.dumps(repo_context.get('files', {}), indent=2)}

Generate a single JSON object with these exact keys:
1. "project_summary": A compelling 2-sentence summary of what this project actually does.
2. "flowchart_studio": An architecture diagram for FlowchartVisualBuilder with:
   - "direction": "TD" or "LR"
   - "nodes": list of {{"id": "...", "name": "...", "shape": "box"|"round"|"cylinder", "color": "#hex"}}
   - "edges": list of {{"from": "node_id_1", "to": "node_id_2", "label": "description"}}
3. "badge_studio": list of 4-6 primary tech badges:
   - list of {{"label": "...", "message": "...", "color": "hex_without_hash", "style": "for-the-badge"}}
4. "core_features": list of 4 concrete technical features extracted from the codebase.
5. "quickstart_instructions": bash installation & running code snippet.
"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"

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

    with httpx.Client(timeout=90.0) as client:
        res = client.post(url, json=payload)
        if res.status_code != 200:
            raise RuntimeError(f"Gemini API Error ({res.status_code}): {res.text}")
        
        data = res.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(raw_text)


def main():
    print("=" * 70)
    print("  VISUALMARK STUDIO — AI STUDIO AGENT TEST RUNNER")
    print("=" * 70)

    api_key = GEMINI_API_KEY
    if not api_key:
        print("\n❌ GEMINI_API_KEY is not set.")
        print("\nTo run the test:")
        print("1. Get a free API key at: https://aistudio.google.com/app/apikey")
        print("2. Set it in backend/.env by running:")
        print('   echo GEMINI_API_KEY=your_key_here >> "backend/.env"')
        print("3. Re-run this script!\n")
        sys.exit(1)

    target_repo = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_TEST_REPO
    token = os.environ.get("GITHUB_TOKEN")

    # Step 1: Fetch repo context
    context = fetch_github_repo_context(target_repo, token=token)

    # Step 2: Call Gemini
    result = run_gemini_agent_analysis(context, api_key=api_key)

    # Step 3: Print VisualMark Studio Output
    print(f"\n[3/3] ✨ AGENT GENERATION RESULTS FOR {target_repo.upper()}:\n")
    print("--- 1. PROJECT SUMMARY ---")
    print(result.get("project_summary"))

    print("\n--- 2. TECH STACK BADGES (Badge Studio) ---")
    for b in result.get("badge_studio", []):
        print(f"  • [{b.get('label')}: {b.get('message')}] -> color: #{b.get('color')}, style: {b.get('style')}")

    print("\n--- 3. ARCHITECTURE FLOWCHART (Diagram Studio) ---")
    flow = result.get("flowchart_studio", {})
    print(f"  Direction: {flow.get('direction', 'TD')}")
    print("  Nodes:")
    for n in flow.get("nodes", []):
        print(f"    - ({n.get('id')}) {n.get('name')} [{n.get('shape')}] color: {n.get('color')}")
    print("  Connections:")
    for e in flow.get("edges", []):
        print(f"    - {e.get('from')} ---> {e.get('to')} ({e.get('label', '')})")

    print("\n--- 4. EXTRACTED CORE FEATURES ---")
    for feat in result.get("core_features", []):
        print(f"  ✓ {feat}")

    print("\n--- 5. QUICKSTART SNIPPET ---")
    print(result.get("quickstart_instructions"))

    # Save output to scratch directory for inspection
    out_file = "backend/ai_agent_test_output.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    print(f"\n💾 Saved full JSON payload to {out_file}")
    print("=" * 70)


if __name__ == "__main__":
    main()
