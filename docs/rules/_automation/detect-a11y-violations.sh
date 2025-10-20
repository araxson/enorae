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

echo "🔍 Checking Accessibility Rules..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
manual_rule "A11Y-H101" "🟠 Provide aria-label for grouped controls" ""
manual_rule "A11Y-H102" "🟠 Enable accessibilityLayer on chart components" ""
manual_rule "A11Y-H103" "🟠 Wrap related fields in FieldSet + FieldLegend" ""
manual_rule "A11Y-L701" "🟢 Provide descriptive Suspense fallbacks" ""
manual_rule "A11Y-M301" "🟡 Use Form, FormField, FormItem primitives" ""
manual_rule "A11Y-M302" "🟡 Input OTP uses new composition pattern" ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo "❌ Found $VIOLATIONS_FOUND violation(s)"
  exit 1
else
  echo "✅ All rules passed!"
  exit 0
fi
