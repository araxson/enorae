-- Supabase advisor remediation (RLS adjustments) captured on 2025-11-16
BEGIN;

-- Harden RLS policies to avoid repeated evaluation of auth.* helpers per row
DO $$
DECLARE
  policy RECORD;
  new_qual text;
  new_with_check text;
BEGIN
  FOR policy IN
    SELECT schemaname, tablename, policyname, qual, with_check
    FROM pg_policies
    WHERE ((qual LIKE '%auth.%' AND qual NOT LIKE '%SELECT auth.%')
        OR (with_check LIKE '%auth.%' AND with_check NOT LIKE '%SELECT auth.%'))
  LOOP
    new_qual := policy.qual;
    new_with_check := policy.with_check;

    IF new_qual IS NOT NULL THEN
      new_qual := regexp_replace(new_qual, 'auth\.([a-z_]+)\(\)', '(SELECT auth.\1())', 'g');
    END IF;

    IF new_with_check IS NOT NULL THEN
      new_with_check := regexp_replace(new_with_check, 'auth\.([a-z_]+)\(\)', '(SELECT auth.\1())', 'g');
    END IF;

    IF new_qual IS NOT NULL AND new_qual <> policy.qual THEN
      EXECUTE 'ALTER POLICY ' || quote_ident(policy.policyname)
           || ' ON ' || quote_ident(policy.schemaname) || '.' || quote_ident(policy.tablename)
           || ' USING ' || new_qual;
    END IF;

    IF new_with_check IS NOT NULL AND new_with_check <> policy.with_check THEN
      EXECUTE 'ALTER POLICY ' || quote_ident(policy.policyname)
           || ' ON ' || quote_ident(policy.schemaname) || '.' || quote_ident(policy.tablename)
           || ' WITH CHECK ' || new_with_check;
    END IF;
  END LOOP;
END;
$$;

-- Consolidate duplicate permissive policies surfaced by the advisor
DROP POLICY IF EXISTS admin_read_archived ON archive.appointments;

DROP POLICY IF EXISTS record_registry_select_admin ON audit.record_registry;
DROP POLICY IF EXISTS record_registry_select_self ON audit.record_registry;

CREATE POLICY record_registry_select_access
  ON audit.record_registry
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM identity.user_roles r
      WHERE r.user_id = (SELECT auth.uid())
        AND r.role = ANY (ARRAY['super_admin'::role_type, 'platform_admin'::role_type])
        AND r.is_active = true
    )
    OR (
      (target_schema = 'auth' AND target_table = 'users' AND record_id = (SELECT auth.uid()))
      OR (target_schema = 'identity' AND record_id = (SELECT auth.uid()))
    )
  );

DROP POLICY IF EXISTS user_actions_select_admin ON audit.user_actions;
DROP POLICY IF EXISTS user_actions_select_self ON audit.user_actions;

CREATE POLICY user_actions_select_access
  ON audit.user_actions
  FOR SELECT
  TO public
  USING (
    (user_id = (SELECT auth.uid()))
    OR EXISTS (
      SELECT 1
      FROM identity.user_roles r
      WHERE r.user_id = (SELECT auth.uid())
        AND r.role = ANY (ARRAY['super_admin'::role_type, 'platform_admin'::role_type])
        AND r.is_active = true
    )
  );

COMMIT;
