#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <mm_version> <mm_api_version> [test_filter]"
  echo ""
  echo "  mm_version      Motion Master image tag, e.g. v5.4.1-flatbot.18"
  echo "  mm_api_version  Motion Master API image tag, e.g. v0.0.390"
  echo "  test_filter     Optional test file/pattern passed to vitest"
  exit 1
}

[[ $# -lt 2 ]] && usage

MM_VERSION="$1"
MM_API_VERSION="$2"
TEST_FILTER="${3:-}"

FIELDS=(
  --field "mm_version=${MM_VERSION}"
  --field "mm_api_version=${MM_API_VERSION}"
)

if [[ -n "$TEST_FILTER" ]]; then
  FIELDS+=(--field "test_filter=${TEST_FILTER}")
fi

gh workflow run test.yml "${FIELDS[@]}"
echo "Triggered: MM=${MM_VERSION} API=${MM_API_VERSION}${TEST_FILTER:+ filter=${TEST_FILTER}}"

sleep 3
RUN_ID=$(gh run list --workflow=test.yml --limit=1 --json databaseId --jq '.[0].databaseId')
echo "Watching run ${RUN_ID}..."
gh run watch "$RUN_ID" --exit-status
