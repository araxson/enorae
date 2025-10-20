# Database-Frontend Alignment System - Complete Guide

## 🎯 What Was Created

Two new specialized agents for ensuring perfect alignment between your database schema and frontend implementation.

---

## 📦 Files Created

### 1. **Analyzer Command**
- **Path**: `.claude/commands/db-frontend/analyze.md`
- **Purpose**: Comprehensive analysis of database-frontend gaps
- **Output**: Detailed reports in `docs/analyze-fixes/db-frontend-alignment/`

### 2. **Fixer Command**
- **Path**: `.claude/commands/db-frontend/fix.md`
- **Purpose**: Auto-fix alignment gaps in batches
- **Output**: Fixed code + updated reports

### 3. **Agent Specifications**
- **Path**: `.claude/agents-config.md` (updated)
- **Agents**:
  - `db-frontend-aligner-analyzer` (Agent 12)
  - `db-frontend-aligner-fixer` (Agent 13)

### 4. **Orchestrator Integration**
- **Path**: `.claude/orchestrator-agent.md` (updated)
- **New Commands**:
  - "analyze alignment"
  - "fix alignment"

---

## 🚀 How to Use

### **Step 1: Create the Agents**

You already have the orchestrator created. Now create the two new alignment agents:

```bash
/agents
# Select "Create new agent"
# Select "Generate with Claude (recommended)"
# Copy Agent 12 spec from .claude/agents-config.md
# Repeat for Agent 13
```

### **Step 2: Run Analysis**

**Option A: Via Orchestrator (Recommended)**
```bash
@orchestrator analyze alignment
```

**Option B: Directly**
```bash
@db-frontend-aligner-analyzer
```

**Option C: As Part of Full Analysis**
```bash
@orchestrator analyze all
# This now includes DB-Frontend alignment
```

### **Step 3: Review Results**

Check the generated reports:
- `docs/analyze-fixes/db-frontend-alignment/analysis-report.json`
- `docs/analyze-fixes/db-frontend-alignment/analysis-report.md`

### **Step 4: Fix Issues**

**Option A: Via Orchestrator**
```bash
@orchestrator fix alignment
```

**Option B: Directly**
```bash
@db-frontend-aligner-fixer
```

---

## 📊 What Gets Analyzed

### **1. Database Coverage** (ALIGN-P001, ALIGN-P002)
Every database table/view is checked for:
- ✅ Queries (Can users read data?)
- ✅ Mutations (Can users create/update/delete?)
- ✅ Complete CRUD (All operations present)

**Example Issues Detected:**
- `staff_schedules` table exists but NO query
- `appointments` has create/update but NO delete
- `customer_wallets` query exists but table was removed

### **2. Type Safety** (ALIGN-P003, ALIGN-H103)
Frontend types are verified against database schema:
- ✅ Using generated `Database['public']['Tables']` types
- ✅ Zod schemas match database constraints
- ✅ No manual type definitions that can drift

**Example Issues Detected:**
- Manual `Appointment` interface instead of Database type
- Zod schema has `duration` optional but DB requires it
- Frontend type missing new `priority` column

### **3. UI Completeness** (ALIGN-H101, ALIGN-H102, ALIGN-H104)
User interface coverage for each entity:
- ✅ List components (view multiple records)
- ✅ Detail components (view single record)
- ✅ Form components (create/edit records)
- ✅ All database columns represented
- ✅ Relationships navigable (foreign keys clickable)

**Example Issues Detected:**
- `getServices()` exists but NO ServicesList component
- ServiceForm missing `duration_minutes` field
- Appointment shows `staff_id` but not clickable

### **4. UX Quality** (ALIGN-M303, ALIGN-M304)
User experience elements:
- ✅ Empty states when no data
- ✅ Loading states during fetch
- ✅ Error states on failure
- ✅ Buttons for mutations (if delete exists, show delete button)
- ✅ Filters for lists

**Example Issues Detected:**
- AppointmentsList has no empty state
- Delete mutation exists but no delete button
- CustomersList missing status filter

### **5. Orphaned Code Detection** (ALIGN-M301)
Frontend code for removed database entities:
- ❌ Queries for non-existent tables
- ❌ Mutations for removed tables
- ❌ Entire feature directories without database backing

**Example Issues Detected:**
- `features/customer/wallet/` references removed table
- `getCustomerWallets()` query targets non-existent view
- `LoyaltyTiers` component but table was deleted

---

## 🛠️ What Gets Fixed

### **Fully Automatic Fixes**

These are fixed completely by the agent:

1. **Type Mismatches** (ALIGN-P003)
   ```ts
   // Before
   interface Appointment { ... }

   // After
   import type { Database } from '@/lib/types/database.types'
   type Appointment = Database['public']['Views']['appointments']['Row']
   ```

2. **Schema Mismatches** (ALIGN-H103)
   ```ts
   // Before
   const schema = z.object({
     duration: z.number().optional() // Wrong
   })

   // After
   const schema = z.object({
     duration_minutes: z.number().min(15).max(480) // Matches DB
   })
   ```

3. **Orphaned Code** (ALIGN-M301)
   ```bash
   # Deletes:
   # - features/customer/wallet/
   # - getCustomerWallets() function
   # - WalletBalance component
   ```

### **Scaffold Generation** (Needs Completion)

These generate code scaffolds with TODO comments:

1. **Missing Queries** (ALIGN-P001)
   ```ts
   // Generated scaffold:
   export async function getStaffSchedules(staffId: string) {
     const supabase = await createClient()
     // TODO: Add filters, pagination, business logic
     const { data } = await supabase.from('staff_schedules').select('*')
     return data
   }
   ```

2. **Missing Mutations** (ALIGN-P002)
   ```ts
   // Generated scaffold:
   'use server'
   export async function deleteAppointment(id: string) {
     const supabase = await createClient()
     // TODO: Add business validation, cascade logic
     await supabase.from('appointments').delete().eq('id', id)
     revalidatePath('/appointments')
   }
   ```

3. **Missing UI Components** (ALIGN-H101)
   ```tsx
   // Generated scaffold:
   export function ServicesList({ services }: Props) {
     if (services.length === 0) {
       return <Empty title="No services" />
     }
     return (
       // TODO: Complete styling, add actions
       <div>{services.map(s => <Card key={s.id}>...</Card>)}</div>
     )
   }
   ```

4. **Missing Form Fields** (ALIGN-H102)
   ```tsx
   // Adds missing fields to existing form:
   <Field label="Duration (minutes)" required>
     <Input name="duration_minutes" type="number" />
   </Field>
   ```

---

## 📋 Typical Workflow

### **Scenario 1: New Project / First Time**

```bash
# 1. Run analysis
@orchestrator analyze alignment

# Output shows:
# - 45 database tables
# - 32 with complete frontend (71%)
# - 8 with partial frontend (18%)
# - 5 with no frontend (11%)
# - 3 orphaned features

# 2. Remove orphaned code first (safest)
@db-frontend-aligner-fixer
# Deletes features/customer/wallet/, loyalty-tiers/, tips/

# 3. Fix critical gaps (missing queries/mutations)
@db-frontend-aligner-fixer
# Generates query scaffolds for staff_schedules, commissions, etc.

# 4. Manual completion
# Complete the TODOs in generated scaffolds

# 5. Verify
@db-frontend-aligner-analyzer
# Should show improved coverage
```

### **Scenario 2: After Database Migration**

```bash
# You added new columns to appointments table

# 1. Run alignment analysis
@orchestrator analyze alignment

# Output shows:
# - Type mismatch: Frontend missing new columns
# - Form incomplete: Missing fields for new columns
# - Zod schema outdated

# 2. Auto-fix
@db-frontend-aligner-fixer

# Fixes:
# - Updates types to include new columns
# - Adds fields to AppointmentForm
# - Updates Zod schema

# 3. Done!
# All changes auto-applied
```

### **Scenario 3: Before Release**

```bash
# Full quality check

# 1. Full analysis (all 10 analyzers + alignment)
@orchestrator analyze all

# 2. Fix critical issues across all domains
@orchestrator fix critical

# 3. Fix alignment gaps
@orchestrator fix alignment

# 4. Manual completion of scaffolds

# 5. Final verification
@orchestrator analyze all

# 6. Ship it!
```

---

## 📊 Report Structure

### **JSON Report Fields**

```json
{
  "metadata": {
    "total_database_tables": 45,
    "total_database_views": 12,
    "total_issues": 89
  },
  "summary": {
    "by_priority": {
      "critical": 12,
      "high": 34,
      "medium": 28,
      "low": 15
    },
    "by_gap_type": {
      "missing_query": 5,
      "missing_mutation": 8,
      "missing_ui": 13,
      "type_mismatch": 23,
      "orphaned_code": 3,
      "incomplete_crud": 8,
      "missing_ux": 29
    },
    "coverage": {
      "tables_with_complete_crud": 32,
      "tables_with_partial_crud": 8,
      "tables_with_no_frontend": 5,
      "tables_with_complete_ui": 25,
      "tables_with_partial_ui": 15,
      "tables_with_no_ui": 5,
      "orphaned_features": 3
    }
  },
  "database_inventory": [
    {
      "table_name": "appointments",
      "has_queries": true,
      "has_mutations": {
        "create": true,
        "update": true,
        "delete": false
      },
      "has_ui": {
        "list": true,
        "detail": true,
        "form": true
      },
      "completeness_score": 85,
      "issues_count": 3
    }
  ],
  "issues": [...]
}
```

### **Markdown Report Sections**

1. Summary (totals by priority, gap type, coverage)
2. Critical Issues (missing queries, missing mutations, type drift)
3. Orphaned Code (detailed list of files to remove)
4. Incomplete CRUD (tables with partial operations)
5. Type Mismatches (frontend vs database)
6. UX Quality Issues (missing empty states, etc.)
7. Coverage by Portal (business, customer, staff, admin)
8. Recommended Actions (phased approach)

---

## 🎓 Best Practices

### **When to Run Analysis**

1. **After database migrations** - Ensure frontend is updated
2. **Before releases** - Catch missing features
3. **Weekly quality check** - Monitor alignment drift
4. **After refactoring** - Verify nothing broke
5. **When onboarding new developers** - Document current state

### **Interpreting Results**

- **Critical (P*)**: Must fix immediately - users can't access data
- **High (H*)**: Fix soon - incomplete features, bad UX
- **Medium (M*)**: Fix when convenient - code quality, minor UX
- **Low (L*)**: Nice to have - polish, optimizations

### **Fix Priority**

1. **Orphaned code** - Remove safely first
2. **Type mismatches** - Prevent runtime errors
3. **Missing CRUD** - Users need these operations
4. **Missing UI** - Complete the user experience
5. **UX polish** - Empty states, filters, etc.

---

## 🔗 Integration with Existing Workflow

### **With Other Analyzers**

```bash
# Full audit includes alignment
@orchestrator analyze all

# Aggregated report shows:
# - Database violations (DB domain)
# - Security issues (SEC domain)
# - Architecture issues (ARCH domain)
# - UI violations (UI domain)
# - Alignment gaps (ALIGN domain) ← NEW
# - ... (all 10 domains)
```

### **With Orchestrator Commands**

```bash
@orchestrator triage
# Smart recommendations include alignment gaps:
# "5 orphaned features should be removed first"
# "12 type mismatches are quick wins (auto-fixable)"
# "8 missing mutations need scaffolding"
```

---

## ❓ FAQ

**Q: Will this delete my code?**
A: Only orphaned code (code for removed database tables). It's clearly reported first.

**Q: Are the scaffolds production-ready?**
A: No, they include TODO comments for business logic you need to complete.

**Q: Can I skip the fixer and just use reports?**
A: Yes! The analyzer generates detailed reports. Use the fixer when ready.

**Q: Does this replace manual QA?**
A: No, it augments QA by catching systematic gaps automatically.

**Q: How often should I run this?**
A: After database migrations, before releases, and weekly for monitoring.

**Q: Can I customize the rules?**
A: The rules reference docs/rules/ - you can modify those files.

---

## 📚 Related Documentation

- **Core Rules**: `docs/rules/core/database.md`, `ui.md`, `architecture.md`
- **Framework Rules**: `docs/rules/framework/typescript.md`
- **Quality Rules**: `docs/rules/quality/accessibility.md`
- **Task Guide**: `docs/rules/02-task-based-guide.md`

---

**Version**: 1.0.0
**Last Updated**: 2025-10-18
**Agents**: db-frontend-aligner-analyzer, db-frontend-aligner-fixer
