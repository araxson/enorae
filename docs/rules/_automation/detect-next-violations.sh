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

echo "🔍 Checking Next.js Rules..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
manual_rule "NEXT-H101" "🟠 Wrap Web Vitals in dedicated 'use client' component" ""
manual_rule "NEXT-H102" "🟠 Use GoogleTagManager from @next/third-parties" ""
manual_rule "NEXT-L701" "🟢 Use Promise.all for independent fetches" ""
manual_rule "NEXT-M301" "🟡 Keep pages ultra-thin (5-15 lines)" ""
manual_rule "NEXT-M302" "🟡 Use container queries for responsive layouts" ""
manual_rule "NEXT-P001" "🔴 Scripts load from app/layout.tsx using next/script" ""
manual_rule "NEXT-P002" "🔴 Import global styles only from app/layout.tsx" ""
manual_rule "NEXT-P003" "🔴 Never use getInitialProps or Pages Router helpers" ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo "❌ Found $VIOLATIONS_FOUND violation(s)"
  exit 1
else
  echo "✅ All rules passed!"
  exit 0
fi
