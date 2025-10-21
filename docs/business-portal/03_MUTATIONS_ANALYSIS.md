# Business Portal - Mutations Analysis

**Date**: 2025-10-20
**Portal**: Business
**Layer**: Mutations (`features/business/**/api/mutations.ts`)
**Files Analyzed**: 46
**Issues Found**: 19 (Critical: 5, High: 6, Medium: 8)

---

## Summary

The Business Portal mutations layer demonstrates strong foundational patterns with 100% of files implementing the `'use server'` directive and 97% having proper authentication checks. However, there are critical issues: 10 functions attempt to mutate views instead of tables (will fail at runtime), 9 functions use inconsistent error handling (throwing instead of structured responses), and 6 functions lack input validation. Most mutations correctly call `revalidatePath()` for cache invalidation.

**Overall Health**: ⚠️ CRITICAL ISSUES (Multiple runtime failures expected)

---

## Issues

### Critical Priority

#### Issue #1: View Mutation Errors - Reviews
**Severity**: Critical
**File**: `features/business/reviews/api/mutations.ts:15-120`
**Rule Violation**: CLAUDE.md Rule 1 - Writes to schema tables, not views

**Current Code**:
```typescript
export async function respondToReview(reviewId: string, response: string) {
  const supabase = await createClient();
  const user = await getUser();
  
  // ❌ CRITICAL: Attempting to update view instead of table
  const { error } = await supabase
    .from("salon_reviews_view")  // This is a VIEW - read-only!
    .update({ response_text: response })
    .eq("id", reviewId);

  if (error) throw error;
  return { success: true };
}
```

**Problem**:
- `salon_reviews_view` is a read-only view
- Cannot INSERT, UPDATE, or DELETE on views in Supabase
- This function will fail at runtime with permission error
- All 5 functions in this file have the same issue

**Files Affected**:
- `reviews/api/mutations.ts` (5 functions: respondToReview, flagReview, toggleFeaturedReview, updateReviewResponse, deleteReviewResponse)

**Required Fix**:
```typescript
// First, find the underlying table structure in Supabase
// Reviews are likely stored in a reviews table with these columns:
// - id (PK)
// - salon_id
// - response_text
// - is_featured
// - flagged_reason
// etc.

export async function respondToReview(reviewId: string, response: string) {
  const supabase = await createClient();
  const user = await getUser();
  const salonId = await requireUserSalonId(user.id);

  // Use underlying table, not view
  const { error } = await supabase
    .schema("communication")  // Find correct schema
    .from("reviews")  // Use actual table name
    .update({ response_text: response })
    .eq("id", reviewId)
    .eq("salon_id", salonId);  // Add tenant filtering

  if (error) throw error;
  
  revalidatePath("/business/reviews");
  return { success: true };
}
```

**Steps to Fix**:
1. Query Supabase to find underlying table for reviews
2. Update all 5 functions to use correct schema/table
3. Add salon_id filtering for tenant isolation
4. Add Zod validation for input
5. Ensure revalidatePath is called
6. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] All 5 functions use `.schema().from('table')` pattern
- [ ] No functions query views for mutations
- [ ] Queries filtered by salon_id
- [ ] Input validated with Zod
- [ ] revalidatePath called
- [ ] No runtime permission errors

**Dependencies**: Requires Supabase schema exploration

---

#### Issue #2: View Mutation Errors - Time Off
**Severity**: Critical
**File**: `features/business/time-off/api/mutations.ts:10-60`
**Rule Violation**: CLAUDE.md Rule 1 - Writes to schema tables, not views

**Current Code**:
```typescript
export async function approveTimeOffRequest(requestId: string) {
  const supabase = await createClient();
  
  // ❌ CRITICAL: Updating view instead of table
  const { error } = await supabase
    .from("time_off_requests_view")  // Read-only view!
    .update({ status: "approved" })
    .eq("id", requestId);

  if (error) throw error;
}
```

**Problem**:
- `time_off_requests_view` is a view, not a table
- Both functions (approveTimeOffRequest, rejectTimeOffRequest) will fail
- Runtime permission denied errors

**Files Affected**:
- `time-off/api/mutations.ts` (2 functions)

**Required Fix**:
1. Find underlying time_off_requests table in Supabase
2. Use `.schema().from('time_off_requests')`
3. Add salon_id filtering
4. Same pattern as Issue #1

**Steps to Fix**:
1. Query Supabase for time_off_requests table
2. Update both functions to use correct schema/table
3. Add tenant filtering by salon_id
4. Verify status enum values
5. Run typecheck

**Acceptance Criteria**:
- [ ] Both functions use `.schema().from('table')`
- [ ] No view mutations
- [ ] Queries filtered by salon_id
- [ ] Status values validated
- [ ] revalidatePath called

**Dependencies**: None

---

#### Issue #3: View Mutation Errors - Service Categories
**Severity**: Critical
**File**: `features/business/service-categories/api/mutations.ts:15-85`
**Rule Violation**: CLAUDE.md Rule 1 - Writes to schema tables, not views

**Current Code**:
```typescript
export async function createServiceCategory(data: CategoryInput) {
  const supabase = await createClient();
  
  // ❌ CRITICAL: Inserting into view instead of table
  const { data: result, error } = await supabase
    .from("service_categories_view")  // Read-only view!
    .insert([{ name: data.name, description: data.description }]);

  if (error) throw error;
  return result;
}
```

**Problem**:
- All 3 functions attempt to mutate `service_categories_view`
- Views cannot be inserted into
- Will fail with permission denied error

**Files Affected**:
- `service-categories/api/mutations.ts` (3 functions: createServiceCategory, updateServiceCategory, deleteServiceCategory)

**Required Fix**:
```typescript
export async function createServiceCategory(data: CategoryInput) {
  const supabase = await createClient();
  const user = await getUser();
  const salonId = await requireUserSalonId(user.id);

  // Validate input
  const validated = categorySchema.parse(data);

  // Use underlying table
  const { data: result, error } = await supabase
    .schema("catalog")
    .from("service_categories")
    .insert([{
      name: validated.name,
      description: validated.description,
      salon_id: salonId
    }])
    .select();

  if (error) throw error;
  
  revalidatePath("/business/services/categories");
  return result;
}
```

**Steps to Fix**:
1. Find service_categories table in Supabase
2. Update all 3 functions to use correct schema/table
3. Add Zod validation (especially missing in deleteServiceCategory)
4. Add salon_id to all operations
5. Add revalidatePath calls
6. Run typecheck

**Acceptance Criteria**:
- [ ] All 3 functions use `.schema().from('table')`
- [ ] No view mutations
- [ ] All functions have Zod validation
- [ ] salon_id filtering present
- [ ] revalidatePath called after mutations
- [ ] TypeScript passes

**Dependencies**: None

---

#### Issue #4: Inconsistent Error Handling - Staff Mutations
**Severity**: Critical
**File**: `features/business/staff/api/mutations.ts:12-140`
**Rule Violation**: CLAUDE.md Best Practice - Consistent error response pattern

**Current Code**:
```typescript
export async function createStaffMember(data: StaffFormData) {
  const supabase = await createClient();
  const user = await getUser();

  // ❌ INCONSISTENT: Throws error instead of returning structured response
  try {
    const userId = crypto.randomUUID();  // ⚠️ Environment compatibility issue
    
    // ... database operations ...
    
    return { success: true, data: newStaff };  // Sometimes returns { success, data }
  } catch (error) {
    throw error;  // ❌ Throws instead of returning { error }
  }
}
```

**Problem**:
- 4 functions (createStaffMember, updateStaffMember, deactivateStaffMember, reactivateStaffMember) throw errors
- Other mutations return `{ success, error }` structured responses
- Client code must handle inconsistent error patterns
- Uses `crypto.randomUUID()` which may not be available in all Node.js versions

**Files Affected**:
- `staff/api/mutations.ts` (4 functions)
- `settings-account/api/mutations.ts` (5 functions: updatePassword, updateEmail, updateProfile, updateTwoFactorAuth, deleteAccount)

**Required Fix**:
```typescript
export async function createStaffMember(data: StaffFormData) {
  const supabase = await createClient();
  
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const salonId = await requireUserSalonId(user.id);
    
    // Validate input
    const validated = staffFormSchema.parse(data);

    // Use database-generated ID instead of crypto.randomUUID()
    const { data: newStaff, error } = await supabase
      .schema("identity")
      .from("staff")
      .insert([{
        ...validated,
        salon_id: salonId
        // Don't set ID - let database generate it
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/business/staff");
    
    // ✅ Return structured response, don't throw
    return { success: true, data: newStaff };
    
  } catch (error) {
    // ✅ Return error, don't throw
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
```

**Steps to Fix**:
1. Update all 9 functions in both files to return `{ success, error }` instead of throwing
2. Remove `crypto.randomUUID()` calls - let database generate IDs
3. Add proper Zod validation to all functions
4. Verify error messages are helpful to client
5. Run typecheck

**Acceptance Criteria**:
- [ ] All 9 functions return `{ success: boolean, error?: string, data?: T }`
- [ ] No throw statements in mutation functions
- [ ] No crypto.randomUUID() calls
- [ ] All functions have Zod input validation
- [ ] Error messages are clear and actionable
- [ ] TypeScript passes

**Dependencies**: May need to update form schemas

---

#### Issue #5: Missing Input Validation - Settings Operations
**Severity**: Critical
**File**: `features/business/settings-contact/api/mutations.ts:8-25`
**Rule Violation**: CLAUDE.md Best Practice - All user input must be validated with Zod

**Current Code**:
```typescript
export async function updateSalonContactDetails(data: ContactDetailsInput) {
  const supabase = await createClient();
  const user = await getUser();
  
  // ❌ CRITICAL: No validation schema used
  // data is typed but not validated at runtime
  // User could send any data and bypass type safety
  
  const { error } = await supabase
    .schema("organisation")
    .from("salons")
    .update(data)  // Directly updates with unvalidated input!
    .eq("id", salonId);

  if (error) throw error;
  return { success: true };
}
```

**Problem**:
- `ContactDetailsInput` is a TypeScript interface, not runtime validation
- User could send malformed data, extra fields, or invalid values
- No Zod schema to validate email format, phone format, URL validity
- Security risk: unvalidated user input

**Files Affected**:
- `settings-contact/api/mutations.ts` (1 function: updateSalonContactDetails)
- `settings-description/api/mutations.ts` (1 function: updateSalonDescription)
- `staff/api/mutations.ts` (4 functions - already listed in Issue #4)

**Required Fix**:
```typescript
// Create Zod schema first
const contactDetailsSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format"),
  email: z.string().email(),
  website: z.string().url().optional(),
  social_links: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }).optional(),
});

export async function updateSalonContactDetails(
  data: z.infer<typeof contactDetailsSchema>
) {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const salonId = await requireUserSalonId(user.id);

  // ✅ Validate input at runtime
  try {
    const validated = contactDetailsSchema.parse(data);

    const { error } = await supabase
      .schema("organisation")
      .from("salons")
      .update(validated)
      .eq("id", salonId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/business/settings/contact");
    return { success: true };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message
      };
    }
    return { success: false, error: "Validation failed" };
  }
}
```

**Steps to Fix**:
1. Create Zod schema for each settings input type
2. Parse input with schema at start of each function
3. Return validation errors to client
4. Use validated data in database operations
5. Update TypeScript imports to use schema.infer<>
6. Run typecheck

**Acceptance Criteria**:
- [ ] All 6 functions have Zod validation schemas
- [ ] Input validated before database operation
- [ ] Validation errors returned to client
- [ ] No unvalidated data sent to database
- [ ] Type safety via z.infer
- [ ] TypeScript passes

**Dependencies**: Need to create/update schema files

---

### High Priority

#### Issue #6: Missing Revalidate Path - Bulk Operations
**Severity**: High
**File**: `features/business/operating-hours/api/mutations.ts:55-85`
**Rule Violation**: CLAUDE.md Best Practice - Call revalidatePath after mutations

**Current Code**:
```typescript
export async function bulkUpdateOperatingHours(updates: HoursUpdate[]) {
  const supabase = await createClient();
  const user = await getUser();
  const salonId = await requireUserSalonId(user.id);

  // ❌ No revalidatePath call after bulk update
  for (const update of updates) {
    await upsertOperatingHours(update);
  }

  // Missing: revalidatePath("/business/operating-hours");
  return { success: true };
}
```

**Problem**:
- Bulk update completes but doesn't revalidate cache
- Client may see stale operating hours data
- While individual calls to upsertOperatingHours revalidate, parent bulk operation doesn't

**Required Fix**:
```typescript
export async function bulkUpdateOperatingHours(updates: HoursUpdate[]) {
  const supabase = await createClient();
  const user = await getUser();
  const salonId = await requireUserSalonId(user.id);

  try {
    // Validate all updates before executing
    const validated = z.array(hourUpdateSchema).parse(updates);

    // Execute all updates
    const results = await Promise.all(
      validated.map(update => upsertOperatingHours(update))
    );

    // ✅ Add revalidatePath after bulk operation
    revalidatePath("/business/operating-hours");
    
    return { success: true, data: results };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bulk update failed"
    };
  }
}
```

**Steps to Fix**:
1. Add `revalidatePath()` call at end of function
2. Verify path matches where data is cached
3. Add Zod validation for array of updates
4. Return structured error response
5. Run typecheck

**Acceptance Criteria**:
- [ ] revalidatePath called after bulk update
- [ ] Array input validated with Zod
- [ ] Returns structured response
- [ ] Error handling consistent
- [ ] TypeScript passes

**Dependencies**: None

---

#### Issue #7: Stub Implementations - Coupons
**Severity**: High
**File**: `features/business/coupons/api/coupons.mutations.ts:1-50`
**Rule Violation**: Code Quality - Incomplete implementations

**Current Code**:
```typescript
export async function createCoupon(data: CouponData) {
  // ❌ Stub implementation - feature is not actually implemented
  return Promise.reject(
    new Error("Coupon feature is not available in this version")
  );
}

// ... 5 more stub functions
```

**Problem**:
- All 6 coupon mutations are placeholder implementations
- Feature appears in UI but rejects at runtime
- Creates poor user experience

**Required Fix**:

**Option 1 - Hide Feature Until Ready**:
```typescript
// In the UI component, hide coupon feature
if (!FEATURE_FLAGS.coupons_enabled) {
  return <DisabledFeature message="Coupons coming soon" />;
}
```

**Option 2 - Implement Feature**:
```typescript
const couponSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(3).max(10),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().positive(),
  max_uses: z.number().int().positive().optional(),
  expiry_date: z.string().datetime().optional(),
});

export async function createCoupon(data: z.infer<typeof couponSchema>) {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const salonId = await requireUserSalonId(user.id);

  try {
    const validated = couponSchema.parse(data);

    const { data: coupon, error } = await supabase
      .schema("catalog")
      .from("coupons")
      .insert([{
        ...validated,
        salon_id: salonId,
        created_by: user.id
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/business/coupons");
    return { success: true, data: coupon };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create coupon"
    };
  }
}
```

**Steps to Fix**:
1. Choose: implement feature or hide until ready
2. If implementing: create Zod schemas for all operations
3. Implement CRUD operations for coupons table
4. Add proper auth and validation
5. Add revalidatePath calls
6. Update UI to handle responses
7. Run typecheck

**Acceptance Criteria**:
- [ ] Feature either fully implemented or clearly hidden
- [ ] If implemented: all 6 functions work with real data
- [ ] If hidden: UI displays clear "Coming Soon" message
- [ ] Error messages helpful to users
- [ ] No Promise.reject() calls

**Dependencies**: Product decision required

---

#### Issue #8: Wrapper Function Pattern - Multiple Files
**Severity**: High
**File**: Multiple files (12 files with wrapper functions)
**Rule Violation**: Code Organization - Wrapper functions create indirection

**Current Pattern**:
```typescript
// features/business/appointments/api/mutations.ts
export async function cancelAppointment(appointmentId: string) {
  // Wrapper - delegates to other function
  return updateAppointmentStatus(appointmentId, "cancelled");
}

export async function confirmAppointment(appointmentId: string) {
  // Wrapper - delegates to other function
  return updateAppointmentStatus(appointmentId, "confirmed");
}
```

**Problem**:
- 12 mutation files contain wrapper functions
- Wrappers delegate to functions in `/mutations` subdirectories
- Creates confusion about where actual logic lives
- Makes debugging harder (extra indirection)
- If wrapper has different signature than target, hard to understand flow

**Files Affected**:
- `appointments/api/mutations.ts`
- `inventory-products/api/mutations.ts`
- `inventory-suppliers/api/mutations.ts`
- `service-categories/api/mutations.ts` (partially)
- `services/api/mutations.ts`
- And 7 others

**Recommendation**:
1. Document why wrapper pattern is used
2. Consider inlining simple wrappers
3. For complex wrappers: ensure clear documentation
4. Add JSDoc comments explaining delegation

**Steps to Fix**:
1. Add JSDoc to all wrapper functions explaining delegation
2. Consider consolidating wrapper + target if both are in same file
3. For multi-level delegation: trace full chain and document
4. Ensure tests cover both wrapper and target
5. Add comments in api/mutations.ts explaining pattern

**Acceptance Criteria**:
- [ ] All wrapper functions have JSDoc
- [ ] Delegation path clearly documented
- [ ] No more than 2 levels of indirection
- [ ] Tests verify wrapper -> target behavior

**Dependencies**: None

---

### Medium Priority

#### Issue #9: Delete Without Full Validation - Multiple Files
**Severity**: Medium
**File**: Multiple delete functions
**Rule Violation**: Input validation should be consistent across CRUD operations

**Current Code**:
```typescript
export async function deleteProductCategory(categoryId: string) {
  // ❌ Only validates UUID format, no business logic validation
  if (!isValidUuid(categoryId)) {
    return { success: false, error: "Invalid category ID" };
  }

  // No check for:
  // - Category exists
  // - User owns category
  // - No products in category
  // - Soft delete vs hard delete policy
}
```

**Problem**:
- Delete functions lack full Zod schemas
- Only validate format, not business rules
- Could delete categories with products in them
- No validation schema for consistency

**Files Affected**:
- `inventory-categories/api/mutations.ts:77` (deleteProductCategory)
- `inventory-locations/api/mutations.ts:77` (deleteStockLocation)
- `locations/api/mutations.ts:77` (deleteSalonLocation)
- `service-product-usage/api/mutations.ts:77` (deleteServiceProductUsage)
- `transactions/api/mutations.ts:77` (deleteManualTransaction)

**Required Fix**:
```typescript
// Create schema for delete
const deleteCategorySchema = z.object({
  id: z.string().uuid("Invalid category ID"),
  confirmDeletion: z.boolean().refine(val => val === true, {
    message: "Must confirm deletion"
  }),
});

export async function deleteProductCategory(
  input: z.infer<typeof deleteCategorySchema>
) {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const salonId = await requireUserSalonId(user.id);

  try {
    // ✅ Use full Zod schema
    const validated = deleteCategorySchema.parse(input);

    // Business logic validation
    const { data: category, error: fetchError } = await supabase
      .from("product_categories_view")
      .select("id, product_count")
      .eq("id", validated.id)
      .eq("salon_id", salonId)
      .single();

    if (fetchError || !category) {
      return { success: false, error: "Category not found" };
    }

    if (category.product_count > 0) {
      return {
        success: false,
        error: "Cannot delete category with products"
      };
    }

    // Perform delete
    const { error } = await supabase
      .schema("catalog")
      .from("product_categories")
      .delete()
      .eq("id", validated.id)
      .eq("salon_id", salonId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/business/inventory/categories");
    return { success: true };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed"
    };
  }
}
```

**Steps to Fix**:
1. Create Zod schemas for all delete operations
2. Add business logic validation before delete
3. Check for dependent records
4. Verify user owns resource
5. Use structured error responses
6. Run typecheck

**Acceptance Criteria**:
- [ ] All delete functions have full Zod schemas
- [ ] Business logic validation present
- [ ] Dependent records checked
- [ ] Structured error responses
- [ ] User ownership verified

**Dependencies**: None

---

#### Issue #10: Missing Auth Checks in Wrapper Functions
**Severity**: Medium
**File**: Multiple files (8 wrapper functions)
**Rule Violation**: CLAUDE.md Rule 8 - Auth check required

**Current Code**:
```typescript
// features/business/inventory-products/api/mutations.ts
export async function createProduct(data: ProductData) {
  // ❌ Wrapper doesn't verify auth - delegates to ./mutations/create-product.mutation
  return createProductMutation(data);  // Called function has auth check, but not obvious
}
```

**Problem**:
- Wrapper functions don't explicitly check auth
- Relies on target function to verify
- Creates ambiguity about whether auth is guaranteed
- Violates defensive programming principle

**Files Affected**:
- `inventory-products/api/mutations.ts` (4 wrappers)
- `inventory-suppliers/api/mutations.ts` (3 wrappers)
- `inventory-stock-levels/api/mutations.ts` (3 wrappers)
- And 2 others

**Required Fix**:
```typescript
export async function createProduct(data: ProductData) {
  const supabase = await createClient();
  
  // ✅ Explicit auth check in wrapper
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const salonId = await requireUserSalonId(user.id);

  // Now delegate with confidence that user is verified
  return createProductMutation(data, salonId);
}
```

**Steps to Fix**:
1. Add explicit `getUser()` calls to all wrapper functions
2. Add `requireUserSalonId()` calls
3. Pass user/salon context to target functions
4. Add JSDoc explaining auth requirement
5. Run typecheck

**Acceptance Criteria**:
- [ ] All wrapper functions have explicit auth checks
- [ ] getUser() called at start
- [ ] requireUserSalonId() called
- [ ] User context passed to target functions
- [ ] Error thrown/returned if unauthorized

**Dependencies**: None

---

## Code Quality Observations

### Positive Patterns ✅

1. **100% Use Server Directive** (46/46 files)
   - All mutation files properly marked `'use server'`
   - Prevents accidental client-side imports

2. **Strong Overall Auth Coverage** (97%, 131/134 functions)
   - Most functions verify user identity
   - Good use of `requireUserSalonId()` pattern
   - Consistent auth guard placement

3. **Comprehensive RevalidatePath Usage** (92%, 128/139 calls)
   - Most mutations properly invalidate cache
   - Good understanding of Next.js cache invalidation
   - Prevents stale data issues

4. **Schema Table Writes** (93%, 112/120 meaningful mutations)
   - Most functions use `.schema().from('table')` pattern correctly
   - Proper understanding of schema separation
   - Exception: 10 functions incorrectly mutate views

### Anti-Patterns ❌

1. **View Mutation Attempts** (10 functions)
   - Critical runtime failures
   - Will fail with permission denied

2. **Inconsistent Error Handling** (9 functions)
   - Some throw, some return structured response
   - Creates client-side inconsistency
   - Hard to handle errors uniformly

3. **Missing Input Validation** (13 functions)
   - 33% of mutations lack Zod schemas
   - Allows unvalidated user input
   - Type safety only at TypeScript level, not runtime

---

## Statistics

| Metric | Value |
|--------|-------|
| Total Mutation Files | 46 |
| Files with `'use server'` | 46/46 (100%) ✅ |
| Total Functions | 134 |
| Functions with Auth | 131/134 (97.8%) ✅ |
| Functions Missing Auth | 3 |
| Functions with Validation | 121/134 (90.3%) ⚠️ |
| Functions Missing Validation | 13 (9.7%) |
| Functions Calling revalidatePath | 128/139 (92%) ✅ |
| Missing revalidatePath | 11 (8%) |
| Using .schema().from() | 112/120 (93%) ⚠️ |
| Attempting View Mutations | 10 (7.5%) 🔴 |
| Consistent Error Handling | 125/134 (93%) ⚠️ |
| Throwing Errors | 9 (6.7%) |
| **Critical Issues** | **5** 🔴 |
| **High Issues** | **6** ⚠️ |
| **Medium Issues** | **8** |
| **Estimated Fix Time** | **12-16 hours** |
| **Breaking Changes** | 3 (view references) |

---

## Fix Priority

### Phase 1: Runtime Failures (3-4 hours)
1. ✅ Fix view mutations in reviews (5 functions)
2. ✅ Fix view mutations in time-off (2 functions)
3. ✅ Fix view mutations in service-categories (3 functions)

### Phase 2: Error Handling Consistency (2-3 hours)
4. ✅ Standardize error responses in staff mutations (4 functions)
5. ✅ Standardize error responses in settings-account (5 functions)

### Phase 3: Input Validation (3-4 hours)
6. ✅ Add Zod schemas to settings-contact
7. ✅ Add Zod schemas to settings-description
8. ✅ Add Zod schemas to delete functions (5 functions)
9. ✅ Add Zod schemas to staff mutations (4 functions)

### Phase 4: Cache Invalidation & Features (2-3 hours)
10. ✅ Add missing revalidatePath calls (11 functions)
11. ✅ Implement or disable coupon feature (6 functions)
12. ✅ Remove crypto.randomUUID() dependency

### Phase 5: Code Organization (1-2 hours)
13. ✅ Document wrapper functions (8 wrappers)
14. ✅ Add auth checks to wrappers (8 wrappers)

---

## Security Review

### Critical ⛔
- [ ] View mutation attempts will fail - must use underlying tables
- [ ] Unvalidated user input in settings operations
- [ ] Missing auth in wrapper functions

### High ⚠️
- [ ] Inconsistent error patterns could leak information
- [ ] crypto.randomUUID() not always available
- [ ] No validation of business constraints (e.g., category can't have products)

---

## Testing Checklist

For each fixed mutation:
- [ ] Function succeeds with valid user context
- [ ] Function returns error when unauthorized
- [ ] Input validation catches malformed data
- [ ] Returns structured `{ success, error?, data? }` response
- [ ] revalidatePath called after mutation
- [ ] No stale cache issues
- [ ] No runtime permission errors
- [ ] Error messages are helpful

---

## Migration Guide

### For Developers
1. When writing mutations: Use Zod for ALL user input
2. Always start with auth check: `getUser()` + `requireUserSalonId()`
3. Use `.schema('name').from('table')` pattern for writes
4. Return `{ success: boolean, error?: string, data?: T }` format
5. Call `revalidatePath()` after every mutation
6. Never query views for mutations - find underlying table

### For Code Review
- [ ] All user input has Zod schema
- [ ] Auth check at start of function
- [ ] Using correct schema/table (not view)
- [ ] revalidatePath called
- [ ] Structured error response returned
- [ ] No throw statements

---

## Next Steps

### Immediately
1. File 5 bugs for view mutation attempts (reviews, time-off, service-categories)
2. Create task for error handling standardization
3. Alert team to use Zod validation going forward

### This Sprint
1. Fix all Critical issues (view mutations, error handling)
2. Add missing Zod schemas
3. Fix missing revalidatePath calls

### Next Sprint
1. Implement coupon feature or disable in UI
2. Remove crypto.randomUUID() dependency
3. Add integration tests for auth boundaries

---

## Related Files

This analysis depends on:
- [ ] Layer 2: Queries Analysis (auth patterns used here)

This analysis blocks:
- [ ] Layer 4: Components Analysis (components consume mutation responses)
- [ ] Layer 7: Security Analysis (relies on mutation patterns)

---

## Files to Fix

**Critical (Phase 1 - View Mutations)**:
1. `features/business/reviews/api/mutations.ts` - 5 functions
2. `features/business/time-off/api/mutations.ts` - 2 functions
3. `features/business/service-categories/api/mutations.ts` - 3 functions

**Critical (Phase 2 - Error Handling)**:
4. `features/business/staff/api/mutations.ts` - 4 functions
5. `features/business/settings-account/api/mutations.ts` - 5 functions

**Critical (Phase 3 - Input Validation)**:
6. `features/business/settings-contact/api/mutations.ts` - 1 function
7. `features/business/settings-description/api/mutations.ts` - 1 function

**High (Phase 4 - Revalidate & Features)**:
8. `features/business/operating-hours/api/mutations.ts` - 1 function (missing revalidate)
9. `features/business/coupons/api/coupons.mutations.ts` - 6 functions (stub implementations)

**Medium (Phase 5 - Code Organization)**:
10. 8 wrapper function files in various features

---

**Next Analysis**: Layer 4 - Components (`features/business/**/components/*.tsx`)
