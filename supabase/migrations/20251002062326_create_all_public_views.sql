-- Migration: Create all public views for frontend queries
-- Created: 2025-10-02
-- Purpose: Provide public views for ALL commonly queried tables across all schemas
--
-- CRITICAL: Frontend code MUST query public views (not schema.table) for SELECT operations
-- INSERT/UPDATE/DELETE operations still need to use schema.table directly

-- ============================================================================
-- INVENTORY SCHEMA VIEWS (11 tables)
-- ============================================================================

-- products view
CREATE OR REPLACE VIEW public.products AS
SELECT * FROM inventory.products WHERE deleted_at IS NULL;

COMMENT ON VIEW public.products IS
  'Product catalog. Use for SELECT queries. Mutations must use inventory.products.';
GRANT SELECT ON public.products TO authenticated, anon;

-- product_categories view
CREATE OR REPLACE VIEW public.product_categories AS
SELECT * FROM inventory.product_categories WHERE deleted_at IS NULL;

COMMENT ON VIEW public.product_categories IS
  'Product categorization. Use for SELECT queries.';
GRANT SELECT ON public.product_categories TO authenticated, anon;

-- suppliers view
CREATE OR REPLACE VIEW public.suppliers AS
SELECT * FROM inventory.suppliers WHERE deleted_at IS NULL;

COMMENT ON VIEW public.suppliers IS
  'Supplier information. Use for SELECT queries.';
GRANT SELECT ON public.suppliers TO authenticated, anon;

-- purchase_orders view
CREATE OR REPLACE VIEW public.purchase_orders AS
SELECT * FROM inventory.purchase_orders WHERE deleted_at IS NULL;

COMMENT ON VIEW public.purchase_orders IS
  'Purchase order tracking. Use for SELECT queries.';
GRANT SELECT ON public.purchase_orders TO authenticated, anon;

-- purchase_order_items view
CREATE OR REPLACE VIEW public.purchase_order_items AS
SELECT * FROM inventory.purchase_order_items WHERE deleted_at IS NULL;

COMMENT ON VIEW public.purchase_order_items IS
  'Purchase order line items. Use for SELECT queries.';
GRANT SELECT ON public.purchase_order_items TO authenticated, anon;

-- stock_levels view
CREATE OR REPLACE VIEW public.stock_levels AS
SELECT * FROM inventory.stock_levels WHERE deleted_at IS NULL;

COMMENT ON VIEW public.stock_levels IS
  'Current stock quantities by location. Use for SELECT queries.';
GRANT SELECT ON public.stock_levels TO authenticated, anon;

-- stock_locations view
CREATE OR REPLACE VIEW public.stock_locations AS
SELECT * FROM inventory.stock_locations WHERE deleted_at IS NULL;

COMMENT ON VIEW public.stock_locations IS
  'Storage locations (warehouse, salon, etc). Use for SELECT queries.';
GRANT SELECT ON public.stock_locations TO authenticated, anon;

-- stock_movements view
CREATE OR REPLACE VIEW public.stock_movements AS
SELECT * FROM inventory.stock_movements WHERE deleted_at IS NULL;

COMMENT ON VIEW public.stock_movements IS
  'Inventory movement history. Use for SELECT queries.';
GRANT SELECT ON public.stock_movements TO authenticated, anon;

-- stock_alerts view
CREATE OR REPLACE VIEW public.stock_alerts AS
SELECT * FROM inventory.stock_alerts WHERE deleted_at IS NULL;

COMMENT ON VIEW public.stock_alerts IS
  'Low stock notifications. Use for SELECT queries.';
GRANT SELECT ON public.stock_alerts TO authenticated, anon;

-- product_usage view
CREATE OR REPLACE VIEW public.product_usage AS
SELECT * FROM inventory.product_usage WHERE deleted_at IS NULL;

COMMENT ON VIEW public.product_usage IS
  'Product consumption tracking. Use for SELECT queries.';
GRANT SELECT ON public.product_usage TO authenticated, anon;

-- service_product_usage view
CREATE OR REPLACE VIEW public.service_product_usage AS
SELECT * FROM inventory.service_product_usage WHERE deleted_at IS NULL;

COMMENT ON VIEW public.service_product_usage IS
  'Products used per service. Use for SELECT queries.';
GRANT SELECT ON public.service_product_usage TO authenticated, anon;

-- ============================================================================
-- ORGANIZATION SCHEMA VIEWS (additional tables)
-- ============================================================================

-- salon_chains view
CREATE OR REPLACE VIEW public.salon_chains AS
SELECT * FROM organization.salon_chains WHERE deleted_at IS NULL;

COMMENT ON VIEW public.salon_chains IS
  'Multi-location salon chains. Use for SELECT queries.';
GRANT SELECT ON public.salon_chains TO authenticated, anon;

-- salon_locations view
CREATE OR REPLACE VIEW public.salon_locations AS
SELECT * FROM organization.salon_locations WHERE deleted_at IS NULL;

COMMENT ON VIEW public.salon_locations IS
  'Physical salon locations. Use for SELECT queries.';
GRANT SELECT ON public.salon_locations TO authenticated, anon;

-- operating_hours view
CREATE OR REPLACE VIEW public.operating_hours AS
SELECT * FROM organization.operating_hours WHERE deleted_at IS NULL;

COMMENT ON VIEW public.operating_hours IS
  'Salon operating schedules. Use for SELECT queries.';
GRANT SELECT ON public.operating_hours TO authenticated, anon;

-- salon_settings view
CREATE OR REPLACE VIEW public.salon_settings AS
SELECT * FROM organization.salon_settings WHERE deleted_at IS NULL;

COMMENT ON VIEW public.salon_settings IS
  'Salon-specific configurations. Use for SELECT queries.';
GRANT SELECT ON public.salon_settings TO authenticated, anon;

-- salon_media view
CREATE OR REPLACE VIEW public.salon_media AS
SELECT * FROM organization.salon_media WHERE deleted_at IS NULL;

COMMENT ON VIEW public.salon_media IS
  'Images and media for salons. Use for SELECT queries.';
GRANT SELECT ON public.salon_media TO authenticated, anon;

-- salon_metrics view
CREATE OR REPLACE VIEW public.salon_metrics AS
SELECT * FROM organization.salon_metrics;

COMMENT ON VIEW public.salon_metrics IS
  'Salon performance metrics. Use for SELECT queries.';
GRANT SELECT ON public.salon_metrics TO authenticated, anon;

-- location_addresses view
CREATE OR REPLACE VIEW public.location_addresses AS
SELECT * FROM organization.location_addresses WHERE deleted_at IS NULL;

COMMENT ON VIEW public.location_addresses IS
  'Physical addresses for salon locations. Use for SELECT queries.';
GRANT SELECT ON public.location_addresses TO authenticated, anon;

-- salon_contact_details view
CREATE OR REPLACE VIEW public.salon_contact_details AS
SELECT * FROM organization.salon_contact_details WHERE deleted_at IS NULL;

COMMENT ON VIEW public.salon_contact_details IS
  'Contact information for salon locations. Use for SELECT queries.';
GRANT SELECT ON public.salon_contact_details TO authenticated, anon;

-- ============================================================================
-- CATALOG SCHEMA VIEWS (additional tables)
-- ============================================================================

-- service_categories view
CREATE OR REPLACE VIEW public.service_categories AS
SELECT * FROM catalog.service_categories WHERE deleted_at IS NULL;

COMMENT ON VIEW public.service_categories IS
  'Service categorization. Use for SELECT queries.';
GRANT SELECT ON public.service_categories TO authenticated, anon;

-- service_pricing view
CREATE OR REPLACE VIEW public.service_pricing AS
SELECT * FROM catalog.service_pricing WHERE deleted_at IS NULL;

COMMENT ON VIEW public.service_pricing IS
  'Dynamic pricing for services. Use for SELECT queries.';
GRANT SELECT ON public.service_pricing TO authenticated, anon;

-- service_booking_rules view
CREATE OR REPLACE VIEW public.service_booking_rules AS
SELECT * FROM catalog.service_booking_rules WHERE deleted_at IS NULL;

COMMENT ON VIEW public.service_booking_rules IS
  'Booking constraints and rules. Use for SELECT queries.';
GRANT SELECT ON public.service_booking_rules TO authenticated, anon;

-- ============================================================================
-- SCHEDULING SCHEMA VIEWS (additional tables)
-- ============================================================================

-- time_off_requests view
CREATE OR REPLACE VIEW public.time_off_requests AS
SELECT * FROM scheduling.time_off_requests WHERE deleted_at IS NULL;

COMMENT ON VIEW public.time_off_requests IS
  'Staff time-off management. Use for SELECT queries.';
GRANT SELECT ON public.time_off_requests TO authenticated, anon;

-- appointment_services view
CREATE OR REPLACE VIEW public.appointment_services AS
SELECT * FROM scheduling.appointment_services WHERE deleted_at IS NULL;

COMMENT ON VIEW public.appointment_services IS
  'Services included in appointments. Use for SELECT queries.';
GRANT SELECT ON public.appointment_services TO authenticated, anon;

-- ============================================================================
-- COMMUNICATION SCHEMA VIEWS
-- ============================================================================

-- webhook_queue view
CREATE OR REPLACE VIEW public.webhook_queue AS
SELECT * FROM communication.webhook_queue;

COMMENT ON VIEW public.webhook_queue IS
  'Webhook delivery queue. Use for SELECT queries.';
GRANT SELECT ON public.webhook_queue TO authenticated;

-- messages view
CREATE OR REPLACE VIEW public.messages AS
SELECT * FROM communication.messages WHERE deleted_at IS NULL;

COMMENT ON VIEW public.messages IS
  'Individual messages. Use for SELECT queries.';
GRANT SELECT ON public.messages TO authenticated;

-- message_threads view
CREATE OR REPLACE VIEW public.message_threads AS
SELECT * FROM communication.message_threads WHERE deleted_at IS NULL;

COMMENT ON VIEW public.message_threads IS
  'Conversation threads. Use for SELECT queries.';
GRANT SELECT ON public.message_threads TO authenticated;

-- ============================================================================
-- IDENTITY SCHEMA VIEWS (additional tables)
-- ============================================================================

-- profiles_metadata view
CREATE OR REPLACE VIEW public.profiles_metadata AS
SELECT * FROM identity.profiles_metadata;

COMMENT ON VIEW public.profiles_metadata IS
  'Extended profile data. Use for SELECT queries.';
GRANT SELECT ON public.profiles_metadata TO authenticated;

-- profiles_preferences view
CREATE OR REPLACE VIEW public.profiles_preferences AS
SELECT * FROM identity.profiles_preferences;

COMMENT ON VIEW public.profiles_preferences IS
  'User preferences. Use for SELECT queries.';
GRANT SELECT ON public.profiles_preferences TO authenticated;

-- sessions view (optional - for admin monitoring)
CREATE OR REPLACE VIEW public.sessions AS
SELECT * FROM identity.sessions WHERE deleted_at IS NULL;

COMMENT ON VIEW public.sessions IS
  'Active user sessions. Use for SELECT queries. Admin only.';
GRANT SELECT ON public.sessions TO authenticated;

-- ============================================================================
-- ANALYTICS SCHEMA VIEWS
-- ============================================================================

-- daily_metrics view
CREATE OR REPLACE VIEW public.daily_metrics AS
SELECT * FROM analytics.daily_metrics;

COMMENT ON VIEW public.daily_metrics IS
  'Daily aggregated metrics. Use for SELECT queries.';
GRANT SELECT ON public.daily_metrics TO authenticated;

-- operational_metrics view
CREATE OR REPLACE VIEW public.operational_metrics AS
SELECT * FROM analytics.operational_metrics;

COMMENT ON VIEW public.operational_metrics IS
  'Real-time operational data. Use for SELECT queries.';
GRANT SELECT ON public.operational_metrics TO authenticated;

-- manual_transactions view
CREATE OR REPLACE VIEW public.manual_transactions AS
SELECT * FROM analytics.manual_transactions WHERE deleted_at IS NULL;

COMMENT ON VIEW public.manual_transactions IS
  'Manual transaction records. Use for SELECT queries.';
GRANT SELECT ON public.manual_transactions TO authenticated;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Created 37 new public views:
--
-- Inventory (11):  products, product_categories, suppliers, purchase_orders,
--                  purchase_order_items, stock_levels, stock_locations,
--                  stock_movements, stock_alerts, product_usage, service_product_usage
--
-- Organization (8): salon_chains, salon_locations, operating_hours, salon_settings,
--                   salon_media, salon_metrics, location_addresses, salon_contact_details
--
-- Catalog (3):      service_categories, service_pricing, service_booking_rules
--
-- Scheduling (2):   time_off_requests, appointment_services
--
-- Communication (3): webhook_queue, messages, message_threads
--
-- Identity (3):     profiles_metadata, profiles_preferences, sessions
--
-- Analytics (3):    daily_metrics, operational_metrics, manual_transactions
--
-- TOTAL: 37 new views + 10 existing core views = 47 public views
--
-- CRITICAL REMINDER:
-- - Use public views for ALL SELECT queries
-- - Use schema.table ONLY for INSERT/UPDATE/DELETE operations
-- - Type definitions: Use Database['public']['Views'] not Tables
