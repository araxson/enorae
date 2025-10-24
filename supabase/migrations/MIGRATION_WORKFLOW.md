# ENORAE Database Migration Workflow Guide

**Version:** 1.0
**Date:** 2025-10-21
**Status:** MANDATORY - All database changes MUST follow this workflow

---

## Overview

This document establishes the REQUIRED workflow for all database schema changes in the ENORAE project. Following this process ensures:

- ✅ Version control of all database changes
- ✅ Safe rollback capability
- ✅ Testing before production deployment
- ✅ Team collaboration and review
- ✅ Audit trail of all changes
- ✅ Reduced risk of data loss or corruption

**CRITICAL:** The database migration freeze from October 21, 2025, establishes this workflow as mandatory. No exceptions without CTO approval.

---

## Migration Workflow Phases

### Phase 1: Planning & Design

**Before writing any SQL:**

1. **Document the Change**
   - What problem are you solving?
   - What database objects will be affected?
   - What are the business requirements?
   - What are the performance implications?

2. **Assess Impact**
   - Will this be a breaking change?
   - What application code depends on affected objects?
   - How much downtime is acceptable?
   - What is the rollback strategy?

3. **Get Approval**
   - Discuss with team lead
   - Review with affected stakeholders
   - Document in project management system
   - Get written approval for breaking changes

### Phase 2: Local Development

**Create and test migration locally:**

1. **Create Migration File**
   ```bash
   # Navigate to project root
   cd /Users/afshin/Desktop/Enorae

   # Create new migration with descriptive name
   supabase migration new descriptive_name_of_change

   # This creates: supabase/migrations/YYYYMMDDHHMMSS_descriptive_name_of_change.sql
   ```

2. **Write Migration SQL**

   **Required Migration Structure:**
   ```sql
   -- Migration: [Brief Description]
   -- Date: YYYY-MM-DD
   -- Author: [Your Name]
   -- Purpose: [Why this change is needed]
   -- Impact: [What this affects]
   -- Breaking Change: [Yes/No - explain if yes]

   -- ============================================================================
   -- MIGRATION START
   -- ============================================================================

   BEGIN;

   -- Step 1: [Description]
   -- Rationale: [Why]
   [SQL commands...]

   -- Step 2: [Description]
   -- Rationale: [Why]
   [SQL commands...]

   -- Verify changes
   DO $$
   BEGIN
     -- Add verification logic
     IF NOT EXISTS (...) THEN
       RAISE EXCEPTION 'Migration verification failed: ...';
     END IF;
   END $$;

   COMMIT;

   -- ============================================================================
   -- MIGRATION END
   -- ============================================================================
   ```

3. **Create Rollback Migration**

   **MANDATORY:** Create corresponding rollback file:
   ```bash
   # Manually create rollback file
   touch supabase/migrations/YYYYMMDDHHMMSS_descriptive_name_of_change_DOWN.sql
   ```

   **Rollback File Structure:**
   ```sql
   -- Rollback Migration: [Brief Description]
   -- Date: YYYY-MM-DD
   -- Author: [Your Name]
   -- Purpose: Undo migration YYYYMMDDHHMMSS_descriptive_name_of_change
   -- WARNING: This will revert [specific changes]

   BEGIN;

   -- Undo Step 2 first (reverse order)
   [Undo SQL commands...]

   -- Undo Step 1
   [Undo SQL commands...]

   -- Verify rollback
   DO $$
   BEGIN
     -- Add verification logic
     IF EXISTS (...) THEN
       RAISE EXCEPTION 'Rollback verification failed: ...';
     END IF;
   END $$;

   COMMIT;
   ```

4. **Test in Local Supabase**
   ```bash
   # Start local Supabase (if not running)
   supabase start

   # Reset database to clean state
   supabase db reset

   # This applies ALL migrations including your new one
   # Verify in local dashboard: http://localhost:54323

   # Test rollback
   psql postgresql://postgres:postgres@localhost:54322/postgres \
     -f supabase/migrations/YYYYMMDDHHMMSS_descriptive_name_of_change_DOWN.sql

   # Reset again to verify forward migration still works
   supabase db reset
   ```

5. **Write Verification Tests**

   Create test file: `supabase/tests/YYYYMMDDHHMMSS_descriptive_name_test.sql`
   ```sql
   -- Test: Verify migration YYYYMMDDHHMMSS_descriptive_name_of_change

   BEGIN;

   -- Test 1: Object exists
   SELECT 1/(COUNT(*)::int) FROM information_schema.tables
   WHERE table_schema = 'schema_name' AND table_name = 'table_name';

   -- Test 2: RLS enabled
   SELECT 1/(COUNT(*)::int) FROM pg_tables
   WHERE schemaname = 'schema_name' AND tablename = 'table_name' AND rowsecurity = true;

   -- Test 3: Indexes created
   SELECT 1/(COUNT(*)::int) FROM pg_indexes
   WHERE schemaname = 'schema_name' AND tablename = 'table_name' AND indexname = 'index_name';

   -- Add more tests as needed

   ROLLBACK;
   ```

### Phase 3: Code Review

**Submit for peer review:**

1. **Create Pull Request**
   ```bash
   git checkout -b migration/descriptive-name
   git add supabase/migrations/YYYYMMDDHHMMSS_*
   git add supabase/tests/YYYYMMDDHHMMSS_*
   git commit -m "feat(db): add [description of change]

   Migration: YYYYMMDDHHMMSS_descriptive_name_of_change

   Changes:
   - [List changes]
   - [List changes]

   Breaking Change: [Yes/No]
   Rollback: Included
   Tests: Included"

   git push origin migration/descriptive-name
   ```

2. **Review Checklist**

   Reviewer must verify:
   - [ ] Migration file follows naming convention
   - [ ] Descriptive comments included
   - [ ] Operations are idempotent
   - [ ] Rollback migration included
   - [ ] Verification tests included
   - [ ] No syntax errors
   - [ ] Security implications reviewed
   - [ ] RLS policies verified (if applicable)
   - [ ] Indexes use CONCURRENTLY (if applicable)
   - [ ] Breaking changes documented
   - [ ] Performance impact assessed

3. **Address Feedback**
   - Make requested changes
   - Re-test locally
   - Update PR

### Phase 4: Staging Deployment

**Deploy to staging environment:**

1. **Pre-Deployment**
   ```bash
   # Backup staging database
   # Via Supabase Dashboard: Backups → Create Backup
   # Label: "Pre-migration [YYYYMMDD-HHMM] - [description]"

   # Export current schema
   supabase db dump --db-url "$STAGING_DB_URL" --schema-only > staging_pre_migration.sql
   ```

2. **Deploy Migration**
   ```bash
   # Link to staging project
   supabase link --project-ref $STAGING_PROJECT_REF

   # Push migration
   supabase db push

   # Verify in Supabase Dashboard
   ```

3. **Verify Deployment**
   ```bash
   # Run verification tests
   psql "$STAGING_DB_URL" -f supabase/tests/YYYYMMDDHHMMSS_descriptive_name_test.sql

   # Check application functionality
   # Run integration tests
   # Verify UI works correctly
   ```

4. **Monitor for 24 Hours**
   - Watch error rates
   - Check query performance
   - Monitor connection pool
   - Review application logs

5. **Test Rollback (DO NOT SKIP)**
   ```bash
   # Execute rollback in staging
   psql "$STAGING_DB_URL" -f supabase/migrations/YYYYMMDDHHMMSS_descriptive_name_of_change_DOWN.sql

   # Verify rollback worked
   # Re-apply migration
   psql "$STAGING_DB_URL" -f supabase/migrations/YYYYMMDDHHMMSS_descriptive_name_of_change.sql

   # Verify forward migration still works
   ```

### Phase 5: Production Deployment

**Deploy to production (HIGH RISK - FOLLOW EXACTLY):**

1. **Pre-Deployment Checklist**
   - [ ] Staging deployment successful for 24+ hours
   - [ ] Application tests passing in staging
   - [ ] Rollback tested successfully in staging
   - [ ] Team notified of deployment window
   - [ ] Maintenance window scheduled (if needed)
   - [ ] On-call engineer assigned
   - [ ] Backup verified recently

2. **Backup Production**
   ```bash
   # MANDATORY: Create production backup
   # Via Supabase Dashboard: Backups → Create Backup
   # Label: "Pre-migration [YYYYMMDD-HHMM] - [description] - PRODUCTION"

   # Export schema
   supabase db dump --db-url "$PRODUCTION_DB_URL" --schema-only > prod_pre_migration_$(date +%Y%m%d_%H%M%S).sql

   # Export affected data (if applicable)
   pg_dump --data-only --table=schema.table_name > prod_data_backup_$(date +%Y%m%d_%H%M%S).sql
   ```

3. **Deploy Migration**
   ```bash
   # Link to production
   supabase link --project-ref nwmcpfioxerzodvbjigw

   # FINAL VERIFICATION: Review migration file one more time
   cat supabase/migrations/YYYYMMDDHHMMSS_descriptive_name_of_change.sql

   # Deploy
   supabase db push

   # Immediately verify in Supabase Dashboard
   ```

4. **Immediate Verification**
   ```bash
   # Run verification tests
   psql "$PRODUCTION_DB_URL" -f supabase/tests/YYYYMMDDHHMMSS_descriptive_name_test.sql

   # Check key application endpoints
   # Verify no error spikes in monitoring
   # Check database connection pool
   ```

5. **Post-Deployment Monitoring (24 Hours)**

   **Monitor these metrics:**
   - Error rates (application logs)
   - Query performance (slow query log)
   - Connection pool usage
   - RLS policy violations
   - Index usage
   - Table bloat
   - Replication lag (if applicable)

   **Alert on:**
   - Error rate increase >10%
   - Query latency increase >20%
   - Connection pool exhaustion
   - Any security violations

6. **Rollback Procedure (If Needed)**
   ```bash
   # EMERGENCY: Execute rollback
   psql "$PRODUCTION_DB_URL" -f supabase/migrations/YYYYMMDDHHMMSS_descriptive_name_of_change_DOWN.sql

   # Verify rollback
   # Restore from backup if rollback fails:
   # Supabase Dashboard → Backups → Point-in-Time Recovery
   # Select timestamp BEFORE migration

   # Post-mortem required for all production rollbacks
   ```

### Phase 6: Documentation

**After successful deployment:**

1. **Update Documentation**
   - Add to MIGRATION_HISTORY.md
   - Update schema documentation
   - Document breaking changes in CHANGELOG.md
   - Update API documentation (if applicable)

2. **Post-Deployment Report**

   Create: `docs/migrations/YYYYMMDDHHMMSS_report.md`
   ```markdown
   # Migration Report: [Description]

   **Migration ID:** YYYYMMDDHHMMSS_descriptive_name_of_change
   **Date:** YYYY-MM-DD
   **Author:** [Your Name]
   **Status:** Successful / Rolled Back

   ## Summary
   [Brief description of changes]

   ## Deployment Timeline
   - Staging: YYYY-MM-DD HH:MM
   - Production: YYYY-MM-DD HH:MM

   ## Verification Results
   - [ ] Tests passing
   - [ ] Application functioning correctly
   - [ ] Performance within acceptable range
   - [ ] No security issues detected

   ## Metrics Before/After
   | Metric | Before | After | Change |
   |--------|--------|-------|--------|
   | Query latency | ... | ... | ... |
   | Error rate | ... | ... | ... |

   ## Issues Encountered
   [List any issues and resolutions]

   ## Lessons Learned
   [What went well, what could be improved]
   ```

3. **Close Tracking Ticket**
   - Mark migration as complete
   - Link to PR and report
   - Update project board

---

## Migration Templates

### Template: Add New Table

```sql
-- Migration: Add [table_name] table
-- Date: YYYY-MM-DD
-- Author: [Your Name]
-- Purpose: [Why this table is needed]
-- Impact: New table, no breaking changes
-- Breaking Change: No

BEGIN;

-- Create table
CREATE TABLE IF NOT EXISTS schema_name.table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES organization.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Constraints
  CONSTRAINT table_name_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 255)
);

-- Add comments
COMMENT ON TABLE schema_name.table_name IS '[Description of table purpose]';
COMMENT ON COLUMN schema_name.table_name.salon_id IS 'Multi-tenant isolation';

-- Create indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_name_salon_id
  ON schema_name.table_name(salon_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_name_created_at
  ON schema_name.table_name(created_at DESC);

-- Enable RLS
ALTER TABLE schema_name.table_name ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view records for their salon"
  ON schema_name.table_name FOR SELECT
  TO authenticated
  USING (
    salon_id IN (
      SELECT salon_id FROM identity.user_roles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert records for their salon"
  ON schema_name.table_name FOR INSERT
  TO authenticated
  WITH CHECK (
    salon_id IN (
      SELECT salon_id FROM identity.user_roles
      WHERE user_id = auth.uid() AND role IN ('salon_owner', 'salon_manager')
    )
  );

-- Add triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON schema_name.table_name
  FOR EACH ROW
  EXECUTE FUNCTION utility.set_updated_at();

-- Grant permissions
GRANT SELECT ON schema_name.table_name TO authenticated;
GRANT INSERT ON schema_name.table_name TO authenticated;
GRANT UPDATE ON schema_name.table_name TO authenticated;

-- Verify
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'schema_name' AND tablename = 'table_name'
  ) THEN
    RAISE EXCEPTION 'Table creation failed';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'schema_name' AND tablename = 'table_name' AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled';
  END IF;
END $$;

COMMIT;
```

**Rollback:**
```sql
-- Rollback: Remove [table_name] table
BEGIN;

DROP TABLE IF EXISTS schema_name.table_name CASCADE;

-- Verify
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'schema_name' AND tablename = 'table_name'
  ) THEN
    RAISE EXCEPTION 'Table drop failed';
  END IF;
END $$;

COMMIT;
```

### Template: Add Column to Existing Table

```sql
-- Migration: Add [column_name] to [table_name]
-- Date: YYYY-MM-DD
-- Author: [Your Name]
-- Purpose: [Why this column is needed]
-- Impact: Adds optional column, no breaking changes
-- Breaking Change: No

BEGIN;

-- Add column (nullable initially to avoid locking)
ALTER TABLE schema_name.table_name
  ADD COLUMN IF NOT EXISTS column_name data_type;

-- Add comment
COMMENT ON COLUMN schema_name.table_name.column_name IS '[Description]';

-- Create index if needed
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_name_column_name
  ON schema_name.table_name(column_name);

-- Add constraint (after data population if needed)
ALTER TABLE schema_name.table_name
  ADD CONSTRAINT check_column_name
  CHECK (column_name IS NULL OR [validation]);

-- Verify
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'schema_name'
      AND table_name = 'table_name'
      AND column_name = 'column_name'
  ) THEN
    RAISE EXCEPTION 'Column addition failed';
  END IF;
END $$;

COMMIT;
```

**Rollback:**
```sql
-- Rollback: Remove [column_name] from [table_name]
BEGIN;

ALTER TABLE schema_name.table_name
  DROP COLUMN IF EXISTS column_name CASCADE;

-- Verify
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'schema_name'
      AND table_name = 'table_name'
      AND column_name = 'column_name'
  ) THEN
    RAISE EXCEPTION 'Column drop failed';
  END IF;
END $$;

COMMIT;
```

### Template: Create Index

```sql
-- Migration: Create index on [table_name]([column_name])
-- Date: YYYY-MM-DD
-- Author: [Your Name]
-- Purpose: Improve query performance for [specific query]
-- Impact: Performance improvement, minimal downtime
-- Breaking Change: No

BEGIN;

-- Create index CONCURRENTLY (doesn't lock table)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_name_column_name
  ON schema_name.table_name(column_name);

-- Add comment
COMMENT ON INDEX schema_name.idx_table_name_column_name IS
  'Improves performance for queries filtering by column_name';

-- Verify
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'schema_name'
      AND tablename = 'table_name'
      AND indexname = 'idx_table_name_column_name'
  ) THEN
    RAISE EXCEPTION 'Index creation failed';
  END IF;
END $$;

COMMIT;
```

**Rollback:**
```sql
-- Rollback: Drop index idx_table_name_column_name
BEGIN;

DROP INDEX CONCURRENTLY IF EXISTS schema_name.idx_table_name_column_name;

-- Verify
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'schema_name'
      AND indexname = 'idx_table_name_column_name'
  ) THEN
    RAISE EXCEPTION 'Index drop failed';
  END IF;
END $$;

COMMIT;
```

### Template: Add RLS Policy

```sql
-- Migration: Add RLS policy for [table_name]
-- Date: YYYY-MM-DD
-- Author: [Your Name]
-- Purpose: [Security requirement]
-- Impact: May restrict access for some users
-- Breaking Change: Potentially (test thoroughly)

BEGIN;

-- Ensure RLS is enabled
ALTER TABLE schema_name.table_name ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "policy_name"
  ON schema_name.table_name
  FOR [SELECT|INSERT|UPDATE|DELETE]
  TO authenticated
  USING ([condition])
  WITH CHECK ([condition]);  -- For INSERT/UPDATE only

-- Add comment
COMMENT ON POLICY "policy_name" ON schema_name.table_name IS
  '[Description of what this policy enforces]';

-- Verify
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'schema_name'
      AND tablename = 'table_name'
      AND policyname = 'policy_name'
  ) THEN
    RAISE EXCEPTION 'Policy creation failed';
  END IF;
END $$;

COMMIT;
```

**Rollback:**
```sql
-- Rollback: Remove RLS policy policy_name
BEGIN;

DROP POLICY IF EXISTS "policy_name" ON schema_name.table_name;

-- Verify
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'schema_name'
      AND tablename = 'table_name'
      AND policyname = 'policy_name'
  ) THEN
    RAISE EXCEPTION 'Policy drop failed';
  END IF;
END $$;

COMMIT;
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Blocking Index Creation

**Problem:** Creating index without CONCURRENTLY locks table
**Solution:** Always use CREATE INDEX CONCURRENTLY
```sql
-- ❌ DON'T: Locks table during creation
CREATE INDEX idx_name ON table_name(column);

-- ✅ DO: Non-blocking index creation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_name ON table_name(column);
```

### Pitfall 2: Adding NOT NULL Without Data Validation

**Problem:** ALTER COLUMN SET NOT NULL fails if nulls exist
**Solution:** Update data first, then add constraint
```sql
-- ❌ DON'T: Fails if nulls exist
ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL;

-- ✅ DO: Two-step process
-- Step 1: Update nulls
UPDATE table_name SET column_name = default_value WHERE column_name IS NULL;
-- Step 2: Add constraint
ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL;
```

### Pitfall 3: Breaking RLS Policies

**Problem:** Policy changes can accidentally block legitimate access
**Solution:** Test in staging with actual user accounts
```sql
-- Test RLS policies as specific user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO 'user-uuid';
SELECT * FROM schema_name.table_name;  -- Should see appropriate rows
```

### Pitfall 4: Missing Rollback Plans

**Problem:** Can't undo migration when it breaks production
**Solution:** Always create rollback migration
```sql
-- ALWAYS create both:
-- YYYYMMDDHHMMSS_add_feature.sql (forward)
-- YYYYMMDDHHMMSS_add_feature_DOWN.sql (rollback)
```

### Pitfall 5: Forgetting to Enable RLS

**Problem:** New tables exposed without access control
**Solution:** Enable RLS immediately after table creation
```sql
CREATE TABLE schema_name.new_table (...);
-- ✅ DO THIS IMMEDIATELY:
ALTER TABLE schema_name.new_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY ... ON schema_name.new_table ...;
```

---

## Emergency Procedures

### Emergency Rollback

If production migration fails:

1. **STOP** - Do not attempt to fix forward
2. **Assess** - What broke? How many users affected?
3. **Execute Rollback**
   ```bash
   psql "$PRODUCTION_DB_URL" \
     -f supabase/migrations/YYYYMMDDHHMMSS_migration_name_DOWN.sql
   ```
4. **Verify** - Is system stable?
5. **Notify** - Alert team and users (if applicable)
6. **Post-Mortem** - Document what happened, why, and how to prevent

### Point-in-Time Recovery

If rollback fails:

1. **Supabase Dashboard** → Database → Backups
2. **Point-in-Time Recovery** → Select timestamp BEFORE migration
3. **Review impact** - What data will be lost?
4. **Confirm recovery**
5. **Verify restoration**
6. **Notify team**

### Data Corruption

If migration corrupts data:

1. **Restore from backup** (see above)
2. **Investigate** - What query caused corruption?
3. **Fix data** - Manual SQL if recoverable
4. **Document** - Log incident and resolution
5. **Prevent** - Add validation to avoid recurrence

---

## Tools & Resources

### Supabase CLI Commands

```bash
# Initialize local project
supabase init

# Start local Supabase
supabase start

# Create new migration
supabase migration new migration_name

# Apply migrations to local DB
supabase db reset

# Link to remote project
supabase link --project-ref nwmcpfioxerzodvbjigw

# Push migrations to remote
supabase db push

# Pull remote schema
supabase db pull

# Export database
supabase db dump --schema-only > schema.sql
supabase db dump --data-only > data.sql

# Stop local Supabase
supabase stop
```

### PostgreSQL Commands

```bash
# Connect to database
psql "$DATABASE_URL"

# Execute migration
psql "$DATABASE_URL" -f migration.sql

# Export schema
pg_dump --schema-only > schema.sql

# Export specific table
pg_dump --table=schema.table_name > table.sql

# Check migration status
psql "$DATABASE_URL" -c "SELECT * FROM supabase_migrations.schema_migrations ORDER BY version DESC LIMIT 10;"
```

### Monitoring Queries

```sql
-- Check table sizes
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

-- Check RLS coverage
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'auth', 'storage')
ORDER BY schemaname, tablename;

-- Check unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexrelid NOT IN (
  SELECT conindid FROM pg_constraint WHERE contype IN ('p', 'u')
)
ORDER BY pg_relation_size(indexrelid) DESC;

-- Check slow queries (if pg_stat_statements enabled)
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

---

## Approval Matrix

| Change Type | Local Dev | Peer Review | Team Lead | CTO | Production Deploy |
|-------------|-----------|-------------|-----------|-----|-------------------|
| Add table | Required | Required | Notification | - | After 24h staging |
| Drop table | Required | Required | Required | Required | After 72h staging |
| Add column | Required | Required | Notification | - | After 24h staging |
| Drop column | Required | Required | Required | Notification | After 48h staging |
| Add index | Required | Required | - | - | After 24h staging |
| Modify RLS | Required | Required | Required | - | After 48h staging |
| Data migration | Required | Required | Required | Notification | After 72h staging |
| Breaking change | Required | Required | Required | Required | After 72h staging + planned maintenance |

---

## Checklist: Pre-Deployment

Print this and check off before EVERY production deployment:

- [ ] Migration tested in local Supabase instance
- [ ] Rollback migration created and tested
- [ ] Peer review completed and approved
- [ ] Staging deployment successful for 24+ hours
- [ ] Application tests passing in staging
- [ ] Breaking changes documented
- [ ] Team notified of deployment
- [ ] Production backup created
- [ ] Deployment window scheduled (if needed)
- [ ] On-call engineer assigned
- [ ] Monitoring alerts configured
- [ ] Rollback procedure documented
- [ ] Performance baseline documented

**Signature:** _________________ **Date:** _________________

---

**Version:** 1.0
**Last Updated:** 2025-10-21
**Next Review:** After 10 migrations using this workflow

**MANDATORY COMPLIANCE:** All database changes must follow this workflow. No exceptions without written CTO approval.
