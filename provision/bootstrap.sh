#!/usr/bin/env bash
set -euo pipefail

REPO="synapticon/oblac-tests"
CLONE_DIR="$HOME/github/synapticon/oblac-tests"

# --- OS detection ---

if [ -f /etc/os-release ]; then
    # shellcheck source=/dev/null
    . /etc/os-release
fi

if ! echo "${ID_LIKE:-${ID:-}}" | grep -qiE "debian|ubuntu"; then
    echo "[bootstrap] This script requires Ubuntu/Debian."
    exit 1
fi

# --- Install git + ansible ---

echo "[bootstrap] Installing git and ansible ..."
sudo apt-get update -qq
command -v git &>/dev/null || sudo apt-get install -y git
if ! command -v ansible-playbook &>/dev/null; then
    command -v pipx &>/dev/null || sudo apt-get install -y pipx
    pipx install ansible
    export PATH="$PATH:$HOME/.local/bin"
fi

# --- Clone repo ---

if [ -d "$CLONE_DIR/.git" ]; then
    echo "[bootstrap] Repo already cloned at $CLONE_DIR"
else
    mkdir -p "$(dirname "$CLONE_DIR")"
    echo "[bootstrap] Cloning $REPO ..."
    git clone "https://github.com/${REPO}.git" "$CLONE_DIR"
fi

# --- Run playbook ---

cd "$CLONE_DIR/provision/ansible"
echo ""
echo "[bootstrap] Running Ansible playbook ..."
echo "You will be prompted for your sudo password."
echo ""
ansible-playbook site.yml --ask-become-pass
