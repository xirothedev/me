#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

source_asset="assets/brand/favicon-source.jpg"
output_ico="public/favicon.ico"
output_png="public/favicon.png"
output_apple="public/apple-icon.png"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required. Install it with: brew install imagemagick" >&2
  exit 1
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# The full illustration turns into a blue blur at 16 px. Crop to the eye so
# the mark stays readable in a browser tab, then render each target size.
magick "$source_asset" -crop 220x220+190+90 +repage \
  -resize 512x512 -strip "$tmp/mark.png"

magick "$tmp/mark.png" -resize 192x192 -strip "$output_png"
magick "$tmp/mark.png" -resize 180x180 -strip "$output_apple"

for size in 16 32 48 64; do
  magick "$tmp/mark.png" -resize "${size}x${size}" \
    -unsharp 0x0.75+0.75+0.008 -strip "$tmp/icon-$size.png"
done

magick "$tmp/icon-16.png" "$tmp/icon-32.png" "$tmp/icon-48.png" "$tmp/icon-64.png" "$output_ico"

echo "Wrote $output_ico, $output_png, $output_apple"
