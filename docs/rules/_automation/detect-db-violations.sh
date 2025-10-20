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

echo "🔍 Checking Database Rules..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
manual_rule "DB-H101" "🟠 Policy checks use auth.jwt() and wrap auth.uid() in select" ""
manual_rule "DB-H102" "🟠 Enforce MFA (aal2) on sensitive tables" ""
manual_rule "DB-H103" "🟠 Call revalidatePath after mutations" ""
manual_rule "DB-L701" "🟢 Prefer select/filter over RPC for simple queries" ""
manual_rule "DB-M301" "🟡 Use .returns<Type>() or .maybeSingle<Type>()" ""
manual_rule "DB-M302" "🟡 Validate payloads with Zod before mutations" ""
manual_rule "DB-P001" "🔴 Read from public views, write to schema tables" ""
manual_rule "DB-P002" "🔴 Auth verification required in every function" ""
manual_rule "DB-P003" "🔴 Multi-tenant RLS must enforce tenant scope" ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo "❌ Found $VIOLATIONS_FOUND violation(s)"
  exit 1
else
  echo "✅ All rules passed!"
  exit 0
fi
