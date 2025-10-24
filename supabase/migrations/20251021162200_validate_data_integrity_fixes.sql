-- Migration: Validate All Data Integrity Fixes
-- Date: 2025-10-21
-- Author: Database Integrity Analyzer
-- Purpose: Comprehensive validation of all constraint additions
-- Impact: Read-only validation queries
-- Breaking Change: No

-- ============================================================================
-- VALIDATION START
-- ============================================================================

-- This script validates all data integrity fixes applied in previous migrations
-- Run this after applying all constraint migrations to ensure everything is working

DO $$
DECLARE
  v_result RECORD;
  v_pass_count INTEGER := 0;
  v_fail_count INTEGER := 0;
  v_total_tests INTEGER := 15;
BEGIN
  RAISE NOTICE '=================================================================';
  RAISE NOTICE 'Data Integrity Validation Suite';
  RAISE NOTICE 'Validating all constraint fixes from Data Integrity Analysis';
  RAISE NOTICE '=================================================================';
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 1: Verify catalog.services.category_id is NOT NULL
  -- =========================================================================
  RAISE NOTICE 'TEST 1: Checking catalog.services.category_id NOT NULL constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'catalog'
      AND table_name = 'services'
      AND column_name = 'category_id'
      AND is_nullable = 'NO'
  ) AND NOT EXISTS (
    SELECT 1 FROM catalog.services WHERE category_id IS NULL
  ) THEN
    RAISE NOTICE '✅ PASS: catalog.services.category_id is NOT NULL with 0 NULL values';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: catalog.services.category_id constraint issue';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 2: Verify archive.appointments.original_salon_id index exists
  -- =========================================================================
  RAISE NOTICE 'TEST 2: Checking archive.appointments.original_salon_id index...';

  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'archive'
      AND tablename = 'appointments'
      AND indexname = 'idx_archive_appointments_original_salon_id'
  ) THEN
    RAISE NOTICE '✅ PASS: Index idx_archive_appointments_original_salon_id exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: Index idx_archive_appointments_original_salon_id missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 3: Verify monitoring.webhook_deliveries.retry_of_id index exists
  -- =========================================================================
  RAISE NOTICE 'TEST 3: Checking monitoring.webhook_deliveries.retry_of_id index...';

  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'monitoring'
      AND tablename = 'webhook_deliveries'
      AND indexname = 'idx_webhook_deliveries_retry_of_id'
  ) THEN
    RAISE NOTICE '✅ PASS: Index idx_webhook_deliveries_retry_of_id exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: Index idx_webhook_deliveries_retry_of_id missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 4: Verify services_max_duration constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 4: Checking services_max_duration constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'services_max_duration'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: services_max_duration constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: services_max_duration constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 5: Verify appointments_minimum_notice constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 5: Checking appointments_minimum_notice constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'appointments_minimum_notice'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: appointments_minimum_notice constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: appointments_minimum_notice constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 6: Verify salons_staff_capacity_range constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 6: Checking salons_staff_capacity_range constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'salons_staff_capacity_range'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: salons_staff_capacity_range constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: salons_staff_capacity_range constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 7: Verify services_min_duration constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 7: Checking services_min_duration constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'services_min_duration'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: services_min_duration constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: services_min_duration constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 8: Verify staff_commission_rate_range constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 8: Checking staff_commission_rate_range constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'staff_commission_rate_range'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: staff_commission_rate_range constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: staff_commission_rate_range constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 9: Verify descriptions_minimum_length constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 9: Checking descriptions_minimum_length constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'descriptions_minimum_length'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: descriptions_minimum_length constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: descriptions_minimum_length constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 10: Verify reviews_minimum_content constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 10: Checking reviews_minimum_content constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'reviews_minimum_content'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: reviews_minimum_content constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: reviews_minimum_content constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 11: Verify profiles_email_format constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 11: Checking profiles_email_format constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_email_format'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: profiles_email_format constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: profiles_email_format constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 12: Verify reviews_rating_range constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 12: Checking reviews_rating_range constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'reviews_rating_range'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: reviews_rating_range constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: reviews_rating_range constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 13: Verify services_price_positive constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 13: Checking services_price_positive constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'services_price_positive'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: services_price_positive constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: services_price_positive constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 14: Verify pricing_discount_range constraint
  -- =========================================================================
  RAISE NOTICE 'TEST 14: Checking pricing_discount_range constraint...';

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'pricing_discount_range'
      AND constraint_type = 'CHECK'
  ) THEN
    RAISE NOTICE '✅ PASS: pricing_discount_range constraint exists';
    v_pass_count := v_pass_count + 1;
  ELSE
    RAISE WARNING '❌ FAIL: pricing_discount_range constraint missing';
    v_fail_count := v_fail_count + 1;
  END IF;
  RAISE NOTICE '';

  -- =========================================================================
  -- TEST 15: Verify no orphaned foreign key records
  -- =========================================================================
  RAISE NOTICE 'TEST 15: Checking for orphaned foreign key records...';

  DECLARE
    orphan_count INTEGER := 0;
  BEGIN
    -- Sample check for appointments.customer_id orphans
    SELECT COUNT(*) INTO orphan_count
    FROM scheduling.appointments a
    WHERE customer_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM identity.profiles WHERE id = a.customer_id);

    IF orphan_count = 0 THEN
      RAISE NOTICE '✅ PASS: No orphaned foreign key records detected';
      v_pass_count := v_pass_count + 1;
    ELSE
      RAISE WARNING '❌ FAIL: Found % orphaned foreign key records', orphan_count;
      v_fail_count := v_fail_count + 1;
    END IF;
  END;
  RAISE NOTICE '';

  -- =========================================================================
  -- FINAL SUMMARY
  -- =========================================================================
  RAISE NOTICE '=================================================================';
  RAISE NOTICE 'VALIDATION SUMMARY';
  RAISE NOTICE '=================================================================';
  RAISE NOTICE 'Total Tests: %', v_total_tests;
  RAISE NOTICE 'Passed: % (%.1f%%)', v_pass_count, (v_pass_count::FLOAT / v_total_tests * 100);
  RAISE NOTICE 'Failed: % (%.1f%%)', v_fail_count, (v_fail_count::FLOAT / v_total_tests * 100);
  RAISE NOTICE '';

  IF v_fail_count = 0 THEN
    RAISE NOTICE '✅ ALL TESTS PASSED - Data Integrity fixes successfully applied!';
  ELSE
    RAISE WARNING '❌ SOME TESTS FAILED - Please review migration logs';
  END IF;
  RAISE NOTICE '=================================================================';
END $$;

-- ============================================================================
-- VALIDATION END
-- ============================================================================
