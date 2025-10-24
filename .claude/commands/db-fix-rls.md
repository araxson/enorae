# Fix Critical RLS Security Issues

## ⚠️ EMERGENCY SECURITY FIX PROTOCOL

This command focuses ONLY on fixing critical RLS vulnerabilities on partition tables.

### IMMEDIATE ACTIONS:

1. **CONNECT TO DATABASE**
   - Use `mcp__supabase__list_projects`
   - Select project: `nwmcpfioxerzodvbjigw`

2. **IDENTIFY UNPROTECTED PARTITIONS**
   ```sql
   -- Use mcp__supabase__execute_sql
   SELECT schemaname, tablename
   FROM pg_tables
   WHERE schemaname IN ('analytics', 'scheduling', 'communication', 'identity')
   AND tablename LIKE '%_p20%' OR tablename LIKE '%_default'
   AND rowsecurity = false;
   ```

3. **APPLY RLS FIXES IN BATCHES**

   #### Analytics Events Partitions (15 tables):
   ```sql
   -- Migration: fix_rls_analytics_events_partitions_[date]
   DO $$
   DECLARE
     partition_name TEXT;
   BEGIN
     FOR partition_name IN
       SELECT tablename FROM pg_tables
       WHERE schemaname = 'analytics'
       AND tablename LIKE 'analytics_events%'
       AND rowsecurity = false
     LOOP
       EXECUTE format('ALTER TABLE analytics.%I ENABLE ROW LEVEL SECURITY', partition_name);
       EXECUTE format('
         CREATE POLICY "tenant_isolation" ON analytics.%I
         FOR ALL
         USING (
           salon_id IN (
             SELECT salon_id FROM organization.staff
             WHERE user_id = auth.uid()
           )
         )', partition_name);
     END LOOP;
   END $$;
   ```

   #### Appointments Partitions (10 tables):
   ```sql
   -- Migration: fix_rls_appointments_partitions_[date]
   DO $$
   DECLARE
     partition_name TEXT;
   BEGIN
     FOR partition_name IN
       SELECT tablename FROM pg_tables
       WHERE schemaname = 'scheduling'
       AND tablename LIKE 'appointments%'
       AND rowsecurity = false
     LOOP
       EXECUTE format('ALTER TABLE scheduling.%I ENABLE ROW LEVEL SECURITY', partition_name);
       EXECUTE format('
         CREATE POLICY "tenant_isolation" ON scheduling.%I
         FOR ALL
         USING (
           salon_id IN (
             SELECT salon_id FROM organization.staff
             WHERE user_id = auth.uid()
           ) OR customer_id = auth.uid()
         )', partition_name);
     END LOOP;
   END $$;
   ```

   #### Messages Partitions (9 tables):
   ```sql
   -- Migration: fix_rls_messages_partitions_[date]
   DO $$
   DECLARE
     partition_name TEXT;
   BEGIN
     FOR partition_name IN
       SELECT tablename FROM pg_tables
       WHERE schemaname = 'communication'
       AND tablename LIKE 'messages%'
       AND rowsecurity = false
     LOOP
       EXECUTE format('ALTER TABLE communication.%I ENABLE ROW LEVEL SECURITY', partition_name);
       EXECUTE format('
         CREATE POLICY "tenant_isolation" ON communication.%I
         FOR ALL
         USING (
           salon_id IN (
             SELECT salon_id FROM organization.staff
             WHERE user_id = auth.uid()
           ) OR sender_id = auth.uid() OR recipient_id = auth.uid()
         )', partition_name);
     END LOOP;
   END $$;
   ```

   #### Audit Logs Partitions (11 tables):
   ```sql
   -- Migration: fix_rls_audit_logs_partitions_[date]
   DO $$
   DECLARE
     partition_name TEXT;
   BEGIN
     FOR partition_name IN
       SELECT tablename FROM pg_tables
       WHERE schemaname = 'identity'
       AND tablename LIKE 'audit_logs%'
       AND rowsecurity = false
     LOOP
       EXECUTE format('ALTER TABLE identity.%I ENABLE ROW LEVEL SECURITY', partition_name);
       EXECUTE format('
         CREATE POLICY "tenant_isolation" ON identity.%I
         FOR ALL
         USING (
           user_id = auth.uid() OR
           salon_id IN (
             SELECT salon_id FROM organization.staff
             WHERE user_id = auth.uid() AND role IN (''owner'', ''admin'')
           )
         )', partition_name);
     END LOOP;
   END $$;
   ```

   #### Daily Metrics Partitions (7 tables):
   ```sql
   -- Migration: fix_rls_daily_metrics_partitions_[date]
   DO $$
   DECLARE
     partition_name TEXT;
   BEGIN
     FOR partition_name IN
       SELECT tablename FROM pg_tables
       WHERE schemaname = 'analytics'
       AND tablename LIKE 'daily_metrics%'
       AND rowsecurity = false
     LOOP
       EXECUTE format('ALTER TABLE analytics.%I ENABLE ROW LEVEL SECURITY', partition_name);
       EXECUTE format('
         CREATE POLICY "tenant_isolation" ON analytics.%I
         FOR ALL
         USING (
           salon_id IN (
             SELECT salon_id FROM organization.staff
             WHERE user_id = auth.uid()
           )
         )', partition_name);
     END LOOP;
   END $$;
   ```

4. **VERIFY ALL FIXES**
   ```sql
   -- Check all partitions now have RLS
   SELECT
     schemaname,
     COUNT(*) as total_partitions,
     SUM(CASE WHEN rowsecurity THEN 1 ELSE 0 END) as rls_enabled,
     SUM(CASE WHEN NOT rowsecurity THEN 1 ELSE 0 END) as rls_disabled
   FROM pg_tables
   WHERE tablename LIKE '%_p20%' OR tablename LIKE '%_default'
   GROUP BY schemaname
   ORDER BY schemaname;

   -- Verify policies exist
   SELECT schemaname, tablename, COUNT(*) as policy_count
   FROM pg_policies
   WHERE schemaname IN ('analytics', 'scheduling', 'communication', 'identity')
   GROUP BY schemaname, tablename
   ORDER BY schemaname, tablename;
   ```

5. **UPDATE TRACKER**
   - Edit `docs/database-analysis/DATABASE_PROGRESS_TRACKER.md`
   - Mark all RLS partition tasks as `[x]` completed
   - Update security task count

6. **SECURITY REPORT**
   ```
   🔒 CRITICAL SECURITY FIX COMPLETE
   ==================================

   BEFORE:
   - 52 partition tables WITHOUT RLS
   - Complete tenant data exposure risk
   - Any authenticated user could access all data

   AFTER:
   - All partition tables protected with RLS
   - Tenant isolation enforced
   - Data access restricted by user context

   Schemas Protected:
   ✅ analytics (22 partitions)
   ✅ scheduling (10 partitions)
   ✅ communication (9 partitions)
   ✅ identity (11 partitions)

   Total Policies Created: 52
   Security Score Improvement: +30 points

   VERIFICATION: All critical vulnerabilities patched
   ```

### ⚡ EXECUTE IMMEDIATELY

This is a CRITICAL security fix. Execute now to protect tenant data.