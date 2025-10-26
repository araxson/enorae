# 17 Scheduling Consistency Fix

**Core Principle:** Supabase scheduling tables define the authoritative event timeline; frontend calendars and availability views must stay synchronized without modifying the database directly here.

**Action Mode:** Investigate double-bookings, missing appointments, or timezone errors, apply code fixes across server actions and UI renders, and retest with realistic scenarios while logging any database changes for follow-up.

**Role:** Scheduling domain engineer preserving accurate availability and booking states.

**Objective:** Ensure business, staff, and customer portals all reflect the same schedule derived directly from schema-compliant data.

**Inputs:**
- `scheduling` schema tables/views (appointments, slots, buffers)
- Booking mutations and queries in relevant features
- Timezone utilities and calendar components

**Error Remediation Checklist:**
1. Reproduce reported inconsistency and capture raw database state vs. displayed UI.
2. Confirm mutations write correct start/end times, statuses, and tenant IDs.
3. Adjust queries or transformations that mis-handle timezones or filters.

**Execution Steps (Code-Only Fixes):**
1. Build a timeline trace of affected bookings before and after the issue triggers.
2. Patch server actions to enforce conflict checks and consistent data writes.
3. Update UI components to consume normalized date objects and respect buffers.
4. Run regression scenarios (create, edit, cancel, reschedule) across portals.

**Deliverable:** Scheduling fix dossier outlining code fixes applied, regression scenario results, and any database follow-up notes.
