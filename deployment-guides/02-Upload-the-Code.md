# HoBags — Deployment Guide 02: Upload the Code

This guide gets the HoBags **frontend** and **backend** code onto your VPS. You can use either:

- **Option A — SCP** (simple, one-time copy from your Windows PC), or
- **Option B — Git** (best for ongoing updates).

Both produce the same end result on the VPS:
```
~/hobags/
├── frontend/     (React + Vite project)
└── backend/      (Node + Express project)
```

> The example paths use `YOUR_VPS_IP`. Replace it with your real IP.

---

## Option A: Upload with SCP (from Windows)

SCP (Secure Copy) runs over SSH and is built into Windows. Open **PowerShell** on your PC.

### 1. Create the remote folder structure

First, SSH in and create the target directories:

```bash
ssh deploy@YOUR_VPS_IP "mkdir -p ~/hobags/frontend ~/hobags/backend"
```

### 2. Upload the FRONTEND source files

The frontend needs its **source code and config files**, but **NOT** `node_modules/` (re-created with `npm install`) and **NOT** the existing `dist/` (re-created with `npm run build` on the VPS).

From your PC, in PowerShell, `cd` to your local project first:

```powershell
cd "D:\Rutaab Ali Access\Hobags\HoBags"
```

Then upload (one command per line):

```powershell
scp -r src deploy@YOUR_VPS_IP:~/hobags/frontend/
scp package.json deploy@YOUR_VPS_IP:~/hobags/frontend/
scp package-lock.json deploy@YOUR_VPS_IP:~/hobags/frontend/
scp index.html deploy@YOUR_VPS_IP:~/hobags/frontend/
scp vite.config.ts deploy@YOUR_VPS_IP:~/hobags/frontend/
scp tsconfig.json deploy@YOUR_VPS_IP:~/hobags/frontend/
scp tsconfig.node.json deploy@YOUR_VPS_IP:~/hobags/frontend/
scp tailwind.config.js deploy@YOUR_VPS_IP:~/hobags/frontend/
scp postcss.config.js deploy@YOUR_VPS_IP:~/hobags/frontend/
```

> There is **no `public/` folder** in this project, so you don't need to upload one.
> If you add one later (for static assets/favicons), upload it too:
> ```powershell
> scp -r public deploy@YOUR_VPS_IP:~/hobags/frontend/
> ```

### 3. Upload the BACKEND files

The backend lives in the `backend/` folder. Upload the whole backend directory **except** `node_modules/` and `data/` (those are created on the server):

```powershell
scp -r backend/server.js deploy@YOUR_VPS_IP:~/hobags/backend/
scp backend/package.json deploy@YOUR_VPS_IP:~/hobags/backend/
scp backend/package-lock.json deploy@YOUR_VPS_IP:~/hobags/backend/
```

> **What about `backend/data/`?**
> The JSON database files (`users.json`, `products.json`, etc.) are **created automatically**
> by the server code when it first starts (they default to `[]` / `{}`). So you don't need to
> upload them. If you want to keep **existing** data from your local machine, copy the whole
> `backend/data` folder:
> ```powershell
> scp -r backend/data deploy@YOUR_VPS_IP:~/hobags/backend/
> ```
> This is how you migrate a populated database.

### 4. Confirm the layout on the VPS

```bash
ssh deploy@YOUR_VPS_IP
cd ~/hobags
tree -L 2
```

You should see `frontend/` and `backend/` with the expected files.

---

## Option B: Upload with Git (Recommended for Updates)

If your code is hosted on GitHub/GitLab/Bitbucket, cloning on the VPS makes future updates as easy as `git pull`.

### 1. Make sure your repo is pushed

On your PC, ensure the project is committed and pushed to a remote. Add a good `.gitignore` so we never commit `node_modules/`, `dist/`, logs, or backend data:

```gitignore
# deployments guides / logs
deployment-guides/

# dependencies
node_modules/

# build output
dist/

# backend runtime
backend/node_modules/
backend/data/
backend/*.log
backend/*.log.*
```

### 2. Clone on the VPS

```bash
ssh deploy@YOUR_VPS_IP
cd ~
git clone YOUR_REPO_URL hobags
```

Replace `YOUR_REPO_URL` with your repo URL (HTTPS or SSH).

### 3. (Only if needed) Move code into frontend/ and backend/

If your repo root contains both `src/` (frontend) and `backend/` (as this project does), structure it on the server so the frontend and backend are clearly separated. Create the two folders and move files:

```bash
cd ~/hobags
mkdir -p frontend backend
# Move frontend files
mv package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json tailwind.config.js postcss.config.js src frontend/
# Move backend folder
mv backend/server.js backend/package.json backend/package-lock.json backend/ backend/
```

This produces the same `~/hobags/frontend` + `~/hobags/backend` layout as Option A.

> The exact move commands depend on how your repo is organized. Just aim for the
> **target layout** shown at the top of this guide. If your repo already has a clean
> `frontend/` + `backend/` split, you can skip the moving step.

---

## Quick File Check

After either option, verify from the VPS:

```bash
cd ~/hobags/frontend
ls            # should list: src, package.json, vite.config.ts, etc.

cd ~/hobags/backend
ls            # should list: server.js, package.json, package-lock.json
```

Both folders exist and contain your source. `node_modules/` is **absent** — that's correct; we install dependencies next.

---

## Summary

| Folder | Contents | `npm install` on server? |
|--------|----------|--------------------------|
| `~/hobags/frontend/` | React source + configs | Yes (guide 04) |
| `~/hobags/backend/` | Express source | Yes (guide 03) |

Code is on the server. Next, install dependencies and run the backend:

➡️ **[03 - Deploy the Backend](03-Deploy-the-Backend.md)**
