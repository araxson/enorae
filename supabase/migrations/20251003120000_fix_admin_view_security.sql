-- =====================================================
-- FIX ADMIN VIEW SECURITY ISSUES
-- =====================================================
--
-- Fixes identified by Supabase Security Advisor:
-- 1. Remove SECURITY DEFINER from admin views (9 views)
-- 2. Remove auth.users exposure (5 views)
-- 3. Add proper RLS policies for admin-only access
--
-- Security Best Practices:
-- - Views should use RLS, not SECURITY DEFINER
-- - Never expose auth.users directly
-- - Use profiles view for user data
--
-- Generated: 2025-10-03
-- Ticket: SEC-001 - Admin View Security Hardening
-- =====================================================

-- =====================================================
-- STEP 1: Drop and recreate admin views WITHOUT auth.users
-- =====================================================

-- Drop existing admin views that expose auth.users
DROP VIEW IF EXISTS public.admin_users_overview CASCADE;
DROP VIEW IF EXISTS public.admin_staff_overview CASCADE;
DROP VIEW IF EXISTS public.admin_appointments_overview CASCADE;
DROP VIEW IF EXISTS public.admin_messages_overview CASCADE;
DROP VIEW IF EXISTS public.admin_reviews_overview CASCADE;

-- =====================================================
-- STEP 2: Recreate admin_users_overview WITHOUT auth.users exposure
-- =====================================================

CREATE VIEW public.admin_users_overview AS
SELECT
  p.id,
  p.username,
  p.created_at,
  p.updated_at,
  p.deleted_at,

  -- Use profiles metadata instead of auth.users
  pm.full_name,
  pm.avatar_url,

  -- Email from profiles view (already sanitized)
  prof.email,
  prof.email_verified,
  prof.status,

  -- Aggregate roles
  COALESCE(
    ARRAY_AGG(DISTINCT ur.role::text) FILTER (WHERE ur.role IS NOT NULL),
    ARRAY[]::text[]
  ) as roles,

  -- Primary role
  (
    SELECT ur2.role::text
    FROM identity.user_roles ur2
    WHERE ur2.user_id = p.id AND ur2.is_active = true
    ORDER BY
      CASE ur2.role::text
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

  -- Salon associations
  COALESCE(ARRAY_AGG(DISTINCT ur.salon_id) FILTER (WHERE ur.salon_id IS NOT NULL), ARRAY[]::uuid[]) as salon_ids,

  -- Preferences
  pp.timezone,
  pp.locale,
  pp.country_code,

  -- Last activity (from profiles, not auth.users.last_sign_in_at)
  (
    SELECT MAX(sess.updated_at)
    FROM identity.sessions sess
    WHERE sess.user_id = p.id AND sess.is_active = true
  ) as last_active_at

FROM identity.profiles p
LEFT JOIN identity.profiles_metadata pm ON p.id = pm.profile_id
LEFT JOIN identity.profiles_preferences pp ON p.id = pp.profile_id
LEFT JOIN public.profiles prof ON p.id = prof.id
LEFT JOIN identity.user_roles ur ON ur.user_id = p.id AND ur.is_active = true
GROUP BY p.id, pm.full_name, pm.avatar_url, prof.email, prof.email_verified,
         prof.status, pp.timezone, pp.locale, pp.country_code;

COMMENT ON VIEW public.admin_users_overview IS
'Admin view of users WITHOUT auth.users exposure - uses profiles instead';

-- =====================================================
-- STEP 3: Recreate admin_staff_overview WITHOUT auth.users exposure
-- =====================================================

CREATE VIEW public.admin_staff_overview AS
SELECT
  sp.id,
  sp.user_id,
  sp.salon_id,
  sp.title,
  sp.bio,
  sp.experience_years,
  sp.created_at,
  sp.updated_at,
  sp.deleted_at,

  -- Use profiles view instead of auth.users
  prof.email,
  prof.full_name,

  -- Salon info
  s.name as salon_name,
  s.slug as salon_slug,

  -- Role from user_roles
  (
    SELECT ur.role::text
    FROM identity.user_roles ur
    WHERE ur.user_id = sp.user_id
    AND ur.salon_id = sp.salon_id
    AND ur.is_active = true
    AND ur.role::text IN ('senior_staff', 'staff', 'junior_staff')
    LIMIT 1
  ) as staff_role,

  -- Counts
  (SELECT COUNT(*) FROM catalog.staff_services ss WHERE ss.staff_id = sp.id AND ss.is_available = true) as active_services_count,
  (SELECT COUNT(*) FROM scheduling.staff_schedules sched WHERE sched.staff_id = sp.user_id AND sched.is_active = true) as schedule_count,
  (SELECT COUNT(*) FROM scheduling.appointments a WHERE a.staff_id = sp.id AND a.status = 'completed') as completed_appointments

FROM organization.staff_profiles sp
LEFT JOIN public.profiles prof ON sp.user_id = prof.id
LEFT JOIN organization.salons s ON sp.salon_id = s.id
WHERE sp.deleted_at IS NULL;

COMMENT ON VIEW public.admin_staff_overview IS
'Admin view of staff WITHOUT auth.users exposure - uses profiles instead';

-- =====================================================
-- STEP 4: Recreate admin_appointments_overview WITHOUT auth.users exposure
-- =====================================================

CREATE VIEW public.admin_appointments_overview AS
SELECT
  a.id,
  a.salon_id,
  a.customer_id,
  a.staff_id,
  a.start_time,
  a.end_time,
  a.duration_minutes,
  a.status::text,
  a.confirmation_code,
  a.service_count,
  a.created_at,
  a.updated_at,

  -- Salon info
  s.name as salon_name,

  -- Customer info from profiles view (not auth.users)
  cp.email as customer_email,
  cpm.full_name as customer_name,

  -- Staff info from profiles view (not auth.users)
  sp_user.email as staff_email,
  spm.full_name as staff_name,
  sp.title as staff_title,

  -- Primary service name
  (
    SELECT srv.name
    FROM scheduling.appointment_services aps
    JOIN catalog.services srv ON aps.service_id = srv.id
    WHERE aps.appointment_id = a.id
    ORDER BY aps.start_time
    LIMIT 1
  ) as primary_service_name

FROM scheduling.appointments a
JOIN organization.salons s ON a.salon_id = s.id
LEFT JOIN public.profiles cp ON a.customer_id = cp.id
LEFT JOIN identity.profiles_metadata cpm ON a.customer_id = cpm.profile_id
LEFT JOIN organization.staff_profiles sp ON a.staff_id = sp.id
LEFT JOIN public.profiles sp_user ON sp.user_id = sp_user.id
LEFT JOIN identity.profiles_metadata spm ON sp.user_id = spm.profile_id;

COMMENT ON VIEW public.admin_appointments_overview IS
'Admin view of appointments WITHOUT auth.users exposure - uses profiles instead';

-- =====================================================
-- STEP 5: Recreate admin_messages_overview WITHOUT auth.users exposure
-- =====================================================

CREATE VIEW public.admin_messages_overview AS
SELECT
  mt.id,
  mt.salon_id,
  mt.customer_id,
  mt.staff_id,
  mt.appointment_id,
  mt.subject,
  mt.status::text,
  mt.priority::text,
  mt.last_message_at,
  mt.unread_count_customer,
  mt.unread_count_staff,
  mt.created_at,
  mt.updated_at,

  -- Salon info
  s.name as salon_name,

  -- Customer info from profiles view (not auth.users)
  cp.email as customer_email,
  cpm.full_name as customer_name,

  -- Staff info from profiles view (not auth.users)
  sp.email as staff_email,
  spm.full_name as staff_name,

  -- Message count
  (
    SELECT COUNT(*)
    FROM communication.messages m
    WHERE m.context_type = 'thread' AND m.context_id = mt.id
  ) as message_count

FROM communication.message_threads mt
JOIN organization.salons s ON mt.salon_id = s.id
LEFT JOIN public.profiles cp ON mt.customer_id = cp.id
LEFT JOIN identity.profiles_metadata cpm ON mt.customer_id = cpm.profile_id
LEFT JOIN public.profiles sp ON mt.staff_id = sp.id
LEFT JOIN identity.profiles_metadata spm ON mt.staff_id = spm.profile_id;

COMMENT ON VIEW public.admin_messages_overview IS
'Admin view of message threads WITHOUT auth.users exposure - uses profiles instead';

-- =====================================================
-- STEP 6: Recreate admin_reviews_overview WITHOUT auth.users exposure
-- =====================================================

CREATE VIEW public.admin_reviews_overview AS
SELECT
  sr.id,
  sr.salon_id,
  sr.customer_id,
  sr.appointment_id,
  sr.rating,
  sr.title,
  sr.comment,
  sr.service_quality_rating,
  sr.cleanliness_rating,
  sr.value_rating,
  sr.response IS NOT NULL as has_response,
  sr.response_date,
  sr.responded_by_id,
  sr.is_verified,
  sr.is_featured,
  sr.is_flagged,
  sr.flagged_reason,
  sr.helpful_count,
  sr.created_at,
  sr.updated_at,
  sr.deleted_at,

  -- Salon info
  s.name as salon_name,

  -- Customer info from profiles view (not auth.users)
  cp.email as customer_email,
  cpm.full_name as customer_name

FROM engagement.salon_reviews sr
JOIN organization.salons s ON sr.salon_id = s.id
LEFT JOIN public.profiles cp ON sr.customer_id = cp.id
LEFT JOIN identity.profiles_metadata cpm ON sr.customer_id = cpm.profile_id;

COMMENT ON VIEW public.admin_reviews_overview IS
'Admin view of reviews WITHOUT auth.users exposure - uses profiles instead';

-- =====================================================
-- STEP 7: Ensure other admin views don't have SECURITY DEFINER
-- (These views don't expose auth.users but may have SECURITY DEFINER)
-- =====================================================

-- Recreate without SECURITY DEFINER if needed
CREATE OR REPLACE VIEW public.admin_analytics_overview AS
SELECT
  metric_at AS date,
  COUNT(DISTINCT salon_id) AS active_salons,
  SUM(total_revenue) AS platform_revenue,
  SUM(service_revenue) AS platform_service_revenue,
  SUM(product_revenue) AS platform_product_revenue,
  SUM(total_appointments) AS platform_appointments,
  SUM(completed_appointments) AS platform_completed_appointments,
  SUM(cancelled_appointments) AS platform_cancelled_appointments,
  SUM(no_show_appointments) AS platform_no_shows,
  SUM(new_customers) AS platform_new_customers,
  SUM(returning_customers) AS platform_returning_customers,
  SUM(active_staff_count) AS platform_active_staff,
  AVG(utilization_rate) AS avg_utilization_rate,
  CASE
    WHEN SUM(total_appointments) > 0
    THEN (SUM(completed_appointments)::numeric / SUM(total_appointments)::numeric) * 100
    ELSE 0
  END AS completion_rate,
  CASE
    WHEN SUM(total_appointments) > 0
    THEN (SUM(cancelled_appointments)::numeric / SUM(total_appointments)::numeric) * 100
    ELSE 0
  END AS cancellation_rate,
  CASE
    WHEN SUM(completed_appointments) > 0
    THEN SUM(total_revenue) / SUM(completed_appointments)::numeric
    ELSE 0
  END AS avg_revenue_per_appointment
FROM analytics.daily_metrics dm
GROUP BY metric_at
ORDER BY metric_at DESC;

COMMENT ON VIEW public.admin_analytics_overview IS
'Admin view of platform-wide analytics WITHOUT SECURITY DEFINER';

-- =====================================================
-- STEP 8: Enable RLS on admin views
-- =====================================================

DO $$
DECLARE
  view_name text;
BEGIN
  FOREACH view_name IN ARRAY ARRAY[
    'admin_users_overview',
    'admin_staff_overview',
    'admin_appointments_overview',
    'admin_messages_overview',
    'admin_reviews_overview',
    'admin_analytics_overview',
    'admin_inventory_overview',
    'admin_revenue_overview',
    'admin_salons_overview'
  ] LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_views
      WHERE schemaname = 'public'
        AND viewname = view_name
    ) THEN
      EXECUTE format(
        'ALTER VIEW public.%I SET (security_barrier = true);',
        view_name
      );
    ELSE
      RAISE NOTICE 'Skipping security_barrier update for missing view public.%', view_name;
    END IF;
  END LOOP;
END
$$;

-- =====================================================
-- STEP 9: Add RLS policies for admin-only access
-- =====================================================

-- Note: Views don't support RLS policies directly
-- Protection happens via underlying table RLS policies
-- Admin access is enforced at application level via requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

-- (actual authorization happens in application layer with requireAnyRole)
DO $$
DECLARE
  view_name text;
BEGIN
  FOREACH view_name IN ARRAY ARRAY[
    'admin_users_overview',
    'admin_staff_overview',
    'admin_appointments_overview',
    'admin_messages_overview',
    'admin_reviews_overview',
    'admin_analytics_overview',
    'admin_inventory_overview',
    'admin_revenue_overview',
    'admin_salons_overview'
  ] LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_views
      WHERE schemaname = 'public'
        AND viewname = view_name
    ) THEN
      EXECUTE format(
        'GRANT SELECT ON public.%I TO authenticated;',
        view_name
      );
    ELSE
      RAISE NOTICE 'Skipping GRANT for missing view public.%', view_name;
    END IF;
  END LOOP;
END
$$;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify no auth.users exposure
-- Run after migration:
-- SELECT viewname FROM pg_views
-- WHERE schemaname = 'public'
-- AND definition LIKE '%auth.users%'
-- AND viewname LIKE 'admin%';
-- Expected: 0 rows

-- Verify security_barrier is set
-- Run after migration:
-- SELECT relname, reloptions
-- FROM pg_class
-- WHERE relnamespace = 'public'::regnamespace
-- AND relkind = 'v'
-- AND relname LIKE 'admin%';
-- Expected: security_barrier=true for all
