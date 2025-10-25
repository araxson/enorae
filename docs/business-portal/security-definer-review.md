# Supabase Security-Definer Views Review

**Date:** 2025-10-25

## Context
Supabase advisors reported six `SECURITY DEFINER` views in the public schema. Business portal reads must continue to use these hardened views and avoid querying the underlying tables directly.

## Views Requiring Follow-up
- `public.admin_salons_overview_view`
- `public.appointments_view`
- `public.admin_revenue_overview_view`
- `public.communication_notification_queue_view`
- `public.staff_enriched_view`
- `public.salon_locations_view`

## Current Status
- [x] Business portal queries now target the associated `_view` relations only.
- [ ] Database team review to confirm each security-definer view is still necessary and audited.

## Next Actions
1. Share this summary with the Supabase/DB maintainers for risk assessment.
2. Track remediation work in the platform security backlog (owner: DB team).
3. Re-run Supabase advisors after database follow-up to confirm warnings are resolved.
