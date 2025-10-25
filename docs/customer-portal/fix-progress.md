# Customer Portal Fix Progress

## Layer 1: Pages
- [ ] No issues reported

## Layer 2: Queries
- [x] Issue #1: Chain queries bypass public views for salon locations (features/customer/chains/api/queries.ts:8,82)
- [x] Issue #2: Dashboard metrics queries hit raw tables (features/customer/dashboard/api/queries/*.ts)
- [x] Issue #3: Appointment services query uses scheduling table directly (features/customer/appointments/api/queries.ts:6)
- [x] Issue #4: Session queries misaligned with Supabase sessions view (features/customer/sessions/api/queries.ts:6)
- [x] Issue #5: Salon detail queries fetch amenities/specialties from base tables (features/customer/salon-detail/api/queries.ts:78)
- [x] Issue #6: Loyalty & referrals queries out of sync with Supabase schema (features/customer/loyalty/api/queries.ts:21; features/customer/referrals/api/queries.ts:14)

## Layer 3: Mutations
- [x] Issue #1: Appointment mutations read from scheduling tables instead of views (features/customer/appointments/api/mutations.ts:22)
- [x] Issue #2: Booking action queries raw tables for salon, service, and availability checks (features/customer/booking/api/mutations.ts:66)
- [x] Issue #3: Reviews ownership checks query engagement tables directly (features/customer/reviews/api/mutations.ts:71)
- [x] Issue #4: Sessions revoke actions query identity.sessions without the view (features/customer/sessions/api/mutations.ts:29)
- [x] Issue #5: Loyalty & referral mutations reference nonexistent tables and bypass auth helpers (features/customer/loyalty/api/mutations.ts:5; features/customer/referrals/api/mutations.ts:5)

## Layer 4: Components
- [x] Issue #1: Typography & color utilities applied directly to shadcn slots (features/customer/staff-profiles/components/staff-profile-detail.tsx:24; favorites/components/favorites-list.tsx:35; loyalty/components/loyalty-dashboard.tsx:34)
- [x] Issue #2: Loyalty & referral dashboards surface non-functional CTAs (features/customer/loyalty/components/loyalty-dashboard.tsx:34; referrals/components/referral-dashboard.tsx:34)
- [x] Issue #3: Custom rating widget bypasses shadcn button primitives (features/customer/reviews/components/edit-review-dialog.tsx:96)

## Layer 5: Type Safety
- [ ] Issue #1: Invalid database view references in query typings (features/customer/chains/api/queries.ts:8; appointments/api/queries.ts:6; sessions/api/queries.ts:6; dashboard/api/queries/vip.ts:7)
- [ ] Issue #2: Customer components rely on scheduling table rows (features/customer/dashboard/components/upcoming-bookings.tsx:8; appointment-history.tsx:8; appointments/components/appointments-list.tsx:11)
- [ ] Issue #3: Widespread `as unknown as` casts mask response typing gaps (features/customer/salon-detail/api/queries.ts:56)

## Layer 6: Validation
- [ ] Issue #1: Loyalty & referral schemas are empty despite accepting user input (features/customer/loyalty/schema.ts:3; referrals/schema.ts:3)
- [ ] Issue #2: Search/discovery schemas are placeholders, leaving query filters unchecked (features/customer/salon-search/schema.ts:3; discovery/schema.ts:3; notifications/schema.ts:3; analytics/schema.ts:3; chains/schema.ts:3)

## Layer 7: Security
- [ ] Issue #1: Direct table reads bypass RLS-protected views (features/customer/booking/api/queries/availability.ts:15; appointments/api/mutations.ts:22; chains/api/queries.ts:82; dashboard/api/queries/*.ts; sessions/api/mutations.ts:29)
- [ ] Issue #2: Raw `.or()` filter strings interpolate user-controlled timestamps (features/customer/booking/api/queries/availability.ts:15,58)

## Layer 8: UX
- [ ] Issue #1: Loyalty dashboard exposes unusable rewards (features/customer/loyalty/components/loyalty-dashboard.tsx:34)
- [ ] Issue #2: Referral dashboard lacks usable share pathways when no code exists (features/customer/referrals/components/referral-dashboard.tsx:63)

## Verification
- [ ] Run typecheck and verify (0 errors)
