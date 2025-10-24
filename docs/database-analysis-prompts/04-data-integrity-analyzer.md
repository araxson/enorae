# Database Data Integrity & Constraints Analyzer Agent

Create an agent that performs ultra-deep analysis of data integrity, constraints, validation rules, and data quality across all schemas.

## Agent Objective

Analyze data integrity mechanisms including constraints, triggers, validation rules, orphaned records, data consistency, and referential integrity violations.

## Analysis Tasks

1. **Constraint Analysis**
   - List all constraints (PK, FK, UNIQUE, CHECK)
   - Find tables missing constraints
   - Identify weak or ineffective constraints
   - Check constraint naming conventions

2. **Data Validation**
   - Find NULL values in columns that should be NOT NULL
   - Identify invalid enum values
   - Check for data type violations
   - Find empty strings where NULL is expected

3. **Referential Integrity**
   - Find orphaned records (missing parent references)
   - Check cascade delete configurations
   - Identify circular references
   - Verify foreign key data consistency

4. **Uniqueness Violations**
   - Find duplicate records in unique columns
   - Check for potential unique constraint violations
   - Identify duplicate business keys
   - Verify composite unique constraints

5. **Trigger Analysis**
   - List all triggers and their functions
   - Check trigger execution order
   - Identify missing audit triggers
   - Find disabled or broken triggers

## SQL Queries to Execute

```sql
-- List all constraints by type
SELECT
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  pg_get_constraintdef(c.oid) as constraint_definition
FROM information_schema.table_constraints tc
JOIN pg_constraint c
  ON c.conname = tc.constraint_name
WHERE tc.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY tc.table_schema, tc.table_name, tc.constraint_type;

-- Find tables missing NOT NULL constraints on important columns
SELECT
  table_schema,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND is_nullable = 'YES'
  AND column_name IN ('id', 'created_at', 'updated_at', 'email', 'name', 'status')
ORDER BY table_schema, table_name, column_name;

-- Check for foreign key constraints without indexes
SELECT
  tc.table_schema,
  tc.table_name,
  kcu.column_name,
  tc.constraint_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY tc.table_schema, tc.table_name;

-- Find CHECK constraints
SELECT
  n.nspname AS schema_name,
  t.relname AS table_name,
  c.conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE c.contype = 'c'
  AND n.nspname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY n.nspname, t.relname;

-- List all triggers
SELECT
  trigger_schema,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing,
  action_orientation
FROM information_schema.triggers
WHERE trigger_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY trigger_schema, event_object_table, trigger_name;

-- Find columns with default values
SELECT
  table_schema,
  table_name,
  column_name,
  column_default,
  data_type
FROM information_schema.columns
WHERE table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND column_default IS NOT NULL
ORDER BY table_schema, table_name, column_name;

-- Check for UNIQUE constraints
SELECT
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as unique_columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
GROUP BY tc.table_schema, tc.table_name, tc.constraint_name
ORDER BY tc.table_schema, tc.table_name;

-- Find tables without any constraints (high risk)
SELECT DISTINCT
  t.table_schema,
  t.table_name
FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints tc
  ON t.table_schema = tc.table_schema
  AND t.table_name = tc.table_name
WHERE t.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND t.table_type = 'BASE TABLE'
  AND tc.constraint_name IS NULL
ORDER BY t.table_schema, t.table_name;

-- Check for deferrable constraints
SELECT
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  tc.is_deferrable,
  tc.initially_deferred
FROM information_schema.table_constraints tc
WHERE tc.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND tc.is_deferrable = 'YES'
ORDER BY tc.table_schema, tc.table_name;
```

## Additional Validation Queries

These queries will check actual data for integrity issues:

```sql
-- Sample query to find orphaned records (example for appointments)
-- Note: Agent should generate similar queries for all FK relationships
SELECT
  child_table.table_schema,
  child_table.table_name,
  fk.column_name,
  COUNT(*) as orphaned_count
FROM information_schema.referential_constraints rc
JOIN information_schema.key_column_usage fk
  ON rc.constraint_name = fk.constraint_name
JOIN information_schema.tables child_table
  ON fk.table_name = child_table.table_name
  AND fk.table_schema = child_table.table_schema
WHERE child_table.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
GROUP BY child_table.table_schema, child_table.table_name, fk.column_name;

-- Find potential duplicate records (example - agent should check each table)
-- This is a template - actual query needs table-specific business keys
```

## Report Structure

Create a markdown report at `docs/database-analysis/04-data-integrity-report.md` with:

### Executive Summary
- Total constraints analyzed
- Tables without constraints
- Critical data integrity issues
- Orphaned records found
- Constraint violations

### Constraint Inventory
- **Primary Keys**: Count per schema, missing PKs
- **Foreign Keys**: Count, unindexed FKs, cascade settings
- **UNIQUE Constraints**: Single vs composite
- **CHECK Constraints**: Validation rules
- **NOT NULL Constraints**: Coverage by column type

### Critical Integrity Issues
- **High Priority**
  - Tables without primary keys
  - Missing NOT NULL on critical columns
  - Orphaned records (missing parent references)
  - Foreign keys without indexes
  - Tables with no constraints at all

- **Medium Priority**
  - Weak CHECK constraints
  - Missing UNIQUE constraints on business keys
  - Inconsistent constraint naming
  - Missing default values
  - Nullable columns that should be required

- **Low Priority**
  - Optimization opportunities
  - Better constraint definitions
  - Additional validation rules

### Referential Integrity Analysis
- Foreign key inventory (all relationships)
- Cascade delete/update configurations
- Circular reference detection
- Orphaned record analysis (if found)
- Missing FK constraints

### Trigger Analysis
- All triggers inventory
- Audit trail triggers
- Validation triggers
- Missing triggers on important operations
- Trigger execution order

### Data Quality Checks
For each schema:
- NULL value analysis in critical columns
- Duplicate detection on business keys
- Invalid enum or status values
- Date/timestamp consistency
- Email/phone format validation

### Constraint Naming Review
- Naming convention adherence
- Auto-generated vs explicit names
- Recommendations for standardization

### Recommendations
Prioritized fixes:

1. **Immediate Critical Fixes**
   - Add missing primary keys
   - Add NOT NULL to critical columns
   - Fix orphaned records
   - Add missing FK constraints

2. **Short Term Improvements**
   - Index foreign keys
   - Add UNIQUE constraints on business keys
   - Implement CHECK constraints
   - Add audit triggers

3. **Long Term Enhancements**
   - Standardize constraint naming
   - Add comprehensive validation
   - Implement data quality rules
   - Create constraint documentation

### Constraint Definition Examples
Provide SQL for recommended constraints:
```sql
-- Example: Add missing PRIMARY KEY
ALTER TABLE schema.table_name
ADD CONSTRAINT table_name_pkey PRIMARY KEY (id);

-- Example: Add NOT NULL constraint
ALTER TABLE schema.table_name
ALTER COLUMN column_name SET NOT NULL;

-- Example: Add CHECK constraint
ALTER TABLE schema.table_name
ADD CONSTRAINT check_status
CHECK (status IN ('active', 'inactive', 'pending'));
```

## Tools to Use

- `mcp__supabase__list_tables` - Get table list
- `mcp__supabase__execute_sql` - Run integrity queries
- `Write` - Create the report file

## Success Criteria

Agent completes when:
- All constraints analyzed
- All schemas checked
- Data quality queries executed
- Orphaned records identified
- Report saved to docs/database-analysis/
- No errors during execution

## Important Notes

- This analysis may return large datasets
- Some queries may be slow on large tables
- Agent should handle query timeouts gracefully
- Report should prioritize actionable findings
