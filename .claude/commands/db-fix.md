# Fix Next Database Issue

## Instructions for Claude:

Please execute the following database fix workflow:

### 1. READ CURRENT STATUS
- Read `docs/database-analysis/DATABASE_PROGRESS_TRACKER.md`
- Identify the FIRST unchecked task `[ ]` starting from the highest priority section
- Announce which specific task/category you're working on

### 2. READ RELEVANT REPORT
- Read the report file referenced for that task section (shown in **📖 Reference:** line)
- Find the specific SQL queries, templates, or implementation details for the fix

### 3. CONNECT TO DATABASE
- Use `mcp__supabase__list_projects` to find the project
- Select project ID: `nwmcpfioxerzodvbjigw` (ENORAE)

### 4. IMPLEMENT THE FIX
Follow this order strictly:

#### For RLS Fixes:
```sql
-- Use mcp__supabase__apply_migration with naming like:
-- "fix_rls_partition_[table_name]_[date]"
ALTER TABLE [schema].[partition_table] ENABLE ROW LEVEL SECURITY;
CREATE POLICY "policy_name" ON [schema].[partition_table]
  FOR ALL
  USING (auth.uid() = user_id OR salon_id IN (
    SELECT salon_id FROM organization.staff WHERE user_id = auth.uid()
  ));
```

#### For Missing Indexes:
```sql
-- Use mcp__supabase__apply_migration with naming like:
-- "add_missing_index_[table]_[column]_[date]"
CREATE INDEX idx_[table]_[column] ON [schema].[table]([column]);
```

#### For Dropping Unused Indexes:
```sql
-- First verify it's truly unused:
-- Use mcp__supabase__execute_sql:
SELECT schemaname, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname = '[index_name]';

-- Then drop if confirmed:
-- Use mcp__supabase__apply_migration:
DROP INDEX IF EXISTS [schema].[index_name];
```

#### For View Fixes:
```sql
-- Use mcp__supabase__apply_migration with naming like:
-- "fix_view_[view_name]_[date]"
CREATE OR REPLACE VIEW [view_name] AS
  [view_definition_from_report];
```

#### For Adding Audit Columns:
```sql
-- Use mcp__supabase__apply_migration with naming like:
-- "add_audit_columns_[table]_[date]"
ALTER TABLE [schema].[table]
ADD COLUMN IF NOT EXISTS created_by_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by_id UUID REFERENCES auth.users(id);
```

### 5. VERIFY THE FIX
Use `mcp__supabase__execute_sql` to verify:

#### For RLS:
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = '[schema]' AND tablename = '[table]';

SELECT * FROM pg_policies
WHERE tablename = '[table]';
```

#### For Indexes:
```sql
SELECT * FROM pg_indexes
WHERE schemaname = '[schema]' AND tablename = '[table]';
```

#### For Views:
```sql
SELECT * FROM information_schema.views
WHERE table_schema = 'public' AND table_name = '[view_name]';
```

### 6. UPDATE PROGRESS TRACKER
- Use Edit tool on `docs/database-analysis/DATABASE_PROGRESS_TRACKER.md`
- Change the completed task from `[ ]` to `[x]`
- Update the progress summary percentages if completing a whole category

### 7. REPORT COMPLETION
Report back with:
- ✅ Task completed: [specific task name]
- 📊 SQL executed: [brief summary]
- 🔍 Verification: [confirmation it worked]
- 📈 Progress: X/106 tasks complete (X%)
- 🔄 Next task: [what would be done next]

### 8. STOP AND ASK
**IMPORTANT**: After completing ONE task, STOP and ask:
"I've completed [task]. Should I continue with the next task in the [category] category, or would you like me to stop here?"

## EXECUTION RULES:

1. **ONE TASK AT A TIME** - Never batch multiple fixes together
2. **VERIFY EVERYTHING** - Always confirm the fix worked before marking complete
3. **USE ONLY SUPABASE MCP** - No bash scripts, no direct SQL files
4. **FOLLOW PRIORITY** - Always work top-down from Critical → High → Medium → Low
5. **READ REPORTS FIRST** - The referenced reports contain the exact SQL you need
6. **DOCUMENT MIGRATIONS** - Use descriptive migration names with dates
7. **STOP ON ERROR** - If a fix fails, stop and report the issue

## CATEGORY PROCESSING ORDER:

1. **Critical - Security**: RLS on partitions (52 tables)
2. **Critical - Views**: Missing salon_chains_view
3. **Critical - Security**: Auth.users exposure (7 views)
4. **High - Schema**: Missing audit columns (47 tables)
5. **High - Performance**: Missing FK indexes
6. **High - Performance**: Drop unused indexes (976 total)
7. **High - Investigation**: Inventory schema
8. **High - Security**: Security definer views
9. **Medium - Maintenance**: Vacuum materialized views
10. **Medium - Views**: Naming conventions
11. **Medium - Performance**: Duplicate indexes
12. **Medium - Quality**: Constraints
13. **Low - All remaining tasks**

## ERROR HANDLING:

If any error occurs:
1. Report the exact error message
2. DO NOT mark the task as complete
3. Suggest a fix or ask for guidance
4. Wait for user input before proceeding

## Start Execution Now

Begin by reading the progress tracker and identifying the next uncompleted task.