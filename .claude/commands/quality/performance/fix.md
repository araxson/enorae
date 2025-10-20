# Performance Fix - Reusable Session

Auto-fix performance issues in batches. Run multiple times to complete all fixes.

## Input File

Read: `docs/analyze-fixes/performance/analysis-report.json`

## Fix Patterns by Rule

### Rule: PERF-H101 {#perf-h101}

**Fix**: Add covering index for foreign key

```sql
create index concurrently if not exists [table]_[column]_idx
  on [schema].[table]([column]);
```

### Rule: PERF-H102 {#perf-h102}

**Fix**: Drop duplicate index

```sql
drop index if exists [schema].[duplicate_index_name];
```

### Rule: PERF-M301 {#perf-m301}

**Fix**: Drop unused index after verification

```sql
-- First verify not used in queries
drop index if exists [schema].[unused_index_name];
```

### Rule: PERF-M302 {#perf-m302}

**Fix**: Batch with Promise.all

```ts
// ❌ WRONG
const services = await getServices(salonId)
const staff = await getStaff(salonId)
const reviews = await getReviews(salonId)

// ✅ CORRECT
const [services, staff, reviews] = await Promise.all([
  getServices(salonId),
  getStaff(salonId),
  getReviews(salonId),
])
```

### Rule: PERF-L701 {#perf-l701}

**Fix**: Move to Server Component

```tsx
// Server Component
import marked from 'marked'

export async function MarkdownPage({ slug }) {
  const content = await readMarkdown(slug)
  return <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
}
```

### Rule: PERF-L702 {#perf-l702}

**Fix**: Add cache invalidation

```ts
'use server'

export async function mutate(input) {
  // ... mutation
  if (error) throw error

  revalidatePath('/customer/appointments')
  return data
}
```

## Process

1. Load report
2. Fix 10-20 pending issues in PERF-H### → PERF-L### order
3. Update status
4. Save report

**Start now.** Fix next batch of performance issues.
