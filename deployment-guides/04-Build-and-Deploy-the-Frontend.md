# HoBags — Deployment Guide 04: Build & Deploy the Frontend

This guide installs the frontend's dependencies, points it at the production API, adjusts the
Content-Security-Policy, builds the production bundle with Vite, and places the static files
so nginx can serve them.

---

## 1. Why We Must Change the API URL

The frontend currently calls the API at a **hardcoded localhost address**:

`src/services/api.ts` (line 1):
```ts
const API_BASE = 'http://localhost:3002/api'
```

On a production server, `localhost` would mean the **user's own computer**, not your VPS —
so every API request would fail. Instead, we set it to the **relative path** `/api`, which
means "call the API on the same domain the user is visiting". Nginx then forwards `/api/*`
to the Node backend on **port 3002** (configured in guide 05).

---

## 2. Install Frontend Dependencies

On the VPS:

```bash
cd ~/hobags/frontend
npm install
```

This installs React, Vite, Three.js, Tailwind, and everything else from `package.json`.
It can take a few minutes. When it's done, `node_modules/` will exist.

---

## 3. Change the API Base URL to `/api`

Edit the API service:

```bash
nano ~/hobags/frontend/src/services/api.ts
```

Change line 1 from:

```ts
const API_BASE = 'http://localhost:3002/api'
```

to:

```ts
const API_BASE = '/api'
```

Save with **Ctrl+O**, `Enter`, then **Ctrl+X**.

> That single change reroutes all frontend API calls (login, products, orders, cart, admin,
> supplier, seller, manufacturer) through nginx → Node backend.

---

## 4. Update the Content-Security-Policy (CSP) for Production

The `index.html` contains a meta CSP that **only allows** connecting to `localhost`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://accounts.google.com https://appleid.cdn-apple.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' http://localhost:* ws:; frame-src 'self' https://accounts.google.com;">
```

For production, you want the frontend to talk to **your own domain** (itself). Change the
`connect-src` value from `http://localhost:* ws:` to just `'self'`:

```bash
nano ~/hobags/frontend/index.html
```

Change the CSP line so `connect-src` becomes:

```html
... ; connect-src 'self' https://www.google-analytics.com https://maps.googleapis.com; frame-src 'self' https://accounts.google.com;">
```

or more simply (only allow the current origin):

```html
... ; connect-src 'self'; frame-src 'self' https://accounts.google.com;">
```

> **What this does:** `connect-src 'self'` lets the browser make fetch/XHR calls only to the
> site's own origin (your domain). Since the API is proxied on the same origin via nginx,
> `/api` requests still work. If you later need external API calls (Google Maps, analytics,
> payment gateways), add those hosts to `connect-src`.
>
> **Keep** the `script-src` and `frame-src` entries for Google/Apple login, and the
> `fonts.googleapis.com` / `fonts.gstatic.com` entries for the Inter font and Material icons
> if your site relies on them.

Save and exit.

---

## 5. Build the Production Bundle

Run the production build:

```bash
cd ~/hobags/frontend
npm run build
```

- Vite compiles the React/TypeScript/Tailwind app and writes the optimized static files to
  the **`dist/`** folder.
- The last line of output will say something like `✓ built in X.XXs`.

Verify the output exists:

```bash
ls -la dist/
```

You should see `index.html` and an `assets/` folder with hashed `.js` and `.css` files.

> If the build fails with `TypeScript errors`, it means your source has type issues — fix
> them on your local machine, re-upload, and rebuild. If it fails on missing dependencies,
> run `npm install` again.

---

## 6. Confirm the Static Output

The built site is ready to be served. nginx will point at:

```
/home/deploy/hobags/frontend/dist   (or /root/hobags/frontend/dist)
```

Confirm the path exists:

```bash
ls ~/hobags/frontend/dist/index.html
```

> **Do not** run `vite dev` or `vite preview` in production. We serve the built `dist/`
> files directly through nginx (guide 05). This is faster and more secure.

---

## 7. Set Correct Ownership/Permissions (Optional)

If nginx runs as the `www-data` user and cannot read the files, fix ownership:

```bash
sudo chown -R www-data:www-data ~/hobags/frontend/dist
sudo chmod -R 755 ~/hobags/frontend/dist
```

---

## 8. Troubleshooting the Frontend Build

| Symptom | Cause / Fix |
|---------|-------------|
| `npm run build` fails on TS errors | Fix types locally, re-upload `src`, rebuild |
| `dist/` missing | Build failed — scroll up in the build output for the real error |
| API 404 on `/api/...` | Backend route not matching — check nginx proxy (guide 05) and backend server |
| Blank page after load | CSP blocking requests — review `index.html` CSP (step 4) |
| API calls still hit `localhost:3002` | You didn't save the `/api` change in `src/services/api.ts` |
| Images broken | Likely CSP `img-src` — adjust, or images hosted on another domain need to be allowed in `img-src` |

---

Your frontend is built. Now configure nginx to serve it and proxy the API:

➡️ **[05 - Configure Nginx](05-Configure-Nginx.md)**
