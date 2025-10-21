================================================================================
DATABASE SCHEMA ANALYSIS REPORT
================================================================================

## SCHEMA SUMMARY

Total Public Views: 0

### Public Views:

## QUERY ANALYSIS

Total Query Patterns Found: 3319
  - eq: 1277
  - from: 1246
  - select: 796

## MISMATCHES FOUND

Total Issues: 1246
  - High Severity: 1246
  - Medium Severity: 0

### TOP 10 CRITICAL ISSUES:

1. MISSING_VIEW
   File: features/customer/reviews/api/queries.ts:13
   View 'salon_reviews_view' does not exist in public schema

2. MISSING_VIEW
   File: features/customer/reviews/api/queries.ts:27
   View 'salon_reviews_view' does not exist in public schema

3. MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:36
   View 'salon_reviews' does not exist in public schema

4. MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:70
   View 'salon_reviews' does not exist in public schema

5. MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:109
   View 'salon_reviews' does not exist in public schema

6. MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:144
   View 'salon_reviews' does not exist in public schema

7. MISSING_VIEW
   File: features/customer/reviews/api/mutations.ts:162
   View 'salon_reviews' does not exist in public schema

8. MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:24
   View 'review_helpful_votes' does not exist in public schema

9. MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:37
   View 'review_helpful_votes' does not exist in public schema

10. MISSING_VIEW
   File: features/customer/reviews/api/helpful-mutations.ts:53
   View 'salon_reviews' does not exist in public schema

### FILES NEEDING FIXES:

  features/admin/dashboard/api/queries.ts
    19 issues
      - Line 17: View 'admin_salons_overview' does not exist in public schema
      - Line 18: View 'admin_users_overview' does not exist in public schema
      - Line 19: View 'admin_appointments_overview' does not exist in public schema
      ... and 16 more

  features/admin/users/api/mutations/status.ts
    17 issues
      - Line 28: View 'profiles' does not exist in public schema
      - Line 39: View 'user_roles' does not exist in public schema
      - Line 50: View 'sessions' does not exist in public schema
      ... and 14 more

  features/staff/time-off/api/mutations.ts
    14 issues
      - Line 48: View 'staff' does not exist in public schema
      - Line 72: View 'time_off_requests' does not exist in public schema
      - Line 95: View 'staff' does not exist in public schema
      ... and 11 more

  features/staff/clients/api/mutations.ts
    14 issues
      - Line 52: View 'staff' does not exist in public schema
      - Line 65: View 'message_threads' does not exist in public schema
      - Line 78: View 'message_threads' does not exist in public schema
      ... and 11 more

  features/customer/discovery/api/queries.ts
    12 issues
      - Line 19: View 'salons' does not exist in public schema
      - Line 26: View 'services' does not exist in public schema
      - Line 50: View 'salons' does not exist in public schema
      ... and 9 more

  features/staff/clients/api/queries.ts
    12 issues
      - Line 23: View 'staff' does not exist in public schema
      - Line 33: View 'appointments' does not exist in public schema
      - Line 78: View 'staff' does not exist in public schema
      ... and 9 more

  features/marketing/salon-directory/api/queries.ts
    12 issues
      - Line 40: View 'salons' does not exist in public schema
      - Line 55: View 'salons' does not exist in public schema
      - Line 78: View 'salons' does not exist in public schema
      ... and 9 more

  features/business/dashboard/api/queries/metrics.ts
    12 issues
      - Line 25: View 'appointments' does not exist in public schema
      - Line 26: View 'staff' does not exist in public schema
      - Line 27: View 'services' does not exist in public schema
      ... and 9 more

  features/staff/appointments/api/mutations.ts
    11 issues
      - Line 26: View 'appointments' does not exist in public schema
      - Line 38: View 'staff' does not exist in public schema
      - Line 51: View 'appointments' does not exist in public schema
      ... and 8 more

  features/business/staff/api/mutations.ts
    11 issues
      - Line 30: View 'profiles' does not exist in public schema
      - Line 44: View 'profiles' does not exist in public schema
      - Line 59: View 'staff_profiles' does not exist in public schema
      ... and 8 more

  features/admin/moderation/api/queries.ts
    10 issues
      - Line 217: View 'admin_reviews_overview' does not exist in public schema
      - Line 253: View 'admin_users_overview' does not exist in public schema
      - Line 265: View 'salon_reviews' does not exist in public schema
      ... and 7 more

  features/admin/analytics/api/rpc-functions.ts
    10 issues
      - Line 23: View 'profiles' does not exist in public schema
      - Line 24: View 'salons' does not exist in public schema
      - Line 25: View 'appointments' does not exist in public schema
      ... and 7 more

  features/admin/chains/api/mutations.ts
    10 issues
      - Line 28: View 'audit_logs' does not exist in public schema
      - Line 69: View 'salon_chains' does not exist in public schema
      - Line 80: View 'salon_chains' does not exist in public schema
      ... and 7 more

  features/admin/security/api/monitoring.ts
    10 issues
      - Line 26: View 'audit_logs' does not exist in public schema
      - Line 72: View 'audit_logs' does not exist in public schema
      - Line 95: View 'audit_logs' does not exist in public schema
      ... and 7 more

  features/business/reviews/api/mutations.ts
    10 issues
      - Line 26: View 'salon_reviews' does not exist in public schema
      - Line 38: View 'salon_reviews' does not exist in public schema
      - Line 75: View 'salon_reviews' does not exist in public schema
      ... and 7 more

  features/business/chains/api/mutations.ts
    10 issues
      - Line 78: View 'salon_chains' does not exist in public schema
      - Line 119: View 'salon_chains' does not exist in public schema
      - Line 151: View 'salons' does not exist in public schema
      ... and 7 more

  features/business/appointments/api/internal/appointment-services.ts
    10 issues
      - Line 68: View 'appointments' does not exist in public schema
      - Line 80: View 'appointment_services' does not exist in public schema
      - Line 132: View 'appointment_services' does not exist in public schema
      ... and 7 more

  features/staff/dashboard/api/queries.ts
    9 issues
      - Line 33: View 'staff' does not exist in public schema
      - Line 55: View 'appointments' does not exist in public schema
      - Line 76: View 'appointments' does not exist in public schema
      ... and 6 more

  features/staff/schedule/api/schedule-requests.ts
    9 issues
      - Line 47: View 'staff' does not exist in public schema
      - Line 58: View 'staff_schedules' does not exist in public schema
      - Line 103: View 'staff' does not exist in public schema
      ... and 6 more

  features/marketing/services-directory/api/queries.ts
    9 issues
      - Line 17: View 'services' does not exist in public schema
      - Line 41: View 'services' does not exist in public schema
      - Line 63: View 'services' does not exist in public schema
      ... and 6 more

## DETAILED VIEW SCHEMAS

================================================================================
END OF REPORT
================================================================================