-- Migration: Add Business Rule Check Constraints
-- Date: 2025-10-21
-- Author: Database Integrity Analyzer
-- Purpose: Enforce business rules at database level for data quality
-- Impact: Prevents invalid data entry, may reject some edge cases
-- Breaking Change: Partial - rejects invalid future inserts/updates
-- Related: Data Integrity Analysis Report (04-DATA-INTEGRITY-ANALYSIS.md)

-- ============================================================================
-- MIGRATION START
-- ============================================================================

BEGIN;

-- Step 1: Add service maximum duration constraint
-- Rationale: No service should exceed 8 hours (480 minutes)
-- Impact: Prevents scheduling system errors and unrealistic service durations
ALTER TABLE catalog.services
ADD CONSTRAINT IF NOT EXISTS services_max_duration
CHECK (duration_minutes <= 480);

-- Step 2: Add appointment minimum notice constraint
-- Rationale: Customers should book at least 2 hours in advance for same-day appointments
-- Impact: Prevents last-minute bookings that may not be fulfilled
-- Note: This allows future dates and requires 2-hour notice for today
ALTER TABLE scheduling.appointments
ADD CONSTRAINT IF NOT EXISTS appointments_minimum_notice
CHECK (
  appointment_date > CURRENT_DATE
  OR (appointment_date = CURRENT_DATE AND start_time > CURRENT_TIME + INTERVAL '2 hours')
);

-- Step 3: Add salon staff capacity constraint
-- Rationale: Salons should have reasonable concurrent appointment limits (1-50)
-- Impact: Prevents configuration errors
ALTER TABLE organization.salons
ADD CONSTRAINT IF NOT EXISTS salons_staff_capacity_range
CHECK (max_concurrent_appointments > 0 AND max_concurrent_appointments <= 50);

-- Step 4: Add service minimum duration constraint
-- Rationale: Services should be at least 15 minutes (existing in report)
-- Impact: Prevents unrealistically short service durations
ALTER TABLE catalog.services
ADD CONSTRAINT IF NOT EXISTS services_min_duration
CHECK (duration_minutes >= 15);

-- Step 5: Add commission rate range constraint
-- Rationale: Commission rates should be between 0-100%
-- Impact: Prevents calculation errors
ALTER TABLE organization.staff_profiles
ADD CONSTRAINT IF NOT EXISTS staff_commission_rate_range
CHECK (commission_rate >= 0 AND commission_rate <= 100);

-- Step 6: Add appointment buffer time constraint
-- Rationale: Buffer time should be non-negative
-- Impact: Prevents negative buffer times that cause scheduling conflicts
ALTER TABLE catalog.services
ADD CONSTRAINT IF NOT EXISTS services_buffer_time_positive
CHECK (buffer_time_minutes >= 0);

-- Step 7: Verify all constraints were created
-- Rationale: Ensure all constraints are active
DO $$
DECLARE
  constraint_count INTEGER;
  expected_count INTEGER := 6;
BEGIN
  SELECT COUNT(*) INTO constraint_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'CHECK'
    AND constraint_name IN (
      'services_max_duration',
      'appointments_minimum_notice',
      'salons_staff_capacity_range',
      'services_min_duration',
      'staff_commission_rate_range',
      'services_buffer_time_positive'
    );

  IF constraint_count < expected_count THEN
    RAISE EXCEPTION 'Migration verification failed: Only % of % business rule constraints created', constraint_count, expected_count;
  END IF;

  RAISE NOTICE 'Migration successful: % business rule check constraints created', constraint_count;
END $$;

COMMIT;

-- ============================================================================
-- MIGRATION END
-- ============================================================================

-- Business Rules Enforced:
-- 1. Service duration: 15-480 minutes (15 min to 8 hours)
-- 2. Appointment notice: 2 hours minimum for same-day bookings
-- 3. Salon capacity: 1-50 concurrent appointments
-- 4. Commission rate: 0-100%
-- 5. Buffer time: Non-negative values

-- Rollback Instructions:
-- To rollback this migration:
-- ALTER TABLE catalog.services DROP CONSTRAINT IF EXISTS services_max_duration;
-- ALTER TABLE scheduling.appointments DROP CONSTRAINT IF EXISTS appointments_minimum_notice;
-- ALTER TABLE organization.salons DROP CONSTRAINT IF EXISTS salons_staff_capacity_range;
-- ALTER TABLE catalog.services DROP CONSTRAINT IF EXISTS services_min_duration;
-- ALTER TABLE organization.staff_profiles DROP CONSTRAINT IF EXISTS staff_commission_rate_range;
-- ALTER TABLE catalog.services DROP CONSTRAINT IF EXISTS services_buffer_time_positive;
