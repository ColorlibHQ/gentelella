#!/usr/bin/env bash
# scripts/deploy-preview.sh
#
# Build + deploy the rc.1 preview to R2 with proper per-file cache headers.
#
# Why this is more than `rclone sync`: Cloudflare edge cache + R2's defaults
# aggressively cache HTML at the edge for 30 days. Our HTML references
# content-hashed JS/CSS that rclone sync deletes on each redeploy. Stale HTML
# at the edge → 404 on the freshly-renamed asset.
#
# Strategy — two passes with different Cache-Control headers:
#   1. Hashed assets (js/, assets/, images/, fonts/) → long immutable cache
#   2. Mutable files (*.html, sw.js, site.webmanifest) → no edge cache
# `--ignore-times` on pass 2 forces re-upload even if the file's content is
# unchanged, so the Cache-Control header is rewritten on every deploy.
#
# After both passes: optionally purge the Cloudflare edge cache for the path
# (set CF_API_TOKEN + CF_ZONE_ID to enable). Without that, browsers may still
# see stale content for up to whatever TTL CF was applying — purge manually
# from the dashboard.
#
# Usage:
#   npm run deploy:preview

set -euo pipefail

SLUG="${PREVIEW_SLUG:-gentelella}"
BUCKET="r2pro:colorlib-preview/theme/$SLUG"

echo "→ Building with BASE_PATH=/theme/$SLUG/"
BASE_PATH="/theme/$SLUG/" npm run build

# Strip dev artifacts.
rm -f dist/stats.html

# Root redirect so the bare slug URL navigates to the dashboard.
cat > dist/index.html <<'EOF'
<!DOCTYPE html>
<meta http-equiv="refresh" content="0;url=production/index.html">
<link rel="canonical" href="production/index.html">
<title>Gentelella v4</title>
EOF

LONG_CACHE='Cache-Control: public, max-age=31536000, immutable'
SHORT_CACHE='Cache-Control: public, max-age=60, must-revalidate'
NO_CACHE='Cache-Control: no-cache, no-store, must-revalidate'

echo ""
echo "→ Pass 1/3: sync hashed assets with long-cache (prunes orphans)"
# rclone sync handles deletes for the whole tree; we set the long-cache
# header for everything. Pass 2 will overwrite mutable files with shorter cache.
rclone sync dist/ "$BUCKET/" \
  --header-upload "$LONG_CACHE" \
  --progress

echo ""
echo "→ Pass 2/3: re-upload HTML pages with short cache"
# `--ignore-times` forces re-upload (and thus header rewrite) even when
# content matches — necessary because rclone otherwise skips identical files.
rclone copy dist/ "$BUCKET/" \
  --include "*.html" \
  --header-upload "$SHORT_CACHE" \
  --ignore-times \
  --progress

echo ""
echo "→ Pass 3/3: re-upload service worker + manifest (no cache)"
rclone copyto dist/sw.js "$BUCKET/sw.js" \
  --header-upload "$NO_CACHE" \
  --ignore-times
rclone copyto dist/site.webmanifest "$BUCKET/site.webmanifest" \
  --header-upload "$NO_CACHE" \
  --ignore-times

# Optional: purge Cloudflare cache for this path. Token needs
# Zone:Cache Purge permission on the colorlib.com zone.
if [ -n "${CF_API_TOKEN:-}" ] && [ -n "${CF_ZONE_ID:-}" ]; then
  echo ""
  echo "→ Purging Cloudflare cache for preview.colorlib.com/theme/$SLUG/*"
  curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{\"prefixes\":[\"preview.colorlib.com/theme/$SLUG/\"]}" \
    | grep -oE '"success":[a-z]+' || true
else
  echo ""
  echo "ℹ  Skipped Cloudflare cache purge (CF_API_TOKEN / CF_ZONE_ID not set)."
  echo "   To purge manually now:"
  echo "     dash.cloudflare.com → colorlib.com → Caching → Configuration"
  echo "     → Custom Purge → URL → paste 'preview.colorlib.com/theme/$SLUG/*'"
  echo ""
  echo "   To automate, add to your shell:"
  echo "     export CF_API_TOKEN=…    # zone:cache-purge permission"
  echo "     export CF_ZONE_ID=…      # the colorlib.com zone ID"
fi

echo ""
echo "✓ https://preview.colorlib.com/theme/$SLUG/"
