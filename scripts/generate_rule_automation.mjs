import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const rulesDir = path.join(repoRoot, 'docs', 'rules')
const automationDir = path.join(rulesDir, '_automation')

const metadata = JSON.parse(
  fs.readFileSync(path.join(rulesDir, '_meta', 'rules.json'), 'utf8'),
)

const domainNames = {
  UI: 'UI Rules',
  DB: 'Database Rules',
  ARCH: 'Architecture Rules',
  SEC: 'Security Rules',
  NEXT: 'Next.js Rules',
  REACT: 'React Rules',
  TS: 'TypeScript Rules',
  PERF: 'Performance Rules',
  A11Y: 'Accessibility Rules',
}

const iconBySeverity = {
  P: '🔴',
  H: '🟠',
  M: '🟡',
  L: '🟢',
}

const domainScripts = new Map()

for (const rule of metadata.rules) {
  const domain = rule.domain
  if (!domainScripts.has(domain)) {
    domainScripts.set(domain, [])
  }
  domainScripts.get(domain).push(rule)
}

const headerTemplate = `#!/bin/bash
# Auto-generated rules enforcement script
# Generated on $(date +"%Y-%m-%d")

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

VIOLATIONS_FOUND=0

check_rg() {
  local rule_id="$1"
  local description="$2"
  local command="$3"

  echo ""
  echo "📋 Checking \${rule_id}: \${description}..."
  if eval "\${command} -q" >/dev/null 2>&1; then
    echo "❌ \${rule_id} VIOLATION: \${description}"
    eval "\${command}" | sed 's/^/   - /'
    VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + 1))
  else
    echo "✅ \${rule_id}: Passed"
  fi
}

manual_rule() {
  local rule_id="$1"
  local description="$2"
  local hint="$3"

  echo ""
  echo "⚠️  \${rule_id}: Manual review required — \${description}"
  if [[ -n "$hint" ]]; then
    echo "   Hint: \${hint}"
  fi
}
`

const footerTemplate = `
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ \$VIOLATIONS_FOUND -gt 0 ]]; then
  echo "❌ Found \$VIOLATIONS_FOUND violation(s)"
  exit 1
else
  echo "✅ All rules passed!"
  exit 0
fi
`

function escapeDoubleQuotes(text) {
  return text.replace(/"/g, '\\"')
}

function buildRuleBlock(rule) {
  const description = `${iconBySeverity[rule.priority] || ''} ${rule.title}`.trim()
  const command = rule.detection?.command ?? ''
  const manual = rule.detection?.manual ?? true
  const hasPipeOperator =
    typeof command === 'string' &&
    command
      .split('')
      .some(
        (char, index, arr) =>
          char === '|' &&
          (arr[index - 1] === ' ' || arr[index + 1] === ' '),
      )
  const hasSimpleRg =
    !manual &&
    typeof command === 'string' &&
    command.trim().startsWith('rg ') &&
    !hasPipeOperator &&
    !/[;&$]/.test(command)

  if (hasSimpleRg) {
    return `check_rg "${rule.id}" "${escapeDoubleQuotes(
      description,
    )}" "${escapeDoubleQuotes(command.trim())}"`
  }

  const hint =
    command && !manual
      ? command.trim()
      : rule.detection?.regex || ''
  return `manual_rule "${rule.id}" "${escapeDoubleQuotes(
    description,
  )}" "${escapeDoubleQuotes(hint)}"`
}

for (const [domain, rules] of domainScripts.entries()) {
  const scriptLines = [headerTemplate]
  scriptLines.push(
    `echo "🔍 Checking ${domainNames[domain] ?? domain}..."`,
    'echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"',
  )

  const sortedRules = [...rules].sort((a, b) => a.id.localeCompare(b.id))
  for (const rule of sortedRules) {
    scriptLines.push(buildRuleBlock(rule))
  }

  scriptLines.push(footerTemplate)

  const scriptPath = path.join(
    automationDir,
    `detect-${domain.toLowerCase()}-violations.sh`,
  )
  fs.writeFileSync(scriptPath, scriptLines.join('\n'), 'utf8')
  fs.chmodSync(scriptPath, 0o755)
}

const detectAllContent = `#!/bin/bash
# Auto-generated dispatcher that runs all domain rule checks
# Generated on $(date +"%Y-%m-%d")

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

SCRIPTS=(
${Array.from(domainScripts.keys())
  .sort()
  .map(
    (code) =>
      `  "\$SCRIPT_DIR/detect-${code.toLowerCase()}-violations.sh"`,
  )
  .join('\n')}
)

FAILED=0

for script in "\${SCRIPTS[@]}"; do
  echo ""
  echo "🚀 Running $(basename "\$script")"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if ! "$script"; then
    FAILED=1
  fi
done

exit \$FAILED
`

const detectAllPath = path.join(automationDir, 'detect-all.sh')
fs.writeFileSync(detectAllPath, detectAllContent, 'utf8')
fs.chmodSync(detectAllPath, 0o755)
