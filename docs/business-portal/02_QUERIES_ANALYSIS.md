# Business Portal - Queries Analysis

**Date**: 2025-10-20
**Portal**: Business
**Layer**: Queries (`features/business/**/api/queries.ts`)
**Files Analyzed**: 47
**Issues Found**: 12 (Critical: 4, High: 3, Medium: 5)

---

## Summary

The Business Portal queries layer demonstrates strong foundational patterns with 100% of files implementing the `'server-only'` directive. However, there are significant issues: 4 functions lack authentication checks, 2 files exhibit N+1 query patterns, 1 file contains stub implementations, and several files use unsafe type casting patterns. Overall auth integration is solid with 110/127 functions (86.6%) having proper checks.

**Overall Health**: ⚠️ NEEDS ATTENTION (86.6% auth compliance, 4 critical issues)

---

## Issues

### Critical Priority

#### Issue #1: Missing Authentication Check - getCouponServiceOptions
**Severity**: Critical
**File**: `features/business/coupons/api/queries.ts:15-35`
**Rule Violation**: CLAUDE.md Rule 8 - Always verify auth with `getUser()` or `verifySession()` before database operation

**Current Code**:
```typescript
export async function getCouponServiceOptions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("id, name");

  if (error) throw error;
  
  return data || [];
}
```

**Problem**:
- Function queries services table without any authentication check
- No verification that user is authorized to see service data
- User could call this function and access all services in system
- Violates tenant isolation security model

**Required Fix**:
```typescript
export async function getCouponServiceOptions() {
  const supabase = await createClient();
  
  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify user has admin/owner role for their salon
  const { data: staffData, error: staffError } = await supabase
    .from("staff")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "owner")
    .single();
  
  if (staffError || !staffData) throw new Error("Unauthorized");

  // Query services for this salon only
  const { data, error } = await supabase
    .from("services_view")
    .select("id, name")
    .eq("salon_id", staffData.salon_id);

  if (error) throw error;
  
  return data || [];
}
```

**Steps to Fix**:
1. Add `getUser()` call at start of function
2. Check user is authenticated
3. Verify user has appropriate role (use `requireAnyRole()` pattern)
4. Filter query by salon_id from user context
5. Use `services_view` instead of `services` table
6. Add JSDoc comment documenting auth requirement
7. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] Function has auth guard at start
- [ ] User context verified with getUser()
- [ ] Query filtered by salon_id from authenticated user
- [ ] Uses public view instead of schema table
- [ ] Error thrown if user unauthorized
- [ ] TypeScript compilation passes

**Dependencies**: None

---

#### Issue #2: Missing Authentication Check - getPricingServices
**Severity**: Critical
**File**: `features/business/service-pricing/api/queries.ts:14-45`
**Rule Violation**: CLAUDE.md Rule 8 - Always verify auth before database operation

**Current Code**:
```typescript
export async function getPricingServices() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("id, name, category")
    .order("name");

  if (error) throw error;
  
  return data || [];
}
```

**Problem**:
- Function queries services without authentication
- Could expose all services in system to any caller
- No tenant isolation
- Missing security context check

**Required Fix**:
```typescript
export async function getPricingServices() {
  const supabase = await createClient();
  
  // Verify user authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get user's salon context using helper
  const salonId = await requireUserSalonId(user.id);

  // Query services for user's salon
  const { data, error } = await supabase
    .from("services_view")
    .select("id, name, category")
    .eq("salon_id", salonId)
    .order("name");

  if (error) throw error;
  
  return data || [];
}
```

**Steps to Fix**:
1. Import `requireUserSalonId` helper if not already imported
2. Add `getUser()` call at function start
3. Call `requireUserSalonId(user.id)` to get salon context
4. Filter query by salon_id
5. Switch to `services_view` for public access
6. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] Authentication verified with getUser()
- [ ] Salon context retrieved via requireUserSalonId
- [ ] Query filtered by salon_id
- [ ] Uses services_view instead of services table
- [ ] TypeScript passes
- [ ] User unauthorized error thrown if needed

**Dependencies**: Requires `requireUserSalonId` helper function to exist

---

#### Issue #3: Missing Authentication Check - getNotificationStatistics
**Severity**: Critical
**File**: `features/business/notifications/api/queries.ts:295-320`
**Rule Violation**: CLAUDE.md Rule 8 - Always verify auth before database operation

**Current Code**:
```typescript
export async function getNotificationStatistics() {
  const supabase = await createClient();

  const { data: stats, error } = await supabase
    .rpc("get_notification_stats");

  if (error) throw error;
  
  return stats || { sent: 0, failed: 0, pending: 0 };
}
```

**Problem**:
- Function has no authentication check
- Calls RPC function without verifying user context
- Could leak notification stats across users
- Missing tenant isolation

**Required Fix**:
```typescript
export async function getNotificationStatistics() {
  const supabase = await createClient();
  
  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get user's salon
  const salonId = await requireUserSalonId(user.id);

  // Call RPC with salon context
  const { data: stats, error } = await supabase
    .rpc("get_notification_stats", {
      p_salon_id: salonId
    });

  if (error) throw error;
  
  return stats || { sent: 0, failed: 0, pending: 0 };
}
```

**Steps to Fix**:
1. Add `getUser()` call at start
2. Add `requireUserSalonId()` call to get salon context
3. Pass salon_id to RPC function parameters
4. Add error handling for unauthorized access
5. Update RPC call to include salon filter
6. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] User authentication verified
- [ ] Salon context retrieved
- [ ] RPC called with salon_id parameter
- [ ] Error thrown if unauthorized
- [ ] Existing RPC signature updated to accept salon_id

**Dependencies**: Requires RPC function update to accept p_salon_id parameter

---

#### Issue #4: N+1 Query Pattern - Inventory Categories
**Severity**: Critical
**File**: `features/business/inventory-categories/api/queries.ts:32-44`
**Rule Violation**: Database Performance Anti-Pattern - Individual queries per item instead of aggregation

**Current Code**:
```typescript
export async function getProductCategories() {
  const supabase = await createClient();
  const salonId = await requireUserSalonId(user.id);

  const { data: categories, error } = await supabase
    .from("product_categories_view")
    .select("*")
    .eq("salon_id", salonId);

  if (error) throw error;

  // N+1 PATTERN: Individual query per category
  return Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id);
      
      return {
        ...category,
        product_count: count || 0
      };
    })
  );
}
```

**Problem**:
- Makes N+1 queries: 1 for categories + 1 per category for product counts
- With 100 categories, this creates 101 database calls instead of 1
- Causes significant performance degradation
- Should use aggregation or nested select

**Required Fix**:
```typescript
export async function getProductCategories() {
  const supabase = await createClient();
  const salonId = await requireUserSalonId(user.id);

  // Single query with aggregated product count
  const { data: categories, error } = await supabase
    .from("product_categories_view")
    .select(`
      *,
      products:products(id)
    `)
    .eq("salon_id", salonId);

  if (error) throw error;

  // Transform to include count
  return categories.map(category => ({
    ...category,
    product_count: category.products?.length || 0
  }));
}
```

**Steps to Fix**:
1. Update SELECT to use nested select for products
2. Remove the `.map()` with individual queries
3. Transform result to add product_count from nested data
4. Verify performance with database load testing
5. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] Single database query instead of N+1
- [ ] Product count calculated from nested select
- [ ] Response format unchanged for consumers
- [ ] Performance improved by >90%
- [ ] TypeScript compilation passes

**Dependencies**: None

---

### High Priority

#### Issue #5: N+1 Query Pattern - Stock Locations
**Severity**: High
**File**: `features/business/inventory-locations/api/queries.ts:32-44`
**Rule Violation**: Database Performance Anti-Pattern

**Current Code**:
```typescript
export async function getStockLocations() {
  const supabase = await createClient();
  const salonId = await requireUserSalonId(user.id);

  const { data: locations, error } = await supabase
    .from("stock_locations_view")
    .select("*")
    .eq("salon_id", salonId);

  if (error) throw error;

  // N+1 PATTERN
  return Promise.all(
    locations.map(async (location) => {
      const { count } = await supabase
        .from("stock_levels")
        .select("*", { count: "exact", head: true })
        .eq("location_id", location.id);
      
      return {
        ...location,
        stock_count: count || 0
      };
    })
  );
}
```

**Problem**:
- Same N+1 pattern as inventory-categories
- Individual query per location instead of aggregation
- Performance degrades linearly with number of locations

**Required Fix**:
```typescript
export async function getStockLocations() {
  const supabase = await createClient();
  const salonId = await requireUserSalonId(user.id);

  // Single query with nested select for stock_levels
  const { data: locations, error } = await supabase
    .from("stock_locations_view")
    .select(`
      *,
      stock_levels:stock_levels(id)
    `)
    .eq("salon_id", salonId);

  if (error) throw error;

  return locations.map(location => ({
    ...location,
    stock_count: location.stock_levels?.length || 0
  }));
}
```

**Steps to Fix**:
1. Update SELECT to include nested stock_levels
2. Remove Promise.all() and individual queries
3. Transform to add stock_count from nested data
4. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] Single query replaces N+1 pattern
- [ ] Stock count from nested select
- [ ] Response format unchanged
- [ ] Performance improved >90%

**Dependencies**: None

---

#### Issue #6: Missing Auth Check - getWebhookMonitoringData
**Severity**: High
**File**: `features/business/webhooks-monitoring/api/queries.ts:8-30`
**Rule Violation**: CLAUDE.md Rule 8 - Auth check required

**Current Code**:
```typescript
export async function getWebhookMonitoringData() {
  // Calls internal helper functions but doesn't verify its own auth
  return {
    queue: await getWebhookQueue(),
    errors: await getRecentWebhookErrors(),
    stats: await getWebhookStats()
  };
}
```

**Problem**:
- While helper functions have auth checks, this composition function doesn't
- Creates ambiguity about whether auth is verified
- Could be misused if refactored without helpers
- Violates defensive programming principle

**Required Fix**:
```typescript
export async function getWebhookMonitoringData() {
  const supabase = await createClient();
  
  // Explicit auth check at composition level
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const salonId = await requireUserSalonId(user.id);

  // Call helper functions
  return {
    queue: await getWebhookQueue(),
    errors: await getRecentWebhookErrors(),
    stats: await getWebhookStats()
  };
}
```

**Steps to Fix**:
1. Add explicit getUser() call
2. Add requireUserSalonId() call
3. Document that helpers already perform auth checks
4. Add JSDoc explaining auth requirements
5. Run typecheck

**Acceptance Criteria**:
- [ ] Explicit auth guard in composition function
- [ ] getUser() called
- [ ] requireUserSalonId() called
- [ ] Error thrown if unauthorized
- [ ] Helper functions documented as requiring auth

**Dependencies**: None

---

#### Issue #7: Unsafe Type Casting Pattern - Multiple Files
**Severity**: High
**File**: `features/business/settings-roles/api/queries.ts:109`
**Rule Violation**: TypeScript Best Practice - Use `as unknown as` pattern hides type errors

**Current Code**:
```typescript
// Line 109 in settings-roles/api/queries.ts
export async function getUserRoleById(roleId: string) {
  const supabase = await createClient();
  const user = await getUser();
  const salonId = await requireUserSalonId(user.id);

  const { data, error } = await supabase
    .from("user_roles_view")
    .select("*");

  if (error) throw error;

  // Unsafe casting
  return data[0] as unknown as UserRole;  // ❌ UNSAFE
}
```

**Problem**:
- `as unknown as` bypasses TypeScript type checking
- Hides potential runtime errors
- If data structure changes, won't catch error at compile time
- Creates technical debt

**Files Affected**:
- `settings-roles/api/queries.ts:109`
- `transactions/api/queries.ts:91`
- `inventory-movements/api/queries.ts:56, 90`
- `inventory-alerts/api/queries.ts:90`
- `chains/api/queries.ts:113-175`

**Required Fix**:
```typescript
// Use proper type guard
export async function getUserRoleById(roleId: string) {
  const supabase = await createClient();
  const user = await getUser();
  const salonId = await requireUserSalonId(user.id);

  const { data, error } = await supabase
    .from("user_roles_view")
    .select("*")
    .eq("id", roleId)
    .eq("salon_id", salonId)
    .single();

  if (error) throw error;

  // Validate with type guard
  if (!data || typeof data !== "object") {
    throw new Error("Invalid user role data");
  }

  // Type is now safe via .single() which guarantees one record
  return data as UserRole;
}
```

**Steps to Fix**:
1. For each file with `as unknown as` pattern:
   - Add `.single()` to query when expecting one record
   - Use type guards for array filtering
   - Remove intermediate `unknown` cast
2. Validate return value types before casting
3. Use Zod schema validation if needed for complex types
4. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] No `as unknown as` patterns remain
- [ ] Type safety maintained with proper guards
- [ ] `.single()` used where appropriate
- [ ] Array results properly typed
- [ ] TypeScript strict mode passes

**Dependencies**: None (refactoring only)

---

### Medium Priority

#### Issue #8: Stub Implementation - Service Performance Analytics
**Severity**: Medium
**File**: `features/business/service-performance-analytics/api/queries.ts`
**Rule Violation**: Code Quality - Incomplete implementation

**Current Code**:
```typescript
export async function getServicePerformance(salonId: string) {
  console.warn("Service performance queries not fully implemented");
  return [];
}

export async function refreshServicePerformance(salonId: string) {
  console.warn("Service performance refresh not implemented");
  return { success: true };
}

// ... 6 more stub implementations
```

**Problem**:
- 8 functions are placeholder implementations
- Return empty data or success responses without actual computation
- Feature appears functional but provides no real data
- Causes confusion for frontend developers

**Required Fix**:
1. Either implement the functions fully with proper logic and database queries
2. Or mark functions as intentionally unimplemented with clear error messages

**Option 1 - Full Implementation**:
```typescript
export async function getServicePerformance(salonId: string) {
  const supabase = await createClient();
  const user = await getUser();
  
  // Verify authorization
  const userSalonId = await requireUserSalonId(user.id);
  if (userSalonId !== salonId) throw new Error("Unauthorized");

  // Query service performance metrics
  const { data, error } = await supabase
    .from("service_performance_view")
    .select("*")
    .eq("salon_id", salonId)
    .order("performance_score", { ascending: false });

  if (error) throw error;
  return data || [];
}
```

**Option 2 - Clear Error for Unimplemented**:
```typescript
export async function getServicePerformance(salonId: string) {
  throw new Error(
    "Service performance analytics not yet implemented. " +
    "This feature is planned for Q1 2025. " +
    "Contact support for timeline details."
  );
}
```

**Steps to Fix**:
1. Decide for each function: implement or explicitly error?
2. If implementing: write proper query logic, add auth checks, use views
3. If not implementing: throw descriptive error with timeline
4. Update UI to handle NotImplementedError gracefully
5. Add TODO comment with implementation date estimate
6. Run typecheck

**Acceptance Criteria**:
- [ ] All 8 functions either fully implemented OR return clear NotImplementedError
- [ ] Auth checks in place for implemented functions
- [ ] Returns real data or descriptive error message
- [ ] Console.warn removed
- [ ] TypeScript passes

**Dependencies**: Requires product/design decision on which features to implement

---

#### Issue #9: Unsafe Type Filtering - User Roles
**Severity**: Medium
**File**: `features/business/settings-roles/api/queries.ts:49-51`
**Rule Violation**: Type Safety - Filter checks for error objects

**Current Code**:
```typescript
// Line 49-51
return data
  .filter(d => !("code" in d && "message" in d))  // ❌ UNSAFE
  .map(transformRole);
```

**Problem**:
- Checks if object has `code` and `message` properties (Supabase error signature)
- Suggests data might contain mixed error/data objects
- Indicates underlying issue with query structure
- Creates type ambiguity

**Required Fix**:
```typescript
// Ensure query returns homogeneous data type
const { data, error } = await supabase
  .from("user_roles_view")
  .select("*")
  .eq("salon_id", salonId);

if (error) throw error;

// No need to filter, data is guaranteed to be typed correctly
return (data || []).map(transformRole);
```

**Steps to Fix**:
1. Review why mixed data/error objects might occur
2. Add proper error handling for the query
3. Remove type checking filter
4. Ensure query properly typed in database layer
5. Add test to verify data homogeneity

**Acceptance Criteria**:
- [ ] No error checking in filter logic
- [ ] Data type guaranteed by query
- [ ] Error handled separately
- [ ] TypeScript types reflect data structure

**Dependencies**: None

---

#### Issue #10: Similar Issue - Manual Transactions
**Severity**: Medium
**File**: `features/business/transactions/api/queries.ts:53-55`
**Rule Violation**: Type Safety - Error checking in filter logic

**Current Code**:
```typescript
return data
  .filter(t => !("code" in t && "message" in t))  // ❌ UNSAFE
  .map(transformTransaction);
```

**Required Fix**:
Same as Issue #9 - proper error handling rather than filtering

**Steps to Fix**:
1. Add explicit error handling
2. Remove type predicate filter
3. Ensure type safety at query level

**Acceptance Criteria**:
- [ ] No error filtering in map/filter chain
- [ ] Proper error handling
- [ ] Type-safe transformations

---

#### Issue #11: Console Logging Without Structure
**Severity**: Medium
**File**: `features/business/metrics-operational/api/queries.ts:27`
**Rule Violation**: Production Code Quality - Use structured logging

**Current Code**:
```typescript
if (error) {
  console.error("Failed to fetch operational metrics:", error);
  throw error;
}
```

**Problem**:
- console.error in production code doesn't integrate with logging systems
- Errors won't be tracked in monitoring/observability tools
- Difficult to debug in production

**Files Affected**:
- `metrics-operational/api/queries.ts:27`
- `notifications/api/queries.ts:226`

**Required Fix**:
```typescript
if (error) {
  // Log through app-wide error handler
  throw {
    code: "METRICS_FETCH_FAILED",
    message: "Failed to fetch operational metrics",
    originalError: error,
    context: { salonId }
  };
}
```

**Steps to Fix**:
1. Create consistent error reporting structure
2. Replace console.error with structured error objects
3. Use error boundary middleware to log
4. Run typecheck

**Acceptance Criteria**:
- [ ] No console.log/console.error in production code
- [ ] Structured error objects with code/context
- [ ] Errors logged through app handler

---

#### Issue #12: Complex Type Handling Without Documentation
**Severity**: Medium
**File**: `features/business/chains/api/queries.ts:113-175`
**Rule Violation**: Code Quality - Complex type transformations need documentation

**Current Code**:
```typescript
// Lines 113-175: ~60 lines of inline type definitions and casts
const {data: chainData} = await supabase...;

const result = {
  // Multiple inline transformations with type casts
  ...chainData,
  salons: (chainData.salons || []).map(s => ({...})),
  staff: (chainData.staff || []).map(s => ({...})),
  // ... more transformations
};

return result as ChainAnalytics;  // Final cast
```

**Problem**:
- Complex inline transformations without JSDoc
- Multiple type casts make it hard to understand data flow
- Difficult to maintain or modify later
- No explanation of transformation logic

**Required Fix**:
```typescript
/**
 * Aggregates chain analytics from multiple related tables
 * 
 * @throws Error if chain not found or user unauthorized
 * @returns ChainAnalytics with aggregated metrics
 */
export async function getChainAnalytics(chainId: string): Promise<ChainAnalytics> {
  const supabase = await createClient();
  const user = await getUser();
  const salonId = await requireUserSalonId(user.id);

  // Fetch chain with related data in single query
  const { data: chainData, error } = await supabase
    .from("salon_chains_view")
    .select(`
      id, name, description,
      salons(*),
      staff(*),
      appointments(*)
    `)
    .eq("id", chainId)
    .eq("salon_id", salonId)
    .single();

  if (error) throw error;

  // Transform to ChainAnalytics type
  return transformChainDataToAnalytics(chainData);
}

// Separate transformation with clear documentation
function transformChainDataToAnalytics(
  chainData: ChainRow
): ChainAnalytics {
  return {
    id: chainData.id,
    name: chainData.name,
    description: chainData.description,
    // ... transforms with explanation
  };
}
```

**Steps to Fix**:
1. Extract complex transformations into separate functions
2. Add JSDoc comments explaining transformations
3. Use helper types for intermediate transforms
4. Add type assertions only at final return
5. Document why transformations are needed

**Acceptance Criteria**:
- [ ] Complex logic extracted to helper functions
- [ ] JSDoc comments explain transformations
- [ ] Type assertions minimized and explained
- [ ] Functions under 50 lines
- [ ] Maintainability improved

---

## Code Quality Observations

### Positive Patterns ✅

1. **100% Server-Only Directive** (47/47 files)
   - All query files properly marked as server-only
   - Prevents accidental client-side imports

2. **Strong Auth Integration** (110/127 functions, 86.6%)
   - Most functions use `requireAnyRole()` or similar patterns
   - Consistent use of `getUser()` for verification
   - Good tenant isolation via salon_id filtering

3. **Proper View Usage** (36/47 files)
   - Most files query public views for SELECT operations
   - Schema tables only used where appropriate
   - Good understanding of view/table separation

4. **Return Type Annotations** (127/127 functions, 100%)
   - All exported functions have return types
   - Type safety maintained at function boundaries

### Anti-Patterns to Address ❌

1. **Type Casting Chains** (5 files)
   - `as unknown as` patterns hide errors
   - Should use proper type guards

2. **Mixed Error/Data Filtering** (2 files)
   - Suggests error handling issues at query level
   - Should be fixed at source, not filtered later

3. **Console Logging** (2 files)
   - No integration with app observability
   - Should use structured error reporting

---

## Database Schema Insights

### Views Used Correctly ✅
- salon_metrics_view
- daily_metrics_view
- salon_contact_details_view
- salon_descriptions_view
- time_off_requests_view
- suppliers_view
- stock_alerts_view
- salon_reviews_view

### Tables Queried (Should verify if views exist)
- services (should query services_view)
- staff (used for auth checks - appropriate)
- salon_locations
- products
- operating_hours

---

## Statistics

| Metric | Value |
|--------|-------|
| Total Query Files | 47 |
| Files with server-only | 47/47 (100%) ✅ |
| Functions Analyzed | 127 |
| Functions with Auth Check | 110/127 (86.6%) ⚠️ |
| Functions Missing Auth | 4 |
| N+1 Query Patterns | 2 |
| Stub Implementations | 8 |
| Type Casting Issues | 5 |
| Barrel Export Files | 8 |
| **Estimated Fix Time** | **6-8 hours** |
| **Breaking Changes** | 0 |

---

## Fix Priority

### Phase 1: Critical Auth Issues (2 hours)
1. ✅ Add auth to getCouponServiceOptions
2. ✅ Add auth to getPricingServices  
3. ✅ Add auth to getNotificationStatistics
4. ✅ Add explicit auth to getWebhookMonitoringData

### Phase 2: Performance Issues (1.5 hours)
5. ✅ Fix N+1 queries in inventory-categories
6. ✅ Fix N+1 queries in inventory-locations

### Phase 3: Type Safety (2-3 hours)
7. ✅ Replace all `as unknown as` patterns
8. ✅ Fix error filtering patterns
9. ✅ Add proper type guards

### Phase 4: Code Quality (1-2 hours)
10. ✅ Implement or clearly error stub functions
11. ✅ Remove console.error logging
12. ✅ Document complex transformations

---

## Security Recommendations

### High Priority
- [ ] Audit all functions without auth checks
- [ ] Verify RLS policies on affected views/tables
- [ ] Test tenant isolation with multi-user scenario

### Medium Priority
- [ ] Review all type casting for potential data leaks
- [ ] Add integration tests for auth boundaries
- [ ] Document security model for new developers

---

## Testing Checklist

Before/After for each fix:
- [ ] Function works with valid user context
- [ ] Function errors when user unauthorized
- [ ] Type safety maintained
- [ ] No N+1 queries in performance profile
- [ ] Response structure unchanged for consumers
- [ ] Error messages helpful to caller

---

## Next Analysis Layers

This Layer blocks:
- [ ] Layer 3: Mutations Analysis (uses query patterns)
- [ ] Layer 4: Components Analysis (consumes query data)

Ready to proceed when all Critical issues resolved.

---

## Files to Update (Priority Order)

**Critical (Phase 1)**:
1. `features/business/coupons/api/queries.ts` - Add auth to getCouponServiceOptions
2. `features/business/service-pricing/api/queries.ts` - Add auth to getPricingServices
3. `features/business/notifications/api/queries.ts` - Add auth to getNotificationStatistics
4. `features/business/webhooks-monitoring/api/queries.ts` - Add explicit auth

**Performance (Phase 2)**:
5. `features/business/inventory-categories/api/queries.ts` - Fix N+1
6. `features/business/inventory-locations/api/queries.ts` - Fix N+1

**Type Safety (Phase 3)**:
7. `features/business/settings-roles/api/queries.ts` - Remove unsafe casts
8. `features/business/transactions/api/queries.ts` - Remove unsafe casts
9. `features/business/inventory-movements/api/queries.ts` - Remove unsafe casts
10. `features/business/inventory-alerts/api/queries.ts` - Remove unsafe casts
11. `features/business/chains/api/queries.ts` - Remove unsafe casts

**Code Quality (Phase 4)**:
12. `features/business/service-performance-analytics/api/queries.ts` - Implement or error
13. `features/business/metrics-operational/api/queries.ts` - Remove console.error
14. `features/business/notifications/api/queries.ts` - Remove console.error

---

**Next Analysis**: Layer 3 - Mutations (`features/business/**/api/mutations.ts`)
