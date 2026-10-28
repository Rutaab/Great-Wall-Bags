# HoBags — Deployment Guide 01: VPS Initial Setup

This guide prepares your **Hostinger VPS** to host the HoBags application. By the end, your VPS will have a non-root admin user, Node.js 20 LTS, git, nginx, and a few helper tools.

**You need:** SSH credentials to your VPS (IP address, username, password) from Hostinger.

---

## 1. Find Your VPS IP & Get SSH Access

1. Log in to the **Hostinger hPanel** → **VPS** → your server.
2. Note the **VPS IP address** (e.g. `123.45.67.89`).
3. Note the **root password** (you can also create an SSH key pair in hPanel, but a password is simplest).
4. Confirm your **domain** points to this IP:
   - In hPanel → **Domains** → your domain → **DNS** → ensure an **A record** points `@` (and `www`) to the VPS IP.
   - Or in your registrar's DNS panel. DNS changes can take a few hours to propagate.

---

## 2. SSH Into Your VPS (from Windows)

Open **PowerShell** (or **Windows Terminal**) on your PC and connect:

```powershell
ssh root@YOUR_VPS_IP
```

- Replace `YOUR_VPS_IP` with your actual IP.
- Accept the host key fingerprint when prompted.
- Enter your root password when asked.

> If you prefer a GUI, install **PuTTY** or use the **Hostinger Web Terminal** (in hPanel, VPS → your server → "Terminal"). The terminal commands are identical.

---

## 3. Update the System

Always start with a fresh, updated system:

```bash
apt update
apt upgrade -y
```

- `apt update` refreshes the package lists.
- `apt upgrade` installs the latest security/bugfix updates.
- Confirm any prompts that appear (press `Y` / `Enter`).

---

## 4. Set the Correct Time Zone (Optional but Recommended)

Set the server timezone so logs and timestamps make sense:

```bash
timedatectl set-timezone UTC
```

Or set your local timezone, e.g.:
```bash
timedatectl set-timezone Asia/Karachi
```

---

## 5. Create a Non-Root User (Recommended for Security)

Working as `root` for everything is risky. Create an admin user `deploy`:

```bash
adduser deploy
```

- Choose a strong password and confirm.
- Leave the other prompts (full name, etc.) blank by pressing `Enter`.

Grant `deploy` sudo privileges (ability to use `sudo` to run admin commands):

```bash
usermod -aG sudo deploy
```

Log in as this user for the rest of the setup:

```bash
exit
ssh deploy@YOUR_VPS_IP
```

> Everything below works the same whether you stay as `root` or use `deploy` + `sudo`.
> If you use `deploy`, prefix commands that need admin rights with `sudo`.
> This guide writes paths under the **home directory** (`~/`), which is
> `/root/` for root and `/home/deploy/` for the `deploy` user.

---

## 6. Install Essential Packages

```bash
sudo apt update
sudo apt install -y curl wget git build-essential nginx tree unzip ufw
```

What this installs:
- **curl / wget** — download files from the internet
- **git** — to clone/pull the code
- **build-essential** — compilers/tools needed to compile some npm packages
- **nginx** — the web server / reverse proxy
- **tree & unzip** — small helper tools
- **ufw** — the firewall (configured in guide 07)

Verify nginx installed correctly:

```bash
nginx -v
```

---

## 7. Install Node.js 20 LTS (The Backend Runs on Node)

The HoBags backend is **Node.js + Express**, so we need Node on the VPS.

Add the official NodeSource repository, then install Node 20 (the LTS line):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify both Node and npm:

```bash
node -v     # should print v20.x.x
npm -v      # should print 10.x.x
```

> **Why Node 20?** The project's `package-lock.json` was generated with npm 10 / a modern Node. Node 20 LTS is stable and fully compatible. If you are unsure, Node 20 is the safe choice.

---

## 8. Install PM2 (Process Manager for the Backend)

PM2 keeps the Node backend running, restarts it if it crashes, and starts it on boot.

Install it globally:

```bash
sudo npm install -g pm2
```

Verify:

```bash
pm2 -v
```

> We configure the backend to run under PM2 in **guide 03**.

---

## 9. (Optional) Install Fail2ban for Extra Security

Fail2ban blocks IPs that repeatedly fail to log in via SSH. Skip if you want to keep it minimal.

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

Let it run in the background — nothing else to configure now.

---

## 10. Confirm Everything Is Installed

Run a quick version check:

```bash
echo "=== Versions ==="
node -v
npm -v
git --version
nginx -v 2>&1
pm2 -v
ufw --version
```

All should print a version number with no error messages.

---

## 11. Where to Go Next

Your VPS is now ready. In the next guide we transfer the project code onto the server:

➡️ **[02 - Upload the Code](02-Upload-the-Code.md)**
