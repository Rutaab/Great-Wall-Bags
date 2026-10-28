# HoBags — Termux Backend + Vercel Frontend (100% Free)

Deploy the **HoBags backend on your Android phone (Termux)** and connect your **existing Vercel
frontend** (`greatwallbags.vercel.app`) to it — with zero server cost.

Stack in this guide:

| Part | Where | What |
|------|-------|------|
| Frontend (React/Vite SPA) | Vercel — already live at `https://greatwallbags.vercel.app` | Static `dist/` build, served by Vercel CDN |
| Backend (Express API) | **Termux on your phone** — port `3002` | `backend/server.js`, JSON "database" in `backend/data/` |
| Connector | **Cloudflare quick tunnel** (free, no account) | Exposes `localhost:3002` as a public `https://xxx.trycloudflare.com` URL |
| Bridge | **Vercel rewrite** in `vercel.json` | Makes `https://greatwallbags.vercel.app/api/*` proxy to your phone |

Everything in this guide is $0. Requires: an Android phone, Termux (from F-Droid), your
`backend/` code, and edit+redeploy access to your Vercel project.

> The older Rust-era `DEPLOY_GUIDE.md` is **outdated**. This repository is the Node.js/Express
> backend + Vite frontend described here.

---

## 0. How the requests flow

```
 Visitor's browser
        │  https://greatwallbags.vercel.app
        ▼
 Vercel CDN ───────────────▶ serves the React app (static files)
        │  fetch('/api/../...')  ← same origin, no CORS, allowed by CSP 'self'
        ▼
 vercel.json external rewrite (reverse proxy)
        │  forwards the request (with headers/body/JWT)
        ▼
 https://YOUR-TUNNEL.trycloudflare.com   ← Cloudflare tunnel (runs on the phone)
        ▼
 localhost:3002  →  node backend/server.js  →  JSON files in backend/data/
```

Because the rewrite is **server-side**, the visitor's browser only ever talks to
`greatwallbags.vercel.app`. That means:
- **No CORS problems** (browser sees one origin),
- **No CSP change** needed (the page's `connect-src 'self'` already allows same-origin `/api`),
- The phone's real address stays hidden.

---

## 1. The configuration "hot spots" (read this before anything)

| # | File | Current value | What to do |
|---|------|---------------|------------|
| 1 | `src/services/api.ts` line 1 | `const API_BASE = 'http://localhost:3002/api'` | Make production use **relative `/api`** (Section 9.1 step 1). |
| 2 | `vercel.json` (create it) | — | Add an **external rewrite** `/api/* → https://TUNNEL.trycloudflare.com/api/*` (Section 9.1 step 2). |
| 3 | `backend/server.js` line 14 (CORS) | allow-list of `localhost` origins | **Leave as is** for the recommended setup. Only Option B (direct browser→phone) needs it (Section 9.2). |
| 4 | `index.html` CSP `connect-src` | `'self' http://localhost:* ws:` | **Leave as is** for the recommended setup. Only Option B needs a change (Section 9.2). |

---

## 2. Prerequisites

- Android phone + **Termux** from F-Droid (Play Store build is abandoned): `https://f-droid.org/packages/com.termux/`
- Optional F-Droid add-on: **Termux:Boot** (auto-start backend after reboot).
- Your **`backend/`** folder reachable on the phone (Git repo, zip, or SSH/SFTP).
- Your PC (to edit `api.ts` / `vercel.json` and redeploy to Vercel — or do it via GitHub).
- Your Vercel project (`greatwallbags.vercel.app`) able to be redeployed (GitHub/GitLab
  connection or the Vercel CLI).

---

## 3. Termux — install & update

```bash
pkg update -y
pkg upgrade -y
echo $PREFIX    # → /data/data/com.termux/files/usr
```

### 4. Install the packages

```bash
pkg install -y \
  nodejs-lts \     # runtime for the backend
  git openssh \    # get code on the phone
  curl nano \      # testing + editing
  termux-services  # run the backend as a background daemon
  cloudflared      # FREE public tunnel
```

Verify: `node -v` (v20/v22), `npm -v` (10.x), `cloudflared version`.

> `termux-wake-lock` is bundled with the Termux app. If missing, install the **Termux:API**
> add-on + `pkg install termux-api`.

### 5. Storage access (only if you copy files manually)

```bash
termux-setup-storage     # allow the dialog; ~/storage/shared = /sdcard
```

---

## 6. Get the backend onto the phone

You only need `backend/` (`server.js`, `package.json`, `data/`). Skip `node_modules/` — it is
installed on the phone.

### Option A — Git clone (recommended)

Push the repo (or just the backend) to GitHub/GitLab on your PC, then:

```bash
mkdir -p ~/hobags && cd ~/hobags
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
```

### Option B — Zip

Zip `backend/` on your PC, drop it in `Download/`, then:

```bash
cd ~
termux-setup-storage
cp ~/storage/shared/Download/backend.zip ~/
unzip backend.zip -d ~/hobags
```

### Option C — SSH/SFTP

```bash
# ON PHONE:
sshd; whoami; ifconfig wlan0 | grep "inet "
# ON PC (PowerShell):
scp -P 8022 -r "D:\Rutaab Ali Access\Hobags\HoBags\backend" u0_a123@PHONE_IP:~/hobags/
```

---

## 7. Install & configure the backend

```bash
cd ~/hobags/backend
npm install          # only 4 packages: express, cors, jsonwebtoken, uuid
```

Edit secrets — `nano ~/hobags/backend/server.js` (lines 9–14):

```js
const PORT = 3002;                                   // keep
const JWT_SECRET = 'hobags_jwt_secret_2024_kinetic'; // CHANGE
const PEPPER = 'H0B@g5_S@lt_K!n3t1c_2024';           // CHANGE
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], credentials: true }));
```

Replace the two strings with long random values (keep the quotes), save `Ctrl+O⏎`, exit `Ctrl+X`.
**Leave the CORS line exactly as is** for the recommended setup (Section 9.1).

The "database" is `backend/data/*.json` — users, orders, messages, plus `manufacturer_*.json`
demo data. If a file is missing the server just starts with that collection empty.

---

## 8. Run the backend & expose it publicly

### 8.1 First test (foreground)

```bash
node server.js       # → "HoBags API server running on http://localhost:3002"
```

Second Termux session:

```bash
curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@hobags.com","password":"admin"}'   # returns a JSON token
```

Stop with `Ctrl+C`.

### 8.2 Run as a background service (survives closed tabs)

```bash
mkdir -p $PREFIX/var/service/hobags
cat > $PREFIX/var/service/hobags/run <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
exec node /data/data/com.termux/files/home/hobags/backend/server.js
EOF
chmod +x $PREFIX/var/service/hobags/run
sv-enable hobags
```

> Adjust the `exec node …` path to your real project path (`echo ~` to confirm).

### 8.3 Keep the phone awake & auto-start on reboot

```bash
termux-wake-lock      # stop CPU sleep; undo: termux-wake-unlock
```

Android: **Settings → Apps → Termux → Battery → Unrestricted**.

With the **Termux:Boot** add-on installed:

```bash
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/start_hobags.sh <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
sv-enable hobags
sv-enable tunnel
EOF
chmod +x ~/.termux/boot/start_hobags.sh
```

### 8.4 Public tunnel (the URL Vercel will proxy to)

Quick test:

```bash
cloudflared tunnel --url http://localhost:3002
# → copy the printed URL:  https://random-words.trycloudflare.com
# THIS URL IS TEMPORARY — a new tunnel = a new URL (Section 10)
```

Verify from anywhere:

```bash
curl https://random-words.trycloudflare.com/api/auth/me   # expect 401 (auth works)
```

To keep the tunnel alive permanently, run it as a service too:

```bash
mkdir -p $PREFIX/var/service/tunnel
cat > $PREFIX/var/service/tunnel/run <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
exec cloudflared tunnel --url http://localhost:3002
EOF
chmod +x $PREFIX/var/service/tunnel/run
sv-enable tunnel
# watch logs to get the URL:
sv log tunnel
```

> Keep the tunnel process running — don't restart it — and the URL won't change.
> For a *stable* free URL see Section 10.5.

---

## 9. Connect the Vercel frontend to the Termux backend

**Pick ONE. Option A is strongly recommended.**

### Option A — Vercel reverse proxy (recommended: no CORS, no CSP)

The browser stays on `greatwallbags.vercel.app`; Vercel secretly forwards `/api/*` to your
phone via the tunnel. This is 3 edits + 1 redeploy:

**Step 1 — point `API_BASE` at the same origin in production.**

`src/services/api.ts` line 1:

```ts
const API_BASE = import.meta.env.DEV ? 'http://localhost:3002/api' : '/api'
```

- Dev (`npm run dev` on your PC) still calls `localhost:3002` directly.
- Production uses `/api` → same origin as the page → CSP `'self'` already allows it.

(If your editor/TS build complains about `import.meta.env`, add a file `src/vite-env.d.ts` with:

```ts
/// <reference types="vite/client" />
```

and make sure `"types": ["vite/client"]` isn't excluded in `tsconfig.json`.)

**Step 2 — create `vercel.json`** (project root) with the proxy and SPA fallback:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://random-words.trycloudflare.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Vercel-CDN-Cache-Control", "value": "no-cache" }
      ]
    }
  ]
}
```

- The **order matters**: the `/api` rewrite must come **before** the SPA catch-all.
- `"/(.*)" → "/index.html"` is the standard SPA fallback so React-Router deep links
  (e.g. `/product/123`) don't 404 when refreshed.
- The `no-cache` header stops Vercel from CDN-caching your API responses (auth data must
  never be cached even if your backend later adds `Cache-Control`).
- Method, headers and body (including `Authorization: Bearer …`) are forwarded by Vercel,
  so JWT auth keeps working.

**Step 3 — redeploy the Vercel project** (Section 9.3).

**No changes to `server.js` CORS and no changes to `index.html` CSP.** Done.

### Option B — Direct browser→phone (no proxy)

Only use this if you want to avoid `vercel.json`. It exposes the phone URL to end users and
needs 4 edits:

1. `src/services/api.ts`: `const API_BASE = 'https://random-words.trycloudflare.com/api'`
2. `index.html` CSP — add the tunnel URL to `connect-src`:
   ```html
   <meta http-equiv="Content-Security-Policy" content="... connect-src 'self' http://localhost:* https://random-words.trycloudflare.com ws:; ...">
   ```
3. `backend/server.js` CORS — add the Vercel origin:
   ```js
   app.use(cors({ origin: ['https://greatwallbags.vercel.app'], credentials: true }));
   ```
   and restart the backend on the phone.
4. Rebuild & redeploy the frontend.

Downsides: CSP + CORS + `API_BASE` all contain the tunnel URL, so every tunnel restart (new
URL) requires editing three places and redeploying.

### 9.3 How to redeploy the Vercel frontend

**Via GitHub (easiest for repeat changes):**
1. On your PC: `git init`, add your files, push to GitHub.
2. Vercel dashboard → **Add New Project** → import that repo → it auto-deploys on every push.
3. Every time you change `vercel.json`/`api.ts` (e.g. after a tunnel URL change), just
   `git commit` + `git push` and Vercel redeploys.

**Via Vercel CLI (no GitHub needed):**
```powershell
npm i -g vercel
vercel login
cd "D:\Rutaab Ali Access\Hobags\HoBags"
vercel link                 # link to the greatwallbags project
vercel --prod               # production deploy
```

> Vercel Hobby (free) plan: unlimited projects & personal use, 100 GB data transfer/mo,
> proxied-request timeout 120 s — plenty for this API.

---

## 10. The tunnel URL changed — now what?

Quick tunnels give you a **new URL every time the `cloudflared` process restarts**. Keeping the
process alive (Section 8.4) avoids this entirely.

If the URL **does** change:

- **Option A:** edit `vercel.json` → `"destination": "https://NEW-URL.trycloudflare.com/api/:path*"` → commit/push (or `vercel --prod`).
- **Option B:** update `API_BASE` (api.ts), the CSP `connect-src`, and the CORS list, then redeploy **and** restart the backend.

### 10.5 Free *stable* URL alternatives

| Option | Cost | Stable? | How |
|--------|------|---------|-----|
| Cloudflare quick tunnel (this guide) | Free | No | Random URL every restart |
| Cloudflare **named tunnel** | Free daemon, but needs DNS | Yes | Register a free subdomain source (e.g. `eu.org`, `is-a.dev` feature requests) + create a Cloudflare account; `cloudflared tunnel route dns …` |
| `localhost.run` | Free | No | `ssh -R 80:localhost:3002 nokey@localhost.run` |
| Buy your own domain (~$8–10/yr) + Cloudflare named tunnel | Small domain cost | Yes | Fixed `api.yourdomain.com` — the only truly reliable free-ish option |

---

## 11. End-to-end verification

```bash
# 1) Backend alive on the phone:
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3002/api/auth/me        # 401 (auth enforced)

# 2) Tunnel reaches the backend:
curl -s -o /dev/null -w "%{http_code}\n" https://random-words.trycloudflare.com/api/auth/me   # 401

# 3) Vercel proxy reaches the backend (OPTION A — run from anywhere):
curl -s -o /dev/null -w "%{http_code}\n" https://greatwallbags.vercel.app/api/auth/me        # 401

# 4) Full login round-trip through Vercel:
curl -s -X POST https://greatwallbags.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@hobags.com","password":"admin"}' | head -c 160          # token JSON
```

Browser test: open `https://greatwallbags.vercel.app`, register/login, browse products, open an
API-driven page (e.g. a seller/manufacturer dashboard). Watch the phone's backend console —
requests should appear.

Also confirm local dev still works: on your PC `npm run dev` + `node backend/server.js`
(same as always).

---

## 12. Backups & migration (JSON = database)

```bash
cd ~
tar czf hobags-backend-$(date +%Y%m%d-%H%M).tar.gz \
     hobags/backend/data hobags/backend/server.js hobags/backend/package.json
cp hobags-backend-*.tar.gz ~/storage/shared/Download/
```

New phone: install Termux + `nodejs-lts`, copy `backend/`, `npm install`, recreate the services
(Section 8.2–8.4). Users/orders/messages come right back.

---

## 13. Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| `https://greatwallbags.vercel.app/api/…` → **404** | The `/api` rewrite is missing or placed **after** the SPA catch-all in `vercel.json` (Section 9.1 Step 2). Order matters. |
| `https://greatwallbags.vercel.app/api/…` → **502 / `ROUTER_EXTERNAL_TARGET_ERROR`** | The tunnel is down or the `destination` URL in `vercel.json` is stale. Check `sv status tunnel` and `sv log tunnel`; update the URL (Section 10). |
| Browser shows **CSP** errors | You chose Option B without adding the tunnel URL to `connect-src`, or a page is calling an old tunnel URL. |
| Browser shows **CORS** errors | Same-origin proxy (Option A) never produces this; Option B needs the Vercel origin in `server.js` CORS. |
| **Mixed content** ("insecure connection") | A `https://` page calling an `http://` API. Always use the tunnel URL (https). |
| Auth works via tunnel but **fails through Vercel** | Cached response or forwarded header issue. Ensure `no-cache` header (Section 9.1) and redeploy. |
| Site loads but **deep links 404** | Missing SPA fallback `"/(.*)" → "/index.html"` in `vercel.json`. |
| **`port 3002 is already in use`** on phone | Old backend running: `pkill -f server.js` or `sv-disable hobags`, then re-enable. |
| Phone unreachable after overnight | Battery killed Termux. `termux-wake-lock`, Unrestricted battery, termux-services (Section 8.3). |
| `npm install` fails / ETIMEDOUT | `npm config set registry https://registry.npmjs.org` and retry. |
| Working before, broke after tunnel restart | New URL → you must update `vercel.json` (+ `api.ts`/CSP/CORS in Option B) and redeploy (Section 10). |

---

## 14. Security checklist

- [ ] Change `JWT_SECRET` and `PEPPER` in `backend/server.js` (Section 7).
- [ ] Re-seed or delete the known `dev@hobags.com` / `admin` account if publicly exposing.
- [ ] The tunnel URL contains **your** phone — never share it publicly if you care; Option A's
      proxy hides it. Either way, HTTPS tunnel (never raw `http://IP:3002`).
- [ ] Back up `backend/data/` (the entire database).
- [ ] Passwords are SHA-256 + fixed pepper — fine for a demo; use `bcrypt`/`argon2` for production.
- [ ] JSON-file writes are sequential/single-process — okay for low traffic; consider a real
      database if you get concurrent users.
- [ ] Note: Vercel Hobby is limited to **personal, non-commercial** use; upgrade to Pro if
      commercial.

---

## 15. Quick reference (Option A, the whole thing)

```bash
# ── PHONE (Termux) ─────────────────────────────────────────────
pkg update -y && pkg upgrade -y
pkg install -y nodejs-lts git openssh curl nano termux-services cloudflared

cd ~/hobags/backend
npm install
nano server.js                          # change JWT_SECRET + PEPPER

# background services
mkdir -p $PREFIX/var/service/hobags
printf '#!/data/data/com.termux/files/usr/bin/bash\nexec node /data/data/com.termux/files/home/hobags/backend/server.js\n' > $PREFIX/var/service/hobags/run
chmod +x $PREFIX/var/service/hobags/run && sv-enable hobags

mkdir -p $PREFIX/var/service/tunnel
printf '#!/data/data/com.termux/files/usr/bin/bash\nexec cloudflared tunnel --url http://localhost:3002\n' > $PREFIX/var/service/tunnel/run
chmod +x $PREFIX/var/service/tunnel/run && sv-enable tunnel
termux-wake-lock
sv log tunnel      # → copy https://xxxx.trycloudflare.com

# ── PC (project) ────────────────────────────────────────────────
# 1) src/services/api.ts line 1:
#    const API_BASE = import.meta.env.DEV ? 'http://localhost:3002/api' : '/api'
# 2) create vercel.json  (Section 9.1 Step 2)  with your tunnel URL
# 3) deploy:  git push   (or:  vercel --prod )
```