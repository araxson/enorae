# Fix Supabase Advisors

You are tasked with analyzing and fixing all Supabase advisor issues (security and performance) for the ENORAE project. This is a **critical operation** that requires careful analysis before any fixes to avoid introducing new issues.


## EXECUTION WORKFLOW

### Phase 1: Discovery & Analysis

1. **Fetch all advisor issues**
   ```bash
   # Get project ID first if not known
   ```
   - Use `mcp__supabase__list_projects` to get project ID
   - Use `mcp__supabase__get_advisors` with type "security"
   - Use `mcp__supabase__get_advisors` with type "performance"

2. **Create comprehensive issue inventory**
   - List all security issues with severity, affected tables/policies
   - List all performance issues with impact, affected queries/indexes
   - Prioritize by severity: Critical → High → Medium → Low
   - Group related issues together

3. **Analyze each issue deeply**
   For each issue:
   - Read the full description and remediation URL
   - Understand the root cause
   - Identify affected tables/schemas/policies
   - Check for dependencies and side effects
   - Verify current schema state using `mcp__supabase__list_tables`
   - Review existing RLS policies using `mcp__supabase__execute_sql`

### Phase 2: Fix Planning

1. **Create fix strategy for each issue**
   - Determine the correct fix approach
   - Identify migration SQL needed
   - List any code changes required
   - Verify fix won't break existing functionality
   - Check for conflicts with other pending fixes

2. **Order fixes by dependency**
   - Fix foundational issues first (missing indexes, schema structure)
   - Then fix security issues (RLS policies)
   - Finally fix optimization issues

### Phase 3: Systematic Fixes

For each issue (one at a time):

1. **Pre-fix verification**
   - Check current state of affected resources
   - Verify understanding of the issue
   - Review the migration SQL

2. **Apply the fix**
   - Use `mcp__supabase__apply_migration` for DDL changes
   - Use descriptive migration names (e.g., "add_rls_policy_salons_table")
   - Include comments in SQL explaining the fix
   - Never hardcode IDs or tenant-specific data

3. **Post-fix verification**
   - Verify migration applied successfully
   - Check advisor status again to confirm issue resolved
   - Test affected functionality (run relevant queries)
   - Check for new issues introduced

4. **Document the fix**
   - Record what was changed
   - Note any side effects observed
   - Update tracking list

### Phase 4: Validation & Reporting

1. **Final validation**
   - Run advisors again to verify all issues resolved
   - Check for any new issues introduced
   - Run type check: `npm run typecheck`
   - Verify no regressions in functionality

2. **Generate comprehensive report**
   - Summary of all issues found
   - Details of each fix applied
   - Before/after state
   - Any remaining issues (with reasons if not fixed)
   - Recommendations for prevention

## COMMON ISSUE TYPES & SOLUTIONS

### Security Issues

**Missing RLS Policies:**
- Verify table needs RLS (most tables in `organization`, `catalog`, `scheduling` do)
- Create tenant-scoped policies using `tenant_id` or `owner_id`
- Test policies with different user contexts
- Follow pattern in `docs/stack-patterns/supabase-patterns.md`


**Overly Permissive Policies:**
- Review policy conditions
- Add proper tenant/user scoping
- Verify role-based restrictions

### Performance Issues

**Missing Indexes:**
- Identify frequently queried columns
- Add indexes on foreign keys
- Add composite indexes for common query patterns
- Consider partial indexes for filtered queries

**Slow Queries:**
- Analyze query execution plans
- Add missing indexes
- Optimize JOIN conditions
- Consider materialized views for complex aggregations

### Data Integrity Issues

**Missing Constraints:**
- Add NOT NULL constraints where appropriate
- Add UNIQUE constraints for business keys
- Add CHECK constraints for data validation
- Add foreign key constraints for referential integrity
