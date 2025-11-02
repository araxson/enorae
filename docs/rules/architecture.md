# Architecture Rules - AI Quick Reference

**Purpose**: This document defines universal codebase architecture patterns. Follow these rules exactly when creating or modifying code.

---

## Table of Contents
1. [Quick Decision Trees](#quick-decision-trees)
2. [File Size Limits](#file-size-limits)
3. [Naming Conventions](#naming-conventions)
4. [Feature Structure Patterns](#feature-structure-patterns)
5. [lib/ Organization](#lib-organization)
6. [Validation Checklist](#validation-checklist)

---

## Quick Decision Trees

### Where Should This File Go?

```
Is it infrastructure/technical (auth, cache, validation)?
├─ YES → lib/[category]/
└─ NO → Is it feature-specific business logic?
    ├─ YES → Is it used by all modules/portals?
    │   ├─ YES → features/shared/[feature]/
    │   └─ NO → features/[portal]/[feature]/
    └─ NO → Is it a UI component?
        ├─ YES → Is it from UI library (shadcn/ui, MUI, etc.)?
        │   ├─ YES → components/ui/ (NEVER EDIT)
        │   └─ NO → features/[portal]/[feature]/components/
        └─ NO → Is it a page?
            └─ YES → app/([portal])/[route]/page.tsx (< 15 lines)
```

### What Pattern Should This Feature Use?

```
Count total files needed:
├─ < 5 files → Pattern 1: Small Feature (flat api structure)
├─ 5-15 files → Pattern 2: Medium Feature (organized directories)
├─ > 15 files → Pattern 3: Large Feature (nested directories)
└─ > 30 files → SPLIT into multiple smaller features
```

### What File Naming Should I Use?

```
Is the file in an organized directory (api/queries/, api/mutations/)?
├─ YES → Use domain name: [domain].ts (NO suffix)
└─ NO → Is it a flat api structure?
    ├─ YES → Use plural: queries.ts, mutations.ts
    └─ NO → Is it multi-word?
        ├─ YES → Use kebab-case: [feature-component].tsx
        └─ NO → Use lowercase: schema.ts
```

---

## File Size Limits

### Absolute Limits (Split Immediately When Exceeded)

| File Type | Hard Limit | Action When Exceeded |
|-----------|-----------|----------------------|
| **Index files** | 50 lines | Create domain-specific index files |
| **Components** | 200 lines | Extract sub-components or sections |
| **Queries/Mutations** | 300 lines | Split by domain or action |
| **Helpers** | 200 lines | Group into separate helper files |
| **Hooks/Utils** | 150 lines | Split by concern |
| **Types** | 200 lines | Create domain-specific type files |
| **Schemas** | 250 lines | Split into separate schema files |
| **Constants** | 100 lines | Group by domain |
| **Pages** | 15 lines | Extract to feature component |

### File Size Decision Logic

```typescript
// Pseudo-code for when to split files
if (file.type === 'index' && file.lines > 50) {
  action = 'Create domain-specific index files'
} else if (file.type === 'component' && file.lines > 200) {
  action = 'Extract sub-components or create sections'
} else if (file.type === 'query' && file.lines > 300) {
  action = 'Split by domain ([domain-1].ts, [domain-2].ts, etc.)'
} else if (file.type === 'mutation' && file.lines > 300) {
  action = 'Split by action (create.ts, update.ts, delete.ts)'
}
```

---

## Naming Conventions

### File Naming Rules

#### ✅ ALWAYS Use Kebab-Case
```
✅ [feature-component].tsx
✅ [feature-analytics].ts
✅ [user-preferences].ts
✅ [entity-form].tsx
```

#### ❌ NEVER Use These Patterns
```
❌ [featureComponent].tsx         (camelCase)
❌ [FeatureComponent].tsx         (PascalCase)
❌ [feature_component].tsx        (snake_case)
❌ [feature].queries.ts           (dots - except for special files)
❌ [feature]-queries.ts           (suffix in organized directory)
```

#### Exceptions - When to Use Dots
```
✅ [entity].test.ts          (test files)
✅ [entity].spec.ts          (spec files)
✅ database.types.ts         (auto-generated types)
✅ [config-name].config.ts   (config files)
```

### Directory Naming Rules

#### ✅ ALWAYS Use Kebab-Case
```
✅ api/queries/
✅ api/mutations/
✅ [feature-analytics]/
✅ [feature-insights]/
```

#### ❌ NEVER Use These
```
❌ [featureAnalytics]/     (camelCase)
❌ [feature_analytics]/    (snake_case)
❌ query/                  (singular - use queries/)
❌ mutation/               (singular - use mutations/)
```

### Function Naming Rules

#### ✅ camelCase
```typescript
✅ get[Entity]Dashboard()
✅ fetch[Entity]ByDate()
✅ create[Entity]()
✅ update[Entity]Settings()
```

#### ❌ NEVER Use These
```typescript
❌ Get[Entity]Dashboard()   (PascalCase)
❌ get_[entity]_dashboard() (snake_case)
❌ fetch-[entity]()         (kebab-case)
```

### Component Naming Rules

#### ✅ File: kebab-case, Export: PascalCase
```typescript
// ✅ [feature-card].tsx
export function [FeatureCard]() { ... }

// ✅ [entity-form].tsx
export function [EntityForm]() { ... }
```

#### ❌ NEVER Mismatch
```typescript
// ❌ [FeatureCard].tsx
export function [featureCard]() { ... }  // Wrong export name

// ❌ [feature-card].tsx
export function [feature_card]() { ... } // Wrong export name
```

### API File Naming

#### In Organized Directories (api/queries/, api/mutations/)

```
✅ CORRECT - No suffix, domain-based naming
api/
├── queries/
│   ├── index.ts
│   ├── [domain-1].ts        # ✅ Domain name
│   ├── [domain-2].ts        # ✅ Domain name
│   └── [domain-3].ts        # ✅ Domain name
└── mutations/
    ├── index.ts
    ├── create.ts            # ✅ Action name
    ├── update.ts            # ✅ Action name
    └── delete.ts            # ✅ Action name

❌ WRONG - Suffixes in organized directories
api/
├── queries/
│   ├── [domain]-queries.ts  # ❌ Redundant suffix
│   └── [domain].queries.ts  # ❌ Redundant suffix
└── mutations/
    └── create.mutations.ts  # ❌ Redundant suffix
```

#### In Flat Structure (Small Features Only)

```
✅ CORRECT - Plural at root
api/
├── queries.ts               # ✅ Plural
└── mutations.ts             # ✅ Plural

❌ WRONG
api/
├── query.ts                 # ❌ Singular
└── mutation.ts              # ❌ Singular
```

---

## Feature Structure Patterns

### Pattern Selection Logic

```
Step 1: Count files needed
Step 2: Determine module/portal ([portal-name])
Step 3: Choose pattern:
  - < 5 files → Pattern 1: Small Feature
  - 5-15 files → Pattern 2: Medium Feature
  - > 15 files → Pattern 3: Large Feature
  - > 30 files → STOP: Split into multiple features
```

### Pattern 1: Small Feature (< 5 files)

**When to use:**
- Feature has less than 5 total files
- Single query file < 300 lines
- Single mutation file < 300 lines
- Single component or simple UI

**Structure:**
```
features/[portal]/[feature]/
├── api/
│   ├── queries.ts                      # All queries (< 300 lines)
│   ├── mutations.ts                    # All mutations (< 300 lines)
│   └── schema.ts                       # Validation schemas (< 250 lines)
├── components/
│   └── [component].tsx                 # Component (< 200 lines)
└── index.tsx                           # Export (< 50 lines)
```

**Example:**
```
features/[portal]/[feature]/
├── api/
│   ├── queries.ts           # get[Entity](), check[Entity]()
│   ├── mutations.ts         # add[Entity](), remove[Entity]()
│   └── schema.ts            # [entity]Schema
├── components/
│   └── [feature-button].tsx
└── index.tsx
```

**Split trigger:** When any file exceeds 300 lines → Move to Pattern 2

---

### Pattern 2: Medium Feature (5-15 files)

**When to use:**
- Feature has 5-15 files
- Multiple query domains or mutation actions
- Multiple components
- Needs organized directories

**Structure:**
```
features/[portal]/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [domain].ts                 # Domain queries (< 300 lines)
│   │   └── helpers.ts                  # Query helpers (< 200 lines)
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [action].ts                 # Action mutations (< 300 lines)
│   │   └── helpers.ts                  # Mutation helpers (< 200 lines)
│   ├── types.ts                        # API types (< 200 lines)
│   ├── schema.ts                       # Validation schemas (< 250 lines)
│   └── constants.ts                    # Constants (< 100 lines)
├── components/
│   ├── index.ts                        # Re-exports ALL (< 50 lines)
│   ├── [feature]-[component].tsx       # Components (< 200 lines)
│   └── [component].tsx                 # Components (< 200 lines)
├── hooks/
│   └── use-[hook].ts                   # Hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**Example:**
```
features/[portal]/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts         # Re-exports
│   │   ├── dashboard.ts     # getDashboard(), getMetrics()
│   │   ├── list.ts          # getList(), getById()
│   │   └── helpers.ts       # Formatters, transformers
│   ├── mutations/
│   │   ├── index.ts
│   │   ├── create.ts        # create[Entity]()
│   │   ├── update.ts        # update[Entity](), updateStatus()
│   │   └── delete.ts        # delete[Entity]()
│   ├── types.ts
│   ├── schema.ts
│   └── constants.ts
├── components/
│   ├── index.ts
│   ├── [feature]-table.tsx
│   ├── [feature]-form.tsx
│   └── [feature]-view.tsx
├── hooks/
│   └── use-[feature].ts
└── index.tsx
```

**Split trigger:** When feature exceeds 15 files → Move to Pattern 3

---

### Pattern 3: Large Feature (> 15 files)

**When to use:**
- Feature has more than 15 files
- Multiple query/mutation domains
- Complex component hierarchy
- Needs nested organization

**Structure:**
```
features/[portal]/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [domain-1]/
│   │   │   ├── index.ts                # Domain exports (< 50 lines)
│   │   │   ├── [specific].ts           # Specific queries (< 250 lines)
│   │   │   └── helpers.ts              # Domain helpers (< 200 lines)
│   │   └── [domain-2]/
│   │       └── (similar structure)
│   ├── mutations/
│   │   ├── index.ts
│   │   ├── [action-group]/
│   │   │   ├── index.ts
│   │   │   └── [specific].ts           # Specific mutations (< 250 lines)
│   │   └── shared.ts                   # Shared helpers (< 200 lines)
│   ├── types.ts                        # Shared types (< 200 lines)
│   ├── schema.ts                       # Shared schemas (< 250 lines)
│   └── constants.ts                    # Constants (< 100 lines)
├── components/
│   ├── index.ts                        # Re-exports ALL (< 50 lines)
│   ├── [section-1]/
│   │   ├── index.ts                    # Section exports (< 50 lines)
│   │   └── [component].tsx             # Components (< 200 lines)
│   └── [section-2]/
│       └── (similar structure)
├── hooks/
│   └── use-[hook].ts                   # Hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**Example:**
```
features/[portal]/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts
│   │   ├── [domain-1]/
│   │   │   ├── index.ts
│   │   │   ├── overview.ts
│   │   │   ├── breakdown.ts
│   │   │   └── helpers.ts
│   │   ├── [domain-2]/
│   │   │   ├── index.ts
│   │   │   ├── metrics.ts
│   │   │   └── trends.ts
│   │   └── [domain-3]/
│   │       └── (similar structure)
│   ├── mutations/
│   │   └── (similar nested structure)
│   ├── types.ts
│   └── schema.ts
├── components/
│   ├── index.ts
│   ├── [section-1]/
│   │   ├── [section-1]-chart.tsx
│   │   └── [section-1]-breakdown.tsx
│   ├── [section-2]/
│   │   └── [section-2]-chart.tsx
│   └── dashboard.tsx
└── index.tsx
```

**Split trigger:** When feature exceeds 30 files → Split into multiple features

---

### Pattern 4: Marketing/Content Features

**When to use:**
- Marketing/landing pages
- Content-heavy pages
- Section-based structure

**Structure:**
```
features/marketing/[page]/
├── sections/
│   └── [section-name]/
│       ├── [section-name].tsx          # Section component (< 150 lines)
│       ├── [section-name].data.ts      # Section content (< 200 lines)
│       ├── [section-name].types.ts     # Section types (< 100 lines)
│       └── index.ts                    # Export (< 20 lines)
├── [page]-page.tsx                     # Main page (< 100 lines)
├── [page].seo.ts                       # SEO metadata (< 50 lines)
├── [page].types.ts                     # Page types (< 150 lines)
└── index.ts                            # Export (< 30 lines)
```

**Example:**
```
features/marketing/[page]/
├── sections/
│   ├── hero/
│   │   ├── hero.tsx
│   │   ├── hero.data.ts
│   │   └── index.ts
│   ├── features/
│   │   ├── features.tsx
│   │   ├── features.data.ts
│   │   └── index.ts
│   └── [section-3]/
│       └── (similar structure)
├── [page]-page.tsx
├── [page].seo.ts
└── index.ts
```

---

### Pattern 5: Auth Features

**When to use:**
- Authentication pages (login, signup, reset password)
- Form-heavy features
- Validation-focused features

**Structure:**
```
features/auth/[page]/
├── api/
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [action].ts                 # Action mutation (< 300 lines)
│   └── schema.ts                       # Page schemas (< 250 lines)
├── components/
│   ├── [page]-form.tsx                 # Main form (< 200 lines)
│   ├── [page]-[field].tsx              # Form fields (< 200 lines)
│   └── [page]-feature.tsx              # Feature wrapper (< 200 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**Example:**
```
features/auth/[page]/
├── api/
│   ├── mutations/
│   │   ├── index.ts
│   │   └── [action].ts      # [action]Action()
│   └── schema.ts            # [page]Schema
├── components/
│   ├── [page]-form.tsx
│   ├── [page]-email-field.tsx
│   ├── [page]-password-field.tsx
│   └── [page]-feature.tsx
└── index.tsx
```

---

### Pattern 6: Shared Features

**When to use:**
- Features used by ALL modules/portals
- Cross-cutting concerns (audit, notifications, support)
- Generic utilities shared across modules

**CRITICAL:** Only put features here if used by MULTIPLE modules. Module-specific code stays in module folder.

**Structure:**
```
features/shared/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [query].ts                  # Query functions (< 300 lines)
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [action].ts                 # Mutation functions (< 300 lines)
│   └── types.ts                        # Shared types (< 200 lines)
├── components/
│   ├── index.ts                        # Re-exports (< 50 lines)
│   └── [component].tsx                 # Shared component (< 200 lines)
├── hooks/
│   └── use-[hook].ts                   # Shared hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**✅ BELONGS in shared:**
```
✅ features/shared/audit-log/        # Used by multiple modules
✅ features/shared/notifications/    # Used by all modules
✅ features/shared/support/          # Used by all modules
✅ features/shared/subscription/     # Used by multiple modules
```

**❌ DOES NOT BELONG in shared:**
```
❌ features/shared/[module-specific]/  # Module-specific → Move to features/[portal]/
❌ features/shared/[portal]-only/      # Portal-specific → Move to features/[portal]/
```

---

## Index File Re-Export Pattern

### ✅ CRITICAL RULE: Always Use Index Files

**Every directory with components, queries, or mutations MUST have an index.ts that re-exports everything.**

### Component Index Pattern

```typescript
// ✅ CORRECT - components/index.ts
export { [Component1] } from './[component-1]'
export { [Component2] } from './[component-2]'
export { [Component3] } from './[component-3]'
export { [Component4] } from './[component-4]'
// ... ALL components must be listed

// ✅ CORRECT - feature/index.tsx
import { [Component1], [Component2] } from './components'
export { [Component1], [Component2] } from './components'

// ❌ WRONG - Missing components in index
export { [Component1] } from './[component-1]'
// Missing: [Component2], [Component3], etc.

// ❌ WRONG - Bypassing index
import { [Component1] } from './components/[component-1]'
```

### Query Index Pattern

```typescript
// ✅ CORRECT - api/queries/index.ts
export { get[Entity]Dashboard, get[Entity]Metrics } from './dashboard'
export { get[Entity]List, get[Entity]ById } from './list'
export { get[Entity]Data, get[Entity]Breakdown } from './data'
// ... ALL queries must be listed

// ✅ CORRECT - feature/index.tsx or other feature file
import { get[Entity]Dashboard, get[Entity]List } from './api/queries'

// ❌ WRONG - Bypassing index
import { get[Entity]Dashboard } from './api/queries/dashboard'
```

### Mutation Index Pattern

```typescript
// ✅ CORRECT - api/mutations/index.ts
export { create[Entity] } from './create'
export { update[Entity], updateStatus } from './update'
export { delete[Entity] } from './delete'
// ... ALL mutations must be listed

// ✅ CORRECT - Using mutations
import { create[Entity], updateStatus } from './api/mutations'

// ❌ WRONG - Bypassing index
import { create[Entity] } from './api/mutations/create'
```

### Nested Directory Index Pattern

```typescript
// ✅ CORRECT - api/queries/[domain]/index.ts (nested directory)
export { get[Entity]Overview } from './overview'
export { get[Entity]Breakdown } from './breakdown'
export { get[Entity]Trends } from './trends'

// ✅ CORRECT - api/queries/index.ts (parent index)
export * from './[domain-1]'
export * from './[domain-2]'
export * from './[domain-3]'

// ✅ CORRECT - Using nested exports
import { get[Entity]Overview, get[Entity]Trends } from './api/queries'
```

---

## lib/ Organization

### Decision Tree: lib/ vs features/

```
Is this code infrastructure or business logic?
├─ Infrastructure (auth, cache, validation, db client) → lib/
└─ Business logic (domain-specific features) → features/

Is this code used by multiple features?
├─ YES → Is it technical infrastructure?
│   ├─ YES → lib/
│   └─ NO → Is it used by all modules?
│       ├─ YES → features/shared/
│       └─ NO → Keep in specific module
└─ NO → features/[portal]/[feature]/
```

### lib/ Structure

```
lib/
├── auth/                          # Authentication utilities
│   ├── guards.ts                  # Auth guards (< 200 lines, 'server-only')
│   ├── session.ts                 # Session management (< 200 lines)
│   ├── permissions/
│   │   ├── index.ts               # Re-exports (< 50 lines)
│   │   ├── roles.ts               # Role definitions (< 150 lines)
│   │   └── checks.ts              # Permission checks (< 200 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
├── db/                            # Database clients
│   ├── server.ts                  # Server client (< 100 lines)
│   ├── client.ts                  # Browser client (< 50 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
├── config/                        # Configuration
│   ├── env.ts                     # Environment validation (< 150 lines)
│   ├── constants.ts               # App constants (< 200 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
├── constants/                     # Application constants
│   ├── app.ts                     # App metadata (< 100 lines)
│   ├── routes.ts                  # Route constants (< 150 lines)
│   ├── statuses.ts                # Status enums (< 100 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
├── types/
│   ├── database.types.ts          # ❌ NEVER EDIT - Auto-generated
│   ├── common.ts                  # Common types (< 150 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
├── cache/                         # Query caching
│   ├── query-cache/
│   │   ├── with-cache.ts          # Cache wrapper (< 200 lines)
│   │   ├── configs.ts             # Cache configs (< 150 lines)
│   │   └── index.ts               # Re-exports (< 50 lines)
│   ├── query-keys.ts              # Cache key factory (< 200 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
├── middleware/                    # Middleware utilities
│   ├── rate-limit/
│   │   ├── check-rate-limit.ts    # Core logic (< 200 lines)
│   │   └── index.ts               # Re-exports (< 50 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
├── utils/                         # Utility functions
│   ├── validation.ts              # Validation helpers (< 150 lines)
│   ├── formatting.ts              # Format helpers (< 150 lines)
│   ├── dates/
│   │   ├── parse.ts               # Date parsing (< 150 lines)
│   │   ├── format.ts              # Date formatting (< 150 lines)
│   │   └── index.ts               # Re-exports (< 50 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
├── hooks/                         # Shared React hooks
│   ├── use-toast.ts               # Toast hook (< 150 lines)
│   ├── use-mobile.ts              # Mobile detection (< 100 lines)
│   └── index.ts                   # Re-exports (< 50 lines)
└── validations/                   # Shared validation schemas
    ├── common.ts                  # Common schemas (< 200 lines)
    └── index.ts                   # Re-exports (< 50 lines)
```

### lib/ Server Directives

```typescript
// ✅ 'server-only' - For server-side utilities
// lib/auth/guards.ts
import 'server-only'
import { createClient } from '@/lib/db/server'

export async function requireAuth() {
  const db = await createClient()
  const user = await db.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return { user, db }
}

// ✅ 'use server' - For server actions (Next.js, etc.)
// lib/db/server.ts
'use server'
import { createServerClient } from '[db-library]'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(config, { cookies: ... })
}

// ✅ No directive - For browser code
// lib/db/client.ts
import { createBrowserClient } from '[db-library]'

export function createClient() {
  return createBrowserClient(config)
}
```

### lib/ Rules

1. **✅ Infrastructure only** - No feature-specific business logic
2. **✅ Always use index.ts** - Every subdirectory must have one
3. **✅ Respect file limits** - Split files exceeding limits
4. **✅ Use server directives** - Add 'server-only' or 'use server' appropriately
5. **❌ NEVER edit auto-generated files** - Auto-generated by tooling
6. **✅ Kebab-case** - All files and folders
7. **✅ Import from index** - Never bypass index.ts files
8. **✅ Type-safe** - Use TypeScript strict mode

---

## Validation Checklist

### Before Committing Code - Run This Checklist

#### File Naming ✓
- [ ] All files use kebab-case (not camelCase, PascalCase, or snake_case)
- [ ] No `.queries.ts` or `.mutations.ts` suffixes in organized directories
- [ ] Plural for flat api files (`queries.ts`, `mutations.ts`)
- [ ] Dots only for special files (`.test.ts`, `.spec.ts`, auto-generated types)

#### File Size ✓
- [ ] Index files < 50 lines
- [ ] Components < 200 lines
- [ ] Queries/Mutations < 300 lines
- [ ] Helpers < 200 lines
- [ ] Hooks/Utils < 150 lines
- [ ] Types < 200 lines
- [ ] Schemas < 250 lines
- [ ] Constants < 100 lines
- [ ] Pages < 15 lines

#### Structure ✓
- [ ] Feature is in correct module/portal directory
- [ ] Using correct pattern (Small/Medium/Large) based on file count
- [ ] All components in `components/` directory
- [ ] All queries in `api/queries/` directory (or `api/queries.ts` for small features)
- [ ] All mutations in `api/mutations/` directory (or `api/mutations.ts` for small features)

#### Index Files ✓
- [ ] `components/index.ts` exports ALL components
- [ ] `api/queries/index.ts` exports ALL queries
- [ ] `api/mutations/index.ts` exports ALL mutations
- [ ] Feature `index.tsx` imports from `./components` (not direct paths)
- [ ] All index files < 50 lines

#### Server Directives ✓
- [ ] Query files have `import 'server-only'` at top (if server-only)
- [ ] Mutation files have `'use server'` at top (if server actions)
- [ ] Client components have `'use client'` at top (if client-side)
- [ ] No server directives in client-only code

#### lib/ Specific ✓
- [ ] No feature-specific business logic in `lib/`
- [ ] All `lib/` subdirectories have `index.ts`
- [ ] Using `import 'server-only'` for server-side utilities
- [ ] Using `'use server'` for server actions
- [ ] Never edited auto-generated files

#### Naming Conventions ✓
- [ ] Functions use camelCase (`get[Entity]Dashboard`, `create[Entity]`)
- [ ] Components export PascalCase (`[FeatureCard]`, `[EntityForm]`)
- [ ] Types use PascalCase (`[Entity]Data`, `[Entity]Status`)
- [ ] Constants use SCREAMING_SNAKE_CASE or const objects

#### Import Patterns ✓
- [ ] Importing from index files (not bypassing them)
- [ ] No circular dependencies
- [ ] Relative imports for feature-local files
- [ ] Absolute imports (`@/...`) for cross-feature imports

---

## Common Patterns & Examples

### Auth Guard Pattern

```typescript
// ✅ CORRECT - lib/auth/guards.ts
import 'server-only'
import { createClient } from '@/lib/db/server'

export async function requireAuth() {
  const db = await createClient()
  const user = await db.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return { user, db }
}
```

### Query Pattern

```typescript
// ✅ CORRECT - features/[portal]/[feature]/api/queries/[domain].ts
import 'server-only'
import { createClient } from '@/lib/db/server'

export async function get[Entity]Dashboard(entityId: string) {
  const db = await createClient()
  const user = await db.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Read from database
  const data = await db
    .from('[table_or_view]')
    .select('*')
    .eq('[entity]_id', entityId)
    .single()

  if (!data) throw new Error('Not found')
  return data
}
```

### Mutation Pattern

```typescript
// ✅ CORRECT - features/[portal]/[feature]/api/mutations/create.ts
'use server'

import { createClient } from '@/lib/db/server'
import { revalidatePath } from 'next/cache'
import { [entity]Schema } from '../schema'

export async function create[Entity](formData: FormData) {
  const db = await createClient()
  const user = await db.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Validate with schema
  const validated = [entity]Schema.parse({
    field1: formData.get('field1'),
    field2: formData.get('field2'),
    // ... other fields
  })

  // Write to database
  const data = await db
    .from('[table]')
    .insert(validated)
    .select()
    .single()

  if (!data) throw new Error('Failed to create')

  revalidatePath('/[route]')
  return data
}
```

### Component Pattern

```typescript
// ✅ CORRECT - features/[portal]/[feature]/components/[feature-card].tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface [Feature]CardProps {
  title: string
  value: string | number
  change?: string
}

export function [Feature]Card({ title, value, change }: [Feature]CardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && <p className="text-sm text-muted-foreground">{change}</p>}
      </CardContent>
    </Card>
  )
}
```

### Page Pattern (Thin Shell)

```tsx
// ✅ CORRECT - app/([portal])/[route]/page.tsx
import { Suspense } from 'react'
import { [Feature]Component } from '@/features/[portal]/[feature]'

export default async function [Feature]Page() {
  return (
    <Suspense fallback={null}>
      <[Feature]Component />
    </Suspense>
  )
}
```

---

## Error Prevention Guide

### ❌ Common Mistake 1: Suffixes in Organized Directories

```
❌ WRONG
api/
├── queries/
│   └── [domain]-queries.ts

✅ FIX: Remove suffix
api/
├── queries/
│   └── [domain].ts
```

### ❌ Common Mistake 2: Incomplete Index Files

```typescript
❌ WRONG - components/index.ts
export { [Component1] } from './[component-1]'
// Missing: [Component2], [Component3], etc.

✅ FIX: Export ALL components
export { [Component1] } from './[component-1]'
export { [Component2] } from './[component-2]'
export { [Component3] } from './[component-3]'
```

### ❌ Common Mistake 3: Bypassing Index Files

```typescript
❌ WRONG
import { [Component1] } from './components/[component-1]'

✅ FIX: Use index
import { [Component1] } from './components'
```

### ❌ Common Mistake 4: Wrong File Size

```typescript
❌ WRONG - [domain].ts (500 lines)

✅ FIX: Split by domain
api/queries/
├── index.ts
├── [domain-1].ts     (150 lines)
├── [domain-2].ts     (180 lines)
└── [domain-3].ts     (170 lines)
```

### ❌ Common Mistake 5: Feature in Wrong Location

```
❌ WRONG - Module-specific in shared
features/shared/[portal-specific-feature]/

✅ FIX: Move to portal
features/[portal]/[feature]/
```

### ❌ Common Mistake 6: Missing Server Directives

```typescript
❌ WRONG - api/queries/[domain].ts
export async function get[Entity]() { ... }

✅ FIX: Add directive
import 'server-only'
export async function get[Entity]() { ... }
```

### ❌ Common Mistake 7: Business Logic in lib/

```
❌ WRONG
lib/[feature-specific-domain]/

✅ FIX: Move to features
features/[portal]/[feature]/
```

---

## Migration Guide

### When Refactoring Existing Code

**Step 1: Assess Current State**
- Count lines in each file
- Identify files exceeding limits
- Note naming violations
- Check index file completeness

**Step 2: Plan Structure**
- Determine correct pattern (Small/Medium/Large)
- Identify split points for oversized files
- Map out new directory structure

**Step 3: Rename Files**
- Remove suffixes from organized directories
- Apply kebab-case to all files
- Fix plural/singular naming

**Step 4: Create/Update Index Files**
- Create missing index.ts files
- Add all exports to existing index files
- Ensure nested directories have index files

**Step 5: Split Oversized Files**
- Split by domain for queries
- Split by action for mutations
- Extract sub-components for components

**Step 6: Update Imports**
- Fix all imports to use index files
- Update to use correct paths
- Remove circular dependencies

**Step 7: Verify**
- Run type checking
- Run build process
- Test functionality

---

## Quick Reference Cards

### Feature Size Card
```
< 5 files   → Pattern 1 (flat api/)
5-15 files  → Pattern 2 (organized api/)
> 15 files  → Pattern 3 (nested api/)
> 30 files  → SPLIT into multiple features
```

### File Limit Card
```
Index:      50 lines
Component:  200 lines
Query:      300 lines
Mutation:   300 lines
Helper:     200 lines
Hook/Util:  150 lines
Types:      200 lines
Schema:     250 lines
Constant:   100 lines
Page:       15 lines
```

### Naming Card
```
Files:      kebab-case
Dirs:       kebab-case
Functions:  camelCase
Components: PascalCase
Types:      PascalCase
Constants:  SCREAMING_SNAKE_CASE
```

### Directive Card
```
Queries:    import 'server-only' (if server-side)
Mutations:  'use server' (if server actions)
Client:     'use client' (if client-side)
Lib server: 'server-only' or 'use server'
Lib client: (no directive)
```

---

## End of Architecture Rules

**Remember:**
1. Follow the decision trees for placement
2. Respect file size limits
3. Always use index files
4. Use correct naming conventions
5. Add proper server directives (framework-specific)
6. Keep lib/ infrastructure-only
7. Validate before committing
