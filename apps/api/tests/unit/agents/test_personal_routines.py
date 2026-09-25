from app.agents.personal.routines import MASIH_PERSONAL_ROUTINES, routine_by_id


def test_personal_routines_have_unique_ids_and_valid_cron_shapes() -> None:
    ids = [routine.id for routine in MASIH_PERSONAL_ROUTINES]
    assert len(ids) == len(set(ids))
    assert all(len(routine.cron.split()) == 5 for routine in MASIH_PERSONAL_ROUTINES)


def test_core_daily_and_weekly_routines_exist() -> None:
    assert routine_by_id("morning_plan") is not None
    assert routine_by_id("midday_checkin") is not None
    assert routine_by_id("evening_review") is not None
    assert routine_by_id("weekly_review") is not None


def test_progress_routines_forbid_model_estimation() -> None:
    prompts = " ".join(r.prompt.lower() for r in MASIH_PERSONAL_ROUTINES)
    assert "never invent" in prompts or "rather than model estimates" in prompts
