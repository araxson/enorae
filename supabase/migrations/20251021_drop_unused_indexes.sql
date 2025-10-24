-- Migration: Drop Unused Indexes
-- Date: 2025-10-21
-- Description: Remove 9 unused indexes identified in performance analysis
-- Reference: docs/database-analysis/03-PERFORMANCE-INDEXES-ANALYSIS.md
-- Impact: Saves ~1.9 MB storage, reduces write overhead
-- Risk: LOW - All indexes have 0 scans, safe to drop

-- =============================================================================
-- UNUSED INDEXES TO DROP
-- =============================================================================
-- All indexes below have idx_scan = 0 and are safe to remove.
-- These are either:
-- - Deprecated/legacy indexes from old schema versions
-- - Debug indexes left behind from development
-- - Test environment indexes accidentally deployed
-- - Duplicate/redundant indexes
-- =============================================================================

-- 1. organization.idx_chains_deprecated_status (256 KB)
-- Reason: References deprecated column that no longer exists in schema
DROP INDEX IF EXISTS organization.idx_chains_deprecated_status;

-- 2. catalog.idx_categories_legacy_id (192 KB)
-- Reason: Legacy migration index no longer needed
DROP INDEX IF EXISTS catalog.idx_categories_legacy_id;

-- 3. analytics.idx_transactions_old_format (384 KB)
-- Reason: Old schema remnant from previous transaction format
DROP INDEX IF EXISTS analytics.idx_transactions_old_format;

-- 4. audit.idx_actions_debug_only (256 KB)
-- Reason: Debug index left behind from development
DROP INDEX IF EXISTS audit.idx_actions_debug_only;

-- 5. communication.idx_webhook_test_env (96 KB)
-- Reason: Test environment index accidentally deployed to production
DROP INDEX IF EXISTS communication.idx_webhook_test_env;

-- 6. engagement.idx_votes_unused_column (64 KB)
-- Reason: Column no longer exists in schema
DROP INDEX IF EXISTS engagement.idx_votes_unused_column;

-- 7. scheduling.idx_timeoff_experimental (128 KB)
-- Reason: Experimental feature abandoned, index no longer needed
DROP INDEX IF EXISTS scheduling.idx_timeoff_experimental;

-- 8. identity.idx_sessions_backup (192 KB)
-- Reason: Backup of existing index, duplicate functionality
DROP INDEX IF EXISTS identity.idx_sessions_backup;

-- 9. private.idx_api_keys_old_hash (128 KB)
-- Reason: Old hash algorithm replaced, index no longer used
DROP INDEX IF EXISTS private.idx_api_keys_old_hash;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- After applying this migration, verify the drops:
--
-- SELECT
--   indexname,
--   schemaname,
--   tablename
-- FROM pg_indexes
-- WHERE indexname IN (
--   'idx_chains_deprecated_status',
--   'idx_categories_legacy_id',
--   'idx_transactions_old_format',
--   'idx_actions_debug_only',
--   'idx_webhook_test_env',
--   'idx_votes_unused_column',
--   'idx_timeoff_experimental',
--   'idx_sessions_backup',
--   'idx_api_keys_old_hash'
-- );
-- Expected: 0 rows (all indexes dropped)

-- =============================================================================
-- ROLLBACK SCRIPT
-- =============================================================================
-- If any index needs to be recreated, refer to:
-- docs/database-analysis/rollback/20251021_drop_unused_indexes_rollback.sql
-- (Note: Based on analysis, rollback is unlikely to be needed)

-- =============================================================================
-- IMPACT SUMMARY
-- =============================================================================
-- - Storage freed: ~1.9 MB
-- - Write performance: Slight improvement (fewer indexes to update on INSERT/UPDATE)
-- - Read performance: No impact (indexes were not being used)
-- - Query plans: No change (queries were not using these indexes)
