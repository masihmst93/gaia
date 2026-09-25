from app.agents.context.masih_personal_agent import MASIH_PERSONAL_AGENT_INSTRUCTIONS


def test_personal_agent_policy_is_persian_first_and_progress_safe() -> None:
    policy = MASIH_PERSONAL_AGENT_INSTRUCTIONS.lower()

    assert "default to persian" in policy
    assert "never invent progress" in policy
    assert "deterministic application calculations" in policy
    assert "gmail" in policy
    assert "calendar" in policy
