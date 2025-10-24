# Database Fix Rollback

## Instructions for Claude:

Rollback the last database fix or a specific migration.

### WORKFLOW:

1. **IDENTIFY MIGRATION TO ROLLBACK**

   Ask the user:
   "Which migration should I rollback?
   1. The last applied migration
   2. A specific migration by name
   3. All migrations from today
   4. Show recent migrations list first"

2. **LIST RECENT MIGRATIONS** (if requested)
   ```sql
   -- Use mcp__supabase__list_migrations
   -- Show last 10 migrations with timestamps
   ```

3. **CREATE ROLLBACK MIGRATION**

   Based on the original migration type:

   #### For RLS Policies:
   ```sql
   -- Migration name: rollback_rls_[original_name]_[date]
   DROP POLICY IF EXISTS "[policy_name]" ON [schema].[table];
   ALTER TABLE [schema].[table] DISABLE ROW LEVEL SECURITY;
   ```

   #### For Added Indexes:
   ```sql
   -- Migration name: rollback_index_[original_name]_[date]
   DROP INDEX IF EXISTS [schema].[index_name];
   ```

   #### For Dropped Indexes:
   ```sql
   -- Migration name: restore_index_[original_name]_[date]
   CREATE INDEX [index_name] ON [schema].[table]([columns]);
   -- Note: Get original definition from git history or reports
   ```

   #### For Views:
   ```sql
   -- Migration name: rollback_view_[original_name]_[date]
   DROP VIEW IF EXISTS [view_name];
   -- Or restore previous version from git
   ```

   #### For Column Additions:
   ```sql
   -- Migration name: rollback_columns_[original_name]_[date]
   ALTER TABLE [schema].[table]
   DROP COLUMN IF EXISTS created_by_id,
   DROP COLUMN IF EXISTS updated_by_id;
   ```

4. **APPLY ROLLBACK**
   - Use `mcp__supabase__apply_migration` with rollback SQL
   - Document why rollback was needed

5. **UPDATE TRACKER**
   - Edit `docs/database-analysis/DATABASE_PROGRESS_TRACKER.md`
   - Change affected `[x]` back to `[ ]`
   - Add note: `⚠️ Rolled back on [date] - [reason]`

6. **VERIFY ROLLBACK**
   ```sql
   -- Run appropriate verification queries
   -- Confirm database is in expected state
   ```

7. **REPORT**
   ```
   🔄 ROLLBACK COMPLETE
   ====================
   Migration Rolled Back: [name]
   Reason: [user provided reason]

   Database State:
   - [State verification results]

   Tracker Updated:
   - Task marked as incomplete
   - Added rollback note

   Next Steps:
   - [Recommendations]
   ```

### SAFETY CHECKS:
- Always create a backup annotation before rollback
- Verify no dependent objects will break
- Check if application code needs updates
- Warn if rollback affects multiple related fixes

### Execute rollback procedure now.