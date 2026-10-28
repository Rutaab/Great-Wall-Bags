# HoBags — Deployment Guide 05: Configure Nginx

Now we wire everything together with **nginx**. Nginx will:

1. **Serve the built frontend** static files (`~/hobags/frontend/dist`).
2. **Proxy `/api/*`** requests to the Node backend on `127.0.0.1:3002`.
3. Provide **SPA routing fallback**, **gzip**, and **security headers**.

> This guide created an HTTP-only config. HTTPS/SSL is added **after** this in guide 06
> with Certbot, which upgrades this config automatically. If you prefer, you can jump to
> guide 06 first — it also creates the nginx config for you. Either order works.

---

## 1. Understand the Two Locations

| URL path | Handled by |
|----------|-----------|
| `https://yourdomain.com/` and every non-API route | Nginx serves frontend from `dist/` (with SPA fallback to `index.html`) |
| `https://yourdomain.com/api/...` | Nginx proxies to `http://127.0.0.1:3002/api/...` (Node backend) |

Because both run on the **same origin (domain)**, the frontend's `/api` calls and the
`connect-src 'self'` CSP policy work together with no CORS issues.

---

## 2. Remove the Default nginx Site

Ubuntu's nginx ships with a `default` site on port 80. Remove it so it doesn't conflict:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

---

## 3. Create the HoBags Nginx Site Config

Create a new config file:

```bash
sudo nano /etc/nginx/sites-available/hobags
```

Paste the following, and **replace `yourdomain.com` with your real domain** everywhere:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # --- Static frontend (built by Vite) ---
    root /root/hobags/frontend/dist;
    index index.html;

    # The dist folder path depends on your user:
    #   root user   -> /root/hobags/frontend/dist
    #   deploy user -> /home/deploy/hobags/frontend/dist
    # Use whichever matches your setup (from guide 02).

    # --- Gzip compression ---
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               application/x-javascript text/xml application/xml image/svg+xml;

    # --- Cache built JS/CSS/assets aggressively (they have hashed filenames) ---
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # --- API requests -> Node backend ---
    location /api/ {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 30s;
    }

    # --- SPA fallback: any other route serves index.html ---
    location / {
        try_files $uri $uri/ /index.html;
    }

    # --- Basic security headers ---
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # --- Block access to dotfiles ---
    location ~ /\. {
        deny all;
    }
}
```

> **About `proxy_pass http://127.0.0.1:3002;`:**
> There is **no trailing slash** on purpose. If a request comes in as
> `https://yourdomain.com/api/products`, nginx passes it as `/api/products` to the backend.
> The backend expects `/api/...` paths, so removing the `old path` is correct. If you see
> `404`s on API calls, this is the first thing to check.

Save with **Ctrl+O**, `Enter`, then **Ctrl+X**.

> **Fix the `root` path if needed:** this guide assumes the `root` user. If you logged in as
> `deploy`, use `root /home/deploy/hobags/frontend/dist;` instead.

---

## 4. Enable the Site

Create a symlink from `sites-available` to `sites-enabled`:

```bash
sudo ln -s /etc/nginx/sites-available/hobags /etc/nginx/sites-enabled/hobags
```

---

## 5. Test the Nginx Configuration

Always test before reloading:

```bash
sudo nginx -t
```

You should see `syntax is ok` and `test is successful`.

> If you get an error about `root ... does not exist`, build the frontend first (guide 04)
> or fix the `root` path in the config.

---

## 6. Reload Nginx

```bash
sudo systemctl reload nginx
```

---

## 7. Verify HTTP is Working (Before SSL)

From your PC browser, visit:

```
http://yourdomain.com
```

You should see the HoBags homepage. Test the API directly in your browser:

```
http://yourdomain.com/api/categories
```

You should see the JSON list of categories returned by the backend — this confirms the
reverse proxy works end-to-end (frontend static + backend API).

---

## 8. Troubleshooting Nginx

| Symptom | Cause / Fix |
|---------|-------------|
| `502 Bad Gateway` on `/api/*` | Backend not running — `pm2 status`, `pm2 logs hobags-backend` |
| `404` on `/api/*` | `proxy_pass` trailing-slash mismatch (see step 3 note) |
| `403 Forbidden` | Wrong `root` path or permission — fix path, `chown -R www-data` (guide 04 step 7) |
| Blank page, no API data | CSP blocking / API URL still localhost (guide 04) |
| `sudo nginx -t` fails | Syntax error in config — review carefully |
| Only `index.html` loads, routes 404 on refresh | Missing SPA fallback — ensure `try_files $uri $uri/ /index.html;` |
| nginx shows "default" site | You didn't remove `sites-enabled/default` (step 2) |

---

Nginx is serving your site on HTTP. Now add **free HTTPS**:

➡️ **[06 - SSL Certificate (HTTPS)](06-SSL-Certificate.md)**
