# glock-page

Landing page and device flow authentication for [Glock](../glock/). Deployed at [getglock.dev](https://getglock.dev) on Vercel.

---

## What it Does

- **Landing page** at `getglock.dev` — install instructions, benchmarks, feature overview
- **Device flow auth** — browser-based CLI login (`glock login` → user enters code → CLI gets token)
- **tRPC API** — device code requests, polling, token validation, and revocation
- **OAuth callback** — handles Supabase Auth magic links and OAuth redirects

No runtime interaction with the agent loop — this app is only used during authentication.

---

## Prerequisites

- Node.js >= 18 (or Bun)
- Supabase project with `device_codes` and `cli_tokens` tables (see [glock/deploy.md](../glock/deploy.md#1-supabase-setup))

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | No | App base URL (default: `https://glock.dev`) |

---

## Setup & Run

```bash
npm install
cp .env.local.example .env.local   # Fill in Supabase credentials
npm run dev                         # Dev server on localhost:3000
```

### Build

```bash
npm run build
npm start          # Production server
```

---

## Pages

| Path | Description |
|---|---|
| `/` | Landing page — hero, install command, benchmarks, features |
| `/auth/login` | Email/password + magic link sign-in |
| `/auth/device?code=XXXX-YYYY` | Device authorization — user enters code from CLI |
| `/auth/callback` | OAuth/magic link callback handler |

---

## tRPC API

All procedures are on the `auth` router, accessible via `/api/trpc/[trpc]`.

| Procedure | Type | Auth | Description |
|---|---|---|---|
| `auth.requestDeviceCode` | mutation | Public | CLI starts device flow — returns `deviceCode`, `userCode` (XXXX-YYYY format), `verificationUri` |
| `auth.pollDeviceAuth` | query | Public | CLI polls every 5s — returns `pending`, `expired`, or `authorized` with `accessToken` |
| `auth.authorizeDevice` | mutation | Protected | Browser calls after user logs in — links device code to user |
| `auth.validate` | query | Public | Validate a CLI token — returns `valid` boolean and user info |
| `auth.revoke` | mutation | Public | Revoke a CLI token (logout) |

### Device flow timing

- Device codes expire in **15 minutes**
- CLI polls every **5 seconds**
- Generated CLI tokens expire in **30 days**
- User codes use unambiguous characters (no 0/O/I/1)

---

## Project Structure

```
glock-page/
├── pages/
│   ├── index.js                # Landing page
│   ├── _app.js                 # App wrapper
│   ├── _document.js            # HTML document
│   ├── auth/
│   │   ├── login.js            # Sign-in page
│   │   ├── device.js           # Device code authorization
│   │   └── callback.js         # Auth callback handler
│   └── api/
│       ├── authorize-device.js # Device auth API endpoint
│       └── trpc/[trpc].js      # tRPC handler
├── src/
│   ├── lib/
│   │   └── supabase.js         # Supabase client (browser + server)
│   └── server/
│       ├── trpc.js             # tRPC init, context, middleware
│       └── routers/
│           ├── _app.js         # Root router
│           └── auth.js         # Auth procedures
├── next.config.mjs             # Security headers, CSP
└── package.json
```

---

## Security

Security headers configured in `next.config.mjs`:
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy` (self + supabase.co)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Deployment

See [deploy.md](./deploy.md) for step-by-step Vercel deployment.

## Architecture

See [architecture.md](../architecture.md) for the full system design.

## Related

- [glock](../glock/) — CLI agent (main project)
- [glock-server](../glock-server/) — Stateless LLM proxy and bundle gateway
