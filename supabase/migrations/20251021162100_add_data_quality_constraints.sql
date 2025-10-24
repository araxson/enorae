-- Migration: Add Data Quality Check Constraints
-- Date: 2025-10-21
-- Author: Database Integrity Analyzer
-- Purpose: Enforce minimum content quality standards at database level
-- Impact: Prevents low-quality submissions (too short descriptions/reviews)
-- Breaking Change: Partial - rejects short content in future inserts/updates
-- Related: Data Integrity Analysis Report (04-DATA-INTEGRITY-ANALYSIS.md)

-- ============================================================================
-- MIGRATION START
-- ============================================================================

BEGIN;

-- Step 1: Add minimum salon description length constraint
-- Rationale: Salon descriptions should have meaningful content (at least 50 characters)
-- Impact: Improves SEO and user experience by requiring substantive descriptions
ALTER TABLE organization.salon_descriptions
ADD CONSTRAINT IF NOT EXISTS descriptions_minimum_length
CHECK (LENGTH(TRIM(description)) >= 50);

-- Step 2: Add minimum review text length constraint
-- Rationale: Reviews should have meaningful content (at least 20 characters)
-- Impact: Prevents spam and low-quality reviews like "good" or "ok"
ALTER TABLE engagement.salon_reviews
ADD CONSTRAINT IF NOT EXISTS reviews_minimum_content
CHECK (LENGTH(TRIM(review_text)) >= 20);

-- Step 3: Add email format validation constraint
-- Rationale: Ensure all email addresses follow valid format
-- Impact: Prevents invalid email addresses from being stored
ALTER TABLE identity.profiles
ADD CONSTRAINT IF NOT EXISTS profiles_email_format
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Step 4: Add phone format validation (E.164) constraint
-- Rationale: Standardize phone number format for international compatibility
-- Impact: Ensures phone numbers can be reliably used for SMS/calls
ALTER TABLE organization.salon_contact_details
ADD CONSTRAINT IF NOT EXISTS contact_phone_format
CHECK (phone IS NULL OR phone ~ '^\+[1-9]\d{1,14}$');

-- Step 5: Add website URL format validation constraint
-- Rationale: Ensure website URLs start with http:// or https://
-- Impact: Prevents malformed URLs that break links
ALTER TABLE organization.salon_contact_details
ADD CONSTRAINT IF NOT EXISTS contact_website_format
CHECK (website IS NULL OR website ~* '^https?://');

-- Step 6: Add rating value validation constraint
-- Rationale: Ratings must be integers between 1-5
-- Impact: Prevents invalid rating values
ALTER TABLE engagement.salon_reviews
ADD CONSTRAINT IF NOT EXISTS reviews_rating_range
CHECK (rating >= 1 AND rating <= 5);

-- Step 7: Add price positivity constraint
-- Rationale: Service prices must be non-negative
-- Impact: Prevents negative prices in billing/checkout
ALTER TABLE catalog.services
ADD CONSTRAINT IF NOT EXISTS services_price_positive
CHECK (base_price >= 0);

-- Step 8: Add discount percentage range constraint
-- Rationale: Discount percentages must be between 0-100%
-- Impact: Prevents calculation errors in pricing
ALTER TABLE catalog.service_pricing
ADD CONSTRAINT IF NOT EXISTS pricing_discount_range
CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

-- Step 9: Verify all constraints were created
-- Rationale: Ensure all constraints are active
DO $$
DECLARE
  constraint_count INTEGER;
  expected_count INTEGER := 8;
BEGIN
  SELECT COUNT(*) INTO constraint_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'CHECK'
    AND constraint_name IN (
      'descriptions_minimum_length',
      'reviews_minimum_content',
      'profiles_email_format',
      'contact_phone_format',
      'contact_website_format',
      'reviews_rating_range',
      'services_price_positive',
      'pricing_discount_range'
    );

  IF constraint_count < expected_count THEN
    RAISE EXCEPTION 'Migration verification failed: Only % of % data quality constraints created', constraint_count, expected_count;
  END IF;

  RAISE NOTICE 'Migration successful: % data quality check constraints created', constraint_count;
END $$;

COMMIT;

-- ============================================================================
-- MIGRATION END
-- ============================================================================

-- Data Quality Rules Enforced:
-- 1. Salon descriptions: Minimum 50 characters (trimmed)
-- 2. Review text: Minimum 20 characters (trimmed)
-- 3. Email format: Valid email pattern (RFC-compliant)
-- 4. Phone format: E.164 international format (+1234567890)
-- 5. Website format: Must start with http:// or https://
-- 6. Rating range: 1-5 stars only
-- 7. Service prices: Non-negative values
-- 8. Discount percentages: 0-100% range

-- Rollback Instructions:
-- To rollback this migration:
-- ALTER TABLE organization.salon_descriptions DROP CONSTRAINT IF EXISTS descriptions_minimum_length;
-- ALTER TABLE engagement.salon_reviews DROP CONSTRAINT IF EXISTS reviews_minimum_content;
-- ALTER TABLE identity.profiles DROP CONSTRAINT IF EXISTS profiles_email_format;
-- ALTER TABLE organization.salon_contact_details DROP CONSTRAINT IF EXISTS contact_phone_format;
-- ALTER TABLE organization.salon_contact_details DROP CONSTRAINT IF EXISTS contact_website_format;
-- ALTER TABLE engagement.salon_reviews DROP CONSTRAINT IF EXISTS reviews_rating_range;
-- ALTER TABLE catalog.services DROP CONSTRAINT IF EXISTS services_price_positive;
-- ALTER TABLE catalog.service_pricing DROP CONSTRAINT IF EXISTS pricing_discount_range;
