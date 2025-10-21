====================================================================================================
COMPREHENSIVE DATABASE SCHEMA ANALYSIS REPORT
====================================================================================================

## EXECUTIVE SUMMARY

📊 Total Public Views: 77
⚙️  Total RPC Functions: 666
❌ Total Issues Found: 342

### Issues by Severity:
  - CRITICAL: 180
  - HIGH: 58
  - MEDIUM: 104

### Issues by Type:
  - missing_view: 180
  - missing_filter_column: 104
  - missing_column: 48
  - missing_rpc_function: 10

====================================================================================================
## TOP 20 CRITICAL ISSUES
====================================================================================================

1. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:36
   Issue: View 'salon_reviews' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

2. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:70
   Issue: View 'salon_reviews' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

3. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:109
   Issue: View 'salon_reviews' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

4. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:144
   Issue: View 'salon_reviews' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

5. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:162
   Issue: View 'salon_reviews' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

6. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:24
   Issue: View 'review_helpful_votes' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

7. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:37
   Issue: View 'review_helpful_votes' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

8. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:53
   Issue: View 'salon_reviews' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

9. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:64
   Issue: View 'salon_reviews' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

10. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:91
   Issue: View 'review_helpful_votes' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

11. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:100
   Issue: View 'salon_reviews' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

12. [CRITICAL] MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:112
   Issue: View 'salon_reviews' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

13. [HIGH] MISSING_COLUMN
   File: features/customer/analytics/api/queries.ts:39
   Issue: Column 'amount' does not exist in view 'manual_transactions'
   Fix: Available columns: appointment_id, created_at, created_by_id, customer_id, id, payment_method, salon_id, staff_id, transaction_at, transaction_type...

14. [CRITICAL] MISSING_VIEW
   File: features/customer/chains/api/queries.ts:30
   Issue: View 'salon_chains' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

15. [CRITICAL] MISSING_VIEW
   File: features/customer/chains/api/queries.ts:56
   Issue: View 'salon_chains' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

16. [HIGH] MISSING_COLUMN
   File: features/customer/sessions/api/mutations.ts:31
   Issue: Column 'is_current' does not exist in view 'sessions'
   Fix: Available columns: created_at, created_by_id, deleted_at, deleted_by_id, id, is_active, is_suspicious, refresh_token, session_token, updated_at...

17. [CRITICAL] MISSING_VIEW
   File: features/customer/loyalty/api/queries.ts:28
   Issue: View 'loyalty_points' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

18. [CRITICAL] MISSING_VIEW
   File: features/customer/loyalty/api/queries.ts:45
   Issue: View 'loyalty_transactions' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

19. [HIGH] MISSING_RPC_FUNCTION
   File: features/customer/loyalty/api/queries.ts:72
   Issue: RPC function 'calculate_loyalty_value' does not exist
   Fix: Check function name spelling or verify it exists in database

20. [CRITICAL] MISSING_VIEW
   File: features/customer/loyalty/api/mutations.ts:13
   Issue: View 'loyalty_transactions' does not exist in public schema
   Fix: Check if view name is correct. Available views: admin_analytics_overview, admin_appointments_overview, admin_inventory_overview, admin_messages_overview, admin_revenue_overview...

====================================================================================================
## TOP 30 FILES NEEDING FIXES
====================================================================================================

1. features/admin/chains/api/mutations.ts
   Total: 10 issues (Critical: 10, High: 0, Medium: 0)
   - Line 28: View 'audit_logs' does not exist in public schema
   - Line 69: View 'salon_chains' does not exist in public schema
   - Line 80: View 'salon_chains' does not exist in public schema
   - Line 132: View 'salon_chains' does not exist in public schema
   - Line 143: View 'salon_chains' does not exist in public schema
   ... and 5 more issues

2. features/business/reviews/api/mutations.ts
   Total: 10 issues (Critical: 10, High: 0, Medium: 0)
   - Line 26: View 'salon_reviews' does not exist in public schema
   - Line 38: View 'salon_reviews' does not exist in public schema
   - Line 75: View 'salon_reviews' does not exist in public schema
   - Line 87: View 'salon_reviews' does not exist in public schema
   - Line 123: View 'salon_reviews' does not exist in public schema
   ... and 5 more issues

3. features/business/chains/api/queries.ts
   Total: 10 issues (Critical: 0, High: 4, Medium: 6)
   - Line 134: Column 'total_amount' does not exist in view 'appointments'
   - Line 144: Column 'rating' does not exist in view 'salons'
   - Line 144: Column 'review_count' does not exist in view 'salons'
   - Line 144: Column 'services_count' does not exist in view 'salons'
   - Line 24: Filter column 'owner_id' does not exist in view 'salon_chains_view'
   ... and 5 more issues

4. features/business/chains/api/mutations.ts
   Total: 9 issues (Critical: 3, High: 1, Medium: 5)
   - Line 78: View 'salon_chains' does not exist in public schema
   - Line 119: View 'salon_chains' does not exist in public schema
   - Line 162: View 'salon_chains' does not exist in public schema
   - Line 285: Column 'owner_id' does not exist in view 'salons'
   - Line 153: Filter column 'chain_id' does not exist in view 'salons'
   ... and 4 more issues

5. features/marketing/salon-directory/api/queries.ts
   Total: 8 issues (Critical: 0, High: 0, Medium: 8)
   - Line 43: Filter column 'status' does not exist in view 'salons'
   - Line 57: Filter column 'status' does not exist in view 'salons'
   - Line 81: Filter column 'status' does not exist in view 'salons'
   - Line 98: Filter column 'status' does not exist in view 'salons'
   - Line 141: Filter column 'status' does not exist in view 'salons'
   ... and 3 more issues

6. features/customer/reviews/api/helpful-mutations.ts
   Total: 7 issues (Critical: 7, High: 0, Medium: 0)
   - Line 24: View 'review_helpful_votes' does not exist in public schema
   - Line 37: View 'review_helpful_votes' does not exist in public schema
   - Line 53: View 'salon_reviews' does not exist in public schema
   - Line 64: View 'salon_reviews' does not exist in public schema
   - Line 91: View 'review_helpful_votes' does not exist in public schema
   ... and 2 more issues

7. features/staff/time-off/api/mutations.ts
   Total: 7 issues (Critical: 7, High: 0, Medium: 0)
   - Line 72: View 'time_off_requests' does not exist in public schema
   - Line 105: View 'time_off_requests' does not exist in public schema
   - Line 125: View 'time_off_requests' does not exist in public schema
   - Line 161: View 'time_off_requests' does not exist in public schema
   - Line 182: View 'time_off_requests' does not exist in public schema
   ... and 2 more issues

8. features/admin/security/api/monitoring.ts
   Total: 7 issues (Critical: 7, High: 0, Medium: 0)
   - Line 26: View 'audit_logs' does not exist in public schema
   - Line 72: View 'audit_logs' does not exist in public schema
   - Line 95: View 'audit_logs' does not exist in public schema
   - Line 139: View 'audit_logs' does not exist in public schema
   - Line 199: View 'audit_logs' does not exist in public schema
   ... and 2 more issues

9. features/staff/schedule/api/queries.ts
   Total: 6 issues (Critical: 0, High: 0, Medium: 6)
   - Line 115: Filter column 'work_date' does not exist in view 'staff_schedules'
   - Line 140: Filter column 'owner_id' does not exist in view 'salons'
   - Line 33: Filter column 'work_date' does not exist in view 'staff_schedules'
   - Line 63: Filter column 'work_date' does not exist in view 'staff_schedules'
   - Line 37: Filter column 'work_date' does not exist in view 'staff_schedules'
   ... and 1 more issues

10. features/admin/moderation/api/queries.ts
   Total: 6 issues (Critical: 6, High: 0, Medium: 0)
   - Line 265: View 'salon_reviews' does not exist in public schema
   - Line 378: View 'salon_reviews' does not exist in public schema
   - Line 383: View 'salon_reviews' does not exist in public schema
   - Line 389: View 'salon_reviews' does not exist in public schema
   - Line 395: View 'salon_reviews' does not exist in public schema
   ... and 1 more issues

11. features/business/webhooks/api/mutations.ts
   Total: 6 issues (Critical: 6, High: 0, Medium: 0)
   - Line 29: View 'webhook_queue' does not exist in public schema
   - Line 46: View 'webhook_queue' does not exist in public schema
   - Line 85: View 'webhook_queue' does not exist in public schema
   - Line 97: View 'webhook_queue' does not exist in public schema
   - Line 128: View 'webhook_queue' does not exist in public schema
   ... and 1 more issues

12. features/business/inventory-usage/api/usage-analytics.ts
   Total: 6 issues (Critical: 0, High: 1, Medium: 5)
   - Line 80: Column 'used_at' does not exist in view 'product_usage'
   - Line 16: Filter column 'salon_id' does not exist in view 'product_usage'
   - Line 81: Filter column 'salon_id' does not exist in view 'product_usage'
   - Line 19: Filter column 'used_at' does not exist in view 'product_usage'
   - Line 82: Filter column 'used_at' does not exist in view 'product_usage'
   ... and 1 more issues

13. features/business/coupons/api/coupons.mutations.ts
   Total: 6 issues (Critical: 6, High: 0, Medium: 0)
   - Line 46: View 'coupons' does not exist in public schema
   - Line 65: View 'coupons' does not exist in public schema
   - Line 86: View 'coupons' does not exist in public schema
   - Line 106: View 'coupons' does not exist in public schema
   - Line 128: View 'coupon_usage' does not exist in public schema
   ... and 1 more issues

14. features/customer/reviews/api/mutations.ts
   Total: 5 issues (Critical: 5, High: 0, Medium: 0)
   - Line 36: View 'salon_reviews' does not exist in public schema
   - Line 70: View 'salon_reviews' does not exist in public schema
   - Line 109: View 'salon_reviews' does not exist in public schema
   - Line 144: View 'salon_reviews' does not exist in public schema
   - Line 162: View 'salon_reviews' does not exist in public schema

15. features/business/webhooks/api/queries/monitoring.ts
   Total: 5 issues (Critical: 0, High: 1, Medium: 4)
   - Line 35: Column 'delivery_time_ms' does not exist in view 'communication_webhook_queue'
   - Line 36: Filter column 'salon_id' does not exist in view 'communication_webhook_queue'
   - Line 73: Filter column 'webhook_config_id' does not exist in view 'communication_webhook_queue'
   - Line 74: Filter column 'salon_id' does not exist in view 'communication_webhook_queue'
   - Line 103: Filter column 'salon_id' does not exist in view 'communication_webhook_queue'

16. features/business/chains/api/internal/settings.ts
   Total: 5 issues (Critical: 0, High: 1, Medium: 4)
   - Line 103: Column 'owner_id' does not exist in view 'salons'
   - Line 37: Filter column 'owner_id' does not exist in view 'salon_chains_view'
   - Line 61: Filter column 'chain_id' does not exist in view 'salons'
   - Line 105: Filter column 'owner_id' does not exist in view 'salons'
   - Line 115: Filter column 'owner_id' does not exist in view 'salon_chains_view'

17. features/business/inventory-usage/api/usage-insights.ts
   Total: 5 issues (Critical: 0, High: 1, Medium: 4)
   - Line 68: Column 'unit' does not exist in view 'products'
   - Line 18: Filter column 'salon_id' does not exist in view 'product_usage'
   - Line 47: Filter column 'salon_id' does not exist in view 'product_usage'
   - Line 73: Filter column 'salon_id' does not exist in view 'stock_levels'
   - Line 48: Filter column 'used_at' does not exist in view 'product_usage'

18. features/business/locations/api/bulk-address.mutations.ts
   Total: 5 issues (Critical: 0, High: 5, Medium: 0)
   - Line 50: Column 'street_address' does not exist in view 'salon_locations'
   - Line 50: Column 'city' does not exist in view 'salon_locations'
   - Line 50: Column 'state_province' does not exist in view 'salon_locations'
   - Line 50: Column 'postal_code' does not exist in view 'salon_locations'
   - Line 50: Column 'country_code' does not exist in view 'salon_locations'

19. features/customer/chains/api/queries.ts
   Total: 4 issues (Critical: 2, High: 0, Medium: 2)
   - Line 30: View 'salon_chains' does not exist in public schema
   - Line 56: View 'salon_chains' does not exist in public schema
   - Line 74: Filter column 'chain_id' does not exist in view 'salons'
   - Line 99: Filter column 'chain_id' does not exist in view 'salons'

20. features/customer/favorites/api/queries.ts
   Total: 4 issues (Critical: 0, High: 4, Medium: 0)
   - Line 39: Column 'rating' does not exist in view 'salons'
   - Line 39: Column 'review_count' does not exist in view 'salons'
   - Line 39: Column 'full_address' does not exist in view 'salons'
   - Line 39: Column 'logo_url' does not exist in view 'salons'

21. features/staff/time-off/api/internal/manager-actions.ts
   Total: 4 issues (Critical: 4, High: 0, Medium: 0)
   - Line 27: View 'time_off_requests' does not exist in public schema
   - Line 39: View 'time_off_requests' does not exist in public schema
   - Line 78: View 'time_off_requests' does not exist in public schema
   - Line 90: View 'time_off_requests' does not exist in public schema

22. features/staff/schedule/api/internal/staff-schedules.query.ts
   Total: 4 issues (Critical: 0, High: 0, Medium: 4)
   - Line 29: Filter column 'work_date' does not exist in view 'staff_schedules'
   - Line 59: Filter column 'work_date' does not exist in view 'staff_schedules'
   - Line 33: Filter column 'work_date' does not exist in view 'staff_schedules'
   - Line 63: Filter column 'work_date' does not exist in view 'staff_schedules'

23. features/admin/chains/api/internal/verification.ts
   Total: 4 issues (Critical: 4, High: 0, Medium: 0)
   - Line 33: View 'salon_chains' does not exist in public schema
   - Line 44: View 'salon_chains' does not exist in public schema
   - Line 96: View 'salon_chains' does not exist in public schema
   - Line 107: View 'salon_chains' does not exist in public schema

24. features/admin/users/api/mutations/status.ts
   Total: 4 issues (Critical: 4, High: 0, Medium: 0)
   - Line 61: View 'audit_logs' does not exist in public schema
   - Line 122: View 'audit_logs' does not exist in public schema
   - Line 203: View 'audit_logs' does not exist in public schema
   - Line 305: View 'audit_logs' does not exist in public schema

25. features/business/service-product-usage/api/mutations.ts
   Total: 4 issues (Critical: 0, High: 2, Medium: 2)
   - Line 81: Column 'salon_id' does not exist in view 'service_product_usage'
   - Line 130: Column 'salon_id' does not exist in view 'service_product_usage'
   - Line 104: Filter column 'salon_id' does not exist in view 'service_product_usage'
   - Line 145: Filter column 'salon_id' does not exist in view 'service_product_usage'

26. features/business/services/api/mutations/update-service.mutation.ts
   Total: 4 issues (Critical: 4, High: 0, Medium: 0)
   - Line 87: View 'service_pricing' does not exist in public schema
   - Line 142: View 'service_pricing' does not exist in public schema
   - Line 152: View 'service_booking_rules' does not exist in public schema
   - Line 198: View 'service_booking_rules' does not exist in public schema

27. features/business/pricing/api/pricing-rules.mutations.ts
   Total: 4 issues (Critical: 4, High: 0, Medium: 0)
   - Line 33: View 'pricing_rules' does not exist in public schema
   - Line 100: View 'pricing_rules' does not exist in public schema
   - Line 117: View 'pricing_rules' does not exist in public schema
   - Line 134: View 'pricing_rules' does not exist in public schema

28. features/business/inventory-alerts/api/mutations.ts
   Total: 4 issues (Critical: 0, High: 0, Medium: 4)
   - Line 61: Filter column 'salon_id' does not exist in view 'stock_alerts'
   - Line 84: Filter column 'salon_id' does not exist in view 'stock_alerts'
   - Line 145: Filter column 'salon_id' does not exist in view 'stock_alerts'
   - Line 168: Filter column 'salon_id' does not exist in view 'stock_alerts'

29. features/business/chains/api/internal/crud.ts
   Total: 4 issues (Critical: 3, High: 0, Medium: 1)
   - Line 25: View 'salon_chains' does not exist in public schema
   - Line 65: View 'salon_chains' does not exist in public schema
   - Line 106: View 'salon_chains' does not exist in public schema
   - Line 97: Filter column 'chain_id' does not exist in view 'salons'

30. features/business/staff-schedules/api/queries.ts
   Total: 4 issues (Critical: 0, High: 4, Medium: 0)
   - Line 23: Column 'staff' does not exist in view 'staff_schedules'
   - Line 23: Column 'title' does not exist in view 'staff_schedules'
   - Line 53: Column 'staff' does not exist in view 'staff_schedules'
   - Line 53: Column 'title' does not exist in view 'staff_schedules'

====================================================================================================
## COMPLETE DATABASE SCHEMA
====================================================================================================

Total Views: 77

### KEY VIEWS (with full schema):

#### appointments

  - cancelled_at: string | null
  - completed_at: string | null
  - confirmation_code: string | null
  - created_at: string | null
  - customer_email: string | null
  - customer_id: string | null
  - customer_name: string | null
  - duration_minutes: number | null
  - end_time: string | null
  - id: string | null
  - salon_id: string | null
  - salon_name: string | null
  - service_id: string | null
  - service_name: string | null
  - service_names: string[] | null
  - staff_id: string | null
  - staff_name: string | null
  - start_time: string | null
  - status: string | null
  - total_price: number | null
  - updated_at: string | null

#### salons

  - address: Json | null
  - city: string | null
  - country_code: string | null
  - created_at: string | null
  - formatted_address: string | null
  - full_description: string | null
  - id: string | null
  - is_accepting_bookings: boolean | null
  - is_active: boolean | null
  - is_featured: boolean | null
  - is_verified: boolean | null
  - latitude: number | null
  - longitude: number | null
  - name: string | null
  - postal_code: string | null
  - primary_email: string | null
  - primary_phone: string | null
  - rating_average: number | null
  - rating_count: number | null
  - short_description: string | null
  - slug: string | null
  - state_province: string | null
  - street_address: string | null
  - street_address_2: string | null
  - website_url: string | null

#### services

  - buffer_minutes: number | null
  - category_id: string | null
  - category_name: string | null
  - category_slug: string | null
  - created_at: string | null
  - currency_code: string | null
  - current_price: number | null
  - deleted_at: string | null
  - deleted_by_id: string | null
  - description: string | null
  - discontinued_at: string | null
  - duration_minutes: number | null
  - id: string | null
  - is_active: boolean | null
  - is_bookable: boolean | null
  - is_featured: boolean | null
  - max_advance_booking_days: number | null
  - min_advance_booking_hours: number | null
  - name: string | null
  - price: number | null
  - sale_price: number | null
  - salon_id: string | null
  - slug: string | null
  - status: string | null
  - total_duration_minutes: number | null
  - updated_at: string | null

#### staff

  - avatar_thumbnail_url: string | null
  - avatar_url: string | null
  - bio: string | null
  - business_name: string | null
  - created_at: string | null
  - deleted_at: string | null
  - deleted_by_id: string | null
  - email: string | null
  - experience_years: number | null
  - full_name: string | null
  - id: string | null
  - salon_id: string | null
  - salon_name: string | null
  - salon_slug: string | null
  - services_count: number | null
  - status: string | null
  - title: string | null
  - total_appointments: number | null
  - updated_at: string | null
  - user_id: string | null

#### profiles

  - avatar_thumbnail_url: string | null
  - avatar_url: string | null
  - country_code: string | null
  - cover_image_url: string | null
  - created_at: string | null
  - currency_code: string | null
  - deleted_at: string | null
  - deleted_by_id: string | null
  - email: string | null
  - email_confirmed_at: string | null
  - email_verified: boolean | null
  - full_name: string | null
  - id: string | null
  - interests: string[] | null
  - last_sign_in_at: string | null
  - locale: string | null
  - phone: string | null
  - preferences: Json | null
  - social_profiles: Json | null
  - status: string | null
  - tags: string[] | null
  - timezone: string | null
  - updated_at: string | null
  - username: string | null

#### blocked_times

  - block_type: Database["scheduling"]["Enums"]["block_type_enum"] | null
  - created_at: string | null
  - created_by_id: string | null
  - created_by_name: string | null
  - deleted_at: string | null
  - deleted_by_id: string | null
  - duration_minutes: number | null
  - end_time: string | null
  - id: string | null
  - is_active: boolean | null
  - is_recurring: boolean | null
  - reason: string | null
  - recurrence_pattern: string | null
  - salon_id: string | null
  - salon_name: string | null
  - salon_slug: string | null
  - staff_id: string | null
  - staff_name: string | null
  - staff_title: string | null
  - start_time: string | null
  - updated_at: string | null

#### operating_hours

  - break_end: string | null
  - break_start: string | null
  - close_time: string | null
  - created_at: string | null
  - day_of_week: Database["public"]["Enums"]["day_of_week"] | null
  - deleted_at: string | null
  - effective_from: string | null
  - effective_until: string | null
  - hours_display: string | null
  - id: string | null
  - is_closed: boolean | null
  - open_time: string | null
  - salon_id: string | null
  - salon_name: string | null
  - salon_slug: string | null
  - updated_at: string | null

#### products

  - category_id: string | null
  - cost_price: number | null
  - created_at: string | null
  - created_by_id: string | null
  - deleted_at: string | null
  - deleted_by_id: string | null
  - description: string | null
  - id: string | null
  - is_active: boolean | null
  - is_tracked: boolean | null
  - name: string | null
  - reorder_point: number | null
  - reorder_quantity: number | null
  - retail_price: number | null
  - salon_id: string | null
  - sku: string | null
  - supplier_id: string | null
  - unit_of_measure: string | null
  - updated_at: string | null
  - updated_by_id: string | null

#### messages

  - content: string | null
  - context_id: string | null
  - context_type: string | null
  - created_at: string | null
  - deleted_at: string | null
  - deleted_by_id: string | null
  - edited_at: string | null
  - from_user_email: string | null
  - from_user_id: string | null
  - from_user_name: string | null
  - id: string | null
  - is_deleted: boolean | null
  - is_edited: boolean | null
  - is_read: boolean | null
  - metadata: Json | null
  - read_at: string | null
  - to_user_email: string | null
  - to_user_id: string | null
  - to_user_name: string | null
  - updated_at: string | null

#### appointment_services

  - appointment_id: string | null
  - category_name: string | null
  - confirmation_code: string | null
  - created_at: string | null
  - currency_code: string | null
  - current_price: number | null
  - customer_id: string | null
  - duration_minutes: number | null
  - end_time: string | null
  - id: string | null
  - sale_price: number | null
  - salon_id: string | null
  - salon_name: string | null
  - salon_slug: string | null
  - service_description: string | null
  - service_id: string | null
  - service_name: string | null
  - service_price: number | null
  - service_slug: string | null
  - staff_id: string | null
  - staff_name: string | null
  - staff_title: string | null
  - start_time: string | null
  - status: string | null
  - updated_at: string | null

#### customer_favorites

  - business_name: string | null
  - category_name: string | null
  - created_at: string | null
  - currency_code: string | null
  - customer_email: string | null
  - customer_id: string | null
  - customer_name: string | null
  - id: string | null
  - notes: string | null
  - salon_id: string | null
  - salon_name: string | null
  - salon_slug: string | null
  - service_description: string | null
  - service_id: string | null
  - service_name: string | null
  - service_price: number | null
  - service_slug: string | null
  - staff_avatar: string | null
  - staff_id: string | null
  - staff_name: string | null
  - staff_title: string | null

### ALL PUBLIC VIEWS:

  1. admin_analytics_overview                      (13 columns)
  2. admin_appointments_overview                   (20 columns)
  3. admin_inventory_overview                      (16 columns)
  4. admin_messages_overview                       (18 columns)
  5. admin_revenue_overview                        (14 columns)
  6. admin_reviews_overview                        (19 columns)
  7. admin_salons_overview                         (13 columns)
  8. admin_staff_overview                          (14 columns)
  9. admin_users_overview                          (16 columns)
 10. appointment_services                          (25 columns)
 11. appointments                                  (21 columns)
 12. blocked_times                                 (21 columns)
 13. communication_message_threads                 (15 columns)
 14. communication_messages                        (16 columns)
 15. communication_notification_queue              ( 9 columns)
 16. communication_webhook_queue                   (12 columns)
 17. customer_favorites                            (21 columns)
 18. daily_metrics                                 (23 columns)
 19. hot_update_stats                              ( 6 columns)
 20. location_addresses                            (19 columns)
 21. low_priority_optimizations_summary            ( 3 columns)
 22. manual_transactions                           (11 columns)
 23. message_threads                               (23 columns)
 24. messages                                      (20 columns)
 25. most_called_queries                           ( 7 columns)
 26. operating_hours                               (16 columns)
 27. operational_metrics                           (14 columns)
 28. product_categories                            (11 columns)
 29. product_usage                                 (10 columns)
 30. products                                      (20 columns)
 31. profiles                                      (24 columns)
 32. profiles_metadata                             (11 columns)
 33. profiles_preferences                          ( 9 columns)
 34. public_tables_without_rls                     ( 3 columns)
 35. purchase_order_items                          ( 9 columns)
 36. purchase_orders                               (17 columns)
 37. query_performance_summary                     ( 8 columns)
 38. salon_chains_view                             (15 columns)
 39. salon_contact_details                         (18 columns)
 40. salon_descriptions                            (12 columns)
 41. salon_locations                               (12 columns)
 42. salon_media                                   ( 8 columns)
 43. salon_media_view                              (12 columns)
 44. salon_metrics                                 ( 8 columns)
 45. salon_reviews_view                            (14 columns)
 46. salon_settings                                (12 columns)
 47. salons                                        (25 columns)
 48. security_access_monitoring                    ( 9 columns)
 49. security_incident_logs                        (19 columns)
 50. security_rate_limit_rules                     (17 columns)
 51. security_rate_limit_tracking                  (12 columns)
 52. security_session_security                     ( 9 columns)
 53. service_booking_rules_view                    (15 columns)
 54. service_categories_view                       (17 columns)
 55. service_performance                           ( 9 columns)
 56. service_pricing_view                          (20 columns)
 57. service_product_usage                         ( 7 columns)
 58. services                                      (26 columns)
 59. sessions                                      (12 columns)
 60. slow_queries                                  (10 columns)
 61. staff                                         (20 columns)
 62. staff_profiles                                (12 columns)
 63. staff_schedules                               (13 columns)
 64. staff_services                                (16 columns)
 65. statistics_freshness                          ( 7 columns)
 66. stock_alerts                                  (13 columns)
 67. stock_levels                                  ( 9 columns)
 68. stock_locations                               (11 columns)
 69. stock_movements                               (14 columns)
 70. suppliers                                     (15 columns)
 71. table_bloat_estimate                          (12 columns)
 72. table_cache_hit_ratio                         ( 5 columns)
 73. tables_without_primary_keys                   ( 2 columns)
 74. time_off_requests_view                        (22 columns)
 75. toast_usage_summary                           ( 6 columns)
 76. unused_indexes                                ( 5 columns)
 77. user_roles                                    ( 8 columns)

====================================================================================================
## GAP ANALYSIS
====================================================================================================

### Missing Views (referenced in code but not in database):
  - audit_logs (referenced 33 times)
  - avatars (referenced 2 times)
  - catalog_coupon_usage (referenced 2 times)
  - catalog_coupons (referenced 1 times)
  - client_notes (referenced 1 times)
  - coupon_usage (referenced 1 times)
  - coupons (referenced 5 times)
  - database_operations_log (referenced 1 times)
  - inventory_overview (referenced 1 times)
  - loyalty_points (referenced 1 times)
  - loyalty_transactions (referenced 2 times)
  - marketing_contact_messages (referenced 1 times)
  - marketing_newsletter_subscriptions (referenced 1 times)
  - notifications (referenced 1 times)
  - pricing_rules (referenced 4 times)
  - referral_shares (referenced 1 times)
  - referrals (referenced 4 times)
  - review_helpful_votes (referenced 3 times)
  - salon_chains (referenced 27 times)
  - salon_reviews (referenced 42 times)
  - service_booking_rules (referenced 6 times)
  - service_categories (referenced 3 times)
  - service_pricing (referenced 9 times)
  - staff_services_with_metrics (referenced 3 times)
  - time_off_requests (referenced 18 times)
  - user_sensitive_data (referenced 1 times)
  - webhook_queue (referenced 6 times)

### Most Problematic Columns:
  - salons.status (17 references)
  - salons.owner_id (13 references)
  - salons.chain_id (9 references)
  - staff_schedules.work_date (9 references)
  - salon_chains_view.owner_id (8 references)
  - service_product_usage.salon_id (7 references)
  - product_usage.salon_id (7 references)
  - sessions.is_current (6 references)
  - stock_alerts.salon_id (6 references)
  - communication_webhook_queue.salon_id (5 references)
  - product_usage.used_at (5 references)
  - profiles.user_id (4 references)
  - staff.is_active (3 references)
  - stock_levels.salon_id (3 references)
  - salons.rating (2 references)
  - salons.review_count (2 references)
  - salons.description (2 references)
  - staff.start_time (2 references)
  - admin_salons_overview.subscription_tier (2 references)
  - admin_users_overview.last_active (2 references)

====================================================================================================
## RECOMMENDED ACTIONS
====================================================================================================

### Priority 1: Fix Critical Issues
These issues will cause runtime errors:

- features/admin/chains/api/mutations.ts (10 critical issues)
- features/business/reviews/api/mutations.ts (10 critical issues)
- features/customer/reviews/api/helpful-mutations.ts (7 critical issues)
- features/staff/time-off/api/mutations.ts (7 critical issues)
- features/admin/security/api/monitoring.ts (7 critical issues)
- features/admin/moderation/api/queries.ts (6 critical issues)
- features/business/webhooks/api/mutations.ts (6 critical issues)
- features/business/coupons/api/coupons.mutations.ts (6 critical issues)
- features/customer/reviews/api/mutations.ts (5 critical issues)
- features/staff/time-off/api/internal/manager-actions.ts (4 critical issues)

### Priority 2: Fix High Severity Issues
These issues may cause runtime errors or incorrect behavior:

Total high severity issues: 58

### Priority 3: Fix Medium Severity Issues
These issues should be fixed but are less urgent:

Total medium severity issues: 104

====================================================================================================
END OF REPORT
====================================================================================================