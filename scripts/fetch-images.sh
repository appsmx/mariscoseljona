#!/bin/bash
# Fetch all seafood images in parallel
set -e
cd /home/z/my-project/scripts

declare -A QUERIES=(
  [octopus]="fresh raw octopus tentacles on ice seafood"
  [oysters]="fresh raw oysters on ice half shell platter"
  [squid]="fresh squid calamar whole on ice market"
  [scallops]="fresh scallops on ice seafood market close up"
  [clams]="fresh clams on ice seafood market variety"
  [fish-market]="fresh fish variety display on ice market stall"
  [ocean-harbor]="fishing boats harbor sunset pacific mexico mazatlan"
  [fish-fillet]="fresh fish fillets salmon tuna on ice display"
  [seafood-platter]="seafood platter shrimp fish assorted fresh mexican"
  [delivery-truck]="refrigerated delivery truck seafood fresh cold chain"
)

for key in "${!QUERIES[@]}"; do
  query="${QUERIES[$key]}"
  outfile="img-${key}.json"
  echo "Fetching: $key -> $query"
  z-ai image-search -q "$query" -c 3 --gl us -o "$outfile" > /dev/null 2>&1 &
done

wait
echo "All done"
ls -la img-*.json
