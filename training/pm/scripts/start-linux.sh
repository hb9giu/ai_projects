#!/usr/bin/env bash
set -euo pipefail

APP_NAME="pm-app"
IMAGE_NAME="pm-app"
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)

docker build -t "$IMAGE_NAME" "$ROOT_DIR"

docker rm -f "$APP_NAME" >/dev/null 2>&1 || true

docker run -d \
  --name "$APP_NAME" \
  --env-file "$ROOT_DIR/.env" \
  -p 8000:8000 \
  --read-only \
  --tmpfs /tmp \
  -v pm-data:/app/backend/data \
  "$IMAGE_NAME"

echo "Waiting for server to be ready..."
until curl -sf http://localhost:8000/health >/dev/null 2>&1; do
  sleep 1
done
echo "Server is ready at http://localhost:8000"
