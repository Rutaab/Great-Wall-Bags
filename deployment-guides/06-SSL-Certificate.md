# HoBags — Deployment Guide 06: SSL Certificate (Free HTTPS with Let's Encrypt)

We add a **free SSL/TLS certificate** so your site runs over HTTPS. We use **Certbot** with the
Let's Encrypt CA, which creates the certificate, configures nginx for HTTPS, and handles
auto-renewal.

**Before starting:** your domain must point to this VPS and nginx must already be configured
and reachable over HTTP (guide 05 — it must be, or Certbot cannot verify ownership).

---

## 1. Install Certbot and the nginx plugin

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

---

## 2. Obtain and Install the Certificate

Run the nginx plugin, specifying your domain(s):

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

- Replace the domains with your real ones.
- Certbot will detect your nginx config from guide 05.
- It will stop and confirm a few things:
  - **Email:** enter an email address for expiry/security notices (optional but recommended).
  - **Terms of Service:** type `A` to agree.
  - **Share email?** your choice (`N` usually).
  - **Redirect HTTP to HTTPS?** choose **2** ("Secure — Redirect ...") so all HTTP traffic
    jumps to HTTPS.

When done, Certbot prints a success message and **automatically rewrites your nginx site
config** to use the new certificate and force HTTPS.

---

## 3. Verify the HTTPS Site

From your PC browser:

```
https://yourdomain.com
```

- The padlock should show a valid certificate.
- Visiting `http://yourdomain.com` should redirect you to `https://yourdomain.com`.

Test the API over HTTPS:

```
https://yourdomain.com/api/categories
```

It should still return the category JSON.

---

## 4. Check Your Updated Nginx Config

Certbot modified `/etc/nginx/sites-available/hobags`. Inspect it:

```bash
sudo nano /etc/nginx/sites-available/hobags
```

You should now see `listen 443 ssl`, `ssl_certificate` and `ssl_certificate_key` lines
pointing to `/etc/letsencrypt/live/yourdomain.com/...`, and a `server` block that redirects
port 80 to 443.

> **Important:** Certbot's edit sometimes drops parts of the config. Verify these still exist
> after running it:
> - `root .../dist;` and the `location / { try_files ... /index.html; }` **SPA fallback**.
> - The `location /api/ { proxy_pass http://127.0.0.1:3002; ... }` **reverse proxy**.
> - The `location /assets/ { ... }` **cache block**.
>
> If any were removed, re-add them (refer to guide 05 steps for the content) and reload nginx:
> ```bash
> sudo nginx -t && sudo systemctl reload nginx
> ```

---

## 5. Test That Renewal Works

Let's Encrypt certificates are valid for 90 days and auto-renew. Test the renewal pipeline
(dry run — does not change anything):

```bash
sudo certbot renew --dry-run
```

You should see a line like:

```
Congratulations, all simulated renewals succeeded
```

---

## 6. Verify Auto-Renewal Is Scheduled

A systemd timer is installed with Certbot. Check it:

```bash
sudo systemctl list-timers | grep certbot
```

You should see a `certbot.timer` that runs twice a day and renews when needed. No manual
work is required after this.

To manually force renewal anytime:

```bash
sudo certbot renew
```

---

## 7. (Optional) Add HSTS — Always Use HTTPS

HSTS tells browsers to only ever use HTTPS for your domain. Add this line to the **443 server
block** in `/etc/nginx/sites-available/hobags`:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

Then test and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

> **Caution:** only enable HSTS after confirming HTTPS works (step 3). Once a browser sees
> HSTS, it refuses plain HTTP for a year and you'd need to clear browser state to undo it.

---

## 8. Troubleshooting SSL

| Symptom | Cause / Fix |
|---------|-------------|
| Certbot "challenge failed" | Domain doesn't resolve to this VPS yet, or port 80 is firewalled. Confirm DNS + `sudo ufw allow 80/tcp` |
| Certificate obtained but site mixed-content warnings | Some resources still loaded over HTTP — ensure nginx redirects and assets use relative/HTTPS URLs |
| "Your connection is not private" | Cert not installed / not trusted yet — wait for propagation, re-run Certbot |
| Renewal fails later | Usually DNS or firewall issue at renewal time — check `certbot renew` output |

---

Your site is live over **HTTPS**. Next, lock down the server:

➡️ **[07 - Firewall & Security](07-Firewall-and-Security.md)**
