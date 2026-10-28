# HoBags — Hostinger VPS Deployment Guide (Updated)

Covers the new security features: rate limiting, CORS, CSRF, body limits, and full auth flow (OTP, password reset, role-based onboarding).

## Prerequisites

- Hostinger VPS (Ubuntu 22.04 / 24.04)
- Domain pointed to VPS IP (e.g. `yourdomain.com`, `www.yourdomain.com`)
- SSH access to the VPS
- Node.js 18+, Rust 1.70+ on VPS

---

## 1. VPS Initial Setup

```bash
ssh root@YOUR_VPS_IP

apt update && apt upgrade -y
apt install -y curl git build-essential pkg-config libssl-dev nginx redis-server

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
```

---

## 2. Production `.env` (New Security Fields)

On the VPS, edit `~/hobags/backend/.env`:

```env
DATABASE_URL=sqlite:./hobags.db?mode=rwc
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=<openssl rand -base64 64>
HOST=0.0.0.0
PORT=3001
CORS_ORIGIN=https://yourdomain.com
BODY_LIMIT=2097152
RATE_LIMIT_MAX=30
RATE_LIMIT_WINDOW=60
```

| Field | Purpose |
|-------|---------|
| `CORS_ORIGIN` | Restricts API access to your frontend domain only |
| `BODY_LIMIT` | Max request body in bytes (2MB). Blocks large payload attacks |
| `RATE_LIMIT_MAX` | Max API requests per window (30/min default) |
| `RATE_LIMIT_WINDOW` | Rate limit window in seconds (60s default) |
| Auth routes | Hardcoded at 10 req/min internally — no config needed |

Generate JWT secret:
```bash
openssl rand -base64 64
```

---

## 3. Frontend API URL for Production

In `~/hobags/frontend/src/services/api.ts`, change:

```ts
const API_BASE = 'http://localhost:3001/api'   // before
```
to:
```ts
const API_BASE = '/api'                         // after
```

This routes API calls through the nginx reverse proxy.

---

## 4. Nginx Config (Production Static Files)

The `backend/nodeploy_nginx.conf` now serves the built frontend from `dist/` as static files — no Vite dev server needed.

Customize it for your domain:

```bash
nano ~/hobags/nodeploy_nginx.conf
```

Replace `yourdomain.com` with your actual domain everywhere.

**Key differences from the old dev config:**
- `root /root/hobags/frontend/dist` serves built static files directly
- No `upstream hobags_frontend` or proxy to port 5173
- SPA fallback via `try_files $uri $uri/ /index.html`
- Security headers: HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy

Install:

```bash
sudo cp ~/hobags/nodeploy_nginx.conf /etc/nginx/sites-available/hobags
sudo ln -sf /etc/nginx/sites-available/hobags /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. Systemd Service

`/etc/systemd/system/hobags-backend.service`:

```ini
[Unit]
Description=HoBags Rust Backend
After=network.target redis.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/hobags/backend
ExecStart=/root/hobags/backend/target/release/hobags-backend
Restart=always
RestartSec=5
Environment=RUST_LOG=info

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable hobags-backend
sudo systemctl start hobags-backend
sudo journalctl -u hobags-backend -f
```

---

## 6. SSL (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
certbot renew --dry-run
```

Certbot auto-updates your nginx config with SSL paths.

---

## 7. Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 3001/tcp
ufw enable
```

---

## 8. Verify Everything

```bash
# Backend responds
curl http://localhost:3001/api/products

# Frontend accessible
curl -I https://yourdomain.com

# Rate limiting works (rapid requests to auth endpoint)
for i in $(seq 1 15); do curl -s -o /dev/null -w "%{http_code}\n" https://yourdomain.com/api/auth/login -X POST -d '{}' -H "Content-Type: application/json"; done
# Expect: first 10 → 422 (validation), then 429 (rate limited)
```

---

## 9. Security Summary (Built-in, No Extra Config)

| Protection | Implementation |
|------------|---------------|
| Rate limiting | In-memory IP-based: 10/min auth, 30/min API |
| CORS | Restricted to `CORS_ORIGIN` env var |
| Body size limit | 2MB via `tower-http` limit layer |
| Security headers | nginx: HSTS, nosniff, X-Frame-Options, etc. |
| JWT auth | Tokens with expiry, validated on every request |
| Password hashing | bcrypt via argon2 |
| Input validation | Server-side validation on all auth inputs |
| SQL injection | Parameterized queries via sqlx |

---

## 10. Updating

```bash
cd ~/hobags
git pull origin main

# Backend
cd ~/hobags/backend
cargo build --release
sudo systemctl restart hobags-backend

# Frontend
cd ~/hobags/frontend
npm install        # if deps changed
npm run build

# Nginx
sudo nginx -t && sudo systemctl reload nginx
```
