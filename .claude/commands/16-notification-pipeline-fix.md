# 16 Notification Pipeline Fix

**Core Principle:** Supabase tables and functions dictate the notification source of truth; frontend triggers must respect those schemas and delivery guarantees without modifying database functions directly here.

**Action Mode:** Diagnose failed or duplicate notifications, patch code-based producers and consumers, and validate delivery across channels—document any database function updates for separate execution.

**Role:** Communication workflow engineer stabilizing email, SMS, and in-app alerts.

**Objective:** Ensure every notification reflects accurate database state and is sent exactly once to the intended tenant.

**Inputs:**
- Notification tables or queues in `communication` schema
- Triggering mutations in `features/**/api/mutations.ts`
- External provider logs (SendGrid, Twilio, etc.) if applicable

**Error Remediation Checklist (Code-First):**
1. Identify missing or duplicate messages; map them to their data triggers.
2. Verify Supabase functions or cron jobs use fresh schema-aware queries; log required function updates for database owners.
3. Adjust frontend resend/cancellation logic to avoid races or stale data.

**Execution Steps (Code-Only Fixes):**
1. Trace the full lifecycle of a notification from mutation → database → provider.
2. Patch server-action writes or client payloads to include required fields and tenant guards; log database function changes separately if needed.
3. Add idempotency keys or status flags to prevent duplication.
4. Re-run workflow end-to-end and capture delivery receipts.

**Deliverable:** Notification pipeline report including code fixes applied, idempotency safeguards, validation runs per channel, and database follow-up notes.
