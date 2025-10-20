# Multi-Agent Guidelines

All autonomous agents (Claude, GPT, etc.) must apply these shared guardrails when operating in the ENORAE codebase.

---

## 1. Read the Rule System First

- Start at `docs/rules/00-START-HERE.md`.
- Use `docs/rules/03-QUICK-SEARCH.md` to look up rule codes.
- Follow the task guide in `docs/rules/04-TASK-GUIDE.md` before performing specialised work (database change, new feature, debugging, etc.).
- Regenerate metadata and automation after touching rule docs:
  ```bash
  node scripts/rebuild_rules.mjs
  node scripts/generate_rule_automation.mjs
  ```

### Quick Domain Map

| Area | Rule file(s) | Notes |
| --- | --- | --- |
| UI & styling | `docs/rules/domains/ui.md`, `docs/rules/domains/accessibility.md` | shadcn/ui only, stick to design tokens |
| Database & Supabase | `docs/rules/domains/database.md`, `docs/rules/domains/security.md` | auth guard every action, use views, respect RLS |
| Architecture | `docs/rules/domains/architecture.md` | pages are shells; queries/mutations use directives |
| Next.js & React | `docs/rules/domains/nextjs.md`, `docs/rules/domains/react.md` | App Router patterns, server/client boundaries |
| TypeScript | `docs/rules/domains/typescript.md` | strict mode enforced, no `any` |
| Performance | `docs/rules/domains/performance.md` | revalidation, batching, indexes |

---

## 2. UI Guardrails (applies to every agent)

1. **Import primitives from `@/components/ui/*` only.** If a component is missing, obtain it via the shadcn MCP (`shadcn/get_component`). Never bring in other UI libraries or custom primitives.

2. **Eliminate ALL custom Typography components.** Remove every import from `@/components/ui/typography` (H1, H2, H3, P, Lead, Muted, Small, Large, etc.). This is non-negotiable.

3. **Maximize shadcn/ui primitive usage.** Before refactoring any section:
   - Use the shadcn MCP to reference component documentation and explore available blocks
   - Check the 50+ components: Card, Alert, Dialog, Sheet, Accordion, Tabs, Badge, Separator, HoverCard, Popover, Command, etc.
   - Explore blocks for complex patterns: hero sections, feature grids, pricing tables, testimonials, dashboards, forms
   - Assume a suitable shadcn component or block exists before falling back to manual styling

4. **Render plain text in shadcn slots.** When a component provides a text slot (CardTitle, CardDescription, AlertDescription, DialogTitle, AccordionTrigger, TabsTrigger, SidebarMenuButton, etc.), render text directly without extra `<span>` wrappers or custom font classes.

5. **Restructure to match shadcn compositions.** Freely restructure existing markup to proper patterns:
   - Content blocks → Cards (CardHeader → CardTitle + CardDescription)
   - Callouts → Alerts (AlertTitle + AlertDescription)
   - Headings with descriptions → CardHeader with CardTitle + CardDescription
   - Feature lists → Accordion or Tabs
   - Use shadcn blocks via MCP for complex layouts
   - Don't preserve suboptimal layouts—restructure if better composition exists

6. **Fallback sparingly.** Only use semantic HTML with design tokens (text-foreground, text-muted-foreground, bg-muted) when absolutely no shadcn primitive or block matches the use case.

7. **Do not edit `components/ui/` or `app/globals.css`.** Compose behaviour in feature modules. Propose an ADR for shared changes.

8. **Respect design tokens.** Use semantic classes from `app/globals.css` (text-primary, bg-muted, border-border). Arbitrary Tailwind utilities or bespoke colours are forbidden.

9. **Accessibility matters.** Ensure grouped controls carry accessible labelling (`aria-label`, `aria-labelledby`) and consult `docs/rules/domains/accessibility.md` when building forms, charts, or interactive components.

---

## 3. Database & Security Expectations

- Queries read from **public views**; mutations target schema tables via `.schema('<schema>')`. (`DB-P001`)
- Every server action or route handler verifies the Supabase user (`getUser()` or `verifySession()`) before touching data. (`DB-P002`, `SEC-P001`)
- Validate inputs with Zod (see `DB-M302`, `SEC-M302`) and call `revalidatePath` or relevant cache invalidation after writes. (`DB-H103`)
- Maintain strict RLS: wrap `auth.uid()` in `select` expressions, enforce tenant scope using JWT claims or mapping tables. (`SEC-P003`, `DB-P003`)

---

## 4. Architecture & Code Organisation

- Page files are shells (5–15 lines). They should render a feature-level component and nothing more. (`ARCH-P002`)
- `features/**/api/queries.ts` must include `import 'server-only'`. `mutations.ts` files start with `'use server'`. (`ARCH-P001`)
- Feature directories follow the canonical structure: `components/`, `api/`, `types.ts`, `schema.ts`, `index.tsx`. (`ARCH-H101`)
- Keep shared utilities in appropriate `lib/` folders organised by concern.

---

## 5. Runtime & TypeScript

- App Router only—no legacy Pages Router helpers such as `getInitialProps`. (`NEXT-P003`)
- Fetch data in Server Components, keep Client Components thin, and avoid client waterfalls. (`REACT-P001`, `REACT-P002`)
- TypeScript strict mode is non-negotiable: no `any`, no `@ts-ignore`, no compiler relaxations. (`TS-P001`)
- Use generated Supabase types (`Database['public']['Tables'|'Views']`) for data access. (`TS-M302`)

---

## 6. Workflow Checklist Before Submitting Changes

1. Read the relevant domain rule file(s) and associated workflow.
2. Run or update automation scripts in `docs/rules/_automation/` if your change affects rule compliance.
3. Execute `npm run typecheck`; fix failures before submission.
4. Prefer existing primitives, variants, and tokens—if something is missing, escalate with an ADR instead of workaround code.
5. Ensure `node scripts/rebuild_rules.mjs` and `node scripts/generate_rule_automation.mjs` have been run if rule docs were edited.

Staying within these guardrails keeps ENORAE consistent, secure, and maintainable for every collaborating agent.***
