-- =====================================================
-- SUPER ADMIN & PLATFORM ADMIN ACCESS
-- Adds bypass RLS policies for platform administrators
-- =====================================================
--
-- CRITICAL: This migration gives super_admin and platform_admin
-- full access to ALL tables across ALL schemas.
--
-- Security: Admin roles are verified via identity.user_roles table
-- Pattern: Follows existing RLS pattern from audit.audit_logs
--
-- Generated: 2025-10-03
-- =====================================================

-- =====================================================
-- HELPER FUNCTION: Check if user is platform admin
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM identity.user_roles
    WHERE user_id = (SELECT auth.uid())
      AND role IN ('super_admin', 'platform_admin')
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      AND revoked_at IS NULL
  );
$$;

COMMENT ON FUNCTION public.is_platform_admin() IS
'Returns true if current user has super_admin or platform_admin role';

-- =====================================================
-- ORGANIZATION SCHEMA (11 tables)
-- =====================================================

-- salons
CREATE POLICY "platform_admins_all_salons"
ON organization.salons
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- salon_chains
CREATE POLICY "platform_admins_all_chains"
ON organization.salon_chains
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- staff_profiles
CREATE POLICY "platform_admins_all_staff"
ON organization.staff_profiles
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- salon_locations
CREATE POLICY "platform_admins_all_salon_locations"
ON organization.salon_locations
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- operating_hours
CREATE POLICY "platform_admins_all_operating_hours"
ON organization.operating_hours
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- salon_settings
CREATE POLICY "platform_admins_all_salon_settings"
ON organization.salon_settings
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- salon_media
CREATE POLICY "platform_admins_all_salon_media"
ON organization.salon_media
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- salon_metrics
CREATE POLICY "platform_admins_all_salon_metrics"
ON organization.salon_metrics
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- salon_contact_details
CREATE POLICY "platform_admins_all_salon_contacts"
ON organization.salon_contact_details
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- salon_descriptions
CREATE POLICY "platform_admins_all_salon_descriptions"
ON organization.salon_descriptions
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- location_addresses
CREATE POLICY "platform_admins_all_location_addresses"
ON organization.location_addresses
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- =====================================================
-- IDENTITY SCHEMA (5 tables)
-- =====================================================

-- profiles
CREATE POLICY "platform_admins_all_profiles"
ON identity.profiles
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- user_roles
CREATE POLICY "platform_admins_all_user_roles"
ON identity.user_roles
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- profiles_metadata
CREATE POLICY "platform_admins_all_profiles_metadata"
ON identity.profiles_metadata
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- profiles_preferences
CREATE POLICY "platform_admins_all_profiles_preferences"
ON identity.profiles_preferences
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- sessions
CREATE POLICY "platform_admins_all_sessions"
ON identity.sessions
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- =====================================================
-- CATALOG SCHEMA (5 tables)
-- =====================================================

-- services
CREATE POLICY "platform_admins_all_services"
ON catalog.services
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- service_categories
CREATE POLICY "platform_admins_all_service_categories"
ON catalog.service_categories
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- service_pricing
CREATE POLICY "platform_admins_all_service_pricing"
ON catalog.service_pricing
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- service_booking_rules
CREATE POLICY "platform_admins_all_service_booking_rules"
ON catalog.service_booking_rules
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- staff_services
CREATE POLICY "platform_admins_all_staff_services"
ON catalog.staff_services
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- =====================================================
-- SCHEDULING SCHEMA (5 tables)
-- =====================================================

-- appointments
CREATE POLICY "platform_admins_all_appointments"
ON scheduling.appointments
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- appointment_services
CREATE POLICY "platform_admins_all_appointment_services"
ON scheduling.appointment_services
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- blocked_times
CREATE POLICY "platform_admins_all_blocked_times"
ON scheduling.blocked_times
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- staff_schedules
CREATE POLICY "platform_admins_all_staff_schedules"
ON scheduling.staff_schedules
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- time_off_requests
CREATE POLICY "platform_admins_all_time_off_requests"
ON scheduling.time_off_requests
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- =====================================================
-- INVENTORY SCHEMA (11 tables)
-- =====================================================

-- products
CREATE POLICY "platform_admins_all_products"
ON inventory.products
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- product_categories
CREATE POLICY "platform_admins_all_product_categories"
ON inventory.product_categories
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- suppliers
CREATE POLICY "platform_admins_all_suppliers"
ON inventory.suppliers
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- stock_locations
CREATE POLICY "platform_admins_all_stock_locations"
ON inventory.stock_locations
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- stock_levels
CREATE POLICY "platform_admins_all_stock_levels"
ON inventory.stock_levels
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- stock_movements
CREATE POLICY "platform_admins_all_stock_movements"
ON inventory.stock_movements
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- purchase_orders
CREATE POLICY "platform_admins_all_purchase_orders"
ON inventory.purchase_orders
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- purchase_order_items
CREATE POLICY "platform_admins_all_purchase_order_items"
ON inventory.purchase_order_items
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- service_product_usage
CREATE POLICY "platform_admins_all_service_product_usage"
ON inventory.service_product_usage
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- product_usage
CREATE POLICY "platform_admins_all_product_usage"
ON inventory.product_usage
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- stock_alerts
CREATE POLICY "platform_admins_all_stock_alerts"
ON inventory.stock_alerts
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- =====================================================
-- COMMUNICATION SCHEMA (2 tables)
-- webhook_queue skipped - has system-only policy
-- =====================================================

-- messages
CREATE POLICY "platform_admins_all_messages"
ON communication.messages
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- message_threads
CREATE POLICY "platform_admins_all_message_threads"
ON communication.message_threads
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- =====================================================
-- ANALYTICS SCHEMA (3 tables)
-- =====================================================

-- daily_metrics
CREATE POLICY "platform_admins_all_daily_metrics"
ON analytics.daily_metrics
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- operational_metrics
CREATE POLICY "platform_admins_all_operational_metrics"
ON analytics.operational_metrics
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- manual_transactions
CREATE POLICY "platform_admins_all_manual_transactions"
ON analytics.manual_transactions
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- =====================================================
-- ENGAGEMENT SCHEMA (2 tables)
-- =====================================================

-- customer_favorites
CREATE POLICY "platform_admins_all_customer_favorites"
ON engagement.customer_favorites
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- salon_reviews
CREATE POLICY "platform_admins_all_salon_reviews"
ON engagement.salon_reviews
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Count policies added (should be 44 + 1 function = 45 objects)
DO $$
DECLARE
  policy_count INT;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE policyname LIKE 'platform_admins_%';

  RAISE NOTICE 'Added % platform admin policies', policy_count;

  IF policy_count < 44 THEN
    RAISE WARNING 'Expected 44 policies, but only % were created', policy_count;
  END IF;
END $$;
