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

echo "🔍 Checking Security Rules..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
manual_rule "SEC-H101" "🟠 Enforce MFA on sensitive tables via restrictive policies" ""
manual_rule "SEC-H102" "🟠 Filter multi-tenant access by SSO provider/team" ""
manual_rule "SEC-H103" "🟠 Middleware must use updateSession() helper" ""
manual_rule "SEC-L701" "🟢 Prefer view-based audits over direct table scans" ""
manual_rule "SEC-M301" "🟡 Handle Supabase errors explicitly, map to 401/403" ""
manual_rule "SEC-M302" "🟡 Validate mutations with Zod before writes" ""
manual_rule "SEC-P001" "🔴 Always call verifySession() or getUser() before data access" ""
manual_rule "SEC-P002" "🔴 Use role helpers (requireRole, requireAnyRole) before Supabase" ""
manual_rule "SEC-P003" "🔴 RLS policies must wrap auth.uid() in SELECT" ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ $VIOLATIONS_FOUND -gt 0 ]]; then
  echo "❌ Found $VIOLATIONS_FOUND violation(s)"
  exit 1
else
  echo "✅ All rules passed!"
  exit 0
fi
