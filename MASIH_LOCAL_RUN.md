# Run Masih Personal Agent locally on macOS

This is the zero-VPS path for using the current `masih-agent-v1` branch on a Mac.

## Prerequisites

1. Docker Desktop installed and running.
2. Homebrew installed.
3. `mise` installed:

```bash
brew install mise
```

## First run

Clone the personalized branch:

```bash
git clone -b masih-agent-v1 https://github.com/masihmst93/gaia.git
cd gaia
```

Create the local env files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Open `apps/api/.env` and configure at least one real LLM provider:

```env
GOOGLE_API_KEY=...
```

or:

```env
OPENROUTER_API_KEY=...
```

For local use we run with `--agent`, which uses the development auth bypass, so WorkOS is not required just to use the private local agent.

Then launch everything with:

```bash
bash scripts/masih-local-start.sh
```

The script installs the pinned toolchain and dependencies, starts Docker infrastructure, starts the web/API, waits for health, seeds the local user, and opens the web app.

- Web: http://localhost:3000
- API: http://localhost:8000
- Logs: `/tmp/masih-gaia-local.log`

## Gmail and Calendar

The core agent can run without Gmail/Calendar. To connect those later, add the required Composio configuration to `apps/api/.env` and use the Integrations page.

## Stop

Press `Ctrl+C` in the terminal that is running the launcher. Docker infrastructure can be stopped separately using the repository's GAIA/mise tooling when desired.
