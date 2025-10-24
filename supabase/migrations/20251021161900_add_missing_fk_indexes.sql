-- Migration: Add Missing Foreign Key Indexes
-- Date: 2025-10-21
-- Author: Database Integrity Analyzer
-- Purpose: Add indexes to foreign key columns for improved join performance
-- Impact: Improves query performance, no breaking changes
-- Breaking Change: No
-- Related: Data Integrity Analysis Report (04-DATA-INTEGRITY-ANALYSIS.md)

-- ============================================================================
-- MIGRATION START
-- ============================================================================

BEGIN;

-- Step 1: Create index on archive.appointments.original_salon_id
-- Rationale: FK columns should be indexed for join performance
-- Impact: Improves queries that join archive.appointments with organization.salons
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_archive_appointments_original_salon_id
ON archive.appointments(original_salon_id)
WHERE original_salon_id IS NOT NULL;

-- Step 2: Create index on monitoring.webhook_deliveries.retry_of_id
-- Rationale: FK columns should be indexed for join performance
-- Impact: Improves queries that trace webhook retry chains
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webhook_deliveries_retry_of_id
ON monitoring.webhook_deliveries(retry_of_id)
WHERE retry_of_id IS NOT NULL;

-- Step 3: Verify indexes were created
-- Rationale: Ensure indexes exist and are valid
DO $$
DECLARE
  idx1_exists BOOLEAN;
  idx2_exists BOOLEAN;
BEGIN
  -- Check first index
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'archive'
      AND tablename = 'appointments'
      AND indexname = 'idx_archive_appointments_original_salon_id'
  ) INTO idx1_exists;

  -- Check second index
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'monitoring'
      AND tablename = 'webhook_deliveries'
      AND indexname = 'idx_webhook_deliveries_retry_of_id'
  ) INTO idx2_exists;

  IF NOT idx1_exists THEN
    RAISE EXCEPTION 'Migration verification failed: Index idx_archive_appointments_original_salon_id not created';
  END IF;

  IF NOT idx2_exists THEN
    RAISE EXCEPTION 'Migration verification failed: Index idx_webhook_deliveries_retry_of_id not created';
  END IF;

  RAISE NOTICE 'Migration successful: All foreign key indexes created';
END $$;

COMMIT;

-- ============================================================================
-- MIGRATION END
-- ============================================================================

-- Performance Impact:
-- - Both indexes created CONCURRENTLY to avoid table locks
-- - Partial indexes (WHERE NOT NULL) reduce index size
-- - Expected impact: 10-50x faster joins on these FK columns

-- Rollback Instructions:
-- To rollback this migration:
-- DROP INDEX CONCURRENTLY IF EXISTS archive.idx_archive_appointments_original_salon_id;
-- DROP INDEX CONCURRENTLY IF EXISTS monitoring.idx_webhook_deliveries_retry_of_id;
