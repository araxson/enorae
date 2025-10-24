-- Migration: Enable RLS on archive.event_batches table
-- Date: 2025-10-21
-- Issue: Archive event batches table has no Row-Level Security protection (MEDIUM SEVERITY)
-- Reference: docs/database-analysis/02-SECURITY-RLS-ANALYSIS.md
-- Impact: Historical event batch data accessible without authorization
-- Security Score Impact: +1 point (88 → 89/100)

-- ============================================================================
-- STEP 1: Enable Row-Level Security
-- ============================================================================

ALTER TABLE archive.event_batches ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Create Security Policies
-- ============================================================================

-- Policy 1: Admin read-only access
-- Only super admins and platform admins can view archived event batches
-- Event batches may contain sensitive system operation data
CREATE POLICY "archive_event_batches_select_admin"
ON archive.event_batches
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM identity.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'platform_admin')
    AND is_active = true
  )
);

-- Policy 2: Service role full access
-- Allow service role for system operations (archival, cleanup, analytics)
-- Service role manages event batch lifecycle
CREATE POLICY "archive_event_batches_all_service"
ON archive.event_batches
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- STEP 3: Documentation
-- ============================================================================

COMMENT ON TABLE archive.event_batches IS 'Historical event batches archive (system-managed event processing data). RLS enabled with admin-only read access. Service role manages archival, cleanup, and analytics. Contains sensitive system operation metadata.';

COMMENT ON POLICY "archive_event_batches_select_admin" ON archive.event_batches IS 'Allows super_admin and platform_admin roles to read archived event batches for system monitoring and debugging.';

COMMENT ON POLICY "archive_event_batches_all_service" ON archive.event_batches IS 'Allows service role full access for system operations, archival processes, and cleanup jobs.';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Test 1: Verify RLS is enabled
DO $$
DECLARE
  rls_enabled BOOLEAN;
BEGIN
  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class
  WHERE oid = 'archive.event_batches'::regclass;

  IF NOT rls_enabled THEN
    RAISE EXCEPTION 'RLS not enabled on archive.event_batches';
  END IF;

  RAISE NOTICE 'RLS enabled on archive.event_batches: OK';
END $$;

-- Test 2: Verify policy count
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'archive'
  AND tablename = 'event_batches';

  IF policy_count < 2 THEN
    RAISE EXCEPTION 'Expected 2+ policies on archive.event_batches, found %', policy_count;
  END IF;

  RAISE NOTICE 'Policy count on archive.event_batches: % OK', policy_count;
END $$;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS
-- ============================================================================

-- To rollback this migration, execute:
/*
DROP POLICY IF EXISTS "archive_event_batches_select_admin" ON archive.event_batches;
DROP POLICY IF EXISTS "archive_event_batches_all_service" ON archive.event_batches;
ALTER TABLE archive.event_batches DISABLE ROW LEVEL SECURITY;
*/

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================

-- 1. Event batches contain system operation metadata (not user data)
-- 2. Admin-only access protects sensitive system information
-- 3. Service role can manage full lifecycle (INSERT, UPDATE, DELETE)
-- 4. Regular users have NO access to event batch data
-- 5. Supports compliance with system audit requirements
