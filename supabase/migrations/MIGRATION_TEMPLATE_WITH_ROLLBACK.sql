/**
 * Migration: YYYYMMDD_HHMMSS_descriptive_name
 * Author: [Your Name]
 * Date: YYYY-MM-DD
 *
 * Purpose:
 *   Brief description of what this migration does and why it's needed.
 *   Include business context and expected impact.
 *
 * Dependencies:
 *   - Required schemas: [list schemas that must exist]
 *   - Required tables: [list tables that must exist]
 *   - Required extensions: [list extensions needed]
 *   - Required migrations: [list migration versions this depends on]
 *
 * Breaking Changes:
 *   - [List any breaking changes, or write "None"]
 *   - [Document impact on application code]
 *   - [Note any API changes required]
 *
 * Rollback Instructions:
 *   Location: rollback/YYYYMMDD_HHMMSS_descriptive_name_rollback.sql
 *   Data Loss Risk: [NONE | LOW | MEDIUM | HIGH | CRITICAL]
 *   Data Loss Details: [Describe what data would be lost if rolled back]
 *   Safe to Rollback: [YES | NO | CONDITIONAL]
 *   Rollback Conditions: [Explain any conditions or time windows]
 *   Rollback Time Estimate: [<1 minute | 1-5 minutes | 5-30 minutes | >30 minutes]
 *
 * Performance Impact:
 *   Estimated Execution Time: [<100ms | 100ms-1s | 1s-10s | 10s-60s | >60s]
 *   Table Locks: [None | Read | Write] - [Duration]
 *   Index Build Time: [N/A or duration]
 *   Blocking Operations: [Yes/No] - [Details if yes]
 *
 * Risk Assessment:
 *   Risk Level: [Low | Medium | High | Critical]
 *   Tested In: [Local | Staging | Production-like]
 *   Approved By: [Name/Role]
 *   Deployment Window: [Anytime | Maintenance window | Off-hours]
 *   Monitoring Required: [Yes/No] - [What to monitor]
 *
 * Testing Checklist:
 *   [ ] Migration runs successfully on fresh database
 *   [ ] Migration is idempotent (can run twice safely)
 *   [ ] Rollback script created and tested
 *   [ ] Rollback verified to reverse all changes
 *   [ ] No table locks during execution (or documented)
 *   [ ] All objects have appropriate comments
 *   [ ] RLS policies enabled on new tables
 *   [ ] Indexes created on foreign key columns
 *   [ ] Application integration tested
 *   [ ] Performance impact measured
 *   [ ] Rollback scenario tested in staging
 *   [ ] Data loss scenarios documented
 */

-- ============================================================================
-- PRE-FLIGHT CHECKS
-- ============================================================================

DO $$
BEGIN
  -- Verify required schemas exist
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'schema_name') THEN
    RAISE EXCEPTION 'Required schema "schema_name" does not exist. Run prerequisite migrations first.';
  END IF;

  -- Verify required extensions exist
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
    RAISE EXCEPTION 'Required extension "uuid-ossp" is not installed.';
  END IF;

  -- Verify required tables exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'schema_name'
      AND table_name = 'required_table'
  ) THEN
    RAISE EXCEPTION 'Required table "schema_name.required_table" does not exist.';
  END IF;

  -- Check for conflicting objects (idempotency check)
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'schema_name'
      AND table_name = 'example_table'
  ) THEN
    RAISE NOTICE 'Table "schema_name.example_table" already exists. Skipping creation.';
  END IF;

  -- Add custom pre-flight checks here
  RAISE NOTICE 'Pre-flight checks passed';
END $$;

-- ============================================================================
-- MAIN MIGRATION
-- ============================================================================

-- Example: Create a new table
CREATE TABLE IF NOT EXISTS schema_name.example_table (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Foreign keys
  parent_id UUID NOT NULL REFERENCES schema_name.parent_table(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Data columns
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::JSONB,

  -- Audit columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'archived')),
  CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Add table comment
COMMENT ON TABLE schema_name.example_table IS
  'Detailed description of what this table stores and its purpose in the system';

-- Add column comments
COMMENT ON COLUMN schema_name.example_table.id IS
  'Unique identifier for the record';
COMMENT ON COLUMN schema_name.example_table.parent_id IS
  'Reference to parent table, cascades on delete';
COMMENT ON COLUMN schema_name.example_table.owner_id IS
  'User who owns this record';
COMMENT ON COLUMN schema_name.example_table.name IS
  'Display name, required, cannot be empty';
COMMENT ON COLUMN schema_name.example_table.status IS
  'Current status: active (in use), inactive (disabled), archived (historical)';
COMMENT ON COLUMN schema_name.example_table.metadata IS
  'Additional structured data stored as JSON';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index on foreign keys (required for performance)
-- Use CONCURRENTLY to avoid table locks (cannot be used in transaction)
-- Remove BEGIN/COMMIT for CONCURRENT index creation
CREATE INDEX IF NOT EXISTS idx_example_table_parent_id
  ON schema_name.example_table(parent_id);

CREATE INDEX IF NOT EXISTS idx_example_table_owner_id
  ON schema_name.example_table(owner_id);

-- Index on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_example_table_status
  ON schema_name.example_table(status)
  WHERE status = 'active';  -- Partial index for active records only

-- Index for sorting (created_at DESC is common)
CREATE INDEX IF NOT EXISTS idx_example_table_created_at
  ON schema_name.example_table(created_at DESC);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_example_table_owner_status
  ON schema_name.example_table(owner_id, status);

-- Full-text search index (if needed)
CREATE INDEX IF NOT EXISTS idx_example_table_name_search
  ON schema_name.example_table USING GIN (to_tsvector('english', name));

COMMENT ON INDEX idx_example_table_parent_id IS
  'Performance index for parent foreign key lookups';
COMMENT ON INDEX idx_example_table_owner_id IS
  'Performance index for owner foreign key lookups and RLS policies';
COMMENT ON INDEX idx_example_table_status IS
  'Partial index for active records, reduces index size';

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION schema_name.update_example_table_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = schema_name, public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION schema_name.update_example_table_updated_at() IS
  'Automatically updates updated_at and updated_by columns on row modification';

DROP TRIGGER IF EXISTS update_example_table_updated_at ON schema_name.example_table;
CREATE TRIGGER update_example_table_updated_at
  BEFORE UPDATE ON schema_name.example_table
  FOR EACH ROW
  EXECUTE FUNCTION schema_name.update_example_table_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE schema_name.example_table ENABLE ROW LEVEL SECURITY;

-- Policy: Users can select their own records
DROP POLICY IF EXISTS example_table_select_own ON schema_name.example_table;
CREATE POLICY example_table_select_own
  ON schema_name.example_table
  FOR SELECT
  USING (owner_id = auth.uid());

-- Policy: Users can select records from their accessible salons
DROP POLICY IF EXISTS example_table_select_accessible ON schema_name.example_table;
CREATE POLICY example_table_select_accessible
  ON schema_name.example_table
  FOR SELECT
  USING (
    parent_id IN (
      SELECT id FROM schema_name.parent_table
      WHERE owner_id = auth.uid()
    )
  );

-- Policy: Users can insert records they own
DROP POLICY IF EXISTS example_table_insert_own ON schema_name.example_table;
CREATE POLICY example_table_insert_own
  ON schema_name.example_table
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Policy: Users can update their own records
DROP POLICY IF EXISTS example_table_update_own ON schema_name.example_table;
CREATE POLICY example_table_update_own
  ON schema_name.example_table
  FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Policy: Users can delete their own records
DROP POLICY IF EXISTS example_table_delete_own ON schema_name.example_table;
CREATE POLICY example_table_delete_own
  ON schema_name.example_table
  FOR DELETE
  USING (owner_id = auth.uid());

-- Policy: Service role has full access (for system operations)
DROP POLICY IF EXISTS example_table_service_role_all ON schema_name.example_table;
CREATE POLICY example_table_service_role_all
  ON schema_name.example_table
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

COMMENT ON POLICY example_table_select_own ON schema_name.example_table IS
  'Users can view their own records';
COMMENT ON POLICY example_table_select_accessible ON schema_name.example_table IS
  'Users can view records from accessible parent entities';

-- ============================================================================
-- HELPER FUNCTIONS (if needed)
-- ============================================================================

CREATE OR REPLACE FUNCTION schema_name.get_example_table_count(p_owner_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM schema_name.example_table
  WHERE owner_id = p_owner_id
    AND status = 'active';
$$;

COMMENT ON FUNCTION schema_name.get_example_table_count(UUID) IS
  'Returns count of active records for a given owner';

-- ============================================================================
-- VIEWS (if needed)
-- ============================================================================

CREATE OR REPLACE VIEW schema_name.example_table_active AS
SELECT
  et.id,
  et.name,
  et.description,
  et.status,
  et.created_at,
  et.updated_at,
  pt.name AS parent_name,
  u.email AS owner_email
FROM schema_name.example_table et
JOIN schema_name.parent_table pt ON et.parent_id = pt.id
JOIN auth.users u ON et.owner_id = u.id
WHERE et.status = 'active';

COMMENT ON VIEW schema_name.example_table_active IS
  'Active records with joined parent and owner information';

-- Grant access to view (RLS still applies to underlying tables)
GRANT SELECT ON schema_name.example_table_active TO authenticated;

-- ============================================================================
-- DATA MIGRATION (if needed)
-- ============================================================================

-- Example: Backfill existing records
-- DO $$
-- DECLARE
--   record_count INTEGER;
-- BEGIN
--   -- Update existing records
--   UPDATE schema_name.example_table
--   SET status = 'active'
--   WHERE status IS NULL;
--
--   GET DIAGNOSTICS record_count = ROW_COUNT;
--   RAISE NOTICE 'Backfilled % records', record_count;
-- END $$;

-- ============================================================================
-- POST-MIGRATION VALIDATION
-- ============================================================================

DO $$
DECLARE
  table_exists BOOLEAN;
  index_count INTEGER;
  policy_count INTEGER;
  rls_enabled BOOLEAN;
  trigger_count INTEGER;
BEGIN
  -- Verify table was created
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'schema_name'
      AND table_name = 'example_table'
  ) INTO table_exists;

  IF NOT table_exists THEN
    RAISE EXCEPTION 'Migration failed: Table was not created';
  END IF;

  -- Verify indexes were created
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'schema_name'
    AND tablename = 'example_table';

  IF index_count < 3 THEN
    RAISE WARNING 'Expected at least 3 indexes, found %', index_count;
  END IF;

  -- Verify RLS is enabled
  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class
  WHERE oid = 'schema_name.example_table'::regclass;

  IF NOT rls_enabled THEN
    RAISE EXCEPTION 'Migration failed: RLS is not enabled on table';
  END IF;

  -- Verify policies were created
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'schema_name'
    AND tablename = 'example_table';

  IF policy_count < 4 THEN
    RAISE WARNING 'Expected at least 4 policies, found %', policy_count;
  END IF;

  -- Verify triggers were created
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE event_object_schema = 'schema_name'
    AND event_object_table = 'example_table';

  IF trigger_count < 1 THEN
    RAISE WARNING 'Expected at least 1 trigger, found %', trigger_count;
  END IF;

  -- All checks passed
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration validation passed successfully';
  RAISE NOTICE '  - Table created: %', table_exists;
  RAISE NOTICE '  - Indexes created: %', index_count;
  RAISE NOTICE '  - RLS enabled: %', rls_enabled;
  RAISE NOTICE '  - Policies created: %', policy_count;
  RAISE NOTICE '  - Triggers created: %', trigger_count;
  RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant appropriate permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON schema_name.example_table TO authenticated;

-- Grant sequence permissions (if using serial/identity columns)
-- GRANT USAGE ON SEQUENCE schema_name.example_table_id_seq TO authenticated;

-- ============================================================================
-- ROLLBACK PREPARATION
-- ============================================================================

-- Create rollback instructions in a comment
-- These will be used to generate the rollback migration file

/*
ROLLBACK MIGRATION: rollback/YYYYMMDD_HHMMSS_descriptive_name_rollback.sql

-- Drop policies (must be done before table)
DROP POLICY IF EXISTS example_table_service_role_all ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_delete_own ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_update_own ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_insert_own ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_select_accessible ON schema_name.example_table;
DROP POLICY IF EXISTS example_table_select_own ON schema_name.example_table;

-- Drop triggers
DROP TRIGGER IF EXISTS update_example_table_updated_at ON schema_name.example_table;

-- Drop views (must be done before table)
DROP VIEW IF EXISTS schema_name.example_table_active;

-- Drop functions
DROP FUNCTION IF EXISTS schema_name.get_example_table_count(UUID);
DROP FUNCTION IF EXISTS schema_name.update_example_table_updated_at();

-- Drop indexes (will be dropped automatically with table, but explicit is safer)
DROP INDEX IF EXISTS schema_name.idx_example_table_name_search;
DROP INDEX IF EXISTS schema_name.idx_example_table_owner_status;
DROP INDEX IF EXISTS schema_name.idx_example_table_created_at;
DROP INDEX IF EXISTS schema_name.idx_example_table_status;
DROP INDEX IF EXISTS schema_name.idx_example_table_owner_id;
DROP INDEX IF EXISTS schema_name.idx_example_table_parent_id;

-- Drop table (CASCADE will drop dependent objects)
-- WARNING: This will permanently delete all data in the table
-- Ensure backup exists before rollback
DROP TABLE IF EXISTS schema_name.example_table CASCADE;

-- Validation
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'schema_name'
      AND table_name = 'example_table'
  ) THEN
    RAISE EXCEPTION 'Rollback failed: Table still exists';
  END IF;

  RAISE NOTICE 'Rollback completed successfully';
  RAISE NOTICE 'Table schema_name.example_table has been removed';
  RAISE NOTICE 'All dependent objects have been dropped';
END $$;

-- Data Recovery Instructions:
-- If data needs to be recovered after rollback:
-- 1. Contact Supabase support for point-in-time recovery
-- 2. Target timestamp: Before this migration ran
-- 3. Recovery window: 7-30 days depending on backup retention
-- 4. Estimated recovery time: 1-2 hours

*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration YYYYMMDD_HHMMSS_descriptive_name completed successfully';
  RAISE NOTICE 'Objects created:';
  RAISE NOTICE '  - Table: schema_name.example_table';
  RAISE NOTICE '  - Indexes: 6';
  RAISE NOTICE '  - Policies: 6';
  RAISE NOTICE '  - Functions: 2';
  RAISE NOTICE '  - Views: 1';
  RAISE NOTICE '  - Triggers: 1';
  RAISE NOTICE '';
  RAISE NOTICE 'Rollback migration available at:';
  RAISE NOTICE '  rollback/YYYYMMDD_HHMMSS_descriptive_name_rollback.sql';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Verify application integration';
  RAISE NOTICE '  2. Monitor query performance';
  RAISE NOTICE '  3. Update API documentation';
  RAISE NOTICE '  4. Test rollback in staging (REQUIRED)';
  RAISE NOTICE '========================================';
END $$;
