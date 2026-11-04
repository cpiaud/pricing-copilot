#!/usr/bin/env bash
# Refreshes Copilot pricing (GitHub doc) then model scores (Artificial Analysis), then checks release dates.
# Pricing runs first: update-scores.mjs reads data/models.csv.
set -euo pipefail
# --use-system-ca: trust the macOS keychain (TLS-inspecting proxies use a root CA Node does not bundle).
cd "$(dirname "$0")"

echo "→ Copilot pricing"
node --use-system-ca scripts/update-pricing.mjs

echo "→ Artificial Analysis scores"
if [ -f .env ]; then
  node --use-system-ca --env-file=.env scripts/update-scores.mjs
else
  node --use-system-ca scripts/update-scores.mjs # key may come from the environment
fi

echo "→ Release dates"
node --use-system-ca scripts/check-release-dates.mjs
