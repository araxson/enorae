-- Migration: Add NOT NULL constraint to catalog.services.category_id
-- Date: 2025-10-21
-- Author: Database Integrity Analyzer
-- Purpose: Enforce that all services must have a category (0.9% currently null)
-- Impact: Updates 0.9% of rows before adding constraint
-- Breaking Change: No - only affects new inserts
-- Related: Data Integrity Analysis Report (04-DATA-INTEGRITY-ANALYSIS.md)

-- ============================================================================
-- MIGRATION START
-- ============================================================================

BEGIN;

-- Step 1: Create default category if not exists
-- Rationale: Need a fallback category for uncategorized services
INSERT INTO catalog.service_categories (id, name, description, is_default)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Uncategorized',
  'Default category for services without specific categorization',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Update NULL category_id values to use default category
-- Rationale: Must eliminate all NULL values before adding NOT NULL constraint
UPDATE catalog.services
SET category_id = '00000000-0000-0000-0000-000000000001'
WHERE category_id IS NULL;

-- Step 3: Add NOT NULL constraint
-- Rationale: All services must be categorized for proper organization
ALTER TABLE catalog.services
ALTER COLUMN category_id SET NOT NULL;

-- Step 4: Verify changes
-- Rationale: Ensure constraint was applied and no NULL values remain
DO $$
DECLARE
  null_count INTEGER;
  constraint_exists BOOLEAN;
BEGIN
  -- Check for NULL values
  SELECT COUNT(*) INTO null_count
  FROM catalog.services
  WHERE category_id IS NULL;

  IF null_count > 0 THEN
    RAISE EXCEPTION 'Migration verification failed: % services still have NULL category_id', null_count;
  END IF;

  -- Verify NOT NULL constraint exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'catalog'
      AND table_name = 'services'
      AND column_name = 'category_id'
      AND is_nullable = 'NO'
  ) INTO constraint_exists;

  IF NOT constraint_exists THEN
    RAISE EXCEPTION 'Migration verification failed: NOT NULL constraint not applied to category_id';
  END IF;

  RAISE NOTICE 'Migration successful: category_id is now NOT NULL with 0 NULL values';
END $$;

COMMIT;

-- ============================================================================
-- MIGRATION END
-- ============================================================================

-- Rollback Instructions:
-- To rollback this migration:
-- ALTER TABLE catalog.services ALTER COLUMN category_id DROP NOT NULL;
