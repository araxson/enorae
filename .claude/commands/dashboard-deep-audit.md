# Dashboard Deep Analysis & Audit

## Objective
Perform a comprehensive, deep analysis of all role-based dashboards in the Enorae platform. Identify issues related to data fetching, permissions, UI/UX, type safety, and implementation gaps.

## Instructions

### Phase 1: Role & Permission Discovery (Use Supabase MCP)

**CRITICAL**: Use Supabase MCP tools extensively to understand the database architecture.

1. **Understand Available Views**:
   ```
   Use mcp__supabase__list_tables to discover all public views
   ```

2. **Map Roles to Permissions**:
   - Use `mcp__supabase__execute_sql` to query roles:
   ```sql
   SELECT * FROM identity.user_roles;
   SELECT * FROM identity.profile_metadata;
   ```

3. **Understand Role Hierarchy**:
   - Platform: `super_admin`, `platform_admin`
   - Business: `tenant_owner`, `salon_owner`, `salon_manager`
   - Staff: `senior_staff`, `staff`, `junior_staff`
   - Customer: `vip_customer`, `customer`, `guest`

4. **Check RLS Policies**:
   ```sql
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
   FROM pg_policies
   WHERE schemaname IN ('organization', 'catalog', 'scheduling', 'inventory', 'identity', 'communication', 'analytics', 'engagement')
   ORDER BY schemaname, tablename, policyname;
   ```

5. **Verify View Accessibility**:
   For each public view, check:
   - What data it exposes
   - Which roles can access it
   - RLS policies applied

### Phase 2: Dashboard Analysis

Analyze each dashboard thoroughly:

#### 2.1 Admin Dashboard (`app/(admin)/admin/page.tsx`)
- **Location**: `features/admin/dashboard/`
- **Roles**: `super_admin`, `platform_admin`
- **Check**:
  - [ ] Data queries use correct public views
  - [ ] Proper auth checks in all API functions
  - [ ] Types from `Database['public']['Views']`
  - [ ] Metrics shown: platform stats, recent salons, user role distribution
  - [ ] No exposure of sensitive data beyond admin scope
  - [ ] All subnav pages implemented and functional

#### 2.2 Business Dashboard (`app/(business)/business/page.tsx`)
- **Location**: `features/business/dashboard/`
- **Roles**: `tenant_owner`, `salon_owner`, `salon_manager`
- **Check**:
  - [ ] Data queries use correct public views
  - [ ] Proper auth checks and salon ownership verification
  - [ ] Types from `Database['public']['Views']`
  - [ ] Metrics shown: revenue, appointments, staff performance
  - [ ] Multi-location support for tenant_owner
  - [ ] Single-location scope for salon_owner
  - [ ] All subnav pages implemented and functional

#### 2.3 Staff Dashboard (`app/(staff)/staff/page.tsx`)
- **Location**: `features/staff/dashboard/`
- **Roles**: `senior_staff`, `staff`, `junior_staff`
- **Check**:
  - [ ] Data queries use correct public views
  - [ ] Proper auth checks and staff profile verification
  - [ ] Types from `Database['public']['Views']`
  - [ ] Metrics shown: today's schedule, upcoming appointments, commission
  - [ ] Scope limited to staff's own data
  - [ ] All subnav pages implemented and functional

#### 2.4 Customer Dashboard (`app/(customer)/customer/page.tsx`)
- **Location**: `features/customer/dashboard/`
- **Roles**: `vip_customer`, `customer`, `guest`
- **Check**:
  - [ ] Data queries use correct public views
  - [ ] Proper auth checks
  - [ ] Types from `Database['public']['Views']`
  - [ ] Metrics shown: upcoming appointments, favorites, loyalty points
  - [ ] VIP-specific features visible only to vip_customer
  - [ ] All subnav pages implemented and functional

### Phase 3: Deep Technical Analysis

For each dashboard, verify:

#### 3.1 Data Layer (`api/queries.ts`)
- [ ] `import 'server-only'` directive present
- [ ] Auth check at start of every function
- [ ] Queries from public views (NOT schema tables)
- [ ] Proper error handling
- [ ] Type safety (no `any` types)
- [ ] Return types properly defined

Example pattern to check for:
```typescript
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

export async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Query from public view
  const { data, error } = await supabase
    .from('view_name')
    .select('*')
    .eq('user_id', user.id)

  if (error) throw error
  return data
}
```

#### 3.2 Server Actions (`api/mutations.ts`)
- [ ] `'use server'` directive present
- [ ] Auth check before mutations
- [ ] Mutations on schema tables (NOT views)
- [ ] Proper error handling
- [ ] Cache revalidation with `revalidatePath`
- [ ] Type safety

#### 3.3 Components
- [ ] Proper separation: UI components vs feature components
- [ ] Client components marked with `'use client'`
- [ ] Using shadcn/ui components (pre-installed)
- [ ] Using layout components (Stack, Grid, Flex, Box)
- [ ] Using typography components (H1, H2, P, Muted)
- [ ] No custom UI primitives
- [ ] Proper loading states
- [ ] Error boundaries

#### 3.4 Page Implementation
- [ ] Ultra-thin (5-15 lines max)
- [ ] Only renders feature component
- [ ] No data fetching in page
- [ ] No business logic in page
- [ ] Proper metadata

#### 3.5 Performance
- [ ] Efficient queries (no N+1 problems)
- [ ] Proper use of server components
- [ ] Minimal client-side JavaScript
- [ ] Loading skeletons implemented
- [ ] Suspense boundaries where needed

### Phase 4: Cross-Cutting Concerns

#### 4.1 Security Audit
- [ ] All database queries have RLS policies
- [ ] Auth checks in every DAL function
- [ ] No leaked sensitive data between roles
- [ ] Proper role-based access control
- [ ] No SQL injection vulnerabilities
- [ ] Secure session handling

Use Supabase MCP to check:
```
mcp__supabase__get_advisors with type: "security"
```

#### 4.2 Type Safety
- [ ] All types from `Database['public']['Views']`
- [ ] No `any` types anywhere
- [ ] Proper TypeScript strict mode
- [ ] Type inference working correctly
- [ ] No type assertion abuse

#### 4.3 UI/UX Consistency
- [ ] Consistent layout across all dashboards
- [ ] Proper spacing using layout system
- [ ] Consistent typography
- [ ] Accessible components (ARIA labels)
- [ ] Responsive design
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

#### 4.4 Navigation & Routing
- [ ] Correct default routes per role
- [ ] Breadcrumbs implemented
- [ ] Sidebar navigation consistent
- [ ] Deep linking works
- [ ] Protected routes enforced

### Phase 5: Database-Frontend Integration

For each dashboard:

1. **Map Required Data**:
   - What data does the dashboard need?
   - Which views should provide this data?

2. **Verify View Availability**:
   - Use `mcp__supabase__list_tables` to check if views exist
   - Use `mcp__supabase__execute_sql` to verify view structure

3. **Check Data Integrity**:
   - Do queries return expected data shape?
   - Are joins working correctly?
   - Are aggregations accurate?

4. **Identify Gaps**:
   - Missing views
   - Missing columns in views
   - Incorrect data types
   - Performance issues

### Phase 6: Generate Report

Create a comprehensive report in `docs/DASHBOARD_DEEP_AUDIT_REPORT.md` with:

#### Executive Summary
- Total issues found
- Critical issues
- High-priority issues
- Medium-priority issues
- Low-priority issues

#### Per-Role Dashboard Analysis

For each role (Admin, Business, Staff, Customer):

##### Dashboard: [Role Name]
- **Status**: ✅ Pass / ⚠️ Issues / ❌ Critical Issues
- **Location**: [File path]
- **Roles Supported**: [List of roles]

**Issues Found**:
1. **[Severity]** [Issue Title]
   - **Location**: [File:Line]
   - **Description**: [Detailed description]
   - **Impact**: [What breaks or works incorrectly]
   - **Fix**: [Specific steps to fix]
   - **Code Example**:
   ```typescript
   // Before (wrong)
   ...

   // After (correct)
   ...
   ```

**Missing Features**:
- [ ] [Feature name] - [Why it's needed]

**Performance Issues**:
- [ ] [Issue description] - [Impact]

**Security Concerns**:
- [ ] [Concern description] - [Risk level]

#### Cross-Cutting Issues

**Type Safety**:
- [ ] Issue 1
- [ ] Issue 2

**Security**:
- [ ] Issue 1
- [ ] Issue 2

**Performance**:
- [ ] Issue 1
- [ ] Issue 2

**UI/UX Consistency**:
- [ ] Issue 1
- [ ] Issue 2

#### Database Integration Issues

**Missing Views**:
1. [View name] - [Why needed] - [Which dashboard needs it]

**View Improvements**:
1. [View name] - [What's missing] - [Impact]

**RLS Policy Issues**:
1. [Table/View] - [Issue] - [Fix]

#### Recommendations

**Immediate (Critical)**:
1. [Action item] - [Why] - [Estimated effort]

**Short-term (High Priority)**:
1. [Action item] - [Why] - [Estimated effort]

**Medium-term (Medium Priority)**:
1. [Action item] - [Why] - [Estimated effort]

**Long-term (Low Priority)**:
1. [Action item] - [Why] - [Estimated effort]

#### Metrics

- **Total Files Analyzed**: [Number]
- **Total Issues Found**: [Number]
  - Critical: [Number]
  - High: [Number]
  - Medium: [Number]
  - Low: [Number]
- **Code Quality Score**: [0-100]
- **Type Safety Score**: [0-100]
- **Security Score**: [0-100]
- **Performance Score**: [0-100]
- **UX Consistency Score**: [0-100]

## Output Requirements

1. **Be Thorough**: Don't skip any dashboard or role
2. **Be Specific**: Include file paths, line numbers, and exact issues
3. **Be Actionable**: Provide clear fix instructions with code examples
4. **Use Supabase MCP**: Extensively use MCP tools to verify database state
5. **Cross-Reference**: Link related issues across dashboards
6. **Prioritize**: Mark severity levels for all issues

## Tools to Use

- `Read` - Read all dashboard files
- `Glob` - Find all dashboard-related files
- `Grep` - Search for patterns (auth checks, types, etc.)
- `mcp__supabase__list_tables` - List all views
- `mcp__supabase__execute_sql` - Query database for roles and policies
- `mcp__supabase__get_advisors` - Security and performance advisors
- `mcp__context7__get-library-docs` - Reference Next.js/React best practices

## Success Criteria

- ✅ All 4 dashboards analyzed (Admin, Business, Staff, Customer)
- ✅ All roles mapped to their permissions using Supabase MCP
- ✅ All issues categorized by severity
- ✅ All issues have specific fixes with code examples
- ✅ Report saved to `docs/DASHBOARD_DEEP_AUDIT_REPORT.md`
- ✅ Executive summary provides clear action plan
- ✅ Database integration verified using MCP tools
