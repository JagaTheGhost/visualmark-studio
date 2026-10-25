"""
VisualMark Studio — Agents Package
Provides modular AI agents:
- copilot_agent: Active interactive Co-Pilot & Studio Guide (guidance, scaffolding, problem diagnostics, templates)
- experiment_1_agent: Archived Experiment 1 autonomous studio synthesizer
"""

from .copilot_agent import (
    run_gemini_general_chat,
    run_gemini_analysis,
    run_gemini_editor_diff,
)

__all__ = [
    "run_gemini_general_chat",
    "run_gemini_analysis",
    "run_gemini_editor_diff",
]
