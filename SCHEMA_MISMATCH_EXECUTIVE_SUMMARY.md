# Database Schema Analysis - Executive Summary

**Date:** 2025-10-20
**Analysis Tool:** Comprehensive Schema Mismatch Analyzer
**Database:** Supabase (Project: nwmcpfioxerzodvbjigw)

---

## Overview

This analysis scanned **2,130 TypeScript files** in the ENORAE codebase and compared them against the actual database schema containing **77 public views** and **666 RPC functions**.

### Critical Findings

- **342 Total Issues Found**
- **180 Critical Issues** (will cause runtime errors)
- **58 High Severity Issues** (may cause runtime errors)
- **104 Medium Severity Issues** (should be fixed)
- **135 Files** contain schema mismatches

---

## Issue Breakdown

### By Type

| Issue Type | Count | Description |
|------------|-------|-------------|
| Missing Views | 180 | Code references views that don't exist |
| Missing Filter Columns | 104 | `.eq()`, `.gt()`, etc. on non-existent columns |
| Missing Columns | 48 | `.select()` includes columns that don't exist |
| Missing RPC Functions | 10 | `.rpc()` calls to non-existent functions |

### By Severity

| Severity | Count | Impact |
|----------|-------|--------|
| Critical | 180 | **Immediate runtime errors** - application will crash |
| High | 58 | **Potential runtime errors** - incorrect data or failures |
| Medium | 104 | **Query failures** - filters/conditions won't work |

---

## Top 10 Most Critical Issues

### 1. Missing View: `salon_reviews` (42 references)
**Impact:** All review functionality broken
**Correct View:** `salon_reviews_view`

**Files Affected:**
- `features/customer/reviews/api/mutations.ts`
- `features/customer/reviews/api/helpful-mutations.ts`
- `features/business/reviews/api/mutations.ts`
- `features/admin/moderation/api/queries.ts`

**Fix:** Replace all `.from('salon_reviews_view')` with `.from('salon_reviews_view')`

---

### 2. Missing View: `audit_logs` (33 references)
**Impact:** All audit logging broken
**Status:** View does not exist in public schema

**Files Affected:**
- `features/admin/security/api/monitoring.ts`
- `features/admin/chains/api/mutations.ts`
- `features/admin/users/api/mutations/status.ts`

**Fix:** Need to create `audit_logs` view or query from correct schema

---

### 3. Missing View: `salon_chains` (27 references)
**Impact:** Chain management completely broken
**Correct View:** `salon_chains_view`

**Files Affected:**
- `features/admin/chains/api/mutations.ts` (10 issues)
- `features/business/chains/api/queries.ts`
- `features/business/chains/api/mutations.ts`
- `features/customer/chains/api/queries.ts`

**Fix:** Replace all `.from('salon_chains_view')` with `.from('salon_chains_view')`

---

### 4. Missing View: `time_off_requests` (18 references)
**Impact:** Time-off request system broken
**Correct View:** `time_off_requests_view`

**Files Affected:**
- `features/staff/time-off/api/mutations.ts` (7 issues)
- `features/staff/time-off/api/internal/manager-actions.ts` (4 issues)

**Fix:** Replace all `.from('time_off_requests_view')` with `.from('time_off_requests_view')`

---

### 5. Missing Column: `salons.status` (17 references)
**Impact:** Cannot filter salons by status
**Actual Columns:** `is_active`, `is_accepting_bookings`, `is_featured`, `is_verified`

**Files Affected:**
- `features/marketing/salon-directory/api/queries.ts` (8 issues)

**Fix:** Use `is_active` instead of `status`, or combine multiple boolean flags

---

### 6. Missing Column: `salons.owner_id` (13 references)
**Impact:** Cannot query salons by owner
**Note:** This column doesn't exist in the `salons` view

**Files Affected:**
- `features/business/chains/api/queries.ts`
- `features/business/chains/api/mutations.ts`
- `features/business/chains/api/internal/settings.ts`

**Fix:** Need to determine correct way to query salon ownership (possibly through RLS or different view)

---

### 7. Missing View: `service_pricing` (9 references)
**Impact:** Service pricing management broken
**Correct View:** `service_pricing_view`

**Files Affected:**
- `features/business/services/api/mutations/update-service.mutation.ts`

**Fix:** Replace `.from('service_pricing_view')` with `.from('service_pricing_view')`

---

### 8. Missing Column: `salons.chain_id` (9 references)
**Impact:** Cannot query salons by chain
**Note:** This column doesn't exist in the `salons` view

**Files Affected:**
- `features/business/chains/api/queries.ts`
- `features/customer/chains/api/queries.ts`
- `features/business/chains/api/mutations.ts`

**Fix:** Join with `salon_chains_view` or use different approach

---

### 9. Missing Column: `staff_schedules.work_date` (9 references)
**Impact:** Cannot filter schedules by date
**Actual Columns:** `day_of_week`, `effective_from`, `effective_until`, `start_time`, `end_time`

**Files Affected:**
- `features/staff/schedule/api/queries.ts`
- `features/staff/schedule/api/internal/staff-schedules.query.ts`

**Fix:** Use `day_of_week` and date range filters instead of `work_date`

---

### 10. Missing View: `webhook_queue` (6 references)
**Impact:** Webhook system broken
**Correct View:** `communication_webhook_queue`

**Files Affected:**
- `features/business/webhooks/api/mutations.ts`

**Fix:** Replace `.from('communication_webhook_queue')` with `.from('communication_webhook_queue')`

---

## Complete Missing Views List

Views referenced in code but not in database:

| View Name | References | Correct Name (if exists) |
|-----------|------------|-------------------------|
| `salon_reviews` | 42 | `salon_reviews_view` ✓ |
| `audit_logs` | 33 | ❌ Not in public schema |
| `salon_chains` | 27 | `salon_chains_view` ✓ |
| `time_off_requests` | 18 | `time_off_requests_view` ✓ |
| `service_pricing` | 9 | `service_pricing_view` ✓ |
| `service_booking_rules` | 6 | `service_booking_rules_view` ✓ |
| `webhook_queue` | 6 | `communication_webhook_queue` ✓ |
| `coupons` | 5 | ❌ Not in public schema |
| `pricing_rules` | 4 | ❌ Not in public schema |
| `referrals` | 4 | ❌ Not in public schema |
| `service_categories` | 3 | `service_categories_view` ✓ |
| `staff_services_with_metrics` | 3 | ❌ Not in public schema |
| `review_helpful_votes` | 3 | ❌ Not in public schema |
| `catalog_coupon_usage` | 2 | ❌ Not in public schema |
| `loyalty_transactions` | 2 | ❌ Not in public schema |
| `avatars` | 2 | ❌ Not in public schema |

---

## Top 20 Most Problematic Columns

Columns referenced in code but not in views:

| Column Reference | Count | Issue |
|------------------|-------|-------|
| `salons.status` | 17 | Use `is_active` instead |
| `salons.owner_id` | 13 | Not in view |
| `salons.chain_id` | 9 | Not in view |
| `staff_schedules.work_date` | 9 | Use `day_of_week` |
| `salon_chains_view.owner_id` | 8 | Not in view |
| `service_product_usage.salon_id` | 7 | Not in view |
| `product_usage.salon_id` | 7 | Not in view |
| `sessions.is_current` | 6 | Use `is_active` |
| `stock_alerts.salon_id` | 6 | Not in view |
| `communication_webhook_queue.salon_id` | 5 | Not in view |
| `product_usage.used_at` | 5 | Not in view |
| `profiles.user_id` | 4 | Use `id` |
| `staff.is_active` | 3 | Use `status` |
| `stock_levels.salon_id` | 3 | Not in view |
| `salons.rating` | 2 | Use `rating_average` |
| `salons.review_count` | 2 | Use `rating_count` |
| `appointments.total_amount` | 2 | Use `total_price` |
| `manual_transactions.amount` | 1 | Not in view |
| `sessions.is_current` | 1 | Use `is_active` |

---

## Files Requiring Immediate Attention

### Priority 1: Critical Runtime Errors (180 issues)

**Top 10 Files:**

1. **`features/admin/chains/api/mutations.ts`** (10 critical)
   - All `salon_chains` references
   - All `audit_logs` references

2. **`features/business/reviews/api/mutations.ts`** (10 critical)
   - All `salon_reviews` references

3. **`features/customer/reviews/api/helpful-mutations.ts`** (7 critical)
   - `review_helpful_votes` references
   - `salon_reviews` references

4. **`features/staff/time-off/api/mutations.ts`** (7 critical)
   - All `time_off_requests` references

5. **`features/admin/security/api/monitoring.ts`** (7 critical)
   - All `audit_logs` references

6. **`features/admin/moderation/api/queries.ts`** (6 critical)
   - `salon_reviews` references

7. **`features/business/webhooks/api/mutations.ts`** (6 critical)
   - All `webhook_queue` references

8. **`features/business/coupons/api/coupons.mutations.ts`** (6 critical)
   - All `coupons` and `coupon_usage` references

9. **`features/customer/reviews/api/mutations.ts`** (5 critical)
   - `salon_reviews` references

10. **`features/staff/time-off/api/internal/manager-actions.ts`** (4 critical)
    - `time_off_requests` references

---

## Actual Database Schema

### Total: 77 Public Views

**Core Business Views:**
- `appointments` (21 columns)
- `salons` (25 columns)
- `services` (26 columns)
- `staff` (20 columns)
- `profiles` (24 columns)

**Supporting Views:**
- `blocked_times` (21 columns)
- `operating_hours` (16 columns)
- `products` (20 columns)
- `messages` (20 columns)
- `appointment_services` (25 columns)
- `customer_favorites` (21 columns)

**Admin Views:**
- `admin_analytics_overview`
- `admin_appointments_overview`
- `admin_inventory_overview`
- `admin_messages_overview`
- `admin_revenue_overview`
- `admin_reviews_overview`
- `admin_salons_overview`
- `admin_staff_overview`
- `admin_users_overview`

**Full list in:** `COMPREHENSIVE_SCHEMA_ANALYSIS.md`

---

## Recommended Action Plan

### Phase 1: Fix Critical Issues (1-2 days)

**Simple Find & Replace:**

1. **`salon_reviews` → `salon_reviews_view`** (42 files)
   ```bash
   rg "\.from\('salon_reviews'\)" -l | xargs sed -i '' "s/\.from('salon_reviews_view')/\.from('salon_reviews_view')/g"
   ```

2. **`salon_chains` → `salon_chains_view`** (27 files)
   ```bash
   rg "\.from\('salon_chains'\)" -l | xargs sed -i '' "s/\.from('salon_chains_view')/\.from('salon_chains_view')/g"
   ```

3. **`time_off_requests` → `time_off_requests_view`** (18 files)
   ```bash
   rg "\.from\('time_off_requests'\)" -l | xargs sed -i '' "s/\.from('time_off_requests_view')/\.from('time_off_requests_view')/g"
   ```

4. **`service_pricing` → `service_pricing_view`** (9 files)
5. **`service_booking_rules` → `service_booking_rules_view`** (6 files)
6. **`webhook_queue` → `communication_webhook_queue`** (6 files)
7. **`service_categories` → `service_categories_view`** (3 files)

**Manual Fixes Required:**

- **`audit_logs`** (33 references) - Determine correct schema/view
- **`coupons`** (5 references) - Create view or query correct schema
- **`pricing_rules`** (4 references) - Create view or query correct schema
- **`referrals`** (4 references) - Create view or query correct schema

### Phase 2: Fix High Severity Issues (2-3 days)

- Fix 58 missing column issues
- Update column references to match actual schema
- Examples:
  - `amount` → `total_price` in transactions
  - `is_current` → `is_active` in sessions
  - `status` → `is_active` in salons

### Phase 3: Fix Medium Severity Issues (1-2 days)

- Fix 104 filter column issues
- Update `.eq()`, `.gt()`, etc. calls
- Examples:
  - `salons.status` → `salons.is_active`
  - `staff_schedules.work_date` → proper date filters

### Phase 4: Prevent Future Issues (ongoing)

1. **Add TypeScript strict typing**
   - Use `Database['public']['Views']['view_name']['Row']`
   - Enable `--strict` mode

2. **Add schema validation tests**
   - Test that all views exist
   - Test that all columns exist

3. **Update documentation**
   - Document correct view names
   - Update stack patterns

---

## Tools Created

This analysis generated the following tools:

1. **`scripts/parse-schema.py`** - Parses database.types.ts into JSON
2. **`scripts/comprehensive-schema-analysis.py`** - Analyzes codebase for mismatches
3. **`schema-parsed.json`** - Complete schema in JSON format
4. **`schema-issues.json`** - All issues in JSON format for programmatic access
5. **`COMPREHENSIVE_SCHEMA_ANALYSIS.md`** - Full detailed report

### Re-running Analysis

To re-run after fixes:

```bash
# Regenerate types from database
npm run db:types

# Re-parse schema
python3 scripts/parse-schema.py

# Re-analyze codebase
python3 scripts/comprehensive-schema-analysis.py
```

---

## Key Insights

### Pattern 1: View Name Mismatches
**Problem:** Code uses base table names instead of view names
**Example:** `.from('salon_reviews_view')` instead of `.from('salon_reviews_view')`
**Impact:** 180+ critical errors
**Fix:** Append `_view` to table names in most cases

### Pattern 2: Missing Columns
**Problem:** Code assumes columns that don't exist in views
**Example:** `salons.status`, `salons.owner_id`, `salons.chain_id`
**Impact:** Filters and selections fail
**Fix:** Use correct column names from actual schema

### Pattern 3: Renamed Columns
**Problem:** Column names have changed or are aliased
**Example:** `amount` → `total_price`, `rating` → `rating_average`
**Impact:** Data access fails
**Fix:** Update to match actual column names

### Pattern 4: Missing Views
**Problem:** Views don't exist in public schema
**Example:** `audit_logs`, `coupons`, `pricing_rules`
**Impact:** Complete feature failure
**Fix:** Create views or determine correct schema access

---

## Next Steps

1. ✅ **Review this summary**
2. 🔲 **Run Phase 1 find & replace operations**
3. 🔲 **Test critical features (reviews, chains, time-off)**
4. 🔲 **Fix manual issues (audit_logs, coupons, etc.)**
5. 🔲 **Run Phase 2 column fixes**
6. 🔲 **Run Phase 3 filter fixes**
7. 🔲 **Re-run analysis to verify**
8. 🔲 **Add TypeScript strict typing**
9. 🔲 **Add schema validation tests**

---

## Contact

For questions about this analysis:
- Full report: `COMPREHENSIVE_SCHEMA_ANALYSIS.md`
- Issues JSON: `schema-issues.json`
- Schema JSON: `schema-parsed.json`

**Generated:** 2025-10-20
**Analysis Duration:** ~3 minutes
**Files Scanned:** 2,130
**Issues Found:** 342
