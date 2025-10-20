# Stack Patterns Index

**Quick navigation for ENORAE stack patterns. Each file is completely standalone and portable.**

---

## Overview

This directory contains **fully portable, standalone pattern files** for the ENORAE tech stack. Each file is self-contained with:

- ✅ Complete context and examples
- ✅ Detection commands inline
- ✅ Fix patterns included
- ✅ No external dependencies
- ✅ Copy-paste ready code
- ✅ Zero cross-references

**Philosophy:** Disciplined patterns with complete information in each file.

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.5.4 | App Router framework |
| React | 19.1.0 | UI library (Server/Client) |
| TypeScript | 5.9.3 | Strict type safety |
| Supabase | 2.47.15 | Database + Auth |
| Tailwind CSS | 4.1.14 | Styling framework |
| shadcn/ui | Latest | Component library |
| React Hook Form | 7.63.0 | Form management |
| Zod | 3.25.76 | Schema validation |

---

## Pattern Files

### 1. [Architecture Patterns](./architecture-patterns.md)

**Main architecture file** - Feature structure, directives, file organization

**Topics:**
- Feature folder structure (portals, features, api, components)
- File organization (queries.ts, mutations.ts, types.ts, schema.ts)
- Server/client directives ('use server', 'use client', 'server-only')
- Page composition (5-15 line shells)
- Route handlers
- Shared code organization

**When to read:**
- Creating new features
- Organizing code structure
- Understanding project layout
- Setting up server/client boundaries

---

### 2. [Next.js Patterns](./nextjs-patterns.md)

**Next.js 15 App Router** - Routing, layouts, data fetching, metadata

**Topics:**
- App Router fundamentals
- File conventions (page.tsx, layout.tsx, loading.tsx, error.tsx)
- Routing patterns (dynamic, catch-all, route groups, parallel routes)
- Layout patterns (root, nested, templates)
- Loading and error states
- Metadata and SEO
- Script loading
- Data fetching (server components, parallel, sequential, streaming)
- Caching and revalidation

**When to read:**
- Creating pages and routes
- Setting up layouts
- Implementing metadata
- Data fetching strategies
- Caching configuration

---

### 3. [React Patterns](./react-patterns.md)

**React 19** - Server/Client components, hooks, composition

**Topics:**
- Server vs Client Components
- Component patterns (functional, async, children, render props, compound)
- Hooks usage (useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer)
- Custom hooks
- Event handlers (onClick, onChange, onSubmit)
- Composition patterns (container/presentational, HOC, slots)
- Form patterns (controlled, uncontrolled, server actions)
- Performance patterns (React.memo, lazy loading, code splitting)

**When to read:**
- Building React components
- Using hooks
- Managing state
- Performance optimization
- Component composition

---

### 4. [TypeScript Patterns](./typescript-patterns.md)

**TypeScript 5.9 strict mode** - Types, generics, utilities

**Topics:**
- Strict mode configuration
- Type definitions (interfaces, type aliases, function types, component props)
- Generic patterns (basic, constraints, React components)
- Database type usage (Supabase generated types)
- Utility types (Partial, Pick, Omit, Record, ReturnType, etc.)
- Custom utility types
- Type guards (typeof, instanceof, custom, nullish)
- Discriminated unions
- Advanced patterns (branded types, template literals, conditional types, mapped types)

**When to read:**
- Writing type-safe code
- Using generics
- Working with database types
- Type transformations
- Advanced type patterns

---

### 5. [Supabase Patterns](./supabase-patterns.md)

**Supabase + Next.js SSR** - Auth, queries, mutations, RLS

**Topics:**
- Client creation (server, client-side, middleware)
- Authentication patterns (getUser, verifySession, sign in/up/out, OAuth)
- Query patterns (public views, filters, joins, single records)
- Mutation patterns (insert, update, delete, upsert)
- RLS patterns (tenant-scoped policies, multi-tenant filtering)
- Type safety (generated types from database)
- Error handling
- Real-time subscriptions
- Storage patterns (upload, download)

**When to read:**
- Setting up auth
- Querying database
- Writing mutations
- RLS policy patterns
- File uploads

---

### 6. [UI Patterns](./ui-patterns.md)

**shadcn/ui + Tailwind CSS 4** - Components, themes, design tokens

**Topics:**
- shadcn/ui philosophy (copy, composable, accessible, themeable)
- Component composition (Card, Dialog, Alert, Button, Badge, Table, Tabs, Accordion)
- Design tokens (color, spacing, typography)
- Theme system (dark mode, theme provider, theme toggle)
- Icon usage (lucide-react)
- Toast notifications (sonner)
- Form components (Input, Select, Checkbox, Radio, DatePicker)
- Layout components (Grid, Flexbox, Container)

**When to read:**
- Building UI components
- Using shadcn/ui
- Styling with Tailwind
- Implementing dark mode
- Form UI components

---

### 7. [Form Patterns](./forms-patterns.md)

**React Hook Form + Zod** - Validation, server actions, advanced forms

**Topics:**
- Form setup (useForm, zodResolver, shadcn Form components)
- Zod schema patterns (string, number, array, object, conditional, union)
- Form component patterns (Input, Textarea, Select, Checkbox, Radio, DatePicker)
- Validation patterns (real-time, async, cross-field, dynamic)
- Server action integration
- Error handling (display errors, set field errors)
- Advanced patterns (multi-step forms, dynamic field arrays)

**When to read:**
- Creating forms
- Validating user input
- Integrating with server actions
- Complex form patterns
- Multi-step wizards

---

### 8. [File Organization Patterns](./file-organization-patterns.md)

**Feature folder scaling** - When to split files, how to maintain structure

**Topics:**
- File size thresholds (when to split)
- API file organization (single file → grouped → domain subfolders)
- Component organization (flat → grouped → feature subcomponents)
- Types and schemas organization
- Index re-export patterns
- Migration strategies (consolidating over-split files)
- Anti-patterns to avoid

**When to read:**
- Files are getting too large (>300 lines)
- Deciding whether to split a file
- Restructuring over-engineered features
- Understanding when to add folders vs keep files flat
- Migrating from deep nesting to canonical structure

---

## Quick Decision Tree

### "I need to..."

**Create a new feature**
→ Read: [Architecture Patterns](./architecture-patterns.md)

**Add a new page**
→ Read: [Next.js Patterns](./nextjs-patterns.md) + [Architecture Patterns](./architecture-patterns.md)

**Build an interactive component**
→ Read: [React Patterns](./react-patterns.md) + [UI Patterns](./ui-patterns.md)

**Write type-safe code**
→ Read: [TypeScript Patterns](./typescript-patterns.md)

**Query the database**
→ Read: [Supabase Patterns](./supabase-patterns.md)

**Create a form**
→ Read: [Form Patterns](./forms-patterns.md) + [UI Patterns](./ui-patterns.md)

**Style UI components**
→ Read: [UI Patterns](./ui-patterns.md)

**Handle authentication**
→ Read: [Supabase Patterns](./supabase-patterns.md)

**Optimize performance**
→ Read: [React Patterns](./react-patterns.md) + [Next.js Patterns](./nextjs-patterns.md)

**Decide when to split large files**
→ Read: [File Organization Patterns](./file-organization-patterns.md)

**Restructure over-engineered features**
→ Read: [File Organization Patterns](./file-organization-patterns.md) + [Architecture Patterns](./architecture-patterns.md)

---

## File Reading Order (Recommended)

### For New Developers

1. **[Architecture Patterns](./architecture-patterns.md)** - Understand project structure
2. **[Next.js Patterns](./nextjs-patterns.md)** - Learn App Router fundamentals
3. **[React Patterns](./react-patterns.md)** - Master component patterns
4. **[TypeScript Patterns](./typescript-patterns.md)** - Write type-safe code
5. **[Supabase Patterns](./supabase-patterns.md)** - Work with database
6. **[UI Patterns](./ui-patterns.md)** - Build beautiful UIs
7. **[Form Patterns](./forms-patterns.md)** - Handle user input
8. **[File Organization Patterns](./file-organization-patterns.md)** - Manage file size and structure

### For Quick Reference

Jump directly to the pattern file you need. Each file is standalone.

---

## Pattern Principles

### 1. Standalone & Portable

Every file contains:
- Complete context (no assumptions)
- Full code examples (copy-paste ready)
- Detection commands (find violations)
- Fix examples (before/after)
- No external dependencies

### 2. Discipline & Consistency

- Follow patterns exactly
- Use detection commands regularly
- Fix violations immediately
- No shortcuts or workarounds

### 3. Type Safety First

- TypeScript strict mode always
- No `any` type
- No `@ts-ignore`
- Use generated database types
- Validate with Zod

### 4. Security By Default

- Always verify auth
- Query from public views
- Write to schema tables
- Use RLS policies
- Validate all inputs

---

## Common Tasks

### Task: Create a New Feature

1. Read [Architecture Patterns](./architecture-patterns.md)
2. Create folder: `features/{portal}/{feature}/`
3. Add structure: `components/`, `api/`, `types.ts`, `schema.ts`, `index.tsx`
4. Write queries in `api/queries.ts` (with `'server-only'`)
5. Write mutations in `api/mutations.ts` (with `'use server'`)
6. Create UI in `components/`
7. Export from `index.tsx`

### Task: Add Database Query

1. Read [Supabase Patterns](./supabase-patterns.md)
2. Add function to `api/queries.ts`
3. Add `import 'server-only'` at top
4. Verify auth with `getUser()`
5. Query from public view
6. Filter by tenant/user ID
7. Handle errors

### Task: Create a Form

1. Read [Form Patterns](./forms-patterns.md)
2. Define Zod schema in `schema.ts`
3. Create form component with `useForm` + `zodResolver`
4. Add shadcn Form fields
5. Handle submission with server action
6. Display success/error feedback

### Task: Build UI Component

1. Read [UI Patterns](./ui-patterns.md)
2. Import shadcn primitives from `@/components/ui/*`
3. Use complete compositions (all subcomponents)
4. Apply design tokens for colors
5. Use layout classes only (no slot customization)
6. Test accessibility

---

## Validation Commands

### Run Before Every Commit

```bash
# TypeScript type check
npm run typecheck

# Find architecture violations
rg "import 'server-only'" features/**/api/queries.ts -l --invert-match
rg "'use server'" features/**/api/mutations.ts -l --invert-match

# Find missing auth checks
rg "export async function" features/**/api -A 5 | grep -L "getUser\|verifySession"

# Find Typography imports (should be removed)
rg "from '@/components/ui/typography'" --type tsx

# Find arbitrary colors
rg "#[0-9a-fA-F]{3,6}" --type tsx | grep -v "app/globals.css"

# Find any usage
rg "\bany\b" --type ts --type tsx | grep -v "node_modules"
```

---

## Key Differences from docs/rules

| Aspect | docs/rules | docs/stack-patterns |
|--------|-----------|---------------------|
| **Purpose** | Enforce code quality standards | Teach stack patterns |
| **Audience** | AI agents (automated checking) | Developers (learning) |
| **Structure** | Domain-based with rule codes | Technology-based standalone files |
| **Cross-refs** | Heavy cross-referencing | Zero cross-references |
| **Format** | Strict rule format with metadata | Narrative with examples |
| **Usage** | Automated violation detection | Manual pattern reference |

**Use docs/rules for:** What not to do (violations, automation)
**Use docs/stack-patterns for:** How to do it (patterns, examples)

---

## File Portability Guarantee

Each pattern file can be:
- ✅ Read independently without context
- ✅ Copied to another project
- ✅ Shared with team members
- ✅ Used as training material
- ✅ Referenced without internet

**No links between pattern files. Each is complete.**

---

## Contributing

When updating pattern files:

1. Keep each file standalone (no cross-references)
2. Include complete context at the top
3. Add working code examples
4. Provide detection commands
5. Show before/after fixes
6. Update version numbers
7. Test all code examples

---

## Questions?

**Where should I start?**
→ [Architecture Patterns](./architecture-patterns.md)

**Which file covers [topic]?**
→ Use the decision tree above or search this index

**Can I read files in any order?**
→ Yes! Each file is standalone. Recommended order for beginners is listed above.

**Are these patterns mandatory?**
→ Yes. These are the disciplined patterns for ENORAE. Follow exactly.

---

**Last Updated:** 2025-10-20
**Pattern Files:** 8
**Total Patterns:** 250+
**Portability:** 100% standalone
