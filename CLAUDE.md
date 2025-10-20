# Claude Agent Guide

Fast reference for Claude Code when contributing to ENORAE.

---

## Rule System Overview

- **Start here:** `docs/rules/00-START-HERE.md`
- **Search by rule code:** `docs/rules/03-QUICK-SEARCH.md`
- **Task-based workflows:** `docs/rules/04-TASK-GUIDE.md`

| Task | Read these rules | Workflow |
| --- | --- | --- |
| UI & styling | `docs/rules/domains/ui.md`, `docs/rules/domains/accessibility.md` | – |
| Database / Supabase | `docs/rules/domains/database.md`, `docs/rules/domains/security.md` | `docs/rules/workflows/database-changes.md` |
| New feature scaffolding | `docs/rules/domains/architecture.md` | `docs/rules/workflows/new-feature.md` |
| Next.js / React | `docs/rules/domains/nextjs.md`, `docs/rules/domains/react.md` | – |
| TypeScript strictness | `docs/rules/domains/typescript.md` | – |
| Performance tuning | `docs/rules/domains/performance.md` | – |
| Debugging | – | `docs/rules/workflows/debugging-checklist.md` |

Rebuild rule metadata + automation after editing rule docs:
```bash
node scripts/rebuild_rules.mjs
node scripts/generate_rule_automation.mjs
```

---

## Critical Reminders

### UI (see `domains/ui.md`)
- Import primitives only from `@/components/ui/*`. Fetch missing ones via the shadcn MCP (`shadcn/get_component`). Never edit `components/ui/*`.
- **Eliminate ALL custom Typography components.** Remove every import from `@/components/ui/typography` (H1, H2, H3, P, Lead, Muted, Small, Large, etc.). (`UI-P004`)
- **Maximize shadcn/ui primitive usage.** Use the shadcn MCP to explore 50+ components (Card, Alert, Dialog, Sheet, Accordion, Tabs, Badge, Separator, etc.) and blocks (hero sections, feature grids, pricing tables, testimonials). Before refactoring, check component docs via MCP to find the best match.
- **Use shadcn slot components AS-IS (no sizing customization).** When a component provides a text slot (CardTitle, CardDescription, AlertDescription, DialogTitle, AccordionTrigger, etc.), render text directly with **zero styling changes**. DO NOT add `className="text-lg font-bold"`, color classes, or any font customizations. Apply only layout classes (flex, gap, padding) for arrangement. (`UI-P002`, `UI-P004`)
- **Restructure to match shadcn compositions.** Content blocks → Cards, callouts → Alerts, headings+descriptions → CardHeader with CardTitle + CardDescription. Explore shadcn blocks via MCP for complex patterns. Restructure freely if better composition exists—don't preserve suboptimal layouts. (`UI-P002`)
- **Fallback only when necessary.** Use semantic HTML with design tokens ONLY when absolutely no shadcn primitive or block matches. Assume a suitable component exists before falling back.
- Stick to provided class names + approved design tokens. No bespoke Tailwind utilities or arbitrary colours. NEVER edit `app/globals.css`. (`UI-H101`, `UI-H102`)

### Database & Security (`domains/database.md`, `domains/security.md`)
- Reads come from public views; writes target schema tables via `.schema('<schema>')`. (`DB-P001`)
- Every server action/route verifies the Supabase user (`getUser()` / `verifySession()`) before touching data. (`DB-P002`, `SEC-P001`)
- Validate inputs with Zod, call `revalidatePath` after mutations, and keep RLS tenant scoped. (`DB-M302`, `DB-H103`, `DB-P003`, `SEC-P003`)

### Architecture (`domains/architecture.md`)
- Page files are shells (5–15 lines). Render a feature component and nothing else. (`ARCH-P002`)
- `features/**/api/queries.ts` must include `import 'server-only'`; mutations start with `'use server'`. (`ARCH-P001`)
- Maintain the canonical feature structure: `components/`, `api/`, `types.ts`, `schema.ts`, `index.tsx`. (`ARCH-H101`)

### Next.js, React, TypeScript
- App Router only—no legacy Pages Router helpers or `getInitialProps`. (`NEXT-P003`)
- Fetch data in Server Components; avoid client waterfalls in Client Components. (`REACT-P001`, `REACT-P002`)
- TypeScript strict mode only: no `any`, no `@ts-ignore`, no loosened compiler flags. (`TS-P001`)

---

## Frequent Violations (Avoid These)

1. Leaving `@/components/ui/typography` imports in features → replace with shadcn slots (`UI-P004`).
2. **Customizing shadcn slot sizing** — adding `className="text-lg font-bold"` or colors to CardTitle, CardDescription, etc. → use slots as-is, layout classes only (`UI-P002`, `UI-P004`).
3. Wrapping shadcn text slots in extra `<span>`/`<p>` with custom classes → render plain text or use existing primitives (`UI-P004`).
4. Building custom UI primitives or editing `components/ui/*` → import existing ones or fetch via MCP (`UI-P003`).
5. Skipping required shadcn subcomponents → follow registry composition (`UI-P002`).
6. Applying arbitrary Tailwind utilities/colours → stick to tokens from `app/globals.css` (`UI-H101`, `UI-H102`).
7. Querying schema tables directly for reads → use public views (`DB-P001`).
8. Missing auth guards before Supabase calls → `getUser()`/`verifySession()` first (`DB-P002`).
9. Leaving business logic in page files → pages remain ultra-thin (`ARCH-P002`).
10. Using `any` / loosening TS config → stay in strict mode (`TS-P001`).
11. Forgetting `revalidatePath` after mutations → keeps caches fresh (`DB-H103`).

Consult `docs/rules/workflows/debugging-checklist.md` when something feels off.

---

## Code References

### Database pattern
```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getSalonDashboard(userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salon_dashboard') // public view
    .select('*')
    .eq('owner_id', user.id)

  if (error) throw error
  return data
}
```

### UI composition (no typography import, no slot sizing customization)
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function EmptyAppointments() {
  return (
    <Card>
      <CardHeader className="mb-4">
        {/* ✅ Use slots with ZERO styling changes */}
        <CardTitle>Nothing scheduled</CardTitle>
        <CardDescription>Once clients book, appointments will appear here.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2">
        {/* ✅ Layout classes (flex, gap, justify-between) OK */}
        {/* ❌ DO NOT do: <CardTitle className="text-lg font-bold">  */}
        <Badge variant="outline">0 bookings</Badge>
        <Button>Create a service</Button>
      </CardContent>
    </Card>
  )
}
```

### Page shell
```tsx
import { Suspense } from 'react'
import { BusinessDashboard } from '@/features/business/dashboard'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BusinessDashboard />
    </Suspense>
  )
}
```

### Approved design tokens
Use only approved design tokens (e.g. `bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `border-input`, `bg-chart-[1-5]`, `bg-sidebar`, `text-sidebar-foreground`, etc.). Never introduce arbitrary colours or bespoke Tailwind utilities. **NEVER edit `app/globals.css`** - it is protected and maintained separately.

---

## Project Facts & Checklist

- Portals: `(marketing)`, `(customer)`, `(staff)`, `(business)`, `(admin)` under `app/`.
- Feature layout: `features/[portal]/[feature]/(components|api|types.ts|schema.ts|index.tsx)`.
- Database schemas: organisation, catalog, scheduling, inventory, identity, communication, analytics, engagement.

Before pushing changes:
1. Read the relevant domain rule file(s).
2. Update automation scripts if rule coverage shifts.
3. Run `npm run typecheck` (must pass).
4. If you touched rule docs, re-run the metadata/automation generators.
5. Prefer existing primitives/tokens; raise an ADR for new shared variants.

Stay within these guardrails to keep ENORAE consistent, accessible, and easy to maintain.
