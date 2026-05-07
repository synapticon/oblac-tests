#!/usr/bin/env bash
read -r -s -p "BECOME password (sudo): " ANSIBLE_BECOME_PASS
echo
export ANSIBLE_BECOME_PASS
cd "$(dirname "$0")/ansible" || exit 1
ansible-playbook site.yml
