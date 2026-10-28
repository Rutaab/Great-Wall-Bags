# HoBags — Deployment Guide 08: Verify & Troubleshoot

This final guide confirms the whole stack works end-to-end, then covers common problems and
how to update the site later.

---

## 1. Final Verification Checklist

Run each check in order. All should pass.

### A. Backend process is running

```bash
pm2 status
```

`hobags-backend` should show **online**.

### B. Backend responds locally

```bash
curl -s http://localhost:3002/api/products
curl -s http://localhost:3002/api/categories
```

Both return JSON (for products, possibly `[]` if empty).

### C. Nginx config valid

```bash
sudo nginx -t
```

`test is successful`.

### D. Frontend served over HTTPS (from your PC)

Open in a browser:

```
https://yourdomain.com
```

Homepage loads. Refresh a deep link like `https://yourdomain.com/account` — it should still
load (not 404) thanks to the SPA fallback.

### E. API works end-to-end through nginx + HTTPS

In the browser:

```
https://yourdomain.com/api/categories
```

Returns the category JSON, proving: Browser → nginx(443) → Node(3002) → JSON.

### F. Sign-up / login works

- Create a new account → user is saved to `backend/data/users.json`.
- Log in → JWT returned, session works.

### G. HTTPS redirect works (from PC)

Visit `http://yourdomain.com` — it should redirect to `https://yourdomain.com`.

### H. Port 3002 not publicly reachable (from PC)

```powershell
curl.exe --max-time 5 http://YOUR_VPS_IP:3002/api/products
```

Should time out. Public access is only via HTTPS on 443.

---

## 2. Test the API with Real Requests

Sign up and test auth:

```bash
# Sign up
curl -s -X POST https://yourdomain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Get products
curl -s https://yourdomain.com/api/products
```

---

## 3. Common Problems & Fixes

### Frontend page loads but no data appears
- **Cause:** API URL still `http://localhost:3002` in `src/services/api.ts`.
  **Fix:** set it to `'/api'` and rebuild (guide 04).
- **Cause:** CSP in `index.html` blocks `/api` via `connect-src 'self'` mismatch.
  **Fix:** ensure `connect-src` includes `'self'` (guide 04 step 4).

### `502 Bad Gateway` on `/api/...`
- **Cause:** Node backend down.
  **Fix:** `pm2 status`, `pm2 logs hobags-backend`, `pm2 restart hobags-backend`.

### `404` on `/api/...`
- **Cause:** nginx `proxy_pass` trailing-slash issue or missing `/api` in the block.
  **Fix:** set `proxy_pass http://127.0.0.1:3002;` (no trailing slash) so the `/api` path is passed through (guide 05).

### Deep-link refresh gives 404
- **Cause:** SPA fallback missing.
  **Fix:** ensure `location / { try_files $uri $uri/ /index.html; }` exists (guide 05).
  Re-add it if Certbot stripped it (guide 06 step 4).

### "Connection not private" / certificate warning
- **Fix:** run `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com` again (guide 06).

### Blank white page, console shows CSP errors
- **Fix:** review `index.html` CSP; allow the domains your app actually loads from (guide 04).

### Login/signup fails but homepage loads
- **Cause:** backend can't write JSON files (permissions).
  **Fix:** `chown -R <user>:<user> ~/hobags/backend` and ensure `data/` is writable.

### Data lost after reboot
- **Cause:** `pm2 startup` not configured.
  **Fix:** run `pm2 save` and the `pm2 startup` command (guide 03 step 5d).

### Site very slow
- **Fix:** enable gzip (guide 05), consider adding swap on the VPS:
  ```bash
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
  sudo mkswap /swapfile && sudo swapon /swapfile
  ```

---

## 4. How to Update the Site Later

### Backend change

```bash
# 1. Upload/update the file(s), e.g.
#    scp backend/server.js deploy@YOUR_VPS_IP:~/hobags/backend/

# 2. On the VPS
pm2 restart hobags-backend
pm2 logs hobags-backend    # confirm it started fine
```

### Frontend change

```bash
# 1. Upload/update changed source files (or git pull on the VPS)
cd ~/hobags/frontend

# 2. Install deps only if package.json changed
npm install

# 3. Rebuild
npm run build

# 4. Nginx serves the new dist/ automatically (no reload needed unless config changed)
```

### Nginx / SSL change

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo nginx -t && sudo systemctl restart nginx   # if reload isn't enough
```

### Quick full-deploy one-liner (Git setup)

```bash
cd ~/hobags/frontend && git pull origin main && npm install && npm run build
cd ~/hobags/backend  && git pull origin main && npm install && pm2 restart hobags-backend
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. Final Architecture Recap (What You Deployed)

```
Browser
  │  https://yourdomain.com  (443)
  ▼
Nginx ──────────────── serves frontend static files (dist/)
  │
  └─ /api/*  →  127.0.0.1:3002  →  Node backend → JSON files (backend/data)
                                                   ├ users.json
                                                   ├ products.json
                                                   ├ orders.json
                                                   ├ reviews.json
                                                   ├ settings.json
                                                   └ reset_tokens.json
```

- **PM2** keeps the Node backend alive and auto-starts on boot.
- **UFW** exposes only ports 22/80/443; the backend port is internal.
- **Certbot** provides auto-renewing HTTPS.
- **Backups** (guide 07) protect your JSON data.

**Your HoBags site is now fully deployed. 🎉**
