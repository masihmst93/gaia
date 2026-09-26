# Masih Personal Agent V1

This branch customizes GAIA into Masih Personal Agent while keeping upstream GAIA intact.

## V1 goals
- Persian-first and RTL-aware experience.
- Personal assistant behavior: concise Persian, proactive, permission-aware.
- Daily Planning using calendar, tasks, priorities and unfinished work.
- Progress Tracking with deterministic calculations for planned/completed/partial/deferred/missed work.
- Daily and weekly AI review based on deterministic metrics.
- Preserve GAIA Gmail and Calendar integrations with conservative permissions.

## Architecture rule
Use application code for deterministic operations such as API calls, scheduling, state changes, calculations and permissions. Use the configured LLM for language understanding, prioritization, summarization and recommendations. Numeric progress must not rely on the LLM as the source of truth.

## V1 permission policy
- Gmail: read, summarize and draft first; no autonomous sending.
- Calendar: read availability and propose events; creation, update and deletion require confirmation initially.
- Never store provider secrets in the repository.

## Initial progress model
Daily items support planned, in_progress, completed, deferred and missed states, plus optional 0-100 progress and priority weight.

## Development sequence
1. Map existing GAIA web, API, agent and integration architecture.
2. Add locale/direction foundation and Persian copy.
3. Add Daily Plan and Progress domain models/APIs.
4. Add Today dashboard and review UI.
5. Connect Gmail/Calendar context and scheduled check-ins.
6. Add tests, permission review and deployment setup.
