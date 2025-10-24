# Database Migration History & Consistency Analyzer Agent

Create an agent that performs ultra-deep analysis of database migrations, version control, schema evolution, and migration consistency.

## Agent Objective

Analyze migration history, detect drift between migrations and actual schema, identify missing migrations, rollback capabilities, and ensure database version consistency.

## Analysis Tasks

1. **Migration Inventory**
   - List all migrations in chronological order
   - Check for gaps in migration sequence
   - Identify applied vs pending migrations
   - Verify migration naming conventions

2. **Schema Drift Detection**
   - Compare migration definitions to actual schema
   - Find manually applied schema changes
   - Identify objects not tracked in migrations
   - Detect rollback-only changes

3. **Migration Quality**
   - Check for idempotent migrations
   - Identify migrations without rollback
   - Find migrations with hard-coded values
   - Detect dangerous operations (DROP without backup)

4. **Version Control**
   - Check migration version numbers
   - Identify timestamp vs sequential versioning
   - Find duplicate version numbers
   - Verify migration order consistency

5. **Migration Safety**
   - Identify blocking migrations (locks)
   - Find migrations without transactions
   - Detect data loss risks
   - Check for dependency chains

## SQL Queries to Execute

```sql
-- Get migration history from supabase_migrations table
SELECT
  version,
  name,
  executed_at,
  hash
FROM supabase_migrations.schema_migrations
ORDER BY version;

-- Count total migrations
SELECT
  COUNT(*) as total_migrations,
  MIN(executed_at) as first_migration,
  MAX(executed_at) as latest_migration
FROM supabase_migrations.schema_migrations;

-- Check for schema objects not in public views
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, tablename;

-- List all functions (potential migration drift)
SELECT
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  l.lanname as language,
  CASE
    WHEN p.provolatile = 'i' THEN 'IMMUTABLE'
    WHEN p.provolatile = 's' THEN 'STABLE'
    WHEN p.provolatile = 'v' THEN 'VOLATILE'
  END as volatility
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
JOIN pg_language l ON p.prolang = l.oid
WHERE n.nspname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND p.prokind = 'f'
ORDER BY n.nspname, p.proname;

-- List all custom types
SELECT
  n.nspname as schema_name,
  t.typname as type_name,
  CASE t.typtype
    WHEN 'b' THEN 'Base'
    WHEN 'c' THEN 'Composite'
    WHEN 'd' THEN 'Domain'
    WHEN 'e' THEN 'Enum'
    WHEN 'p' THEN 'Pseudo'
    WHEN 'r' THEN 'Range'
  END as type_kind
FROM pg_type t
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND t.typtype IN ('e', 'c', 'd')
ORDER BY n.nspname, t.typname;

-- Check for extensions
SELECT
  extname as extension_name,
  extversion as version,
  nspname as schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
ORDER BY extname;

-- Find sequences
SELECT
  schemaname,
  sequencename,
  last_value,
  start_value,
  increment_by,
  max_value,
  min_value,
  cycle
FROM pg_sequences
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, sequencename;

-- Check for materialized views
SELECT
  schemaname,
  matviewname as view_name,
  definition,
  ispopulated
FROM pg_matviews
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, matviewname;

-- Get database version and settings
SELECT
  version() as postgres_version,
  current_database() as database_name,
  current_schemas(false) as search_path;

-- Check for duplicate function definitions (possible migration issues)
SELECT
  n.nspname as schema_name,
  p.proname as function_name,
  COUNT(*) as definition_count
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
GROUP BY n.nspname, p.proname
HAVING COUNT(*) > 1;
```

## Report Structure

Create a markdown report at `docs/database-analysis/05-migration-history-report.md` with:

### Executive Summary
- Total migrations executed
- First migration date
- Latest migration date
- Migration health score
- Critical issues found

### Migration Timeline
Visual timeline:
```
2024-01: 15 migrations
2024-02: 23 migrations
2024-03: 18 migrations
...
```

### Migration Inventory
Complete list of all migrations:
- Version number
- Name/description
- Execution timestamp
- Hash/checksum (if available)

### Schema Drift Analysis
- **Objects in Database but Not in Migrations**
  - Manually created tables
  - Ad-hoc functions
  - Untracked views
  - Custom types

- **Objects in Migrations but Not in Database**
  - Possibly rolled back
  - Failed migrations
  - Environment-specific objects

### Migration Quality Issues
- **High Priority**
  - Migrations without transactions
  - Non-idempotent operations
  - Missing rollback scripts
  - Hard-coded IDs or values
  - Dangerous DROP operations

- **Medium Priority**
  - Inconsistent naming conventions
  - Missing migration descriptions
  - Version number gaps
  - Large migrations (>1000 lines)

- **Low Priority**
  - Missing comments
  - Formatting inconsistencies
  - Migration organization

### Database Objects Inventory
- **Tables**: Count by schema
- **Views**: Regular vs materialized
- **Functions**: By language and schema
- **Triggers**: Count and types
- **Types**: Enums, composites, domains
- **Extensions**: Installed versions
- **Sequences**: Usage and configuration

### Version Control Analysis
- Versioning scheme used (timestamp vs sequential)
- Migration gaps or skipped versions
- Duplicate version numbers
- Out-of-order executions

### Rollback Capability
- Migrations with explicit rollback scripts
- Migrations requiring manual rollback
- Irreversible operations (data deletion)
- Backup recommendations

### Critical Findings
List of issues requiring immediate attention:
1. Schema drift requiring migration
2. Failed or partial migrations
3. Dangerous untracked changes
4. Version control inconsistencies

### Extension Analysis
- All installed extensions
- Extension versions
- Extension dependencies
- Recommended extensions not installed

### Function & Trigger Inventory
Complete catalog:
- User-defined functions by schema
- Trigger functions
- Built-in function usage
- Potential performance impacts

### Recommendations

**Immediate Actions:**
1. Create migrations for untracked schema changes
2. Fix broken or incomplete migrations
3. Document migration rollback procedures
4. Establish migration review process

**Short Term:**
1. Standardize migration naming
2. Add idempotency checks
3. Create backup procedures
4. Document migration dependencies

**Long Term:**
1. Implement automated migration testing
2. Create migration templates
3. Set up migration monitoring
4. Establish schema governance

### Migration Best Practices Checklist
- [ ] All migrations in version control
- [ ] Migrations are idempotent
- [ ] Each migration has rollback script
- [ ] No hard-coded values in migrations
- [ ] Migrations use transactions
- [ ] Large data migrations are batched
- [ ] Schema changes tested in staging
- [ ] Migration order documented
- [ ] Breaking changes planned
- [ ] Backup before migration

### Schema Evolution Metrics
- Average migrations per month
- Schema stability score
- Breaking changes count
- Rollback frequency
- Migration success rate

## Tools to Use

- `mcp__supabase__list_migrations` - Get migration list
- `mcp__supabase__list_extensions` - Get extensions
- `mcp__supabase__list_tables` - Get table list
- `mcp__supabase__execute_sql` - Run analysis queries
- `Read` - Read migration files from supabase/migrations/ directory
- `Glob` - Find all migration files
- `Write` - Create the report file

## Success Criteria

Agent completes when:
- All migrations analyzed
- Schema drift detected and documented
- Migration quality assessed
- Database objects inventoried
- Report saved to docs/database-analysis/
- No errors during execution

## Important Notes

- Agent should read actual migration files if available in project
- Compare file contents to executed migrations
- Check for migration file naming conventions
- Identify any differences between dev/staging/prod
- Look for manual schema changes in git history
