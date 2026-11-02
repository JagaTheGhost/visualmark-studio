"""
VisualMark Studio — AI Studio Agent Module
================================================================================
Entry point and facade for VisualMark Studio AI Agent subsystem.

Active Agent: VMarks Co-Pilot & Studio Guide (agents/copilot_agent.py)
Archived:     Experiment 1 Autonomous Synthesizer (agents/experiment_1_agent.py)
================================================================================
"""

try:
    from agents.utils import (
        get_gemini_api_key,
        get_provider_api_key,
        find_project_root,
        fetch_local_workspace_context,
        fetch_repo_context_from_github,
        extract_json_from_llm,
        call_gemini_with_fallback,
        call_llm_with_fallback,
        PREFERRED_MODELS,
        PROVIDER_FALLBACK_MODELS,
    )
    from agents.copilot_agent import (
        run_gemini_general_chat,
        run_gemini_analysis,
        run_gemini_editor_diff,
        COPILOT_SYSTEM_INSTRUCTION,
    )
    from agents import experiment_1_agent as experiment_1
except (ImportError, ValueError):
    from .agents.utils import (
        get_gemini_api_key,
        get_provider_api_key,
        find_project_root,
        fetch_local_workspace_context,
        fetch_repo_context_from_github,
        extract_json_from_llm,
        call_gemini_with_fallback,
        call_llm_with_fallback,
        PREFERRED_MODELS,
        PROVIDER_FALLBACK_MODELS,
    )
    from .agents.copilot_agent import (
        run_gemini_general_chat,
        run_gemini_analysis,
        run_gemini_editor_diff,
        COPILOT_SYSTEM_INSTRUCTION,
    )
    from .agents import experiment_1_agent as experiment_1

__all__ = [
    "get_gemini_api_key",
    "get_provider_api_key",
    "find_project_root",
    "fetch_local_workspace_context",
    "fetch_repo_context_from_github",
    "extract_json_from_llm",
    "call_gemini_with_fallback",
    "call_llm_with_fallback",
    "PREFERRED_MODELS",
    "PROVIDER_FALLBACK_MODELS",
    "run_gemini_general_chat",
    "run_gemini_analysis",
    "run_gemini_editor_diff",
    "COPILOT_SYSTEM_INSTRUCTION",
    "experiment_1",
]
