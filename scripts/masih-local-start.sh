#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== Masih Personal Agent: local bootstrap =="

need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing dependency: $1"
    return 1
  }
}

if ! need docker; then
  echo "Install and open Docker Desktop first: https://www.docker.com/products/docker-desktop/"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker is installed but not running. Open Docker Desktop and rerun this script."
  exit 1
fi

if ! need mise; then
  echo "mise is required. On macOS install it with: brew install mise"
  exit 1
fi

echo "Installing pinned toolchain from mise.toml..."
mise install

if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
fi
if [ ! -f apps/web/.env ]; then
  cp apps/web/.env.example apps/web/.env
fi

# Keep this private local instance in development mode. --agent supplies
# DEV_AUTH_BYPASS_EMAIL at runtime, so WorkOS is not required for local use.
python3 - <<'PY'
from pathlib import Path
p = Path("apps/api/.env")
text = p.read_text()
replacements = {
    "ENV=development                      # Environment type: development, staging, production": "ENV=development",
    "HOST=http://localhost:8000           # Backend host URL": "HOST=http://localhost:8000",
    "FRONTEND_URL=http://localhost:3000   # Frontend URL": "FRONTEND_URL=http://localhost:3000",
}
for old, new in replacements.items():
    text = text.replace(old, new)
p.write_text(text)
PY

if ! grep -Eq '^GOOGLE_API_KEY=.+|^OPENROUTER_API_KEY=.+' apps/api/.env; then
  echo
  echo "No LLM API key is configured."
  echo "Edit apps/api/.env and set ONE of:"
  echo "  GOOGLE_API_KEY=..."
  echo "  OPENROUTER_API_KEY=..."
  echo
  echo "Then run this script again."
  exit 2
fi

echo "Installing JavaScript dependencies..."
corepack enable >/dev/null 2>&1 || true
pnpm install

echo "Installing API dependencies..."
(
  cd apps/api
  uv sync --group backend --group dev
)

echo "Starting Docker infrastructure..."
nx run docker:docker:up

LOG="/tmp/masih-gaia-local.log"
rm -f "$LOG"

echo "Starting Masih Personal Agent..."
DEV_USER="${DEV_USER:-dev@gaia.local}" mise dev --agent >"$LOG" 2>&1 &
APP_PID=$!

cleanup() {
  if kill -0 "$APP_PID" >/dev/null 2>&1; then
    kill "$APP_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup INT TERM

echo "Waiting for API..."
ready=0
for _ in $(seq 1 120); do
  if curl -fsS http://localhost:8000/health >/dev/null 2>&1; then
    ready=1
    break
  fi
  if ! kill -0 "$APP_PID" >/dev/null 2>&1; then
    echo "GAIA stopped during startup. Last logs:"
    tail -n 120 "$LOG" || true
    exit 1
  fi
  sleep 2
done

if [ "$ready" != "1" ]; then
  echo "API did not become healthy. Last logs:"
  tail -n 120 "$LOG" || true
  exit 1
fi

echo "Seeding local user..."
DEV_USER="${DEV_USER:-dev@gaia.local}" mise run seed >/dev/null

echo
echo "Masih Personal Agent is running."
echo "Web: http://localhost:3000"
echo "API: http://localhost:8000"
echo "Logs: $LOG"
echo

if command -v open >/dev/null 2>&1; then
  open http://localhost:3000 || true
fi

tail -f "$LOG" &
TAIL_PID=$!
wait "$APP_PID"
kill "$TAIL_PID" >/dev/null 2>&1 || true
