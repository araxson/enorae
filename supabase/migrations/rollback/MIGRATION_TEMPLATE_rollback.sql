/**
 * ROLLBACK SCRIPT
 *
 * Migration: YYYYMMDD_HHMMSS_descriptive_name
 * Rollback Date: [When this rollback is being executed]
 * Executed By: [Name/Role]
 *
 * ============================================================================
 * WARNING: POTENTIALLY DESTRUCTIVE OPERATION
 * ============================================================================
 *
 * This rollback script will PERMANENTLY:
 *   - Drop table: schema_name.example_table
 *   - Drop associated indexes, triggers, policies
 *   - Drop helper functions and views
 *   - [List any data that will be lost]
 *
 * Data Loss Assessment:
 *   - Tables Affected: [list tables]
 *   - Records at Risk: [estimate or query count]
 *   - Cascade Effects: [list cascading deletes]
 *   - Restoration Possible: [Yes/No] - [Explain how]
 *
 * ============================================================================
 * PRE-ROLLBACK CHECKLIST
 * ============================================================================
 *
 * Complete this checklist BEFORE executing rollback:
 *
 *   [ ] Database backup created (timestamp: ____________)
 *   [ ] Table data exported (if recovery needed)
 *   [ ] Application deployment rolled back (if applicable)
 *   [ ] No active users accessing affected tables
 *   [ ] Dependencies checked (no other tables reference this)
 *   [ ] Downstream systems notified (if applicable)
 *   [ ] Rollback tested in staging environment
 *   [ ] Approval obtained from: ____________
 *   [ ] Maintenance window scheduled (if needed)
 *   [ ] Rollback plan reviewed by: ____________
 *   [ ] Recovery plan documented (if things go wrong)
 *
 * ============================================================================
 * ROLLBACK RISK ASSESSMENT
 * ============================================================================
 *
 * Risk Level: [Low | Medium | High | Critical]
 *
 * Risks:
 *   - [List specific risks of this rollback]
 *   - [Note any irreversible actions]
 *   - [Document potential for data loss]
 *
 * Mitigation:
 *   - [Steps taken to reduce risk]
 *   - [Backup/recovery procedures in place]
 *
 * Estimated Rollback Time: [duration]
 * Estimated Downtime: [None | duration]
 *
 * ============================================================================
 * DEPENDENCIES CHECK
 * ============================================================================
 */

-- Check for dependent objects BEFORE proceeding
DO $$
DECLARE
  dependent_count INTEGER;
  record_count BIGINT;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'ROLLBACK PRE-FLIGHT CHECKS';
  RAISE NOTICE '========================================';

  -- Check if table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'schema_name'
      AND table_name = 'example_table'
  ) THEN
    RAISE NOTICE '✓ Table already does not exist - rollback may be unnecessary';
    RETURN;
  END IF;

  -- Count records that will be lost
  SELECT COUNT(*) INTO record_count
  FROM schema_name.example_table;

  RAISE WARNING '⚠️  Table contains % records that will be PERMANENTLY DELETED', record_count;

  -- Check for foreign key dependencies
  SELECT COUNT(*) INTO dependent_count
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND kcu.table_schema = 'schema_name'
    AND kcu.table_name = 'example_table';

  IF dependent_count > 0 THEN
    RAISE WARNING '⚠️  Found % foreign key dependencies - CASCADE will affect other tables', dependent_count;
  ELSE
    RAISE NOTICE '✓ No foreign key dependencies found';
  END IF;

  -- List tables that reference this table
  RAISE NOTICE 'Tables that reference schema_name.example_table:';
  FOR dependent_count IN
    SELECT DISTINCT
      tc.table_schema || '.' || tc.table_name AS referencing_table
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_schema = 'schema_name'
      AND ccu.table_name = 'example_table'
  LOOP
    RAISE NOTICE '  - %', dependent_count;
  END LOOP;

  RAISE NOTICE '========================================';
  RAISE WARNING 'Review the above information carefully before proceeding';
  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- BACKUP EXISTING DATA (Optional but recommended)
-- ============================================================================

/*
-- Uncomment to create backup table before rollback
CREATE TABLE IF NOT EXISTS schema_name.example_table_backup_YYYYMMDD AS
SELECT * FROM schema_name.example_table;

RAISE NOTICE 'Backup created: schema_name.example_table_backup_YYYYMMDD';
*/

-- ============================================================================
-- PAUSE POINT: Manual Confirmation Required
-- ============================================================================

/*
-- Uncomment the following block to require manual confirmation:

DO $$
BEGIN
  RAISE EXCEPTION '
    ============================================
    ROLLBACK PAUSED FOR CONFIRMATION
    ============================================

    This rollback will permanently delete data.

    To proceed:
    1. Review all pre-flight checks above
    2. Verify backup is complete
    3. Confirm all checklist items are done
    4. Comment out this exception block
    5. Re-run the rollback script

    To abort: Stop here and do not continue.
  ';
END $$;
*/

-- ============================================================================
-- BEGIN ROLLBACK
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'STARTING ROLLBACK';
  RAISE NOTICE 'Migration: YYYYMMDD_HHMMSS_descriptive_name';
  RAISE NOTICE 'Timestamp: %', NOW();
  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- STEP 1: Drop Dependent Objects (in reverse order of creation)
-- ============================================================================

-- Drop views (views depend on tables)
DROP VIEW IF EXISTS schema_name.example_table_active CASCADE;
RAISE NOTICE '✓ Dropped view: example_table_active';

-- Drop policies (policies depend on tables)
DROP POLICY IF EXISTS example_table_service_role_all ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_delete_own ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_update_own ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_insert_own ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_select_accessible ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_select_own ON schema_name.example_table;
RAISE NOTICE '✓ Dropped 6 RLS policies';

-- Disable RLS
ALTER TABLE IF EXISTS schema_name.example_table DISABLE ROW LEVEL SECURITY;
RAISE NOTICE '✓ Disabled RLS on example_table';

-- Drop triggers
DROP TRIGGER IF EXISTS update_example_table_updated_at ON schema_name.example_table;
RAISE NOTICE '✓ Dropped trigger: update_example_table_updated_at';

-- Drop functions (only if not used by other objects)
DROP FUNCTION IF EXISTS schema_name.update_example_table_updated_at() CASCADE;
DROP FUNCTION IF EXISTS schema_name.get_example_table_count(UUID) CASCADE;
RAISE NOTICE '✓ Dropped 2 functions';

-- ============================================================================
-- STEP 2: Drop Indexes (explicitly, though CASCADE would handle these)
-- ============================================================================

DROP INDEX IF EXISTS schema_name.idx_example_table_name_search;
DROP INDEX IF EXISTS schema_name.idx_example_table_owner_status;
DROP INDEX IF EXISTS schema_name.idx_example_table_created_at;
DROP INDEX IF EXISTS schema_name.idx_example_table_status;
DROP INDEX IF EXISTS schema_name.idx_example_table_owner_id;
DROP INDEX IF EXISTS schema_name.idx_example_table_parent_id;
RAISE NOTICE '✓ Dropped 6 indexes';

-- ============================================================================
-- STEP 3: Drop the Main Table
-- ============================================================================

DROP TABLE IF EXISTS schema_name.example_table CASCADE;
RAISE NOTICE '✓ Dropped table: schema_name.example_table (CASCADE)';

-- ============================================================================
-- STEP 4: Clean up any remaining artifacts
-- ============================================================================

-- Drop any temporary tables created during migration
-- DROP TABLE IF EXISTS schema_name.example_table_temp;

-- Remove any migration-specific types
-- DROP TYPE IF EXISTS schema_name.example_status_enum CASCADE;

-- ============================================================================
-- POST-ROLLBACK VALIDATION
-- ============================================================================

DO $$
DECLARE
  table_exists BOOLEAN;
  index_count INTEGER;
  view_count INTEGER;
  function_count INTEGER;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'ROLLBACK VALIDATION';
  RAISE NOTICE '========================================';

  -- Verify table was dropped
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'schema_name'
      AND table_name = 'example_table'
  ) INTO table_exists;

  IF table_exists THEN
    RAISE EXCEPTION '❌ Rollback failed: Table still exists';
  ELSE
    RAISE NOTICE '✓ Table successfully dropped';
  END IF;

  -- Verify indexes were dropped
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'schema_name'
    AND tablename = 'example_table';

  IF index_count > 0 THEN
    RAISE WARNING '⚠️  Found % remaining indexes', index_count;
  ELSE
    RAISE NOTICE '✓ All indexes dropped';
  END IF;

  -- Verify views were dropped
  SELECT COUNT(*) INTO view_count
  FROM information_schema.views
  WHERE table_schema = 'schema_name'
    AND table_name LIKE '%example_table%';

  IF view_count > 0 THEN
    RAISE WARNING '⚠️  Found % remaining views', view_count;
  ELSE
    RAISE NOTICE '✓ All related views dropped';
  END IF;

  -- Verify functions were dropped
  SELECT COUNT(*) INTO function_count
  FROM information_schema.routines
  WHERE routine_schema = 'schema_name'
    AND routine_name LIKE '%example_table%';

  IF function_count > 0 THEN
    RAISE WARNING '⚠️  Found % remaining functions', function_count;
  ELSE
    RAISE NOTICE '✓ All related functions dropped';
  END IF;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'ROLLBACK VALIDATION COMPLETE';
  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- ROLLBACK COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'ROLLBACK COMPLETED SUCCESSFULLY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration: YYYYMMDD_HHMMSS_descriptive_name';
  RAISE NOTICE 'Rollback Completed: %', NOW();
  RAISE NOTICE '';
  RAISE NOTICE 'Objects Removed:';
  RAISE NOTICE '  - Table: schema_name.example_table';
  RAISE NOTICE '  - Indexes: 6';
  RAISE NOTICE '  - Policies: 6';
  RAISE NOTICE '  - Functions: 2';
  RAISE NOTICE '  - Views: 1';
  RAISE NOTICE '';
  RAISE NOTICE 'POST-ROLLBACK STEPS:';
  RAISE NOTICE '  1. Verify application functions without this table';
  RAISE NOTICE '  2. Update API documentation';
  RAISE NOTICE '  3. Notify stakeholders of rollback';
  RAISE NOTICE '  4. Remove backup table (if created): example_table_backup_YYYYMMDD';
  RAISE NOTICE '  5. Update migration tracking/documentation';
  RAISE NOTICE '  6. Root cause analysis (why was rollback needed?)';
  RAISE NOTICE '';
  RAISE NOTICE 'RECOVERY OPTIONS:';
  RAISE NOTICE '  - If backup table exists: schema_name.example_table_backup_YYYYMMDD';
  RAISE NOTICE '  - If database backup exists: Restore from backup';
  RAISE NOTICE '  - To re-apply: Run forward migration again';
  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- ROLLBACK METADATA (for tracking)
-- ============================================================================

/*
-- Optionally log this rollback to a tracking table
INSERT INTO migration_history.rollback_log (
  migration_version,
  rollback_date,
  rollback_by,
  reason,
  data_loss_occurred,
  backup_created
) VALUES (
  'YYYYMMDD_HHMMSS_descriptive_name',
  NOW(),
  current_user,
  'Reason for rollback',
  true,  -- Was data lost?
  true   -- Was backup created?
);
*/
