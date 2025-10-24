# Fix Database Issues - Batch Mode

## Instructions for Claude:

Fix ALL unchecked tasks in a SINGLE CATEGORY from the database progress tracker.

### WORKFLOW:

1. **SELECT CATEGORY**
   - Read `docs/database-analysis/DATABASE_PROGRESS_TRACKER.md`
   - Find the first section that has unchecked `[ ]` tasks
   - Announce: "Working on category: [Category Name] - X tasks to complete"

2. **BATCH PROCESS**
   - For each unchecked task in that category:
     - Read the referenced report for SQL templates
     - Connect to Supabase project: `nwmcpfioxerzodvbjigw`
     - Apply fix using `mcp__supabase__apply_migration`
     - Verify fix with `mcp__supabase__execute_sql`
     - Update tracker: change `[ ]` to `[x]`
     - Report: "✅ Task X/Y: [task name] - COMPLETE"

3. **CATEGORY SUMMARY**
   After completing all tasks in the category:
   ```
   ====================================
   CATEGORY COMPLETE: [Category Name]
   ====================================
   Tasks Completed: X
   Migrations Applied: X
   Time Taken: ~X minutes

   Summary of Changes:
   - [List key changes]

   Next Category: [Name] (X tasks remaining)
   ====================================
   ```

4. **UPDATE PROGRESS**
   - Calculate new completion percentages
   - Update the Progress Summary section
   - Save the updated tracker file

5. **STOP**
   - Ask: "Category [name] is complete. Should I proceed with the next category?"

### RULES:
- Complete ALL tasks in a category before moving to next
- If any task fails, mark it with `[!]` and continue with others
- Create a single migration per logical group when possible
- Always verify each fix works before proceeding

### Start batch processing now.