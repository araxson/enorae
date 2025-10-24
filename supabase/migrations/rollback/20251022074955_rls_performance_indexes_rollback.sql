-- Rollback RLS Performance Optimization Migration
-- Agent 1: RLS Performance Indexes Rollback
-- Created: 2025-10-22
-- Purpose: Remove RLS performance optimization indexes

-- ============================================================================
-- DROP RLS POLICY PERFORMANCE INDEXES
-- ============================================================================

-- Engagement schema
DROP INDEX IF EXISTS engagement.idx_reviews_salon_status_created;
DROP INDEX IF EXISTS engagement.idx_campaigns_salon_status_start;

-- Communication schema
DROP INDEX IF EXISTS communication.idx_notifications_user_read_created;
DROP INDEX IF EXISTS communication.idx_messages_salon_thread_created;

-- Analytics schema
DROP INDEX IF EXISTS analytics.idx_revenue_analytics_salon_date;
DROP INDEX IF EXISTS analytics.idx_appointment_analytics_salon_date;

-- Organization schema
DROP INDEX IF EXISTS organization.idx_chains_owner_active;
DROP INDEX IF EXISTS organization.idx_staff_members_salon_user_active;

-- Scheduling schema
DROP INDEX IF EXISTS scheduling.idx_staff_schedules_salon_staff_date;
DROP INDEX IF EXISTS scheduling.idx_appointments_salon_staff_date;
DROP INDEX IF EXISTS scheduling.idx_appointments_salon_status_date;

-- Catalog schema
DROP INDEX IF EXISTS catalog.idx_service_pricing_salon_active;
DROP INDEX IF EXISTS catalog.idx_products_salon_stock;
DROP INDEX IF EXISTS catalog.idx_services_salon_status;

-- ============================================================================
-- DROP PARTIAL INDEXES FOR SOFT DELETE FILTERING
-- ============================================================================

-- Communication schema
DROP INDEX IF EXISTS communication.idx_notifications_active;
DROP INDEX IF EXISTS communication.idx_messages_active;

-- Identity schema
DROP INDEX IF EXISTS identity.idx_user_profiles_active;

-- Organization schema
DROP INDEX IF EXISTS organization.idx_staff_members_active;
DROP INDEX IF EXISTS organization.idx_salons_active;

-- Scheduling schema
DROP INDEX IF EXISTS scheduling.idx_blocked_times_active;
DROP INDEX IF EXISTS scheduling.idx_staff_schedules_active;
DROP INDEX IF EXISTS scheduling.idx_appointments_active;

-- Catalog schema
DROP INDEX IF EXISTS catalog.idx_service_categories_active;
DROP INDEX IF EXISTS catalog.idx_products_active;
DROP INDEX IF EXISTS catalog.idx_services_active;

-- ============================================================================
-- DROP COVERING INDEX FOR get_user_salons()
-- ============================================================================

DROP INDEX IF EXISTS identity.idx_user_roles_rls_lookup;

-- ============================================================================
-- VACUUM ANALYZE FOR STATISTICS UPDATE
-- ============================================================================
-- Update statistics after index removal

ANALYZE identity.user_roles;
ANALYZE catalog.services;
ANALYZE catalog.products;
ANALYZE scheduling.appointments;
ANALYZE organization.staff_members;
ANALYZE communication.notifications;
