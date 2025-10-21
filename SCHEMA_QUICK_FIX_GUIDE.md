# Schema Mismatch Quick Fix Guide

**Quick reference for fixing the most common schema mismatches in ENORAE**

---

## Quick Find & Replace Operations

### 1. View Name Fixes (Safe - Run Immediately)

```bash
# Navigate to project root
cd /Users/afshin/Desktop/Enorae

# Fix salon_reviews (42 occurrences)
rg "\.from\('salon_reviews'\)" -l | xargs sed -i '' "s/\.from('salon_reviews_view')/\.from('salon_reviews_view')/g"

# Fix salon_chains (27 occurrences)
rg "\.from\('salon_chains'\)" -l | xargs sed -i '' "s/\.from('salon_chains_view')/\.from('salon_chains_view')/g"

# Fix time_off_requests (18 occurrences)
rg "\.from\('time_off_requests'\)" -l | xargs sed -i '' "s/\.from('time_off_requests_view')/\.from('time_off_requests_view')/g"

# Fix service_pricing (9 occurrences)
rg "\.from\('service_pricing'\)" -l | xargs sed -i '' "s/\.from('service_pricing_view')/\.from('service_pricing_view')/g"

# Fix service_booking_rules (6 occurrences)
rg "\.from\('service_booking_rules'\)" -l | xargs sed -i '' "s/\.from('service_booking_rules_view')/\.from('service_booking_rules_view')/g"

# Fix webhook_queue (6 occurrences)
rg "\.from\('webhook_queue'\)" -l | xargs sed -i '' "s/\.from('communication_webhook_queue')/\.from('communication_webhook_queue')/g"

# Fix service_categories (3 occurrences)
rg "\.from\('service_categories'\)" -l | xargs sed -i '' "s/\.from('service_categories_view')/\.from('service_categories_view')/g"
```

---

## View Name Corrections

### Correct View Names (Use These)

| ❌ WRONG (in code) | ✅ CORRECT (in database) |
|-------------------|--------------------------|
| `salon_reviews` | `salon_reviews_view` |
| `salon_chains` | `salon_chains_view` |
| `time_off_requests` | `time_off_requests_view` |
| `service_pricing` | `service_pricing_view` |
| `service_booking_rules` | `service_booking_rules_view` |
| `service_categories` | `service_categories_view` |
| `webhook_queue` | `communication_webhook_queue` |

---

## Column Name Corrections

### salons view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `status` | `is_active` | Boolean instead of string |
| `owner_id` | ❌ Not in view | Need different approach |
| `chain_id` | ❌ Not in view | Join with salon_chains_view |
| `rating` | `rating_average` | |
| `review_count` | `rating_count` | |
| `logo_url` | ❌ Not in view | Check salon_media view |
| `full_address` | `formatted_address` | |
| `description` | `short_description` or `full_description` | |

### appointments view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `total_amount` | `total_price` | |

### staff view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `is_active` | Use `status` field | Status is string enum |

### staff_schedules view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `work_date` | Use `day_of_week` | Different approach needed |
| `title` | ❌ Not in view | Staff title is in staff view |
| `staff` | ❌ Not in view | Join with staff view |

### sessions view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `is_current` | `is_active` | |

### profiles view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `user_id` | `id` | Profile ID is the user ID |

### manual_transactions view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `amount` | ❌ Not in view | Need to check schema |

### product_usage view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `salon_id` | ❌ Not in view | May need different join |
| `used_at` | ❌ Not in view | Check actual columns |

### stock_alerts view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `salon_id` | ❌ Not in view | Check join approach |

### communication_webhook_queue view

| ❌ WRONG | ✅ CORRECT | Notes |
|---------|-----------|-------|
| `salon_id` | ❌ Not in view | |
| `webhook_config_id` | ❌ Not in view | |
| `delivery_time_ms` | ❌ Not in view | |

---

## Available Views Reference

### Core Business Views (11)

```typescript
'appointments'           // 21 columns
'salons'                // 25 columns
'services'              // 26 columns
'staff'                 // 20 columns
'profiles'              // 24 columns
'blocked_times'         // 21 columns
'operating_hours'       // 16 columns
'products'              // 20 columns
'messages'              // 20 columns
'appointment_services'  // 25 columns
'customer_favorites'    // 21 columns
```

### Admin Views (9)

```typescript
'admin_analytics_overview'      // 13 columns
'admin_appointments_overview'   // 20 columns
'admin_inventory_overview'      // 16 columns
'admin_messages_overview'       // 18 columns
'admin_revenue_overview'        // 14 columns
'admin_reviews_overview'        // 19 columns
'admin_salons_overview'         // 13 columns
'admin_staff_overview'          // 14 columns
'admin_users_overview'          // 16 columns
```

### Catalog Views (8)

```typescript
'service_booking_rules_view'    // 15 columns
'service_categories_view'       // 17 columns
'service_pricing_view'          // 20 columns
'service_product_usage'         // 7 columns
'service_performance'           // 9 columns
'product_categories'            // 11 columns
'product_usage'                 // 10 columns
'purchase_order_items'          // 9 columns
'purchase_orders'               // 17 columns
```

### Scheduling Views (2)

```typescript
'staff_schedules'               // 13 columns
'time_off_requests_view'        // 22 columns
```

### Communication Views (4)

```typescript
'communication_message_threads' // 15 columns
'communication_messages'        // 16 columns
'communication_notification_queue' // 9 columns
'communication_webhook_queue'   // 12 columns
```

### Engagement Views (2)

```typescript
'salon_reviews_view'            // 14 columns
```

### Inventory Views (6)

```typescript
'stock_alerts'                  // 13 columns
'stock_levels'                  // 9 columns
'stock_locations'               // 11 columns
'stock_movements'               // 14 columns
'suppliers'                     // 15 columns
```

### Chain/Location Views (4)

```typescript
'salon_chains_view'             // 15 columns
'salon_contact_details'         // 18 columns
'salon_descriptions'            // 12 columns
'salon_locations'               // 12 columns
'salon_media'                   // 8 columns
'salon_media_view'              // 12 columns
'salon_metrics'                 // 8 columns
'salon_settings'                // 12 columns
'location_addresses'            // 19 columns
```

### Identity/Security Views (6)

```typescript
'profiles_metadata'             // 11 columns
'profiles_preferences'          // 9 columns
'sessions'                      // 12 columns
'staff_profiles'                // 12 columns
'user_roles'                    // 8 columns
'security_access_monitoring'    // 9 columns
'security_incident_logs'        // 19 columns
'security_rate_limit_rules'     // 17 columns
'security_rate_limit_tracking'  // 12 columns
'security_session_security'     // 9 columns
```

### Analytics/Metrics Views (7)

```typescript
'daily_metrics'                 // 23 columns
'operational_metrics'           // 14 columns
'query_performance_summary'     // 8 columns
'slow_queries'                  // 10 columns
'most_called_queries'           // 7 columns
'hot_update_stats'              // 6 columns
'statistics_freshness'          // 7 columns
```

### System/Admin Views (11)

```typescript
'public_tables_without_rls'     // 3 columns
'table_bloat_estimate'          // 12 columns
'table_cache_hit_ratio'         // 5 columns
'tables_without_primary_keys'   // 2 columns
'toast_usage_summary'           // 6 columns
'unused_indexes'                // 5 columns
'low_priority_optimizations_summary' // 3 columns
```

---

## Key Schema Insights

### 1. appointments view columns

```typescript
id: string | null
salon_id: string | null
salon_name: string | null
customer_id: string | null
customer_name: string | null
customer_email: string | null
staff_id: string | null
staff_name: string | null
service_id: string | null
service_name: string | null
service_names: string[] | null  // Array of all services
start_time: string | null
end_time: string | null
duration_minutes: number | null
status: string | null
total_price: number | null      // NOT total_amount
confirmation_code: string | null
created_at: string | null
updated_at: string | null
completed_at: string | null
cancelled_at: string | null
```

### 2. salons view columns

```typescript
id: string | null
name: string | null
slug: string | null
short_description: string | null
full_description: string | null
street_address: string | null
street_address_2: string | null
city: string | null
state_province: string | null
postal_code: string | null
country_code: string | null
formatted_address: string | null  // NOT full_address
latitude: number | null
longitude: number | null
primary_phone: string | null
primary_email: string | null
website_url: string | null
rating_average: number | null     // NOT rating
rating_count: number | null       // NOT review_count
is_active: boolean | null         // NOT status
is_verified: boolean | null
is_featured: boolean | null
is_accepting_bookings: boolean | null
address: Json | null
created_at: string | null
// ❌ NO owner_id
// ❌ NO chain_id
// ❌ NO logo_url (use salon_media_view)
```

### 3. services view columns

```typescript
id: string | null
salon_id: string | null
name: string | null
slug: string | null
description: string | null
category_id: string | null
category_name: string | null
category_slug: string | null
duration_minutes: number | null
buffer_minutes: number | null
total_duration_minutes: number | null
price: number | null              // Base price
current_price: number | null      // Active price
sale_price: number | null         // Discounted price
currency_code: string | null
is_active: boolean | null
is_bookable: boolean | null
is_featured: boolean | null
status: string | null
min_advance_booking_hours: number | null
max_advance_booking_days: number | null
created_at: string | null
updated_at: string | null
discontinued_at: string | null
deleted_at: string | null
deleted_by_id: string | null
```

### 4. staff view columns

```typescript
id: string | null
user_id: string | null
salon_id: string | null
salon_name: string | null
salon_slug: string | null
business_name: string | null
full_name: string | null
email: string | null
title: string | null
bio: string | null
avatar_url: string | null
avatar_thumbnail_url: string | null
experience_years: number | null
status: string | null             // NOT is_active
services_count: number | null
total_appointments: number | null
created_at: string | null
updated_at: string | null
deleted_at: string | null
deleted_by_id: string | null
```

### 5. staff_schedules view columns

```typescript
id: string | null
staff_id: string | null
salon_id: string | null
day_of_week: Database["public"]["Enums"]["day_of_week"] | null  // NOT work_date
start_time: string | null
end_time: string | null
break_start: string | null
break_end: string | null
is_active: boolean | null
effective_from: string | null
effective_until: string | null
created_at: string | null
updated_at: string | null
// ❌ NO work_date
// ❌ NO title (use join with staff)
// ❌ NO staff object (use join with staff)
```

---

## Common Patterns to Fix

### Pattern 1: Filter by salon status

❌ **WRONG:**
```typescript
.from('salons')
.eq('status', 'active')
```

✅ **CORRECT:**
```typescript
.from('salons')
.eq('is_active', true)
```

### Pattern 2: Get salon owner

❌ **WRONG:**
```typescript
.from('salons')
.eq('owner_id', userId)
```

✅ **CORRECT:**
```typescript
// Option 1: Use RLS (recommended)
.from('salons')
// RLS will automatically filter by user

// Option 2: Join with appropriate table
// (Need to determine correct approach)
```

### Pattern 3: Get salon chain

❌ **WRONG:**
```typescript
.from('salons')
.eq('chain_id', chainId)
```

✅ **CORRECT:**
```typescript
// Need to join with salon_chains_view
// or use different query approach
```

### Pattern 4: Filter schedules by date

❌ **WRONG:**
```typescript
.from('staff_schedules')
.eq('work_date', date)
```

✅ **CORRECT:**
```typescript
.from('staff_schedules')
.eq('day_of_week', dayOfWeek)  // 0-6
.gte('effective_from', startDate)
.lte('effective_until', endDate)
```

### Pattern 5: Get appointment total

❌ **WRONG:**
```typescript
.from('appointments')
.select('total_amount')
```

✅ **CORRECT:**
```typescript
.from('appointments')
.select('total_price')
```

---

## Type-Safe Queries

### Recommended Pattern

```typescript
import { Database } from '@/lib/types/database.types'

// Define view type
type AppointmentView = Database['public']['Views']['appointments']['Row']

// Use in query
const { data } = await supabase
  .from('appointments')
  .select('*')
  .returns<AppointmentView[]>()

// TypeScript will catch column errors!
```

---

## Testing After Fixes

### 1. Type Check
```bash
npm run typecheck
```

### 2. Test Critical Features
- Reviews (salon_reviews_view)
- Chains (salon_chains_view)
- Time Off (time_off_requests_view)
- Webhooks (communication_webhook_queue)
- Service Pricing (service_pricing_view)

### 3. Re-run Analysis
```bash
python3 scripts/comprehensive-schema-analysis.py
```

---

## Files to Review Manually

These require manual fixes (views don't exist):

1. **Audit Logs** (33 refs)
   - `features/admin/security/api/monitoring.ts`
   - `features/admin/chains/api/mutations.ts`
   - `features/admin/users/api/mutations/status.ts`
   - **Action:** Determine correct schema/view for audit logs

2. **Coupons** (6 refs)
   - `features/business/coupons/api/coupons.mutations.ts`
   - **Action:** Create coupon views or query from correct schema

3. **Pricing Rules** (4 refs)
   - `features/business/pricing/api/pricing-rules.mutations.ts`
   - **Action:** Create pricing_rules view or query from correct schema

4. **Referrals** (4 refs)
   - Various files
   - **Action:** Create referrals view or query from correct schema

5. **Review Helpful Votes** (3 refs)
   - `features/customer/reviews/api/helpful-mutations.ts`
   - **Action:** Create review_helpful_votes view

---

## Verification Checklist

After running fixes:

- [ ] All find & replace operations completed
- [ ] Type check passes (`npm run typecheck`)
- [ ] Manual fixes identified
- [ ] Re-run schema analysis
- [ ] Test critical features
- [ ] Review remaining issues
- [ ] Update documentation
- [ ] Commit changes

---

**Last Updated:** 2025-10-20
**Total Issues:** 342
**Quick Fixes Available:** ~180 (via find & replace)
**Manual Fixes Required:** ~162
