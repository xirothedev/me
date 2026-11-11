#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

source_asset="assets/hero/nha-trang.png"
output="public/media/hero/nha-trang.webp"

if ! command -v cwebp >/dev/null 2>&1; then
  echo "cwebp is required. Install it with: brew install webp" >&2
  exit 1
fi

cwebp -quiet -q 86 -m 6 -mt "$source_asset" -o "$output"
echo "Wrote $output"
