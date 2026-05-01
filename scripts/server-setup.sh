#!/usr/bin/env bash
# server-setup.sh — provisions a fresh Ubuntu 22.04 / 24.04 VPS for Petravex.
# Run ONCE on the VPS as root after the OS is installed.
#
# Usage (on the VPS):
#   ACME_EMAIL="you@example.com" bash server-setup.sh
#
# What it does (idempotent — safe to re-run):
#   1. Updates the system, removes any old/conflicting Docker packages.
#   2. Wipes any existing containers/images/volumes ("clean slate" per user request).
#   3. Installs Docker Engine + Compose plugin from Docker's official repo.
#   4. Configures UFW firewall (allows 22, 80, 443 only).
#   5. Sets up unattended-security-upgrades.
#   6. Creates 2 GB swapfile if missing (helps Next build on small VPS).
#   7. Creates the external `traefik` Docker network.
#   8. Brings up Traefik (HTTPS reverse proxy + Let's Encrypt).
#
# After this, run deploy.sh from your local machine to ship the app.

set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "This script must run as root. Try: sudo bash server-setup.sh" >&2
  exit 1
fi

: "${ACME_EMAIL:?Set ACME_EMAIL env var (used for Let's Encrypt registration)}"

log() { printf '\n\033[1;36m▸ %s\033[0m\n' "$*"; }

# --------------------------------------------------------------------------
log "1/8  System update"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y

# --------------------------------------------------------------------------
log "2/8  Wiping any existing Docker state (clean slate)"
if command -v docker >/dev/null 2>&1; then
  docker ps -aq | xargs -r docker rm -f || true
  docker volume ls -q | xargs -r docker volume rm -f || true
  docker network ls --filter type=custom -q | xargs -r docker network rm || true
  systemctl stop docker || true
fi
apt-get remove -y docker docker-engine docker.io containerd runc docker-compose || true
rm -rf /var/lib/docker /var/lib/containerd /etc/docker

# --------------------------------------------------------------------------
log "3/8  Installing Docker Engine + Compose plugin"
apt-get install -y ca-certificates curl gnupg lsb-release ufw
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${VERSION_CODENAME}") stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

# --------------------------------------------------------------------------
log "4/8  Firewall (UFW): allow 22, 80, 443"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# --------------------------------------------------------------------------
log "5/8  Unattended security upgrades"
apt-get install -y unattended-upgrades
dpkg-reconfigure -f noninteractive unattended-upgrades

# --------------------------------------------------------------------------
log "6/8  Swap (2 GB if missing)"
if ! swapon --show | grep -q '/swapfile'; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
  echo "Swap created."
else
  echo "Swap already present, skipping."
fi

# --------------------------------------------------------------------------
log "7/8  Creating external 'traefik' Docker network"
docker network inspect traefik >/dev/null 2>&1 || docker network create traefik

# --------------------------------------------------------------------------
log "8/8  Bringing up Traefik (Let's Encrypt: ${ACME_EMAIL})"
mkdir -p /opt/traefik
# This script is colocated with infra/traefik/docker-compose.yml at deploy time,
# so we copy that compose into /opt/traefik on the server. (deploy.sh handles the rsync.)
if [[ -f /root/petravex/infra/traefik/docker-compose.yml ]]; then
  cp /root/petravex/infra/traefik/docker-compose.yml /opt/traefik/docker-compose.yml
  cat > /opt/traefik/.env <<EOF
ACME_EMAIL=${ACME_EMAIL}
EOF
  cd /opt/traefik
  docker compose --env-file .env up -d
  echo "✓ Traefik up."
else
  echo "⚠ /root/petravex/infra/traefik/docker-compose.yml not found yet."
  echo "  Run deploy.sh from your local machine first; this script will be re-run automatically."
fi

# --------------------------------------------------------------------------
log "Done. VPS is provisioned."
echo
echo "Next: from your LOCAL machine, run scripts/deploy.sh to ship the app."
