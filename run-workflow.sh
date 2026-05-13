#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 --mm_version=<tag> --mm_api_version=<tag> [options]"
  echo ""
  echo "  --mm_version=<tag>         Motion Master image tag, e.g. v5.4.1-flatbot.19"
  echo "  --mm_api_version=<tag>     Motion Master API image tag, e.g. v0.0.396"
  echo "  --file_filter=<pattern>    File path pattern passed to vitest (e.g. integro)"
  echo "  --test_name_filter=<name>  Test name pattern passed to vitest -t (e.g. offset)"
  echo "  --stream_api_logs=<bool>   Stream motion-master-api logs (default: true)"
  echo "  --stream_mm_logs=<bool>    Stream motion-master logs (default: false)"
  exit 1
}

MM_VERSION=""
MM_API_VERSION=""
FILE_FILTER=""
TEST_NAME_FILTER=""
STREAM_API_LOGS=""
STREAM_MM_LOGS=""

for arg in "$@"; do
  case "$arg" in
    --mm_version=*)       MM_VERSION="${arg#*=}" ;;
    --mm_api_version=*)   MM_API_VERSION="${arg#*=}" ;;
    --file_filter=*)      FILE_FILTER="${arg#*=}" ;;
    --test_name_filter=*) TEST_NAME_FILTER="${arg#*=}" ;;
    --stream_api_logs=*)  STREAM_API_LOGS="${arg#*=}" ;;
    --stream_mm_logs=*)   STREAM_MM_LOGS="${arg#*=}" ;;
    *) echo "Unknown argument: $arg"; usage ;;
  esac
done

[[ -z "$MM_VERSION" || -z "$MM_API_VERSION" ]] && usage

FIELDS=(
  --field "mm_version=${MM_VERSION}"
  --field "mm_api_version=${MM_API_VERSION}"
)

[[ -n "$FILE_FILTER" ]]      && FIELDS+=(--field "file_filter=${FILE_FILTER}")
[[ -n "$TEST_NAME_FILTER" ]] && FIELDS+=(--field "test_name_filter=${TEST_NAME_FILTER}")
[[ -n "$STREAM_API_LOGS" ]]  && FIELDS+=(--field "stream_api_logs=${STREAM_API_LOGS}")
[[ -n "$STREAM_MM_LOGS" ]]   && FIELDS+=(--field "stream_mm_logs=${STREAM_MM_LOGS}")

gh workflow run test.yml "${FIELDS[@]}"
echo "Triggered: MM=${MM_VERSION} API=${MM_API_VERSION}${FILE_FILTER:+ file=${FILE_FILTER}}${TEST_NAME_FILTER:+ name=${TEST_NAME_FILTER}}${STREAM_API_LOGS:+ stream_api_logs=${STREAM_API_LOGS}}${STREAM_MM_LOGS:+ stream_mm_logs=${STREAM_MM_LOGS}}"

sleep 3
RUN_ID=$(gh run list --workflow=test.yml --limit=1 --json databaseId --jq '.[0].databaseId')
echo "Watching run ${RUN_ID}..."
gh run watch "$RUN_ID" --exit-status
