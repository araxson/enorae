-- ============================================================================
-- ROLLBACK: Soft Delete Optimization - Partial Indexes & Archival Structure
-- ============================================================================
-- Rollback for: 20251022_agent3_soft_delete_optimization
-- Purpose: Remove partial indexes and archival infrastructure if needed
-- Risk: LOW - Removes optimization, does not affect data
-- Execution: CONCURRENTLY to prevent locks
-- ============================================================================

-- Log rollback start
INSERT INTO public.database_operations_log (operation_type, operation_name, status, details)
VALUES ('rollback', 'soft_delete_optimization_rollback', 'started', 'Agent 3: Rolling back soft delete optimization');

-- ============================================================================
-- PHASE 1: DROP PARTIAL INDEXES
-- ============================================================================

-- Set timeouts
SET statement_timeout = '30min';
SET lock_timeout = '5s';

-- Organization Schema
DROP INDEX CONCURRENTLY IF EXISTS organization.idx_salons_active;
DROP INDEX CONCURRENTLY IF EXISTS organization.idx_staff_profiles_active;
DROP INDEX CONCURRENTLY IF EXISTS organization.idx_salon_locations_active;
DROP INDEX CONCURRENTLY IF EXISTS organization.idx_salon_chains_active;
DROP INDEX CONCURRENTLY IF EXISTS organization.idx_salon_descriptions_active;
DROP INDEX CONCURRENTLY IF EXISTS organization.idx_salon_contact_details_active;
DROP INDEX CONCURRENTLY IF EXISTS organization.idx_salon_media_active;
DROP INDEX CONCURRENTLY IF EXISTS organization.idx_operating_hours_active;

-- Scheduling Schema
DROP INDEX CONCURRENTLY IF EXISTS scheduling.idx_appointments_active;
DROP INDEX CONCURRENTLY IF EXISTS scheduling.idx_appointment_services_active;
DROP INDEX CONCURRENTLY IF EXISTS scheduling.idx_blocked_times_active;
DROP INDEX CONCURRENTLY IF EXISTS scheduling.idx_staff_schedules_active;
DROP INDEX CONCURRENTLY IF EXISTS scheduling.idx_time_off_requests_active;

-- Catalog Schema
DROP INDEX CONCURRENTLY IF EXISTS catalog.idx_services_active;
DROP INDEX CONCURRENTLY IF EXISTS catalog.idx_service_categories_active;
DROP INDEX CONCURRENTLY IF EXISTS catalog.idx_service_pricing_active;
DROP INDEX CONCURRENTLY IF EXISTS catalog.idx_service_booking_rules_active;
DROP INDEX CONCURRENTLY IF EXISTS catalog.idx_staff_services_active;

-- Engagement Schema
DROP INDEX CONCURRENTLY IF EXISTS engagement.idx_salon_reviews_active;
DROP INDEX CONCURRENTLY IF EXISTS engagement.idx_review_helpful_votes_active;
DROP INDEX CONCURRENTLY IF EXISTS engagement.idx_customer_favorites_active;

-- Communication Schema
DROP INDEX CONCURRENTLY IF EXISTS communication.idx_messages_active;
DROP INDEX CONCURRENTLY IF EXISTS communication.idx_message_threads_active;
DROP INDEX CONCURRENTLY IF EXISTS communication.idx_webhook_queue_active;

-- Identity Schema
DROP INDEX CONCURRENTLY IF EXISTS identity.idx_profiles_active;
DROP INDEX CONCURRENTLY IF EXISTS identity.idx_profiles_metadata_active;
DROP INDEX CONCURRENTLY IF EXISTS identity.idx_user_roles_active;
DROP INDEX CONCURRENTLY IF EXISTS identity.idx_sessions_active;

-- Log index removal
INSERT INTO public.database_operations_log (operation_type, operation_name, status, details)
VALUES ('rollback', 'soft_delete_indexes_dropped', 'completed', 'Dropped ~28 partial indexes across 6 schemas');

-- ============================================================================
-- PHASE 2: DROP ARCHIVAL FUNCTIONS & VIEWS
-- ============================================================================

-- Drop monitoring view
DROP VIEW IF EXISTS archive.archival_status_view CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS archive.restore_from_archive(TEXT, TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS archive.archive_soft_deleted_records(TEXT, TEXT, INTERVAL) CASCADE;

-- Log function removal
INSERT INTO public.database_operations_log (operation_type, operation_name, status, details)
VALUES ('rollback', 'archival_functions_dropped', 'completed', 'Dropped archival functions and views');

-- ============================================================================
-- PHASE 3: REMOVE SCHEMA COMMENTS (Optional - Uncomment if needed)
-- ============================================================================

-- COMMENT ON SCHEMA organization IS NULL;
-- COMMENT ON SCHEMA catalog IS NULL;
-- COMMENT ON SCHEMA scheduling IS NULL;
-- COMMENT ON SCHEMA engagement IS NULL;
-- COMMENT ON SCHEMA communication IS NULL;
-- COMMENT ON SCHEMA identity IS NULL;
-- COMMENT ON SCHEMA archive IS NULL;

-- ============================================================================
-- PHASE 4: DROP ARCHIVE SCHEMA (DANGEROUS - Only if archival tables are empty)
-- ============================================================================

-- WARNING: This will drop ALL archival tables. Only run if you're sure!
-- Uncomment to execute:

-- DROP SCHEMA IF EXISTS archive CASCADE;

-- INSERT INTO public.database_operations_log (operation_type, operation_name, status, details)
-- VALUES ('rollback', 'archive_schema_dropped', 'completed', 'DANGER: Dropped archive schema and all tables');

-- ============================================================================
-- VALIDATION
-- ============================================================================

-- Verify indexes removed
DO $$
DECLARE
    v_remaining_indexes INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_remaining_indexes
    FROM pg_indexes
    WHERE indexname LIKE 'idx_%_active'
      AND schemaname IN ('analytics', 'catalog', 'communication', 'engagement', 'identity', 'organization', 'scheduling');

    IF v_remaining_indexes > 0 THEN
        RAISE WARNING 'Warning: % partial indexes still exist', v_remaining_indexes;
    ELSE
        RAISE NOTICE 'Success: All partial indexes removed';
    END IF;

    INSERT INTO public.database_operations_log (operation_type, operation_name, status, details)
    VALUES ('rollback', 'validation', 'completed',
            format('Rollback complete. Remaining indexes: %s', v_remaining_indexes));
END $$;

-- Log rollback completion
INSERT INTO public.database_operations_log (operation_type, operation_name, status, details)
VALUES ('rollback', 'soft_delete_optimization_rollback', 'completed',
        'Agent 3: Soft delete optimization rollback complete. System restored to pre-optimization state.');

-- ============================================================================
-- ROLLBACK COMPLETE
-- ============================================================================
