# Architecture

---

## File Naming Rules

### API Files (In Organized Directories)
- ✅ `appointments.ts` (NOT `appointments-queries.ts`)
- ✅ `create.ts` (NOT `create-mutations.ts` or `create.mutations.ts`)
- ✅ `helpers.ts` (NOT `query-helpers.ts`)
- ❌ **NEVER use suffixes in organized directories** - the directory provides context

### API Files (Flat Structure - Small Features Only)
- ✅ `queries.ts` (plural, at api root)
- ✅ `mutations.ts` (plural, at api root)
- ❌ `query.ts` (wrong - use plural)

### Kebab-case vs Dot Notation
**Use kebab-case (-)** for multi-word files:
- ✅ `metric-card.tsx`
- ✅ `revenue-analytics.ts`
- ✅ `user-preferences.ts`

**Use dots (.) ONLY for special files:**
- ✅ `user.test.ts` (tests)
- ✅ `user.spec.ts` (tests)
- ✅ `database.types.ts` (auto-generated type definitions)
- ✅ `next.config.ts` (config files)
- ❌ `create.mutations.ts` (WRONG - use organized directories instead)
- ❌ `user.queries.ts` (WRONG - use organized directories instead)

### Components
- ✅ `metric-card.tsx` (kebab-case)
- ✅ Component name matches filename: `MetricCard` in `metric-card.tsx`

### Directories
- ✅ `kebab-case` for all folders
- ✅ Descriptive names: `revenue-analytics` not `rev-analysis`

---

## Feature Structure Patterns

### Pattern 1: Portal Features (admin, business, staff, customer)

```
features/{portal}/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [domain].ts                 # Query functions (< 300 lines)
│   │   └── helpers.ts                  # Query helpers (< 200 lines)
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [action].ts                 # Mutation functions (< 300 lines)
│   │   └── helpers.ts                  # Mutation helpers (< 200 lines)
│   ├── types.ts                        # API types (< 200 lines)
│   ├── schema.ts                       # Zod schemas (< 250 lines)
│   └── constants.ts                    # Constants (< 100 lines)
├── components/
│   ├── index.ts                         # Re-exports ALL components (< 50 lines)
│   ├── [feature]-[component].tsx       # Components (< 200 lines)
│   └── [component-name].tsx            # Components (< 200 lines)
├── hooks/
│   └── use-[hook-name].ts              # Hooks (< 150 lines)
├── utils/
│   └── [utility-name].ts               # Utils (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Index files: < 50 lines
- Components: < 200 lines
- Query/Mutation files: < 300 lines
- Helpers: < 200 lines
- Hooks/Utils: < 150 lines
- Types: < 200 lines
- Schemas: < 250 lines
- Constants: < 100 lines

---

### Pattern 2: Marketing Features

```
features/marketing/[page-name]/
├── sections/
│   └── [section-name]/
│       ├── [section-name].tsx         # Section component (< 150 lines)
│       ├── [section-name].data.ts     # Section data/content (< 200 lines)
│       ├── [section-name].types.ts    # Section types (optional, < 100 lines)
│       └── index.ts                   # Export component + data (< 20 lines)
├── [page-name]-page.tsx               # Main page component (< 100 lines)
├── [page-name].seo.ts                 # SEO metadata (< 50 lines)
├── [page-name].types.ts               # Feature-wide types (optional, < 150 lines)
└── index.ts                           # Export page + sections (< 30 lines)
```

**File Limits:**
- Page files: < 100 lines
- Section components: < 150 lines
- Data files: < 200 lines
- SEO files: < 50 lines
- Index files: < 30 lines

---

### Pattern 3: Auth Features

```
features/shared/auth/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [query].ts                  # Query functions (< 300 lines)
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [action].ts                 # Mutation functions (< 300 lines)
│   └── schema.ts                       # Auth schemas (< 250 lines)
├── components/
│   ├── login-form.tsx                  # Form component (< 200 lines)
│   ├── signup-form.tsx                 # Form component (< 200 lines)
│   └── [auth-component].tsx            # Auth component (< 200 lines)
├── hooks/
│   └── use-[auth-hook].ts              # Auth hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Index files: < 50 lines
- Components: < 200 lines
- Query/Mutation files: < 300 lines
- Schema files: < 250 lines
- Hooks: < 150 lines

---

### Pattern 4: Shared Features

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
│   └── [component].tsx                 # Shared component (< 200 lines)
├── hooks/
│   └── use-[hook].ts                   # Shared hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Index files: < 50 lines
- Components: < 200 lines
- Query/Mutation files: < 300 lines
- Types: < 200 lines
- Hooks: < 150 lines

---

## Naming Conventions

### Queries (`api/queries/[name].ts`)
- **Function names**: `get[Entity]`, `fetch[Data]`, `list[Items]`
- **File names**: Entity or domain name (plural): `appointments.ts`, `revenue.ts`
- **Examples**:
  - `getSalonDashboard()`
  - `fetchAppointmentsByDate()`
  - `listActiveStaff()`

### Mutations (`api/mutations/[name].ts`)
- **Function names**: `create[Entity]`, `update[Entity]`, `delete[Entity]`
- **File names**: Action name: `create.ts`, `update.ts`, `delete.ts`
- **Examples**:
  - `createAppointment()`
  - `updateSalonSettings()`
  - `deleteStaffMember()`

### Components
- **File naming**: `kebab-case.tsx`
- **Export naming**: `PascalCase` matching file intent
- **Feature components**: `[feature]-[component].tsx`
- **Examples**:
  - `metric-card.tsx` → exports `MetricCard`
  - `appointment-form.tsx` → exports `AppointmentForm`
  - `dashboard-stats.tsx` → exports `DashboardStats`

### Hooks
- **File naming**: `use-[hook-name].ts`
- **Export naming**: `use[HookName]`
- **Examples**:
  - `use-appointments.ts` → exports `useAppointments`
  - `use-salon-data.ts` → exports `useSalonData`

### Types & Schemas
- **Types**: `types.ts` (domain-specific types)
- **Schemas**: `schema.ts` (Zod validation schemas)
- **Constants**: `constants.ts` (configuration values)

---

## Directory Organization by Size

### Small Features (< 5 files)

```
[feature]/
├── api/
│   ├── queries.ts                      # All queries (< 300 lines)
│   └── mutations.ts                    # All mutations (< 300 lines)
├── components/
│   └── [component].tsx                 # Component (< 200 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Single query/mutation files: < 300 lines (split if exceeding)
- Components: < 200 lines
- Index: < 50 lines

**When to split**: If any file exceeds 300 lines, move to Medium structure.

---

### Medium Features (5-15 files)

```
[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [domain].ts                 # Domain queries (< 300 lines)
│   └── mutations/
│       ├── index.ts                    # Re-exports (< 50 lines)
│       └── [action].ts                 # Action mutations (< 300 lines)
├── components/
│   └── [component].tsx                 # Components (< 200 lines each)
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Domain query files: < 300 lines
- Action mutation files: < 300 lines
- Components: < 200 lines
- Index files: < 50 lines

**When to split**: If any domain file exceeds 300 lines, move to Large structure.

---

### Large Features (> 15 files)

```
[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [domain-1]/
│   │   │   ├── index.ts                # Domain re-exports (< 50 lines)
│   │   │   └── [specific].ts           # Specific queries (< 250 lines)
│   │   └── [domain-2]/
│   │       └── (similar structure)
│   └── mutations/
│       └── (similar structure)
├── components/
│   ├── [section-1]/
│   │   └── [component].tsx             # Components (< 200 lines each)
│   └── [section-2]/
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Specific query/mutation files: < 250 lines
- Components: < 200 lines
- Index files: < 50 lines
- **Must split** into smaller files if exceeding limits

---

## Component Re-Export Pattern

**CRITICAL RULE: Always use `components/index.ts` as the single source of truth**

### ✅ CORRECT Pattern

```
components/
├── index.ts                    # Re-exports ALL components
├── dashboard.tsx
├── metric-card.tsx
└── chart.tsx
```

**components/index.ts** - Must export ALL components:
```ts
export { Dashboard } from './dashboard'
export { MetricCard } from './metric-card'
export { Chart } from './chart'
```

**Feature index.tsx** - Must import from `./components`:
```ts
// ✅ CORRECT - Use components/index
import { Dashboard } from './components'
export { Dashboard, MetricCard } from './components'

// ❌ WRONG - Don't bypass the index
import { Dashboard } from './components/dashboard'
```

### ❌ WRONG Patterns

**Incomplete components/index.ts:**
```ts
// ❌ Missing exports - not all components listed
export { Dashboard } from './dashboard'
// Missing: MetricCard, Chart
```

**Bypassing components/index.ts:**
```ts
// ❌ Direct import bypasses the index
export { Dashboard } from './components/dashboard'
```

**Why this matters:**
- ✅ Single source of truth for public components
- ✅ Easier to see what's exported
- ✅ Better tree-shaking
- ✅ Consistent import patterns
- ✅ Easier refactoring

---

## Enforcement Rules

1. **No suffixes in organized folders**: `appointments.ts` not `appointments-queries.ts`
2. **Plural for collections**: `queries/`, `mutations/`, `components/`
3. **Kebab-case everywhere**: Files and folders
4. **PascalCase exports**: Component and type names
5. **camelCase functions**: `getSalonDashboard`, `createAppointment`
6. **Always index.ts**: Re-export from `api/queries/index.ts`, `api/mutations/index.ts`, and `components/index.ts`
7. **Complete index files**: ALL components/queries/mutations must be in their respective index.ts
8. **Never bypass index.ts**: Feature files must import from `./components`, not direct paths
9. **Respect file limits**: Split files that exceed their designated line limits

---

## Quick Reference Table

| File Type | Limit | Action if Exceeded |
|-----------|-------|-------------------|
| Index files | 50 | Split into separate domain index files |
| Components | 200 | Extract sub-components or sections |
| Queries/Mutations | 300 | Split by domain or action |
| Query/Mutation (Large) | 250 | Split into more specific files |
| Helpers | 200 | Group into separate helper files |
| Hooks/Utils | 150 | Split by concern |
| Types | 200 | Create domain-specific type files |
| Schemas | 250 | Split into separate schema files |
| Constants | 100 | Group by domain |
| Page files | 100 | Extract sections |
| SEO files | 50 | One per page |
| Data files | 200 | Split by section |

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Using suffixes in organized directories
```
api/
├── queries/
│   └── appointments-queries.ts  ❌ WRONG - suffix is redundant
```
**Fix:** Rename to `appointments.ts`

### ❌ Mistake 2: Using dots instead of kebab-case
```
api/mutations/create.appointment.ts  ❌ WRONG - dots reserved for special files
```
**Fix:** Use organized directory or rename to `create-appointment.ts` (if flat)

### ❌ Mistake 3: Incomplete components/index.ts
```ts
// components/index.ts
export { Dashboard } from './dashboard'
// Missing: other components in the directory ❌
```
**Fix:** Export ALL components in the directory

### ❌ Mistake 4: Bypassing index files
```ts
// feature/index.tsx
import { Dashboard } from './components/dashboard'  ❌ WRONG
```
**Fix:** Import from `./components` (uses index.ts)

### ❌ Mistake 5: Singular filenames at root
```
api/
├── query.ts    ❌ WRONG - should be plural
└── mutation.ts ❌ WRONG
```
**Fix:** Use `queries.ts` and `mutations.ts`

---

## Migration Path

When refactoring existing code:

1. **Assess current state**: Count lines in each file
2. **Identify violations**: Note files exceeding limits
3. **Plan split strategy**: Choose Small/Medium/Large pattern
4. **Rename files**: Remove suffixes, apply kebab-case
5. **Create/complete index.ts files**: Ensure all components/queries/mutations are re-exported
6. **Update imports**: Fix all import paths to use index files
7. **Verify**: Run type check and build

---

## Code Cleanup

**Fix misplaced files, redundancies, and duplicates immediately:**

- ❌ Files in wrong directories → Move to correct feature/pattern location
- ❌ Duplicate code → Extract to shared utils/hooks
- ❌ Redundant files → Merge or delete
- ❌ Unused exports → Remove

**Keep codebase clean:** One source of truth per concept.

---

## Quick Checklist for New Features

- [ ] No `.mutations.ts` or `.queries.ts` suffixes in organized directories
- [ ] All multi-word files use kebab-case (not dots)
- [ ] `components/index.ts` exports ALL components
- [ ] `api/queries/index.ts` exports ALL queries
- [ ] `api/mutations/index.ts` exports ALL mutations
- [ ] Feature index.tsx imports from `./components`, not direct paths
- [ ] All files respect size limits
- [ ] All functions use camelCase
- [ ] All components export PascalCase names
- [ ] Server directives present ('server-only' in queries, 'use server' in mutations)
