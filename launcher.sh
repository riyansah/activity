#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"

if [ -x "$ROOT_DIR/.tools/node/bin/npm" ]; then
  export PATH="$ROOT_DIR/.tools/node/bin:$PATH"
elif command -v npm >/dev/null 2>&1; then
  :
else
  echo "npm tidak ditemukan di proyek ini."
  echo "Jalankan instalasi Node.js lokal ke .tools/node sebelum membuka dashboard."
  exit 1
fi

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  echo "node_modules belum ada. Menjalankan npm install..."
  npm install
elif [ "$ROOT_DIR/package-lock.json" -nt "$ROOT_DIR/node_modules" ]; then
  echo "package-lock.json lebih baru dari node_modules. Menjalankan npm install..."
  npm install
fi

echo "Menjalankan dashboard di http://$HOST:$PORT"
npm run dev -- --hostname "$HOST" --port "$PORT"
