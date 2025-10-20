import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const RULES_DIR = path.join(repoRoot, 'docs', 'rules')
const INDEX_PATH = path.join(RULES_DIR, '03-QUICK-SEARCH.md')
const CRITICAL_DIR = path.join(RULES_DIR, 'domains', 'critical')

const DOMAIN_CONFIGS = [
  {
    code: 'UI',
    name: 'User Interface',
    filename: 'ui.md',
    description: 'Rules for shadcn/ui primitives, design tokens, and slot-based typography.',
    automation: '_automation/detect-ui-violations.sh',
    related: ['A11Y', 'REACT'],
  },
  {
    code: 'DB',
    name: 'Database',
    filename: 'database.md',
    description: 'Rules for Supabase queries, views, migrations, and RLS enforcement.',
    automation: '_automation/detect-db-violations.sh',
    related: ['SEC', 'TS', 'ARCH'],
  },
  {
    code: 'ARCH',
    name: 'Architecture',
    filename: 'architecture.md',
    description: 'Rules for file structure, feature organization, and server directives.',
    automation: '_automation/detect-arch-violations.sh',
    related: ['DB', 'NEXT'],
  },
  {
    code: 'SEC',
    name: 'Security',
    filename: 'security.md',
    description: 'Rules for authentication, authorization, and multi-tenant protections.',
    automation: '_automation/detect-sec-violations.sh',
    related: ['DB', 'ARCH'],
  },
  {
    code: 'NEXT',
    name: 'Next.js',
    filename: 'nextjs.md',
    description: 'Rules for Next.js 15 App Router layouts, metadata, and routing.',
    automation: '_automation/detect-next-violations.sh',
    related: ['REACT', 'ARCH'],
  },
  {
    code: 'REACT',
    name: 'React',
    filename: 'react.md',
    description: 'Rules for React 19 Server/Client boundaries and async patterns.',
    automation: '_automation/detect-react-violations.sh',
    related: ['NEXT', 'UI'],
  },
  {
    code: 'TS',
    name: 'TypeScript',
    filename: 'typescript.md',
    description: 'Rules for TypeScript 5.9 strict typing, Supabase types, and safety.',
    automation: '_automation/detect-ts-violations.sh',
    related: ['DB', 'SEC'],
  },
  {
    code: 'PERF',
    name: 'Performance',
    filename: 'performance.md',
    description: 'Rules for runtime performance, caching strategies, and query optimization.',
    automation: '_automation/detect-perf-violations.sh',
    related: ['DB', 'NEXT'],
  },
  {
    code: 'A11Y',
    name: 'Accessibility',
    filename: 'accessibility.md',
    description: 'Rules for WCAG compliance, aria attributes, and assistive support.',
    automation: '_automation/detect-a11y-violations.sh',
    related: ['UI', 'REACT'],
  },
]

const domainPrinciples = {
  UI: [
    'Remove imports/usages of `@/components/ui/typography`; rely on typography baked into shadcn primitives (CardTitle, CardDescription, SidebarMenuButton, Badge, etc.). (`UI-P004`)',
    'Render plain text inside shadcn slots that already provide styling—no extra `<span>` wrappers or custom font classes unless strictly necessary. (`UI-P004`)',
    'When encountering ad-hoc text markup, refactor to the appropriate shadcn primitive; only fall back to semantic elements + design tokens if no primitive exists. (`UI-P004`)',
    'Preserve each component’s documented composition (Card → CardHeader → CardTitle → CardContent, DropdownMenu hierarchy, etc.) before considering custom styling. (`UI-P002`)',
    'Never introduce new primitives or edit `components/ui/*.tsx`; all changes occur in feature/layout code. (`UI-P003`)',
  ],
  DB: [
    'Reads query public views; writes target schema tables (DB-P001).',
    'Every data access verifies the authenticated user (DB-P002).',
    'RLS policies enforce tenant-scoped filters (DB-P003).',
  ],
  ARCH: [
    'Server modules declare `"server-only"` or `"use server"` as required (ARCH-P001).',
    'Pages stay ultra-thin and delegate to feature components (ARCH-P002).',
    'Shared utilities live under `lib/` by domain (ARCH-H101).',
  ],
  SEC: [
    'Always derive the Supabase user before touching data (SEC-P001).',
    'Use role helpers to gate privileged paths (SEC-P002).',
    'Wrap `auth.uid()` in sub-selects inside policies (SEC-P003).',
  ],
  NEXT: [
    'Load third-party scripts via `app/layout.tsx` using `<Script />` (NEXT-P001).',
    'Keep global CSS imports inside `app/layout.tsx` (NEXT-P002).',
    'Use App Router features exclusively—no legacy Pages Router helpers (NEXT-P003).',
  ],
  REACT: [
    'Server Components fetch data directly and hand off to clients (REACT-P001).',
    'Hoist data requirements to avoid client-side waterfalls (REACT-P002).',
    'Prefer React 19 async patterns and context shorthand (REACT-H101).',
  ],
  TS: [
    'Keep strict mode active—no `any`, no `@ts-ignore` (TS-P001).',
    'Leverage generated Supabase types for reads and writes (TS-M302).',
    'Prefer Zod and `unknown` for runtime validation (TS-L701).',
  ],
  PERF: [
    'Batch database queries and revalidate caches after mutations (PERF-H102).',
    'Monitor and prune unused indexes (PERF-M301).',
    'Stream heavy assets at build time (PERF-L701).',
  ],
  A11Y: [
    'Provide accessible names to grouped controls (A11Y-H101).',
    'Enable `accessibilityLayer` on charts (A11Y-H102).',
    'Use shadcn form primitives for labels, help text, and errors (A11Y-M301).',
  ],
}

const domainMistakes = {
  UI: [
    'Leaving imports/usages of `@/components/ui/typography` in features → [UI-P004](critical/UI-P004.md).',
    'Wrapping shadcn text slots in ad-hoc `<span>`/`<p>` with custom classes → [UI-P004](critical/UI-P004.md).',
    'Using manual markup instead of available shadcn primitives → [UI-P004](critical/UI-P004.md).',
    'Skipping required shadcn subcomponents (CardHeader, DialogHeader, etc.) → [UI-P002](critical/UI-P002.md).',
    'Editing `components/ui/*` or introducing bespoke primitives → [UI-P003](critical/UI-P003.md).',
  ],
  DB: [
    'Calling `.select()` on schema tables → [DB-P001](critical/DB-P001.md).',
    'Skipping Supabase auth verification → [DB-P002](critical/DB-P002.md).',
  ],
  ARCH: [
    'Missing `"server-only"` in `queries.ts` → [ARCH-P001](critical/ARCH-P001.md).',
    'Placing logic in `app/**/page.tsx` → [ARCH-P002](critical/ARCH-P002.md).',
  ],
  SEC: [
    'Trusting client claims instead of role helpers → [SEC-P002](critical/SEC-P002.md).',
    'Using bare `auth.uid()` inside policies → [SEC-P003](critical/SEC-P003.md).',
  ],
  NEXT: [
    'Adding scripts inside individual pages → [NEXT-P001](critical/NEXT-P001.md).',
    'Importing global CSS outside `app/layout.tsx` → [NEXT-P002](critical/NEXT-P002.md).',
  ],
  REACT: [
    'Fetching data from client components → [REACT-P001](critical/REACT-P001.md).',
    'Creating client waterfalls with nested effects → [REACT-P002](critical/REACT-P002.md).',
  ],
  TS: [
    'Falling back to `any` or `@ts-ignore` → [TS-P001](critical/TS-P001.md).',
    'Re-declaring reserved identifiers → [TS-P002](critical/TS-P002.md).',
  ],
  PERF: [
    'Leaving duplicate indexes → [PERF-H101](../03-QUICK-SEARCH.md#perf-h101).',
    'Forgetting to revalidate after mutations → [PERF-L702](../03-QUICK-SEARCH.md#perf-l702).',
  ],
  A11Y: [
    'Missing aria-label on grouped controls → [A11Y-H101](../03-QUICK-SEARCH.md#a11y-h101).',
    'Skipping descriptive Suspense fallbacks → [A11Y-L701](../03-QUICK-SEARCH.md#a11y-l701).',
  ],
}

const domainReferenceLinks = {
  UI: [
    { label: 'Color Tokens', link: '../reference/color-tokens.md' },
    { label: 'shadcn Components', link: '../reference/shadcn-components.md' },
  ],
  DB: [
    { label: 'Database Workflow', link: '../workflows/database-changes.md' },
    { label: 'Stack Versions', link: '../reference/stack-versions.md' },
  ],
  ARCH: [
    { label: 'New Feature Workflow', link: '../workflows/new-feature.md' },
    { label: 'Task Guide', link: '../04-TASK-GUIDE.md' },
  ],
  SEC: [
    { label: 'Security Notes', link: '../reference/exclusions.md' },
    { label: 'Database Rules', link: './database.md' },
  ],
  NEXT: [
    { label: 'Next.js Task Guide', link: '../04-TASK-GUIDE.md#nextjs' },
    { label: 'Performance Rules', link: './performance.md' },
  ],
  REACT: [
    { label: 'React Patterns', link: '../04-TASK-GUIDE.md#react' },
    { label: 'UI Rules', link: './ui.md' },
  ],
  TS: [
    { label: 'Type Generation', link: '../reference/stack-versions.md' },
    { label: 'Database Rules', link: './database.md' },
  ],
  PERF: [
    { label: 'Performance Checklist', link: '../workflows/debugging-checklist.md' },
    { label: 'Automation Script', link: '../_automation/detect-perf-violations.sh' },
  ],
  A11Y: [
    { label: 'UI Rules', link: './ui.md' },
    { label: 'Code Examples', link: '../reference/examples.md#a11y' },
  ],
}

const domainMap = DOMAIN_CONFIGS.reduce((acc, domain) => {
  acc[domain.code] = domain
  return acc
}, {})

const severityMap = {
  P: 'Critical',
  H: 'High',
  M: 'Medium',
  L: 'Low',
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-')
}

function parseIndex() {
  const content = fs.readFileSync(INDEX_PATH, 'utf8').split('\n')
  let currentSeverity = null
  let currentDomain = null
  const rules = new Map()

  const domainLookup = {
    UI: 'UI',
    'User Interface': 'UI',
    Database: 'DB',
    Architecture: 'ARCH',
    Security: 'SEC',
    'Next.js': 'NEXT',
    React: 'REACT',
    TypeScript: 'TS',
    Performance: 'PERF',
    Accessibility: 'A11Y',
  }

  for (const line of content) {
    const trimmed = line.trim()
    if (trimmed.startsWith('## ')) {
      if (trimmed.startsWith('## Critical')) currentSeverity = 'P'
      else if (trimmed.startsWith('## High')) currentSeverity = 'H'
      else if (trimmed.startsWith('## Medium')) currentSeverity = 'M'
      else if (trimmed.startsWith('## Low')) currentSeverity = 'L'
      continue
    }

    if (trimmed.startsWith('### ')) {
      const label = trimmed.replace(/^###\s*/, '')
      const match = label.match(/(.+?)(?:\s*\((\w+)\))?$/)
      if (match) {
        const [, name, code] = match
        currentDomain =
          code?.toUpperCase() ||
          domainLookup[name.trim()] ||
          domainLookup[name.trim().toUpperCase()]
      }
      continue
    }

    const ruleMatch = trimmed.match(
      /^-\s+\*\*\[([A-Z0-9-]+)\]\([^)]+\)\*\*\s*-\s*(.+)$/,
    )
    if (ruleMatch && currentSeverity && currentDomain) {
      const [, id, summaryRaw] = ruleMatch
      const summary = summaryRaw.replace(/\s+/g, ' ').trim()
      rules.set(id, {
        id,
        domain: currentDomain,
        severity: currentSeverity,
        title: summary,
        summary,
      })
    }
  }

  return rules
}

function parseCriticalRules() {
  const files = fs
    .readdirSync(CRITICAL_DIR)
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
  const data = new Map()

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(CRITICAL_DIR, file), 'utf8')
    const id = file.replace('.md', '')
    const patternMatch = content.match(/\*\*Pattern:\*\*\s*([\s\S]*?)(?:\n\n|\n---)/)
    const whyMatch = content.match(/\*\*Why:\*\*\s*([\s\S]*?)(?:\n\n|\n---)/)
    const detectionMatch = content.match(/\*\*Detection:\*\*\s*([\s\S]*?)(?:\n\n|\n---)/)

    let detectionCommand = null
    let detectionRegex = null
    let detectionManual = true

    if (detectionMatch) {
      const block = detectionMatch[1]
      const codeBlockMatch = block.match(/```[a-zA-Z]*\n([\s\S]*?)```/)
      if (codeBlockMatch) {
        const commands = codeBlockMatch[1]
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
        if (commands.length) {
          detectionCommand = commands[0]
          detectionManual = !detectionCommand.startsWith('rg ')
          if (/rg/.test(detectionCommand)) {
            const regexMatch =
              detectionCommand.match(/rg\s+["']([^"']+)["']/) ||
              detectionCommand.match(/rg\s+([^\s]+)/)
            if (regexMatch) detectionRegex = regexMatch[1]
          }
        }
      } else {
        detectionManual = true
      }
    }

    data.set(id, {
      id,
      pattern: patternMatch
        ? patternMatch[1].trim()
        : 'Refer to critical rule documentation.',
      why: whyMatch
        ? whyMatch[1].trim()
        : 'Refer to critical rule documentation.',
      detection: {
        command: detectionCommand,
        regex: detectionRegex,
        manual: detectionManual,
      },
    })
  })

  return data
}

function buildMetadata(ruleMap, criticalData) {
  const rules = []
  const severityTotals = { P: 0, H: 0, M: 0, L: 0 }
  for (const rule of ruleMap.values()) {
    const critical = criticalData.get(rule.id)
    const tags = new Set([rule.domain.toLowerCase()])
    rule.summary
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .forEach((word) => tags.add(word))

    const metadataRule = {
      id: rule.id,
      domain: rule.domain,
      severity: severityMap[rule.severity],
      priority: rule.severity,
      number: parseInt(rule.id.split('-')[1].replace(/[^\d]/g, ''), 10),
      title: rule.title,
      pattern: critical?.pattern || rule.summary,
      why:
        critical?.why ||
        'Follow the rule summary for rationale. Full details available via metadata.',
      auto_fixable: false,
      detection: critical?.detection || {
        command: null,
        regex: null,
        manual: true,
      },
      tags: Array.from(tags),
      related_rules: [],
      file: `domains/${domainMap[rule.domain].filename}`,
      section: `#${rule.id.toLowerCase()}`,
      statistics: {
        violations_found: 0,
        violations_fixed: 0,
        last_checked: null,
      },
    }
    rules.push(metadataRule)
    severityTotals[rule.severity] += 1
  }

  rules.sort((a, b) => a.id.localeCompare(b.id))

  const metadata = {
    metadata: {
      version: '1.0.0',
      last_updated: '2025-10-19',
      total_rules: rules.length,
      domains: DOMAIN_CONFIGS.map((domain) => domain.code),
    },
    rules,
  }

  fs.writeFileSync(
    path.join(RULES_DIR, '_meta', 'rules.json'),
    JSON.stringify(metadata, null, 2) + '\n',
  )

  const domainEntries = DOMAIN_CONFIGS.map((config) => {
    const domainRules = rules.filter((rule) => rule.domain === config.code)
    return {
      code: config.code,
      name: config.name,
      description: config.description,
      file: `domains/${config.filename}`,
      automation_script: config.automation,
      total_rules: domainRules.length,
      critical_count: domainRules.filter((rule) => rule.priority === 'P')
        .length,
      high_count: domainRules.filter((rule) => rule.priority === 'H').length,
      medium_count: domainRules.filter((rule) => rule.priority === 'M').length,
      low_count: domainRules.filter((rule) => rule.priority === 'L').length,
      related_domains: config.related,
    }
  })

  const severityLevels = [
    { code: 'P', name: 'Critical', range: '001-099', color: '🔴', total_count: severityTotals.P },
    { code: 'H', name: 'High', range: '100-299', color: '🟠', total_count: severityTotals.H },
    { code: 'M', name: 'Medium', range: '300-699', color: '🟡', total_count: severityTotals.M },
    { code: 'L', name: 'Low', range: '700-999', color: '🟢', total_count: severityTotals.L },
  ]

  fs.writeFileSync(
    path.join(RULES_DIR, '_meta', 'domains.json'),
    JSON.stringify(
      { domains: domainEntries, severity_levels: severityLevels },
      null,
      2,
    ) + '\n',
  )

  return rules
}

function buildCriticalFiles(ruleMap, metadataRules) {
  if (!fs.existsSync(CRITICAL_DIR)) {
    fs.mkdirSync(CRITICAL_DIR, { recursive: true })
  }

  // Remove existing rule files (keep README)
  fs.readdirSync(CRITICAL_DIR)
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .forEach((file) => fs.unlinkSync(path.join(CRITICAL_DIR, file)))

  const metadataById = metadataRules.reduce((acc, rule) => {
    acc[rule.id] = rule
    return acc
  }, {})

  Array.from(ruleMap.values())
    .filter((rule) => rule.severity === 'P')
    .forEach((rule) => {
      const metadata = metadataById[rule.id] || rule
      const domain = domainMap[rule.domain]
      const lines = [
        '---',
        `rule_id: ${rule.id}`,
        `domain: ${rule.domain}`,
        'severity: Critical',
        'priority: P',
        `number: ${parseInt(rule.id.split('-')[1].replace(/[^\d]/g, ''), 10)}`,
        `parent_file: domains/${domain.filename}`,
        `canonical_section: "#${rule.id.toLowerCase()}"`,
        '---',
        '',
        `# 🔴 ${rule.id}: ${rule.title}`,
        '',
        `**Pattern:** ${metadata.pattern}`,
        '',
        `**Why:** ${metadata.why}`,
        '',
      ]

      if (metadata.detection?.command) {
        lines.push('**Detection:**', '```bash', metadata.detection.command, '```', '')
      } else {
        lines.push('**Detection:** Manual review required.', '')
      }

      lines.push(
        '---',
        '',
        '**Navigation:**',
        `- [← Back to ${domain.name}](../${domain.filename}#${rule.id.toLowerCase()})`,
        '- [→ View all Critical Rules](README.md)',
        `- [Run Detection](../../_automation/detect-${rule.domain.toLowerCase()}-violations.sh)`,
        '',
      )

      fs.writeFileSync(
        path.join(CRITICAL_DIR, `${rule.id}.md`),
        lines.join('\n'),
        'utf8',
      )
    })
}

function buildCriticalReadme(ruleMap) {
  const entries = Array.from(ruleMap.values()).filter(
    (rule) => rule.severity === 'P',
  )
  const byDomain = new Map()
  entries.forEach((rule) => {
    if (!byDomain.has(rule.domain)) byDomain.set(rule.domain, [])
    byDomain.get(rule.domain).push(rule)
  })

  const lines = [
    '# Critical Rules (P-Level)',
    '',
    'All security-critical and breaking change rules consolidated for rapid review.',
    '',
    '## Overview',
    '',
    `**Total Critical Rules**: ${entries.length}`,
    `**Domains**: ${Array.from(byDomain.entries())
      .map(([code, arr]) => `${code} (${arr.length})`)
      .join(', ')}`,
    '',
    '## Why These Are Critical',
    '',
    '- 🔒 Security vulnerabilities',
    '- 💥 Breaking changes',
    '- 🚨 Data leaks',
    '- ❌ System failures',
    '',
    '**Violations must be fixed immediately.**',
    '',
    '## All Critical Rules',
    '',
  ]

  DOMAIN_CONFIGS.forEach((config) => {
    const domainRules = byDomain.get(config.code)
    if (!domainRules?.length) return
    lines.push(`### ${config.name} (${domainRules.length} rules)`, '')
    domainRules
      .sort((a, b) => a.id.localeCompare(b.id))
      .forEach((rule) => {
        lines.push(
          `- [${rule.id}](../critical/${rule.id}.md) - ${rule.title}`,
        )
      })
    lines.push('')
  })

  lines.push('## Quick Access', '')
  lines.push('- [Run all detections](../../_automation/detect-all.sh)')
  lines.push('- [View full rules index](../../03-QUICK-SEARCH.md)')
  lines.push('- [Back to domains](../)', '')

  fs.writeFileSync(
    path.join(CRITICAL_DIR, 'README.md'),
    lines.join('\n'),
    'utf8',
  )
}

function buildDomainDocs(ruleMap) {
  const rulesByDomain = new Map()
  for (const rule of ruleMap.values()) {
    if (!rulesByDomain.has(rule.domain)) {
      rulesByDomain.set(rule.domain, [])
    }
    rulesByDomain.get(rule.domain).push(rule)
  }

  DOMAIN_CONFIGS.forEach((config) => {
    const domainRules = (rulesByDomain.get(config.code) || []).sort((a, b) =>
      a.id.localeCompare(b.id),
    )
    const totals = {
      P: domainRules.filter((rule) => rule.severity === 'P').length,
      H: domainRules.filter((rule) => rule.severity === 'H').length,
      M: domainRules.filter((rule) => rule.severity === 'M').length,
      L: domainRules.filter((rule) => rule.severity === 'L').length,
    }

    const frontmatter = [
      '---',
      `domain: ${config.code}`,
      `total_rules: ${domainRules.length}`,
      `critical: ${totals.P}`,
      `high: ${totals.H}`,
      `medium: ${totals.M}`,
      `low: ${totals.L}`,
      `related_domains: [${config.related.join(', ')}]`,
      `automation_script: ${config.automation}`,
      'last_updated: "2025-10-19"',
      '---',
      '',
    ]

    const lines = [...frontmatter]
    lines.push(
      `# ${config.name} Rules`,
      '',
      `> **Domain:** ${config.name} | **Rules:** ${domainRules.length} | **Critical:** ${totals.P}`,
      '',
      '## Overview',
      '',
      config.description,
      '',
    )

    const principles = domainPrinciples[config.code] || []
    if (principles.length) {
      lines.push('**Key Principles:**')
      principles.forEach((item, index) =>
        lines.push(`${index + 1}. ${item}`),
      )
      lines.push('')
    }

    const related = config.related.map(
      (code) => `[${domainMap[code].name}](./${domainMap[code].filename})`,
    )
    if (related.length) {
      lines.push(`**📖 See also**: ${related.join(', ')}`, '')
    }

    lines.push(
      '## Quick Links',
      '',
      '- [Critical Rules](#critical-rules)',
      '- [High Priority](#high-priority)',
      '- [Medium Priority](#medium-priority)',
      '- [Low Priority](#low-priority)',
      '- [Common Mistakes](#common-mistakes)',
      '- [Quick Reference](#quick-reference)',
      '',
      '---',
      '',
      '## Critical Rules (P-level) {#critical-rules}',
      '',
    )

    const criticalRules = domainRules.filter((rule) => rule.severity === 'P')
    if (criticalRules.length === 0) {
      lines.push('- None.', '')
    } else {
      criticalRules.forEach((rule) => {
        const anchor = rule.id.toLowerCase()
        lines.push(
          `### ${rule.id} — ${rule.title} {#${anchor}}`,
          '',
          `- **Summary:** ${rule.summary}`,
          `- **Details:** [Critical spec](critical/${rule.id}.md)`,
          '',
        )
      })
    }

    const renderSummaryRule = (heading, severity, anchor) => {
      lines.push(`## ${heading} {#${anchor}}`, '')
      const items = domainRules.filter((rule) => rule.severity === severity)
      if (items.length === 0) {
        lines.push(`_No ${heading.toLowerCase()} defined._`, '')
      } else {
        items.forEach((rule) => {
          const anchor = rule.id.toLowerCase()
          lines.push(
            `### ${rule.id} — ${rule.title} {#${anchor}}`,
            '',
            `- **Pattern:** ${rule.summary}`,
            `- **See metadata:** \`_meta/rules.json → ${rule.id}\``,
            '',
          )
        })
      }
    }

    renderSummaryRule('High Priority Rules (H-level)', 'H', 'high-priority')
    renderSummaryRule('Medium Priority Rules (M-level)', 'M', 'medium-priority')
    renderSummaryRule('Low Priority Rules (L-level)', 'L', 'low-priority')

    lines.push('## Common Mistakes {#common-mistakes}', '')
    const mistakes = domainMistakes[config.code] || []
    if (mistakes.length) {
      mistakes.forEach((item, index) => lines.push(`${index + 1}. ${item}`))
      lines.push('')
    } else {
      lines.push('_Keep automation green to avoid regressions._', '')
    }

    const anchor = slugify(config.name)
    lines.push('## Quick Reference {#quick-reference}', '')
    lines.push(
      `- Review [Code Examples](../reference/examples.md#${anchor}) for compliant snippets.`,
    )
    lines.push(
      `- Run [${config.automation}](../${config.automation}) before committing.`,
    )
    lines.push('- Critical specs live under [`domains/critical/`](critical/).')
    lines.push('')

    lines.push('## Exclusions', '')
    lines.push(
      '- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.',
      '',
    )

    const references = domainReferenceLinks[config.code] || []
    if (references.length) {
      lines.push('**📖 Related Documentation:**')
      references.forEach((ref) =>
        lines.push(`- [${ref.label}](${ref.link})`),
      )
      lines.push('')
    }

    lines.push('**Last Updated:** 2025-10-19', '')

    fs.writeFileSync(
      path.join(RULES_DIR, 'domains', config.filename),
      lines.join('\n'),
      'utf8',
    )
  })
}

function buildColorTokens() {
  const globalsPath = path.join(repoRoot, 'app', 'globals.css')
  const content = fs.readFileSync(globalsPath, 'utf8')
  const themeMatch = content.match(/@theme inline\s*{([\s\S]*?)}/)
  if (!themeMatch) return

  const lines = themeMatch[1].split('\n').map((line) => line.trim())
  const base = new Set()
  const semantic = new Set()
  const border = new Set()
  const chart = new Set()
  const sidebar = new Set()

  lines.forEach((line) => {
    const match = line.match(/--color-([a-z0-9-]+):/)
    if (!match) return
    const name = match[1]
    let classes
    if (name === 'foreground' || name.endsWith('-foreground')) {
      classes = [`text-${name}`]
    } else if (name.includes('border') || name === 'input') {
      classes = [`border-${name}`]
    } else if (name.includes('ring')) {
      classes = [`ring-${name}`]
    } else {
      classes = [`bg-${name}`]
    }

    if (name.startsWith('sidebar')) classes.forEach((cls) => sidebar.add(cls))
    else if (name.startsWith('chart')) classes.forEach((cls) => chart.add(cls))
    else if (
      [
        'primary',
        'primary-foreground',
        'secondary',
        'secondary-foreground',
        'accent',
        'accent-foreground',
        'destructive',
        'destructive-foreground',
        'success',
        'success-foreground',
        'warning',
        'warning-foreground',
        'info',
        'info-foreground',
        'star-filled',
        'star-empty',
      ].includes(name)
    )
      classes.forEach((cls) => semantic.add(cls))
    else if (name === 'border' || name === 'input' || name.includes('ring'))
      classes.forEach((cls) => border.add(cls))
    else classes.forEach((cls) => base.add(cls))
  })

  const sorted = (set) => Array.from(set).sort()

  const docLines = [
    '# Color Tokens Reference',
    '',
    '**ONLY these color tokens are allowed. Reference them via Tailwind utilities.**',
    '',
    `## Base Colors (${base.size} tokens)`,
    ...sorted(base).map((token) => `- \`${token}\``),
    '',
    `## Semantic Colors (${semantic.size} tokens)`,
    ...sorted(semantic).map((token) => `- \`${token}\``),
    '',
    `## Border & Ring (${border.size} tokens)`,
    ...sorted(border).map((token) => `- \`${token}\``),
    '',
    `## Chart Colors (${chart.size} tokens)`,
    ...sorted(chart).map((token) => `- \`${token}\``),
    '',
    `## Sidebar Colors (${sidebar.size} tokens)`,
    ...sorted(sidebar).map((token) => `- \`${token}\``),
    '',
    '## ❌ Forbidden',
    '',
    '- `bg-blue-500`, `text-gray-600`, `border-slate-200`',
    '- Arbitrary hex colors like `bg-[#fff]`, `text-[#000]`',
    '- Any Tailwind palette class not mapped through `app/globals.css`',
    '',
    '## Adding New Tokens',
    '',
    '1. Propose additions in `app/globals.css`.',
    '2. Update this reference file with the new token.',
    '3. Regenerate metadata via `node scripts/rebuild_rules.mjs`.',
  ]

  fs.writeFileSync(
    path.join(RULES_DIR, 'reference', 'color-tokens.md'),
    docLines.join('\n'),
    'utf8',
  )
}

function buildShadcnReference() {
  const uiDir = path.join(repoRoot, 'components', 'ui')
  const docsDir = path.join(repoRoot, 'docs', 'shadcn-components')
  const components = fs
    .readdirSync(uiDir)
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => file.replace('.tsx', ''))
    .sort()

  const categorize = (name) => {
    const lower = name.toLowerCase()
    if (
      [
        'button',
        'button-group',
        'checkbox',
        'combobox',
        'command',
        'field',
        'form',
        'input',
        'input-group',
        'input-otp',
        'radio-group',
        'select',
        'slider',
        'switch',
        'textarea',
        'toggle',
        'toggle-group',
      ].some((pattern) => lower.includes(pattern))
    )
      return 'Forms'
    if (
      ['breadcrumb', 'menubar', 'navigation-menu', 'pagination', 'tabs'].some(
        (pattern) => lower.includes(pattern),
      )
    )
      return 'Navigation'
    if (
      [
        'accordion',
        'aspect-ratio',
        'calendar',
        'card',
        'carousel',
        'collapsible',
        'hover-card',
        'resizable',
        'separator',
        'sidebar',
      ].some((pattern) => lower.includes(pattern))
    )
      return 'Layout'
    if (
      [
        'alert-dialog',
        'context-menu',
        'dialog',
        'drawer',
        'dropdown-menu',
        'popover',
        'sheet',
        'sonner',
        'tooltip',
      ].some((pattern) => lower.includes(pattern))
    )
      return 'Overlay'
    if (
      [
        'alert',
        'badge',
        'chart',
        'empty',
        'progress',
        'skeleton',
        'spinner',
        'table',
      ].some((pattern) => lower.includes(pattern))
    )
      return 'Feedback & Data'
    return 'Utilities'
  }

  const grouped = new Map()
  components.forEach((component) => {
    const category = categorize(component)
    if (!grouped.has(category)) grouped.set(category, [])
    grouped.get(category).push(component)
  })

  const toTitle = (value) =>
    value
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ')

  const lines = [
    '# shadcn/ui Components Reference',
    '',
    '## Critical Rules',
    '',
    '1. Use installed components exactly as exported from `@/components/ui/*` (UI-P003).',
    '2. Read local docs in `docs/shadcn-components/` before modifying compositions.',
    '3. Never edit files under `components/ui` directly—compose in features instead.',
    '4. Include required subcomponents when rendering composites (UI-P002).',
    '5. Propose new primitives via ADR before installing additional components.',
    '',
    '## Installed Components',
    '',
  ]

  Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([category, list]) => {
      lines.push(`### ${category}`, '')
      list.forEach((component) => {
        const docPath = path.join(docsDir, `${component}.md`)
        const hasDoc = fs.existsSync(docPath)
        const label = toTitle(component)
        if (hasDoc) {
          lines.push(
            `- \`${label}\` — [docs/shadcn-components/${component}.md](../../shadcn-components/${component}.md)`,
          )
        } else {
          lines.push(`- \`${label}\``)
        }
      })
      lines.push('')
    })

  lines.push(
    '## Usage Checklist',
    '',
    '1. Confirm the component exists: `ls components/ui/<component>.tsx`.',
    '2. Review local docs for variants and required subcomponents.',
    '3. Compose in feature-level components; do not alter the base implementation.',
    '4. Apply styling via `className` using tokens from `app/globals.css`.',
    '5. Re-run `node scripts/rebuild_rules.mjs` after adding new components.',
  )

  fs.writeFileSync(
    path.join(RULES_DIR, 'reference', 'shadcn-components.md'),
    lines.join('\n'),
    'utf8',
  )
}

function buildRealViolations(rules) {
  const scanDate = new Date().toISOString().split('T')[0]
  const summary = []
  const details = []
  const relevantPrefixes = ['app/', 'features/', 'components/', 'lib/', 'supabase/']

  rules
    .filter((rule) => rule.priority === 'P')
    .forEach((rule) => {
      const command = rule.detection?.command
      if (!command || !command.startsWith('rg ')) {
        summary.push(
          `- ${rule.id} — ⚠️ Manual review required (no automated detection)`,
        )
        return
      }
      try {
        const output = execSync(command, {
          cwd: repoRoot,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
        }).trim()
        if (!output) {
          summary.push(
            `- ${rule.id} — ✅ No active violations (${command})`,
          )
          return
        }
        const lines = output.split('\n').filter(Boolean)
        const relevant = lines.filter((line) => {
          const filePath = line.split(':')[0]
          return relevantPrefixes.some((prefix) => filePath.startsWith(prefix))
        })
        if (relevant.length === 0) {
          summary.push(
            `- ${rule.id} — ✅ No active violations (${command})`,
          )
          return
        }
        summary.push(
          `- ${rule.id} — ❌ ${relevant.length} potential match(es)`,
        )
        details.push({
          rule,
          command,
          sample: relevant.slice(0, 5),
        })
      } catch (error) {
        if (error.status === 1) {
          summary.push(
            `- ${rule.id} — ✅ No active violations (${command})`,
          )
        } else {
          summary.push(
            `- ${rule.id} — ⚠️ Detection command failed (${error.message.split('\n')[0]})`,
          )
        }
      }
    })

  const lines = [
    '# Real Violations & Fixes',
    '',
    `Latest automated scan: ${scanDate}`,
    'Use `_automation/detect-all.sh` to reproduce these results locally.',
    '',
    '## Scan Summary',
    '',
    ...summary,
    '',
  ]

  if (details.length === 0) {
    lines.push(
      'No violations detected for critical rules. Keep automation in CI to enforce future regressions.',
    )
  } else {
    details.forEach(({ rule, command, sample }) => {
      lines.push(
        `### ${rule.id} — ${rule.title}`,
        '',
        `**Detection:** \`${command}\``,
        '',
        '**Matches (top results):**',
        '```text',
        ...sample,
        '```',
        '',
        `**Fix:** Follow [${rule.id}](../domains/critical/${rule.id}.md) for compliant patterns.`,
        '',
      )
    })
  }

  fs.writeFileSync(
    path.join(RULES_DIR, 'reference', 'real-violations.md'),
    lines.join('\n'),
    'utf8',
  )
}

function main() {
  const ruleMap = parseIndex()
  const criticalData = parseCriticalRules()
  const metadataRules = buildMetadata(ruleMap, criticalData)
  buildCriticalFiles(ruleMap, metadataRules)
  buildCriticalReadme(ruleMap)
  buildDomainDocs(ruleMap)
  buildColorTokens()
  buildShadcnReference()
  buildRealViolations(metadataRules)
}

main()
