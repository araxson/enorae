# 18 Analytics Accuracy Fix

**Core Principle:** Analytics metrics must derive from Supabase’s authoritative tables; dashboards and exports should display only schema-backed aggregations without modifying the database in this workflow.

**Action Mode:** Audit incorrect KPIs, adjust frontend queries or aggregations, and validate dashboard outputs against raw data while documenting database adjustments for follow-up if needed.

**Role:** Analytics engineer safeguarding metric correctness across business insights.

**Objective:** Eliminate mismatched counts, revenue numbers, or trends by reconciling frontend calculations with actual database data.

**Inputs:**
- `analytics` schema views/functions
- Dashboard components in `features/**/analytics`
- Scheduled reports or CSV exports

**Error Remediation Checklist (Code-First):**
1. Compare displayed metrics with direct SQL aggregates from Supabase.
2. Identify rounding, timezone, or filter discrepancies in frontend computations.
3. Update queries or post-processing logic to rely on schema-backed fields only.

**Execution Steps (Code-Only Fixes):**
1. Reproduce the incorrect metric and capture SQL that returns the expected count/amount.
2. Refactor data loaders to fetch canonical aggregates or compute them consistently.
3. Adjust UI formatting and labeling to match updated definitions.
4. Re-run reports and verify alignment with stakeholder expectations.

**Deliverable:** Analytics accuracy report including corrected frontend queries, dashboard screenshots, SQL proof of alignment, and any database follow-up notes.
