-- Migration: Enable RLS on archive.appointments table
-- Date: 2025-10-21
-- Issue: Archive table has no Row-Level Security protection (HIGH SEVERITY)
-- Reference: docs/database-analysis/02-SECURITY-RLS-ANALYSIS.md
-- Impact: Historical appointment data accessible without authorization
-- Security Score Impact: +3 points (85 → 88/100)

-- ============================================================================
-- STEP 1: Enable Row-Level Security
-- ============================================================================

ALTER TABLE archive.appointments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Create Security Policies
-- ============================================================================

-- Policy 1: Admin read-only access
-- Only super admins and platform admins can view archived appointments
-- This follows the same pattern as audit.audit_logs and audit.data_changes
CREATE POLICY "archive_appointments_select_admin"
ON archive.appointments
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

-- Policy 2: Service role read access
-- Allow service role for system operations (backups, analytics, data exports)
-- Service role is used by background jobs and admin dashboards
CREATE POLICY "archive_appointments_select_service"
ON archive.appointments
FOR SELECT
TO service_role
USING (true);

-- Policy 3: Service role insert access
-- Only service role can archive appointments (via automated archival process)
-- Regular users cannot manually insert into archive tables
CREATE POLICY "archive_appointments_insert_service"
ON archive.appointments
FOR INSERT
TO service_role
WITH CHECK (true);

-- ============================================================================
-- STEP 3: Documentation
-- ============================================================================

COMMENT ON TABLE archive.appointments IS 'Historical appointments archive (completed appointments older than 2 years). RLS enabled with admin-only read access. Service role manages the automated archival process. Regular users cannot access archived data directly.';

COMMENT ON POLICY "archive_appointments_select_admin" ON archive.appointments IS 'Allows super_admin and platform_admin roles to read archived appointments for compliance, auditing, and historical analysis.';

COMMENT ON POLICY "archive_appointments_select_service" ON archive.appointments IS 'Allows service role to read archived data for system operations, backups, and analytics processing.';

COMMENT ON POLICY "archive_appointments_insert_service" ON archive.appointments IS 'Allows service role to insert archived appointments via the automated archival process. Users cannot manually archive data.';

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
  WHERE oid = 'archive.appointments'::regclass;

  IF NOT rls_enabled THEN
    RAISE EXCEPTION 'RLS not enabled on archive.appointments';
  END IF;

  RAISE NOTICE 'RLS enabled on archive.appointments: OK';
END $$;

-- Test 2: Verify policy count
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'archive'
  AND tablename = 'appointments';

  IF policy_count < 3 THEN
    RAISE EXCEPTION 'Expected 3+ policies on archive.appointments, found %', policy_count;
  END IF;

  RAISE NOTICE 'Policy count on archive.appointments: % OK', policy_count;
END $$;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS
-- ============================================================================

-- To rollback this migration, execute:
/*
DROP POLICY IF EXISTS "archive_appointments_select_admin" ON archive.appointments;
DROP POLICY IF EXISTS "archive_appointments_select_service" ON archive.appointments;
DROP POLICY IF EXISTS "archive_appointments_insert_service" ON archive.appointments;
ALTER TABLE archive.appointments DISABLE ROW LEVEL SECURITY;
*/

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================

-- 1. Archive tables are read-only for admins (no UPDATE/DELETE policies)
-- 2. Only service role can populate archive tables (automated process)
-- 3. Regular users (customers, staff, business owners) have NO access
-- 4. This protects historical data from unauthorized access
-- 5. Follows GDPR/CCPA compliance for data retention policies
-- 6. Audit trail preserved in archive.appointments for legal compliance
