# Rules System - Start Here

**👋 New to ENORAE development?** Read this file first, then navigate to the specific rules you need.

---

## 🎯 Quick Navigation

**I'm working on...** | **Read these files** | **Workflow**
--- | --- | ---
🎨 **UI/Components** | [`domains/ui.md`](./domains/ui.md) + [`domains/accessibility.md`](./domains/accessibility.md) | -
🗄️ **Database queries** | [`domains/database.md`](./domains/database.md) + [`domains/security.md`](./domains/security.md) | [`workflows/database-changes.md`](./workflows/database-changes.md)
🏗️ **New feature** | [`domains/architecture.md`](./domains/architecture.md) | [`workflows/new-feature.md`](./workflows/new-feature.md)
📄 **New page/route** | [`domains/nextjs.md`](./domains/nextjs.md) + [`domains/architecture.md`](./domains/architecture.md) | -
🔒 **Auth/permissions** | [`domains/security.md`](./domains/security.md) | -
⚡ **Performance issue** | [`domains/performance.md`](./domains/performance.md) | [`workflows/debugging-checklist.md`](./workflows/debugging-checklist.md)
🧩 **React components** | [`domains/react.md`](./domains/react.md) + [`domains/ui.md`](./domains/ui.md) | -
📝 **TypeScript types** | [`domains/typescript.md`](./domains/typescript.md) + [`domains/database.md`](./domains/database.md) | -

---

## 🚨 Critical Rules (Must Read)

These rules prevent security vulnerabilities and breaking changes. **Read these first:**

### Security & Database
- **[SEC-P001](./03-QUICK-SEARCH.md#sec-p001)** - Always verify auth with `verifySession()` or `getUser()`
- **[DB-P001](./03-QUICK-SEARCH.md#db-p001)** - Query public views, mutate schema tables
- **[DB-P002](./03-QUICK-SEARCH.md#db-p002)** - Auth verification required in every function
- **[DB-P003](./03-QUICK-SEARCH.md#db-p003)** - Multi-tenant RLS must filter by tenant

### Architecture & Code Structure
- **[ARCH-P001](./03-QUICK-SEARCH.md#arch-p001)** - `queries.ts` needs `import 'server-only'`, mutations need `'use server'`
- **[ARCH-P002](./03-QUICK-SEARCH.md#arch-p002)** - Pages must be 5-15 lines, render feature components only

### UI & Framework
- **[UI-P004](./03-QUICK-SEARCH.md#ui-p004)** - Remove `@/components/ui/typography` imports; use shadcn slots or design tokens
- **[UI-P002](./03-QUICK-SEARCH.md#ui-p002)** - Complete shadcn/ui compositions (DialogHeader, DialogTitle, etc.)
- **[NEXT-P001](./03-QUICK-SEARCH.md#next-p001)** - Load scripts in `app/layout.tsx` using `<Script />`
- **[REACT-P001](./03-QUICK-SEARCH.md#react-p001)** - Server Components fetch data, Client Components add interactivity

### Type Safety
- **[TS-P001](./03-QUICK-SEARCH.md#ts-p001)** - No `any`, no `@ts-ignore`, strict mode always

[**View all critical rules →**](./03-QUICK-SEARCH.md#critical-rules)

---

## 📚 Documentation Structure

### Core Rules (Most Referenced)
- [`domains/database.md`](./domains/database.md) - Supabase queries, views, RLS policies
- [`domains/security.md`](./domains/security.md) - Authentication, authorization, RLS
- [`domains/architecture.md`](./domains/architecture.md) - File structure, directives, feature layout
- [`domains/ui.md`](./domains/ui.md) - shadcn/ui, Tailwind CSS v4, Typography

### Framework-Specific
- [`domains/nextjs.md`](./domains/nextjs.md) - Next.js 15 App Router patterns
- [`domains/react.md`](./domains/react.md) - React 19 Server/Client composition
- [`domains/typescript.md`](./domains/typescript.md) - TypeScript 5.9 strictness

### Code Quality
- [`domains/performance.md`](./domains/performance.md) - Database indexes, query optimization
- [`domains/accessibility.md`](./domains/accessibility.md) - WCAG compliance, aria attributes

### Reference
- [`reference/exclusions.md`](./reference/exclusions.md) - Files to exclude from rules
- [`reference/stack-versions.md`](./reference/stack-versions.md) - Current stack versions
- [`reference/rule-template.md`](./reference/rule-template.md) - Template for new rules

### Workflows
- [`workflows/new-feature.md`](./workflows/new-feature.md) - Step-by-step feature creation
- [`workflows/database-changes.md`](./workflows/database-changes.md) - Schema changes workflow
- [`workflows/debugging-checklist.md`](./workflows/debugging-checklist.md) - Common issues & fixes

---

## 🔍 Finding Specific Rules

### By Rule Code
Use the searchable index: [`03-QUICK-SEARCH.md`](./03-QUICK-SEARCH.md)

**Example**: Press `Cmd/Ctrl+F` and search for "DB-P001" to jump directly to that rule.

### By Task
Use the task-based guide: [`04-TASK-GUIDE.md`](./04-TASK-GUIDE.md)

**Example**: "I want to create a new database query" → See relevant rules and workflow

---

## 📊 Rule Severity Levels

Rules are categorized by severity using a letter prefix:

Level | Prefix | Description | Examples
--- | --- | --- | ---
**Critical** | `P` (P001-P099) | Security vulnerabilities, breaking changes | Auth bypass, credential leaks
**High** | `H` (H100-H299) | Major behavioral or UX issues | Missing RLS, client waterfalls
**Medium** | `M` (M300-M699) | Code quality, maintainability | Missing types, pattern violations
**Low** | `L` (L700-L999) | Optimizations, nice-to-haves | Bundle size, cache tuning

**Rule Naming Convention**: `{DOMAIN}-{SEVERITY}{NUMBER}`
- `DOMAIN`: SEC, DB, ARCH, UI, NEXT, REACT, TS, PERF, A11Y
- `SEVERITY`: P, H, M, L
- `NUMBER`: Sequential within severity level

---

## 🛠️ Development Workflow

### Before You Code
1. ✅ Read relevant rules for your task (see Quick Navigation above)
2. ✅ Check critical rules for your domain
3. ✅ Review the workflow guide if available

### During Development
1. ✅ Follow patterns from the rules
2. ✅ Use examples as templates
3. ✅ Check cross-referenced rules

### Before Commit
1. ✅ Run `npm run typecheck` (must pass)
2. ✅ Review your changes against the rules
3. ✅ Check the debugging checklist if issues arise

---

## 📖 Stack Overview

**Current Versions** (see [`reference/stack-versions.md`](./reference/stack-versions.md) for details):
- Next.js: 15.5.4
- React: 19.1.0
- TypeScript: 5.9.3
- Supabase: 2.58.0
- Tailwind CSS: 4.1.14
- UI Library: shadcn/ui (all components pre-installed)

**Architecture**: Multi-tenant SaaS with multi-schema database (organization, catalog, scheduling, inventory, identity, communication, analytics, engagement)

---

## 🎯 Common Tasks

### Create a New Feature
1. Read: [`domains/architecture.md`](./domains/architecture.md)
2. Follow: [`workflows/new-feature.md`](./workflows/new-feature.md)
3. Pattern: `features/{portal}/{feature}/`

### Add Database Query
1. Read: [`domains/database.md`](./domains/database.md) + [`domains/security.md`](./domains/security.md)
2. File: `features/{portal}/{feature}/api/queries.ts`
3. Must have: `import 'server-only'` + auth check + public views

### Create Server Action
1. Read: [`domains/database.md`](./domains/database.md) + [`domains/security.md`](./domains/security.md)
2. File: `features/{portal}/{feature}/api/mutations.ts`
3. Must have: `'use server'` + auth check + Zod validation + `revalidatePath`

### Style UI Components
1. Read: [`domains/ui.md`](./domains/ui.md)
2. Use: shadcn/ui component slots (CardTitle, Badge, etc.) + globals.css design tokens
3. Never: Import `@/components/ui/typography` or edit `components/ui/*.tsx`, `app/globals.css`

---

## 💡 Pro Tips

1. **Use the index** - [`03-QUICK-SEARCH.md`](./03-QUICK-SEARCH.md) is searchable by rule code
2. **Follow cross-refs** - Rules link to related rules to build complete context
3. **Check examples** - Every rule includes working examples
4. **Use workflows** - Step-by-step guides prevent common mistakes
5. **Read detection** - "Detection" sections help you find violations
6. **Copy-paste fixes** - "Fix" sections provide ready-to-use code

---

## 🆘 Getting Help

**Issue** | **Resource**
--- | ---
"Where do I find rule X?" | [`03-QUICK-SEARCH.md`](./03-QUICK-SEARCH.md)
"How do I accomplish task Y?" | [`04-TASK-GUIDE.md`](./04-TASK-GUIDE.md)
"My build is failing" | [`workflows/debugging-checklist.md`](./workflows/debugging-checklist.md)
"What files can I edit?" | [`reference/exclusions.md`](./reference/exclusions.md)

---

**Last Updated**: 2025-10-18 | **Version**: 5.0.0
