# Staff Portal - UI/UX Comprehensive Audit

**Date:** 2025-11-05  
**Scope:** Staff portal dashboards, appointments, schedule, blocked times, messaging, settings  
**Auditor:** Codex (UI/UX)  
**Files Audited:**
- `features/staff/blocked-times/components/sections/block-type-field.tsx`
- `features/staff/schedule/components/schedule-management-client.tsx`
- `features/staff/time-off/components/request-card.tsx`
- `features/staff/messages/components/message-form.tsx`
- `features/staff/appointments/components/appointment-item.tsx`
- `features/staff/appointments/components/appointments-list.tsx`
- `features/staff/settings/components/{display-preferences,privacy-settings,notification-preferences}.tsx`
- `features/staff/staff-common/components/staff-page-heading.tsx`
- `features/staff/sessions/components/session-list.tsx`

---

## Executive Summary
### Overall Assessment
Staff portal surfaces lean on shadcn/ui primitives and exhibit consistent structural framing, but several high-impact interactions fall back to native browser prompts or raw HTML controls. These exceptions undermine the otherwise cohesive design system and introduce accessibility regressions for destructive flows and form validation feedback.

### Key Strengths
- Broad adoption of core primitives (`Card`, `Item`, `ButtonGroup`, `Empty`) keeps layouts modular.
- StaffPageShell abstraction centralises shell chrome (breadcrumbs, summaries, quick actions, tabs).
- Data-heavy views (sessions, notifications) already leverage `Table`, `ScrollArea`, `Alert` for clarity.
- Toast-based `ActionButton` pattern standardises optimistic mutations in appointments.

### Issues Found
- 3 critical (non-shadcn controls, destructive flows lacking AlertDialog).
- 3 high (native alerts, ad-hoc status feedback instead of shadcn primitives).
- 3 medium (empty states without guidance, structural slot styling, missing confirmations on workflow steps).
- 2 low (minor consistency gaps and component composition opportunities).

### Component Usage Statistics
- 38 of 54 shadcn/ui primitives in active use (70% coverage); 16 components unused (`aspect-ratio`, `carousel`, `collapsible`, `context-menu`, `form`, `input-otp`, `menubar`, `native-select`, `navigation-menu`, `pagination`, `resizable`, `sidebar`, `slider`, `sonner`, `toggle`, `toggle-group`).
- Top five by frequency: `card` (56), `item` (42), `button` (40), `empty` (36), `badge` (32).
- Interaction variety skews toward cards and items; navigational primitives (`Accordion`, `Tabs`, `Sheet`) appear in ≤7 files, indicating room to diversify patterns for dense admin workflows.

## Detailed Findings
### CRITICAL
#### Issue #1 – Custom `<select>` bypasses shadcn styling & accessibility
- **Location:** features/staff/blocked-times/components/sections/block-type-field.tsx:18  
- **Category:** shadcn/ui compliance
- **Current snippet:**
  ```tsx
  <select
    id="block_type"
    name="block_type"
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ..."
  >
  ```
- **Why it matters:** Raw `<select>` with hand-authored Tailwind overrides breaks the “pure shadcn component” rule (docs/rules/08-ui.md) and skips consistent focus, sizing, and dark-mode behaviour delivered by `Select`/`NativeSelect`. Visual regressions already surface in dark mode because custom classes ignore CSS variables.
- **Proposed fix:** Replace with `NativeSelect` (for progressive enhancement) or the existing `Select` composition so styling, keyboard navigation, and theming stay aligned with the design system.
- **Recommended shadcn/ui component:** `NativeSelect` (or `Select` with `Field` slots).
- **Estimated effort:** 2-3 hours (update field, re-test validation states, adjust form stories/tests).

#### Issue #2 – Destructive actions rely on `confirm()` instead of AlertDialog
- **Location:** features/staff/schedule/components/schedule-management-client.tsx:55; features/staff/time-off/components/request-card.tsx:68  
- **Category:** Destructive action UX / accessibility
- **Current snippet:**
  ```tsx
  if (confirm('Are you sure you want to delete this schedule?')) {
    startTransition(async () => {
      await deleteStaffSchedule(scheduleId)
    })
  }
  ```
- **Why it matters:** Native `confirm()` dialogs break visual continuity, lack contextual copy, and provide no pending or error state. Keyboard focus returns unpredictably, violating WCAG guidance for modal workflows.
- **Proposed fix:** Wrap destructive triggers in `AlertDialog` (`AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogAction`, `AlertDialogCancel`) so users get consistent confirmation copy, focus management, and opportunity to cancel.
- **Recommended shadcn/ui component:** `AlertDialog`.
- **Estimated effort:** 3-4 hours (shared confirmation component + wiring for both schedule and time-off flows).

#### Issue #3 – “Mark No Show” path lacks confirmation guard
- **Location:** features/staff/appointments/components/appointment-item.tsx:126  
- **Category:** Destructive action UX / workflow safety
- **Current snippet:**
  ```tsx
  <ActionButton
    variant="destructive"
    onAction={async () => {
      await markAppointmentNoShow(appointment.id!)
      router.refresh()
    }}
  >
    <XCircle className="mr-1 size-4" />
    No Show
  </ActionButton>
  ```
- **Why it matters:** Marking a session as “No Show” is irreversible yet starts instantly. Without an interstitial confirmation, accidental taps (especially on touch devices) permanently alter records.
- **Proposed fix:** Promote the destructive action into an `AlertDialog` nested inside `ItemActions`, preserving `ActionButton` for async execution only after confirmation.
- **Recommended shadcn/ui component:** `AlertDialog`.
- **Estimated effort:** 2-3 hours (dialog extraction + reuse across other destructive buttons).

### HIGH
#### Issue #4 – Settings screens fall back to `alert()` for error feedback
- **Location:** features/staff/settings/components/display-preferences.tsx:35, privacy-settings.tsx:41, notification-preferences.tsx:50  
- **Category:** Feedback & messaging consistency
- **Current snippet:**
  ```tsx
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to save preferences')
  }
  ```
- **Why it matters:** Browser alerts detach from the established `Sonner`/`Alert` patterns, ignoring dark mode, focus, and translation tone. They also block the UI thread and feel hostile.
- **Proposed fix:** Use `toast.error` from `@/components/ui/sonner` for transient feedback and render inline `Alert` within the card for persistent errors.
- **Recommended shadcn/ui component:** `Sonner` + `Alert`.
- **Estimated effort:** 2 hours (shared error handler util + tests).

#### Issue #5 – Forms hand-roll error/success banners instead of `Alert`
- **Location:** features/staff/blocked-times/components/blocked-time-form.tsx:75; features/staff/messages/components/message-form.tsx:70  
- **Category:** Style overlap & redundancy
- **Current snippet:**
  ```tsx
  <div
    role="alert"
    className="bg-destructive/10 border border-destructive p-4 rounded-md mb-6"
  >
    ...
  </div>
  ```
- **Why it matters:** Custom-styled `div`s duplicate alert styling, lack iconography, and risk diverging spacing on future design token updates. Green success banners also ignore the established `Alert` success variant.
- **Proposed fix:** Swap these blocks for `Alert`/`AlertDescription` (destructive and success variants) and reuse the same component across forms for consistency.
- **Recommended shadcn/ui component:** `Alert`.
- **Estimated effort:** 3 hours (shared helper + snapshot updates).

#### Issue #6 – Native confirmation blocks optimistic UX during time-off cancellation
- **Location:** features/staff/time-off/components/request-card.tsx:67  
- **Category:** Workflow responsiveness
- **Current snippet:** same as Issue #2 but within request cancellation.
- **Why it matters:** Using blocking `confirm()` prevents optimistic UI feedback (e.g., disabling buttons, showing spinner) and offers no contextual copy (reason, dates). A dedicated `AlertDialog` with request details would reduce accidental cancellations and align with `StaffCommandDialog` tone.
- **Proposed fix:** Replace the native prompt with `AlertDialog` including request metadata and reuse the pattern for “Reject” in manager view.
- **Recommended shadcn/ui component:** `AlertDialog`.
- **Estimated effort:** 3 hours (share confirmation sheet with schedule issue to amortize cost).

### MEDIUM
#### Issue #7 – Empty states lack follow-up actions or guidance
- **Location:** features/staff/appointments/components/appointments-list.tsx:35; features/staff/sessions/components/session-list.tsx:66  
- **Category:** Empty state UX
- **Current snippet:**
  ```tsx
  <Empty>
    <EmptyHeader>…</EmptyHeader>
  </Empty>
  ```
- **Why it matters:** Empty states omit `EmptyContent` CTA (e.g., “Open schedule” / “Invite teammates”), forcing users to hunt for next steps. The design system explicitly promotes actionable empty states.
- **Proposed fix:** Extend empties with `EmptyContent` housing `Button` or `InputGroup` to trigger scheduling, session security guidance, or quick navigation.
- **Recommended shadcn/ui component:** `EmptyContent` + `ButtonGroup`.
- **Estimated effort:** 2 hours (content authoring + analytics tracking updates).

#### Issue #8 – Structural slots styled directly in StaffPageHeading
- **Location:** features/staff/staff-common/components/staff-page-heading.tsx:59 & :67  
- **Category:** Style overlap / component purity
- **Current snippet:**
  ```tsx
  <ItemActions className="hidden items-center gap-2 sm:flex">…</ItemActions>
  <ItemDescription className="max-w-2xl">{description}</ItemDescription>
  ```
- **Why it matters:** Adding layout classes to `ItemActions`/`ItemDescription` fights the documented guidance (“No className on structural slots”). It complicates reuse of the heading component and introduces inconsistent wrapping compared to other Items.
- **Proposed fix:** Wrap layout tweaks in surrounding `div`s or leverage `Item` props (`variant`, `size`) plus utility wrappers to preserve pure slot usage.
- **Recommended shadcn/ui component:** `Item` (without slot overrides).
- **Estimated effort:** 1-2 hours (refactor + visual regression check).

#### Issue #9 – Schedule calendar lacks contextual “Add” affordance per day
- **Location:** features/staff/schedule/components/schedule-calendar.tsx:126  
- **Category:** Interaction completeness
- **Current snippet:** day cards show existing schedules but offer only global “Add Schedule” button far above the list.
- **Why it matters:** Staff must scroll back to the top to add a slot for a specific day, creating friction. The design system offers `DropdownMenu`/`Sheet` we could anchor per day to streamline creation.
- **Proposed fix:** Add per-day `ItemActions` with `DropdownMenu` (“Add time block”, “Clone previous day”) or a `Sheet` trigger for inline editing.
- **Recommended shadcn/ui component:** `DropdownMenu` or `Sheet` trigger per card.
- **Estimated effort:** 4 hours (per-day action wiring + state handling).

### LOW
#### Issue #10 – `ButtonGroup` used as single-button wrapper
- **Location:** features/staff/settings/components/display-preferences.tsx:116; privacy-settings.tsx:118  
- **Category:** Component semantics
- **Observation:** `ButtonGroup` encloses a single `Button`, adding unnecessary DOM and spacing variants.
- **Recommendation:** Replace with direct `Button` or reserve `ButtonGroup` for multiple related actions.
- **Estimated effort:** <1 hour.

#### Issue #11 – Success messaging duplicates toast semantics
- **Location:** features/staff/messages/components/message-form.tsx:129; blocked-time-form.tsx:134  
- **Category:** Feedback duplication
- **Observation:** Success banners duplicate toast copy while toasts already fire via `ActionButton`. Consolidating reduces copy drift.
- **Recommendation:** Swap inline success banners for `Sonner` success toast or a brief `Alert` inside FieldSet, not both.
- **Estimated effort:** 1 hour.

## Component Inventory
- **Usage breadth:** 38/54 components in staff surfaces. Heavy reliance on data presentation primitives while navigation/breadcrumb patterns remain underutilised for deep workflows.
- **Top usage (≥20 references):** `card` (56), `item` (42), `button` (40), `empty` (36), `badge` (32), `button-group` (23), `field` (18).
- **Underused / opportunity:** `accordion` (2), `sheet` (1), `dropdown-menu` (3), `popover` (1), `tabs` (7) – consider them for analytics drilldowns, schedule day filters, and mobile navigation.
- **Unused primitives ripe for adoption:** `sidebar`, `navigation-menu`, `pagination`, `resizable`, `toggle`, `toggle-group`, `sonner` host (toast root), `input-otp` (auth), `form` helper (for typed actions).

## Style Overlap & Cleanup
- Replace native `select` + manual class stack with `NativeSelect` to eliminate redundant Tailwind tokens.
- Refactor manual alert banners (`bg-destructive/10 …`) into `Alert` variants for error and success states.
- Remove slot-level class overrides in `ItemActions`/`ItemDescription`; use wrappers or Item props to control layout.
- Standardise destructive flows on shared `AlertDialog` component (schedule deletion, time-off cancel/reject, appointment no-show).
- Consolidate empty-state copy and CTA structure using `EmptyHeader` + `EmptyContent` templates.

## Implementation Roadmap
- **Phase 1 (Critical, 0-2 days):** Replace `confirm()` prompts with reusable `AlertDialog`; migrate `BlockTypeField` to `NativeSelect`; introduce confirmation for “No Show”.
- **Phase 2 (High, 2-4 days):** Swap native `alert()` usage for `Sonner`/`Alert`; extract shared form feedback component; align destructive flows in time-off manager view.
- **Phase 3 (Medium, 4-6 days):** Enhance empty states with actionable `EmptyContent`; refactor StaffPageHeading slot styling; add per-day schedule triggers with `DropdownMenu` or `Sheet`.
- **Phase 4 (Ongoing):** Promote underused primitives (Sidebar, NavigationMenu) in dashboard navigation; add `Sonner` host to root layout if absent; audit remaining forms for native control leaks.

## Testing Checklist
- Verify `AlertDialog` confirmations for schedule deletion, time-off cancellation/rejection, and appointment no-show (keyboard + screen reader focus).
- Regression-test Blocked Times form (Select conversions, validation errors, success toast).
- Exercise settings save flows with simulated failures to confirm toast + inline Alert behaviour.
- Validate empty-state CTAs route correctly and remain accessible on mobile breakpoints.
- Run responsive smoke tests for StaffPageShell after slot refactors; ensure Tabs/ScrollArea still respond at sm/md breakpoints.
- Execute visual diff (Chromatic/Playwright) on updated components to catch spacing regressions.

## Conclusion
Staff portal screens already tap into the shadcn/ui system, but isolated regressions—native dialogs, custom selects, hand-rolled alerts—chip away at the intended “pure component” contract. Addressing the critical confirmations and form controls will close the largest UX gaps; subsequent work can focus on richer empty states and broader component diversity.

## Appendix
### Top Component Usage
| Component | References |
|-----------|-----------:|
| card | 56 |
| item | 42 |
| button | 40 |
| empty | 36 |
| badge | 32 |
| button-group | 23 |
| field | 18 |
| separator | 13 |
| spinner | 12 |
| select | 9 |

### Unused shadcn/ui Primitives (Staff Portal)
`aspect-ratio`, `carousel`, `collapsible`, `context-menu`, `form`, `input-otp`, `menubar`, `native-select`, `navigation-menu`, `pagination`, `resizable`, `sidebar`, `slider`, `sonner`, `toggle`, `toggle-group`

