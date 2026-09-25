from app.agents.personal.routines import MASIH_PERSONAL_ROUTINES, routine_by_id


def test_personal_routines_have_unique_ids_and_valid_cron_shapes() -> None:
    ids = [routine.id for routine in MASIH_PERSONAL_ROUTINES]
    assert ids == ["morning_plan", "midday_checkin", "evening_review", "weekly_review"]
    assert [routine.cron for routine in MASIH_PERSONAL_ROUTINES] == [
        "0 8 * * *",
        "0 14 * * *",
        "0 21 * * *",
        "0 19 * * 5",
    ]


def test_core_daily_and_weekly_routines_exist() -> None:
    for routine in MASIH_PERSONAL_ROUTINES:
        assert routine_by_id(routine.id) == routine
        assert routine.notify_on_completion is True
        assert routine.title_fa
        assert routine.title_en
        assert routine.prompt

    assert routine_by_id("unknown") is None


def test_progress_routines_forbid_model_estimation() -> None:
    midday = routine_by_id("midday_checkin")
    weekly = routine_by_id("weekly_review")

    assert midday is not None
    assert weekly is not None
    assert "never invent a completion percentage" in midday.prompt.lower()
    assert "rather than model estimates" in weekly.prompt.lower()
