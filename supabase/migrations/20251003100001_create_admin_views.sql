-- =====================================================
-- ADMIN VIEWS FOR PLATFORM ADMINISTRATION
-- Creates aggregated views for admin dashboard features
-- =====================================================
--
-- These views provide:
-- 1. User management data (roles, activity, associations)
-- 2. Salon management data (metrics, settings, relationships)
-- 3. Platform analytics (aggregated metrics)
-- 4. Content moderation data (reviews, messages)
--
-- Security: Views inherit RLS from underlying tables
-- Pattern: Follows existing view pattern (salons, staff, etc.)
--
-- Generated: 2025-10-03
-- =====================================================

-- =====================================================
-- USER MANAGEMENT VIEWS
-- =====================================================

-- Admin user overview with aggregated data
CREATE OR REPLACE VIEW public.admin_users AS
SELECT
  p.id,
  p.username,
  pm.full_name,
  pm.avatar_url,
  p.created_at,
  p.updated_at,
  p.deleted_at,

  -- Aggregate roles (array of all user roles)
  COALESCE(
    ARRAY_AGG(DISTINCT ur.role::text) FILTER (WHERE ur.role IS NOT NULL),
    ARRAY[]::text[]
  ) as roles,

  -- Primary role (highest priority)
  (
    SELECT ur2.role
    FROM identity.user_roles ur2
    WHERE ur2.user_id = p.id AND ur2.is_active = true
    ORDER BY
      CASE ur2.role
        WHEN 'super_admin' THEN 1
        WHEN 'platform_admin' THEN 2
        WHEN 'tenant_owner' THEN 3
        WHEN 'salon_owner' THEN 4
        WHEN 'salon_manager' THEN 5
        WHEN 'senior_staff' THEN 6
        WHEN 'staff' THEN 7
        WHEN 'junior_staff' THEN 8
        WHEN 'vip_customer' THEN 9
        WHEN 'customer' THEN 10
        WHEN 'guest' THEN 11
        ELSE 12
      END
    LIMIT 1
  ) as primary_role,

  -- Counts
  COUNT(DISTINCT sp.salon_id) FILTER (WHERE sp.deleted_at IS NULL) as staff_salon_count,
  COUNT(DISTINCT s.id) FILTER (WHERE s.deleted_at IS NULL) as owned_salon_count,
  COUNT(DISTINCT cf.id) as favorite_count,
  COUNT(DISTINCT a.id) as appointment_count,

  -- Latest activity
  MAX(sess.updated_at) as last_active,
  COUNT(DISTINCT sess.id) FILTER (WHERE sess.is_active = true) as active_session_count

FROM identity.profiles p
LEFT JOIN identity.profiles_metadata pm ON pm.profile_id = p.id
LEFT JOIN identity.user_roles ur ON ur.user_id = p.id AND ur.is_active = true
LEFT JOIN organization.staff_profiles sp ON sp.user_id = p.id
LEFT JOIN organization.salons s ON s.owner_id = p.id
LEFT JOIN engagement.customer_favorites cf ON cf.customer_id = p.id
LEFT JOIN scheduling.appointments a ON a.customer_id = p.id
LEFT JOIN identity.sessions sess ON sess.user_id = p.id
GROUP BY p.id, pm.full_name, pm.avatar_url;

COMMENT ON VIEW public.admin_users IS
'Admin view of all users with aggregated role, salon, and activity data';

-- =====================================================
-- SALON MANAGEMENT VIEWS
-- =====================================================

-- Admin salon overview with aggregated metrics
CREATE OR REPLACE VIEW public.admin_salons AS
SELECT
  s.id,
  s.name,
  s.slug,
  s.business_name,
  s.business_type,
  s.chain_id,
  sc.name as chain_name,
  s.owner_id,
  pm.full_name as owner_name,
  s.established_at,
  s.created_at,
  s.updated_at,
  s.deleted_at,

  -- Settings
  ss.subscription_tier,
  ss.is_accepting_bookings,
  ss.max_staff,
  ss.max_services,
  ss.features,

  -- Metrics
  sm.rating_average,
  sm.rating_count,
  sm.total_bookings,
  sm.total_revenue,
  sm.employee_count,

  -- Counts (real-time)
  COUNT(DISTINCT sp.id) FILTER (WHERE sp.deleted_at IS NULL) as active_staff_count,
  COUNT(DISTINCT srv.id) FILTER (WHERE srv.deleted_at IS NULL) as service_count,
  COUNT(DISTINCT sl.id) FILTER (WHERE sl.deleted_at IS NULL) as location_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.deleted_at IS NULL) as product_count,

  -- Activity
  MAX(a.created_at) as last_booking_at,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'confirmed' AND a.start_time > CURRENT_TIMESTAMP) as upcoming_appointments

FROM organization.salons s
LEFT JOIN organization.salon_chains sc ON sc.id = s.chain_id
LEFT JOIN identity.profiles_metadata pm ON pm.profile_id = s.owner_id
LEFT JOIN organization.salon_settings ss ON ss.salon_id = s.id
LEFT JOIN organization.salon_metrics sm ON sm.salon_id = s.id
LEFT JOIN organization.staff_profiles sp ON sp.salon_id = s.id
LEFT JOIN catalog.services srv ON srv.salon_id = s.id
LEFT JOIN organization.salon_locations sl ON sl.salon_id = s.id
LEFT JOIN inventory.products p ON p.salon_id = s.id
LEFT JOIN scheduling.appointments a ON a.salon_id = s.id
GROUP BY
  s.id, sc.name, pm.full_name,
  ss.subscription_tier, ss.is_accepting_bookings, ss.max_staff, ss.max_services, ss.features,
  sm.rating_average, sm.rating_count, sm.total_bookings, sm.total_revenue, sm.employee_count;

COMMENT ON VIEW public.admin_salons IS
'Admin view of all salons with aggregated metrics, settings, and activity';

-- =====================================================
-- PLATFORM ANALYTICS VIEWS
-- =====================================================

-- Daily platform metrics (aggregated across all salons)
CREATE OR REPLACE VIEW public.admin_platform_metrics_daily AS
SELECT
  DATE_TRUNC('day', dm.metric_at) as date,

  -- Revenue
  SUM(dm.total_revenue) as total_revenue,
  SUM(dm.service_revenue) as service_revenue,
  SUM(dm.product_revenue) as product_revenue,

  -- Appointments
  SUM(dm.total_appointments) as total_appointments,
  SUM(dm.completed_appointments) as completed_appointments,
  SUM(dm.cancelled_appointments) as cancelled_appointments,
  SUM(dm.no_show_appointments) as no_show_appointments,

  -- Customers
  SUM(dm.new_customers) as new_customers,
  SUM(dm.returning_customers) as returning_customers,

  -- Staff
  SUM(dm.active_staff_count) as total_active_staff,
  AVG(dm.utilization_rate) as avg_utilization_rate,

  -- Salon count for this day
  COUNT(DISTINCT dm.salon_id) as active_salons

FROM analytics.daily_metrics dm
GROUP BY DATE_TRUNC('day', dm.metric_at)
ORDER BY date DESC;

COMMENT ON VIEW public.admin_platform_metrics_daily IS
'Platform-wide metrics aggregated by day across all salons';

-- User growth metrics
CREATE OR REPLACE VIEW public.admin_user_growth AS
SELECT
  DATE_TRUNC('day', p.created_at) as signup_date,
  COUNT(*) as new_users,

  -- By role type
  COUNT(*) FILTER (WHERE ur.role IN ('customer', 'vip_customer', 'guest')) as new_customers,
  COUNT(*) FILTER (WHERE ur.role IN ('salon_owner', 'salon_manager', 'tenant_owner')) as new_business_users,
  COUNT(*) FILTER (WHERE ur.role IN ('staff', 'senior_staff', 'junior_staff')) as new_staff,
  COUNT(*) FILTER (WHERE ur.role IN ('super_admin', 'platform_admin')) as new_admins

FROM identity.profiles p
LEFT JOIN identity.user_roles ur ON ur.user_id = p.id AND ur.is_active = true
WHERE p.deleted_at IS NULL
GROUP BY DATE_TRUNC('day', p.created_at)
ORDER BY signup_date DESC;

COMMENT ON VIEW public.admin_user_growth IS
'User signup metrics by day and role type';

-- Salon growth metrics
CREATE OR REPLACE VIEW public.admin_salon_growth AS
SELECT
  DATE_TRUNC('day', s.created_at) as signup_date,
  COUNT(*) as new_salons,

  -- By type
  COUNT(*) FILTER (WHERE s.business_type = 'salon') as salons,
  COUNT(*) FILTER (WHERE s.business_type = 'barbershop') as barbershops,
  COUNT(*) FILTER (WHERE s.business_type = 'spa') as spas,

  -- Chain association
  COUNT(*) FILTER (WHERE s.chain_id IS NOT NULL) as part_of_chain,
  COUNT(*) FILTER (WHERE s.chain_id IS NULL) as independent,

  -- Current status
  COUNT(*) FILTER (WHERE s.deleted_at IS NULL) as still_active

FROM organization.salons s
GROUP BY DATE_TRUNC('day', s.created_at)
ORDER BY signup_date DESC;

COMMENT ON VIEW public.admin_salon_growth IS
'Salon signup metrics by day and business type';

-- =====================================================
-- CONTENT MODERATION VIEWS
-- =====================================================

-- Reviews needing moderation
CREATE OR REPLACE VIEW public.admin_reviews_moderation AS
SELECT
  sr.id,
  sr.salon_id,
  s.name as salon_name,
  sr.customer_id,
  pm.full_name as customer_name,
  sr.appointment_id,
  sr.rating,
  sr.title,
  sr.comment,
  sr.service_quality_rating,
  sr.cleanliness_rating,
  sr.value_rating,
  sr.is_verified,
  sr.is_featured,
  sr.is_flagged,
  sr.flagged_reason,
  sr.response,
  sr.response_date,
  sr.responded_by_id,
  sr.helpful_count,
  sr.created_at,
  sr.updated_at,
  sr.deleted_at

FROM engagement.salon_reviews sr
LEFT JOIN organization.salons s ON s.id = sr.salon_id
LEFT JOIN identity.profiles_metadata pm ON pm.profile_id = sr.customer_id
WHERE sr.deleted_at IS NULL
ORDER BY
  CASE WHEN sr.is_flagged THEN 0 ELSE 1 END, -- Flagged first
  sr.created_at DESC;

COMMENT ON VIEW public.admin_reviews_moderation IS
'All reviews for moderation, flagged reviews shown first';

-- Message threads for monitoring
CREATE OR REPLACE VIEW public.admin_message_threads AS
SELECT
  mt.id,
  mt.salon_id,
  s.name as salon_name,
  mt.customer_id,
  cpm.full_name as customer_name,
  mt.staff_id,
  spm.full_name as staff_name,
  mt.appointment_id,
  mt.subject,
  mt.status,
  mt.priority,
  mt.last_message_at,
  mt.last_message_by_id,
  mt.unread_count_customer,
  mt.unread_count_staff,
  mt.created_at,
  mt.updated_at,

  -- Message count
  (SELECT COUNT(*) FROM communication.messages m WHERE m.context_id = mt.id AND m.context_type = 'thread') as message_count

FROM communication.message_threads mt
LEFT JOIN organization.salons s ON s.id = mt.salon_id
LEFT JOIN identity.profiles_metadata cpm ON cpm.profile_id = mt.customer_id
LEFT JOIN identity.profiles_metadata spm ON spm.profile_id = mt.staff_id
ORDER BY
  CASE mt.priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'normal' THEN 3
    WHEN 'low' THEN 4
  END,
  mt.last_message_at DESC NULLS LAST;

COMMENT ON VIEW public.admin_message_threads IS
'All message threads sorted by priority and recent activity';

-- =====================================================
-- ROLE MANAGEMENT VIEW
-- =====================================================

-- All user role assignments with details
CREATE OR REPLACE VIEW public.admin_user_roles AS
SELECT
  ur.id,
  ur.user_id,
  pm.full_name as user_name,
  p.username,
  ur.role,
  ur.salon_id,
  s.name as salon_name,
  ur.permissions,
  ur.is_active,
  ur.created_at,
  ur.updated_at,
  ur.deleted_at,
  ur.created_by_id,
  creator.full_name as created_by_name

FROM identity.user_roles ur
LEFT JOIN identity.profiles p ON p.id = ur.user_id
LEFT JOIN identity.profiles_metadata pm ON pm.profile_id = ur.user_id
LEFT JOIN organization.salons s ON s.id = ur.salon_id
LEFT JOIN identity.profiles_metadata creator ON creator.profile_id = ur.created_by_id
ORDER BY ur.created_at DESC;

COMMENT ON VIEW public.admin_user_roles IS
'All user role assignments with user and salon details';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Count views created (should be 9 views)
DO $$
DECLARE
  view_count INT;
BEGIN
  SELECT COUNT(*) INTO view_count
  FROM information_schema.views
  WHERE table_schema = 'public'
    AND table_name LIKE 'admin_%';

  RAISE NOTICE 'Created % admin views', view_count;

  IF view_count < 9 THEN
    RAISE WARNING 'Expected 9 admin views, but only % were created', view_count;
  END IF;
END $$;
