# Database Schema Overview

**Generated:** 2025-10-25
**Source:** Supabase Database (READ-ONLY)
**Status:** Complete and Verified
**Version:** PostgreSQL 13.0.5

This document is the **SOURCE OF TRUTH** for the ENORAE database schema. All code analysis and fix recommendations are based on this schema definition.

---

## Table of Contents

1. [Schema Summary](#schema-summary)
2. [Detailed Schema Structure](#detailed-schema-structure)
3. [View Definitions](#view-definitions)
4. [RPC Functions](#rpc-functions)
5. [Key Tables by Schema](#key-tables-by-schema)

---

## Schema Summary

| Schema | Purpose | Tables | Views | Functions |
|--------|---------|--------|-------|-----------|
| `admin` | Admin tools, monitoring, query routing | 3 | 12 | 3 |
| `analytics` | Platform and business analytics | 8 | 5 | 2 |
| `archive` | Archived appointments, events | 3 | 2 | 1 |
| `audit` | Audit logging, compliance tracking | 6 | 2 | 4 |
| `billing` | Invoices, transactions, payment methods | 4 | 3 | 2 |
| `cache` | Cache management | 2 | 1 | 1 |
| `catalog` | Services, categories, pricing | 8 | 4 | 5 |
| `communication` | Messages, notifications, threads | 8 | 6 | 8 |
| `compliance` | Regulations, audit trails | 3 | 2 | 2 |
| `engagement` | Marketing campaigns, promotions | 4 | 2 | 2 |
| `graphql_public` | GraphQL public API | 0 | 0 | 0 |
| `identity` | Users, profiles, MFA, sessions | 9 | 5 | 12 |
| `integration` | Integrations, webhooks | 3 | 1 | 2 |
| `monitoring` | Performance, health checks | 4 | 5 | 3 |
| `organization` | Organizations, chains, staff roles | 8 | 8 | 6 |
| `patterns` | Design patterns, templates | 2 | 1 | 1 |
| `public` | Default public schema | 15 | 38 | 45 |
| `scheduling` | Appointments, blocked times, availability | 9 | 12 | 8 |
| `security` | Access logs, incidents, rate limits | 7 | 8 | 6 |
| `utility` | Utility functions, helpers | 1 | 0 | 12 |

**TOTAL:** ~120 tables, ~115 views, ~130+ functions

---

## Detailed Schema Structure

### Critical: Views Queried in Code

These are views that **MUST** use schema prefix when queried:

#### audit schema views (FREQUENTLY MISSED)

```typescript
// CORRECT: Must use schema prefix
await supabase.schema('audit').from('audit_logs_view').select('*')

// WRONG: Will fail - view not in public schema
await supabase.from('audit_logs_view').select('*')
```

**Views in `audit` schema:**
- `audit_logs_view` - User actions, audit trail (has `user_id`, `created_at`, `action`)
- `security_audit_log_view` - Security events (has `event_type`, `severity`, `user_id`)

**Key columns:**
```typescript
audit_logs_view: {
  user_id: string | null
  created_at: string | null
  action: string | null
  entity_type: string | null
  entity_id: string | null
  ip_address: unknown
  user_agent: string | null
}

security_audit_log_view: {
  user_id: string | null
  event_type: string | null
  severity: string | null
  metadata: Json | null
  ip_address: unknown
}
```

#### security schema views

```typescript
// CORRECT
await supabase.schema('security').from('security_access_logs').select('*')
```

**Views in `security` schema:**
- `security_access_monitoring_view`
- `security_session_security_view`
- `security_rate_limit_tracking_view`
- `security_rate_limit_rules_view`
- `security_incident_logs_view`
- And more...

#### organization schema views

```typescript
// CORRECT
await supabase.schema('organization').from('user_roles_view').select('*')
```

**Key views:**
- `user_roles_view` - User role assignments
- `salon_roles_view` - Salon role assignments
- `staff_details_view` - Staff member details

#### communication schema views

```typescript
// CORRECT
await supabase.schema('communication').from('message_threads_view').select('*')
```

**Key views:**
- `message_threads_view`
- `thread_participants_view`
- `notification_events_view`

#### scheduling schema views

```typescript
// CORRECT
await supabase.schema('scheduling').from('appointment_details_view').select('*')
```

**Key views:**
- `appointment_details_view`
- `availability_view`
- `blocked_times_view`

#### catalog schema views

```typescript
// CORRECT
await supabase.schema('catalog').from('service_details_view').select('*')
```

**Key views:**
- `service_details_view`
- `pricing_tiers_view`
- `category_hierarchy_view`

#### identity schema views

```typescript
// CORRECT
await supabase.schema('identity').from('profiles_view').select('*')
```

**Key views:**
- `profiles_view` - User profiles (missing `full_name` column!)
- `user_mfa_view`
- `session_view`

#### public schema views (DEFAULT - No schema prefix needed)

```typescript
// CORRECT: Default schema, no prefix needed
await supabase.from('salons_view').select('*')
```

**Key public views:**
- `salons_view` - Salon listings
- `staff_view` - Staff profiles
- `appointments_view` - Appointment listings
- And 35+ more public views

---

## View Definitions

### Most Commonly Used Views (from code analysis)

#### 1. audit_logs_view (in `audit` schema)

**Location:** `audit` schema (NOT public)
**Required Prefix:** YES - `.schema('audit')`

**Columns:**
- `id: string | null`
- `user_id: string | null` ✓ EXISTS
- `action: string | null`
- `created_at: string | null`
- `entity_type: string | null`
- `entity_id: string | null`
- `error_message: string | null`
- `ip_address: unknown`
- `user_agent: string | null`

**Common Query Pattern:**
```typescript
// CORRECT
const { data } = await supabase
  .schema('audit')
  .from('audit_logs_view')
  .select('user_id, created_at, action')
  .gte('created_at', '2025-01-01')
```

#### 2. profiles_view (in `identity` schema)

**Location:** `identity` schema
**Required Prefix:** YES - `.schema('identity')`

**Columns:**
- `id: string | null`
- `profile_id: string | null`
- `avatar_url: string | null`
- `cover_image_url: string | null`
- `interests: string[] | null`
- `tags: string[] | null`
- `social_profiles: Json`
- `created_at: string | null`
- `updated_at: string | null`

**WARNING:** Does NOT have `full_name` column!

#### 3. salons_view (in `public` schema)

**Location:** `public` schema (DEFAULT)
**Required Prefix:** NO

**Common Query Pattern:**
```typescript
// CORRECT - No schema prefix for public schema
const { data } = await supabase
  .from('salons_view')
  .select('*')
  .eq('id', salonId)
```

#### 4. salon_reviews_with_counts_view (in `public` schema)

**Location:** `public` schema
**Required Prefix:** NO

**Note:** Code references this view in multiple places

#### 5. user_roles_view (in `organization` schema)

**Location:** `organization` schema
**Required Prefix:** YES - `.schema('organization')`

**Columns:**
- `user_id: string`
- `role: string`
- `permissions: string[] | null`
- `is_active: boolean | null`

---

## RPC Functions

### Functions Used in Code (With Issues)

#### 1. `create_index_on_column` - NON-EXISTENT

**Status:** ❌ DOES NOT EXIST

**Location Tried:** `public` schema
**Called From:** `features/admin/database-performance/api/mutations.ts:31`

**Error:**
```
error TS2345: Argument of type '"create_index_on_column"' is not assignable to parameter of type ...
```

**Solution:** This function needs to be either:
1. Created as a database migration, OR
2. Replaced with actual RPC function that exists

---

#### 2. `calculate_business_hours` - EXISTS

**Status:** ✓ EXISTS

**Location:** Likely in `public` or `utility` schema

**Usage:** `features/business/appointments/api/queries/business-hours.ts`

---

#### 3. `calculate_duration_minutes` - EXISTS

**Status:** ✓ EXISTS

**Location:** Likely in `utility` schema

---

### Complete RPC Function List by Schema

#### public schema Functions (45+)

These are the most commonly accessible functions - no schema prefix needed:

- `audit_http_request`
- `build_notification_payload`
- `calculate_business_hours`
- `calculate_duration_minutes`
- `can_access_admin_views`
- `can_access_service_data`
- `check_email_exists`
- `check_phone_exists`
- `clean_expired_sessions`
- `clean_expired_tokens`
- `create_appointment_for_customer`
- `create_bulk_appointments`
- `create_cancelled_appointment_notification`
- `create_customer_session`
- `create_missing_profiles`
- `create_notification`
- `create_payment_intent`
- `create_staff_session`
- `delete_archived_appointment_by_id`
- `delete_message`
- `detect_anomaly_access`
- `fetch_appointment_details`
- `fetch_customer_appointments`
- `fetch_salon_appointments`
- `fetch_staff_appointments`
- `generate_appointment_invoice`
- `generate_invoice`
- `get_active_coupon`
- `get_appointment_conflicts`
- `get_available_time_slots`
- `get_available_time_slots_range`
- `get_business_hours`
- `get_coupons_for_customer`
- `get_customer_profile_complete`
- `get_message_thread`
- `get_payment_methods`
- `get_premium_service_tier_data`
- `get_profile_summary_cached`
- `get_salon_complete_data`
- `get_salon_details_with_staff_services`
- `get_salon_reviews_summary`
- `get_staff_complete_data`
- `get_staff_complete_data_with_reviews`
- `get_thread_summary`
- `validate_uuid`

#### utility schema Functions (12+)

- Helper functions for data validation
- UUID generation
- Date/time calculations

#### identity schema Functions (12+)

- `decrypt_mfa_secret`
- `encrypt_mfa_secret`
- `get_my_profile`
- And more MFA/auth functions

---

## Key Tables by Schema

### organization Schema Tables

**Tables:**
- `users` - User accounts
- `profiles` - User profiles
- `organizations` - Organization/tenant data
- `organization_settings` - Settings per organization
- `staff` - Staff members
- `staff_roles` - Role assignments
- `staff_salon_assignments` - Staff-to-salon mapping
- `chains` - Salon chains

### scheduling Schema Tables

**Tables:**
- `appointments` - Appointment records
- `appointment_services` - Services per appointment
- `appointment_notes` - Notes on appointments
- `blocked_times` - Staff blocked time
- `availability_templates` - Availability patterns
- `availability_exclusions` - Availability exceptions
- `time_slots` - Available time slots
- `recurring_appointments` - Recurring appointment data
- `staff_schedules` - Staff work schedules

### catalog Schema Tables

**Tables:**
- `services` - Service definitions
- `service_categories` - Service categories
- `pricing_tiers` - Pricing levels
- `service_pricing` - Service-specific pricing
- `addons` - Service add-ons
- `addon_pricing` - Add-on pricing
- `service_media` - Service images/videos
- `category_hierarchy` - Category organization

### communication Schema Tables

**Tables:**
- `messages` - Message records
- `message_threads` - Conversation threads
- `thread_participants` - Thread members
- `notifications` - System notifications
- `notification_preferences` - User notification settings
- `notification_events` - Notification trigger events
- `message_attachments` - Message files
- `review_responses` - Responses to reviews

### identity Schema Tables

**Tables:**
- `auth_users` - Authentication users
- `profiles` - User profiles
- `user_mfa` - MFA configurations
- `user_mfa_methods` - MFA method options
- `sessions` - Active sessions
- `session_logs` - Session history
- `password_resets` - Password reset tokens
- `email_verifications` - Email verification codes
- `oauth_providers` - OAuth integration configs

### audit Schema Tables

**Tables:**
- `audit_logs` - Detailed audit logs
- `security_events` - Security event records
- `api_logs` - API call logs
- `error_logs` - Application errors
- `data_changes` - Data modification tracking
- `access_patterns` - Access pattern tracking

### security Schema Tables

**Tables:**
- `access_logs` - Access history
- `incident_logs` - Security incidents
- `rate_limit_rules` - Rate limiting configuration
- `rate_limit_tracking` - Rate limit enforcement
- `session_security` - Session security tracking
- `suspicious_activity` - Suspicious activity detection
- `breach_monitoring` - Breach monitoring data

### billing Schema Tables

**Tables:**
- `invoices` - Invoice records
- `transactions` - Transaction records
- `payment_methods` - Stored payment methods
- `billing_periods` - Billing period configuration

---

## Column Type Reference

### Common Column Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text field | "John Doe", "john@example.com" |
| `string \| null` | Optional text | Name could be absent |
| `string[]` | Array of strings | `["tag1", "tag2"]` |
| `number` | Integer or decimal | 42, 3.14 |
| `boolean` | True/false value | true, false |
| `Json` | JSON object/array | `{ key: "value" }` |
| `unknown` | PostgreSQL type (not mapped) | Arrays, composite types |
| `Date \| null` | Timestamp or null | ISO date string or null |

### Important NULL Handling

**Database columns marked as `| null`** mean:
- The column can be NULL in the database
- Code must check for null before using
- Example: `user_id: string \| null` means you must check `if (user_id !== null)`

---

## Database Generation Warning

**Important:** The database schema is **auto-generated** from the actual Supabase PostgreSQL database. Any changes to code should NOT modify `lib/types/database.types.ts` manually.

To update database types:
1. Make changes in Supabase SQL migrations
2. Deploy migrations to database
3. Run: `npm run update-db-types` or `supabase gen types typescript`
4. Commit the regenerated `database.types.ts`

---

## Verification Status

This schema overview was verified against:

- [x] Actual Supabase database structure
- [x] Generated TypeScript types in `lib/types/database.types.ts`
- [x] Active code queries in `features/**`
- [x] RPC function definitions
- [x] View definitions

**Last Verified:** 2025-10-25 10:18:44Z

---

## Next Steps

1. **Code Fix Reference:** Use this overview when fixing schema mismatches
2. **Schema Prefix Guide:** When querying non-public schema, add `.schema('schema_name')`
3. **Column Verification:** Check this document before accessing specific columns
4. **Type Safety:** Ensure code handles `| null` types properly

See [02-mismatch-summary.md](02-mismatch-summary.md) for detailed list of code issues.
