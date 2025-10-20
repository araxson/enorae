# File Exclusions

Files and directories that should be excluded from rules enforcement and linting.

---

## Protected Files (Never Edit)

### UI Components (`components/ui/`)
**❌ Never edit any file in this directory**

These are auto-generated shadcn/ui components. Modifications will be overwritten when components are updated.

**Files**:
- `components/ui/*.tsx` - All shadcn/ui component files
- Examples: `button.tsx`, `dialog.tsx`, `card.tsx`, `form.tsx`, etc.

**Why protected**:
- Auto-generated from shadcn/ui registry
- Updates overwrite manual changes
- Modifications break upgrade path

**What to do instead**:
- Compose components in your feature files
- Use className prop for styling
- Create wrapper components if needed

---

### Global Styles (`app/globals.css`)
**❌ Never edit this file**

Contains design tokens and Tailwind configuration. Managed centrally.

**Why protected**:
- Maintains design system consistency
- Changes affect entire application
- Must be coordinated with design team

**What to do instead**:
- Use existing CSS custom properties
- Apply Tailwind utility classes
- Request new tokens via design team

---

## Documentation & Examples

### Supabase Documentation
**Path**: `supabase-docs-rules/`
**Reason**: Static marketing markdown, not application code

### shadcn Components Docs
**Path**: `docs/shadcn-components/`
**Reason**: Legacy reference documentation

### Example Code
**Path**: `examples/`
**Reason**: Tutorial and example code, not production

---

## Build Artifacts

### Generated Types
**Path**: `lib/types/database.types.ts`
**Reason**: Auto-generated from Supabase schema via `npm run db:types`
**Note**: Read-only, regenerate instead of editing

### Node Modules
**Path**: `node_modules/`
**Reason**: Third-party dependencies

### Build Output
**Paths**:
- `.next/` - Next.js build output
- `dist/` - Distribution builds
- `.tmp/` - Temporary files
- `.cache/` - Cache directories

---

## Configuration Files (Edit with Caution)

### TypeScript Config
**File**: `tsconfig.json`
**Rules**: [TS-P001](../03-QUICK-SEARCH.md#ts-p001) - Never weaken strictness
**Safe to edit**: Path mappings, include/exclude
**Never change**: `strict: true`, `noImplicitAny: true`

### Tailwind Config
**File**: `tailwind.config.ts`
**Rules**: [UI-H101](../03-QUICK-SEARCH.md#ui-h101), [UI-H102](../03-QUICK-SEARCH.md#ui-h102)
**Safe to edit**: Plugin additions, content paths
**Requires review**: Theme changes, utility modifications

### Next.js Config
**File**: `next.config.js`
**Safe to edit**: Environment variables, rewrites, redirects
**Requires review**: Experimental features, webpack modifications

### Component Registry
**File**: `components.json`
**Reason**: shadcn/ui configuration
**Safe to edit**: Style preferences, path aliases
**Never change**: Component source paths (breaks updates)

---

## Test Files & Fixtures

### Test Suites
**Paths**:
- `**/*.test.ts`
- `**/*.test.tsx`
- `**/*.spec.ts`
- `**/__tests__/`

**Reason**: Test files follow different patterns than production code

### Test Fixtures
**Path**: `tests/fixtures/`
**Reason**: Mock data and test utilities

---

## Temporary & Local Files

### Local Development
**Paths**:
- `.env.local` - Local environment variables
- `.env.*.local` - Environment-specific locals
- `*.log` - Log files

### Editor Configs
**Files**:
- `.vscode/` - VS Code settings (user-specific)
- `.idea/` - IntelliJ settings
- `*.swp`, `*.swo` - Vim swap files

---

## Migration & Database Files

### Supabase Migrations
**Path**: `supabase/migrations/*.sql`
**Rules**: [DB-P003](../03-QUICK-SEARCH.md#db-p003), [SEC-P003](../03-QUICK-SEARCH.md#sec-p003)
**Edit with caution**: Requires database knowledge, affects RLS policies
**Always**: Test in staging, review policies, add indexes

### Seed Data
**Path**: `supabase/seed.sql`
**Reason**: Development seed data, not production

---

## Exclusion Patterns for Linters

### ESLint
```json
{
  "ignorePatterns": [
    "node_modules/",
    ".next/",
    "dist/",
    "lib/types/database.types.ts",
    "components/ui/*.tsx"
  ]
}
```

### TypeScript
```json
{
  "exclude": [
    "node_modules",
    ".next",
    "dist",
    "**/*.test.ts"
  ]
}
```

### Prettier
```json
{
  "ignore": [
    "node_modules/",
    ".next/",
    "pnpm-lock.yaml",
    "package-lock.json"
  ]
}
```

---

## Summary Table

**Category** | **Paths** | **Reason** | **Action**
--- | --- | --- | ---
**Protected UI** | `components/ui/` | Auto-generated | Never edit
**Protected Styles** | `app/globals.css` | Design system | Never edit
**Generated Types** | `lib/types/database.types.ts` | Auto-generated | Regenerate only
**Build Output** | `.next/`, `dist/` | Build artifacts | Gitignored
**Documentation** | `docs/shadcn-components/` | Reference only | Read-only
**Tests** | `**/*.test.ts` | Different patterns | Separate rules
**Config** | `*.config.js` | Infrastructure | Edit with caution

---

**📖 Related Documentation:**
- [UI Rules](../domains/ui.md) - Why components/ui/ is protected
- [Architecture Rules](../domains/architecture.md) - File organization
- [Database Rules](../domains/database.md) - Type generation

**Last Updated:** 2025-10-18
