# Rollback Testing Checklist

**Purpose:** Ensure every database migration can be safely rolled back in production
**Owner:** Database Team
**Review Frequency:** Before every migration deployment

---

## Overview

Every migration MUST have a tested rollback plan. This checklist ensures that rollback migrations are reliable, safe, and well-documented.

**Key Principle:** If you can't roll it back, you can't deploy it.

---

## Pre-Deployment Rollback Testing

### Phase 1: Rollback Migration Creation

**Timeline:** During migration development

- [ ] **Rollback file created**
  - Location: `rollback/YYYYMMDD_HHMMSS_descriptive_name_rollback.sql`
  - Naming matches forward migration
  - Contains complete reversal logic

- [ ] **Rollback header documentation complete**
  - Purpose clearly stated
  - Data loss implications documented
  - Recovery procedures included
  - Time estimates provided

- [ ] **Rollback SQL correct**
  - Drops objects in reverse dependency order
  - Uses IF EXISTS for idempotency
  - Includes validation checks
  - Has rollback validation query

- [ ] **Data preservation strategy defined**
  - Backup requirements documented
  - Archive tables created if needed
  - Data export scripts provided
  - Recovery procedures written

### Phase 2: Local Testing

**Timeline:** Before pull request

- [ ] **Fresh database test**
  - Apply forward migration to clean database
  - Apply rollback migration
  - Verify database returns to pre-migration state
  - No orphaned objects remain

- [ ] **Idempotency test**
  - Apply forward migration
  - Apply rollback migration
  - Apply rollback migration AGAIN
  - Verify no errors on second rollback run

- [ ] **Data integrity test**
  - Insert test data before migration
  - Apply forward migration
  - Verify test data still intact
  - Apply rollback migration
  - Verify test data still intact

- [ ] **Partial rollback test**
  - Apply forward migration
  - Simulate failure mid-migration
  - Apply rollback migration
  - Verify clean rollback from partial state

### Phase 3: Staging Environment Testing

**Timeline:** Before production deployment

- [ ] **Staging forward migration**
  - Deploy migration to staging
  - Verify all objects created
  - Run application integration tests
  - Monitor for errors

- [ ] **Staging rollback migration**
  - Apply rollback migration to staging
  - Verify all objects removed
  - Verify no orphaned dependencies
  - Check for error logs

- [ ] **Staging rollback timing**
  - Measure rollback execution time
  - Document blocking operations
  - Verify within acceptable window
  - Update rollback documentation

- [ ] **Staging data validation**
  - Verify data preserved/lost as expected
  - Test data export if needed
  - Validate referential integrity
  - Check for orphaned records

- [ ] **Staging application testing post-rollback**
  - Restart application after rollback
  - Verify no broken dependencies
  - Test core application flows
  - Check for migration-related errors

### Phase 4: Documentation Review

**Timeline:** Before production deployment

- [ ] **Rollback documentation complete**
  - Step-by-step rollback instructions
  - Time estimates provided
  - Data loss warnings clear
  - Recovery procedures documented

- [ ] **Runbook created**
  - Rollback execution steps
  - Validation queries provided
  - Success criteria defined
  - Failure recovery plan included

- [ ] **Communication plan ready**
  - Team notification procedures
  - Incident escalation path
  - User communication templates
  - Status update schedule

- [ ] **Approval obtained**
  - Database team approval
  - Technical lead approval
  - Product owner acknowledgment (if data loss)
  - Security review (if security-related)

---

## Production Rollback Procedures

### Rollback Decision Criteria

**When to rollback:**
- Migration fails to complete
- Critical bugs introduced
- Performance degradation detected
- Data corruption discovered
- Application errors caused by migration
- Security vulnerability introduced

**When NOT to rollback:**
- Minor non-critical bugs
- Expected performance changes
- User data already modified significantly
- Rollback would cause more data loss than keeping forward

### Rollback Execution Steps

#### Step 1: Assess Situation (5-10 minutes)

- [ ] **Identify issue**
  - What failed or is broken?
  - Is it definitely migration-related?
  - Can it be fixed forward?

- [ ] **Check rollback safety**
  - Has user data been modified?
  - Is rollback within safe time window?
  - Are backups available?
  - What data will be lost?

- [ ] **Make rollback decision**
  - Document decision rationale
  - Get approval if time permits
  - Notify team of rollback plan

#### Step 2: Pre-Rollback Backup (5 minutes)

- [ ] **Create point-in-time snapshot**
  - Trigger Supabase backup (if available)
  - Export critical data to CSV/JSON
  - Document snapshot timestamp

- [ ] **Verify backup accessible**
  - Check backup exists in Supabase dashboard
  - Verify export files readable
  - Note backup retention period

#### Step 3: Stop Application Traffic (2-5 minutes)

- [ ] **Put application in maintenance mode**
  - Enable maintenance page
  - Block new database connections
  - Allow existing requests to complete
  - Notify users of maintenance

- [ ] **Verify traffic stopped**
  - Check active database connections
  - Monitor for new queries
  - Ensure no users actively writing data

#### Step 4: Execute Rollback (Time varies)

- [ ] **Apply rollback migration**
  ```bash
  # Connect to Supabase
  psql "postgresql://[connection-string]"

  # Run rollback migration
  \i rollback/YYYYMMDD_HHMMSS_descriptive_name_rollback.sql

  # Check for errors
  # Review output messages
  ```

- [ ] **Monitor execution**
  - Watch for errors
  - Track execution time
  - Note any warnings
  - Verify completion message

#### Step 5: Validate Rollback (5-10 minutes)

- [ ] **Run validation queries**
  ```sql
  -- Verify table/objects removed
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'schema_name'
    AND tablename = 'example_table';
  -- Should return 0 rows

  -- Verify no orphaned indexes
  SELECT indexname
  FROM pg_indexes
  WHERE schemaname = 'schema_name'
    AND indexname LIKE '%example_table%';
  -- Should return 0 rows

  -- Verify no orphaned policies
  SELECT policyname
  FROM pg_policies
  WHERE schemaname = 'schema_name'
    AND tablename = 'example_table';
  -- Should return 0 rows

  -- Verify database health
  SELECT schemaname, tablename, last_vacuum, last_analyze
  FROM pg_stat_user_tables
  WHERE schemaname = 'schema_name';
  ```

- [ ] **Check for orphaned objects**
  - Functions still referencing removed objects
  - Views broken by missing dependencies
  - Triggers on removed tables
  - Foreign keys to removed tables

- [ ] **Verify application dependencies**
  - No broken imports in code
  - No queries to removed tables
  - No API endpoints broken

#### Step 6: Restart Application (5 minutes)

- [ ] **Restart application servers**
  - Deploy previous application version if needed
  - Clear application caches
  - Restart database connection pools

- [ ] **Disable maintenance mode**
  - Remove maintenance page
  - Allow user traffic
  - Monitor for errors

#### Step 7: Post-Rollback Validation (15-30 minutes)

- [ ] **Application smoke tests**
  - Test core user flows
  - Verify authentication works
  - Check database queries succeed
  - Monitor error rates

- [ ] **Database health check**
  - Check active connections
  - Monitor query performance
  - Verify RLS policies working
  - Check for constraint violations

- [ ] **Monitor application logs**
  - Watch for migration-related errors
  - Check for missing table errors
  - Monitor performance metrics
  - Track user-reported issues

#### Step 8: Post-Rollback Communication (15 minutes)

- [ ] **Notify team**
  - Rollback completed successfully
  - Current system status
  - Any remaining issues
  - Next steps

- [ ] **Update incident ticket**
  - Document rollback execution
  - Note any complications
  - Record validation results
  - Add lessons learned

- [ ] **Plan forward fix**
  - Root cause analysis
  - Fix strategy
  - Testing plan
  - Deployment timeline

---

## Rollback Safety Levels

### Level 1: Safe Rollback (GREEN)

**Characteristics:**
- No user data modified
- No schema dependencies
- Tested in staging
- Execution time <1 minute

**Approval:** Database team only

**Examples:**
- Adding an index
- Creating a view
- Adding a function
- Updating documentation

### Level 2: Low-Risk Rollback (YELLOW)

**Characteristics:**
- Minimal user data impact
- Few schema dependencies
- Tested in staging
- Execution time <5 minutes

**Approval:** Database team + Tech lead

**Examples:**
- Adding a table column (with default)
- Modifying RLS policies
- Adding constraints (non-null with backfill)
- Renaming objects

### Level 3: Medium-Risk Rollback (ORANGE)

**Characteristics:**
- Moderate user data impact
- Multiple schema dependencies
- Complex rollback logic
- Execution time <15 minutes

**Approval:** Database team + Tech lead + Product owner

**Examples:**
- Dropping a column
- Modifying data types
- Complex data migrations
- Restructuring relationships

### Level 4: High-Risk Rollback (RED)

**Characteristics:**
- Significant user data loss
- Critical schema changes
- Complex dependencies
- Execution time >15 minutes

**Approval:** Database team + Tech lead + Product owner + Executive approval

**Examples:**
- Dropping tables
- Removing critical features
- Major architectural changes
- Data purging operations

**Special Requirements:**
- Off-hours deployment only
- Extended maintenance window
- Dedicated monitoring team
- Rollback rehearsal required
- Customer notification required

---

## Rollback Failure Recovery

### If Rollback Fails

**Immediate Actions:**

1. **DO NOT retry blindly**
   - Assess failure reason
   - Check for partial state
   - Document exact error

2. **Preserve current state**
   - Take database dump immediately
   - Export all data to backup storage
   - Document current schema state

3. **Escalate immediately**
   - Notify database team lead
   - Contact Supabase support if needed
   - Engage incident response team

4. **Assess options**
   - Option A: Fix forward (complete the migration)
   - Option B: Manual rollback (step-by-step)
   - Option C: Point-in-time recovery from backup
   - Option D: Restore from pre-migration snapshot

### Manual Rollback Procedure

If automated rollback fails:

```sql
-- Step 1: Identify objects to remove
SELECT
  'DROP TABLE IF EXISTS ' || schemaname || '.' || tablename || ' CASCADE;' AS drop_statement
FROM pg_tables
WHERE schemaname = 'schema_name'
  AND tablename LIKE '%example_table%';

-- Step 2: Drop policies manually
SELECT
  'DROP POLICY IF EXISTS ' || policyname || ' ON ' || schemaname || '.' || tablename || ';' AS drop_statement
FROM pg_policies
WHERE schemaname = 'schema_name'
  AND tablename = 'example_table';

-- Step 3: Drop functions manually
SELECT
  'DROP FUNCTION IF EXISTS ' || n.nspname || '.' || p.proname || '(' ||
  pg_get_function_identity_arguments(p.oid) || ') CASCADE;' AS drop_statement
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'schema_name'
  AND p.proname LIKE '%example_table%';

-- Step 4: Drop views manually
SELECT
  'DROP VIEW IF EXISTS ' || schemaname || '.' || viewname || ' CASCADE;' AS drop_statement
FROM pg_views
WHERE schemaname = 'schema_name'
  AND viewname LIKE '%example_table%';

-- Step 5: Drop indexes manually
SELECT
  'DROP INDEX IF EXISTS ' || schemaname || '.' || indexname || ';' AS drop_statement
FROM pg_indexes
WHERE schemaname = 'schema_name'
  AND indexname LIKE '%example_table%';
```

### Point-in-Time Recovery (Last Resort)

**When to use:**
- Rollback completely failed
- Database in inconsistent state
- Data corruption detected
- Manual rollback too risky

**Procedure:**
1. Contact Supabase support immediately
2. Request point-in-time recovery
3. Specify target timestamp (before migration)
4. Coordinate maintenance window
5. Verify recovery success
6. Re-deploy application

**Downtime:** 1-4 hours
**Data loss:** All changes since recovery timestamp

---

## Rollback Testing Schedule

### Per-Migration Testing

- **Every new migration:** Full rollback test in local + staging
- **Before production:** Final rollback validation
- **Post-deployment:** Rollback plan rehearsal (without executing)

### Periodic Testing

- **Monthly:** Random rollback test on staging
- **Quarterly:** Full disaster recovery drill
- **Annually:** Complete rollback documentation review

---

## Rollback Metrics

### Track These Metrics

- **Rollback success rate:** % of rollbacks that succeed first try
- **Rollback execution time:** Average time to complete rollback
- **Rollback testing coverage:** % of migrations with tested rollbacks
- **Production rollbacks:** Count of prod rollbacks executed
- **Rollback failures:** Count of failed rollback attempts

### Target Metrics

- Rollback success rate: >95%
- Rollback execution time: <5 minutes average
- Rollback testing coverage: 100%
- Production rollbacks: <1 per quarter
- Rollback failures: 0 per year

---

## Lessons Learned Template

After every rollback (successful or failed), document:

**Migration Details:**
- Migration name and timestamp
- What it was supposed to do
- Risk level assigned

**Rollback Trigger:**
- What went wrong
- When it was detected
- Who made rollback decision

**Rollback Execution:**
- What steps were taken
- How long it took
- Any complications encountered

**Outcome:**
- Was rollback successful?
- Any data loss?
- Application impact?

**Lessons Learned:**
- What could have been prevented?
- What went well?
- What needs improvement?
- Process changes needed?

---

## Appendix: Quick Reference Commands

### Check if rollback exists
```bash
ls -la rollback/ | grep "YYYYMMDD_HHMMSS_descriptive_name"
```

### Validate rollback SQL syntax
```bash
psql -h localhost -U postgres -d test_db -f rollback/YYYYMMDD_HHMMSS_descriptive_name_rollback.sql --dry-run
```

### Execute rollback (local)
```bash
psql -h localhost -U postgres -d enorae_dev -f rollback/YYYYMMDD_HHMMSS_descriptive_name_rollback.sql
```

### Execute rollback (production)
```bash
psql "postgresql://postgres:[password]@db.nwmcpfioxerzodvbjigw.supabase.co:5432/postgres" \
  -f rollback/YYYYMMDD_HHMMSS_descriptive_name_rollback.sql
```

### Verify no orphaned objects
```sql
-- Check for any objects with migration name
SELECT
  'TABLE' AS object_type,
  schemaname || '.' || tablename AS object_name
FROM pg_tables
WHERE tablename LIKE '%example_table%'
UNION ALL
SELECT
  'INDEX' AS object_type,
  schemaname || '.' || indexname AS object_name
FROM pg_indexes
WHERE indexname LIKE '%example_table%'
UNION ALL
SELECT
  'VIEW' AS object_type,
  schemaname || '.' || viewname AS object_name
FROM pg_views
WHERE viewname LIKE '%example_table%'
UNION ALL
SELECT
  'FUNCTION' AS object_type,
  n.nspname || '.' || p.proname AS object_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname LIKE '%example_table%';
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-22
**Owner:** Database Team
**Review Frequency:** Quarterly

**Related Documents:**
- `MIGRATION_TEMPLATE_WITH_ROLLBACK.sql`
- `MIGRATION_WORKFLOW.md`
- `MIGRATION_HISTORY.md`

**END OF ROLLBACK TESTING CHECKLIST**
