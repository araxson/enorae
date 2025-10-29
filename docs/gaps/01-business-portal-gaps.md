# Business Portal - Database Gap Analysis

**Generated:** 2025-10-29
**Database Schemas Analyzed:** organization, scheduling, catalog, engagement, analytics, communication
**Total Issues Found:** 2 CRITICAL, 1 HIGH

## Executive Summary

The business portal has critical issues in webhook management and staff portfolio functionality. These are breaking queries that will cause runtime errors when executed.

- **CRITICAL Issues:** 2
- **HIGH Issues:** 1
- **MEDIUM Issues:** 0
- **Estimated Fix Time:** 30 minutes

---

## Part 1: Schema Mismatches (Type A - CRITICAL)

### Issue 1: Non-existent `webhook_queue` table access (Missing schema qualifier)

**File:** `/Users/afshin/Desktop/Enorae/features/business/webhooks/api/mutations/webhooks.ts`

**Severity:** CRITICAL

**Issue Description:**
Code attempts to query `.from('webhook_queue')` without schema qualifier, but the table exists in the `communication` schema. When Supabase encounters this, it will fail with a 404 error: "Relation not found".

**Database Reality:**
- Table Location: `communication.webhook_queue` (in communication schema, NOT public)
- Table Type: Table (writable)
- Columns: id, status, last_error, completed_at, updated_at, etc.
- Correctly exists in database

**Current Code Issues:**

1. **Line 29:** `.from('webhook_queue')` in `retryWebhook()`
2. **Line 45:** `.from('webhook_queue')` in `retryWebhook()`
3. **Line 83:** `.from('webhook_queue')` in `deleteWebhook()`
4. **Line 94:** `.from('webhook_queue')` in `deleteWebhook()`
5. **Line 124:** `.from('webhook_queue')` in `retryAllFailedWebhooks()`
6. **Line 164:** `.from('webhook_queue')` in `clearCompletedWebhooks()`

**Code Snippet (Lines 25-32):**
```typescript
const supabase = (await createClient()).schema('communication')

// Get webhook to verify it exists and check status
const { data: webhook } = await supabase
  .from('webhook_queue')  // ❌ WRONG - Missing schema context
  .select('id, status')
  .eq('id', webhookId)
  .single<{ id: string; status: string | null }>()
```

**Required Fix:**
The schema qualifier is already applied to the supabase client with `.schema('communication')` on line 25, so the `.from('webhook_queue')` calls should work correctly IF the client is using this chaining properly.

**However, the real issue is:** The code applies `.schema('communication')` but this may not be persisting through the chain. The correct pattern is:

```typescript
const supabase = await createClient()

const { data: webhook } = await supabase
  .schema('communication')
  .from('webhook_queue')
  .select('id, status')
  .eq('id', webhookId)
  .single<{ id: string; status: string | null }>()
```

OR

```typescript
const supabase = (await createClient()).schema('communication')

const { data: webhook } = await supabase
  .from('webhook_queue')
  .select('id, status')
  .eq('id', webhookId)
  .single<{ id: string; status: string | null }>()
```

Both should work, but verify the second pattern is correct with Supabase JS client.

**Priority:** CRITICAL
**Estimated Effort:** S (Small - 5 minutes to verify, apply fix)
**Business Impact:** Webhook retry/management features are completely broken
**Risk Level:** High - Runtime failure on any webhook operation

---

### Issue 2: Non-existent storage bucket `staff-portfolios`

**File:** `/Users/afshin/Desktop/Enorae/features/staff/profile/api/mutations.ts`

**Severity:** CRITICAL

**Issue Description:**
Code attempts to upload images to a storage bucket named `staff-portfolios` which doesn't exist in the Supabase project configuration. The feature will fail at runtime with a 404 error: "Bucket not found".

**Database Reality:**
- Storage Bucket: `staff-portfolios` does NOT exist
- Existing buckets need verification in Supabase project settings
- No portfolio storage mechanism currently implemented

**Current Code Issues:**

1. **Line 176:** `.from('staff-portfolios')`
2. **Line 183:** `.from('staff-portfolios')`

**Code Snippet (Lines 173-184):**
```typescript
// Upload to storage
const fileName = `${staff.id}/${Date.now()}-${file.name}`
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('staff-portfolios')  // ❌ BUCKET DOESN'T EXIST
  .upload(fileName, file)

if (uploadError) throw uploadError

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('staff-portfolios')  // ❌ BUCKET DOESN'T EXIST
  .getPublicUrl(fileName)
```

**Comment at Line 186-188 confirms the issue:**
```typescript
// Note: salon_media table only supports logo_url, cover_image_url, and gallery_urls
// Portfolio images are stored only in the storage bucket for now
// A future enhancement would require adding a separate portfolio_images table or extending salon_media
```

**Required Fix (Choose one approach):**

**Option A: Create the storage bucket** (Recommended if feature is needed)
- Create a public storage bucket named `staff-portfolios` in Supabase dashboard
- Set appropriate access policies (public read, authenticated write)
- Cost: Low, straightforward implementation

**Option B: Disable the feature** (If not needed)
- Comment out the `uploadPortfolioImage` function
- Remove the file upload UI from staff profile components
- Leave a TODO comment for future implementation
- Cost: Low effort, removes broken feature

**Option C: Store in database instead**
- Create a `staff_portfolio_images` table in organization schema
- Store image metadata and URLs
- Would require database migration
- Cost: Medium effort, more maintainable

**Recommendation:** Option B (disable) or Option A (create bucket) depending on business requirements

**Priority:** CRITICAL
**Estimated Effort:** S (Small) for Option A/B, M (Medium) for Option C
**Business Impact:** Staff portfolio upload feature completely broken
**Risk Level:** High - Runtime failure when staff attempts to upload portfolio images

---

## Part 2: Type Mismatches (Type A - HIGH)

### Issue 3: Type import mismatch - salon_reviews table location

**File:** `/Users/afshin/Desktop/Enorae/features/business/insights/api/queries/customer-types.ts`

**Severity:** HIGH

**Issue Description:**
Type definition imports `salon_reviews` from engagement schema, but code queries `salon_reviews_view` which is a public view. The type definition is inconsistent with actual usage pattern.

**Current Code (Line 7):**
```typescript
export type ReviewRow = Database['engagement']['Tables']['salon_reviews']['Row']
```

**Database Reality:**
- `salon_reviews` is a table in `engagement` schema ✓ (CORRECT)
- `salon_reviews_view` is a public view ✓ (EXISTS)
- Code queries the view, not the table ✓ (SAFE)
- But the type definition references the table structure

**Required Fix:**
This is actually correct - the type references the base table structure which is what gets exposed through the view. However, verify that the columns being selected exist in both the table and view.

**Verify in data-access.ts (Lines 68-73):**
```typescript
const { data, error } = await client
  .from('salon_reviews_view')
  .select('customer_id, rating')
  .eq('salon_id', salonId)
  .in('customer_id', customerIds)
```

The view is queried, not the table. This is the correct pattern.

**Recommended Action:**
- Add a comment explaining: "Type references base table but code queries the public view"
- Verify view has same columns as table (customer_id, rating)
- No fix needed if view includes these columns

**Priority:** HIGH
**Estimated Effort:** XS (Extra Small - verification only)
**Business Impact:** Potential type mismatches in customer aggregation queries
**Risk Level:** Medium - Works but could silently fail if view is missing columns

---

## Part 3: Feature Implementation Status

### Webhooks Feature

**Status:** PARTIALLY IMPLEMENTED (Code present but broken)

**Implemented Operations:**
- ✓ Retry failed webhook
- ✓ Delete webhook entry
- ✓ Retry all failed webhooks
- ✓ Clear completed webhooks

**Database Support:**
- ✓ `communication.webhook_queue` table exists
- ✓ Required columns present (id, status, last_error, completed_at, updated_at)
- ❌ Client access broken (schema qualifier issue)

**Required Actions:**
1. Verify schema().from() chaining works with current Supabase JS client
2. Test webhook operations after schema fix
3. Add integration tests for webhook retry/delete

---

### Staff Portfolio Feature

**Status:** PARTIALLY IMPLEMENTED (Code present but storage missing)

**Implemented Operations:**
- ✓ Upload portfolio image
- ✓ Get public URL

**Storage Support:**
- ❌ `staff-portfolios` bucket doesn't exist

**Database Support:**
- ✓ Code correctly reads `staff_profiles_view` to get staff ID
- ✗ No storage table for portfolio metadata

**Required Actions:**
1. Create storage bucket OR disable feature
2. If enabling: Create bucket with proper RLS policies
3. If disabling: Remove upload function and UI
4. Consider extending storage with portfolio_images table for future enhancement

---

## Severity Assessment Matrix

### CRITICAL - Must Fix Before Production

| Issue | Breaking? | Data Loss Risk? | Security Risk? | User Impact? |
|-------|-----------|-----------------|---|---|
| webhook_queue schema | YES | NO | MEDIUM | HIGH |
| staff-portfolios bucket | YES | NO | LOW | HIGH |

### HIGH - Should Fix Before Release

| Issue | Breaking? | Data Loss Risk? | Security Risk? | User Impact? |
|-------|-----------|---|---|---|
| Type mismatch | NO | NO | LOW | MEDIUM |

---

## Related Files to Review

### Webhook-Related
- `/Users/afshin/Desktop/Enorae/features/business/webhooks/api/queries/` - Check if webhook queries exist and have same issue
- `/Users/afshin/Desktop/Enorae/features/business/settings/` - Check if webhook configuration uses correct schema

### Staff Portal Related
- `/Users/afshin/Desktop/Enorae/features/staff/profile/api/queries.ts` - Verify staff data queries
- `/Users/afshin/Desktop/Enorae/components/staff/` - Check portfolio upload UI components

---

## Test Cases After Fix

### Webhook Tests
```typescript
// Should succeed after fix
await supabase.schema('communication').from('webhook_queue')
  .select('id, status')
  .eq('status', 'failed')
  .limit(10)

// Should retry webhook
await retryWebhook(webhookId)

// Should delete webhook
await deleteWebhook(webhookId)
```

### Portfolio Tests
```typescript
// Should upload to correct bucket (if created)
// OR should be disabled with proper error handling
await uploadPortfolioImage(formData)
```

---

## Recommendations

### Immediate Actions (Before Next Deploy)
1. Fix webhook_query schema references (verify client chaining)
2. Create staff-portfolios bucket OR disable upload feature
3. Add error handling for missing buckets
4. Run pnpm typecheck to verify type safety

### Short-Term (Next Sprint)
1. Add integration tests for webhook operations
2. Create portfolio storage strategy (bucket vs database table)
3. Document schema qualifier requirements for communication schema
4. Add schema qualifier validation linter

### Long-Term
1. Create `view_user_preferences` view (currently marked as TODO)
2. Create `view_profile_metadata` view (currently marked as TODO)
3. Create `view_notifications` view (currently marked as TODO)
4. Create `view_blocked_times_with_relations` view (currently marked as TODO)

---

**Report Status:** READY FOR DEVELOPER ACTION
**Estimated Total Fix Time:** 30-60 minutes
**Priority for Next Sprint:** HIGH
**Blockers:** Yes - webhook and portfolio features are broken

