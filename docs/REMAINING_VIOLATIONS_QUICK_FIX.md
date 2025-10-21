# REMAINING VIOLATIONS - QUICK FIX GUIDE

**Status:** 24 violations remaining (non-critical)
**Estimated Fix Time:** 2-3 hours total
**Priority:** MEDIUM (recommended before next deployment)

---

## VIOLATION CATEGORY 1: Staff Portal Query Views (20 violations)

### Issue
Staff portal queries are reading from schema tables instead of public views.

### Impact
- Security: Bypasses RLS view optimizations
- Performance: Missing view-level optimizations
- Consistency: Other portals use views correctly

### Files to Fix (5 files)

#### 1. features/staff/operating-hours/api/queries.ts
```typescript
// ❌ CURRENT
.from('staff')
.from('operating_hours')

// ✅ FIX TO
.from('staff_view')
.from('operating_hours_view')
```

#### 2. features/staff/services/api/queries.ts
```typescript
// ❌ CURRENT
.from('staff')
.from('staff_services')

// ✅ FIX TO
.from('staff_view')
.from('staff_services_view')
```

#### 3. features/staff/time-off/api/queries.ts
```typescript
// ❌ CURRENT
.from('staff')

// ✅ FIX TO
.from('staff_view')
```

#### 4. features/staff/schedule/api/queries.ts
```typescript
// ❌ CURRENT
.from('staff_schedules')
.from('appointments')
.from('salons')
.from('staff')

// ✅ FIX TO
.from('staff_schedules_view')
.from('appointments_view')
.from('salons_view')
.from('staff_view')
```

#### 5. features/staff/profile/api/queries.ts
```typescript
// ❌ CURRENT
.from('staff')
.from('profiles_metadata')

// ✅ FIX TO
.from('staff_view')
.from('profiles_metadata_view')
```

### Fix Command Pattern
```bash
# For each file, replace:
sed -i '' 's/\.from('\''staff'\'')/\.from('\''staff_view'\'\')/g' features/staff/*/api/queries.ts
sed -i '' 's/\.from('\''operating_hours'\'')/\.from('\''operating_hours_view'\'\')/g' features/staff/*/api/queries.ts
sed -i '' 's/\.from('\''staff_services'\'')/\.from('\''staff_services_view'\'\')/g' features/staff/*/api/queries.ts
sed -i '' 's/\.from('\''staff_schedules'\'')/\.from('\''staff_schedules_view'\'\')/g' features/staff/*/api/queries.ts
sed -i '' 's/\.from('\''appointments'\'')/\.from('\''appointments_view'\'\')/g' features/staff/*/api/queries.ts
sed -i '' 's/\.from('\''salons'\'')/\.from('\''salons_view'\'\')/g' features/staff/*/api/queries.ts
sed -i '' 's/\.from('\''profiles_metadata'\'')/\.from('\''profiles_metadata_view'\'\')/g' features/staff/*/api/queries.ts
```

**Estimated Time:** 1-2 hours (includes testing)

---

## VIOLATION CATEGORY 2: Slot Component Styling (4 violations)

### Issue
CardTitle and CardDescription slots have className attributes, which violates the "slots as-is" pattern.

### Impact
- UI Consistency: Custom styling breaks design system
- Maintainability: Harder to update global styles
- Pattern Violation: Slots should have zero styling

### Files to Fix (4 files)

#### 1. features/customer/dashboard/components/customer-dashboard.tsx (Line 136)

```typescript
// ❌ CURRENT
<CardTitle className="flex items-center gap-2">
  <TrendingUp className="h-4 w-4" />
  ${vipStatus.monthlySpend.toLocaleString()}
</CardTitle>

// ✅ FIX TO
<CardTitle>
  <span className="flex items-center gap-2">
    <TrendingUp className="h-4 w-4" />
    ${vipStatus.monthlySpend.toLocaleString()}
  </span>
</CardTitle>
```

#### 2. features/customer/dashboard/components/upcoming-bookings.tsx (Lines 88, 99, 111)

```typescript
// ❌ CURRENT (Line 88)
<CardDescription className="font-medium truncate">
  {appointment.salon_name || 'Salon TBD'}
</CardDescription>

// ✅ FIX TO
<CardDescription>
  <span className="font-medium truncate">
    {appointment.salon_name || 'Salon TBD'}
  </span>
</CardDescription>

// ❌ CURRENT (Line 99)
<CardDescription className="truncate">{appointmentDate}</CardDescription>

// ✅ FIX TO
<CardDescription>
  <span className="truncate">{appointmentDate}</span>
</CardDescription>

// ❌ CURRENT (Line 111)
<CardDescription className="truncate">View location</CardDescription>

// ✅ FIX TO
<CardDescription>
  <span className="truncate">View location</span>
</CardDescription>
```

#### 3. features/customer/salon-search/components/salon-results-grid.tsx (Line 58)

```typescript
// ❌ CURRENT
<CardDescription className="font-semibold">
  {formatRating(salon.rating_average)}
</CardDescription>

// ✅ FIX TO
<CardDescription>
  <span className="font-semibold">
    {formatRating(salon.rating_average)}
  </span>
</CardDescription>
```

#### 4. features/customer/reviews/components/reviews-list.tsx (Lines 61, 67, 73)

```typescript
// ❌ CURRENT
<CardDescription className="uppercase">Service</CardDescription>
<CardDescription className="uppercase">Cleanliness</CardDescription>
<CardDescription className="uppercase">Value</CardDescription>

// ✅ FIX TO
<CardDescription>
  <span className="uppercase">Service</span>
</CardDescription>
<CardDescription>
  <span className="uppercase">Cleanliness</span>
</CardDescription>
<CardDescription>
  <span className="uppercase">Value</span>
</CardDescription>
```

### Fix Pattern
1. Read the file
2. Find all `<CardTitle className="...">` and `<CardDescription className="...">`
3. Remove className from slot component
4. Wrap content in `<span className="...">`
5. Save and verify

**Estimated Time:** 30 minutes

---

## FIX VERIFICATION CHECKLIST

After applying fixes, run these commands to verify:

### 1. Verify Staff Portal Views
```bash
# Should return no results (or only schema() usages)
rg "\.from\(['\"]" features/staff/**/queries.ts | grep -v "_view" | grep -v "\.schema("
```

### 2. Verify Slot Styling Removed
```bash
# Should return 0 results
rg "CardTitle className=" features/customer/**/*.tsx
rg "CardDescription className=" features/customer/**/*.tsx
```

### 3. Run Type Check
```bash
npm run typecheck
# Should pass with no errors
```

### 4. Test Affected Features
- [ ] Staff portal: Operating hours page
- [ ] Staff portal: Services page
- [ ] Staff portal: Time off page
- [ ] Staff portal: Schedule page
- [ ] Staff portal: Profile page
- [ ] Customer portal: Dashboard
- [ ] Customer portal: Upcoming bookings
- [ ] Customer portal: Salon search
- [ ] Customer portal: Reviews list

---

## AUTOMATED FIX SCRIPT (USE WITH CAUTION)

**WARNING:** Review each change manually. Do NOT run blindly.

```bash
#!/bin/bash
# Quick fix script for remaining violations

echo "Fixing staff portal query views..."

# Fix operating-hours
sed -i '' 's/\.from('\''staff'\'')/\.from('\''staff_view'\'\')/g' features/staff/operating-hours/api/queries.ts
sed -i '' 's/\.from('\''operating_hours'\'')/\.from('\''operating_hours_view'\'\')/g' features/staff/operating-hours/api/queries.ts

# Fix services
sed -i '' 's/\.from('\''staff'\'')/\.from('\''staff_view'\'\')/g' features/staff/services/api/queries.ts
sed -i '' 's/\.from('\''staff_services'\'')/\.from('\''staff_services_view'\'\')/g' features/staff/services/api/queries.ts

# Fix time-off
sed -i '' 's/\.from('\''staff'\'')/\.from('\''staff_view'\'\')/g' features/staff/time-off/api/queries.ts

# Fix schedule
sed -i '' 's/\.from('\''staff_schedules'\'')/\.from('\''staff_schedules_view'\'\')/g' features/staff/schedule/api/queries.ts
sed -i '' 's/\.from('\''appointments'\'')/\.from('\''appointments_view'\'\')/g' features/staff/schedule/api/queries.ts
sed -i '' 's/\.from('\''salons'\'')/\.from('\''salons_view'\'\')/g' features/staff/schedule/api/queries.ts
sed -i '' 's/\.from('\''staff'\'')/\.from('\''staff_view'\'\')/g' features/staff/schedule/api/queries.ts

# Fix profile
sed -i '' 's/\.from('\''staff'\'')/\.from('\''staff_view'\'\')/g' features/staff/profile/api/queries.ts
sed -i '' 's/\.from('\''profiles_metadata'\'')/\.from('\''profiles_metadata_view'\'\')/g' features/staff/profile/api/queries.ts

echo "Staff portal fixes complete. Review changes before committing."
echo ""
echo "Note: Slot styling fixes must be done manually (4 files)."
echo "See section 'VIOLATION CATEGORY 2' above for details."
```

---

## PRIORITY & TIMELINE

### Immediate (Before Next Deploy)
- [ ] Fix staff portal query views (5 files, 1-2 hours)
- [ ] Fix customer portal slot styling (4 files, 30 minutes)

### Short-term (Next Sprint)
- [ ] Add explicit auth guards to all functions
- [ ] Migrate forms to React Hook Form

### Long-term (Future Sprints)
- [ ] Expand test coverage
- [ ] Add monitoring for pattern violations

---

## SUCCESS CRITERIA

Fixes are complete when:

1. ✅ All staff portal queries use `_view` tables
2. ✅ All slot components have zero className attributes
3. ✅ Type check passes (`npm run typecheck`)
4. ✅ Manual testing confirms no regressions
5. ✅ Compliance validation shows 100% for database and UI patterns

---

**Last Updated:** 2025-10-20
**Next Review:** After fixes applied
