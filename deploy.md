# Deploying glock-page to Vercel

---

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`) or GitHub integration
- Vercel account
- Supabase project running with migrations applied (see [glock/deploy.md](../glock/deploy.md#1-supabase-setup))
- Custom domain `getglock.dev` (optional but recommended)

---

## Environment Variables

Set these in Vercel dashboard → Settings → Environment Variables:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (e.g., `https://<ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key (safe for client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only — used by tRPC) |
| `NEXT_PUBLIC_APP_URL` | No | App base URL (default: `https://glock.dev`) |

`NEXT_PUBLIC_*` vars are embedded at build time. Changing them requires a redeploy.

---

## Step-by-Step

### Option A: Vercel CLI

```bash
cd glock-page

vercel login
vercel --prod
```

Set environment variables before first deploy:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
```

### Option B: GitHub Integration (recommended)

1. Push `glock-page/` to GitHub
2. Vercel dashboard → New Project → Import from GitHub
3. Set root directory to `glock-page`
4. Add environment variables in the setup screen
5. Deploy — Vercel auto-deploys on every push to `main`

---

## Custom Domain

1. Vercel dashboard → your project → Settings → Domains
2. Add `getglock.dev` (and optionally `www.getglock.dev`)
3. Point DNS:
   - `getglock.dev` → CNAME to `cname.vercel-dns.com`
   - Or use Vercel's nameservers for automatic DNS

---

## Security Headers

Already configured in `next.config.mjs` — no additional setup needed:

- `X-Frame-Options: DENY` — prevents clickjacking
- `Strict-Transport-Security: max-age=63072000` — enforces HTTPS
- `Content-Security-Policy` — restricts to self + `*.supabase.co`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Monitoring

### Vercel Dashboard

- Function invocations and execution time
- Error rates and cold start frequency
- Edge network performance

### Supabase Dashboard

- `device_codes` table — check for stuck or expired codes
- `cli_tokens` table — active sessions count, expiry distribution
- Auth logs — failed login attempts

### Key Metrics

- Device flow completion rate (requestDeviceCode → pollDeviceAuth authorized)
- Auth page load time
- tRPC error rate (500s usually mean bad `SUPABASE_SERVICE_ROLE_KEY`)

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| tRPC 500 errors | Invalid `SUPABASE_SERVICE_ROLE_KEY` | Regenerate key in Supabase dashboard, update in Vercel |
| Device auth never completes | Device code expired (15 min TTL) | Re-run `glock login` for a fresh code |
| "Invalid or expired code" in browser | User code typo or expiry | Check code matches exactly (case-insensitive, dashes optional) |
| CORS errors from CLI | CLI should not call glock-page directly for LLM | CLI calls glock-page only for auth; LLM goes to glock-server |
| Login page shows blank | Missing `NEXT_PUBLIC_SUPABASE_URL` or `ANON_KEY` | These are build-time vars — redeploy after setting them |
| Magic link not arriving | Supabase email config | Check Supabase Auth → Email Templates and SMTP settings |
