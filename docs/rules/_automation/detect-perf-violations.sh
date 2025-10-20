#!/bin/bash
# Auto-generated rules enforcement script
# Generated on $(date +"%Y-%m-%d")

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

VIOLATIONS_FOUND=0

check_rg() {
  local rule_id="$1"
  local description="$2"
  local command="$3"

  echo ""
  echo "📋 Checking ${rule_id}: ${description}..."
  if eval "${command} -q" >/dev/null 2>&1; then
    echo "❌ ${rule_id} VIOLATION: ${description}"
    eval "${command}" | sed 's/^/   - /'
    VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + 1))
  else
    echo "✅ ${rule_id}: Passed"
  fi
}

manual_rule() {
  local rule_id="$1"
  local description="$2"
  local hint="$3"

  echo ""
  echo "⚠️  ${rule_id}: Manual review required — ${description}"
  if [[ -n "$hint" ]]; then
    echo "   Hint: ${hint}"
  fi
}

echo "🔍 Checking Performance Rules..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
manual_rule "PERF-H101" "🟠 Add covering indexes for foreign keys" ""
manual_rule "PERF-H102" "🟠 Remove duplicate indexes" ""
manual_rule "PERF-L701" "🟢 Stream large assets at build time" ""
manual_rule "PERF-L702" "🟢 Use revalidatePath after mutations to prewarm caches" ""
manual_rule "PERF-M301" "🟡 Remove unused indexes" ""
manual_rule "PERF-M302" "🟡 Batch independent queries with Promise.all" ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo "❌ Found $VIOLATIONS_FOUND violation(s)"
  exit 1
else
  echo "✅ All rules passed!"
  exit 0
fi
