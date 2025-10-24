-- Validation Script for RLS Performance Indexes
-- Run after migration: 20251022074955_rls_performance_indexes.sql
-- Purpose: Verify all 27 indexes were created successfully

-- ============================================================================
-- 1. COUNT CHECK: Verify all 27 indexes exist
-- ============================================================================
SELECT
  'Total RLS Performance Indexes' AS check_name,
  COUNT(*) AS index_count,
  CASE
    WHEN COUNT(*) = 27 THEN '✅ PASS'
    ELSE '❌ FAIL - Expected 27 indexes'
  END AS status
FROM pg_indexes
WHERE indexname IN (
  -- Covering index (1)
  'idx_user_roles_rls_lookup',

  -- Partial indexes (11)
  'idx_services_active',
  'idx_products_active',
  'idx_service_categories_active',
  'idx_appointments_active',
  'idx_staff_schedules_active',
  'idx_blocked_times_active',
  'idx_salons_active',
  'idx_staff_members_active',
  'idx_user_profiles_active',
  'idx_messages_active',
  'idx_notifications_active',

  -- Composite indexes (15)
  'idx_services_salon_status',
  'idx_products_salon_stock',
  'idx_service_pricing_salon_active',
  'idx_appointments_salon_status_date',
  'idx_appointments_salon_staff_date',
  'idx_staff_schedules_salon_staff_date',
  'idx_staff_members_salon_user_active',
  'idx_chains_owner_active',
  'idx_appointment_analytics_salon_date',
  'idx_revenue_analytics_salon_date',
  'idx_messages_salon_thread_created',
  'idx_notifications_user_read_created',
  'idx_campaigns_salon_status_start',
  'idx_reviews_salon_status_created'
);

-- ============================================================================
-- 2. DETAILED CHECK: List all indexes by schema
-- ============================================================================
SELECT
  schemaname AS schema,
  tablename AS table_name,
  indexname AS index_name,
  CASE
    WHEN indexdef LIKE '%CONCURRENTLY%' THEN 'concurrent'
    ELSE 'standard'
  END AS creation_type,
  CASE
    WHEN indexdef LIKE '%WHERE deleted_at IS NULL%' THEN 'partial'
    WHEN indexdef LIKE '%INCLUDE%' THEN 'covering'
    ELSE 'composite'
  END AS index_type,
  '✅' AS status
FROM pg_indexes
WHERE indexname IN (
  'idx_user_roles_rls_lookup',
  'idx_services_active', 'idx_products_active', 'idx_service_categories_active',
  'idx_appointments_active', 'idx_staff_schedules_active', 'idx_blocked_times_active',
  'idx_salons_active', 'idx_staff_members_active', 'idx_user_profiles_active',
  'idx_messages_active', 'idx_notifications_active',
  'idx_services_salon_status', 'idx_products_salon_stock', 'idx_service_pricing_salon_active',
  'idx_appointments_salon_status_date', 'idx_appointments_salon_staff_date',
  'idx_staff_schedules_salon_staff_date', 'idx_staff_members_salon_user_active',
  'idx_chains_owner_active', 'idx_appointment_analytics_salon_date',
  'idx_revenue_analytics_salon_date', 'idx_messages_salon_thread_created',
  'idx_notifications_user_read_created', 'idx_campaigns_salon_status_start',
  'idx_reviews_salon_status_created'
)
ORDER BY schemaname, tablename, indexname;

-- ============================================================================
-- 3. SIZE CHECK: Show index sizes
-- ============================================================================
SELECT
  schemaname AS schema,
  indexname AS index_name,
  pg_size_pretty(pg_relation_size(schemaname||'.'||indexname::text)) AS size
FROM pg_indexes
WHERE indexname IN (
  'idx_user_roles_rls_lookup',
  'idx_services_active', 'idx_products_active', 'idx_service_categories_active',
  'idx_appointments_active', 'idx_staff_schedules_active', 'idx_blocked_times_active',
  'idx_salons_active', 'idx_staff_members_active', 'idx_user_profiles_active',
  'idx_messages_active', 'idx_notifications_active',
  'idx_services_salon_status', 'idx_products_salon_stock', 'idx_service_pricing_salon_active',
  'idx_appointments_salon_status_date', 'idx_appointments_salon_staff_date',
  'idx_staff_schedules_salon_staff_date', 'idx_staff_members_salon_user_active',
  'idx_chains_owner_active', 'idx_appointment_analytics_salon_date',
  'idx_revenue_analytics_salon_date', 'idx_messages_salon_thread_created',
  'idx_notifications_user_read_created', 'idx_campaigns_salon_status_start',
  'idx_reviews_salon_status_created'
)
ORDER BY pg_relation_size(schemaname||'.'||indexname::text) DESC;

-- ============================================================================
-- 4. USAGE CHECK: Show index usage statistics
-- ============================================================================
SELECT
  schemaname AS schema,
  tablename AS table_name,
  indexname AS index_name,
  idx_scan AS scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched,
  CASE
    WHEN idx_scan = 0 THEN '⚠️ Not yet used'
    WHEN idx_scan < 100 THEN '🟡 Low usage'
    WHEN idx_scan < 1000 THEN '🟢 Good usage'
    ELSE '🔥 High usage'
  END AS usage_status
FROM pg_stat_user_indexes
WHERE indexname IN (
  'idx_user_roles_rls_lookup',
  'idx_services_active', 'idx_products_active', 'idx_service_categories_active',
  'idx_appointments_active', 'idx_staff_schedules_active', 'idx_blocked_times_active',
  'idx_salons_active', 'idx_staff_members_active', 'idx_user_profiles_active',
  'idx_messages_active', 'idx_notifications_active',
  'idx_services_salon_status', 'idx_products_salon_stock', 'idx_service_pricing_salon_active',
  'idx_appointments_salon_status_date', 'idx_appointments_salon_staff_date',
  'idx_staff_schedules_salon_staff_date', 'idx_staff_members_salon_user_active',
  'idx_chains_owner_active', 'idx_appointment_analytics_salon_date',
  'idx_revenue_analytics_salon_date', 'idx_messages_salon_thread_created',
  'idx_notifications_user_read_created', 'idx_campaigns_salon_status_start',
  'idx_reviews_salon_status_created'
)
ORDER BY idx_scan DESC;

-- ============================================================================
-- 5. SCHEMA SUMMARY: Indexes per schema
-- ============================================================================
SELECT
  schemaname AS schema,
  COUNT(*) AS index_count,
  pg_size_pretty(SUM(pg_relation_size(schemaname||'.'||indexname::text))) AS total_size
FROM pg_indexes
WHERE indexname IN (
  'idx_user_roles_rls_lookup',
  'idx_services_active', 'idx_products_active', 'idx_service_categories_active',
  'idx_appointments_active', 'idx_staff_schedules_active', 'idx_blocked_times_active',
  'idx_salons_active', 'idx_staff_members_active', 'idx_user_profiles_active',
  'idx_messages_active', 'idx_notifications_active',
  'idx_services_salon_status', 'idx_products_salon_stock', 'idx_service_pricing_salon_active',
  'idx_appointments_salon_status_date', 'idx_appointments_salon_staff_date',
  'idx_staff_schedules_salon_staff_date', 'idx_staff_members_salon_user_active',
  'idx_chains_owner_active', 'idx_appointment_analytics_salon_date',
  'idx_revenue_analytics_salon_date', 'idx_messages_salon_thread_created',
  'idx_notifications_user_read_created', 'idx_campaigns_salon_status_start',
  'idx_reviews_salon_status_created'
)
GROUP BY schemaname
ORDER BY schemaname;

-- ============================================================================
-- 6. MISSING INDEXES CHECK: Identify any missing indexes
-- ============================================================================
WITH expected_indexes AS (
  SELECT unnest(ARRAY[
    'idx_user_roles_rls_lookup',
    'idx_services_active', 'idx_products_active', 'idx_service_categories_active',
    'idx_appointments_active', 'idx_staff_schedules_active', 'idx_blocked_times_active',
    'idx_salons_active', 'idx_staff_members_active', 'idx_user_profiles_active',
    'idx_messages_active', 'idx_notifications_active',
    'idx_services_salon_status', 'idx_products_salon_stock', 'idx_service_pricing_salon_active',
    'idx_appointments_salon_status_date', 'idx_appointments_salon_staff_date',
    'idx_staff_schedules_salon_staff_date', 'idx_staff_members_salon_user_active',
    'idx_chains_owner_active', 'idx_appointment_analytics_salon_date',
    'idx_revenue_analytics_salon_date', 'idx_messages_salon_thread_created',
    'idx_notifications_user_read_created', 'idx_campaigns_salon_status_start',
    'idx_reviews_salon_status_created'
  ]) AS index_name
),
existing_indexes AS (
  SELECT indexname AS index_name
  FROM pg_indexes
  WHERE indexname IN (SELECT index_name FROM expected_indexes)
)
SELECT
  e.index_name,
  '❌ MISSING' AS status
FROM expected_indexes e
LEFT JOIN existing_indexes x ON e.index_name = x.index_name
WHERE x.index_name IS NULL;

-- ============================================================================
-- 7. FINAL SUMMARY
-- ============================================================================
SELECT
  'RLS Performance Indexes Migration' AS migration_name,
  '20251022074955' AS migration_id,
  COUNT(*) AS indexes_found,
  CASE
    WHEN COUNT(*) = 27 THEN '✅ MIGRATION SUCCESSFUL'
    ELSE '❌ MIGRATION INCOMPLETE - Check missing indexes above'
  END AS overall_status,
  pg_size_pretty(SUM(pg_relation_size(schemaname||'.'||indexname::text))) AS total_size
FROM pg_indexes
WHERE indexname IN (
  'idx_user_roles_rls_lookup',
  'idx_services_active', 'idx_products_active', 'idx_service_categories_active',
  'idx_appointments_active', 'idx_staff_schedules_active', 'idx_blocked_times_active',
  'idx_salons_active', 'idx_staff_members_active', 'idx_user_profiles_active',
  'idx_messages_active', 'idx_notifications_active',
  'idx_services_salon_status', 'idx_products_salon_stock', 'idx_service_pricing_salon_active',
  'idx_appointments_salon_status_date', 'idx_appointments_salon_staff_date',
  'idx_staff_schedules_salon_staff_date', 'idx_staff_members_salon_user_active',
  'idx_chains_owner_active', 'idx_appointment_analytics_salon_date',
  'idx_revenue_analytics_salon_date', 'idx_messages_salon_thread_created',
  'idx_notifications_user_read_created', 'idx_campaigns_salon_status_start',
  'idx_reviews_salon_status_created'
);
