# Redeploy HoBags to Vercel — Step-by-Step

This guide walks you through deploying the changes that wire your Vercel frontend
(`greatwallbags.vercel.app`) to your Termux backend.

## What changed in this repo (3 files)

| File | Change |
|------|--------|
| `src/services/api.ts` (line 1) | `API_BASE` now uses **relative `/api` in production** so all API calls hit same-origin `greatwallbags.vercel.app/api/...` (proxied to your phone). Dev still uses `http://localhost:3002/api`. |
| `src/vite-env.d.ts` (new) | Type reference for `import.meta.env` so editors/TS don't complain. |
| `vercel.json` (new) | Reverse proxy: `/api/*` → your Cloudflare tunnel URL, plus SPA fallback for deep links, plus `no-cache` on the API. |

`vercel.json` currently contains a **placeholder** tunnel URL — you must replace it with your
real one before deploying (Step 1).

---

## Step 0 — Get your tunnel URL from the phone

The backend must be running and tunneled first. On **Termux**:

```bash
sv log tunnel
# look for a line like:  |  https://random-words.trycloudflare.com  |
```

or, if you ran `cloudflared` in a terminal:

```bash
cloudflared tunnel --url http://localhost:3002
```

Copy the full `https://…trycloudflare.com` URL. If no URL appears, make sure both services are up:

```bash
sv status hobags tunnel
```

> Quick-tunnel URLs are **temporary**. Keep the tunnel running and it stays the same.
> If it ever restarts and generates a new URL, redo Steps 1–3 (see Section "After a tunnel URL change").

---

## Step 1 — Put the real URL into `vercel.json`

On your **PC**, open `vercel.json` (project root) and replace the placeholder:

```json
"destination": "https://YOUR-TUNNEL.trycloudflare.com/api/:path*"
```

becomes, for example:

```json
"destination": "https://quiet-glasses-abc123.trycloudflare.com/api/:path*"
```

Save the file. Keep everything else as-is.

Sanity check from any device that the tunnel responds:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-TUNNEL.trycloudflare.com/api/auth/me
# 401 = good (auth is enforced, tunnel is alive)
```

---

## Step 2 — Choose how you deploy

### Method A — Git + Vercel (auto-deploy on push) — best for repeat changes

1. Create a GitHub repo (New Repository) named e.g. `hobags`.
2. On the PC, from the project root:

   ```powershell
   cd "D:\Rutaab Ali Access\Hobags\HoBags"
   git init
   git add src/services/api.ts src/vite-env.d.ts vercel.json package.json index.html vite.config.ts tsconfig.json tailwind.config.js postcss.config.js
   git commit -m "Wire frontend to Termux backend via Vercel /api proxy"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hobags.git
   git push -u origin main
   ```

   > Only add the files listed — keep `backend/`, `node_modules/`, `dist/` and any secrets out.
   > (Add a `.gitignore` with `node_modules/`, `dist/`, `backend/node_modules/` if you don't have one.)

3. Vercel dashboard → **Add New Project → Import** → pick your GitHub repo.
   - Framework preset: **Vite** (Vercel auto-detects).
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**. Vercel downloads, builds, and publishes automatically.
5. Confirm the deployment URL matches `greatwallbags.vercel.app` (or add this repo to your
   existing project: Project Settings → Git → connect the repo).

   From now on, every `git push` to `main` auto-redeploys — exactly what you want each time a
   tunnel URL changes (just edit `vercel.json`, commit, push).

### Method B — Vercel CLI (no Git required, one-off)

1. Make sure you have Node.js on the PC (or run from any machine with node + internet):

   ```powershell
   npm i -g vercel
   vercel login
   ```

2. Link to your existing `greatwallbags` project:

   ```powershell
   cd "D:\Rutaab Ali Access\Hobags\HoBags"
   vercel link
   # follow the prompts; choose the existing greatwallbags project
   ```

3. Deploy to production:

   ```powershell
   vercel --prod
   ```

4. Answer the framework/preset prompts (`vite`, build `npm run build`, output `dist`).

> Use whichever method you already have. Git + auto-deploy is the smoother long-term choice.

---

## Step 3 — Verify the wiring end-to-end

From **anywhere with internet** (PC, phone browser, curl):

```bash
# 1) The page loads (React app from Vercel CDN):
curl -s -o /dev/null -w "%{http_code}\n" https://greatwallbags.vercel.app/                  # 200

# 2) The /api proxy reaches your phone:
curl -s -o /dev/null -w "%{http_code}\n" https://greatwallbags.vercel.app/api/auth/me       # 401 (not 502!)

# 3) Login works through the whole chain:
curl -s -X POST https://greatwallbags.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@hobags.com","password":"admin"}' | head -c 160            # returns a token JSON
```

Browser checklist on `https://greatwallbags.vercel.app`:
- [ ] Page renders, fonts load.
- [ ] `/product/…` deep links work on refresh (no 404) — proves the SPA fallback.
- [ ] Register / login works and you can browse API-driven pages (dashboard/profile).
- [ ] Watch the **Termux backend console** — requests should appear there (log via `sv log hobags`).

If `api/auth/me` returns **502 / `ROUTER_EXTERNAL_TARGET_ERROR`** → the tunnel is down or the URL
in `vercel.json` is wrong. Check `sv status tunnel`, copy the current URL, fix `vercel.json`,
redeploy (Step 2).

---

## After a tunnel URL change (quick tunnels are temporary)

Every time `cloudflared` restarts you get a **new URL**. To keep things working:

```bash
# 1) On the phone, copy the new URL:
sv log tunnel

# 2) On the PC, update vercel.json:
#    "destination": "https://NEW-URL.trycloudflare.com/api/:path*"

# 3) Redeploy:
#    Git:   git add vercel.json && git commit -m "Update tunnel URL" && git push
#    CLI:   vercel --prod
```

That's it — `api.ts`, CSP, and CORS need **no** changes ever again (only `vercel.json`).

To minimize how often this happens: leave the tunnel running (don't restart the phone or the
`cloudflared` service), and enable Termux:Boot autostart so it survives reboots.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `404` on `/api/...` | `/api` rewrite is missing or appears *after* the `/(.*)` fallback in `vercel.json` — order matters. |
| `502` / `ROUTER_EXTERNAL_TARGET_ERROR` | Tunnel down or stale URL in `vercel.json` (Step 0 + "After a tunnel URL change"). |
| Old version still live after deploy | Vercel CDN caching — wait a minute or do "Redeploy" from the dashboard. Check the deploy status in Vercel → Deployments. |
| `CORS` / `CSP` errors in console | Should be impossible with this setup (same origin). If you see them, some page is calling an absolute old URL — hard-refresh the browser (Ctrl+Shift+R). |
| Login works locally but not on Vercel | The tunnel may be behind/broken, or `vercel.json` has the wrong URL. Verify `curl https://greatwallbags.vercel.app/api/auth/me` returns `401`. |
| `vercel link` can't find the project | Log into the correct account (`vercel login`), then `vercel link --yes` and select the right team/project. |
| Upload limit error on Hobby | CLI source upload cap is 100 MB — make sure `node_modules/` and `dist/` are not being uploaded (add `.gitignore`, don't `git add -A` blindly). |

---

## One-time summary (do this once)

```
Phone:   tunnel running  →  copy https://…trycloudflare.com
PC:      vercel.json  →  replace placeholder URL
Deploy:  git push  (or vercel --prod)
Verify:  /api/auth/me returns 401, login returns a token
```