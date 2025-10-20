#!/bin/bash
# Auto-generated dispatcher that runs all domain rule checks
# Generated on $(date +"%Y-%m-%d")

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SCRIPTS=(
  "$SCRIPT_DIR/detect-a11y-violations.sh"
  "$SCRIPT_DIR/detect-arch-violations.sh"
  "$SCRIPT_DIR/detect-db-violations.sh"
  "$SCRIPT_DIR/detect-next-violations.sh"
  "$SCRIPT_DIR/detect-perf-violations.sh"
  "$SCRIPT_DIR/detect-react-violations.sh"
  "$SCRIPT_DIR/detect-sec-violations.sh"
  "$SCRIPT_DIR/detect-ts-violations.sh"
  "$SCRIPT_DIR/detect-ui-violations.sh"
)

FAILED=0

for script in "${SCRIPTS[@]}"; do
  echo ""
  echo "🚀 Running $(basename "$script")"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if ! "$script"; then
    FAILED=1
  fi
done

exit $FAILED
