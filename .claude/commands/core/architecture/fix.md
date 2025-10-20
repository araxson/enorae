# Architecture Fix - Reusable Session

Auto-fix architecture issues in batches. Run multiple times to complete all fixes.

## Input File

Read: `docs/analyze-fixes/architecture/analysis-report.json`

## Fix Patterns by Rule

### Rule: ARCH-P001 {#arch-p001}

**Fix**: Add server directives at file start

```ts
// For queries.ts - add as FIRST line
import 'server-only'

// For mutations.ts - add as FIRST line
'use server'
```

### Rule: ARCH-P002 {#arch-p002}

**Fix**: Move logic to feature component, keep page thin

```tsx
// ❌ WRONG (25+ lines with logic)
export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('...').select('*')
  // ... 20 more lines
}

// ✅ CORRECT (5-10 lines, delegates to feature)
import { BusinessDashboard } from '@/features/business/dashboard'
export default async function Page() {
  return <BusinessDashboard />
}
```

### Rule: ARCH-H101 {#arch-h101}

**Fix**: Create missing folders in feature directory

```bash
mkdir -p features/{portal}/{feature}/{api,components}
touch features/{portal}/{feature}/{types.ts,schema.ts,index.tsx}
```

### Rule: ARCH-H102 {#arch-h102}

**Fix**: Extract logic to feature utilities

```ts
// Move Supabase logic to features/{portal}/{feature}/api/queries.ts
import { getServices } from '@/features/business/services/api/queries'
```

### Rule: ARCH-M301 {#arch-m301}

**Fix**: Move to lib/ with domain organization

```ts
// Move shared utilities from features/ to lib/{domain}/
// Example: lib/auth/, lib/date/, lib/performance/
```

### Rule: ARCH-M302 {#arch-m302}

**Fix**: Relocate to features/shared/

```bash
mv features/customer/components/shared-component.tsx features/shared/components/
```

### Rule: ARCH-L701 {#arch-l701}

**Fix**: Remove index.ts barrels, export from index.tsx

```ts
// Remove: features/foo/components/index.ts
// Use: features/foo/index.tsx with direct exports
```

## Process

1. Load report
2. Fix 10-20 pending issues in ARCH-P### → ARCH-L### order
3. Update status
4. Save report

**Start now.** Fix next batch of architecture issues.
