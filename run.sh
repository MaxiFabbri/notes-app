#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo 'Docker was not found. Install Docker Engine/Desktop and Compose, then run this script again.' >&2
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo 'Docker Compose is unavailable. Install the Compose plugin or Docker Desktop.' >&2
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo 'Docker is not available. Start Docker Desktop/the Docker daemon and check your permissions.' >&2
  exit 1
fi

if [[ ! -e .env ]]; then
  if [[ ! -f .env.example ]]; then
    echo 'Missing .env.example. Run this script from a complete project checkout.' >&2
    exit 1
  fi
  # Hex characters avoid quoting issues. Never print the generated password.
  DB_SETUP_PASSWORD="$(od -An -N24 -tx1 /dev/urandom | tr -d ' \n')"
  if [[ ${#DB_SETUP_PASSWORD} -ne 48 ]]; then
    echo 'Could not generate the local database password.' >&2
    exit 1
  fi
  (
    umask 077
    set -o noclobber
    awk -v password="$DB_SETUP_PASSWORD" '
      /^DB_PASSWORD=/ { print "DB_PASSWORD=\"" password "\""; next }
      { print }
    ' .env.example > .env
  )
  unset DB_SETUP_PASSWORD
  echo 'Created local .env with a generated database password.'
else
  echo 'Using existing .env without changing it.'
fi

# Quiet validation avoids printing resolved environment variables or credentials.
docker compose config --quiet

echo 'Building and starting PostgreSQL, backend and frontend...'
if ! docker compose up -d --build --wait; then
  echo 'Startup failed. Check docker compose logs and verify that the configured ports are available.' >&2
  exit 1
fi

docker compose ps
WEB_ADDRESS="$(docker compose port frontend 80)"
echo "Application ready: http://${WEB_ADDRESS}"
echo 'Stop the application while preserving its data: docker compose stop'
