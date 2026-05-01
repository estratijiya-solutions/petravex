#!/usr/bin/env bash
# deploy.sh — ships the Petravex site to your VPS in one command.
# Run from your LOCAL machine (Git Bash on Windows, or any unix shell).
#
# Usage:
#   VPS_HOST=root@1.2.3.4 ACME_EMAIL="you@example.com" bash scripts/deploy.sh
#
# Optional:
#   VPS_HOST           ssh target, e.g. root@1.2.3.4         (REQUIRED)
#   ACME_EMAIL         Let's Encrypt registration email      (REQUIRED on first run)
#   REMOTE_DIR         remote path                            (default: /root/petravex)
#   SKIP_PROVISION=1   skip running server-setup.sh           (use after first run)
#
# What it does:
#   1. rsyncs the project to the VPS (excludes node_modules, .next, .git).
#   2. On first run (or when SKIP_PROVISION is unset): runs server-setup.sh remotely.
#   3. Builds the Docker image and brings up the petravex stack.
#   4. Waits for the container to become healthy and prints the public URL.

set -euo pipefail

: "${VPS_HOST:?Set VPS_HOST, e.g. VPS_HOST=root@1.2.3.4}"
REMOTE_DIR="${REMOTE_DIR:-/root/petravex}"

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${PROJECT_ROOT}"

log() { printf '\n\033[1;36m▸ %s\033[0m\n' "$*"; }

# --------------------------------------------------------------------------
log "1/4  Sync project → ${VPS_HOST}:${REMOTE_DIR}"
ssh -o StrictHostKeyChecking=accept-new "${VPS_HOST}" "mkdir -p ${REMOTE_DIR}"
rsync -az --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'out' \
  --exclude '.vercel' \
  --exclude '.claude' \
  --exclude '.deploy' \
  --exclude '*.log' \
  --exclude '.env*.local' \
  ./ "${VPS_HOST}:${REMOTE_DIR}/"

# --------------------------------------------------------------------------
if [[ -z "${SKIP_PROVISION:-}" ]]; then
  : "${ACME_EMAIL:?Set ACME_EMAIL on first run (Let's Encrypt registration)}"
  log "2/4  Provision VPS (Docker + Traefik + firewall)"
  ssh "${VPS_HOST}" "ACME_EMAIL='${ACME_EMAIL}' bash ${REMOTE_DIR}/scripts/server-setup.sh"
else
  log "2/4  Skipping provision (SKIP_PROVISION set)"
fi

# --------------------------------------------------------------------------
log "3/4  Build & start petravex container"
ssh "${VPS_HOST}" "cd ${REMOTE_DIR} && docker compose pull --ignore-pull-failures || true && docker compose build && docker compose up -d"

# --------------------------------------------------------------------------
log "4/4  Wait for healthy"
ssh "${VPS_HOST}" '
  for i in $(seq 1 30); do
    status=$(docker inspect -f "{{.State.Health.Status}}" petravex 2>/dev/null || echo "missing")
    if [[ "$status" == "healthy" ]]; then
      echo "✓ Healthy"
      break
    fi
    echo "  [$i/30] status=$status, retrying in 3s..."
    sleep 3
  done
  if [[ "$status" != "healthy" ]]; then
    echo "✗ Container never went healthy. Recent logs:"
    docker logs --tail 80 petravex
    exit 1
  fi
'

echo
echo "──────────────────────────────────────────────────────────────"
echo "✓ Deploy complete."
echo "  https://visualizuae.com"
echo "  https://www.visualizuae.com"
echo
echo "  Logs:    ssh ${VPS_HOST} 'docker logs -f petravex'"
echo "  Re-run:  SKIP_PROVISION=1 VPS_HOST=${VPS_HOST} bash scripts/deploy.sh"
echo "──────────────────────────────────────────────────────────────"
