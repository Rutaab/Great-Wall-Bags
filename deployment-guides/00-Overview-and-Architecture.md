# HoBags — Deployment Guide 00: Overview & Architecture

This is the first file in a series of step-by-step guides that walk you through deploying the **HoBags e-commerce website** (frontend + backend) onto a **Hostinger VPS**.

> **IMPORTANT**: This guide series is based on the **actual code** in your project. Earlier deployment documents in the repo referenced a "Rust backend" — that is NOT what this project uses. The real backend is **Node.js + Express** with **JSON file storage**. Follow THIS series, not the old ones.

---

## 1. What This Project Is

| Layer | Technology | Location | Port (dev) |
|-------|-----------|----------|-----------|
| **Frontend** | React 18 + Vite 4 + TypeScript + Tailwind CSS | `src/` | 5173 |
| **Backend** | Node.js + Express 4 (CommonJS) | `backend/` | 3002 |
| **Database** | JSON files (no SQL database) | `backend/data/*.json` | — |

### Backend details (`backend/server.js`)
- Express server that listens on port **3002**
- Stores all data as JSON files in `backend/data/`:
  - `users.json` — user accounts & passwords (hashed with SHA-256 + pepper)
  - `products.json` — product catalog
  - `orders.json` — customer orders
  - `reviews.json` — product reviews
  - `settings.json` — site settings
  - `reset_tokens.json` — password reset tokens
- Uses `jsonwebtoken` for auth (JWT), `cors`, and `uuid`
- Routes are all under `/api/*` (e.g. `/api/products`, `/api/auth/login`)
- CORS is currently restricted to `localhost` origins only (see guide 03 to fix)

### Frontend details
- Built with Vite — `npm run build` produces static files in `dist/`
- The API base URL is set in `src/services/api.ts`:
  ```ts
  const API_BASE = 'http://localhost:3002/api'
  ```
  This **must be changed** to `/api` for production so requests route through nginx (guide 04).
- `index.html` contains a Content-Security-Policy that references `localhost` — see guide 04 for the production version.

---

## 2. Production Architecture (What We Are Building)

We deploy to a single Hostinger VPS. This is the layout we create:

```
Internet / Browser
        │
        ▼
   ┌─────────┐
   │  NGINX  │  port 80 / 443  (reverse proxy + static file server)
   └────┬────┘
        │
        ├───────────────  serves frontend static files from  ~/hobags/frontend/dist
        │
        └───────────────  proxies /api/*  →  127.0.0.1:3002  (Node backend)
                                      │
                                      ▼
                            ┌──────────────────┐
                            │  Node.js backend │  port 3002 (internal only)
                            │   (PM2 process)  │
                            │  backend/data/*  │  JSON files
                            └──────────────────┘
```

### Why nginx in front of Node?
- **One public port** (443) for everything — no need to expose port 3002.
- Serves the **static frontend** files (the `dist/` build) far more efficiently than Node.
- Handles **HTTPS/SSL** termination, gzip compression, security headers, and caching.
- **SPA routing** (react-router): every non-API path falls back to `index.html`.

---

## 3. The Guide Series (Read in Order)

| # | Guide | What it covers |
|---|-------|----------------|
| 00 | **Overview & Architecture** (this file) | Understand the project & production layout |
| 01 | **VPS Initial Setup** | Configure Hostinger VPS, install Node.js, git, nginx, tools |
| 02 | **Upload the Code** | Get frontend + backend code onto the VPS (SCP or Git) |
| 03 | **Deploy the Backend** | Install deps, run with PM2, harden CORS/JWT |
| 04 | **Build & Deploy the Frontend** | Change API URL, run production build, serve static files |
| 05 | **Configure Nginx** | Reverse proxy + SPA fallback + security headers |
| 06 | **SSL Certificate (HTTPS)** | Get free Let's Encrypt certificate with Certbot |
| 07 | **Firewall & Security** | UFW rules, protect the backend port, backups |
| 08 | **Verify & Troubleshoot** | Test everything, common problems & fixes |

---

## 4. Prerequisites (Before You Start)

You will need:

- **A Hostinger VPS** running **Ubuntu 22.04 or 24.04** (the "KVM VPS" plan is fine).
- **A domain name** already connected to Hostinger / pointed at your VPS IP address
  (examples in this guide use `yourdomain.com` — replace with your real domain).
- **SSH access** to the VPS (you'll get the root password / SSH key from Hostinger).
- A way to transfer files from your Windows PC (`scp`, WinSCP, or Git). Covered in guide 02.
- **Node.js 18 or 20** — we install this on the VPS in guide 01.

> You do NOT need to install anything from this project locally to follow these guides —
> all build steps run on the VPS.

---

## 5. Quick Reference: Key Paths on the VPS

We will standardize on these paths:

| Purpose | Path on VPS |
|---------|-------------|
| Project root | `~/hobags/` |
| Frontend source + build output | `~/hobags/frontend/` |
| Frontend static files (served by nginx) | `~/hobags/frontend/dist/` |
| Backend source + data | `~/hobags/backend/` |
| JSON database files | `~/hobags/backend/data/` |
| Nginx site config | `/etc/nginx/sites-available/hobags` (symlinked into `sites-enabled/`) |

---

## 6. Environment Variables / Config That Matter

This project **hardcodes** a few things that matter for deployment:

| Item | Where | Production value |
|------|-------|------------------|
| `API_BASE` | `frontend/src/services/api.ts` | `'/api'` (relative, goes through nginx) |
| Backend port | `backend/server.js` | `3002` (keep internal, block from public) |
| JWT secret + pepper | `backend/server.js` | Optional: override with env vars (guide 03) |
| CORS allowed origins | `backend/server.js` | Add your production domain |

We'll address each of these in the relevant guides.

---

Proceed to **[01 - VPS Initial Setup](01-VPS-Initial-Setup.md)**.
