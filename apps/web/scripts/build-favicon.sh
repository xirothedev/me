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

# Scale the supplied image and cut to a circle.
magick "$source_asset" -resize 512x512^ -gravity center -extent 512x512 \
  \( +clone -threshold -1 -negate -fill white -draw "circle 256,256 256,0" \) \
  -alpha off -compose copy_opacity -composite -strip "$tmp/mark.png"

magick "$tmp/mark.png" -resize 192x192 -strip "$output_png"
magick "$tmp/mark.png" -resize 180x180 -strip "$output_apple"

for size in 16 32 48 64; do
  magick "$tmp/mark.png" -resize "${size}x${size}" \
    -unsharp 0x0.75+0.75+0.008 -strip "$tmp/icon-$size.png"
done

magick "$tmp/icon-16.png" "$tmp/icon-32.png" "$tmp/icon-48.png" "$tmp/icon-64.png" "$output_ico"

echo "Wrote $output_ico, $output_png, $output_apple"
