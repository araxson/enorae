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

echo "🔍 Checking UI Rules..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
manual_rule "UI-H101" "🟠 Define custom styles with @utility not @layer" ""
manual_rule "UI-H102" "🟠 ONLY use color tokens from globals.css (34 total) - never arbitrary Tailwind colors" ""
manual_rule "UI-H103" "🟠 Provide aria-label on grouped controls" ""
manual_rule "UI-L701" "🟢 Refactor :root colors to hsl() with @theme inline" ""
manual_rule "UI-M301" "🟡 Use named container queries" ""
manual_rule "UI-M302" "🟡 Charts include accessibilityLayer prop" ""
manual_rule "UI-P001" "🔴 Render text via shadcn primitives or semantic tokens (no typography imports)" ""
manual_rule "UI-P002" "🔴 shadcn/ui compositions must include required subcomponents" ""
manual_rule "UI-P003" "🔴 ONLY use shadcn/ui components (no custom UI primitives)" ""
check_rg "UI-P004" "🔴 Remove `@/components/ui/typography` usage; rely on component slots" "rg \"from '@/components/ui/typography'\" --glob '!docs/**' --glob '!components/ui/**'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo "❌ Found $VIOLATIONS_FOUND violation(s)"
  exit 1
else
  echo "✅ All rules passed!"
  exit 0
fi
