# AI Context: ENORAE Rules (Machine-Optimized)

## Critical Rules Matrix (P-Level)

| ID | Domain | Pattern | Auto-Fix | Detection |
|----|--------|---------|----------|-----------|
| UI-P001 | UI | Render text via shadcn slots/semantic tokens | ❌ | Manual |
| UI-P002 | UI | Complete shadcn/ui compositions | ❌ | Manual |
| UI-P004 | UI | Remove `@/components/ui/typography` usage | ❌ | `rg "from '@/components/ui/typography'" --glob '!docs/**'` |
| UI-P003 | UI | shadcn/ui primitives only | ❌ | Manual |
| DB-P001 | DB | Read from views, write via `.schema()` | ❌ | `rg "\.schema\('.*'\)\.from\('.*'\)\.select" features app` |
| DB-P002 | DB | Auth verification in every function | ❌ | Manual |
| DB-P003 | DB | Enforce tenant filters in RLS | ❌ | Manual (policy review) |
| ARCH-P001 | ARCH | `import 'server-only'` / `'use server'` directives | ❌ | `rg --files-without-match "import 'server-only'" features -g 'queries.ts'` |
| ARCH-P002 | ARCH | Pages limited to 5-15 lines | ❌ | Manual |
| SEC-P001 | SEC | Always verify session via `getUser()` | ❌ | `rg "supabase.auth.getUser" -g '*.ts*' features app` |
| SEC-P002 | SEC | Use role helpers for authorization | ❌ | Manual |
| SEC-P003 | SEC | Wrap `auth.uid()` in sub-select | ❌ | `rg "auth.uid()" supabase/migrations` |
| NEXT-P001 | NEXT | Load scripts from layout with `<Script />` | ❌ | Manual |
| NEXT-P002 | NEXT | Global styles only in `app/layout.tsx` | ❌ | Manual |
| NEXT-P003 | NEXT | No Pages Router usage | ❌ | `rg "getInitialProps" app` |
| REACT-P001 | REACT | Server Components fetch data | ❌ | Manual |
| REACT-P002 | REACT | Avoid client waterfalls | ❌ | Manual |
| TS-P001 | TS | No `any`, no `@ts-ignore` | ❌ | `rg "@ts-ignore" features app` |
| TS-P002 | TS | Avoid reserved words / ambient types | ❌ | Manual |

## Quick Decision Tree

```
Working on UI?
├─ Need a component? → IMPORT from `@/components/ui/*`; pull missing ones via shadcn MCP (UI-P003)
├─ Editing shared primitives? → DON'T. Compose in feature code (UI-P003)
├─ Using dialogs/cards? → INCLUDE required subcomponents (UI-P002)
└─ Styling? → USE documented classes + design tokens (`text-primary`, `bg-muted`)—no bespoke Tailwind (UI-H101/UI-H102)

Touching Database code?
├─ Reading data → FROM public views (DB-P001)
├─ Mutating → USE .schema('<schema>').from('<table>') (DB-P001)
├─ Missing auth? → CALL verifySession/getUser (DB-P002)
└─ Writing policies → WRAP auth.uid() + enforce tenant (DB-P003)

Creating server logic?
├─ queries.ts → MUST import 'server-only' (ARCH-P001)
├─ mutations.ts → MUST start with 'use server' (ARCH-P001)
└─ Page component → KEEP under 15 lines, render feature index (ARCH-P002)
```

## Detection Commands (Copy-Paste Ready)

```bash
# Shadcn typography imports
rg "from '@/components/ui/typography'" --glob '!docs/**'

# Queries hitting schema tables with select
rg "\.schema\('.*'\)\.from\('.*'\)\.select" features app

# Missing server-only directives in queries
rg --files-without-match "import 'server-only'" features -g 'queries.ts'

# Suspicious use of @ts-ignore / any
rg "@ts-ignore" --glob '*.ts*' features app
rg ": any\b" --glob '*.ts*' features app

# Pages Router artifacts
rg "getInitialProps" app
rg "pages/" -g '*.ts*' app
```

## Metadata Access

Machine-readable data lives in `_meta/rules.json` and `_meta/domains.json`. Re-run:

```bash
node scripts/rebuild_rules.mjs
node scripts/generate_rule_automation.mjs
```

after editing domain docs to refresh metadata and automation.
