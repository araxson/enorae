# ENORAE Stack Patterns - Complete Index

**Complete, standalone pattern files for the ENORAE tech stack.**

All pattern files are 100% standalone with complete context, full examples, and no external dependencies.

---

## Quick Start

**New to the project?** Start here:
1. Read [Architecture Patterns](#architecture-patterns) for overall structure
2. Read [UI Patterns](#ui-patterns) for component guidelines
3. Read [Supabase Patterns](#supabase-patterns) for database access

**Building a feature?** Read these in order:
1. Architecture Patterns → Feature structure
2. Next.js Patterns → Routing and pages
3. React Patterns → Components and state
4. Supabase Patterns → Data access
5. Forms Patterns → User input
6. TypeScript Patterns → Type safety
7. UI Patterns → Component library

---

## Pattern Files

### Architecture Patterns
**File:** `architecture-patterns.md`

**When to read:**
- Starting a new feature
- Organizing code structure
- Setting up auth guards
- Implementing caching

**Key topics:**
- Feature folder structure
- Server/client separation
- Auth patterns (getUser vs getSession)
- Middleware configuration
- Cache strategies
- Function-level caching (`'use cache'` + `cacheTag`)
- `updateTag` vs `revalidateTag` usage
- Params as promises (Next.js 15)

**Critical rules:**
- Pages are 5-12 line shells
- Always use `getUser()` for auth (never `getSession()`)
- Middleware only refreshes sessions
- `queries.ts` must have `import 'server-only'`
- `mutations.ts` must start with `'use server'`
- `updateTag` is **Server Action only** (use `revalidateTag` elsewhere)

---

### Next.js Patterns
**File:** `nextjs-patterns.md`

**When to read:**
- Creating new pages/routes
- Setting up layouts
- Implementing metadata
- Working with Server Actions
- Configuring caching

**Key topics:**
- App Router fundamentals
- File conventions (layout, page, loading, error)
- Routing (dynamic, catch-all, parallel)
- Metadata patterns
- Server Actions integration
- Data fetching and streaming
- Cache revalidation
- Cache tagging (`cacheTag`, `updateTag`, `revalidateTag`)
- Client router cache (`experimental.staleTimes`)

**Critical rules:**
- `params` and `searchParams` are promises (must await)
- Server Components by default
- Use `Suspense` for streaming
- No Pages Router patterns (getServerSideProps, etc.)

---

### React Patterns
**File:** `react-patterns.md`

**When to read:**
- Building components
- Managing state
- Handling forms and events
- Using React 19 hooks
- Optimizing performance

**Key topics:**
- Server vs Client Components
- React 19 hooks (`useActionState`, `useOptimistic`, `use`)
- Component composition patterns
- Event and form handling
- Suspense and streaming
- Performance optimization

**Critical rules:**
- Server Components by default (no `'use client'` unless needed)
- Client Components for hooks/events only
- Use `useActionState` for Server Action forms
- Always cleanup subscriptions in `useEffect`

---

### TypeScript Patterns
**File:** `typescript-patterns.md`

**When to read:**
- Writing type-safe code
- Working with Supabase types
- Creating schemas
- Using generics
- Debugging type errors

**Key topics:**
- Strict mode configuration
- Supabase type integration
- Modern TS features (const type params, satisfies, using)
- Generic patterns
- Utility types
- Type inference from Zod

**Critical rules:**
- NO `any` types (ever)
- NO type suppressions (`@ts-ignore`, `@ts-expect-error`)
- Use generated Supabase types
- Infer types from Zod schemas
- All detection commands must pass

---

### Supabase Patterns
**File:** `supabase-patterns.md`

**When to read:**
- Accessing database
- Implementing auth
- Writing queries/mutations
- Setting up real-time
- Handling storage
- Debugging database issues

**Key topics:**
- Client creation (server, browser, middleware)
- Authentication patterns
- Query patterns (views, RLS, type safety)
- Mutation patterns (schema tables, revalidation)
- Real-time subscriptions
- Storage patterns
- Error handling

**Critical rules:**
- Use `createClient()` from lib/supabase/server
- Always verify auth with `getUser()`
- Read from views, write to schema tables
- Filter by tenant/user ID
- Call `revalidatePath()` after mutations

---

### Forms Patterns
**File:** `forms-patterns.md`

**When to read:**
- Creating forms
- Validating input
- Handling submissions
- Showing errors
- Working with file uploads
- Building multi-step wizards

**Key topics:**
- Zod schema patterns
- React Hook Form composition
- Server Action integration
- Error handling and messaging
- Dynamic field arrays
- File uploads

**Critical rules:**
- Every form has Zod schema + zodResolver
- Use shadcn Form components (FormField, FormItem, etc.)
- Server Actions return structured state
- Use `useFormStatus` or `useActionState` for pending UI
- Never use `any` in form types

---

### UI Patterns
**File:** `ui-patterns.md`

**When to read:**
- Building UI components
- Styling elements
- Using shadcn/ui
- Creating layouts
- Theming
- Accessibility

**Key topics:**
- shadcn/ui component library (53 components)
- Composition patterns (Card, Alert, Dialog, etc.)
- Design tokens (colors, spacing)
- Form components
- Icons (Lucide)
- Toasts (Sonner)
- Theme toggle

**Critical rules:**
- NEVER import from `@/components/ui/typography`
- NEVER customize slot styling (CardTitle, etc.)
- NEVER use arbitrary colors/spacing
- ALWAYS use shadcn primitives
- NEVER edit `components/ui/*` files
- Component slots render plain text only

---

### File Organization Patterns
**File:** `file-organization-patterns.md`

**When to read:**
- Structuring large features
- Splitting files
- Organizing components
- Managing file size
- Refactoring code

**Key topics:**
- Canonical feature structure
- File size thresholds
- Splitting strategies (API, components, types, schemas)
- Index re-export patterns
- Anti-patterns to avoid
- Migration guide

**Critical rules:**
- Start with single files
- Split at 300 lines (queries/mutations)
- Split at 200 lines (components)
- Max 2 levels of nesting
- Always use index.ts for re-exports
- Import from index, not subfiles

---

## Quick Reference by Task

### Creating a New Feature

1. **Architecture Patterns** - Feature folder structure
2. **File Organization Patterns** - Start simple, split when needed
3. **TypeScript Patterns** - Create types.ts with Supabase types
4. **Forms Patterns** - Create schema.ts with Zod schemas
5. **Supabase Patterns** - Create api/queries.ts and api/mutations.ts
6. **React Patterns** - Create components/
7. **UI Patterns** - Use shadcn/ui primitives
8. **Next.js Patterns** - Create page.tsx (5-12 lines)

### Adding a New Page

1. **Next.js Patterns** - File conventions, routing, metadata
2. **Architecture Patterns** - Page as thin shell pattern
3. **React Patterns** - Server Component composition
4. **UI Patterns** - Layout with shadcn/ui

### Building a Form

1. **Forms Patterns** - Complete form workflow
2. **TypeScript Patterns** - Type inference from Zod
3. **React Patterns** - useActionState hook
4. **UI Patterns** - Form components
5. **Supabase Patterns** - Server Action mutations

### Fetching Data

1. **Supabase Patterns** - Query patterns, auth guards
2. **Architecture Patterns** - queries.ts with 'server-only'
3. **React Patterns** - Server Components, Suspense
4. **Next.js Patterns** - Streaming, caching
5. **TypeScript Patterns** - Supabase type integration

### Mutating Data

1. **Supabase Patterns** - Mutation patterns, revalidation
2. **Architecture Patterns** - mutations.ts with 'use server'
3. **Forms Patterns** - Server Action integration
4. **React Patterns** - useActionState, useOptimistic
5. **Next.js Patterns** - Cache invalidation

### Styling Components

1. **UI Patterns** - shadcn/ui composition (READ THIS FIRST)
2. **React Patterns** - Component composition
3. **Next.js Patterns** - Layout patterns

### Debugging Issues

| Issue | Read this pattern |
|-------|------------------|
| Type errors | TypeScript Patterns |
| Auth not working | Architecture Patterns, Supabase Patterns |
| Data not loading | Supabase Patterns, Next.js Patterns |
| Form validation | Forms Patterns |
| UI not styled correctly | UI Patterns |
| File too large | File Organization Patterns |
| Cache not updating | Architecture Patterns, Next.js Patterns |

---

## Technology Versions

| Technology | Version | Pattern File |
|-----------|---------|--------------|
| Next.js | 15.5.4 | nextjs-patterns.md |
| React | 19.1.0 | react-patterns.md |
| TypeScript | 5.9.3 | typescript-patterns.md |
| Supabase | 2.47.15 | supabase-patterns.md |
| @supabase/ssr | 0.6.1 | supabase-patterns.md |
| React Hook Form | 7.63.0 | forms-patterns.md |
| Zod | 3.25.76 | forms-patterns.md |
| lucide-react | 0.544.0 | ui-patterns.md |
| shadcn/ui | Latest | ui-patterns.md |
| next-themes | 0.4.6 | ui-patterns.md |
| sonner | 2.0.7 | ui-patterns.md |

---

## Common Workflows

### Daily Development
1. Check task requirements
2. Read relevant pattern file(s)
3. Follow patterns exactly
4. Run detection commands
5. Verify build passes

### Code Review Prep
1. Run all detection commands
2. Verify architectural rules
3. Check type safety
4. Validate UI patterns
5. Review auth guards

### Onboarding New Developers
**Day 1:** Read all pattern files in order
**Day 2:** Build sample feature following patterns
**Day 3:** Code review with team
**Ongoing:** Reference patterns as needed

---

## Pattern Philosophy

### Standalone & Complete
Every pattern file contains:
- Complete examples (copy-paste ready)
- Detection commands (verify compliance)
- Pre-commit checklists (ensure quality)
- Common pitfalls (avoid mistakes)
- Real-world examples (learn by example)

### No Cross-References Required
Each file is fully portable. You can:
- Read any file independently
- Share files with team members
- Use files as documentation
- Reference files in code reviews

### Violation-Free Development
Run detection commands before every commit:
- Zero violations required
- Automated checks
- Clear error messages
- Easy fixes

---

## Getting Help

**Pattern not clear?** → Re-read the specific section
**Missing example?** → Check Complete Examples section
**Still stuck?** → Ask team or check CLAUDE.md
**Found issue?** → Update pattern file and commit

---

## Maintenance

**When to update patterns:**
- After upgrading dependencies
- When discovering new best practices
- After team code reviews
- When patterns feel outdated

**How to update:**
1. Use Context7 MCP for latest docs
2. Update relevant pattern files
3. Run detection commands on codebase
4. Fix any violations found
5. Commit updated patterns

**Pattern update frequency:**
- Major version bumps: Update immediately
- Minor version bumps: Update within sprint
- Best practice changes: Update as discovered
- Team feedback: Update weekly

---

## Key Principles

1. **Patterns over preferences** - Follow documented patterns, not personal style
2. **Detection over memory** - Run commands to verify, don't trust recall
3. **Examples over explanation** - Show code, not just theory
4. **Automation over review** - Catch violations before code review
5. **Consistency over cleverness** - Predictable beats innovative

---

**Last Updated:** 2025-10-21
**Pattern Files:** 8 files, 100% standalone
**Maintained by:** Development Team

Stay within these patterns to keep ENORAE consistent, accessible, secure, and maintainable.
