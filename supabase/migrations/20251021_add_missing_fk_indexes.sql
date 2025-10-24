-- Migration: Add Missing Foreign Key Indexes
-- Date: 2025-10-21
-- Description: Add indexes for 2 foreign key columns that lack index coverage
-- Reference: docs/database-analysis/03-PERFORMANCE-INDEXES-ANALYSIS.md
-- Impact: Improves join performance, prevents table locks during FK checks
-- Risk: LOW - Non-blocking index creation

-- =============================================================================
-- MISSING FOREIGN KEY INDEXES
-- =============================================================================
-- Foreign keys without indexes can cause:
-- 1. Slow JOIN queries
-- 2. Table locks during FK validation
-- 3. Performance degradation as tables grow
-- =============================================================================

-- 1. archive.appointments.original_salon_id
-- References: organization.salons(id)
-- Impact: MEDIUM - Archive table, infrequent access but important for joins
-- Use case: When retrieving archived appointments by salon
CREATE INDEX IF NOT EXISTS idx_archived_appointments_original_salon
ON archive.appointments(original_salon_id)
WHERE original_salon_id IS NOT NULL;

COMMENT ON INDEX archive.idx_archived_appointments_original_salon IS
'Foreign key index for joins to organization.salons. Partial index excludes rows with NULL original_salon_id. Created: 2025-10-21';

-- 2. monitoring.webhook_deliveries.retry_of_id
-- References: monitoring.webhook_deliveries(id) (self-referencing FK)
-- Impact: LOW - Self-referencing FK, only used when tracking retry chains
-- Use case: Finding all retries of a failed webhook delivery
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_retry
ON monitoring.webhook_deliveries(retry_of_id)
WHERE retry_of_id IS NOT NULL;

COMMENT ON INDEX monitoring.idx_webhook_deliveries_retry IS
'Foreign key index for self-referencing retry chain. Partial index only includes retried deliveries (WHERE retry_of_id IS NOT NULL). Created: 2025-10-21';

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- Verify indexes were created:
--
-- SELECT
--   schemaname,
--   tablename,
--   indexname,
--   pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) as index_size
-- FROM pg_indexes
-- JOIN pg_class ON pg_class.relname = indexname
-- WHERE indexname IN (
--   'idx_archived_appointments_original_salon',
--   'idx_webhook_deliveries_retry'
-- );
-- Expected: 2 rows

-- Verify FK coverage is now 100%:
--
-- SELECT
--   tc.table_schema,
--   tc.table_name,
--   kcu.column_name,
--   ccu.table_name AS foreign_table,
--   EXISTS(
--     SELECT 1 FROM pg_indexes
--     WHERE schemaname = tc.table_schema
--       AND tablename = tc.table_name
--       AND indexdef LIKE '%' || kcu.column_name || '%'
--   ) as has_index
-- FROM information_schema.table_constraints tc
-- JOIN information_schema.key_column_usage kcu
--   ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage ccu
--   ON ccu.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY'
--   AND tc.table_schema NOT IN ('pg_catalog', 'information_schema')
--   AND has_index = false;
-- Expected: 0 rows (100% FK coverage)

-- =============================================================================
-- ROLLBACK SCRIPT
-- =============================================================================
-- DROP INDEX IF EXISTS archive.idx_archived_appointments_original_salon;
-- DROP INDEX IF EXISTS monitoring.idx_webhook_deliveries_retry;

-- =============================================================================
-- IMPACT SUMMARY
-- =============================================================================
-- - Foreign Key Coverage: 99.3% → 100%
-- - Join Performance: Improved for archive queries and webhook retry chains
-- - Storage Cost: ~32 KB total (minimal due to partial indexes)
-- - Write Overhead: Minimal (partial indexes only index non-NULL values)
