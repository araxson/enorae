# Verify Database Fixes

## Instructions for Claude:

Perform comprehensive verification of all completed database fixes.

### VERIFICATION WORKFLOW:

1. **READ COMPLETED TASKS**
   - Read `docs/database-analysis/DATABASE_PROGRESS_TRACKER.md`
   - Identify all tasks marked with `[x]`
   - Group by category for systematic verification

2. **CONNECT TO DATABASE**
   - Use `mcp__supabase__list_projects`
   - Select project: `nwmcpfioxerzodvbjigw`

3. **RUN VERIFICATION QUERIES**

   #### A. RLS Verification
   ```sql
   -- Check RLS enabled status
   SELECT
     schemaname,
     tablename,
     rowsecurity,
     CASE
       WHEN rowsecurity THEN '✅ Protected'
       ELSE '❌ UNPROTECTED'
     END as status
   FROM pg_tables
   WHERE schemaname IN ('analytics', 'scheduling', 'communication', 'identity')
   AND (tablename LIKE '%_p20%' OR tablename LIKE '%_default')
   ORDER BY rowsecurity, schemaname, tablename;

   -- Count policies per table
   SELECT
     schemaname,
     tablename,
     COUNT(*) as policy_count
   FROM pg_policies
   WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'auth')
   GROUP BY schemaname, tablename
   HAVING COUNT(*) > 0
   ORDER BY schemaname, tablename;
   ```

   #### B. Index Verification
   ```sql
   -- Check for missing critical indexes
   SELECT
     tc.table_schema,
     tc.table_name,
     kcu.column_name,
     'Missing Index' as issue
   FROM information_schema.table_constraints tc
   JOIN information_schema.key_column_usage kcu
     ON tc.constraint_name = kcu.constraint_name
   WHERE tc.constraint_type = 'FOREIGN KEY'
   AND NOT EXISTS (
     SELECT 1 FROM pg_indexes
     WHERE schemaname = tc.table_schema
     AND tablename = tc.table_name
     AND indexdef LIKE '%' || kcu.column_name || '%'
   );

   -- Check unused indexes still exist
   SELECT
     schemaname,
     tablename,
     indexname,
     idx_scan,
     CASE
       WHEN idx_scan = 0 THEN '⚠️ Still Unused'
       ELSE '✅ Now Used'
     END as status
   FROM pg_stat_user_indexes
   WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
   ORDER BY idx_scan, schemaname, tablename;
   ```

   #### C. View Verification
   ```sql
   -- Check critical views exist
   SELECT
     table_schema,
     table_name,
     CASE
       WHEN table_name = 'salon_chains_view' THEN '🔴 CRITICAL'
       WHEN table_name NOT LIKE '%_view' AND table_name NOT LIKE '%_mv' THEN '⚠️ Naming Issue'
       ELSE '✅ OK'
     END as status
   FROM information_schema.views
   WHERE table_schema = 'public'
   ORDER BY status, table_name;

   -- Check for auth.users references
   SELECT
     v.table_schema,
     v.table_name,
     CASE
       WHEN v.view_definition LIKE '%auth.users%' THEN '❌ Exposes auth.users'
       ELSE '✅ Clean'
     END as security_status
   FROM information_schema.views v
   WHERE v.table_schema = 'public'
   AND v.view_definition LIKE '%auth.users%';
   ```

   #### D. Audit Column Verification
   ```sql
   -- Check for audit columns
   SELECT
     table_schema,
     table_name,
     COUNT(*) FILTER (WHERE column_name = 'created_by_id') as has_created_by,
     COUNT(*) FILTER (WHERE column_name = 'updated_by_id') as has_updated_by,
     CASE
       WHEN COUNT(*) FILTER (WHERE column_name IN ('created_by_id', 'updated_by_id')) = 2 THEN '✅ Complete'
       WHEN COUNT(*) FILTER (WHERE column_name IN ('created_by_id', 'updated_by_id')) = 1 THEN '⚠️ Partial'
       ELSE '❌ Missing'
     END as audit_status
   FROM information_schema.columns
   WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'auth')
   AND table_name NOT LIKE '%_p20%'
   GROUP BY table_schema, table_name
   ORDER BY audit_status, table_schema, table_name;
   ```

   #### E. Materialized View Health
   ```sql
   -- Check dead tuple percentage
   SELECT
     schemaname,
     matviewname,
     n_dead_tup,
     n_live_tup,
     ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_pct,
     CASE
       WHEN n_dead_tup::float / NULLIF(n_live_tup + n_dead_tup, 1) > 0.2 THEN '❌ Needs VACUUM'
       ELSE '✅ Healthy'
     END as status
   FROM pg_stat_user_tables
   WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
   AND relkind = 'm'
   ORDER BY dead_pct DESC;
   ```

4. **GENERATE VERIFICATION REPORT**

   ```markdown
   📋 DATABASE FIX VERIFICATION REPORT
   ====================================
   Verification Date: [timestamp]

   SECURITY VERIFICATION
   --------------------
   RLS Protection:
   ✅ Protected Tables: X
   ❌ Unprotected Tables: X
   [List any unprotected tables]

   View Security:
   ✅ Clean Views: X
   ❌ Auth Exposure: X
   [List problematic views]

   PERFORMANCE VERIFICATION
   -----------------------
   Index Health:
   ✅ Required Indexes Present: X
   ❌ Missing Critical Indexes: X
   ⚠️ Unused Indexes Remaining: X

   Materialized Views:
   ✅ Healthy: X
   ❌ Need Vacuum: X

   SCHEMA VERIFICATION
   ------------------
   Audit Columns:
   ✅ Complete: X tables
   ⚠️ Partial: X tables
   ❌ Missing: X tables

   View Naming:
   ✅ Compliant: X
   ❌ Non-compliant: X

   CRITICAL ISSUES FOUND
   --------------------
   [List any critical issues discovered]

   FIXES CONFIRMED WORKING
   ----------------------
   [List verified fixes]

   FIXES NEEDING ATTENTION
   -----------------------
   [List problematic fixes]

   RECOMMENDATIONS
   --------------
   1. [Action items based on findings]
   2. [Priority fixes needed]
   3. [Monitoring suggestions]
   ```

5. **UPDATE TRACKER IF NEEDED**
   - If any fixes are found not working, update tracker
   - Mark failed items with `[!]` instead of `[x]`
   - Add notes about what needs re-fixing

6. **ALERT ON CRITICAL FINDINGS**
   If critical issues found:
   ```
   ⚠️ CRITICAL SECURITY ALERT
   ==========================
   Found X unprotected tables that should be protected!

   Immediate action required:
   1. [Specific action]
   2. [Specific action]

   Use /db-fix-rls for emergency patching
   ```

### Execute verification now and report findings.