/**
 * Rollback: 20251022_create_monitoring_infrastructure
 * Author: Agent 10 - Database Monitoring Infrastructure Builder
 * Date: 2025-10-22
 *
 * Purpose:
 *   Rolls back the monitoring infrastructure migration by dropping all
 *   monitoring views and the monitoring schema.
 *
 * Data Loss:
 *   No - Only views are dropped, no actual data is stored in monitoring schema
 *
 * Safe to Rollback:
 *   Yes - Can be safely rolled back at any time
 *
 * Performance Impact:
 *   Minimal - Only drops views, no table locks
 */

-- ============================================================================
-- ROLLBACK MONITORING INFRASTRUCTURE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Rolling back monitoring infrastructure...';
  RAISE NOTICE '========================================';
END $$;

-- Drop all views in monitoring schema
DROP VIEW IF EXISTS monitoring.database_health_dashboard CASCADE;
DROP VIEW IF EXISTS monitoring.table_cache_hit_ratio CASCADE;
DROP VIEW IF EXISTS monitoring.large_table_scan_candidates CASCADE;
DROP VIEW IF EXISTS monitoring.table_bloat_estimate CASCADE;
DROP VIEW IF EXISTS monitoring.growth_forecast CASCADE;
DROP VIEW IF EXISTS monitoring.partition_growth_analysis CASCADE;
DROP VIEW IF EXISTS monitoring.storage_growth_trends CASCADE;
DROP VIEW IF EXISTS monitoring.privileged_actions CASCADE;
DROP VIEW IF EXISTS monitoring.rls_policy_violations CASCADE;
DROP VIEW IF EXISTS monitoring.suspicious_activity CASCADE;
DROP VIEW IF EXISTS monitoring.failed_auth_attempts CASCADE;
DROP VIEW IF EXISTS monitoring.missing_fk_indexes CASCADE;
DROP VIEW IF EXISTS monitoring.index_bloat_estimate CASCADE;
DROP VIEW IF EXISTS monitoring.unused_indexes CASCADE;
DROP VIEW IF EXISTS monitoring.index_usage_stats CASCADE;

-- Drop monitoring schema
DROP SCHEMA IF EXISTS monitoring CASCADE;

-- ============================================================================
-- ROLLBACK VALIDATION
-- ============================================================================

DO $$
DECLARE
  schema_exists BOOLEAN;
  view_count INTEGER;
BEGIN
  -- Verify monitoring schema was dropped
  SELECT EXISTS (
    SELECT 1 FROM pg_namespace WHERE nspname = 'monitoring'
  ) INTO schema_exists;

  IF schema_exists THEN
    RAISE EXCEPTION 'Rollback failed: Monitoring schema still exists';
  END IF;

  -- Verify views were dropped
  SELECT COUNT(*) INTO view_count
  FROM pg_views
  WHERE schemaname = 'monitoring';

  IF view_count > 0 THEN
    RAISE EXCEPTION 'Rollback failed: % monitoring views still exist', view_count;
  END IF;

  -- All checks passed
  RAISE NOTICE 'Rollback validation passed successfully';
  RAISE NOTICE '  - Monitoring schema removed: %', NOT schema_exists;
  RAISE NOTICE '  - All monitoring views removed';
END $$;

-- ============================================================================
-- ROLLBACK COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Rollback 20251022_create_monitoring_infrastructure completed successfully';
  RAISE NOTICE '';
  RAISE NOTICE 'Objects removed:';
  RAISE NOTICE '  - Schema: monitoring';
  RAISE NOTICE '  - Views: 16+ monitoring views';
  RAISE NOTICE '';
  RAISE NOTICE 'Impact:';
  RAISE NOTICE '  - No data loss (views only)';
  RAISE NOTICE '  - Monitoring queries will fail until re-applied';
  RAISE NOTICE '';
  RAISE NOTICE 'To restore monitoring:';
  RAISE NOTICE '  Run: 20251022_create_monitoring_infrastructure.sql';
  RAISE NOTICE '========================================';
END $$;
