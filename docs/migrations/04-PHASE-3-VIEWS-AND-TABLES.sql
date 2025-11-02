-- =============================================================================
-- PHASE 3: VIEWS & SECONDARY TABLES
-- File: 04-PHASE-3-VIEWS-AND-TABLES.sql
-- Purpose: Create 2 critical views + 1 table for reporting and booking rules
-- Estimated Duration: 1.5 hours
-- Timeline: Days 3-4
-- Status: PRODUCTION READY
-- =============================================================================
--
-- PREREQUISITES: Phase 1 and Phase 2 must be completed first
--
-- EXECUTION STEPS:
-- 1. Execute all creates (order doesn't matter)
-- 2. Run verification queries
-- 3. After all: pnpm db:types && pnpm typecheck
--
-- OBJECTS CREATED:
-- - audit.audit_logs_view (already created in Phase 1, verify here)
-- - engagement.salon_reviews_with_counts_view
-- - catalog.service_booking_rules table
--
-- =============================================================================

BEGIN TRANSACTION;

-- =============================================================================
-- 3.1: CREATE OR REPLACE audit_logs_view (15 minutes)
-- =============================================================================
-- PURPOSE: Read-optimized view of audit logs with actor information
-- NOTE: This view was created in Phase 1. If already exists, this replaces it.
--       Run verification to confirm it exists.
-- =============================================================================

CREATE OR REPLACE VIEW audit.audit_logs_view AS
SELECT
  al.id,
  al.entity_type,
  al.entity_id,
  al.action,
  al.actor_id,
  al.created_at,
  al.old_values,
  al.new_values,
  al.reason,
  p.username as actor_username,
  p.email as actor_email
FROM audit.audit_logs al
LEFT JOIN identity.profiles p ON p.id = al.actor_id
ORDER BY al.created_at DESC;

COMMENT ON VIEW audit.audit_logs_view IS
  'Read-optimized view of audit logs with actor profile information.';

GRANT SELECT ON audit.audit_logs_view TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT EXISTS (
  SELECT 1 FROM information_schema.views
  WHERE table_schema = 'audit'
  AND table_name = 'audit_logs_view'
) as view_exists;
-- Expected: true

SELECT COUNT(*) as log_count FROM audit.audit_logs_view;
-- Expected: 0 or greater (depends on existing data)
*/

-- =============================================================================
-- 3.2: CREATE salon_reviews_with_counts_view (20 minutes)
-- =============================================================================
-- PURPOSE: Reviews with aggregated salon statistics (ratings, counts)
-- IMPACT: 9 files use this, review statistics/analytics will fail without it
-- FILES AFFECTED: /features/admin/moderation/api/queries/statistics.ts
--                 /features/admin/reviews/components/admin-reviews.tsx
--                 Other admin review analytics
-- =============================================================================

CREATE OR REPLACE VIEW engagement.salon_reviews_with_counts_view AS
SELECT
  sr.id,
  sr.salon_id,
  sr.customer_id,
  sr.rating,
  sr.content,
  sr.status,
  sr.created_at,
  sr.updated_at,
  COUNT(*) OVER (PARTITION BY sr.salon_id) as total_reviews,
  AVG(sr.rating::INTEGER)::NUMERIC(3,2) OVER (PARTITION BY sr.salon_id) as average_rating,
  COUNT(*) FILTER (WHERE sr.rating = 5) OVER (PARTITION BY sr.salon_id) as five_star_count,
  COUNT(*) FILTER (WHERE sr.rating = 4) OVER (PARTITION BY sr.salon_id) as four_star_count,
  COUNT(*) FILTER (WHERE sr.rating = 3) OVER (PARTITION BY sr.salon_id) as three_star_count,
  COUNT(*) FILTER (WHERE sr.rating = 2) OVER (PARTITION BY sr.salon_id) as two_star_count,
  COUNT(*) FILTER (WHERE sr.rating = 1) OVER (PARTITION BY sr.salon_id) as one_star_count
FROM engagement.salon_reviews sr;

COMMENT ON VIEW engagement.salon_reviews_with_counts_view IS
  'Salon reviews with aggregated statistics (counts, average rating).';

GRANT SELECT ON engagement.salon_reviews_with_counts_view TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT EXISTS (
  SELECT 1 FROM information_schema.views
  WHERE table_schema = 'engagement'
  AND table_name = 'salon_reviews_with_counts_view'
) as view_exists;
-- Expected: true

SELECT COUNT(*) as review_count FROM engagement.salon_reviews_with_counts_view;
-- Expected: 0 or greater (depends on existing reviews)

-- Check structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'engagement'
AND table_name = 'salon_reviews_with_counts_view'
ORDER BY ordinal_position;
-- Expected: id, salon_id, customer_id, rating, content, status, created_at,
--           updated_at, total_reviews, average_rating, five_star_count, etc.
*/

-- =============================================================================
-- 3.3: CREATE service_booking_rules TABLE (30 minutes)
-- =============================================================================
-- PURPOSE: Store service-specific booking constraints and rules
-- IMPACT: 5 files, booking rule management broken without this
-- FILES AFFECTED: /features/business/booking-rules/api/queries/booking-rules.ts
--                 /features/business/booking-rules/api/mutations/booking-rules.ts
--                 /features/business/services/api/mutations/update-service.ts
-- =============================================================================

CREATE TABLE IF NOT EXISTS catalog.service_booking_rules (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys
  service_id UUID NOT NULL REFERENCES catalog.services(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES organization.salons(id) ON DELETE CASCADE,

  -- Booking constraints
  min_notice_minutes INTEGER DEFAULT 0,        -- Minimum advance notice required
  max_advance_days INTEGER DEFAULT 90,         -- How far in advance can be booked
  requires_deposit BOOLEAN DEFAULT FALSE,      -- Whether deposit is required
  deposit_amount NUMERIC(10, 2),               -- Deposit amount if required
  max_concurrent_bookings INTEGER,             -- Max bookings at same time

  -- Business rules
  bookable_by_staff_only BOOLEAN DEFAULT FALSE,-- Only staff can book
  auto_confirm BOOLEAN DEFAULT TRUE,           -- Auto-confirm or manual review

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,

  -- Data integrity
  CONSTRAINT valid_minutes CHECK (min_notice_minutes >= 0),
  CONSTRAINT valid_days CHECK (max_advance_days > 0),
  CONSTRAINT valid_concurrent CHECK (max_concurrent_bookings IS NULL OR max_concurrent_bookings > 0),
  CONSTRAINT valid_deposit CHECK (deposit_amount IS NULL OR deposit_amount > 0)
);

-- Indexes for query performance
CREATE UNIQUE INDEX idx_service_booking_rules_unique
  ON catalog.service_booking_rules(service_id, salon_id);
CREATE INDEX idx_service_booking_rules_salon
  ON catalog.service_booking_rules(salon_id);
CREATE INDEX idx_service_booking_rules_service
  ON catalog.service_booking_rules(service_id);

-- Enable RLS
ALTER TABLE catalog.service_booking_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Salon staff can view their booking rules
CREATE POLICY "Salon staff can view their booking rules"
  ON catalog.service_booking_rules
  FOR SELECT
  USING (
    salon_id IN (
      SELECT id FROM organization.salons
      WHERE owner_id = auth.uid()
    )
    OR
    salon_id IN (
      SELECT salon_id FROM organization.staff_profiles
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy 2: Salon owners can manage their booking rules
CREATE POLICY "Salon owners can manage their booking rules"
  ON catalog.service_booking_rules
  FOR INSERT
  WITH CHECK (
    salon_id IN (
      SELECT id FROM organization.salons
      WHERE owner_id = auth.uid()
    )
  );

-- RLS Policy 3: Salon owners can update their booking rules
CREATE POLICY "Salon owners can update their booking rules"
  ON catalog.service_booking_rules
  FOR UPDATE
  USING (
    salon_id IN (
      SELECT id FROM organization.salons
      WHERE owner_id = auth.uid()
    )
  );

-- RLS Policy 4: Salon owners can delete their booking rules
CREATE POLICY "Salon owners can delete their booking rules"
  ON catalog.service_booking_rules
  FOR DELETE
  USING (
    salon_id IN (
      SELECT id FROM organization.salons
      WHERE owner_id = auth.uid()
    )
  );

-- RLS Policy 5: Anon cannot access
CREATE POLICY "Anon cannot access booking rules"
  ON catalog.service_booking_rules
  FOR ALL
  USING (auth.role() != 'anon');

-- Grant permissions
GRANT SELECT ON catalog.service_booking_rules TO authenticated;
GRANT INSERT ON catalog.service_booking_rules TO authenticated;
GRANT UPDATE ON catalog.service_booking_rules TO authenticated;
GRANT DELETE ON catalog.service_booking_rules TO authenticated;

-- VERIFICATION QUERY:
/*
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_schema = 'catalog'
  AND table_name = 'service_booking_rules'
) as table_exists;
-- Expected: true

SELECT indexname FROM pg_indexes
WHERE tablename = 'service_booking_rules'
ORDER BY indexname;
-- Expected: idx_service_booking_rules_salon,
--           idx_service_booking_rules_service,
--           idx_service_booking_rules_unique

SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'service_booking_rules';
-- Expected: relrowsecurity = true
*/

-- =============================================================================
-- COMMIT TRANSACTION
-- =============================================================================

COMMIT;

-- =============================================================================
-- PHASE 3 COMPLETE!
-- =============================================================================
-- After Phase 3, regenerate TypeScript types:
--   pnpm db:types
-- Then run typecheck:
--   pnpm typecheck
-- Should see zero errors!
-- =============================================================================
