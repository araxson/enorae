-- Migration: Create views and add missing columns for frontend compatibility
-- Created: 2025-10-02
-- Purpose: Fix TypeScript compilation errors by providing denormalized views

-- ============================================================================
-- 1. Create salon_locations_full view (join locations + addresses + contact)
-- ============================================================================

CREATE OR REPLACE VIEW public.salon_locations_full AS
SELECT
  sl.id,
  sl.salon_id,
  sl.name,
  sl.slug,
  sl.is_active,
  sl.is_primary,
  sl.created_at,
  sl.created_by_id,
  sl.updated_at,
  sl.updated_by_id,
  sl.deleted_at,
  sl.deleted_by_id,
  -- Address fields from location_addresses (mapped to expected frontend names)
  la.street_address as address_line1,
  la.street_address_2 as address_line2,
  la.city,
  la.state_province,
  la.postal_code,
  la.country_code as country,
  la.latitude,
  la.longitude,
  la.landmark,
  la.neighborhood,
  la.parking_instructions,
  la.accessibility_notes,
  la.formatted_address,
  -- Contact fields from salon_contact_details
  scd.phone_number,
  scd.email as location_email,
  scd.website as location_website
FROM organization.salon_locations sl
LEFT JOIN organization.location_addresses la ON la.location_id = sl.id
LEFT JOIN organization.salon_contact_details scd ON scd.location_id = sl.id
WHERE sl.deleted_at IS NULL;

COMMENT ON VIEW public.salon_locations_full IS
  'Denormalized view of salon locations with addresses and contact details. Use this for frontend queries instead of joining manually.';

GRANT SELECT ON public.salon_locations_full TO authenticated, anon;

-- ============================================================================
-- 2. Create salon_metrics_full view (map and compute fields)
-- ============================================================================

CREATE OR REPLACE VIEW public.salon_metrics_full AS
SELECT
  sm.salon_id,
  sm.created_at,
  sm.updated_at,
  -- Map existing fields to expected names
  sm.employee_count as active_staff,
  sm.rating_average as average_rating,
  sm.rating_count as total_reviews,
  sm.total_bookings as total_appointments,
  sm.total_revenue,
  -- Add current date as metric_date (this is a summary table, not time-series)
  CURRENT_DATE as metric_date,
  -- Computed fields (will show NULL until we have real data)
  NULL::integer as active_customers,
  NULL::numeric as completion_rate,
  NULL::numeric as cancellation_rate,
  NULL::numeric as no_show_rate,
  NULL::integer as total_services,
  NULL::numeric as average_service_price
FROM organization.salon_metrics sm;

COMMENT ON VIEW public.salon_metrics_full IS
  'Extended salon metrics view with computed fields. Some fields are NULL and should be computed from analytics.daily_metrics in future.';

GRANT SELECT ON public.salon_metrics_full TO authenticated, anon;

-- ============================================================================
-- 3. Add description column to salon_chains
-- ============================================================================

ALTER TABLE organization.salon_chains
ADD COLUMN IF NOT EXISTS description TEXT;

COMMENT ON COLUMN organization.salon_chains.description IS
  'Public-facing description of the salon chain for marketing purposes';

-- ============================================================================
-- 4. Add location_type column to stock_locations
-- ============================================================================

ALTER TABLE inventory.stock_locations
ADD COLUMN IF NOT EXISTS location_type TEXT DEFAULT 'warehouse' CHECK (location_type IN ('warehouse', 'store', 'salon', 'mobile', 'other'));

COMMENT ON COLUMN inventory.stock_locations.location_type IS
  'Type of stock location: warehouse, store, salon, mobile, or other';

-- Create index for filtering by location type
CREATE INDEX IF NOT EXISTS idx_stock_locations_location_type
ON inventory.stock_locations(location_type);

-- ============================================================================
-- Summary
-- ============================================================================
-- Created:
--   - public.salon_locations_full view (denormalized locations)
--   - public.salon_metrics_full view (extended metrics)
-- Added:
--   - organization.salon_chains.description column
--   - inventory.stock_locations.location_type column
