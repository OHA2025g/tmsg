#!/bin/sh
set -eu

cd /app

marker=".wrangler/state/.tmsg-schema-applied"
if [ ! -f "$marker" ]; then
  mkdir -p .wrangler/state
  pnpm exec wrangler d1 execute DB --local \
    --config dist/server/wrangler.json \
    --persist-to .wrangler/state \
    --file drizzle/0000_enquiries.sql
  touch "$marker"
fi

exec node --import ./scripts/sites-env.mjs \
  ./node_modules/wrangler/bin/wrangler.js dev \
  --config dist/server/wrangler.json \
  --local \
  --persist-to .wrangler/state \
  --ip 0.0.0.0 \
  --port 8787 \
  --inspector-port 0
