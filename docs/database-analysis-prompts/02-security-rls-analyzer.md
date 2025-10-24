# Database Security & RLS Policy Analyzer Agent

Create an agent that performs ultra-deep analysis of Row Level Security (RLS) policies, permissions, and security configurations.

## Agent Objective

Analyze all security aspects of the Supabase database including RLS policies, table permissions, authentication patterns, and potential security vulnerabilities.

## Analysis Tasks

1. **RLS Policy Coverage**
   - Identify tables with RLS enabled vs disabled
   - List all RLS policies and their definitions
   - Find tables missing RLS policies
   - Analyze policy completeness (SELECT, INSERT, UPDATE, DELETE)

2. **Policy Logic Analysis**
   - Check for overly permissive policies (USING true)
   - Identify policies without tenant scoping
   - Find policies missing auth.uid() checks
   - Detect circular or conflicting policies

3. **Permission Analysis**
   - List role grants for each table
   - Check for public schema access
   - Identify tables with anon role access
   - Find tables with service_role-only access

4. **Authentication Patterns**
   - Check for auth.users() usage in policies
   - Identify tables linking to auth.users
   - Find missing user ID foreign keys
   - Verify tenant isolation patterns

5. **Vulnerability Detection**
   - Tables without RLS but with public access
   - Policies allowing data leakage between tenants
   - Missing cascade deletes on sensitive data
   - Unencrypted sensitive columns

## SQL Queries to Execute

```sql
-- List RLS status for all tables
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, tablename;

-- Get all RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, tablename, policyname;

-- Find tables with RLS disabled
SELECT
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND rowsecurity = false
ORDER BY schemaname, tablename;

-- Check table permissions for anon and authenticated roles
SELECT
  schemaname,
  tablename,
  string_agg(privilege_type, ', ') as privileges,
  grantee
FROM information_schema.table_privileges
WHERE table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND grantee IN ('anon', 'authenticated', 'service_role', 'postgres')
GROUP BY schemaname, tablename, grantee
ORDER BY schemaname, tablename, grantee;

-- Find policies with overly permissive conditions
SELECT
  schemaname,
  tablename,
  policyname,
  qual
FROM pg_policies
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND (
    qual ILIKE '%true%'
    OR qual IS NULL
    OR qual = ''
  )
ORDER BY schemaname, tablename;

-- Check for tenant isolation patterns
SELECT
  table_schema,
  table_name,
  column_name
FROM information_schema.columns
WHERE table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND column_name IN ('tenant_id', 'salon_id', 'organization_id', 'owner_id')
ORDER BY table_schema, table_name;

-- Find tables missing user/tenant isolation columns
SELECT DISTINCT
  t.table_schema,
  t.table_name
FROM information_schema.tables t
LEFT JOIN information_schema.columns c
  ON t.table_schema = c.table_schema
  AND t.table_name = c.table_name
  AND c.column_name IN ('tenant_id', 'salon_id', 'organization_id', 'owner_id', 'user_id', 'created_by')
WHERE t.table_schema IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
  AND t.table_type = 'BASE TABLE'
  AND c.column_name IS NULL
ORDER BY t.table_schema, t.table_name;

-- Check for policies using auth.uid()
SELECT
  schemaname,
  tablename,
  policyname,
  CASE
    WHEN qual ILIKE '%auth.uid()%' THEN 'Uses auth.uid() in USING'
    ELSE 'No auth.uid() in USING'
  END as auth_check_using,
  CASE
    WHEN with_check ILIKE '%auth.uid()%' THEN 'Uses auth.uid() in WITH CHECK'
    ELSE 'No auth.uid() in WITH CHECK'
  END as auth_check_with_check
FROM pg_policies
WHERE schemaname IN ('organisation', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement', 'public')
ORDER BY schemaname, tablename, policyname;
```

## Report Structure

Create a markdown report at `docs/database-analysis/02-security-rls-report.md` with:

### Executive Summary
- Tables with RLS enabled/disabled
- Total policies analyzed
- Critical security issues
- Tables with public access

### RLS Coverage Analysis
- Schema-by-schema RLS status
- Policy coverage by operation (SELECT/INSERT/UPDATE/DELETE)
- Tables without adequate protection

### Critical Security Issues
- **High Priority**
  - Tables without RLS but with public access
  - Policies allowing cross-tenant data access
  - Missing auth checks

- **Medium Priority**
  - Incomplete policy coverage
  - Overly permissive policies
  - Missing tenant isolation columns

- **Low Priority**
  - Policy naming inconsistencies
  - Redundant policies
  - Performance optimization opportunities

### Tenant Isolation Audit
- Tables with proper tenant scoping
- Tables missing tenant columns
- Policies enforcing tenant boundaries
- Potential data leakage paths

### Authentication Patterns
- Tables linked to auth.users
- Policies using auth.uid()
- Service role bypasses
- Anonymous access patterns

### Recommendations
Prioritized security fixes:
1. Enable RLS on exposed tables
2. Add missing tenant isolation
3. Strengthen weak policies
4. Add missing auth checks
5. Remove overly permissive grants

### Policy Inventory
Complete list of all policies with:
- Table and schema
- Operation type
- Role restrictions
- USING clause
- WITH CHECK clause

## Tools to Use

- `mcp__supabase__list_tables` - Get table list
- `mcp__supabase__execute_sql` - Run security queries
- `mcp__supabase__get_advisors` with type="security" - Get Supabase security advisors
- `Write` - Create the report file

## Success Criteria

Agent completes when:
- All RLS policies analyzed
- Security advisor report included
- All tables checked for proper isolation
- Report saved to docs/database-analysis/
- No errors during execution
