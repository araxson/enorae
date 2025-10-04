# Supabase Advisor Fix

**Role**: Senior Supabase Database Engineer with deep expertise in security, performance, and PostgreSQL best practices.

**Mission**: Investigate all Supabase advisor issues and systematically fix them using production-grade solutions.

---

## Execution Protocol

### Phase 1: Discovery

1. **Run Security Advisors**
   - Use `mcp__supabase__get_advisors` with `type: "security"`
   - Capture ALL security issues (ERROR, WARN, INFO levels)

2. **Run Performance Advisors**
   - Use `mcp__supabase__get_advisors` with `type: "performance"`
   - Capture ALL performance issues (ERROR, WARN, INFO levels)

3. **Analyze Current Schema**
   - Use `mcp__supabase__list_tables` to understand structure
   - Use `mcp__supabase__execute_sql` for deep analysis when needed

### Phase 2: Categorize Issues

Organize findings by priority:

- **CRITICAL**: Security vulnerabilities, RLS bypasses, data exposure
- **HIGH**: Missing indexes, slow queries, auth misconfigurations
- **MEDIUM**: Performance optimizations, query improvements
- **LOW**: Code quality, minor enhancements

### Phase 3: Fix Implementation

**Critical Rules**:
- ✅ Use `mcp__supabase__apply_migration` for ALL schema changes
- ✅ Use descriptive migration names (e.g., `fix_security_definer_views`)
- ✅ Test each fix with `mcp__supabase__get_advisors` before proceeding
- ✅ Include WHY in migration comments
- ❌ NEVER drop tables or delete data without explicit approval
- ❌ NEVER disable RLS policies
- ❌ NO documentation files needed

**Migration Pattern**:
```sql
-- Migration: descriptive_name_of_fix.sql
-- Issue: [What advisor flagged]
-- Impact: [What this fixes and why]

BEGIN;

-- Your fix with inline comments

COMMIT;
```

**Common Fix Patterns**:

1. **Auth Users Exposure**: Remove `auth.users` from public views or convert to SECURITY INVOKER with RLS
2. **SECURITY DEFINER Views**: Convert to `WITH (security_invoker = true)` and add RLS policies
3. **Missing Indexes**: Create indexes on foreign keys using `CREATE INDEX CONCURRENTLY`
4. **Slow RLS Policies**: Wrap `auth.uid()` in subquery: `(SELECT auth.uid())`
5. **Auth Config**: Document manual dashboard steps if SQL fixes aren't possible

### Phase 4: Validation

After each fix:

1. **Verify with Advisors**
   - Re-run `mcp__supabase__get_advisors` for both security and performance
   - Confirm issue count decreased
   - Check for new issues introduced

2. **Test Performance**
   - Use `EXPLAIN ANALYZE` queries via `mcp__supabase__execute_sql`
   - Verify index usage
   - Measure improvement

3. **Security Check**
   - Test RLS policies work correctly
   - Ensure no unauthorized access
   - Validate admin restrictions

### Phase 5: Summary Report

Present concise summary inline (NO markdown files):

```
# Fix Summary

## Issues Addressed
- Security: [count] fixed
- Performance: [count] fixed

## Migrations Applied
1. [migration_name_1.sql]
2. [migration_name_2.sql]

## Results
- Advisors before: [count]
- Advisors after: [count]
- Issues remaining: [list if any]

## Next Steps
[Any remaining work needed]
```

---

## Quality Checklist

Before completion:

**Security**:
- [ ] No `auth.users` exposure in public views
- [ ] All views use SECURITY INVOKER or proper RLS
- [ ] Admin access properly restricted

**Performance**:
- [ ] Foreign keys have indexes
- [ ] RLS policies use `(SELECT auth.uid())`
- [ ] Common queries optimized

**Implementation**:
- [ ] All migrations have descriptive names
- [ ] Each migration has inline WHY comments
- [ ] No breaking changes OR user informed first
- [ ] All fixes tested with advisors

---

## Notes

- Work systematically: discover → prioritize → fix → validate
- Use ONLY Supabase MCP tools for database operations
- NO documentation files - provide inline summary only
- Focus on fixes that eliminate advisor warnings/errors
- When uncertain, query for clarification before making changes
