"""One-shot: install local SSH public key onto the VPS using password auth.

After this runs, ssh root@<host> works without a password.
"""
import os
import sys
from pathlib import Path

import paramiko

HOST = os.environ["VPS_IP"]
USER = "root"
PASSWORD = os.environ["VPS_PASSWORD"]
PUBKEY = Path.home().joinpath(".ssh", "id_ed25519.pub").read_text().strip()

print(f"Connecting to {USER}@{HOST} ...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, timeout=30, allow_agent=False, look_for_keys=False)
print("[OK] password auth")

cmd = (
    'mkdir -p ~/.ssh && chmod 700 ~/.ssh && '
    'touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && '
    f'grep -qxF "{PUBKEY}" ~/.ssh/authorized_keys || echo "{PUBKEY}" >> ~/.ssh/authorized_keys && '
    'echo INSTALLED'
)
stdin, stdout, stderr = client.exec_command(cmd)
out = stdout.read().decode().strip()
err = stderr.read().decode().strip()
if "INSTALLED" not in out:
    print("[FAIL] could not install key", file=sys.stderr)
    print("stdout:", out, file=sys.stderr)
    print("stderr:", err, file=sys.stderr)
    sys.exit(1)
print("[OK] public key installed in /root/.ssh/authorized_keys")
client.close()
