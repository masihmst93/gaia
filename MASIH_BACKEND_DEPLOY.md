# Masih Personal Backend deployment

The Cloudflare web preview is only the frontend. The GAIA FastAPI backend needs a persistent Linux server because it also runs Postgres, MongoDB, Redis, ChromaDB, RabbitMQ, the ARQ worker, and the embedding sidecar.

## GitHub Preview environment configuration

Set these repository secrets in the **Preview** environment:

- `MASIH_VPS_HOST`: public IPv4 or hostname of an Ubuntu VPS.
- `MASIH_VPS_USER`: SSH user with sudo/docker access.
- `MASIH_VPS_SSH_KEY`: private SSH key for that VPS.
- `MASIH_BACKEND_ENV`: multiline API environment values. At minimum for login + chat, provide `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD`, and at least one usable LLM provider key such as `GOOGLE_API_KEY` or `OPENROUTER_API_KEY`. Add `COMPOSIO_KEY` for Gmail/Calendar integrations.

Set these Preview environment variables:

- `MASIH_BACKEND_DOMAIN`: HTTPS hostname pointing to the VPS. A normal domain/subdomain is preferred.
- After the backend is healthy, set `PREVIEW_API_BASE_URL=https://<MASIH_BACKEND_DOMAIN>/api/v1/`.

## Deploy order

1. Run **Deploy Masih Personal Backend**.
2. Confirm its public health check is green.
3. Set `PREVIEW_API_BASE_URL`.
4. Rerun **Deploy Web (Cloudflare)**.
5. Open `https://gaia-pr-1.masihmosavatmst.workers.dev`.

The workflow intentionally runs the API with `ENV=development` for this private preview so optional production-only services such as payments, E2B, voice, Cloudinary, and full observability do not block startup. Authentication remains real unless `DEV_AUTH_BYPASS_EMAIL` is explicitly supplied.
