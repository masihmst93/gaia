"""Contract tests for built-in Masih personal-agent routines."""

from app.agents.personal.routines import MASIH_PERSONAL_ROUTINES


def test_personal_routines_have_exact_schedule_contract() -> None:
    """Routine ids and cron schedules stay pinned to the product contract."""
    assert [routine.id for routine in MASIH_PERSONAL_ROUTINES] == [
        "morning_plan",
        "midday_checkin",
        "evening_review",
        "weekly_review",
    ]
    assert [routine.cron for routine in MASIH_PERSONAL_ROUTINES] == [
        "0 8 * * *",
        "0 14 * * *",
        "0 21 * * *",
        "0 19 * * 5",
    ]


def test_routine_metadata_and_prompts_are_complete() -> None:
    """Every shipped routine has complete labels, prompts, and notifications."""
    assert all(routine.notify_on_completion is True for routine in MASIH_PERSONAL_ROUTINES)
    assert all(routine.title_fa for routine in MASIH_PERSONAL_ROUTINES)
    assert all(routine.title_en for routine in MASIH_PERSONAL_ROUTINES)
    assert all(routine.prompt for routine in MASIH_PERSONAL_ROUTINES)


def test_progress_routines_forbid_model_estimation() -> None:
    """Progress routines explicitly prohibit model-estimated completion values."""
    prompts = {routine.id: routine.prompt.lower() for routine in MASIH_PERSONAL_ROUTINES}

    assert "never invent a completion percentage" in prompts["midday_checkin"]
    assert "rather than model estimates" in prompts["weekly_review"]
