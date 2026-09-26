"""Contract tests for the Masih personal-agent policy injection."""

from app.agents.context.masih_personal_agent import MASIH_PERSONAL_AGENT_INSTRUCTIONS
from app.agents.context.sections import SECTIONS
from app.agents.context.slots import PromptSlot
from app.agents.context.tiers import ALL_TIERS


def test_personal_agent_policy_is_persian_first_and_progress_safe() -> None:
    """Policy keeps Persian-first behavior and deterministic progress safety."""
    policy = MASIH_PERSONAL_AGENT_INSTRUCTIONS.lower()

    assert "default to persian" in policy
    assert "never invent progress" in policy
    assert "deterministic application calculations" in policy
    assert "gmail" in policy
    assert "calendar" in policy


def test_personal_agent_policy_is_injected_as_stable_context_for_every_tier() -> None:
    """Policy is present in stable context for every agent tier."""
    section = next(section for section in SECTIONS if section.id == "masih_personal_agent")

    assert section.slot is PromptSlot.DYNAMIC_STABLE
    assert section.applies_to == ALL_TIERS
    assert section.order == 5
