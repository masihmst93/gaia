"""Built-in routine definitions for Masih Personal Agent V1.

These are product defaults. Installation and activation are intentionally
explicit so the user keeps control over scheduled background work and provider
permissions.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class PersonalRoutine:
    """A scheduled personal-agent routine shipped as a product default."""

    id: str
    title_fa: str
    title_en: str
    cron: str
    prompt: str
    notify_on_completion: bool = True


MASIH_PERSONAL_ROUTINES: tuple[PersonalRoutine, ...] = (
    PersonalRoutine(
        id="morning_plan",
        title_fa="برنامه صبح",
        title_en="Morning plan",
        cron="0 8 * * *",
        prompt=(
            "Build today's realistic plan from calendar, todos, overdue work and "
            "explicit priorities. In Persian, summarize the day, identify the top "
            "three priorities, flag conflicts, and suggest the first concrete "
            "action. Do not create or send anything that requires approval."
        ),
    ),
    PersonalRoutine(
        id="midday_checkin",
        title_fa="پیگیری میانه روز",
        title_en="Midday check-in",
        cron="0 14 * * *",
        prompt=(
            "Review today's deterministic task progress and calendar. In Persian, "
            "briefly state what is complete, what remains, what is overdue, and "
            "recommend a realistic adjustment for the rest of the day. Never "
            "invent a completion percentage."
        ),
    ),
    PersonalRoutine(
        id="evening_review",
        title_fa="گزارش پایان روز",
        title_en="Evening review",
        cron="0 21 * * *",
        prompt=(
            "Prepare a concise Persian end-of-day review using deterministic task "
            "progress, completed and deferred work, calendar activity, and "
            "important unresolved items. Carry unfinished priorities forward as "
            "recommendations, not fabricated task mutations."
        ),
    ),
    PersonalRoutine(
        id="weekly_review",
        title_fa="گزارش هفتگی",
        title_en="Weekly review",
        cron="0 19 * * 5",
        prompt=(
            "Prepare a Persian weekly review from the week's actual task and "
            "calendar data. Summarize completed priorities, recurring delays, "
            "notable progress, and next week's focus. Numeric claims must come "
            "from application data rather than model estimates."
        ),
    ),
)
