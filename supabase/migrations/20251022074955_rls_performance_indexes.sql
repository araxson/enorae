-- RLS Performance Optimization Migration
-- Agent 1: RLS Performance Indexes
-- Created: 2025-10-22
-- Purpose: Add covering and partial indexes to optimize RLS policy performance

-- ============================================================================
-- COVERING INDEX FOR get_user_salons() OPTIMIZATION
-- ============================================================================
-- This index optimizes the critical get_user_salons() function used across RLS policies
-- Includes (user_id, is_active, deleted_at, salon_id) for index-only scans

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_rls_lookup
ON identity.user_roles (user_id, is_active)
WHERE deleted_at IS NULL
INCLUDE (salon_id);

COMMENT ON INDEX identity.idx_user_roles_rls_lookup IS
'Covering index for get_user_salons() function - optimizes RLS policy lookups with index-only scans';

-- ============================================================================
-- PARTIAL INDEXES FOR SOFT DELETE FILTERING
-- ============================================================================
-- These indexes optimize queries that filter on deleted_at IS NULL (active records)
-- Reduces index size and improves query performance for most common queries

-- Catalog schema
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_active
ON catalog.services (salon_id)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active
ON catalog.products (salon_id)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_service_categories_active
ON catalog.service_categories (salon_id)
WHERE deleted_at IS NULL;

-- Scheduling schema
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_active
ON scheduling.appointments (salon_id)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_staff_schedules_active
ON scheduling.staff_schedules (salon_id)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blocked_times_active
ON scheduling.blocked_times (salon_id)
WHERE deleted_at IS NULL;

-- Organization schema
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_salons_active
ON organization.salons (id)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_staff_members_active
ON organization.staff_members (salon_id)
WHERE deleted_at IS NULL;

-- Identity schema
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_active
ON identity.user_profiles (user_id)
WHERE deleted_at IS NULL;

-- Communication schema
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_active
ON communication.messages (salon_id)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_active
ON communication.notifications (user_id)
WHERE deleted_at IS NULL;

-- ============================================================================
-- RLS POLICY PERFORMANCE INDEXES FOR MAJOR TABLES
-- ============================================================================
-- These composite indexes optimize the common RLS pattern:
-- WHERE salon_id IN (SELECT get_user_salons(auth.uid()))

-- Catalog schema - composite indexes for RLS + common filters
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_salon_status
ON catalog.services (salon_id, is_active)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_salon_stock
ON catalog.products (salon_id, stock_quantity)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_service_pricing_salon_active
ON catalog.service_pricing (salon_id, is_active)
WHERE deleted_at IS NULL;

-- Scheduling schema - composite indexes for RLS + common filters
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_salon_status_date
ON scheduling.appointments (salon_id, status, appointment_date)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_salon_staff_date
ON scheduling.appointments (salon_id, staff_id, appointment_date)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_staff_schedules_salon_staff_date
ON scheduling.staff_schedules (salon_id, staff_id, schedule_date)
WHERE deleted_at IS NULL;

-- Organization schema - composite indexes for RLS + common filters
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_staff_members_salon_user_active
ON organization.staff_members (salon_id, user_id, is_active)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chains_owner_active
ON organization.chains (owner_id, is_active)
WHERE deleted_at IS NULL;

-- Analytics schema - composite indexes for RLS + time-based queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointment_analytics_salon_date
ON analytics.appointment_analytics (salon_id, date)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_revenue_analytics_salon_date
ON analytics.revenue_analytics (salon_id, date)
WHERE deleted_at IS NULL;

-- Communication schema - composite indexes for RLS + status filters
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_salon_thread_created
ON communication.messages (salon_id, thread_id, created_at)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_read_created
ON communication.notifications (user_id, is_read, created_at)
WHERE deleted_at IS NULL;

-- Engagement schema - composite indexes for RLS + campaign queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_salon_status_start
ON engagement.campaigns (salon_id, status, start_date)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_salon_status_created
ON engagement.reviews (salon_id, status, created_at)
WHERE deleted_at IS NULL;

-- ============================================================================
-- ADD COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON INDEX catalog.idx_services_active IS
'Partial index for active services - optimizes RLS policy lookups';

COMMENT ON INDEX catalog.idx_products_active IS
'Partial index for active products - optimizes RLS policy lookups';

COMMENT ON INDEX scheduling.idx_appointments_active IS
'Partial index for active appointments - optimizes RLS policy lookups';

COMMENT ON INDEX scheduling.idx_appointments_salon_status_date IS
'Composite index for appointment queries by salon, status, and date - optimizes common dashboard queries';

COMMENT ON INDEX organization.idx_staff_members_salon_user_active IS
'Composite index for staff member lookups - optimizes RLS and user-staff relationship queries';

COMMENT ON INDEX analytics.idx_appointment_analytics_salon_date IS
'Composite index for analytics queries - optimizes time-series data retrieval';

COMMENT ON INDEX communication.idx_notifications_user_read_created IS
'Composite index for notification queries - optimizes unread notification counts and recent notifications';

-- ============================================================================
-- VACUUM ANALYZE FOR STATISTICS UPDATE
-- ============================================================================
-- Update statistics for query planner to use new indexes effectively

ANALYZE identity.user_roles;
ANALYZE catalog.services;
ANALYZE catalog.products;
ANALYZE scheduling.appointments;
ANALYZE organization.staff_members;
ANALYZE communication.notifications;
