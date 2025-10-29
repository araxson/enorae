# Priority Matrix & Action Plan

**Generated:** 2025-10-29
**Total Issues to Fix:** 6
**Estimated Total Effort:** 1-2 hours
**Risk Level:** MEDIUM (2 CRITICAL issues blocking features)

---

## CRITICAL Priority - Fix Immediately

### 1. Fix webhook_queue schema access

**Status:** ❌ NEEDS FIX
**File:** `/Users/afshin/Desktop/Enorae/features/business/webhooks/api/mutations/webhooks.ts`
**Lines:** 25, 29, 45, 83, 94, 124, 164
**Severity:** CRITICAL
**Effort:** S (5 minutes)
**Business Impact:** Webhook retry/management completely broken

**Action Items:**
- [ ] Verify `.schema('communication')` chaining works with Supabase JS client v2
- [ ] Test the schema() call pattern to ensure it persists through .from() calls
- [ ] If chaining doesn't persist, refactor to apply schema with each query
- [ ] Add unit tests for webhook operations
- [ ] Deploy and test in development environment

**Code Change Needed:**
```diff
// Current (Line 25-32)
const supabase = (await createClient()).schema('communication')
const { data: webhook } = await supabase
  .from('webhook_queue')
  .select('id, status')

// Verify this works, or change to:
const supabase = await createClient()
const { data: webhook } = await supabase
  .schema('communication')
  .from('webhook_queue')
  .select('id, status')
```

**Testing Checklist:**
```bash
# After fix, test:
1. Fetch webhook list
2. Retry a webhook
3. Delete a webhook
4. Bulk retry webhooks
5. Clear old webhooks
```

**Risk:** Low - straightforward schema qualifier fix
**Rollback:** Easy - revert code change

**Priority Score:** 10/10 (CRITICAL - breaks core feature)

---

### 2. Fix or disable staff portfolio upload feature

**Status:** ❌ NEEDS FIX
**File:** `/Users/afshin/Desktop/Enorae/features/staff/profile/api/mutations.ts`
**Lines:** 176, 183
**Severity:** CRITICAL
**Effort:** S (10 minutes for Option B) to M (30 minutes for Option A)
**Business Impact:** Staff portfolio upload broken, users get 404 error

**Action Items - CHOOSE ONE APPROACH:**

#### OPTION A: Create Storage Bucket (If feature is required)
- [ ] Open Supabase dashboard
- [ ] Navigate to Storage
- [ ] Create new bucket named `staff-portfolios`
- [ ] Set bucket to PUBLIC for reads
- [ ] Create RLS policy: Allow authenticated users to upload
- [ ] Create RLS policy: Allow public reads
- [ ] Test upload function with test file
- [ ] Add error handling for bucket creation failures
- [ ] Document bucket policies

**Bucket Configuration (Recommended):**
```sql
-- RLS Policy for uploads (authenticated users only)
create policy "Allow authenticated users to upload portfolio images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'staff-portfolios');

-- RLS Policy for reads (public)
create policy "Allow public read access to portfolio images"
on storage.objects
for select
to public
using (bucket_id = 'staff-portfolios');
```

**Effort:** ~15 minutes (just configuration)

#### OPTION B: Disable Feature (If not needed)
- [ ] Remove `uploadPortfolioImage` export from mutations.ts
- [ ] Comment out function with TODO
- [ ] Find and remove upload UI from staff profile components
- [ ] Add error message for users attempting upload
- [ ] Document in CHANGELOG that feature is deferred

**Effort:** ~10 minutes

#### OPTION C: Store in Database (If scalability needed)
- [ ] Create `organization.staff_portfolio_images` table
  - Fields: id, staff_id, image_url, display_order, created_at, deleted_at
- [ ] Migrate upload logic to use table storage
- [ ] Add image deletion function
- [ ] Test full CRUD operations

**Effort:** ~45 minutes (full feature implementation)

**Recommendation:** **Option A** (Create bucket) if feature is in roadmap, **Option B** (Disable) if not needed soon

**Testing Checklist (Option A):**
```bash
1. Upload small image (< 1MB)
2. Verify public URL works
3. Upload large image (> 5MB) - should fail
4. Upload wrong file type - should fail
5. Test concurrent uploads
6. Verify deletion cleanup
```

**Risk Level:** Low for Option A/B, Medium for Option C
**Rollback:** Easy for all options

**Priority Score:** 10/10 (CRITICAL - blocks user feature)

---

## HIGH Priority - Fix This Sprint

### 3. Verify Type Definition Consistency

**Status:** ⚠️ NEEDS VERIFICATION
**File:** `/Users/afshin/Desktop/Enorae/features/business/insights/api/queries/customer-types.ts`
**Line:** 7
**Severity:** HIGH
**Effort:** XS (2 minutes verification)
**Business Impact:** Potential type mismatches in customer analytics

**Action Items:**
- [ ] Verify `salon_reviews` table in `engagement` schema has columns: customer_id, rating
- [ ] Verify `salon_reviews_view` in public schema includes same columns
- [ ] Add comment explaining table vs view pattern
- [ ] Run `pnpm typecheck` to verify no errors
- [ ] Test customer aggregation query end-to-end

**Code Review Checklist:**
```typescript
// File: customer-types.ts (Line 7)
export type ReviewRow = Database['engagement']['Tables']['salon_reviews']['Row']
// ✓ This should match the columns used in data-access.ts line 70

// File: data-access.ts (Line 68-73)
const { data, error } = await client
  .from('salon_reviews_view')
  .select('customer_id, rating')  // ✓ Verify these columns exist in view
```

**Verification SQL (if needed):**
```sql
-- Check table columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'engagement' AND table_name = 'salon_reviews'
AND column_name IN ('customer_id', 'rating');

-- Check view columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'salon_reviews_view'
AND column_name IN ('customer_id', 'rating');
```

**Risk:** Low - verification only, no code changes
**Rollback:** N/A - read-only verification

**Priority Score:** 8/10 (HIGH - type safety)

---

## MEDIUM Priority - Plan for Next Sprint

### 4. Create `view_user_preferences` view

**Status:** 📋 PLANNED (Currently using table fallback)
**File:** `/Users/afshin/Desktop/Enorae/features/shared/preferences/api/queries.ts`
**Line:** 9 (TODO comment)
**Severity:** MEDIUM
**Effort:** M (20 minutes)
**Business Impact:** User preference queries work but could be cleaner

**Action Items:**
- [ ] Design view structure combining:
  - `profiles_preferences` table data
  - `profiles` table context
  - Default values for missing preferences
- [ ] Create view in identity schema
- [ ] Update all queries to use view
- [ ] Test preference reads/writes
- [ ] Document view structure

**View Definition Template:**
```sql
CREATE VIEW identity.view_user_preferences AS
SELECT
  pp.profile_id,
  pp.preference_key,
  pp.preference_value,
  COALESCE(pp.updated_at, p.created_at) as last_updated,
  p.id as profile_id_ref
FROM identity.profiles_preferences pp
LEFT JOIN identity.profiles p ON pp.profile_id = p.id
WHERE p.deleted_at IS NULL;
```

**Update queries.ts:**
```diff
// Change from table to view
- const { data, error } = await supabase
-   .schema('identity')
-   .from('profiles_preferences')
+ const { data, error } = await supabase
+   .from('view_user_preferences')
```

**Risk:** Low - view-only change
**Rollback:** Easy - revert to table query

**Priority Score:** 5/10 (MEDIUM - nice-to-have, works via table now)

---

### 5. Create `view_profile_metadata` view

**Status:** 📋 PLANNED (Currently using table fallback)
**File:** `/Users/afshin/Desktop/Enorae/features/shared/profile-metadata/api/queries.ts`
**Line:** 8 (TODO comment)
**Severity:** MEDIUM
**Effort:** M (20 minutes)
**Business Impact:** Profile metadata queries work but could be cleaner

**Action Items:**
- [ ] Design view structure:
  - `profiles_metadata` table fields
  - Profile context from `profiles` table
  - Computed fields for metadata analysis
- [ ] Create view in identity schema
- [ ] Update all queries to use view
- [ ] Test metadata reads/writes
- [ ] Document view purpose

**View Definition Template:**
```sql
CREATE VIEW identity.view_profile_metadata AS
SELECT
  pm.*,
  p.username,
  p.email,
  ARRAY_LENGTH(pm.interests, 1) as interest_count,
  ARRAY_LENGTH(pm.tags, 1) as tag_count,
  p.updated_at as profile_updated_at
FROM identity.profiles_metadata pm
LEFT JOIN identity.profiles p ON pm.profile_id = p.id
WHERE p.deleted_at IS NULL;
```

**Risk:** Low - view-only change
**Rollback:** Easy - revert to table query

**Priority Score:** 5/10 (MEDIUM - nice-to-have, works via table now)

---

### 6. Create `view_notifications` view

**Status:** 📋 PLANNED (Currently using table fallback)
**File:** `/Users/afshin/Desktop/Enorae/features/shared/notifications/api/queries.ts`
**Line:** TODO comment
**Severity:** MEDIUM
**Effort:** M (25 minutes)
**Business Impact:** Notification queries work but could filter archived

**Action Items:**
- [ ] Design view for active notifications only
- [ ] Combine notification content with metadata
- [ ] Add computed columns (is_unread, age_in_minutes)
- [ ] Create view in communication schema
- [ ] Update all queries to use view
- [ ] Test filtering/sorting

**Risk:** Medium - depends on table structure
**Rollback:** Easy - revert to table query

**Priority Score:** 5/10 (MEDIUM - works without view)

---

## LOW Priority - Future Enhancement

### 7. Create `view_blocked_times_with_relations` view

**Status:** 📋 PLANNED (Currently using table fallback)
**File:** `/Users/afshin/Desktop/Enorae/features/shared/blocked-times/api/queries.ts`
**Severity:** LOW
**Effort:** M (30 minutes)
**Business Impact:** Blocked times work but could have richer context

**Action Items:**
- [ ] Design view with related staff/salon info
- [ ] Include block reason and created_by context
- [ ] Create view in scheduling schema
- [ ] Update queries to use view
- [ ] Test with various filter combinations

**Risk:** Low - enhancement only
**Rollback:** Easy - revert to table query

**Priority Score:** 3/10 (LOW - can defer indefinitely)

---

## Implementation Timeline

### This Week (Critical Fixes)
```
Day 1:
  - [ ] Fix webhook_queue access (30 min)
  - [ ] Create or disable portfolio feature (15 min)
  - [ ] Verify type definitions (10 min)
  - [ ] Test all three fixes (30 min)
  - [ ] Commit and create PR

Total: ~1.5 hours
```

### Next Sprint (Medium Priority)
```
- [ ] Create view_user_preferences (20 min)
- [ ] Create view_profile_metadata (20 min)
- [ ] Create view_notifications (25 min)
- [ ] Test all views (30 min)

Total: ~1.5 hours
```

### Backlog (Low Priority)
```
- [ ] Create view_blocked_times_with_relations
- [ ] Create storage bucket for portfolio (if Option C)
- [ ] Portfolio image metadata table (if needed)
```

---

## Risk Assessment

### Overall Risk Level: MEDIUM

| Issue | Risk | Impact | Mitigation |
|-------|------|--------|-----------|
| Webhook schema fix | LOW | HIGH | Simple code change, easy rollback |
| Portfolio feature | MEDIUM | MEDIUM | Choose to create bucket or disable |
| Type verification | LOW | MEDIUM | Read-only verification, no code change |
| View creations | LOW | LOW | Can keep fallback tables indefinitely |

### Deployment Strategy

1. **Phase 1 (Immediate):** Fix Critical issues
   - Deploy webhook fix + portfolio fix
   - Run full test suite
   - Monitor production errors

2. **Phase 2 (Next Sprint):** Create views
   - Deploy views one at a time
   - Keep table fallbacks temporarily
   - Gradual migration to views

3. **Phase 3 (Future):** Remove table fallbacks
   - Once views stabilized
   - Remove old table access code
   - Clean up migration TODOs

---

## Rollback Plan

If any fix causes issues:

### Webhook Fix Rollback
```bash
git revert <webhook-commit>
# Redeploy previous working version
# Database queries unchanged, no migration needed
```

### Portfolio Feature Rollback
```bash
# If bucket created:
# Delete storage bucket in Supabase dashboard
# Revert code changes
# OR if disabled:
# Simply uncomment function
```

### View Creation Rollback
```bash
# Keep table access code in parallel
# If view has issues, queries automatically fall back to table
# Drop view, no data loss
```

---

## Success Criteria

### For Each Fix

**Webhook Fix:**
- ✓ Webhook retry operations complete without error
- ✓ Database logs show queries on communication.webhook_queue
- ✓ No 404 "Relation not found" errors
- ✓ Unit tests pass

**Portfolio Feature:**
- ✓ Either: Storage bucket created with RLS policies OR feature disabled
- ✓ No runtime 404 errors
- ✓ No broken UI components

**Type Verification:**
- ✓ `pnpm typecheck` passes with zero errors
- ✓ All review row accesses use correct columns
- ✓ Type definitions match database schema

**View Creations:**
- ✓ Views created in correct schema
- ✓ Queries updated to use views
- ✓ All tests pass with view queries
- ✓ No performance regression

---

## Post-Fix Verification

### Command Checklist
```bash
# After all fixes deployed:
pnpm typecheck              # Must pass: 0 errors
pnpm build                  # Must build successfully
pnpm lint:shadcn            # Check UI compliance

# Run tests:
npm run test:api            # API tests
npm run test:integration    # Integration tests
npm run test:e2e            # End-to-end tests

# Manual verification:
1. Test webhook retry in UI
2. Test portfolio upload (if enabled)
3. Test customer analytics queries
4. Test user preferences read/write
```

### Monitoring After Deploy
- Check error logs for "Relation not found" errors
- Monitor webhook processing success rate
- Check portfolio upload success rate
- Verify query performance metrics

---

## Sign-Off

**Report Prepared By:** Database Gap Fixer
**Date:** 2025-10-29
**Status:** READY FOR IMPLEMENTATION

**Next Steps:**
1. Review this document with team
2. Assign tasks to developers
3. Begin Critical fixes immediately
4. Schedule Medium priority for next sprint
5. Add Low priority to backlog

**Questions?** Refer to specific gap report:
- Business Portal: [01-business-portal-gaps.md](./01-business-portal-gaps.md)
- Staff Portal: [02-staff-portal-gaps.md](./02-staff-portal-gaps.md)

---

