# Component Details

## SessionList
**File**: `features/staff/sessions/components/session-list.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
Card slots now remain class-free while wrapper divs handle spacing, alignment, and typography, matching the shadcn/ui card example.

---

## TimeOffRequestsClient
**File**: `features/staff/time-off/components/time-off-requests-client.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
Both balance and empty-state cards move layout utilities into internal containers so CardContent renders with canonical styling.

---

## StaffPageNavigation
**File**: `features/staff/staff-common/components/staff-page-navigation.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
TabsList no longer overrides background colours; navigation relies on default shadcn/ui surfaces for consistent composition.

---

## HelpResourceBrowser
**File**: `features/staff/help/components/help-resource-browser.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
TabsContent elements are unstyled, with muted typography applied inside child paragraphs, adhering to the documented pattern.

---

## TeamTimeOffCalendarSection
**File**: `features/staff/time-off/components/team-time-off-calendar.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
Empty-state headers wrap content in centered flex containers so the CardHeader slot remains untouched.

---

## BlockedTimesList
**File**: `features/staff/blocked-times/components/blocked-times-list.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
Empty-state padding shifts to a child div, keeping CardContent pristine while preserving visual balance.

---

## AllLocationsList
**File**: `features/staff/location/components/all-locations-list.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
Spacing and alignment now live inside wrapper elements rather than on the CardContent slot.

---

## ProfileClient
**File**: `features/staff/profile/components/profile-client.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
The hero card leverages an internal flex column for layout, leaving CardContent class-free per shadcn/ui guidelines.

---

## MessageList
**File**: `features/staff/messages/components/message-list.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
Empty-state centering happens inside CardHeader via a wrapper div, so the slot retains its default styling.

---

## MessageThreadList
**File**: `features/staff/messages/components/message-thread-list.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
Icon, title, and description sit inside a centered wrapper, keeping CardHeader conformant with the shadcn reference.

---

## HelpFeedbackDrawer
**File**: `features/staff/help/components/help-feedback-drawer.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
Notification and anonymity cards now wrap their contents so CardContent maintains default semantics.

---

## SupportContactCard
**File**: `features/staff/support/components/support-contact-card.tsx`  
**Status**: ✅  
**Deviations**: 0

### Details
HoverCardContent wraps copy in a sized div, preserving the slot while keeping tooltip sizing identical.

---

## Additional Components
**Status**: ✅ across all items  
**Details**: Remaining staff portal cards now follow the same slot-wrapping pattern. Highlights include:
- `features/staff/location/components/location-card.tsx` and `.../all-locations-list.tsx` – headers, bodies, and footers use inner containers for spacing.
- `features/staff/operating-hours/components/operating-hours-card.tsx`, `features/staff/blocked-times/components/blocked-times-calendar.tsx`, and `features/staff/dashboard/components/staff-metrics.tsx` – metric cards retain layout utilities on nested divs only.
- `features/staff/time-off/components/request-card.tsx`, `.../time-off-requests-client.tsx`, `features/staff/appointments/components/appointments-list.tsx`, and `.../appointment-stats.tsx` – empty states and list rows wrap content appropriately.
- `features/staff/profile/components/profile-photo-upload.tsx`, `.../staff-info-form.tsx`, `.../specialties-editor.tsx`, `.../certifications-editor.tsx`, and `.../portfolio-gallery.tsx` – editor forms push layout classes down to child containers.
- `features/staff/support/components/support-ticket-card.tsx`, `.../support-faq-card.tsx`, `.../support-guides-card.tsx`, and `features/staff/dashboard/components/today-schedule.tsx`/`upcoming-appointments.tsx` – nested cards and accordions keep slots pristine while preserving interactive behaviour.

No shadcn/ui slots within the staff portal retain custom classNames after this sweep.

---
