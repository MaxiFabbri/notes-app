#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PSQL_BIN="${PSQL_BIN:-psql}"

if ! command -v "$PSQL_BIN" >/dev/null 2>&1; then
  echo 'psql was not found. Install PostgreSQL and add its bin directory to PATH.' >&2
  exit 1
fi

# Optional arguments are forwarded to psql, for example: -h localhost -U postgres.
# Passwords are requested interactively, never stored here.
"$PSQL_BIN" -X -W -h localhost -p 5432 -U postgres "$@" -d postgres -v ON_ERROR_STOP=1 -f "$SCRIPT_DIR/setup-db.sql"
