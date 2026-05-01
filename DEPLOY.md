# Petravex — Deployment

One-command deploy to a fresh VPS. Stack: Docker + Traefik + Let's Encrypt.

---

## Prereqs (one-time)

1. **A VPS** — Ubuntu 22.04 or 24.04, 2+ GB RAM. Recommended: Hetzner CX22 (€4.51/mo, Frankfurt).
2. **An SSH key on your local machine** that the VPS accepts (paste your `~/.ssh/id_ed25519.pub` when creating the VPS).
3. **DNS** — point the temporary domain at the VPS:
   - `visualizuae.com`        →  A record  →  VPS IP
   - `www.visualizuae.com`    →  A record  →  VPS IP

   Wait until DNS resolves (`nslookup visualizuae.com` returns the VPS IP) **before** running deploy. Let's Encrypt needs DNS to issue the cert.

---

## Deploy (one command)

From the project root, on your **local** machine (Git Bash on Windows, or any unix shell):

```bash
VPS_HOST=root@YOUR.VPS.IP \
ACME_EMAIL="you@example.com" \
bash scripts/deploy.sh
```

That's it. The script:
1. rsyncs the project to `/root/petravex` on the VPS.
2. Runs `server-setup.sh` on the VPS (Docker + UFW + 2 GB swap + Traefik with Let's Encrypt).
3. Builds the Docker image and starts the petravex container.
4. Waits for the container to become healthy.

When it finishes, the site is live at `https://visualizuae.com`.

---

## Re-deploy after code changes

Once the VPS is provisioned, skip step 2:

```bash
SKIP_PROVISION=1 VPS_HOST=root@YOUR.VPS.IP bash scripts/deploy.sh
```

---

## Operations

| Task | Command |
|---|---|
| Tail logs | `ssh root@VPS 'docker logs -f petravex'` |
| Restart | `ssh root@VPS 'cd /root/petravex && docker compose restart'` |
| Stop | `ssh root@VPS 'cd /root/petravex && docker compose down'` |
| Free disk | `ssh root@VPS 'docker system prune -af'` |
| Traefik logs | `ssh root@VPS 'docker logs -f traefik'` |

---

## Switching domain (visualizuae → petravex.com)

When the real domain is ready:
1. Edit `docker-compose.yml` — replace `visualizuae.com` with `petravex.com` (4 places).
2. Point DNS for `petravex.com` and `www.petravex.com` at the VPS IP.
3. Re-deploy: `SKIP_PROVISION=1 VPS_HOST=root@VPS bash scripts/deploy.sh`

---

## Troubleshooting

**Cert not issuing?** Check DNS resolves to the VPS first. Then:
```bash
ssh root@VPS 'docker logs traefik 2>&1 | grep -i acme'
```

**Container unhealthy?**
```bash
ssh root@VPS 'docker logs --tail 200 petravex'
```

**Port 80/443 blocked?** UFW status:
```bash
ssh root@VPS 'ufw status'
```
