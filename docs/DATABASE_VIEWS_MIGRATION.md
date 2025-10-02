# 🗄️ Database Views Migration Guide

**Purpose**: Create missing public views to resolve 96 TypeScript errors
**Priority**: 🔴 CRITICAL
**Estimated Time**: 2-4 hours

---

## 📋 OVERVIEW

### Problem
Multiple features are attempting to query database tables through public views that don't exist, causing TypeScript compilation errors.

### Current State
- **10 public views exist** (per `CLAUDE.md`)
- **10+ additional views needed** for features to work
- **96 TypeScript errors** due to missing views

### Solution Options

#### Option A: Create Public Views ✅ **RECOMMENDED**
**Pros**:
- Maintains consistent query pattern
- Follows "always query from public views" rule
- Clean separation of concerns
- Better for future scalability

**Cons**:
- Requires database migration
- Need to regenerate TypeScript types

#### Option B: Use Direct Schema Access
**Pros**:
- No database changes needed
- Faster immediate fix

**Cons**:
- Violates architectural pattern
- More complex queries
- Harder to maintain RLS
- Inconsistent with existing code

---

## 🎯 RECOMMENDED APPROACH: Create Public Views

### Phase 1: Communication Schema

```sql
-- Message Threads View
CREATE OR REPLACE VIEW public.message_threads AS
SELECT * FROM communication.message_threads;

-- Messages View
CREATE OR REPLACE VIEW public.messages AS
SELECT * FROM communication.messages;

-- Grant permissions
GRANT SELECT ON public.message_threads TO authenticated;
GRANT SELECT ON public.messages TO authenticated;

-- Enable RLS (will use underlying table policies)
ALTER VIEW public.message_threads SET (security_invoker = true);
ALTER VIEW public.messages SET (security_invoker = true);
```

**Affected Feature**: `messaging` (3 errors fixed)

---

### Phase 2: Inventory Schema

```sql
-- Products View
CREATE OR REPLACE VIEW public.products AS
SELECT * FROM inventory.products;

-- Product Categories View
CREATE OR REPLACE VIEW public.product_categories AS
SELECT * FROM inventory.product_categories;

-- Stock Levels View
CREATE OR REPLACE VIEW public.stock_levels AS
SELECT * FROM inventory.stock_levels;

-- Stock Alerts View
CREATE OR REPLACE VIEW public.stock_alerts AS
SELECT * FROM inventory.stock_alerts;

-- Suppliers View
CREATE OR REPLACE VIEW public.suppliers AS
SELECT * FROM inventory.suppliers;

-- Purchase Orders View
CREATE OR REPLACE VIEW public.purchase_orders AS
SELECT * FROM inventory.purchase_orders;

-- Purchase Order Items View
CREATE OR REPLACE VIEW public.purchase_order_items AS
SELECT * FROM inventory.purchase_order_items;

-- Product Usage View
CREATE OR REPLACE VIEW public.product_usage AS
SELECT * FROM inventory.product_usage;

-- Grant permissions
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.product_categories TO authenticated;
GRANT SELECT ON public.stock_levels TO authenticated;
GRANT SELECT ON public.stock_alerts TO authenticated;
GRANT SELECT ON public.suppliers TO authenticated;
GRANT SELECT ON public.purchase_orders TO authenticated;
GRANT SELECT ON public.purchase_order_items TO authenticated;
GRANT SELECT ON public.product_usage TO authenticated;

-- Enable RLS
ALTER VIEW public.products SET (security_invoker = true);
ALTER VIEW public.product_categories SET (security_invoker = true);
ALTER VIEW public.stock_levels SET (security_invoker = true);
ALTER VIEW public.stock_alerts SET (security_invoker = true);
ALTER VIEW public.suppliers SET (security_invoker = true);
ALTER VIEW public.purchase_orders SET (security_invoker = true);
ALTER VIEW public.purchase_order_items SET (security_invoker = true);
ALTER VIEW public.product_usage SET (security_invoker = true);
```

**Affected Features**:
- `inventory-management` (16 errors fixed)
- `product-usage` (14 errors fixed)
- `purchase-orders` (13 errors fixed)
- `product-categories` (8 errors fixed)
- `suppliers`
- `stock-alerts`

**Total**: 51+ errors fixed

---

### Phase 3: Analytics Schema

```sql
-- Daily Metrics View
CREATE OR REPLACE VIEW public.daily_metrics AS
SELECT * FROM analytics.daily_metrics;

-- Operational Metrics View
CREATE OR REPLACE VIEW public.operational_metrics AS
SELECT * FROM analytics.operational_metrics;

-- Manual Transactions View
CREATE OR REPLACE VIEW public.manual_transactions AS
SELECT * FROM analytics.manual_transactions;

-- Grant permissions
GRANT SELECT ON public.daily_metrics TO authenticated;
GRANT SELECT ON public.operational_metrics TO authenticated;
GRANT SELECT ON public.manual_transactions TO authenticated;

-- Enable RLS
ALTER VIEW public.daily_metrics SET (security_invoker = true);
ALTER VIEW public.operational_metrics SET (security_invoker = true);
ALTER VIEW public.manual_transactions SET (security_invoker = true);
```

**Affected Features**:
- `enhanced-analytics` (28 errors fixed)
- `manual-transactions` (11 errors fixed)

**Total**: 39 errors fixed

---

### Phase 4: Organization Schema

```sql
-- Salon Chains View
CREATE OR REPLACE VIEW public.salon_chains AS
SELECT * FROM organization.salon_chains;

-- Grant permissions
GRANT SELECT ON public.salon_chains TO authenticated;

-- Enable RLS
ALTER VIEW public.salon_chains SET (security_invoker = true);
```

**Affected Feature**: `salon-chains` (3 errors fixed)

---

### Phase 5: Catalog Schema

```sql
-- Service Booking Rules View
CREATE OR REPLACE VIEW public.service_booking_rules AS
SELECT * FROM catalog.service_booking_rules;

-- Grant permissions
GRANT SELECT ON public.service_booking_rules TO authenticated;

-- Enable RLS
ALTER VIEW public.service_booking_rules SET (security_invoker = true);
```

**Affected Feature**: `booking-rules` (3 errors fixed)

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Create Migration File

```bash
# Create new migration
cd supabase
supabase migration new create_missing_public_views
```

### Step 2: Add All View Definitions

Copy all SQL from Phases 1-5 into the migration file.

### Step 3: Apply Migration

```bash
# Local development
supabase db reset

# Or apply migration
supabase db push
```

### Step 4: Regenerate TypeScript Types

```bash
# Using the script
python3 scripts/generate-types.py

# Or manually
supabase gen types typescript --local > lib/types/database.types.ts
```

### Step 5: Verify TypeScript Compilation

```bash
pnpm tsc --noEmit
```

Expected result: **96 errors → 0 errors** ✅

---

## 📊 IMPACT ANALYSIS

### Before Migration
- ❌ 96 TypeScript errors
- ❌ 10 features broken
- ❌ Cannot build application
- ❌ Production deployment blocked

### After Migration
- ✅ 0 TypeScript errors
- ✅ All features working
- ✅ Clean build
- ✅ Production ready

---

## ⚠️ IMPORTANT NOTES

### RLS Enforcement
Views use `security_invoker = true` which means:
- Views inherit RLS policies from underlying tables
- No need to duplicate RLS policies on views
- User's permissions checked against base tables

### Performance
- Views are **not materialized** (always up-to-date)
- No performance penalty vs direct table access
- Query planner can optimize through views

### Maintenance
- Update view when table schema changes
- No need to update application code
- TypeScript types auto-regenerate

---

## 🔄 ROLLBACK PLAN

If issues occur:

```sql
-- Drop all new views
DROP VIEW IF EXISTS public.message_threads CASCADE;
DROP VIEW IF EXISTS public.messages CASCADE;
DROP VIEW IF EXISTS public.products CASCADE;
-- ... etc for all views

-- Restore previous migration
supabase db reset --version <previous_version>
```

---

## ✅ VERIFICATION CHECKLIST

After migration:

- [ ] All views created successfully
- [ ] Permissions granted correctly
- [ ] RLS enabled on all views
- [ ] TypeScript types regenerated
- [ ] `pnpm tsc --noEmit` passes (0 errors)
- [ ] `pnpm build` succeeds
- [ ] Test queries work for each feature
- [ ] RLS policies enforced through views

---

## 📞 SUPPORT

If you encounter issues:

1. Check Supabase logs for RLS denials
2. Verify view permissions: `\dp public.*` in psql
3. Test individual views: `SELECT * FROM public.products LIMIT 1`
4. Verify RLS: `SELECT current_setting('role')` and test as different users

---

**Created**: 2025-10-02
**Status**: Ready for implementation
**Priority**: 🔴 CRITICAL
**Blockers**: None
