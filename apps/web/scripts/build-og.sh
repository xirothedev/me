#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

source_asset="assets/og/nha-trang-landscape.png"
output="src/app/opengraph-image.jpg"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required. Install it with: brew install imagemagick" >&2
  exit 1
fi

if ! command -v fc-match >/dev/null 2>&1; then
  echo "fontconfig is required. Install it with: brew install fontconfig" >&2
  exit 1
fi

serif="$(fc-match -f '%{file}' 'Iowan Old Style')"
sans="$(fc-match -f '%{file}' 'Helvetica Neue')"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Render at 2x, then downscale. The source is 1536x1024; crop to the 1200:630
# ratio before resizing so the beach, park, road, and city all stay in frame.
magick "$source_asset" -crop 1536x806+0+109 +repage -resize 2400x1260! "$tmp/base.png"

# One linear scrim from the vertical middle to the bottom edge. It starts
# transparent and ends on the deep green, so the art stays visible above.
magick -size 2400x630 gradient:'#0B171200-#0B1712FF' "$tmp/scrim.png"
magick "$tmp/base.png" \
  "$tmp/scrim.png" -geometry +0+630 -compose over -composite \
  "$tmp/card.png"

magick -background none -fill '#f4efe4' -font "$serif" -pointsize 128 \
  label:'@xirothedev' -trim +repage "$tmp/handle.png"
magick -background none -fill '#cfdcd2' -font "$sans" -pointsize 54 \
  label:'AI Driven Software Engineer. Technical lead at The Resonance Team.' \
  -trim +repage "$tmp/tagline.png"
magick -size 280x3 xc:'#f4efe4' \
  -alpha set -channel A -evaluate set 50% +channel "$tmp/rule.png"

magick "$tmp/card.png" \
  "$tmp/handle.png" -geometry +128+920 -compose over -composite \
  "$tmp/rule.png" -geometry +128+1078 -compose over -composite \
  "$tmp/tagline.png" -geometry +128+1108 -compose over -composite \
  -resize 1200x630! -strip -quality 90 -sampling-factor 4:4:4 "$output"

echo "Wrote $output"
