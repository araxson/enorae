# Database Schema Structure Analyzer Agent

Create an agent that performs ultra-deep analysis of Supabase database schema structure and organization.

## Agent Objective

Analyze the entire database schema structure across all schemas (organisation, catalog, scheduling, identity, communication, analytics, engagement) and generate a comprehensive report identifying structural issues, naming inconsistencies, and architectural concerns.

## Analysis Tasks

1. **Schema Organization**
   - List all tables in each schema
   - Analyze table naming conventions and consistency
   - Check for orphaned or unused tables
   - Identify tables that might belong in different schemas

2. **Column Analysis**
   - Enumerate all columns for each table
   - Check data type consistency across similar columns
   - Identify nullable columns that should be NOT NULL
   - Find columns with inconsistent naming (e.g., `user_id` vs `userId`)
   - Detect missing standard columns (created_at, updated_at, etc.)

3. **Primary Keys & Identity**
   - Verify every table has a primary key
   - Check primary key naming conventions
   - Identify tables using non-UUID primary keys (potential issues)
   - Find composite primary keys and evaluate necessity

4. **Table Relationships**
   - Map all foreign key relationships
   - Identify missing foreign key constraints
   - Find circular dependencies
   - Detect orphaned records (missing parent references)

5. **View Structure**
   - List all views and their schemas
   - Analyze view complexity and performance implications
   - Identify views that query across multiple schemas
   - Check if views follow naming convention (*_view)

## SQL Queries to Execute

```sql
-- List all tables across schemas
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, tablename;

-- Get all columns with data types
SELECT
  table_schema,
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY table_schema, table_name, ordinal_position;

-- Find tables without primary keys
SELECT
  t.table_schema,
  t.table_name
FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints tc
  ON t.table_schema = tc.table_schema
  AND t.table_name = tc.table_name
  AND tc.constraint_type = 'PRIMARY KEY'
WHERE t.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND t.table_type = 'BASE TABLE'
  AND tc.constraint_name IS NULL;

-- List all foreign key relationships
SELECT
  tc.table_schema,
  tc.table_name,
  kcu.column_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY tc.table_schema, tc.table_name;

-- List all views
SELECT
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, viewname;

-- Check for tables missing standard audit columns
SELECT
  table_schema,
  table_name,
  CASE WHEN created_at IS NULL THEN 'Missing created_at' END as created_at_status,
  CASE WHEN updated_at IS NULL THEN 'Missing updated_at' END as updated_at_status
FROM (
  SELECT
    t.table_schema,
    t.table_name,
    MAX(CASE WHEN c.column_name = 'created_at' THEN 1 END) as created_at,
    MAX(CASE WHEN c.column_name = 'updated_at' THEN 1 END) as updated_at
  FROM information_schema.tables t
  LEFT JOIN information_schema.columns c
    ON t.table_schema = c.table_schema
    AND t.table_name = c.table_name
  WHERE t.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
    AND t.table_type = 'BASE TABLE'
  GROUP BY t.table_schema, t.table_name
) sub
WHERE created_at IS NULL OR updated_at IS NULL;
```

## Report Structure

Create a markdown report at `docs/database-analysis/01-schema-structure-report.md` with:

### Executive Summary
- Total schemas analyzed
- Total tables found
- Critical issues count
- Warning issues count

### Schema-by-Schema Analysis
For each schema:
- Table count and total size
- Naming convention adherence (%)
- Missing primary keys
- Missing foreign keys
- Missing audit columns

### Critical Issues
List all critical problems:
- Tables without primary keys
- Missing foreign key constraints
- Naming inconsistencies
- Data type inconsistencies
- Missing audit columns

### Recommendations
Prioritized list of fixes:
1. High priority (breaks patterns)
2. Medium priority (technical debt)
3. Low priority (optimizations)

### Appendix
- Complete table inventory
- Column data type matrix
- Relationship diagram (text-based)

## Tools to Use

- `mcp__supabase__list_tables` - Get table list
- `mcp__supabase__execute_sql` - Run analysis queries
- `Write` - Create the report file

## Success Criteria

Agent completes when:
- All schemas analyzed
- All SQL queries executed
- Report saved to docs/database-analysis/
- No errors during execution
