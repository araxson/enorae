# Enorae Public Views - Complete Reference

**Generated**: 2025-10-04
**Total Views**: 57

This document provides a complete reference of all public views available in the Enorae database.

---

## Overview

Public views serve as the **query layer** for the Enorae application. All SELECT operations should use these views, while mutations should use schema-qualified tables.

### Access Pattern

```typescript
// ✅ CORRECT - Query from public views
const { data } = await supabase.from('appointments').select('*')

// ❌ WRONG - Never query schema tables directly
const { data } = await supabase.from('scheduling.appointments').select('*')

// ✅ CORRECT - Mutations use schema tables
const { error } = await supabase
  .schema('scheduling')
  .from('appointments')
  .insert({ ... })
```

---

## View Categories

### 1. Admin Portal Views (9 views)

Platform administration with cross-salon aggregated data.

**Access**: Requires `super_admin` or `platform_admin` role

| View | Purpose | Key Columns |
|------|---------|-------------|
| `admin_analytics_overview` | Platform-wide metrics by day | date, total_revenue, platform_appointments, active_salons |
| `admin_appointments_overview` | All appointments across salons | id, salon_name, customer_name, staff_name, status |
| `admin_inventory_overview` | Inventory across all salons | product_name, salon_name, total_quantity, alerts |
| `admin_messages_overview` | All message threads | subject, salon_name, customer_name, staff_name, priority |
| `admin_revenue_overview` | Revenue by salon and date | salon_name, date, total_revenue, appointments_30d |
| `admin_reviews_overview` | All reviews for moderation | salon_name, rating, is_flagged, customer_name |
| `admin_salons_overview` | Salon directory with metrics | name, owner_name, subscription_tier, total_revenue |
| `admin_staff_overview` | Staff directory across salons | full_name, salon_name, staff_role, email |
| `admin_users_overview` | User management | username, email, roles, primary_role, last_active_at |

**Security Notes**:
- Fixed in migration `20251003120000_fix_admin_view_security.sql`
- No longer exposes `auth.users` directly
- Application-level enforcement via `requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)`

---

### 2. Organization Views (13 views)

Salon, staff, and location management.

| View | Purpose | Access | Key Columns |
|------|---------|--------|-------------|
| `salons` | Salon directory with ratings | Public | id, name, slug, business_type, rating_average |
| `salon_chains` | Multi-location chains | Business owners | id, name, salon_count, locations |
| `salon_chains_view` | Chain details with salons | Business owners | chain details + salon list |
| `salon_contact_details` | Contact information | Public | phone, email, website, social_media |
| `salon_descriptions` | Business descriptions | Public | short_description, long_description, specialties |
| `salon_locations` | Physical addresses | Public | address, city, postal_code, coordinates |
| `salon_media` | Photos and videos | Public | media_type, url, display_order |
| `salon_media_view` | Aggregated media | Public | primary_image, gallery_images |
| `salon_metrics` | Performance metrics | Business, Admin | rating_average, total_bookings, total_revenue |
| `salon_settings` | Operational settings | Business | is_accepting_bookings, max_staff, features |
| `staff` | Staff directory | Business, Staff | id, user_id, salon_id, title, experience_years |
| `staff_profiles` | Detailed staff profiles | Business | bio, specialties, certifications |
| `location_addresses` | Address details | Public | full_address, formatted_address |

---

### 3. Service & Catalog Views (5 views)

Service offerings and product usage.

| View | Purpose | Access | Key Columns |
|------|---------|--------|-------------|
| `services` | Service catalog | Public | id, salon_id, name, description, price, duration |
| `service_categories_view` | Service organization | Public | category_name, service_count, salons |
| `staff_services` | Staff service assignments | Business, Staff | staff_id, service_id, is_available, price_override |
| `service_product_usage` | Products used in services | Business | service_id, product_id, quantity_used |
| `product_usage` | Product consumption tracking | Business | product_id, service_id, appointment_id, quantity |

---

### 4. Scheduling Views (6 views)

Appointments, availability, and time management.

| View | Purpose | Access | Key Columns |
|------|---------|--------|-------------|
| `appointments` | Customer bookings | Customer, Staff, Business | id, salon_id, customer_id, staff_id, start_time, status |
| `appointment_services` | Service breakdown per appointment | Booking users | appointment_id, service_id, service_name, price |
| `blocked_times` | Unavailable time slots | Staff, Business | salon_id, staff_id, start_time, end_time, reason |
| `operating_hours` | Business hours | Public | salon_id, day_of_week, open_time, close_time |
| `staff_schedules` | Staff availability | Business, Staff | staff_id, day_of_week, start_time, end_time, is_active |
| `time_off_requests_view` | PTO management | Staff, Business | staff_id, start_date, end_date, status, reason |

---

### 5. Inventory Views (11 views)

Product management, stock tracking, and suppliers.

| View | Purpose | Access | Key Columns |
|------|---------|--------|-------------|
| `products` | Product catalog | Business | id, salon_id, name, sku, category_id |
| `product_categories` | Product organization | Business | id, name, parent_id, product_count |
| `stock_levels` | Current inventory | Business | product_id, location_id, quantity, available_quantity |
| `stock_movements` | Inventory transactions | Business | product_id, movement_type, quantity, timestamp |
| `stock_alerts` | Low stock warnings | Business | product_id, alert_level, current_quantity, reorder_point |
| `stock_locations` | Storage locations | Business | id, salon_id, name, location_type |
| `purchase_orders` | PO management | Business | id, supplier_id, order_date, status, total_amount |
| `purchase_order_items` | PO line items | Business | order_id, product_id, quantity, unit_price |
| `suppliers` | Vendor directory | Business | id, name, contact_info, payment_terms |
| `product_usage` | Usage tracking | Business | product_id, used_quantity, service_id |

---

### 6. Identity & User Views (5 views)

User profiles, roles, and sessions.

| View | Purpose | Access | Key Columns |
|------|---------|--------|-------------|
| `profiles` | User profiles | Authenticated | id, username, email, email_verified, status |
| `profiles_metadata` | Extended profile data | Owner, Admin | profile_id, full_name, avatar_url, bio |
| `profiles_preferences` | User preferences | Owner | profile_id, timezone, locale, notification_settings |
| `user_roles` | Role assignments | Admin, System | user_id, role, salon_id, is_active, permissions |
| `sessions` | Active sessions | Owner, Admin | id, user_id, created_at, updated_at, is_active |

---

### 7. Communication Views (2 views)

Messaging between customers and staff.

| View | Purpose | Access | Key Columns |
|------|---------|--------|-------------|
| `message_threads` | Conversation threads | Customer, Staff | id, salon_id, customer_id, staff_id, subject, status |
| `messages` | Individual messages | Thread participants | id, thread_id, sender_id, content, sent_at |

---

### 8. Engagement Views (3 views)

Customer engagement, reviews, and favorites.

| View | Purpose | Access | Key Columns |
|------|---------|--------|-------------|
| `salon_reviews` | All reviews (raw) | Business, Admin | id, salon_id, customer_id, rating, comment |
| `salon_reviews_view` | Public reviews (filtered) | Public | salon_id, customer_name, rating, comment, created_at |
| `customer_favorites` | Saved salons/services | Customer | customer_id, salon_id, service_id, notes |

---

### 9. Analytics Views (3 views)

Metrics, reporting, and insights.

| View | Purpose | Access | Key Columns |
|------|---------|--------|-------------|
| `daily_metrics` | Daily salon performance | Business, Admin | salon_id, date, revenue, appointments, customers |
| `operational_metrics` | Operational KPIs | Business | salon_id, utilization_rate, peak_hours, metrics |
| `manual_transactions` | Manual financial entries | Business | id, salon_id, amount, type, created_by |

---

### 10. Utility Views (2 views)

Database administration and diagnostics.

| View | Purpose | Access | Key Columns |
|------|---------|--------|-------------|
| `public_tables_without_rls` | Security audit | Admin | table_schema, table_name, has_rls |
| `tables_without_primary_keys` | Data integrity check | Admin | schema_name, table_name |

---

## Complete View List (Alphabetical)

### A
- `admin_analytics_overview`
- `admin_appointments_overview`
- `admin_inventory_overview`
- `admin_messages_overview`
- `admin_revenue_overview`
- `admin_reviews_overview`
- `admin_salons_overview`
- `admin_staff_overview`
- `admin_users_overview`
- `appointment_services`
- `appointments`

### B
- `blocked_times`

### C
- `customer_favorites`

### D
- `daily_metrics`

### L
- `location_addresses`

### M
- `manual_transactions`
- `message_threads`
- `messages`

### O
- `operating_hours`
- `operational_metrics`

### P
- `product_categories`
- `product_usage`
- `products`
- `profiles`
- `profiles_metadata`
- `profiles_preferences`
- `public_tables_without_rls`
- `purchase_order_items`
- `purchase_orders`

### S
- `salon_chains`
- `salon_chains_view`
- `salon_contact_details`
- `salon_descriptions`
- `salon_locations`
- `salon_media`
- `salon_media_view`
- `salon_metrics`
- `salon_reviews`
- `salon_reviews_view`
- `salon_settings`
- `salons`
- `service_categories_view`
- `service_product_usage`
- `services`
- `sessions`
- `staff`
- `staff_profiles`
- `staff_schedules`
- `staff_services`
- `stock_alerts`
- `stock_levels`
- `stock_locations`
- `stock_movements`
- `suppliers`

### T
- `tables_without_primary_keys`
- `time_off_requests_view`

### U
- `user_roles`

---

## Type Definitions

All views are typed in `/Users/afshin/Desktop/Enorae/lib/types/database.types.ts`:

```typescript
import type { Database } from '@/lib/types/database.types'

// ✅ ALWAYS use Views (not Tables)
type Salon = Database['public']['Views']['salons']['Row']
type Appointment = Database['public']['Views']['appointments']['Row']
type Staff = Database['public']['Views']['staff']['Row']

// ❌ NEVER use Tables for queries
// type Salon = Database['public']['Tables']['salons']['Row']
```

---

## Security & RLS

### RLS Inheritance

All public views **inherit RLS policies** from their underlying schema tables:

```sql
-- Example: appointments view inherits RLS from scheduling.appointments
CREATE VIEW public.appointments AS
SELECT
  a.*,
  s.name as salon_name,
  ...
FROM scheduling.appointments a  -- RLS applied here
JOIN organization.salons s ...  -- RLS applied here
```

### Access Control

Views respect the RLS policies defined on source tables:

| User Role | Can Access | Filter Applied |
|-----------|------------|----------------|
| Customer | Own appointments | `customer_id = auth.uid()` |
| Staff | Own salon appointments | `staff.salon_id = user's salon` |
| Business | Own salon data | `salon.owner_id = auth.uid()` |
| Admin | All data | No filter (admin bypass) |

### Best Practices

1. **Always add explicit filters**
   ```typescript
   // ✅ GOOD - helps RLS optimizer
   .eq('salon_id', salonId)
   .eq('customer_id', userId)

   // ⚠️ WORKS - but slower
   // RLS will filter, but explicit filter is faster
   ```

2. **Verify auth before queries**
   ```typescript
   const session = await verifySession()
   if (!session) throw new Error('Unauthorized')
   ```

3. **Use role checks for admin views**
   ```typescript
   if (!(await isPlatformAdmin())) {
     throw new Error('Admin access required')
   }
   ```

---

## Query Examples

### Customer Dashboard

```typescript
import { createClient } from '@/lib/supabase/server'

// Get customer appointments
const { data: appointments } = await supabase
  .from('appointments')
  .select(`
    *,
    salon:salons(name, slug),
    services:appointment_services(service_name, price)
  `)
  .eq('customer_id', userId)
  .order('start_time', { ascending: false })

// Get favorite salons
const { data: favorites } = await supabase
  .from('customer_favorites')
  .select(`
    *,
    salon:salons(name, rating_average)
  `)
  .eq('customer_id', userId)
```

### Business Dashboard

```typescript
// Get daily metrics
const { data: metrics } = await supabase
  .from('daily_metrics')
  .select('*')
  .eq('salon_id', salonId)
  .gte('metric_at', startDate)
  .lte('metric_at', endDate)
  .order('metric_at', { ascending: false })

// Get upcoming appointments
const { data: appointments } = await supabase
  .from('appointments')
  .select(`
    *,
    customer:profiles(full_name, email),
    staff:staff(title, full_name)
  `)
  .eq('salon_id', salonId)
  .gte('start_time', new Date().toISOString())
  .order('start_time', { ascending: true })
  .limit(20)
```

### Staff Dashboard

```typescript
// Get staff appointments
const { data: appointments } = await supabase
  .from('appointments')
  .select('*')
  .eq('staff_id', staffProfileId)
  .gte('start_time', todayStart)
  .lte('start_time', todayEnd)
  .order('start_time', { ascending: true })

// Get staff schedule
const { data: schedule } = await supabase
  .from('staff_schedules')
  .select('*')
  .eq('staff_id', userId)
  .eq('is_active', true)
```

### Admin Dashboard

```typescript
// Platform-wide analytics
const { data: analytics } = await supabase
  .from('admin_analytics_overview')
  .select('*')
  .order('date', { ascending: false })
  .limit(30)

// User management
const { data: users } = await supabase
  .from('admin_users_overview')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(100)

// Salon overview
const { data: salons } = await supabase
  .from('admin_salons_overview')
  .select('*')
  .order('total_revenue', { ascending: false })
```

---

## Migration Notes

### Admin View Security Fix

**Migration**: `20251003120000_fix_admin_view_security.sql`

**Changes**:
1. Removed `SECURITY DEFINER` from all admin views
2. Replaced `auth.users` with `profiles` view
3. Added `security_barrier = true` to all admin views
4. Application enforces admin access via `requireAnyRole()`

**Before**:
```sql
CREATE VIEW admin_users AS
SELECT u.email FROM auth.users u  -- ❌ Direct auth.users access
...
SECURITY DEFINER;  -- ❌ Bypasses RLS
```

**After**:
```sql
CREATE VIEW admin_users_overview AS
SELECT p.email FROM public.profiles p  -- ✅ Uses profiles view
...
-- No SECURITY DEFINER
-- security_barrier = true (set via ALTER VIEW)
```

---

## Related Documentation

- [Database Architecture Report](/Users/afshin/Desktop/Enorae/DATABASE_ARCHITECTURE_REPORT.md)
- [CLAUDE.md](/Users/afshin/Desktop/Enorae/CLAUDE.md) - Development guidelines
- [SECURITY.md](/Users/afshin/Desktop/Enorae/SECURITY.md) - Security configuration

---

**Document Version**: 1.0
**Last Updated**: 2025-10-04
