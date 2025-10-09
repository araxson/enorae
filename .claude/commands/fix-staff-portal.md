---
description: Deep analysis and UX fixes for staff portal
---

# Staff Portal - Deep Analysis & Fix

**Portal:** `/app/(staff)` - Staff dashboard for service providers

## Task

Perform a **comprehensive deep analysis** of the staff portal UX and fix all issues using senior developer ULTRATHINK methodology.

### Phase 1: Analysis (30 minutes)

1. **Analyze all staff portal routes** in `app/(staff)/`
2. **Review all staff features** in `features/staff/`
3. **Check database views usage** - Are we using all available staff/schedule/appointment data?
4. **Examine staff workflow components** - Missing schedule or client management features?
5. **Identify data utilization** - What % of available staff data is displayed?
6. **Find critical bugs** - Permission errors, crashes, schedule conflicts, broken queries
7. **Check authorization** - Proper role checks (senior_staff, staff, junior_staff)?
8. **Review staff workflows** - Schedule → Appointments → Clients → Commission → Time Off

### Phase 2: Document Findings

Create **`STAFF_PORTAL_ANALYSIS.md`** with:
- Current state assessment (routes, features, components)
- Database views available vs utilized
- Critical issues found (bugs, crashes, permission errors)
- Missing staff productivity features
- Schedule management gaps
- Client relationship issues
- Commission tracking problems
- Time-off request issues
- Prioritized recommendations (CRITICAL → HIGH → MEDIUM → LOW)

### Phase 3: Fix Critical Issues

Apply ULTRATHINK methodology to fix:
- ✅ Any crashes or permission errors
- ✅ Schedule conflicts or double-bookings
- ✅ Appointment assignment issues
- ✅ Client history access problems
- ✅ Commission calculation bugs
- ✅ Time-off approval flow
- ✅ Service assignment issues
- ✅ Broken queries or empty views

### Phase 4: Enhance Staff Experience

Add high-value features:
- Calendar view for schedules
- Appointment management (accept, reschedule, cancel)
- Client profiles and history
- Commission tracking and reports
- Service performance metrics
- Daily/weekly schedule overview
- Time-off management
- Search and filters for all lists

### Phase 5: Create Reusable Components

Build staff-specific components:
- `components/staff/` directory
- Calendar/schedule components
- Appointment cards
- Client profile cards
- Commission displays
- Service performance charts
- Time-off request forms

### Phase 6: Document & Test

Create **`STAFF_PORTAL_IMPROVEMENTS.md`** with:
- All changes implemented
- Before/after comparisons
- New components created
- Performance improvements
- Build status
- Testing checklist

## Success Criteria

- ✅ No crashes or errors
- ✅ Schedule management working
- ✅ Appointment flow smooth
- ✅ Client data accessible
- ✅ Commission tracking accurate
- ✅ All database views properly utilized
- ✅ Time-off requests functional
- ✅ Build successful
- ✅ TypeScript errors resolved
- ✅ Comprehensive documentation

## Constraints

- Follow project architecture (CLAUDE.md)
- Use existing shadcn/ui components
- Type safety (no `any` types)
- Server components: `import 'server-only'`
- Client components: `'use client'`
- Query views, mutate schemas
- Ultra-thin pages (5-15 lines)
- Check roles: senior_staff, staff, junior_staff

## Output

1. `STAFF_PORTAL_ANALYSIS.md` - Deep analysis document
2. `STAFF_PORTAL_IMPROVEMENTS.md` - Implementation summary
3. Enhanced staff portal features
4. New reusable components in `components/staff/`
5. All critical issues fixed
6. Build passing successfully

---

**Approach:** Think like a senior developer. Find the issues first, then fix them comprehensively. Document everything.
