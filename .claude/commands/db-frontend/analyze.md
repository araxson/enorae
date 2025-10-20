# Database-Frontend Alignment Analysis - Violation Detection

Scan codebase for database-frontend alignment gaps, missing CRUD operations, type mismatches, orphaned code, and UX inconsistencies. Update existing report or create new.

## Rules Source

**REQUIRED**: Read the following rules completely before scanning:
- `docs/rules/core/database.md` (DB-P001, DB-M301, TS-M302)
- `docs/rules/framework/typescript.md` (TS-P001, TS-M302)
- `docs/rules/core/architecture.md` (ARCH-H101)
- `docs/rules/core/ui.md` (UI-P004, UI-P002)
- `docs/rules/quality/accessibility.md` (A11Y-H103)

**Additional Context**:
- Rules Index: `docs/rules/01-rules-index.md`
- Task Guide: `docs/rules/02-task-based-guide.md`
- Related Rules: DB-P001, TS-M302, ARCH-H101, UI-P002

## Pre-Scan Check

**STEP 1**: Check if `docs/analyze-fixes/db-frontend-alignment/analysis-report.json` exists.
- If EXISTS: Load and preserve all issues with status: `fixed`, `skipped`, `needs_manual`
- If NOT EXISTS: Prepare fresh report structure

## Scan Targets

**STEP 2**: Scan following sources in priority order:

### Critical Priority - Database Schema (Use Supabase MCP)

**IMPORTANT**: Use Supabase MCP tools to get live schema information:

1. **Get live table list** - `mcp__supabase__list_tables`
   - Returns all tables across all schemas (organization, catalog, scheduling, etc.)
   - Use this as source of truth, not just database.types.ts
   - Schemas to check: public, organization, catalog, scheduling, inventory, identity, communication, analytics, engagement

2. **Get migrations** - `mcp__supabase__list_migrations`
   - See what tables/views were added recently
   - Understand schema evolution

3. **Get security advisors** - `mcp__supabase__get_advisors` (type: 'security')
   - Check for missing RLS policies
   - Identify tables without proper security

4. **Get performance advisors** - `mcp__supabase__get_advisors` (type: 'performance')
   - Check for missing indexes on foreign keys
   - Identify performance gaps

5. **Cross-reference with generated types**:
   - `lib/types/database.types.ts` (auto-generated Supabase types)
   - Compare MCP results with types file to catch drift

### Critical Priority - Frontend Data Layer
- `features/**/api/queries.ts` (read operations)
- `features/**/api/mutations.ts` (write operations)
- `features/**/types.ts` (manual type definitions)
- `features/**/schema.ts` (Zod validation schemas)

### High Priority - UI Components
- `features/**/components/**/*Form.tsx` (create/edit forms)
- `features/**/components/**/*List.tsx` (list views)
- `features/**/components/**/*Detail.tsx` (detail views)
- `features/**/components/**/*Table.tsx` (table views)

### Medium Priority - Routes
- `app/**/page.tsx` (page components)
- `app/api/**/route.ts` (API endpoints)

### Exclusions (Never Scan)

From `docs/rules/reference/exclusions.md`:
- `node_modules/`, `.next/`, `.tmp/`, `dist/`, `build/`
- `components/ui/*.tsx` (protected - shadcn/ui)
- `app/globals.css` (protected - design system)
- `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`
- `docs/`, `supabase-docs-rules/`

## Violation Rules

### CRITICAL - Missing Core Functionality

#### Rule: ALIGN-P001 {#align-p001}
- **Pattern**: Every database table/view has corresponding frontend queries
- **Detection**: Compare tables in `database.types.ts` against queries in `features/**/api/queries.ts`
- **Why Critical**: Missing queries mean data exists but is inaccessible to users
- **Example**:
  ```ts
  // ❌ WRONG - Table exists but no query
  Database['public']['Tables']['staff_schedules'] exists
  // But NO query in features/staff/schedules/api/queries.ts

  // ✅ CORRECT - Table has query
  Database['public']['Views']['appointments'] exists
  // AND getAppointments() in features/business/appointments/api/queries.ts
  ```
- **Reference**: `docs/rules/core/database.md#db-p001`
- **Related Rules**: DB-P001, ARCH-H101

#### Rule: ALIGN-P002 {#align-p002}
- **Pattern**: Every mutable table has corresponding frontend mutations for required operations
- **Detection**: Identify tables needing CRUD, check if mutations exist
- **Why Critical**: Users cannot modify data without mutations
- **Example**:
  ```ts
  // ❌ WRONG - Appointments table but no delete mutation
  Database['public']['Tables']['appointments'] exists
  // createAppointment ✅, updateAppointment ✅, deleteAppointment ❌

  // ✅ CORRECT - Complete CRUD
  // createAppointment, updateAppointment, deleteAppointment all exist
  ```
- **Reference**: `docs/rules/core/database.md#db-p002`
- **Related Rules**: DB-P002, DB-M302

#### Rule: ALIGN-P003 {#align-p003}
- **Pattern**: Frontend types use generated Database types, not manual definitions
- **Detection**: Search for manual interfaces duplicating database entities
- **Why Critical**: Type drift causes runtime errors when schema changes
- **Example**:
  ```ts
  // ❌ WRONG - Manual type definition
  interface Appointment {
    id: string
    salon_id: string
    // Missing new columns, wrong types
  }

  // ✅ CORRECT - Generated type
  type Appointment = Database['public']['Views']['appointments']['Row']
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-m302`
- **Related Rules**: TS-M302, DB-M301

### HIGH PRIORITY - Incomplete Implementations

#### Rule: ALIGN-H101 {#align-h101}
- **Pattern**: Tables with queries have complete UI components (list, detail, create/edit forms)
- **Detection**: Check if query has corresponding UI components
- **Why High**: Partial UI means incomplete user experience
- **Example**:
  ```tsx
  // ❌ WRONG - Query exists but no UI
  getServices() exists
  // But NO ServicesList.tsx or ServiceForm.tsx

  // ✅ CORRECT - Complete UI flow
  getServices() exists
  ServicesList.tsx exists (list view)
  ServiceDetail.tsx exists (detail view)
  ServiceForm.tsx exists (create/edit)
  ```
- **Reference**: `docs/rules/core/architecture.md#arch-h101`
- **Related Rules**: ARCH-H101

#### Rule: ALIGN-H102 {#align-h102}
- **Pattern**: Form components include all editable database columns
- **Detection**: Compare form fields against table columns
- **Why High**: Missing form fields prevent users from editing data
- **Example**:
  ```tsx
  // ❌ WRONG - Missing fields
  // Table has: name, description, price, duration_minutes, is_active
  // Form only has: name, price (missing description, duration, is_active)

  // ✅ CORRECT - All editable fields present
  <ServiceForm>
    <Input name="name" />
    <Textarea name="description" />
    <Input name="price" type="number" />
    <Input name="duration_minutes" type="number" />
    <Switch name="is_active" />
  </ServiceForm>
  ```
- **Reference**: `docs/rules/core/ui.md#ui-p002`
- **Related Rules**: UI-P002, A11Y-H103

#### Rule: ALIGN-H103 {#align-h103}
- **Pattern**: Zod schemas match database column types and constraints
- **Detection**: Compare schema.ts validations against database types
- **Why High**: Validation mismatches allow invalid data
- **Example**:
  ```ts
  // ❌ WRONG - Type mismatch
  // Database: duration_minutes: number (required)
  // Zod: duration: z.number().optional() (optional)

  // ✅ CORRECT - Matching constraints
  // Database: duration_minutes: number (required, min 15, max 480)
  createServiceSchema = z.object({
    duration_minutes: z.number().min(15).max(480) // matches DB
  })
  ```
- **Reference**: `docs/rules/core/database.md#db-m302`
- **Related Rules**: DB-M302, TS-M302

#### Rule: ALIGN-H104 {#align-h104}
- **Pattern**: Database relationships are navigable in UI
- **Detection**: Check if foreign keys have UI navigation/selection components
- **Why High**: Users need to navigate related entities
- **Example**:
  ```tsx
  // ❌ WRONG - FK exists but no navigation
  // appointments.staff_id → staff_members.id
  // But AppointmentDetail shows staff_id string, no link to staff

  // ✅ CORRECT - Navigable relationship
  <AppointmentDetail>
    <Link href={`/staff/${appointment.staff_id}`}>
      {appointment.staff_member?.name}
    </Link>
  </AppointmentDetail>
  ```
- **Reference**: `docs/rules/core/database.md#db-p001`
- **Related Rules**: DB-P001

### MEDIUM PRIORITY - Code Quality & UX

#### Rule: ALIGN-M301 {#align-m301}
- **Pattern**: Orphaned frontend code is removed (queries for non-existent tables)
- **Detection**: Find queries/mutations/types for tables not in database.types.ts
- **Why Medium**: Dead code causes confusion and maintenance burden
- **Example**:
  ```ts
  // ❌ WRONG - Query for removed table
  getCustomerWallets() // Table customer_wallets was removed

  // ✅ CORRECT - Only queries for existing tables
  // Remove getCustomerWallets() and features/customer/wallet/ directory
  ```
- **Reference**: `docs/rules/core/architecture.md#arch-m301`
- **Related Rules**: ARCH-M301

#### Rule: ALIGN-M302 {#align-m302}
- **Pattern**: List views display key columns from database tables
- **Detection**: Compare table columns against what's displayed in list/table components
- **Why Medium**: Users need to see relevant data at a glance
- **Example**:
  ```tsx
  // ❌ WRONG - Missing important columns
  // Table has: id, name, email, phone, status, created_at
  // List only shows: name, email (missing status, created_at)

  // ✅ CORRECT - Key columns displayed
  <CustomersList columns={['name', 'email', 'phone', 'status', 'created_at']} />
  ```
- **Reference**: `docs/rules/core/ui.md#ui-p004`
- **Related Rules**: UI-P004, A11Y-H102

#### Rule: ALIGN-M303 {#align-m303}
- **Pattern**: Empty states guide users when no data exists
- **Detection**: Check list components for empty state handling
- **Why Medium**: UX suffers without guidance on empty collections
- **Example**:
  ```tsx
  // ❌ WRONG - No empty state
  {appointments.length === 0 ? null : <AppointmentsList />}

  // ✅ CORRECT - Helpful empty state
  {appointments.length === 0 ? (
    <Empty
      icon={<CalendarIcon />}
      title="No appointments yet"
      description="Create your first appointment to get started"
      action={<Button>Create Appointment</Button>}
    />
  ) : (
    <AppointmentsList data={appointments} />
  )}
  ```
- **Reference**: `docs/rules/core/ui.md#ui-p002`
- **Related Rules**: UI-P002, A11Y-H101

#### Rule: ALIGN-M304 {#align-m304}
- **Pattern**: CRUD operations have corresponding UI affordances
- **Detection**: Check if delete mutation has delete button, edit has edit button, etc.
- **Why Medium**: Operations without UI are invisible to users
- **Example**:
  ```tsx
  // ❌ WRONG - Delete mutation exists but no delete button
  deleteAppointment() exists in mutations.ts
  // But AppointmentActions has no delete button

  // ✅ CORRECT - Mutation has UI
  <AppointmentActions>
    <Button onClick={handleEdit}>Edit</Button>
    <Button onClick={handleDelete} variant="destructive">Delete</Button>
  </AppointmentActions>
  ```
- **Reference**: `docs/rules/core/ui.md#ui-h103`
- **Related Rules**: UI-H103, A11Y-H101

### LOW PRIORITY - Optimizations & Polish

#### Rule: ALIGN-L701 {#align-l701}
- **Pattern**: List views support filtering for key columns
- **Detection**: Check if list components have filter UI for filterable columns
- **Example**:
  ```tsx
  // Could add filters for status, date range, salon_id
  <AppointmentsList
    filters={
      <AppointmentFilters>
        <StatusFilter />
        <DateRangeFilter />
        <SalonFilter />
      </AppointmentFilters>
    }
  />
  ```
- **Reference**: `docs/rules/quality/accessibility.md#a11y-h103`

#### Rule: ALIGN-L702 {#align-l702}
- **Pattern**: Detail views show all readable columns
- **Detection**: Compare detail component against table columns
- **Reference**: `docs/rules/core/ui.md#ui-p001`

#### Rule: ALIGN-L703 {#align-l703}
- **Pattern**: Forms provide helpful validation messages
- **Detection**: Check if form errors reference field names clearly
- **Reference**: `docs/rules/quality/accessibility.md#a11y-h103`

### NEW RULES - Security & Performance Alignment

#### Rule: ALIGN-H105 {#align-h105}
- **Pattern**: User-facing tables with queries must have RLS policies
- **Detection**: Use Supabase MCP security advisors to check RLS coverage
- **Why High**: Missing RLS = critical security hole, cross-tenant leaks
- **Example**:
  ```sql
  -- ❌ WRONG - Table has queries but no RLS
  -- getStaffMembers() exists in frontend
  -- But NO RLS policy on organization.staff_members

  -- ✅ CORRECT - RLS enforced
  create policy "Staff members are tenant-scoped"
    on organization.staff_members
    for select
    using (
      salon_id = any(
        select jsonb_array_elements_text(
          auth.jwt()->'app_metadata'->'salon_ids'
        )
      )
    );
  ```
- **Reference**: `docs/rules/core/security.md#sec-p003`
- **Related Rules**: SEC-P003, DB-P003

#### Rule: ALIGN-H106 {#align-h106}
- **Pattern**: Queried foreign key columns must have indexes
- **Detection**: Use Supabase MCP performance advisors to check index coverage
- **Why High**: Missing indexes cause table scans and slow queries
- **Example**:
  ```sql
  -- ❌ WRONG - Query uses staff_id but no index
  -- Query: .from('appointments').eq('staff_id', ...)
  -- No index on appointments.staff_id

  -- ✅ CORRECT - Index exists
  create index concurrently appointments_staff_id_idx
    on scheduling.appointments(staff_id);
  ```
- **Reference**: `docs/rules/quality/performance.md#perf-h101`
- **Related Rules**: PERF-H101

## Analysis Process

### STEP 3: Database Inventory (Use Supabase MCP)

1. **Get live database schema using MCP**
   ```typescript
   // Use mcp__supabase__list_tables with schemas parameter
   const tables = await mcp__supabase__list_tables({
     project_id: 'enorae-project-id',
     schemas: ['public', 'organization', 'catalog', 'scheduling',
               'inventory', 'identity', 'communication', 'analytics', 'engagement']
   })
   ```

2. **Cross-reference with database.types.ts**
   - Extract all Tables from `Database['public']['Tables']`
   - Extract all Views from `Database['public']['Views']`
   - **Identify discrepancies**:
     - Tables in Supabase but not in types file (need regeneration)
     - Tables in types file but not in Supabase (orphaned types)
   - Identify columns, types, nullable, relationships

3. **Get security context using MCP**
   ```typescript
   // Check for RLS policy gaps
   const securityAdvisors = await mcp__supabase__get_advisors({
     project_id: 'enorae-project-id',
     type: 'security'
   })
   // Tables without RLS are critical alignment gaps
   ```

4. **Get performance context using MCP**
   ```typescript
   // Check for missing indexes
   const perfAdvisors = await mcp__supabase__get_advisors({
     project_id: 'enorae-project-id',
     type: 'performance'
   })
   // Missing indexes affect query performance
   ```

5. **Categorize tables by usage**
   - **User-facing**: Need full CRUD + UI (appointments, services, staff, etc.)
   - **Configuration**: Need admin UI (settings, roles, permissions)
   - **System**: Read-only or internal (audit logs, sessions)
   - **Analytics**: Views for reporting (metrics_mv, analytics views)

### STEP 4: Frontend Coverage Scan

For each user-facing table/view:

1. **Check Queries** (ALIGN-P001)
   - Search for `.from('<table_name>')` in features/**/api/queries.ts
   - Mark: ✅ Has queries | ❌ Missing queries

2. **Check Mutations** (ALIGN-P002)
   - Search for mutations in features/**/api/mutations.ts
   - Check CRUD: Create, Read (N/A for mutations), Update, Delete
   - Mark each operation: ✅ Exists | ❌ Missing

3. **Check Types** (ALIGN-P003)
   - Search features/**/types.ts for manual interfaces
   - Verify using Database['public']['Tables/Views']['...']['Row']
   - Mark: ✅ Using generated | ⚠️ Manual definition | ❌ No type

4. **Check UI Components** (ALIGN-H101)
   - Search for List/Table components
   - Search for Detail/View components
   - Search for Form components (Create/Edit)
   - Mark each: ✅ Exists | ❌ Missing

5. **Check Form Completeness** (ALIGN-H102)
   - Parse Form component fields
   - Compare against editable table columns
   - Mark: ✅ All fields | ⚠️ Missing fields | ❌ No form

6. **Check Zod Schemas** (ALIGN-H103)
   - Parse schema.ts validations
   - Compare types against database columns
   - Mark: ✅ Matches | ⚠️ Mismatch | ❌ No schema

7. **Check Relationships** (ALIGN-H104)
   - Identify foreign keys from database.types.ts
   - Check if UI shows related entities
   - Check if UI allows navigation to related entities
   - Mark: ✅ Navigable | ⚠️ Display only | ❌ Not shown

### STEP 5: Orphan Detection (Use Supabase MCP)

1. **Find orphaned queries** (ALIGN-M301)
   - Scan all `.from('...')` calls in queries.ts
   - Check if table/view exists in **live Supabase schema** (via MCP)
   - Also check database.types.ts
   - Flag: ❌ Orphaned if table doesn't exist in either
   - **Priority**: If exists in Supabase but not in types → need type regeneration
   - **Priority**: If exists in types but not in Supabase → fully orphaned, delete code

2. **Find orphaned mutations** (ALIGN-M301)
   - Scan all `.insert()`, `.update()`, `.delete()` in mutations.ts
   - Check if target table exists
   - Flag: ❌ Orphaned if table doesn't exist

3. **Find orphaned types** (ALIGN-M301)
   - Scan manual type definitions
   - Check if corresponding table exists
   - Flag: ❌ Orphaned if no matching table

4. **Find orphaned features** (ALIGN-M301)
   - Identify feature directories (features/**/[feature]/)
   - Check if feature has any valid queries/mutations
   - Flag: ❌ Orphaned if all operations target removed tables

### STEP 6: Security & Performance Alignment (Use Supabase MCP)

1. **Check RLS policy coverage** (NEW: ALIGN-H105)
   - Get security advisors via MCP
   - For each user-facing table with queries:
     * Check if RLS policies exist
     * Flag: ⚠️ Missing RLS if table has frontend queries but no RLS
   - Example violation:
     ```
     Table: organization.staff_members
     Has queries: ✅ getStaffMembers() exists
     Has RLS: ❌ No RLS policy found
     Impact: CRITICAL - Security hole, cross-tenant data leak
     ```

2. **Check index coverage for queried columns** (NEW: ALIGN-H106)
   - Get performance advisors via MCP
   - For each query with `.eq()`, `.in()`, check if column has index
   - Flag: ⚠️ Missing index on frequently queried columns
   - Example violation:
     ```
     Query: .from('appointments').eq('staff_id', ...)
     Index: ❌ No index on staff_id
     Impact: HIGH - Slow queries, table scans
     ```

### STEP 7: UX Quality Scan

1. **Check empty states** (ALIGN-M303)
   - Find all list/table components
   - Check for empty state handling
   - Mark: ✅ Has empty state | ❌ Missing

2. **Check UI affordances** (ALIGN-M304)
   - For each mutation, check if button/action exists
   - Mark: ✅ Has UI | ❌ No UI affordance

3. **Check filters** (ALIGN-L701)
   - Identify list components
   - Check for filter components
   - Mark: ✅ Has filters | ⚠️ Partial | ❌ None

4. **Check detail completeness** (ALIGN-L702)
   - Compare detail view fields against table columns
   - Mark: ✅ Shows all | ⚠️ Missing columns

## Issue Structure (Required Fields)

For each violation found, create:

```json
{
  "code": "ALIGN-[P|H|M|L]###",
  "domain": "ALIGN",
  "priority": "critical" | "high" | "medium" | "low",
  "priority_order": number,
  "category": "db-frontend-alignment",
  "entity": "table_name or feature_name",
  "entity_type": "table" | "view" | "feature" | "component",
  "file": "relative/path/from/project/root",
  "line_start": number,
  "line_end": number,
  "rule": "ALIGN-[P|H|M|L]###",
  "title": "Brief violation description",
  "description": "Full explanation with rule reference",
  "gap_type": "missing_query" | "missing_mutation" | "missing_ui" | "type_mismatch" | "orphaned_code" | "incomplete_crud" | "missing_ux",
  "current_state": "What exists now",
  "expected_state": "What should exist",
  "missing_operations": ["create", "read", "update", "delete"] | null,
  "missing_ui_components": ["list", "detail", "form"] | null,
  "affected_users": "Which user role is impacted",
  "fix_pattern": "Required implementation from rule file",
  "reference": "docs/rules/[category]/[domain].md#align-[p|h|m|l]###",
  "related_rules": ["DOMAIN-CODE", ...],
  "estimated_effort": "5 minutes" | "15 minutes" | "30 minutes" | "1 hour" | "2 hours" | "4+ hours",
  "status": "pending",
  "first_detected": "ISO-8601 timestamp",
  "last_detected": "ISO-8601 timestamp"
}
```

## Priority Code Assignment

**STEP 7**: Assign codes using ALIGN domain prefix:

1. Sort violations: critical → high → medium → low
2. Within same priority: alphabetically by entity, then gap_type
3. Assign codes:
   - Critical: ALIGN-P001 through ALIGN-P099 (missing core functionality)
   - High: ALIGN-H100 through ALIGN-H299 (incomplete implementations)
   - Medium: ALIGN-M300 through ALIGN-M699 (code quality & UX)
   - Low: ALIGN-L700 through ALIGN-L999 (optimizations)

## Merge Logic (For Updates)

**STEP 8**: If existing report loaded:

1. **Preserve**: All issues with status: fixed, skipped, needs_manual
2. **Check regressions**: For each "fixed" issue
   - Re-scan original location with original rule
   - If violation exists: status = "regressed", add regressed_at
   - If clean: keep status = "fixed"
3. **Detect resolved**: For each "pending" issue
   - Re-scan location
   - If violation gone: status = "resolved", add resolved_at
   - If exists: keep "pending", update last_detected
4. **Add new**: New violations get status = "pending"

## Output Files (Required)

**STEP 9**: Generate exactly 2 files:

1. `docs/analyze-fixes/db-frontend-alignment/analysis-report.json` - Machine-readable
2. `docs/analyze-fixes/db-frontend-alignment/analysis-report.md` - Human-readable

## Metadata Requirements

Include in JSON:
```json
{
  "metadata": {
    "area": "db-frontend-alignment",
    "domain": "ALIGN",
    "rules_source": [
      "docs/rules/core/database.md",
      "docs/rules/framework/typescript.md",
      "docs/rules/core/architecture.md",
      "docs/rules/core/ui.md",
      "docs/rules/quality/accessibility.md"
    ],
    "first_analysis": "ISO-8601",
    "last_analysis": "ISO-8601 (now)",
    "update_count": number,
    "total_database_tables": number,
    "total_database_views": number,
    "total_features_scanned": number,
    "total_issues": number
  },
  "summary": {
    "by_priority": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "by_status": {
      "pending": 0,
      "fixed": 0,
      "skipped": 0,
      "needs_manual": 0,
      "failed": 0,
      "regressed": 0
    },
    "by_gap_type": {
      "missing_query": 0,
      "missing_mutation": 0,
      "missing_ui": 0,
      "type_mismatch": 0,
      "orphaned_code": 0,
      "incomplete_crud": 0,
      "missing_ux": 0
    },
    "by_rule": {
      "ALIGN-P001": 0,
      "ALIGN-P002": 0,
      "ALIGN-P003": 0,
      "ALIGN-H101": 0,
      "ALIGN-H102": 0,
      "ALIGN-H103": 0,
      "ALIGN-H104": 0,
      "ALIGN-M301": 0,
      "ALIGN-M302": 0,
      "ALIGN-M303": 0,
      "ALIGN-M304": 0,
      "ALIGN-L701": 0,
      "ALIGN-L702": 0,
      "ALIGN-L703": 0
    },
    "coverage": {
      "tables_with_complete_crud": 0,
      "tables_with_partial_crud": 0,
      "tables_with_no_frontend": 0,
      "tables_with_complete_ui": 0,
      "tables_with_partial_ui": 0,
      "tables_with_no_ui": 0,
      "orphaned_features": 0
    },
    "changes_since_last_analysis": {
      "new_issues": 0,
      "resolved_issues": 0,
      "regressed_issues": 0
    }
  },
  "database_inventory": [
    {
      "table_name": "string",
      "table_type": "table" | "view",
      "schema": "public" | "organization" | "catalog" | "scheduling" | "...",
      "category": "user-facing" | "configuration" | "system" | "analytics",
      "has_queries": boolean,
      "has_mutations": {
        "create": boolean,
        "update": boolean,
        "delete": boolean
      },
      "has_ui": {
        "list": boolean,
        "detail": boolean,
        "form": boolean
      },
      "completeness_score": number,
      "issues_count": number
    }
  ],
  "orphaned_code": [
    {
      "type": "query" | "mutation" | "feature" | "component",
      "path": "string",
      "target_table": "string (non-existent)",
      "recommendation": "string"
    }
  ],
  "issues": [...]
}
```

## Display Requirements

**STEP 10**: Show terminal output:

**If first analysis:**
```
✅ Database-Frontend Alignment Analysis Complete (NEW)

📊 Database Inventory
Total Tables: [count]
Total Views: [count]

📈 Coverage Summary
Tables with Complete CRUD: [count]/[total] ([percent]%)
Tables with Partial CRUD: [count]/[total] ([percent]%)
Tables with No Frontend: [count]/[total] ([percent]%)

Tables with Complete UI: [count]/[total] ([percent]%)
Tables with Partial UI: [count]/[total] ([percent]%)
Tables with No UI: [count]/[total] ([percent]%)

🚨 Total Issues: [count]
├─ Critical (ALIGN-P): [count] (Missing queries/mutations, type drift)
├─ High (ALIGN-H): [count] (Incomplete UI, missing fields, broken relationships)
├─ Medium (ALIGN-M): [count] (Orphaned code, UX gaps)
└─ Low (ALIGN-L): [count] (Polish, optimizations)

📂 Gap Types
├─ Missing Queries: [count]
├─ Missing Mutations: [count]
├─ Missing UI Components: [count]
├─ Type Mismatches: [count]
├─ Orphaned Code: [count]
├─ Incomplete CRUD: [count]
└─ Missing UX: [count]

⚠️ Orphaned Code Detected: [count] files
[List orphaned features/components]

📁 Reports:
├─ docs/analyze-fixes/db-frontend-alignment/analysis-report.json
└─ docs/analyze-fixes/db-frontend-alignment/analysis-report.md

🔧 Next: Run /db-frontend/fix to start fixing
```

**If update:**
```
✅ Database-Frontend Alignment Analysis Updated
📊 Changes: +[new] new, -[resolved] resolved, ⚠️ [regressed] regressed
📈 Current: [total] (was [previous])
📊 Fixed Progress: [fixed_count] kept
🔧 Run /db-frontend/fix to continue
```

## Execution Order

1. Read all required rule files from docs/rules/
2. Read docs/rules/reference/exclusions.md
3. Check for existing report
4. **Use Supabase MCP to get live schema**:
   - `mcp__supabase__list_tables` (all schemas)
   - `mcp__supabase__list_migrations` (recent changes)
   - `mcp__supabase__get_advisors` type='security' (RLS gaps)
   - `mcp__supabase__get_advisors` type='performance' (index gaps)
5. Parse database.types.ts and cross-reference with MCP results
6. Build database inventory (tables, views, columns, relationships, RLS, indexes)
7. Scan all frontend code (queries, mutations, types, components)
8. Detect violations using exact patterns above
9. Check security alignment (RLS coverage for queried tables)
10. Check performance alignment (indexes for queried columns)
11. Classify by gap type and priority
12. Assign ALIGN-prefixed codes
13. Merge with existing data if applicable
14. Generate JSON and MD files with full metadata
15. Display comprehensive summary with security & performance gaps

**Execute now.** Follow steps 1-15 in exact order. Use Supabase MCP for live schema data. Provide detailed coverage analysis with security and performance context.
