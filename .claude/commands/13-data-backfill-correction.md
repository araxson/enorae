# 13 Data Backfill Correction

**Core Principle:** Supabase holds the authoritative data; frontend code must consume it consistently while backfill operations are coordinated outside this workflow.

**Action Mode:** Analyze corrupted or missing data, craft proposed backfill scripts, and ship code safeguards so the UI handles inconsistencies while DB owners execute the data repair.

**Role:** Data integrity specialist maintaining historical correctness across schemas.

**Mission:** Repair data drift caused by past bugs or migrations so current and future reads return valid, expected shapes.

**Inputs:**
- Historical export queries via `mcp__supabase__execute_sql`
- Migration history in `supabase/migrations`
- Feature-level queries consuming the data

**Error Remediation Checklist (Code-First):**
1. Locate inconsistent rows, nulls, or mismatched enums vs. schema constraints.
2. Determine the source bug (mutation, migration, external import).
3. Design idempotent backfill scripts or server actions as proposals, and add code guards to mitigate until executed.

**Execution Steps (Code Updates + Planning):**
1. Quantify the scope of bad data with targeted SQL and snapshot results.
2. Draft backfill logic in SQL or server action form for database maintainers, ensuring tenant scoping and auth compliance.
3. Implement frontend or server-action guards (validation, fallbacks) to handle inconsistent records until the backfill runs.
4. Update frontend assumptions or validation schemas if field semantics changed, noting any required database execution separately.

**Deliverable:** Backfill remediation packet containing proposed scripts, code safeguards applied, records affected, verification queries, and coordination notes for database execution.
