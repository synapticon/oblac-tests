#!/usr/bin/env bash
cd "$(dirname "$0")/ansible" || exit 1
sudo -E ansible-playbook site.yml -e "target_user=$USER" -e "target_home=$HOME"
