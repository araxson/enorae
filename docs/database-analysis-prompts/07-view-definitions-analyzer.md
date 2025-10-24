# Database View Definitions & Query Analyzer Agent

Create an agent that performs ultra-deep analysis of database views, their definitions, complexity, performance implications, and adherence to ENORAE patterns.

## Agent Objective

Analyze all views (regular and materialized), their SQL definitions, complexity metrics, usage patterns, and compliance with the architecture pattern of querying views for reads.

## Analysis Tasks

1. **View Inventory**
   - List all views across schemas
   - Classify by complexity (simple, moderate, complex)
   - Identify naming convention adherence (*_view)
   - Map view dependencies and chains

2. **View Definition Analysis**
   - Parse SQL definitions
   - Count joins, subqueries, aggregations
   - Identify cross-schema queries
   - Detect potential performance issues

3. **Pattern Compliance**
   - Verify views follow *_view naming
   - Check if views expose public-safe data
   - Ensure views don't include sensitive columns
   - Validate views for read-only operations

4. **Materialized View Assessment**
   - List all materialized views
   - Check refresh strategies
   - Analyze data freshness requirements
   - Identify materialization candidates

5. **View Usage Patterns**
   - Identify most-queried views
   - Find unused views
   - Detect views used in application code
   - Map views to codebase features

## SQL Queries to Execute

```sql
-- List all regular views
SELECT
  schemaname,
  viewname,
  viewowner,
  definition
FROM pg_views
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, viewname;

-- List all materialized views
SELECT
  schemaname,
  matviewname as viewname,
  matviewowner as owner,
  ispopulated,
  definition
FROM pg_matviews
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, matviewname;

-- Get view sizes (for materialized views)
SELECT
  schemaname,
  matviewname as viewname,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||matviewname)) as view_size,
  pg_total_relation_size(schemaname||'.'||matviewname) as size_bytes
FROM pg_matviews
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY pg_total_relation_size(schemaname||'.'||matviewname) DESC;

-- Find views not following _view naming convention
SELECT
  schemaname,
  viewname
FROM pg_views
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND viewname NOT LIKE '%_view'
  AND viewname NOT IN ('geography_columns', 'geometry_columns', 'spatial_ref_sys') -- PostGIS views
ORDER BY schemaname, viewname;

-- Analyze view dependencies (what tables/views does each view depend on)
SELECT
  v.schemaname as view_schema,
  v.viewname as view_name,
  d.refobjid::regclass as depends_on_object
FROM pg_views v
JOIN pg_depend d ON d.objid = (v.schemaname||'.'||v.viewname)::regclass::oid
WHERE v.schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND d.deptype = 'n'
  AND d.refobjid::regclass::text NOT LIKE 'pg_%'
ORDER BY v.schemaname, v.viewname;

-- Check for views with complex operations (containing specific keywords)
SELECT
  schemaname,
  viewname,
  CASE
    WHEN definition ILIKE '%JOIN%' THEN 'Contains JOIN'
    ELSE ''
  END as has_join,
  CASE
    WHEN definition ILIKE '%GROUP BY%' THEN 'Contains GROUP BY'
    ELSE ''
  END as has_grouping,
  CASE
    WHEN definition ILIKE '%UNION%' THEN 'Contains UNION'
    ELSE ''
  END as has_union,
  CASE
    WHEN definition ILIKE '%WINDOW%' OR definition ILIKE '%OVER%' THEN 'Contains Window Function'
    ELSE ''
  END as has_window,
  CASE
    WHEN definition ILIKE '%DISTINCT%' THEN 'Contains DISTINCT'
    ELSE ''
  END as has_distinct,
  LENGTH(definition) as definition_length
FROM pg_views
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY LENGTH(definition) DESC;

-- Count columns in each view
SELECT
  table_schema,
  table_name as view_name,
  COUNT(*) as column_count,
  string_agg(column_name, ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND table_name IN (
    SELECT viewname FROM pg_views
    WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
    UNION
    SELECT matviewname FROM pg_matviews
    WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  )
GROUP BY table_schema, table_name
ORDER BY table_schema, table_name;

-- Find views selecting from auth schema (potential security issue)
SELECT
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND (
    definition ILIKE '%auth.users%'
    OR definition ILIKE '%auth.%'
  )
ORDER BY schemaname, viewname;

-- Detect circular view dependencies
WITH RECURSIVE view_deps AS (
  SELECT
    v.schemaname || '.' || v.viewname as view_name,
    d.refobjid::regclass::text as depends_on,
    1 as depth
  FROM pg_views v
  JOIN pg_depend d ON d.objid = (v.schemaname||'.'||v.viewname)::regclass::oid
  WHERE v.schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
    AND d.deptype = 'n'

  UNION ALL

  SELECT
    vd.view_name,
    d.refobjid::regclass::text,
    vd.depth + 1
  FROM view_deps vd
  JOIN pg_depend d ON d.objid = vd.depends_on::regclass::oid
  WHERE vd.depth < 10
    AND d.deptype = 'n'
)
SELECT DISTINCT
  view_name,
  depends_on,
  depth
FROM view_deps
WHERE view_name = depends_on
ORDER BY view_name;
```

## Additional Analysis

The agent should also:

1. **Search Codebase for View Usage**
   - Use Grep to find view references in TypeScript files
   - Check queries.ts files for view usage
   - Identify views used vs defined

2. **Complexity Scoring**
   - Assign complexity score based on:
     - Number of joins (1 point each)
     - Subqueries (2 points each)
     - Window functions (2 points each)
     - GROUP BY (1 point)
     - UNION (1 point)
     - Definition length >1000 chars (2 points)
   - Classify: Simple (0-3), Moderate (4-7), Complex (8+)

3. **Pattern Validation**
   - Check if application code queries schema tables directly
   - Verify reads use views not base tables
   - Find violations of view-for-reads pattern

## Report Structure

Create a markdown report at `docs/database-analysis/07-view-definitions-report.md` with:

### Executive Summary
- Total regular views
- Total materialized views
- Views not following naming convention
- Complex views requiring optimization
- Unused views

### View Inventory by Schema
For each schema:
- View count
- Naming convention adherence
- Average complexity score
- Materialized view count

### View Classification
- **Simple Views** (0-3 complexity)
  - Straightforward SELECT with few joins
  - Good performance expected

- **Moderate Views** (4-7 complexity)
  - Multiple joins or aggregations
  - May need monitoring

- **Complex Views** (8+ complexity)
  - Heavy operations
  - Materialization candidates
  - Performance review needed

### Critical Issues
- **High Priority**
  - Views not following *_view naming
  - Views exposing auth schema data
  - Circular view dependencies
  - Extremely complex views (15+ complexity)
  - Unused materialized views (wasting space)

- **Medium Priority**
  - Views with cross-schema queries
  - Views missing in codebase usage
  - Non-materialized views with heavy operations
  - Views with potential security issues

- **Low Priority**
  - Naming inconsistencies
  - Views that could be simplified
  - Documentation gaps

### Materialized View Analysis
For each materialized view:
- Name and schema
- Size and row count
- Populated status
- Refresh strategy (if detectable)
- Refresh frequency recommendation
- Data freshness requirements

### Views Requiring Materialization
Based on complexity and usage:
1. View name
2. Current complexity score
3. Estimated benefit of materialization
4. Recommended refresh strategy
5. Expected performance improvement

### Pattern Compliance Report
- **Views Following Pattern** ✅
  - Properly named (*_view)
  - Expose safe data
  - Used in application code

- **Pattern Violations** ❌
  - Schema tables queried directly in code
  - Views exposing sensitive data
  - Missing views for common queries
  - Inconsistent naming

### View Dependency Map
Visual (text-based) representation:
```
public.salon_dashboard_view
├── depends on: organisation.salons
├── depends on: catalog.services
└── depends on: scheduling.appointments
```

### View Usage in Codebase
For each view:
- References in TypeScript files
- Used in which features/portals
- Query patterns
- Unused views (candidates for removal)

### View Definition Examples
Sample definitions for:
- Well-designed simple view
- Complex view needing optimization
- View with security issues
- Recommended materialized view

### Optimization Recommendations

**Immediate Actions:**
1. Rename views to follow *_view convention
2. Remove/secure views exposing sensitive data
3. Materialize heavy views (complexity >8)
4. Drop unused views
5. Fix circular dependencies

**Short Term:**
1. Simplify complex view definitions
2. Add indexes to support view queries
3. Implement materialized view refresh strategy
4. Document view purposes
5. Create missing views for direct table queries

**Long Term:**
1. Establish view design standards
2. Monitor view performance
3. Regular view usage audits
4. Automated complexity detection
5. View documentation in code

### Security Considerations
- Views accessing auth schema
- Views exposing PII without masking
- Views bypassing RLS policies
- Views with security definer functions

### Performance Metrics
- Average view query time (if available from logs)
- Most expensive views
- Views causing sequential scans
- Cache hit ratio for materialized views

## Tools to Use

- `mcp__supabase__execute_sql` - Run view analysis queries
- `Grep` - Search codebase for view usage
- `Read` - Read view definitions from migration files
- `Write` - Create the report file

## Success Criteria

Agent completes when:
- All views analyzed and classified
- Complexity scores calculated
- Pattern compliance checked
- Codebase usage mapped
- Security issues identified
- Report saved to docs/database-analysis/
- No errors during execution

## Important Notes

- View definitions can be very long - handle gracefully
- Some views may be auto-generated (PostGIS, etc.) - exclude from analysis
- Parse SQL carefully for complexity metrics
- Cross-reference with actual codebase usage
- Consider read-only nature of views
