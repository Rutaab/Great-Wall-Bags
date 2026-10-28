# HoBags — Complete Self-Hosted Deployment on Android (Termux)

Host the **entire** HoBags website on your own Android phone using **Termux**:

| Layer | What it is | Where it runs |
|-------|-----------|---------------|
| **Frontend** | React 18 + Vite SPA (the built `dist/` folder) | Termux — served by **nginx** on `127.0.0.1:8080` |
| **Backend** | Node.js + Express API (`backend/server.js`) | Termux — on `127.0.0.1:3002` |
| **Database** | Static JSON files in `backend/data/*.json` (users, orders, products, messages…) | Termux — on the phone's internal storage |
| **Public entry point** | Cloudflare Tunnel (free HTTPS) or Tailscale or LAN | Termux |

Nothing is hosted on Vercel, Netlify, or any other third party. The phone *is* the server.

> This guide is the "everything on my own server" version.
> - `DEPLOY_TERMUX.md` = backend on phone + frontend on Vercel (hybrid, uses Vercel as a proxy).
> - `deployment-guides/00–08` = the same full stack, but on a Linux VPS.
> - **This file** = full stack on Android/Termux only.

---

## Table of contents

1. [How the whole thing fits together](#1-how-the-whole-thing-fits-together)
2. [What you need before you start](#2-what-you-need-before-you-start)
3. [Part A — Prepare Termux](#part-a--prepare-termux)
4. [Part B — Get the project onto the phone](#part-b--get-the-project-onto-the-phone)
5. [Part C — Configure and run the backend](#part-c--configure-and-run-the-backend)
6. [Part D — Build the frontend](#part-d--build-the-frontend)
7. [Part E — Install and configure nginx](#part-e--install-and-configure-nginx)
8. [Part F — Run everything as background services](#part-f--run-everything-as-background-services)
9. [Part G — Keep the phone alive & auto-start after reboot](#part-g--keep-the-phone-alive--auto-start-after-reboot)
10. [Part H — Publish the site to the internet (HTTPS)](#part-h--publish-the-site-to-the-internet-https)
11. [Part I — Production email + Google login](#part-i--production-email--google-login)
12. [Part J — Backing up the JSON database](#part-j--backing-up-the-json-database)
13. [Part K — How to update the site later](#part-k--how-to-update-the-site-later)
14. [Part L — Full verification checklist](#part-l--full-verification-checklist)
15. [Troubleshooting](#troubleshooting)
16. [Security hardening checklist](#security-hardening-checklist)
17. [Appendix 1 — Alternative: one process, no nginx](#appendix-1--alternative-one-process-no-nginx)
18. [Appendix 2 — Alternative: LAN-only access](#appendix-2--alternative-lan-only-access)
19. [Appendix 3 — Quick reference: every command](#appendix-3--quick-reference-every-command)

---

## 1. How the whole thing fits together

```
                       Internet
                          │
        ┌─────────────────┴──────────────────┐
        │  Cloudflare Tunnel (cloudflared)   │   ← free, gives you HTTPS
        │  https://bags.example.com          │
        └─────────────────┬──────────────────┘
                          │  http://127.0.0.1:8080
                          ▼
   ┌──────────────────────────────────────────────────────┐
   │                 Termux (your phone)                  │
   │                                                      │
   │   nginx  ──── listens on 8080 ───────────────────┐   │
   │     │                                            │   │
   │     ├── "/"       → serves ~/hobags/dist/*       │   │  ← FRONTEND (static)
   │     │                (SPA fallback → index.html) │   │
   │     │                                            │   │
   │     └── "/api/…"  → proxy_pass 127.0.0.1:3002 ───┼───┼──► Express backend
   │                                                  │   │      │
   │                                                  │   │      ├── reads/writes
   │                                                  │   │      ▼
   │                                                  │   │   ~/hobags/backend/data/
   │                                                  │   │   users.json, orders.json,
   │                                                  │   │   products.json, …  ← DATABASE
   └──────────────────────────────────────────────────────┘
```

### Why this shape (the three "hot spots")

| # | Decision | Why |
|---|----------|-----|
| 1 | **One origin** (nginx serves both the page and `/api`) | The frontend calls `/api` relative — see [api.ts](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/src/services/api.ts#L3-L5). Same origin ⇒ **no CORS problems** and the page's CSP `connect-src 'self'` already allows it ([index.html](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/index.html#L7)). |
| 2 | **Port 8080, not 80** | Android apps (including Termux) run as an unprivileged user and **cannot bind ports below 1024**. 8080 is the standard replacement. |
| 3 | **Cloudflare Tunnel instead of opening a port** | Your mobile carrier almost certainly uses CGNAT, so port-forwarding won't work. A tunnel makes an **outbound** connection, so it works on Wi-Fi and 4G/5G alike, and you get HTTPS for free. |

### Ports used

| Port | Bound to | Who uses it |
|------|----------|-------------|
| `3002` | `127.0.0.1` (loopback only) | Express backend — never exposed directly |
| `8080` | `127.0.0.1` + LAN (or `0.0.0.0`) | nginx — your public entry point |
| `8022` | `0.0.0.0` | SSH (optional, for copying files) |

---

## 2. What you need before you start

**Hardware / software**

- An **Android phone** (Android 7+) you can leave powered on and plugged into a charger.
- The phone should have at least **4 GB RAM** and **3 GB free storage** (the frontend build pulls in `three.js` / `@react-three/*`, which is large).
- **Termux installed from F-Droid or GitHub — NOT from the Play Store.**
  - F-Droid: `https://f-droid.org/packages/com.termux/`
  - The Play Store build is abandoned by the developer and its package repository is broken; `pkg install` will fail.
- Optional but strongly recommended: **Termux:Boot** (same F-Droid page) so the server comes back after a reboot.
- Optional: **Termux:API** (only if `termux-wake-lock` reports "command not found").

**On your PC**

- The project folder: `d:\Rutaab Ali Access\Hobags\HoBags`
- Node.js 18+ installed (only needed if you build the frontend on the PC — the recommended way).

**Files you must know about**

| File | Role |
|------|------|
| `backend/server.js` | The entire API. Contains every route + the JSON read/write helpers |
| `backend/data/*.json` | **Your database.** 20 files: `users.json`, `orders.json`, `products.json`, `messages.json`, `reviews.json`, `requests.json`, `settings.json`, `supplier_warehouses.json`, `email_verification_store.json`, `reset_tokens.json`, and nine `manufacturer_*.json` demo files |
| `backend/.env` | Secrets + config (SMTP, JWT, allowed origins) |
| `dist/` | The built frontend. Regenerated by `npm run build` |
| `index.html` | SPA shell + the CSP meta tag |

---

## Part A — Prepare Termux

### A1. First launch, update everything

Open Termux and run:

```bash
pkg update -y && pkg upgrade -y
```

If it asks about overwriting config files, press **Enter** to accept the default.

Confirm where Termux stores everything:

```bash
echo $PREFIX
```

You should see exactly:

```
/data/data/com.termux/files/usr
```

**Write that path down mentally** — every config file in this guide lives under it, and nginx needs the absolute version.

### A2. Install the packages

```bash
pkg install -y nodejs-lts git openssh curl nano unzip nginx termux-services cloudflared
```

What each one is for:

| Package | Why |
|---------|-----|
| `nodejs-lts` | Runs `backend/server.js` (gives you `node` and `npm`) |
| `git` | Clone the project onto the phone |
| `openssh` | `scp`/`ssh` file transfer from your PC (optional) |
| `curl` | Testing endpoints |
| `nano` | Editing configs on the phone |
| `unzip` | Extract a zipped project |
| `nginx` | Serves the frontend + reverse-proxies `/api` |
| `termux-services` | Keeps node/nginx running in the background (runit) |
| `cloudflared` | Free HTTPS tunnel to the internet |

Verify the two most important ones:

```bash
node -v      # v20.x or v22.x
npm -v       # 10.x
nginx -v     # nginx/1.2x.x
```

> **If `nginx` is not found in the Termux repo**, your `pkg` sources are stale or you installed Termux from the Play Store. Re-run `pkg update`, and if it still fails, reinstall Termux from F-Droid.

### A3. (Only if you will copy files by hand) storage access

```bash
termux-setup-storage
```

Accept the Android permission dialog. Afterwards `~/storage/shared` points at `/sdcard`.

> **Critical rule:** keep the project inside Termux's home (`/data/data/com.termux/files/home`).
> **Never** run the app from `/sdcard` — that filesystem does not support the file permissions
> and symlinks Node/npm need, and `npm install` will fail there.

### A4. Sanity check

```bash
cd ~ && pwd       # /data/data/com.termux/files/home
```

Everything from here on assumes you are in `~/` (Termux home). The project will live at `~/hobags`.

---

## Part B — Get the project onto the phone

You need these from the project:

- `backend/` — **everything except `node_modules/`** (it gets reinstalled on the phone)
- `dist/` — either the pre-built folder, or you rebuild it on the phone (Part D)
- `package.json`, `package-lock.json` — only needed if you build on the phone

You do **not** need `src/`, `Prototype/`, `certs/`, or any of the `*.log` files to run a production build.

### Option 1 — Git clone (recommended)

On your **PC**, push the project to a (private) GitHub repository. Then on the phone:

```bash
mkdir -p ~/hobags && cd ~/hobags
git clone https://github.com/YOUR_USERNAME/hobags.git .
```

> If the repo is private, use a Personal Access Token as the password when prompted.

### Option 2 — Copy with scp from your PC

On the **phone**, start the SSH server and find the phone's IP:

```bash
sshd
whoami                                   # e.g. u0_a184
ifconfig wlan0 | grep "inet "            # e.g. inet 192.168.1.42
```

On the **PC** (PowerShell), copy the two folders you need:

```powershell
mkdir -Force -Path "D:\Rutaab Ali Access\Hobags\HoBags\backend\node_modules" | Out-Null
scp -r -P 8022 "D:\Rutaab Ali Access\Hobags\HoBags\backend" u0_a184@192.168.1.42:~/hobags/
scp -r -P 8022 "D:\Rutaab Ali Access\Hobags\HoBags\dist"    u0_a184@192.168.1.42:~/hobags/
```

> `node_modules` will be skipped/overwritten on the phone — that is fine, you reinstall it in Part C.

### Option 3 — ZIP + phone file manager

On the **PC**, zip `backend` and `dist` into one file `hobags.zip`, then transfer it to the phone
(USB, Google Drive, or `~/storage/shared/Download/`). On the phone:

```bash
cd ~ && unzip ~/storage/shared/Download/hobags.zip -d ~/hobags
```

### Verify what you got

```bash
ls ~/hobags
# expect: backend  dist

ls ~/hobags/backend
# expect: data  package.json  server.js  (and .env, .env.example)

ls ~/hobags/backend/data | wc -l
# expect: 20
```

If `data/` is missing or short, **stop** — that folder is your database and the site will come up empty without it.

---

## Part C — Configure and run the backend

The backend reads configuration from **environment variables**, loaded from `backend/.env` by
`require('dotenv').config()` (line 1 of [server.js](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/backend/server.js#L1)).

### C1. The complete list of variables the code actually reads

| Variable | Default in code | Set it? |
|----------|-----------------|---------|
| `NODE_ENV` | *(unset)* | **Yes** → `production` |
| `PORT` | `3002` | Optional (leave 3002) |
| `JWT_SECRET` | `hobags_jwt_secret_2024_kinetic` | **Yes — change it** |
| `AUTH_PEPPER` | `H0B@g5_S@lt_K!n3t1c_2024` | **Yes — change it** |
| `ALLOWED_ORIGINS` | localhost list | **Yes** → add your public URL |
| `GOOGLE_REDIRECT_URIS` | localhost + Vercel | Yes, if you keep Google login |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | hardcoded fallbacks | Optional |
| `DEVELOPER_PASSWORD` | `admin` | Optional — seed password for `dev@hobags.com` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | empty | **Yes for a real public site** (Part I) |

> ⚠️ `PEPPER`, not `AUTH_PEPPER`, appears in the older `deployment-guides/03` file. The code reads
> **`AUTH_PEPPER`** ([server.js](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/backend/server.js#L19)).
> Use `AUTH_PEPPER` — if it is wrong, every existing password hash stops matching and nobody can log in.

### C2. Install dependencies

```bash
cd ~/hobags/backend
npm install
```

Verify (this is the exact dependency set in `backend/package.json`):

```bash
node -e "require('cors');require('dotenv');require('express');require('jsonwebtoken');require('nodemailer');require('uuid');console.log('ALL DEPS OK')"
```

Expect `ALL DEPS OK`. If you get `ETIMEDOUT` or `ENOTFOUND`:

```bash
npm config set registry https://registry.npmjs.org
npm cache clean --force
npm install
```

### C3. Generate strong secrets

```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(48).toString('base64url'))"
node -e "console.log('AUTH_PEPPER=' + require('crypto').randomBytes(24).toString('base64url'))"
```

Copy both lines.

> ⚠️ **Changing `AUTH_PEPPER` invalidates existing password hashes** for accounts that were hashed
> with the old pepper. Two safe paths:
> - **Keep the existing pepper** (copy the value out of your current `backend/.env`) if you want
>   existing `users.json` logins to keep working, or
> - **Use a fresh pepper** and accept that existing demo accounts must re-register / have their
>   passwords reset.
>
> `JWT_SECRET` can be changed freely — it only invalidates currently-issued login tokens.

### C4. Write `backend/.env`

```bash
cd ~/hobags/backend
cp .env.example .env      # if you don't already have a .env
nano .env
```

Replace the whole file with this (substitute your generated values and your public URL):

```env
# ── Core ─────────────────────────────────────────────────────────
NODE_ENV=production
PORT=3002
JWT_SECRET=PASTE_YOUR_GENERATED_JWT_SECRET
AUTH_PEPPER=PASTE_YOUR_GENERATED_PEPPER

# ── Browser origins allowed to call the API ──────────────────────
# Same-origin requests DO send an Origin header on POST/PUT/DELETE,
# and server.js REJECTS any origin not on this list — so your public
# URL MUST be here, exactly as the browser sends it (scheme + host).
ALLOWED_ORIGINS=http://localhost:5173,https://localhost:5173,http://localhost:3000,http://localhost:3001,https://YOUR-DOMAIN-OR-TUNNEL-URL

# ── Google OAuth (optional, Part I) ──────────────────────────────
GOOGLE_REDIRECT_URIS=https://YOUR-DOMAIN-OR-TUNNEL-URL/auth/google/callback

# ── SMTP for verification emails (Part I) ────────────────────────
# Leave SMTP_HOST empty and the server runs in "dev mode": the 6-digit
# code is printed in the server log instead of being emailed.
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=HoBags <noreply@hobags.com>
```

Save with **Ctrl+O**, **Enter**, then exit with **Ctrl+X**.

Lock the file down:

```bash
chmod 600 ~/hobags/backend/.env
```

> There is **no trailing slash** and **no quotes** around the values — `dotenv` reads them literally.

### C5. First run (foreground)

```bash
cd ~/hobags/backend
node server.js
```

You should see:

```
HoBags API server running on http://localhost:3002
[auth] developer console: /developer/users (dev@hobags.com)
[auth] password hashes: scrypt
```

Open a **second Termux session** (swipe from the left edge → **NEW SESSION**) and test:

```bash
# 1) Public read endpoint — expect a JSON array
curl -s http://localhost:3002/api/products | head -c 200

# 2) Protected endpoint with no token — expect {"error":"..."} and HTTP 401
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3002/api/auth/me

# 3) Real login — expect a JSON token
curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@hobags.com","password":"admin"}' | head -c 200

# 4) Confirm data is being read from backend/data/
curl -s http://localhost:3002/api/products | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log('products:',JSON.parse(s).length))"
```

> Test 3 only works if `dev@hobags.com` exists in `users.json` **and** the password matches the
> pepper you set. If you changed `AUTH_PEPPER`, it will fail — see the note in C3.

Go back to the first session and press **Ctrl+C** to stop the manual run.

### C6. Common first-run failures

| Message | Meaning / fix |
|---------|---------------|
| `Cannot find module 'express'` | You ran `node server.js` outside `~/hobags/backend`, or skipped `npm install` |
| `EADDRINUSE :3002` | Another copy is running: `pkill -f server.js` |
| `[data] users.json is not valid JSON` | The file has a UTF-8 BOM or is truncated — restore it from your PC copy or a backup |
| `[data] could not read settings.json` | Missing file; the server starts with that collection empty — copy the file in from your PC |

---

## Part D — Build the frontend

The frontend must exist as **static files** in `~/hobags/dist`. Pick one of the two routes.

### D1. Recommended — build on your PC, copy `dist/`

On the **PC**:

```powershell
cd "D:\Rutaab Ali Access\Hobags\HoBags"
npm install
npm run build
```

That writes `dist/index.html` plus hashed assets in `dist/assets/`. Then copy just the built folder:

```powershell
scp -r -P 8022 "D:\Rutaab Ali Access\Hobags\HoBags\dist" u0_a184@192.168.1.42:~/hobags/
```

Or, if the phone's SSH isn't set up, zip `dist/` and move it to
`~/storage/shared/Download/`, then on the phone:

```bash
rm -rf ~/hobags/dist
unzip -o ~/storage/shared/Download/dist.zip -d ~/hobags
```

**Why this is recommended:** the build requires `vite`, `typescript`, `esbuild`, and the whole
`@react-three` stack. On a phone it takes a long time and needs ~1.5 GB of RAM. On a PC it takes
seconds.

> **Verify you have a production build, not a dev one.** Open `~/hobags/dist/index.html` and check
> that it contains a `<script src="/assets/index-*.js">` tag. If instead it references
> `/src/main.tsx`, you copied the wrong thing.

### D2. Alternative — build on the phone

Only do this if the phone has ≥ 4 GB RAM and plenty of time.

```bash
cd ~/hobags
# You need the whole project here: package.json, package-lock.json, index.html,
# vite.config.ts, tsconfig.json, tailwind.config.js, postcss.config.js and src/
npm ci --no-audit --no-fund      # or: npm install
npm run build
```

Watch memory with `free -m` in another session. If the build is killed with
`Killed` / `signal SIGKILL`, Android's low-memory killer stepped in — use route D1 instead.

Regardless of which route you took, confirm the result:

```bash
ls -la ~/hobags/dist
# expect: index.html  assets/
ls ~/hobags/dist/assets | head
```

> Every time you change frontend source later, you must re-run `npm run build` and re-copy `dist/`
> (Part K).

---

## Part E — Install and configure nginx

nginx does three jobs:

1. serves `~/hobags/dist` as static files,
2. falls back to `index.html` for client-side routes (React Router deep links),
3. reverse-proxies `/api/*` to the Express server on `127.0.0.1:3002`.

Because both are on the **same origin**, the browser never makes a cross-origin request, so the
CSP `connect-src 'self'` ([index.html](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/index.html#L7))
is satisfied as-is and CORS never triggers.

### E1. Find your nginx paths

```bash
nginx -V 2>&1 | tr ' ' '\n' | grep -E 'prefix|conf-path'
```

Typical Termux output:

```
--prefix=/data/data/com.termux/files/usr
--conf-path=/data/data/com.termux/files/usr/etc/nginx/nginx.conf
```

### E2. Create the runtime folders

Termux ships nginx but not all of its working directories:

```bash
mkdir -p $PREFIX/var/log/nginx
mkdir -p $PREFIX/var/lib/nginx/client_body \
         $PREFIX/var/lib/nginx/proxy \
         $PREFIX/var/lib/nginx/fastcgi \
         $PREFIX/var/lib/nginx/uwsgi \
         $PREFIX/var/lib/nginx/scgi
mkdir -p $PREFIX/var/run
```

### E3. Back up the default config, then replace it

```bash
cp $PREFIX/etc/nginx/nginx.conf $PREFIX/etc/nginx/nginx.conf.orig
nano $PREFIX/etc/nginx/nginx.conf
```

Delete everything and paste this **complete** config:

```nginx
# ── HoBags — nginx on Termux ─────────────────────────────────────
# Paths below are the standard Termux prefix. If `echo $PREFIX` printed
# something else, replace every /data/data/com.termux/files/usr accordingly.

worker_processes 1;
error_log  /data/data/com.termux/files/usr/var/log/nginx/error.log warn;
pid        /data/data/com.termux/files/usr/var/run/nginx.pid;

events {
    worker_connections 512;
}

http {
    include       /data/data/com.termux/files/usr/etc/nginx/mime.types;
    default_type  application/octet-stream;

    access_log /data/data/com.termux/files/usr/var/log/nginx/access.log;

    # nginx runs as an unprivileged Android app user, so all temp paths
    # must be inside the Termux prefix (they were created in step E2).
    client_body_temp_path /data/data/com.termux/files/usr/var/lib/nginx/client_body;
    proxy_temp_path       /data/data/com.termux/files/usr/var/lib/nginx/proxy;
    fastcgi_temp_path     /data/data/com.termux/files/usr/var/lib/nginx/fastcgi;
    uwsgi_temp_path       /data/data/com.termux/files/usr/var/lib/nginx/uwsgi;
    scgi_temp_path        /data/data/com.termux/files/usr/var/lib/nginx/scgi;

    sendfile        on;
    tcp_nopush      on;
    keepalive_timeout 65;
    server_tokens   off;

    # The backend accepts JSON bodies up to 50 MB (see server.js), so allow
    # nginx to pass them through. Raise this if you hit 413 errors.
    client_max_body_size 50m;

    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               application/x-javascript text/xml application/xml
               image/svg+xml;

    server {
        # 8080: Android will not let a non-root app bind port 80.
        listen 8080;
        server_name _;

        # ── The built React app ──────────────────────────────────
        root  /data/data/com.termux/files/home/hobags/dist;
        index index.html;

        # Hashed asset filenames never change → cache them for a year.
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            try_files $uri =404;
        }

        # ── API: forward to the Express backend ──────────────────
        location /api/ {
            # No trailing slash: /api/products stays /api/products.
            proxy_pass http://127.0.0.1:3002;
            proxy_http_version 1.1;
            proxy_set_header Host              $host;
            proxy_set_header X-Real-IP         $remote_addr;
            proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host  $host;
            proxy_connect_timeout 5s;
            proxy_send_timeout    60s;
            proxy_read_timeout    60s;
            proxy_buffering       off;
        }

        # ── SPA fallback: every other path returns index.html ────
        # Without this, refreshing https://…/product/123 would 404.
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Never serve dotfiles (e.g. a stray .env copied into dist/)
        location ~ /\. {
            deny all;
        }

        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options        "SAMEORIGIN" always;
        add_header Referrer-Policy        "strict-origin-when-cross-origin" always;
    }
}
```

Save (**Ctrl+O**, **Enter**, **Ctrl+X**).

### E4. Test and start nginx

```bash
nginx -c $PREFIX/etc/nginx/nginx.conf -t
```

Expect:

```
nginx: the configuration file /data/data/com.termux/files/usr/etc/nginx/nginx.conf syntax is ok
nginx: configuration file ... test is successful
```

Do **not** continue until this passes. Then start it:

```bash
nginx -c $PREFIX/etc/nginx/nginx.conf
```

### E5. Verify nginx end-to-end

Make sure the backend is running in another session (`cd ~/hobags/backend && node server.js`), then:

```bash
# nginx is listening on 8080
curl -s -o /dev/null -w "nginx  -> %{http_code}\n" http://127.0.0.1:8080/

# the app shell is served
curl -s http://127.0.0.1:8080/ | grep -o '<title>[^<]*</title>'

# the API proxy works through nginx
curl -s -o /dev/null -w "api    -> %{http_code}\n" http://127.0.0.1:8080/api/auth/me     # 401

# hashed assets resolve
curl -s -o /dev/null -w "assets -> %{http_code}\n" "http://127.0.0.1:8080$(grep -o '/assets/[^"]*\.js' ~/hobags/dist/index.html | head -1)"
```

Then open `http://127.0.0.1:8080/` in the phone's browser — the HoBags homepage should load and
product data should appear (proving the frontend → nginx → Express → JSON chain works).

### E6. nginx troubleshooting

| Symptom | Fix |
|---------|-----|
| `nginx: [emerg] bind() to 0.0.0.0:80 failed (13: Permission denied)` | You kept `listen 80`. Android cannot bind privileged ports — use 8080 |
| `nginx: [emerg] open() ".../var/log/nginx/error.log" failed (2: No such file or directory)` | Re-run the `mkdir -p` commands in E2 |
| `nginx: [emerg] open() ".../client_body" failed` | Same — the temp dirs from E2 are missing |
| `403 Forbidden` | `root` path is wrong. Check with `ls /data/data/com.termux/files/home/hobags/dist/index.html` |
| `502 Bad Gateway` on `/api/…` | The Express backend isn't running, or isn't on 3002 |
| `404` on `/api/…` | `proxy_pass` has a trailing slash, or you used the wrong port |
| Page loads but every route 404s on refresh | The `try_files … /index.html` SPA fallback is missing |
| Blank white page, no network activity | You copied a dev `index.html`. Rebuild (Part D) |
| `[warn] conflicting server name` | Harmless here |

---

## Part F — Run everything as background services

Right now nginx and node die when you close the session. **`termux-services`** (runit) keeps them
alive, restarts them on crash, and starts them at boot.

### F1. Initialise termux-services

```bash
pkg install -y termux-services
exit            # completely close the Termux app/session
```

Reopen Termux. Check that service machinery exists:

```bash
ls $PREFIX/var/service/
```

You should now see at least `crond`, `sshd`, and possibly `nginx`. If the folder is empty or
missing, run `termux-services-enable` or reinstall the package.

### F2. Create the backend service

```bash
mkdir -p $PREFIX/var/service/hobags
```

Write the run script (note the absolute paths — runit does not source your shell config, so `node`
and `~` are **not** on its PATH):

```bash
cat > $PREFIX/var/service/hobags/run <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
export NODE_ENV=production
cd /data/data/com.termux/files/home/hobags/backend
exec node /data/data/com.termux/files/home/hobags/backend/server.js 2>&1
EOF
chmod +x $PREFIX/var/service/hobags/run
```

> `dotenv` loads `backend/.env` from the working directory, which is why the `cd` matters.

### F3. Create the nginx service

First check whether the package already gave you one:

```bash
ls $PREFIX/var/service/nginx 2>/dev/null && echo "nginx service exists"
```

**If it does not exist**, create it:

```bash
mkdir -p $PREFIX/var/service/nginx
cat > $PREFIX/var/service/nginx/run <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
exec nginx -c /data/data/com.termux/files/usr/etc/nginx/nginx.conf -g 'daemon off;' 2>&1
EOF
chmod +x $PREFIX/var/service/nginx/run
```

**If it does exist**, verify it starts nginx with `daemon off;` (otherwise runit will think the
service died immediately):

```bash
cat $PREFIX/var/service/nginx/run
```

If that run script is not present or wrong, overwrite it with the block above.

> If nginx is already running from Part E, stop it first so the port is free for the service:
> `nginx -s stop`

### F4. Start and enable both

```bash
sv-enable hobags
sv-enable nginx
```

`sv-enable` both starts the service now **and** marks it to start automatically.

Check status:

```bash
sv status hobags
sv status nginx
```

Both should say `run: hobags: (pid 12345) 3s; run: log: (pid 12344) 3s` — the important word is
**`run`**. `down:` means it is not running.

### F5. Read the logs

```bash
sv log hobags      # Ctrl+C to exit the viewer (does NOT stop the service)
sv log nginx
```

You should see `HoBags API server running on http://localhost:3002` in the backend log.

### F6. Restart / stop / disable

```bash
sv restart hobags        # after editing backend code or .env
sv restart nginx         # after editing nginx.conf
sv down hobags           # stop, but keep it enabled
sv up hobags             # start again
sv-disable hobags        # stop AND remove from auto-start
```

> **Always reload nginx with `sv restart nginx`, never `nginx -s reload`,** once it is managed by
> runit — otherwise the service watchdog and the real process get out of sync.

### F7. Re-verify the whole chain

```bash
curl -s -o /dev/null -w "backend -> %{http_code}\n" http://127.0.0.1:3002/api/auth/me   # 401
curl -s -o /dev/null -w "nginx   -> %{http_code}\n" http://127.0.0.1:8080/api/auth/me   # 401
curl -s http://127.0.0.1:8080/api/products | head -c 120
```

---

## Part G — Keep the phone alive & auto-start after reboot

Android aggressively kills background apps. Without these steps your site will go offline within
minutes of the screen turning off.

### G1. Wake lock (prevents CPU sleep)

```bash
termux-wake-lock
```

This keeps a partial wake lock so the CPU does not suspend. Undo with `termux-wake-unlock`.

If you see `command not found`, install the add-ons and retry:

```bash
pkg install -y termux-api
# plus the "Termux:API" app from F-Droid
```

### G2. Disable battery optimisation for Termux (required)

On the phone: **Settings → Apps → Termux → Battery → Unrestricted** (wording varies by vendor:
"Samsung → Settings → Battery → Background usage limits → Never sleeping apps → add Termux";
"Xiaomi → Settings → Apps → Termux → Battery saver → No restrictions"; also enable
**Autostart** on Xiaomi/Oppo/Vivo/Huawei).

Failing to do this is the single most common reason a "working" Termux server dies overnight.

### G3. Auto-start at boot (Termux:Boot)

Install the **Termux:Boot** app from F-Droid, then **open it once** (it has no UI — launching it
registers the boot receiver).

```bash
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/start-hobags.sh <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
sv-enable sshd  2>/dev/null
sv-enable nginx 2>/dev/null
sv-enable hobags 2>/dev/null
EOF
chmod +x ~/.termux/boot/start-hobags.sh
```

> The `sv-enable` calls are belt-and-braces: because termux-services already starts enabled services
> at boot, they mostly make the intent explicit and fix the case where a service got `sv-disable`d.

If you also run a Cloudflare tunnel as a service (Part H), add `sv-enable tunnel` to that list.

### G4. Disable the "phantom process killer" (Android 12+, recommended)

Android 12+ kills processes that spawn too many children. Node's thread pool can trip this on some
devices. If your backend keeps restarting for no reason, connect the phone via USB with **USB
debugging** enabled and run this **once** from your PC:

```powershell
adb shell "/system/bin/device_config set_sync_disabled_for_tests persistent"
adb shell "/system/bin/device_config put activity_manager max_phantom_processes 2147483647"
adb shell settings put global settings_enable_monitor_phantom_procs false
```

Reboot the phone afterwards.

### G5. Test the full reboot cycle

```bash
sv status hobags nginx
# then reboot the phone
```

Wait ~1 minute, reopen Termux, and check again:

```bash
sv status hobags nginx
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/
```

Both services `run` and the curl returns `200` ⇒ the site survives reboots.

---

## Part H — Publish the site to the internet (HTTPS)

Everything above is reachable only from the phone itself. Pick **one** of the following.

| Option | Public URL | HTTPS | Stable? | Cost |
|--------|-----------|-------|---------|------|
| H1 — Cloudflare quick tunnel | `https://random-words.trycloudflare.com` | ✅ | ❌ new URL each restart | Free |
| H2 — Cloudflare named tunnel + own domain | `https://bags.yourdomain.com` | ✅ | ✅ | Domain (~$8–12/yr) |
| H3 — Tailscale Funnel | `https://your-phone.tailXXXX.ts.net` | ✅ | ✅ | Free |
| H4 — Port forward + DDNS | `http://your-ddns:8080` | ❌ (needs extra work) | ⚠️ depends on ISP | Free |
| H5 — LAN only | `http://192.168.1.42:8080` | ❌ | ✅ on that network | Free |

> **Important:** `localhost` inside Termux is **not** the phone's network interface. When you go
> public, the browser's `Origin` becomes your public URL, and the backend rejects unknown origins.
> So after choosing an option you **must** add that exact URL to `ALLOWED_ORIGINS` in
> `backend/.env` and run `sv restart hobags`.

### H1. Cloudflare quick tunnel (fastest — do this first)

```bash
cloudflared tunnel --url http://127.0.0.1:8080
```

It prints something like:

```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://shiny-leaves-run-fast.trycloudflare.com                                           |
+--------------------------------------------------------------------------------------------+
```

That URL is your live site. Test it from the phone or a PC:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://shiny-leaves-run-fast.trycloudflare.com/api/auth/me
# expect 401 — the API is reachable through the tunnel
```

**Then immediately:**

```bash
nano ~/hobags/backend/.env
# ALLOWED_ORIGINS=...,https://shiny-leaves-run-fast.trycloudflare.com
```

```bash
sv restart hobags
```

**Run it as a service so it survives session close:**

```bash
mkdir -p $PREFIX/var/service/tunnel
cat > $PREFIX/var/service/tunnel/run <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
exec cloudflared tunnel --url http://127.0.0.1:8080 --no-autoupdate 2>&1
EOF
chmod +x $PREFIX/var/service/tunnel/run
sv-enable tunnel
sleep 20
sv log tunnel | grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' | tail -1
```

**Downside:** every restart of `cloudflared` yields a **new hostname**, which means editing
`ALLOWED_ORIGINS` again. Fine for a demo; use H2 or H3 for anything real.

### H2. Cloudflare named tunnel + your own domain (stable, recommended)

Requirements: a domain whose DNS is managed by Cloudflare (free plan is enough).

**On the phone:**

```bash
cloudflared tunnel login
```

It prints a URL — open it in the phone's browser, log in to Cloudflare, and authorise the domain.
This writes a certificate to `~/.cloudflared/cert.pem`.

```bash
cloudflared tunnel create hobags
# → Created tunnel hobags with id 8f2c...-....json
cloudflared tunnel route dns hobags bags.yourdomain.com
```

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: hobags
credentials-file: /data/data/com.termux/files/home/.cloudflared/8f2c....json

ingress:
  - hostname: bags.yourdomain.com
    service: http://127.0.0.1:8080
  - service: http_status:404
```

> Replace the credentials filename with the real one: `ls ~/.cloudflared/`.

Run it as a service:

```bash
mkdir -p $PREFIX/var/service/tunnel
cat > $PREFIX/var/service/tunnel/run <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
exec cloudflared --no-autoupdate tunnel run hobags 2>&1
EOF
chmod +x $PREFIX/var/service/tunnel/run
sv-enable tunnel
```

Update `.env` and restart the backend:

```env
ALLOWED_ORIGINS=https://bags.yourdomain.com,http://localhost:5173,https://localhost:5173
GOOGLE_REDIRECT_URIS=https://bags.yourdomain.com/auth/google/callback
```

```bash
sv restart hobags
curl -s -o /dev/null -w "%{http_code}\n" https://bags.yourdomain.com/api/auth/me    # 401
```

The URL never changes, so you only configure `ALLOWED_ORIGINS` once. This is the setup to use for
a real public site.

### H3. Tailscale Funnel (free stable HTTPS, no domain needed)

```bash
pkg install -y tailscale
tailscaled --tun=userspace-networking --socks5-server=localhost:1055 &
tailscale up --hostname=hobags-phone
```

Then expose port 8080 publicly:

```bash
tailscale funnel --bg 8080
tailscale funnel status      # prints https://hobags-phone.tailXXXX.ts.net
```

Add that URL to `ALLOWED_ORIGINS`, then `sv restart hobags`.

> Tailscale Funnel is free but intended for personal/low-volume use. The hostname is stable, which
> is the main advantage over H1.

### H4. Port forwarding + DDNS (only if your ISP gives you a real public IP)

1. Give the phone a **static LAN IP** in your router's DHCP settings.
2. Forward external port `8080` → `192.168.1.42:8080`.
3. Point a DDNS hostname (e.g. DuckDNS, No-IP, or a free `eu.org` subdomain) at your public IP.
4. Add `http://your-name.duckdns.org:8080` to `ALLOWED_ORIGINS`, `sv restart hobags`.

**Caveats:** most mobile carriers use CGNAT (no inbound connectivity at all), your public IP changes,
and you're serving **plain HTTP** — many browsers will block mixed content and you cannot use Google
OAuth. There is no reasonable way to get a Let's Encrypt certificate on a non-standard port from a
phone, so treat this as a last resort and prefer H1/H2/H3.

### H5. LAN only

Nothing to configure beyond what you have. From any device on the same Wi-Fi:

```
http://192.168.1.42:8080
```

Find the IP with `ifconfig wlan0 | grep "inet "`. Good for testing on a tablet/TV before going public.

---

## Part I — Production email + Google login

### I1. Why this matters

With `NODE_ENV=production` and **no SMTP configured**, the signup verification code is only written
to the server log ([server.js](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/backend/server.js#L885-L890)):

```
[DEV] Verification code for someone@gmail.com: 418302
```

Real visitors cannot read the log, so **email signup is effectively broken for the public**. Either
watch `sv log hobags` and relay codes manually, or configure SMTP — recommended.

### I2. Configure SMTP with a Gmail App Password

1. Enable 2-Step Verification on the Google account.
2. Go to `https://myaccount.google.com/apppasswords` and create an app password (16 characters).
3. Edit `~/hobags/backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your.address@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=HoBags Marketplace <your.address@gmail.com>
```

4. `sv restart hobags` and confirm the log no longer says `[DEV] Verification code`.

> The password must be the **app password**, not your Google account password. Note the space in
> the value is fine — keep it exactly as Google shows it.

> Note the signup allow-list: only **gmail.com, yahoo.com, hotmail.com, outlook.com** addresses may
> register ([server.js](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/backend/server.js#L45)). Any other
> domain is rejected with a 400.

### I3. Google OAuth (only if you keep the Google button)

In **Google Cloud Console → APIs & Services → Credentials → your OAuth 2.0 Client ID →
Authorised redirect URIs**, add:

```
https://bags.yourdomain.com/auth/google/callback
```

(Use whatever URL your chosen Part H option produced.) Keep the existing `localhost` entries so PC
development still works.

Then in `~/hobags/backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URIS=https://bags.yourdomain.com/auth/google/callback,http://localhost:5173/auth/google/callback
```

```bash
sv restart hobags
```

See `GOOGLE_OAUTH_GUIDE.md` for the console walkthrough.

### I4. Optional — change the developer account password

`dev@hobags.com` is seeded with password `admin` when it does not already exist in `users.json`.
Set a real one **before** the first run:

```env
DEVELOPER_PASSWORD=some-strong-password
```

If the account already exists, the seed is skipped — change the password through the app instead.

---

## Part J — Backing up the JSON database

`backend/data/*.json` **is** your database. There is no server to dump, so a backup is just a copy.
Do it on a schedule — a phone can be lost, wiped, or have its Termux data cleared by the OS.

### J1. Manual backup

```bash
cd ~
tar czf hobags-data-$(date +%Y%m%d-%H%M).tar.gz \
    hobags/backend/data hobags/backend/.env hobags/backend/server.js
ls -lh hobags-data-*.tar.gz
```

Copy it off the phone:

```bash
cp hobags-data-*.tar.gz ~/storage/shared/Download/
```

### J2. Automatic daily backup (cron)

```bash
mkdir -p ~/backups
cat > ~/backup-hobags.sh <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
mkdir -p /data/data/com.termux/files/home/backups
cd /data/data/com.termux/files/home
tar czf backups/hobags-data-$(date +%F).tar.gz hobags/backend/data hobags/backend/.env
# keep only the last 14
ls -1t backups/hobags-data-*.tar.gz | tail -n +15 | xargs -r rm --
EOF
chmod +x ~/backup-hobags.sh
sv-enable crond
crontab -e
```

Add:

```
30 3 * * * /data/data/com.termux/files/home/backup-hobags.sh
```

> Remember: `~/storage/shared` is **not** a safe backup target if you also want off-device copies —
> sync it to Google Drive, or `scp` it to your PC.

### J3. Restoring / migrating to a new phone

```bash
# new phone, after Part A and B:
cd ~
tar xzf hobags-data-20261025-0330.tar.gz     # restores backend/data and .env
cd ~/hobags/backend && npm install
# then re-create the services (Part F) and the boot script (Part G)
```

Users, orders, messages, and reviews all come back exactly as they were.

### J4. Inspect the data without opening a JSON editor

```bash
# how many users / orders / products?
for f in users orders products messages reviews; do
  printf "%-10s %s\n" "$f" "$(node -e "console.log(JSON.parse(require('fs').readFileSync('$HOME/hobags/backend/data/$f.json','utf8')).length)" 2>/dev/null || echo 'n/a')"
done
```

> **Concurrency note:** every write is a synchronous whole-file rewrite (see
> `readJSONStrict` / `writeJSON` in [server.js](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/backend/server.js#L206-L240)).
> This is safe for one process and low traffic, but it is not transactional — never run two copies
> of `server.js` against the same `data/` folder.

---

## Part K — How to update the site later

### K1. Change backend code or `.env`

```bash
cd ~/hobags/backend
# edit server.js or .env with nano
sv restart hobags
sv log hobags
```

### K2. Change frontend code

On the **PC**:

```powershell
cd "D:\Rutaab Ali Access\Hobags\HoBags"
npm run build
scp -r -P 8022 dist u0_a184@192.168.1.42:~/hobags/
```

On the **phone**, nothing needs restarting (nginx reads from disk), but a hard refresh in the
browser is needed to pick up the new hashed asset names:

```bash
# optional sanity check that the new bundle landed
ls -la ~/hobags/dist/assets
```

### K3. Change `backend/data/*.json` by hand

Just edit the file. Read endpoints pick it up immediately. If you edit while the server is writing,
keep edits atomic — write to a temp file and move it into place:

```bash
node -e "
const fs=require('fs'),p=process.env.HOME+'/hobags/backend/data/settings.json';
const j=JSON.parse(fs.readFileSync(p,'utf8')); j.maintenance=false;
fs.writeFileSync(p+'.tmp',JSON.stringify(j,null,2)); fs.renameSync(p+'.tmp',p);
console.log('ok');
"
```

### K4. Change `nginx.conf`

```bash
nano $PREFIX/etc/nginx/nginx.conf
nginx -c $PREFIX/etc/nginx/nginx.conf -t
sv restart nginx
```

---

## Part L — Full verification checklist

Run these in order. Every line should produce the stated result.

```bash
# ── 1. Processes are alive ──────────────────────────────────────
sv status hobags        # run: hobags: (pid …)
sv status nginx         # run: nginx: (pid …)

# ── 2. Backend responds directly ────────────────────────────────
curl -s -o /dev/null -w "backend   %{http_code}\n" http://127.0.0.1:3002/api/auth/me     # 401

# ── 3. nginx serves the app ─────────────────────────────────────
curl -s -o /dev/null -w "frontend  %{http_code}\n" http://127.0.0.1:8080/                # 200
curl -s http://127.0.0.1:8080/ | grep -c 'assets/index-'                                # ≥1

# ── 4. nginx proxies the API ────────────────────────────────────
curl -s -o /dev/null -w "proxy     %{http_code}\n" http://127.0.0.1:8080/api/auth/me     # 401
curl -s http://127.0.0.1:8080/api/products | head -c 80                                  # JSON

# ── 5. SPA fallback works (deep link is NOT a 404) ──────────────
curl -s -o /dev/null -w "spa       %{http_code}\n" http://127.0.0.1:8080/product/123      # 200

# ── 6. Database is being read ───────────────────────────────────
ls ~/hobags/backend/data/*.json | wc -l                                                  # 20

# ── 7. Public URL (replace with yours) ──────────────────────────
curl -s -o /dev/null -w "public    %{http_code}\n" https://bags.yourdomain.com/api/auth/me  # 401

# ── 8. Full login round-trip through the public URL ─────────────
curl -s -X POST https://bags.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@hobags.com","password":"admin"}' | head -c 160                       # token JSON
```

Then in a **desktop browser** on the public URL:

1. Homepage renders with styling (fonts, images).
2. Product listing shows data (proves the JSON database is being served).
3. Register/login works.
4. Open a deep link such as `/product/123` and press **F5** — it must not 404.
5. Open DevTools → **Network**. Every request should go to your own domain. There must be **no**
   `localhost:3002` requests (that would mean a dev build) and **no red CORS or CSP errors**.

Finally, watch the phone log while you click around:

```bash
sv log hobags
```

Requests should stream in — that proves the whole chain terminates on your phone.

---

## Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| `pkg: command not found` / packages won't install | Termux came from the Play Store. Uninstall and reinstall from **F-Droid** |
| `The repository ... is not signed` | Run `pkg update` and accept the new keys, or change your mirror: `termux-change-repo` |
| `nginx: [emerg] bind() to 0.0.0.0:80 failed (13: Permission denied)` | Android blocks ports < 1024. Use `listen 8080;` |
| Website loads, but every API call fails | `ALLOWED_ORIGINS` in `.env` doesn't contain the exact public origin. Add it, `sv restart hobags`. Remember the browser sends `Origin` on POST/PUT/DELETE **even for same-origin** requests, and [server.js](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/backend/server.js#L193-L202) rejects anything not on the list |
| Red **CORS** error in DevTools | Same as above. A same-origin setup via nginx should never produce this unless `ALLOWED_ORIGINS` is missing your URL |
| Red **CSP** error: `Refused to connect to 'http://localhost:3002'` | You're serving a dev build. Re-run `npm run build` and copy `dist/` |
| Blank page, console shows a JS 404 for `/assets/index-…js` | `root` in nginx.conf points at the wrong folder, or `dist/` was copied incompletely |
| Homepage fine, `/product/123` 404s on refresh | Missing `try_files $uri $uri/ /index.html;` |
| `502 Bad Gateway` on `/api/...` | Backend down: `sv status hobags` → `sv log hobags` |
| `404` on `/api/...` but backend log shows no request | `proxy_pass` has a trailing slash, or wrong port |
| `413 Request Entity Too Large` | Raise `client_max_body_size` in nginx.conf, `sv restart nginx` |
| `EADDRINUSE: 3002` | Two backends: `pkill -f server.js`, then `sv restart hobags` |
| `Cannot find module 'express'` | `npm install` wasn't run in `~/hobags/backend` |
| `npm install` → `ETIMEDOUT` / `ENOTFOUND` | `npm config set registry https://registry.npmjs.org` then retry |
| `npm install` → `ENOTSUP: operation not supported on socket` (symlinks) | You're inside `/sdcard`. Move the project to `~/` |
| Backend exits immediately under runit | The run script is missing absolute paths, or lacks the `cd` to `backend/`. Check `sv log hobags` |
| nginx exits immediately under runit | The run script must include `-g 'daemon off;'` |
| Everything dies ~15 minutes after the screen locks | Wake lock + battery restriction + phantom-process killer not applied (Part G) |
| Site dead after a reboot | `Termux:Boot` not installed/opened, or services not `sv-enable`d |
| Tunnel URL changed and the site now 502s/errors | Expected for quick tunnels — update `ALLOWED_ORIGINS` (and Google redirect URI) and `sv restart hobags`. Use a named tunnel or Tailscale for stability |
| `Mixed content` warnings | An `https://` page calling an `http://` API. With H1/H2/H3 everything is same-origin HTTPS, so this only happens if you hardcoded an `http://` URL |
| Login worked, then everyone got logged out | You changed `JWT_SECRET`. Tokens are signed with it — this is expected |
| **No one** can log in after deploying | `AUTH_PEPPER` differs from the one the existing hashes were created with. Restore the original pepper from your previous `.env`, or reset the affected accounts |
| Signup says "code sent" but no email arrives | SMTP not configured → code is only in `sv log hobags` (Part I) |
| Signup rejected with "Only Gmail, Yahoo…" | By design — see `ALLOWED_EMAIL_DOMAINS` in [server.js](file:///d:/Rutaab%20Ali%20Access/Hobags/HoBags/backend/server.js#L45) |
| `users.json is not valid JSON` | The file has a BOM or was half-written. Restore from `~/backups/` (Part J) |
| Phone gets very hot / battery drains fast | Expected for 24/7 hosting. Keep it on a charger and remove the case; consider lowering `worker_connections` |
| Site is slow on first load | The bundle includes `three.js`. Confirm gzip is on: `curl -sI -H "Accept-Encoding: gzip" http://127.0.0.1:8080/ | grep -i content-encoding` |

---

## Security hardening checklist

- [ ] `JWT_SECRET` and `AUTH_PEPPER` replaced with long random values (Part C3).
- [ ] `backend/.env` is `chmod 600` and **not** committed to git.
- [ ] `dev@hobags.com` password changed away from `admin` (`DEVELOPER_PASSWORD`).
- [ ] Backend listens only on loopback — never change `app.listen` to `0.0.0.0`, and never expose
      port 3002 through a tunnel. Only port 8080 (nginx) should be public.
- [ ] `ALLOWED_ORIGINS` is an explicit list, not a wildcard.
- [ ] Public access is over **HTTPS** (Cloudflare Tunnel or Tailscale Funnel), never raw
      `http://PUBLIC-IP:8080`.
- [ ] nginx blocks dotfiles (in the config above) so a stray `.env` in `dist/` is unreachable.
- [ ] Automated backups of `backend/data/` running, with copies off the phone (Part J).
- [ ] Understand the trade-offs you're accepting:
      passwords use `scrypt` + a fixed pepper rather than `bcrypt`/`argon2`;
      JSON files are single-process and not transactional;
      a phone is not a datacentre (no UPS, no redundant network, OS may kill the app).
- [ ] Keep the phone on a charger with cooling; a phone in a drawer at 40 °C will throttle.
- [ ] `chmod 600 ~/.cloudflared/*.json` — the tunnel credentials can be used to serve your domain.

---

## Appendix 1 — Alternative: one process, no nginx

If you'd rather not run nginx, let Express serve the built frontend too. This is **one process on
one port**, and it removes every nginx-specific failure mode.

Add this to `backend/server.js`, **immediately after** the existing
`app.use('/api', …)` unknown-route handler (around line 1877) and **before** the error handler:

```js
// ── Serve the built frontend ─────────────────────────────────────
const DIST_DIR = path.join(__dirname, '..', 'dist');
app.use(express.static(DIST_DIR, { index: false }));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});
```

Then:

```bash
sv restart hobags
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3002/          # 200
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3002/api/auth/me   # 401
```

And point the tunnel directly at **3002**:

```bash
cloudflared tunnel --url http://127.0.0.1:3002
```

Trade-offs versus nginx:

| | nginx (Parts E–F) | Express-only (this appendix) |
|---|---|---|
| Processes | 2 | 1 |
| Static file speed | Better | Fine for personal use |
| gzip | Built in | Not compressed (add `compression` if needed) |
| Config surface | Larger | Tiny |
| Code changes | None | ~5 lines in `server.js` |

Both are legitimate. nginx is what the repo's VPS guides use, so the two stay consistent.

---

## Appendix 2 — Alternative: LAN-only access

If the phone will only ever be reached from your own Wi-Fi (a home dashboard, an internal demo),
skip Part H entirely:

1. Do Parts A–G.
2. Options: keep nginx on `127.0.0.1:8080` and reach it via `adb forward` or an SSH tunnel, **or**
   make nginx listen on the LAN by changing one line:

```nginx
listen 8080;
```
to
```nginx
listen 0.0.0.0:8080;
```

3. Find the phone's address and use it from any device on the network:

```bash
ifconfig wlan0 | grep "inet "
```

```
http://192.168.1.42:8080
```

4. Optionally add that origin to `ALLOWED_ORIGINS` so POST requests pass:

```env
ALLOWED_ORIGINS=http://192.168.1.42:8080,http://localhost:5173,https://localhost:5173
```

```bash
sv restart hobags
```

No HTTPS, no tunnel, nothing exposed to the internet.

---

## Appendix 3 — Quick reference: every command

```bash
# ════════════════════════════════════════════════════════════════
# ONE-TIME SETUP
# ════════════════════════════════════════════════════════════════

# 1. Termux packages
pkg update -y && pkg upgrade -y
pkg install -y nodejs-lts git openssh curl nano unzip nginx termux-services cloudflared
echo $PREFIX          # /data/data/com.termux/files/usr

# 2. Project lands at ~/hobags  (backend/ + dist/)
mkdir -p ~/hobags && cd ~/hobags
#   git clone <repo> .
#   or scp -r -P 8022 backend dist u0_aXXX@PHONE_IP:~/hobags/

# 3. Backend
cd ~/hobags/backend
npm install
nano .env             # NODE_ENV, JWT_SECRET, AUTH_PEPPER, ALLOWED_ORIGINS, SMTP_*
chmod 600 .env
node server.js        # smoke test, then Ctrl+C

# 4. nginx runtime dirs + config
mkdir -p $PREFIX/var/log/nginx $PREFIX/var/run
mkdir -p $PREFIX/var/lib/nginx/{client_body,proxy,fastcgi,uwsgi,scgi}
cp $PREFIX/etc/nginx/nginx.conf $PREFIX/etc/nginx/nginx.conf.orig
nano $PREFIX/etc/nginx/nginx.conf      # paste the Part E3 config
nginx -c $PREFIX/etc/nginx/nginx.conf -t

# 5. Services (runit)
mkdir -p $PREFIX/var/service/hobags
cat > $PREFIX/var/service/hobags/run <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
export NODE_ENV=production
cd /data/data/com.termux/files/home/hobags/backend
exec node /data/data/com.termux/files/home/hobags/backend/server.js 2>&1
EOF
chmod +x $PREFIX/var/service/hobags/run

mkdir -p $PREFIX/var/service/nginx
cat > $PREFIX/var/service/nginx/run <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
exec nginx -c /data/data/com.termux/files/usr/etc/nginx/nginx.conf -g 'daemon off;' 2>&1
EOF
chmod +x $PREFIX/var/service/nginx/run

sv-enable hobags
sv-enable nginx

# 6. Keep alive + boot
termux-wake-lock
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/start-hobags.sh <<'EOF'
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
sv-enable sshd 2>/dev/null
sv-enable nginx 2>/dev/null
sv-enable hobags 2>/dev/null
EOF
chmod +x ~/.termux/boot/start-hobags.sh
# Also: Settings → Apps → Termux → Battery → Unrestricted  (do not skip)

# 7. Public HTTPS (pick one)
#  a) quick tunnel:
cloudflared tunnel --url http://127.0.0.1:8080
#  b) named tunnel + domain:  cloudflared tunnel login / create / route dns
#  c) tailscale:              tailscale funnel --bg 8080

# ════════════════════════════════════════════════════════════════
# DAY-TO-DAY
# ════════════════════════════════════════════════════════════════
sv status hobags nginx      # are they up?
sv restart hobags           # after backend/.env changes
sv restart nginx            # after nginx.conf changes
sv log hobags               # live backend log  (Ctrl+C to exit)
sv log nginx                # live nginx log
sv log tunnel               # find the current tunnel URL

curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/            # 200
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/api/auth/me # 401

# Backups
tar czf ~/backups/hobags-data-$(date +%F).tar.gz ~/hobags/backend/data ~/hobags/backend/.env

# Frontend update (run on the PC, then copy)
#   npm run build
#   scp -r -P 8022 dist u0_aXXX@PHONE_IP:~/hobags/
```

---

## Where to go next

| Goal | Document |
|------|----------|
| Hybrid setup (backend on phone, frontend on Vercel) | `DEPLOY_TERMUX.md` |
| Full stack on a Linux VPS instead of a phone | `deployment-guides/00-Overview-and-Architecture.md` |
| Google sign-in setup | `GOOGLE_OAUTH_GUIDE.md` |
| Hostinger-specific instructions | `HOSTINGER_DEPLOY.md` |
| Vercel frontend redeploys | `REDEPLOY_VERCEL.md` |

---

*Everything in this guide runs on the phone. No third party hosts your frontend, your backend, or
your data — Cloudflare/Tailscale only carries the encrypted traffic to it.*
