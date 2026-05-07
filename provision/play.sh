#!/usr/bin/env bash
cd "$(dirname "$0")/ansible" || exit 1
ansible-playbook site.yml --ask-become-pass
