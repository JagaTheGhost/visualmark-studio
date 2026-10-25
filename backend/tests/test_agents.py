"""
Tests for VisualMark Studio AI Agent Architecture:
- Verifies copilot_agent module
- Verifies experiment_1_agent module (preserved Experiment 1)
- Verifies ai_agent facade and backward compatibility
"""

import sys
import os
import unittest

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import ai_agent
from agents import copilot_agent
from agents import experiment_1_agent


class TestAgentArchitecture(unittest.TestCase):
    def test_ai_agent_exports(self):
        """Verify ai_agent facade exports all required interfaces."""
        required = [
            "get_gemini_api_key",
            "find_project_root",
            "fetch_local_workspace_context",
            "fetch_repo_context_from_github",
            "extract_json_from_llm",
            "call_gemini_with_fallback",
            "PREFERRED_MODELS",
            "run_gemini_general_chat",
            "run_gemini_analysis",
            "run_gemini_editor_diff",
            "COPILOT_SYSTEM_INSTRUCTION",
            "experiment_1",
        ]
        for name in required:
            self.assertTrue(hasattr(ai_agent, name), f"ai_agent missing export: {name}")

    def test_copilot_system_instruction(self):
        """Verify Co-Pilot system instruction prioritizes guidance and studio discovery."""
        instruction = copilot_agent.COPILOT_SYSTEM_INSTRUCTION
        self.assertIn("VMarks", instruction)
        self.assertIn("Co-Pilot", instruction)
        self.assertIn("PARTNER & GUIDE", instruction)
        self.assertIn("Shields.io Badge Studio", instruction)

    def test_experiment_1_archived(self):
        """Verify experiment_1_agent is accessible and preserved."""
        self.assertTrue(hasattr(experiment_1_agent, "run_gemini_analysis"))
        self.assertTrue(hasattr(experiment_1_agent, "run_gemini_general_chat"))
        self.assertTrue(hasattr(experiment_1_agent, "run_gemini_editor_diff"))


if __name__ == "__main__":
    unittest.main()
