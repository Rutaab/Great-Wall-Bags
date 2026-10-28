# HoBags — Deployment Guide 07: Firewall & Security

This guide hardens the VPS. By the end:
- The **public** only sees ports **22 (SSH)**, **80 (HTTP)**, **443 (HTTPS)**.
- The **Node backend port 3002 is NOT exposed** to the internet — only nginx (localhost) talks to it.
- JSON data files and secrets are protected, and we set up periodic backups.

---

## 1. Enable the UFW Firewall

UFW (Uncomplicated Firewall) is a simple front end to the Linux firewall.

### 1a. Allow SSH FIRST (so you don't lock yourself out)

```bash
sudo ufw allow 22/tcp
```

### 1b. Allow HTTP and HTTPS

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 1c. Explicitly DENY the backend port from outside

The Node backend listens on **3002**. It should only be reachable from nginx on the same
machine. Block it publicly:

```bash
sudo ufw deny 3002/tcp
```

### 1d. Enable the firewall

```bash
sudo ufw enable
```

When asked `Command may disrupt existing ssh connections. Proceed with operation (y|n)?`,
type **y**.

### 1e. Check the status

```bash
sudo ufw status verbose
```

Expected output (ports may vary if you adjusted SSH):

```
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
3002/tcp                   DENY        Anywhere
```

> After this, `curl http://localhost:3002/api/products` still works locally (firewall only
> affects external traffic), but nobody on the internet can reach port 3002 directly — they
> must go through nginx on 443.

---

## 2. Confirm the Backend Is Internal-Only

From the VPS:

```bash
curl -s http://localhost:3002/api/products   # works (local)
```

From **your PC** (open a browser or PowerShell), try to reach the raw backend port:

```powershell
curl.exe --max-time 5 http://YOUR_VPS_IP:3002/api/products
```

This should **time out / fail** — that's exactly what we want. The public path is only:

```
https://yourdomain.com/api/products   (via nginx, port 443)
```

---

## 3. Restrict SSH (Recommended)

By default, anyone can try to SSH in with `root` as the username. Two easy improvements:

### 3a. (Recommended) Switch to key-based SSH and disable password login

Generate a key on your PC (if you don't have one) and copy it to the VPS:

```powershell
ssh-keygen -t ed25519 -C "you@machine"
ssh-copy-id deploy@YOUR_VPS_IP
```

> Windows may not have `ssh-copy-id`. If so, manually append your `~/.ssh/id_ed25519.pub`
> to `~/.ssh/authorized_keys` on the VPS:
> ```bash
> mkdir -p ~/.ssh && chmod 700 ~/.ssh
> nano ~/.ssh/authorized_keys      # paste your public key, save
> chmod 600 ~/.ssh/authorized_keys
> ```

Then, once key login works, disable password auth in `/etc/ssh/sshd_config`:

```bash
sudo nano /etc/ssh/sshd_config
```

Change/set these lines:

```ini
PasswordAuthentication no
PermitRootLogin no
```

Then restart SSH:

```bash
sudo systemctl restart ssh
```

> **WARNING:** Do this only AFTER confirming you can log in with your key. If you get locked
> out, re-enable password login via the Hostinger VNC/web terminal console in hPanel.

### 3b. (Alternative) Change the SSH port

Requires more config and breaks `ssh-copy-id` defaults — only do this if you're confident.

---

## 4. Protect Sensitive Files & Secrets

### 4a. Lock down the `.env` file (contains JWT secret / pepper)

```bash
chmod 600 ~/hobags/backend/.env
```

### 4b. Protect the JSON database directory from web access

The `backend/data/` folder is only read by Node locally; nginx already `deny`d dotfiles
and only serves `dist/`. Nothing else needed, but make sure `data/` is **not** inside
`frontend/dist/`.

### 4c. Never commit secrets to git

Add to `.gitignore`:
```gitignore
backend/.env
backend/data/
```

---

## 5. Backups (Crucial — Data Is Stored as JSON Files)

Your entire user/product/order data lives in `~/hobags/backend/data/`. Back these files up
regularly.

### 5a. Simple manual backup (tarball)

```bash
cd ~/hobags
tar -czf hobags-backup-$(date +%F).tar.gz backend/data backend/.env
```

This creates something like `hobags-backup-2026-08-29.tar.gz` in `~/hobags/`.

### 5b. Automated nightly backups with `cron`

Open the crontab for the `deploy` (or `root`) user:

```bash
crontab -e
```

Add a line to back up nightly at 02:00, keeping the last 14 backups:

```cron
0 2 * * * cd ~/hobags && tar -czf "/home/deploy/hobags/backups/hobags-$(date +\%F).tar.gz" backend/data backend/.env && ls -t /home/deploy/hobags/backups/*.tar.gz | tail -n +15 | xargs -r rm -f
```

- Create the `backups/` folder first:
  ```bash
  mkdir -p ~/hobags/backups
  ```
- Adjust the path `/home/deploy/...` to your user's home.
- This keeps the latest 14 daily backups and deletes older ones.

### 5c. Off-site copy (strongly recommended)

Download your backups to your PC periodically:

```powershell
scp deploy@YOUR_VPS_IP:~/hobags/backups/*.tar.gz "D:\HoBags-Backups\"
```

Or sync to a cloud bucket if you set one up.

> **Restore:** to restore, upload the backup and extract it back:
> ```bash
> tar -xzf BACKUP_FILE.tar.gz -C ~/hobags/
> pm2 restart hobags-backend
> ```

---

## 6. Malware Scanner (Optional)

Install and run a malware/vulnerability scanner:

```bash
sudo apt install -y clamav
sudo freshclam          # update virus definitions (first run takes a while)
sudo clamscan -r --bell -i /home/deploy/hobags
```

---

## 7. Common Security Checks List

Run these to review your setup:

```bash
# Open ports visible to the internet
sudo ufw status

# Listening sockets
sudo ss -tulpn | grep -E ':(22|80|443|3002)\b'

# Verify backend not publicly reachable (should fail from outside)
```

Expected: SSH(22), HTTP(80), HTTPS(443) open; backend(3002) bound but blocked publicly.

---

## 8. Troubleshooting Security

| Symptom | Cause / Fix |
|---------|-------------|
| SSH connection suddenly refused | You locked it with wrong settings — reconnect via Hostinger web console and fix |
| Site still works but `3002` is open | Firewall not enabled — re-run `sudo ufw enable` |
| Backups missing | Confirm `crontab -e` line and `mkdir -p ~/hobags/backups`; check `ls ~/hobags/backups` |
| Backend calls fail after firewall | They still work locally via localhost; external clients must use `https://yourdomain.com/api` |
| Can't reach site at all | Port 80/443 not allowed — `sudo ufw allow 80/tcp`, `sudo ufw allow 443/tcp` |

---

Everything is deployed and secured. Final step — verify the whole stack and fix any issues:

➡️ **[08 - Verify & Troubleshoot](08-Verify-and-Troubleshoot.md)**
