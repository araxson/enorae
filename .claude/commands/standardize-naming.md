# Naming Standardization

## File Naming Rules

### API Files
- ✅ `appointments.ts` (NOT `appointments-queries.ts`)
- ✅ `create.ts` (NOT `create-mutations.ts`)
- ✅ `helpers.ts` (NOT `query-helpers.ts`)

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

### Pattern 2: Marketing Features

```
features/marketing/[page-name]/
├── sections/
│   └── [section-name]/
│       ├── [section-name].tsx         # Section component (< 150 lines)
│       ├── [section-name].data.ts     # Section data/content
│       ├── [section-name].types.ts    # Section types (optional)
│       └── index.ts                   # Export component + data
├── [page-name]-page.tsx               # Main page component (< 100 lines)
├── [page-name].seo.ts                 # SEO metadata
├── [page-name].types.ts               # Feature-wide types (optional)
└── index.ts                           # Export page + sections
```

**File Limits:**
- Page files: < 100 lines
- Section components: < 150 lines
- Data files: < 200 lines

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
- Function: `get[Entity]`, `fetch[Data]`, `list[Items]`
- File: Entity or domain name (plural): `appointments.ts`, `revenue.ts`

### Mutations (`api/mutations/[name].ts`)
- Function: `create[Entity]`, `update[Entity]`, `delete[Entity]`
- File: Action name: `create.ts`, `update.ts`, `delete.ts`

### Components
- File: `kebab-case.tsx`
- Export: `PascalCase` matching file intent
- Feature components: `[feature]-[component].tsx`

### Hooks
- File: `use-[hook-name].ts`
- Export: `use[HookName]`

### Types & Schemas
- Types: `types.ts` (domain-specific types)
- Schemas: `schema.ts` (Zod validation schemas)
- Constants: `constants.ts`

---

## Directory Organization

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
├── components/                         # Component (< 200 lines each)
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Domain query files: < 300 lines
- Action mutation files: < 300 lines
- Components: < 200 lines
- Index files: < 50 lines

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
│   └── mutations/
│       └── (similar structure)
├── components/
│   ├── [section-1]/                    # Components (< 200 lines each)
│   └── [section-2]/
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Specific query/mutation files: < 250 lines
- Components: < 200 lines
- Index files: < 50 lines
- Split into smaller files if exceeding limits

