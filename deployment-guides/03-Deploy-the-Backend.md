# HoBags — Deployment Guide 03: Deploy the Backend (Node.js)

This guide installs the **Node.js + Express** backend on the VPS, tweaks two important hardcoded settings, and runs it permanently with **PM2** so it auto-restarts and starts on boot.

---

## 1. Install Backend Dependencies

On the VPS, go to the backend folder and install its npm packages:

```bash
cd ~/hobags/backend
npm install
```

- This reads `package.json` and installs `express`, `cors`, `jsonwebtoken`, `uuid`.
- It may take a minute. When done, a `node_modules/` folder appears here.

Verify the install:

```bash
node -e "require('express'); require('cors'); require('jsonwebtoken'); require('uuid'); console.log('ALL DEPS OK')"
```

It should print `ALL DEPS OK`.

---

## 2. Secure the Backend Configuration

The file `backend/server.js` has two **hardcoded** values you should fix for production:

1. The **CORS allowed origins** (currently only `localhost` — your real domain must be allowed).
2. The **JWT secret** (currently a fixed demo string — better to use a strong secret via env var).

Let's improve both without rewriting the whole server.

### 2a. Update CORS to allow your production domain

Open the file:

```bash
nano ~/hobags/backend/server.js
```

Find this line (near the top, around line 14):

```js
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], credentials: true }));
```

Replace it so it includes your production domain:

```js
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'https://yourdomain.com', 'https://www.yourdomain.com'], credentials: true }));
```

> This allows the browser on your live site to call the API. Because nginx proxies the same
> origin in production, CORS is mostly a "just in case" safeguard here — but it's good hygiene.
> (Actually, since the frontend and API share the same origin in production via nginx,
> cross-origin requests don't even happen — see guide 05. Keeping these entries is still correct.)

Save with **Ctrl+O**, `Enter`, then **Ctrl+X** to exit.

### 2b. (Recommended) Harden the JWT secret with an environment variable

The backend hardcodes `JWT_SECRET` and `PEPPER`. For production you should use random secrets
via environment variables. Edit the same file and change these two lines:

```js
const JWT_SECRET = 'hobags_jwt_secret_2024_kinetic';
const PEPPER = 'H0B@g5_S@lt_K!n3t1c_2024';
```

to:

```js
const JWT_SECRET = process.env.JWT_SECRET || 'hobags_jwt_secret_2024_kinetic';
const PEPPER = process.env.PEPPER || 'H0B@g5_S@lt_K!n3t1c_2024';
```

> **Why:** With env vars, the secrets are set at deployment time and kept out of source control.
> If you skip this step, the app still works — just with the default (less secure) keys.
> Generating strong values is covered in step 3.

Save (**Ctrl+O**, `Enter`, **Ctrl+X**).

---

## 3. Create an Environment File with Strong Secrets

Generate two strong random secrets on the VPS:

```bash
echo "JWT:"
openssl rand -base64 48
echo "PEPPER:"
openssl rand -base64 32
```

Copy both outputs. Now create an env file in the backend folder:

```bash
nano ~/hobags/backend/.env
```

Paste this, replacing the values with your generated strings (and your real domain):

```env
NODE_ENV=production
PORT=3002
JWT_SECRET=PASTE_YOUR_GENERATED_JWT_HERE
PEPPER=PASTE_YOUR_GENERATED_PEPPER_HERE
```

Save and exit (**Ctrl+O**, `Enter`, **Ctrl+X**).

> **Security note:** Keep this file private. Never commit `.env` to git. Run:
> ```bash
> chmod 600 ~/hobags/backend/.env
> ```
> and add `backend/.env` to your `.gitignore`.

---

## 4. Start the Backend and Test It (Foreground First)

Run the server manually first to make sure it boots without errors:

```bash
cd ~/hobags/backend
NODE_ENV=production PORT=3002 JWT_SECRET="$(grep JWT_SECRET .env | cut -d= -f2)" PEPPER="$(grep PEPPER .env | cut -d= -f2)" node server.js
```

> This loads `.env` values inline so the rest of testing is valid. If this is fiddly,
> it's fine — PM2 will load `.env` automatically for you in the next step.

You should see:

```
HoBags API server running on http://localhost:3002
```

In a **second terminal**, confirm the API responds:

```bash
curl -s http://localhost:3002/api/products
```

You should get a JSON array (possibly `[]` if there are no products yet). If any JSON comes
back, the backend works. Go back to the first terminal and press **Ctrl+C** to stop the
manual run.

---

## 5. Run the Backend with PM2 (Permanent Process)

PM2 keeps Node running, restarts it on crash, survives reboots, and loads `.env` for you.

### 5a. Add the backend to PM2 with env support

```bash
cd ~/hobags/backend
pm2 start server.js --name hobags-backend --env production
```

### 5b. Make PM2 load the `.env` file automatically

PM2 will read `.env` for you only if you set `NODE_ENV`. To guarantee the env vars, update
the list of env files PM2 loads:

```bash
pm2 set pm2:sysmonit false 2>/dev/null
```

Actually, the simplest reliable approach is to tell PM2 which env file to inject via the
`--env` and a pm2 ecosystem file, OR just export them. To keep it simple and robust, save
the vars into PM2's environment for this process:

```bash
pm2 restart hobags-backend --update-env
```

If you want the cleanest approach, create a PM2 ecosystem file:

```bash
nano ~/hobags/backend/ecosystem.config.js
```

```js
module.exports = {
  apps: [{
    name: 'hobags-backend',
    script: 'server.js',
    cwd: __dirname,
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    }
  }]
};
```

Then start with that config (it loads `.env` via `dotenv`-style only if you add that — so
instead we read the values in step 5c below).

> **Simplest reliable method:** just start PM2 and rely on the code's fallback defaults plus
> `--update-env` after exporting the vars once. Do this:

```bash
cd ~/hobags/backend
set -a
source .env
set +a
pm2 restart hobags-backend --update-env
pm2 save
```

- `source .env` loads the file, and `pm2 ... --update-env` pushes those vars into the running
  process and persists them.

### 5c. Save the PM2 process list so it restarts on reboot

```bash
pm2 save
```

### 5d. Enable PM2 to start on boot

```bash
pm2 startup
```

PM2 prints a command starting with `sudo env PATH=... pm2 startup systemd -u deploy ...`.
Copy & run **exactly that printed command**, e.g.:

```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### 5e. Verify PM2 status

```bash
pm2 status
```

You should see `hobags-backend` with **online** status and no errors. Check the logs:

```bash
pm2 logs hobags-backend
```

You should again see `HoBags API server running on http://localhost:3002`. Press **Ctrl+C**
to exit the log viewer (this does not stop the app).

---

## 6. Confirm the Backend Is Still Responding

```bash
curl -s http://localhost:3002/api/products
curl -s http://localhost:3002/api/categories   # should return the category list
```

Both should return JSON. The backend is live and managed by PM2.

---

## 7. Test Auto-Start (Optional)

Reboot and confirm the backend comes back on its own:

```bash
sudo reboot
```

Wait ~30 seconds, reconnect via SSH, then:

```bash
pm2 status
curl -s http://localhost:3002/api/products
```

Both should work — the backend survived the reboot because of `pm2 startup` + `pm2 save`.

---

## 8. Troubleshooting the Backend

| Symptom | Cause / Fix |
|---------|-------------|
| `EADDRINUSE` when starting | Port 3002 already used. `pm2 restart hobags-backend` or kill the old process |
| `Cannot find module 'express'` | Didn't run `npm install` in `backend/` |
| `Error: listen EACCES` | Permission issue on port — not applicable here (3002 is a high port) |
| Secret env vars missing | Ensure `.env` exists and you ran `source .env` before `pm2 save` |
| `502` from nginx later | Backend not running — `pm2 status` and `pm2 logs hobags-backend` |
| API returns empty/corrupt data | JSON data files not uploaded — copy `backend/data` from your PC (guide 02) |

---

The backend is up. Now build and serve the frontend:

➡️ **[04 - Build & Deploy the Frontend](04-Build-and-Deploy-the-Frontend.md)**
