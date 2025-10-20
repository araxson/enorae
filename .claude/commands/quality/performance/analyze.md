# Performance Analysis - Violation Detection

Scan codebase for performance issues. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/quality/performance.md` completely before scanning.

**Additional Context**:
- Rules Index: `docs/rules/01-rules-index.md#perf-*`
- Related Rules: DB-H103, NEXT-L701, REACT-L701

## Scan Targets

### High Priority Files
- `supabase/migrations/*.sql` (indexes)
- `features/**/api/queries.ts` (Promise.all opportunities)

### Medium Priority Files
- Review Supabase advisor output for index recommendations

## Violation Rules

### HIGH PRIORITY

#### Rule: PERF-H101 {#perf-h101}
- **Pattern**: Add covering indexes for foreign keys
- **Detection**: Review advisor output and migration history
- **Why High**: Unindexed FKs cause table scans and lock contention
- **Example**:
  ```sql
  create index concurrently if not exists auditable_entity_created_by_id_idx
    on patterns.auditable_entity(created_by_id);
  ```
- **Reference**: `docs/rules/quality/performance.md#perf-h101`

#### Rule: PERF-H102 {#perf-h102}
- **Pattern**: Remove duplicate indexes
- **Detection**: Supabase advisor warnings for duplicate indexes
- **Example**:
  ```sql
  drop index if exists scheduling.idx_appointment_services_appointment;
  ```
- **Reference**: `docs/rules/quality/performance.md#perf-h102`

### MEDIUM PRIORITY

#### Rule: PERF-M301 {#perf-m301}
- **Pattern**: Remove unused indexes after verification
- **Detection**: Cross-check advisor with query logs
- **Reference**: `docs/rules/quality/performance.md#perf-m301`

#### Rule: PERF-M302 {#perf-m302}
- **Pattern**: Batch independent queries with Promise.all
- **Detection**: Consecutive await calls
- **Example**:
  ```ts
  const [services, staff] = await Promise.all([
    getServices(salonId),
    getStaff(salonId),
  ])
  ```
- **Reference**: `docs/rules/quality/performance.md#perf-m302`
- **Related**: NEXT-L701

### LOW PRIORITY

#### Rule: PERF-L701 {#perf-l701}
- **Pattern**: Stream large assets at build time via Server Components
- **Detection**: Client components importing heavy libraries
- **Reference**: `docs/rules/quality/performance.md#perf-l701`
- **Related**: REACT-L701

#### Rule: PERF-L702 {#perf-l702}
- **Pattern**: Use revalidatePath after mutations to prewarm caches
- **Detection**: Mutations without invalidation
- **Reference**: `docs/rules/quality/performance.md#perf-l702`
- **Related**: DB-H103

## Output Files

1. `docs/analyze-fixes/performance/analysis-report.json`
2. `docs/analyze-fixes/performance/analysis-report.md`

Use PERF domain prefix.

## Execute now following steps 1-9.
