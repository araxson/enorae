# Fix Structure Issues from Analysis Report

Systematically fix structural issues identified in the project structure analysis report.

## Overview

This command reads the structure analysis report (`docs/structure-analysis-report.md` by default) and systematically fixes identified issues based on priority level and user confirmation.

## Usage

```
/fix-structure-issues [options]
```

**Options:**
- No arguments: Interactive mode - prompts for priority level and confirmation
- `--priority <level>`: Fix specific priority level (critical, high, medium, low, all)
- `--auto`: Auto-fix without confirmation (use with caution)
- `--report <path>`: Custom report file path (default: `docs/structure-analysis-report.md`)
- `--dry-run`: Show what would be fixed without making changes

**Examples:**
```bash
/fix-structure-issues                           # Interactive mode
/fix-structure-issues --priority critical       # Fix only critical issues
/fix-structure-issues --priority all --dry-run  # Preview all fixes
```

---

## Phase 1: Read and Parse Report

### Step 1.1: Locate and Read Report

Read the structure analysis report file:

```typescript
const reportPath = options.report || 'docs/structure-analysis-report.md'
```

**Actions:**
1. Check if report file exists
2. Read full report content
3. Parse report structure
4. Extract metadata (date, project info)

**Error Handling:**
- If report not found, list available reports in `docs/`
- If report is empty or malformed, suggest re-running analysis
- If report is outdated (>30 days), warn user and suggest re-analysis

---

### Step 1.2: Extract Issues by Priority

Parse the report and categorize all issues:

**Issue Categories to Extract:**
1. 🔴 **CRITICAL ISSUES** - Must fix immediately
2. 🟠 **HIGH PRIORITY ISSUES** - Should fix this sprint
3. 🟡 **MEDIUM PRIORITY ISSUES** - Can fix next sprint
4. 🟢 **LOW PRIORITY IMPROVEMENTS** - Nice to have

**For Each Issue, Extract:**
- Issue ID/number
- Title/description
- Current state
- Target state
- File paths affected
- Recommended action
- Estimated effort
- Code examples (if provided)

**Output Format:**
```typescript
interface Issue {
  priority: 'critical' | 'high' | 'medium' | 'low'
  id: string
  title: string
  description: string
  currentPath?: string
  targetPath?: string
  action: 'create' | 'move' | 'rename' | 'delete' | 'refactor' | 'update'
  files: string[]
  codeExample?: string
  effort: string // e.g., "1 hour", "3-5 days"
  category?: string // e.g., "Missing API Directory", "Naming Convention"
}
```

---

### Step 1.3: Build Fix Plan

Create an execution plan based on extracted issues:

**Plan Structure:**
```
Fix Plan for [Priority Level]
=============================

Total Issues: N
Estimated Time: X hours/days

Issues to Fix:
1. [Issue Title]
   - Action: [create/move/rename/delete]
   - Paths: [current] → [target]
   - Impact: [High/Medium/Low]
   - Dependencies: [Issue IDs this depends on]

2. [Next Issue]
   ...

Order of Execution:
1. Fix dependencies first
2. Then independent issues
3. Finally, refactoring improvements
```

---

## Phase 2: User Confirmation

### Step 2.1: Present Issues to User

**Interactive Mode:**
```
Found [N] issues in structure analysis report

Priority Levels:
  🔴 Critical: [N] issues
  🟠 High:     [N] issues
  🟡 Medium:   [N] issues
  🟢 Low:      [N] improvements

Which priority level would you like to fix?
1. Critical only (recommended)
2. Critical + High
3. Critical + High + Medium
4. All issues
5. Custom selection
6. Cancel

Selection: _
```

**Non-Interactive Mode (--priority flag):**
- Skip prompt
- Validate priority level
- Proceed with selected priority

---

### Step 2.2: Show Detailed Plan

For each issue to be fixed, show:

```
Issue [N]: [Title]
------------------
Priority: [🔴/🟠/🟡/🟢]
Category: [Category Name]

Current State:
  [Description of current state]
  Files: [list of affected files]

Proposed Fix:
  [Description of fix]
  Actions:
    1. [Action 1]
    2. [Action 2]
    3. [Action 3]

Impact:
  - Files to create: N
  - Files to move: N
  - Files to update: N
  - Files to delete: N

Estimated Time: [time]
Risk Level: [Low/Medium/High]

Dependencies: [None or list of issue IDs]

---
```

**Confirmation Prompt:**
```
Review the fix plan above.

Options:
  1. Proceed with all fixes
  2. Select specific issues to fix
  3. Skip issues (specify which)
  4. Cancel

Your choice: _
```

---

## Phase 3: Execute Fixes

### Step 3.1: Pre-Fix Validation

Before making any changes:

**Run Checks:**
1. ✓ Git status clean (warn if uncommitted changes)
2. ✓ No conflicting files in target paths
3. ✓ All source files exist
4. ✓ TypeScript compiles (`npm run typecheck`)
5. ✓ Create backup of affected files (optional)

**Output:**
```
Pre-Fix Validation
==================
✓ Git status: Clean
✓ TypeScript: Passing
✓ Target paths: Available
✓ Source files: All found

Ready to proceed? [Y/n]: _
```

---

### Step 3.2: Fix Issues Systematically

For each issue, execute in order of dependencies:

#### Fix Type 1: Create Missing Files/Directories

**Pattern:**
```typescript
// Issue: Missing API directory
// Action: Create directory and boilerplate files

Steps:
1. Create directory structure
2. Generate boilerplate from templates
3. Update related imports (if needed)
4. Verify TypeScript compilation
```

**Example Execution:**
```
[1/N] Creating missing API directory...
  ✓ Created: features/business/customer-analytics/api/
  ✓ Created: features/business/customer-analytics/api/queries.ts
  ✓ Created: features/business/customer-analytics/api/mutations.ts
  ✓ TypeScript: OK
  ✓ Feature structure: Compliant
```

**Boilerplate Templates:**

Use project conventions for generating files:

```typescript
// queries.ts template
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'

// Add query functions here
```

```typescript
// mutations.ts template
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'

// Add mutation functions here
```

---

#### Fix Type 2: Move/Rename Files

**Pattern:**
```typescript
// Issue: Feature in wrong directory
// Action: Move to correct location

Steps:
1. Verify source exists
2. Create target directory structure
3. Copy files to new location
4. Update all imports across codebase
5. Verify TypeScript compilation
6. Delete old files
```

**Example Execution:**
```
[2/N] Moving feature to nested structure...
  ✓ Created: features/business/settings/account/
  ✓ Copied: features/business/settings-account/* → features/business/settings/account/
  ✓ Updated imports: 15 files
  ✓ TypeScript: OK
  ✓ Deleted: features/business/settings-account/
```

**Import Update Strategy:**

1. Find all files importing from old path:
   ```bash
   grep -r "from '@/features/business/settings-account" --include="*.tsx" --include="*.ts"
   ```

2. Update each import:
   ```typescript
   // Before
   import { AccountSettings } from '@/features/business/settings-account'

   // After
   import { AccountSettings } from '@/features/business/settings/account'
   ```

3. Update menu configurations:
   ```typescript
   // lib/menu/business-menus.ts
   // Update route paths and import paths
   ```

4. Update app routes if needed:
   ```typescript
   // app/(business)/business/settings/account/page.tsx
   // Update feature import
   ```

---

#### Fix Type 3: Refactor Large Files

**Pattern:**
```typescript
// Issue: File exceeds line limit
// Action: Split into smaller, focused files

Steps:
1. Analyze file structure
2. Identify logical groupings
3. Create subdirectory
4. Extract functions to separate files
5. Update main file to re-export
6. Verify TypeScript compilation
```

**Example Execution:**
```
[3/N] Splitting large queries file...
  ✓ Analyzed: features/business/insights/api/queries.ts (427 lines)
  ✓ Identified: 5 logical groups
  ✓ Created: features/business/insights/api/queries/ directory
  ✓ Extracted: customer-insights.ts (85 lines)
  ✓ Extracted: churn-prediction.ts (92 lines)
  ✓ Extracted: business-metrics.ts (78 lines)
  ✓ Extracted: cohort-analysis.ts (95 lines)
  ✓ Extracted: helpers.ts (45 lines)
  ✓ Updated: queries.ts (32 lines, re-exports)
  ✓ TypeScript: OK
```

**Splitting Strategy:**

1. **Analyze imports and dependencies:**
   ```typescript
   // Group related functions together
   // Identify shared utilities
   ```

2. **Create subdirectory structure:**
   ```
   api/
   ├── queries.ts (main export file)
   └── queries/
       ├── customer-insights.ts
       ├── churn-prediction.ts
       ├── business-metrics.ts
       ├── cohort-analysis.ts
       └── helpers.ts
   ```

3. **Extract functions:**
   ```typescript
   // queries/customer-insights.ts
   import 'server-only'
   import { createClient } from '@/lib/supabase/server'
   import { verifySession } from '@/lib/auth/session'

   export async function getCustomerInsights() {
     // ... extracted code
   }
   ```

4. **Update main file:**
   ```typescript
   // queries.ts
   import 'server-only'

   // Re-export everything
   export * from './queries/customer-insights'
   export * from './queries/churn-prediction'
   export * from './queries/business-metrics'
   export * from './queries/cohort-analysis'
   export * from './queries/helpers'
   ```

---

#### Fix Type 4: Delete Unused Files

**Pattern:**
```typescript
// Issue: Orphaned or deprecated file
// Action: Safe deletion with verification

Steps:
1. Verify file is truly unused (no imports)
2. Check git history for context
3. Create backup (optional)
4. Delete file
5. Verify TypeScript compilation
```

**Example Execution:**
```
[4/N] Removing unused feature...
  ✓ Verified: No imports found for features/business/customer-analytics/
  ✓ Checked: Git history shows incomplete implementation
  ✓ Backup: Created at .backups/2025-10-11/customer-analytics.tar.gz
  ✓ Deleted: features/business/customer-analytics/
  ✓ TypeScript: OK
```

---

#### Fix Type 5: Update/Refactor Code

**Pattern:**
```typescript
// Issue: Code doesn't follow pattern
// Action: Update to match conventions

Steps:
1. Read current code
2. Apply pattern/convention
3. Update code in place
4. Verify TypeScript compilation
5. Run relevant tests (if available)
```

**Example Execution:**
```
[5/N] Adding missing directive...
  ✓ Read: features/shared/appointments/api/queries.ts
  ✓ Added: 'server-only' directive at line 1
  ✓ TypeScript: OK
  ✓ Pattern: Compliant
```

---

### Step 3.3: Post-Fix Validation

After each fix, run validation:

**Validation Checklist:**
```
After Fix Validation
====================
✓ TypeScript compilation
✓ No broken imports
✓ File structure compliant
✓ Git status check
✓ Pattern compliance
```

**If validation fails:**
```
❌ Validation Failed: [Error message]

Options:
  1. Rollback this fix
  2. Attempt auto-correction
  3. Skip and continue
  4. Abort all fixes

Your choice: _
```

---

### Step 3.4: Track Progress

Maintain a progress log:

**Progress Format:**
```
Fix Progress: [N/Total] Issues Fixed
====================================

✓ Completed:
  1. [Issue Title] - [Time taken]
  2. [Issue Title] - [Time taken]
  ...

⏳ In Progress:
  N. [Issue Title] - [Current step]

⏸ Skipped:
  - [Issue Title] - [Reason]

❌ Failed:
  - [Issue Title] - [Error]
```

---

## Phase 4: Final Verification

### Step 4.1: Run Complete Test Suite

After all fixes are applied:

**Verification Steps:**
```
Final Verification
==================

1. TypeScript Compilation
   $ npm run typecheck
   Status: [PASS/FAIL]

2. Build Test
   $ npm run build
   Status: [PASS/FAIL]

3. File Structure Scan
   - Feature structure compliance: [%]
   - Naming conventions: [PASS/FAIL]
   - Required directives: [PASS/FAIL]

4. Git Status
   Files changed: N
   Files added: N
   Files deleted: N
```

---

### Step 4.2: Generate Fix Report

Create a detailed report of what was fixed:

**Report Location:** `docs/fix-reports/fix-[date]-[priority].md`

**Report Contents:**
```markdown
# Structure Fixes Report

**Date**: [YYYY-MM-DD HH:mm:ss]
**Priority Level**: [critical/high/medium/low/all]
**Original Report**: [path to analysis report]
**Issues Fixed**: [N/Total]

---

## Summary

- ✓ Completed: N issues
- ⏸ Skipped: N issues
- ❌ Failed: N issues
- ⏱ Total Time: X minutes

---

## Issues Fixed

### Issue 1: [Title]

**Priority**: [🔴/🟠/🟡/🟢]
**Status**: ✓ Fixed
**Time**: [minutes]

**Changes Made:**
- Created: [file paths]
- Modified: [file paths]
- Deleted: [file paths]
- Imports updated: N files

**Before:**
```
[description or code]
```

**After:**
```
[description or code]
```

**Verification:**
- [x] TypeScript compiles
- [x] Imports updated
- [x] Pattern compliant

---

### Issue 2: [Title]
...

---

## Skipped Issues

### Issue N: [Title]
**Reason**: [Why it was skipped]

---

## Failed Issues

### Issue N: [Title]
**Error**: [Error message]
**Attempted Fix**: [What was tried]
**Recommendation**: [Manual intervention needed]

---

## Next Steps

1. [ ] Review all changes
2. [ ] Run manual tests for affected features
3. [ ] Commit changes with descriptive message
4. [ ] Update main analysis report
5. [ ] [Additional recommendations]

---

## File Changes Summary

**Files Created**: N
[List of files]

**Files Modified**: N
[List of files]

**Files Deleted**: N
[List of files]

**Imports Updated**: N files
[List of files]

---

## Git Commit Suggestion

```bash
git add .
git commit -m "fix(structure): [priority] - fix [N] structural issues

- [Brief description of main changes]
- [Any important notes]

Fixes identified in docs/structure-analysis-report.md
Full report: docs/fix-reports/fix-[date]-[priority].md"
```
```

---

### Step 4.3: Update Original Report

Mark fixed issues in the original analysis report:

**Update Pattern:**
```markdown
## 🔴 CRITICAL ISSUES

### 1. Missing API Directory ~~❌~~ ✅ FIXED [2025-10-11]

~~**Feature**: `features/business/customer-analytics/`~~

**Status**: Fixed by /fix-structure-issues
**Fix Report**: docs/fix-reports/fix-2025-10-11-critical.md

---
```

---

## Phase 5: Cleanup and Documentation

### Step 5.1: Clean Up Temporary Files

Remove any temporary files created during the fix process:

```
Cleanup
=======
✓ Removed temporary backup files
✓ Removed temporary analysis files
✓ Updated .gitignore (if needed)
```

---

### Step 5.2: Update Documentation

Update relevant documentation:

**Files to Update:**
1. `README.md` - If structure changed significantly
2. `CLAUDE.md` - If patterns were updated
3. `.claude/commands/README.md` - Document this command usage
4. Feature-specific README files - If features were moved/reorganized

---

### Step 5.3: Final Output

Present summary to user:

```
✅ Structure Fixes Complete!
============================

Issues Fixed: [N/Total]
Time Taken: [X minutes]
Files Changed: [N files]

Summary:
  ✓ Created: [N files]
  ✓ Modified: [N files]
  ✓ Deleted: [N files]
  ✓ Moved: [N files]

Verification:
  ✓ TypeScript: PASS
  ✓ Build: PASS (if run)
  ✓ File Structure: [%] compliant

Reports Generated:
  - Fix Report: docs/fix-reports/fix-[date]-[priority].md
  - Updated: docs/structure-analysis-report.md

Next Steps:
  1. Review changes: git diff
  2. Test affected features manually
  3. Commit changes: [suggested commit message]
  4. Re-run analysis to verify: /analyze-structure

Would you like to:
  1. Review the fix report
  2. Commit changes now
  3. Continue with next priority level
  4. Exit

Your choice: _
```

---

## Error Handling

### Common Errors and Recovery

#### Error 1: TypeScript Compilation Failure

**Symptom**: `npm run typecheck` fails after fix

**Recovery Steps:**
1. Show TypeScript errors
2. Analyze which fix caused the failure
3. Options:
   - Attempt auto-correction (fix imports)
   - Rollback last fix
   - Skip to next fix
   - Abort all fixes

**Example:**
```
❌ TypeScript Error After Fix #3

Error: Cannot find module '@/features/business/settings-account'
File: app/(business)/business/settings/account/page.tsx:3

Cause: Import not updated during file move

Recovery Options:
  1. Auto-fix import (recommended)
  2. Rollback fix #3
  3. Manual intervention required

Choice: _
```

---

#### Error 2: File Already Exists

**Symptom**: Cannot create file, path already exists

**Recovery Steps:**
1. Check if existing file is related
2. Options:
   - Merge with existing file
   - Rename and create new file
   - Skip this fix
   - Abort

**Example:**
```
⚠️  File Exists: features/business/settings/account/index.tsx

This file already exists. It may be:
  - A previous incomplete fix
  - A manually created file
  - A conflicting feature

Options:
  1. View existing file
  2. Backup and overwrite
  3. Merge content
  4. Skip this fix

Choice: _
```

---

#### Error 3: Git Conflicts

**Symptom**: Uncommitted changes or merge conflicts

**Recovery Steps:**
1. Show git status
2. Recommend action
3. Wait for user resolution

**Example:**
```
⚠️  Git Conflict Detected

You have uncommitted changes:
  M features/business/settings/api/queries.ts
  M app/(business)/business/settings/page.tsx

Recommendation:
  1. Commit or stash current changes first
  2. Re-run /fix-structure-issues after

Or:
  3. Continue anyway (may cause conflicts)
  4. Abort

Choice: _
```

---

## Configuration

### Custom Configuration File

Support for `.claude/fix-structure.config.json`:

```json
{
  "reportPath": "docs/structure-analysis-report.md",
  "backupBeforeFix": true,
  "backupPath": ".backups",
  "autoCommit": false,
  "commitMessageTemplate": "fix(structure): {priority} - fix {count} issues",
  "verifyAfterEachFix": true,
  "runBuildAfterFixes": false,
  "skipPatterns": [
    "**/*.test.ts",
    "**/__tests__/**"
  ],
  "priorityOrder": ["critical", "high", "medium", "low"],
  "templates": {
    "queriesFile": ".claude/templates/queries.ts.template",
    "mutationsFile": ".claude/templates/mutations.ts.template",
    "indexFile": ".claude/templates/index.tsx.template"
  }
}
```

---

## Advanced Features

### Feature 1: Dry Run Mode

Show what would be done without making changes:

```
$ /fix-structure-issues --dry-run --priority all

DRY RUN MODE - No changes will be made
======================================

Issues to Fix: 12

[1/12] Create missing API directory
  Would create: features/business/customer-analytics/api/
  Would create: features/business/customer-analytics/api/queries.ts
  Would create: features/business/customer-analytics/api/mutations.ts

[2/12] Move feature to nested structure
  Would move: features/business/settings-account/ → features/business/settings/account/
  Would update: 15 files with import changes

[3/12] Split large file
  Would create: features/business/insights/api/queries/ directory
  Would extract: 5 files from queries.ts (427 lines → ~85 lines each)

...

Total Changes:
  - Create: 23 files
  - Move: 6 directories
  - Update: 45 files
  - Delete: 6 directories

Estimated Time: 2.5 hours

No changes made (dry run mode).
```

---

### Feature 2: Selective Fixing

Allow user to select specific issues:

```
$ /fix-structure-issues --priority high

Found 5 high priority issues:

  1. ✓ Missing API directory - features/business/customer-analytics/
  2. ✓ Missing queries.ts - features/shared/appointments/
  3. ✓ Large file - business/insights/api/queries.ts (427 lines)
  4. ✓ Large file - staff/commission/api/queries.ts (408 lines)
  5. ✓ Large file - business/inventory/api/batch-mutations.ts (397 lines)

Select issues to fix (comma-separated, e.g., "1,2,5" or "all"):
Selection: 1,2

Fixing 2 selected issues...
```

---

### Feature 3: Rollback Support

Rollback last fix session:

```
$ /fix-structure-issues --rollback

Available fix sessions:
  1. 2025-10-11 14:30 - Critical issues (5 fixed)
  2. 2025-10-11 15:45 - High priority (3 fixed)
  3. 2025-10-10 09:15 - Medium priority (8 fixed)

Select session to rollback [1-3]: 2

Rolling back session from 2025-10-11 15:45...
  ✓ Restored: features/shared/appointments/api/queries.ts
  ✓ Reverted: 15 import updates
  ✓ Restored: Original file structure

Rollback complete!
```

---

### Feature 4: Batch Mode

Fix multiple priority levels in sequence:

```
$ /fix-structure-issues --priority all --batch

Batch Fix Mode
==============

Will fix in order:
  1. Critical issues (1 issue)
  2. High priority (1 issue)
  3. Medium priority (2 issues)
  4. Low priority (8 issues)

Continue? [Y/n]: Y

[Phase 1: Critical Issues]
Fixing 1 issue...
✓ Complete (2 minutes)

[Phase 2: High Priority]
Fixing 1 issue...
✓ Complete (3 minutes)

[Phase 3: Medium Priority]
Fixing 2 issues...
✓ Complete (15 minutes)

[Phase 4: Low Priority]
Fixing 8 issues...
✓ Complete (45 minutes)

All priorities fixed!
Total time: 65 minutes
```

---

## Integration with Other Commands

### Before Fixing

```bash
# Generate fresh analysis report
/analyze-structure

# Then fix issues
/fix-structure-issues --priority critical
```

### After Fixing

```bash
# Verify fixes
/analyze-structure

# Compare reports
diff docs/structure-analysis-report.md docs/structure-analysis-report-previous.md
```

### Continuous Improvement

```bash
# Weekly: Fix critical + high
/fix-structure-issues --priority high --auto

# Monthly: Fix all
/fix-structure-issues --priority all

# Before major releases: Full analysis and fix
/analyze-structure && /fix-structure-issues --priority all
```

---

## Output Examples

### Success Output

```
✅ Successfully Fixed 5 Issues
==============================

Critical Issues: 1 fixed
High Priority: 1 fixed
Medium Priority: 0 skipped
Low Priority: 3 fixed

Time: 23 minutes
Files: 47 changed (15 created, 28 modified, 4 deleted)

✓ TypeScript: PASS
✓ Build: PASS (optional)
✓ Structure: 100% compliant

Reports:
  📄 Fix report: docs/fix-reports/fix-2025-10-11-1430.md
  📄 Updated: docs/structure-analysis-report.md

Git Status:
  47 files changed
  Ready to commit

Suggested commit:
  git commit -m "fix(structure): critical+high - fix 5 structural issues"
```

### Partial Success Output

```
⚠️  Partially Completed
====================

✓ Completed: 3 issues
⏸ Skipped: 1 issue
❌ Failed: 1 issue

Details:
  ✓ Issue #1: Created missing API directory (3 min)
  ✓ Issue #2: Added queries.ts file (2 min)
  ✓ Issue #3: Updated imports (5 min)
  ⏸ Issue #4: Large file refactor (user skipped)
  ❌ Issue #5: File move failed (see below)

Failed Issue #5: Move settings-account
  Error: Import update failed in 3 files
  Manual intervention needed:
    - app/(business)/business/settings/account/page.tsx:3
    - lib/menu/business-menus.ts:45
    - features/business/dashboard/components/quick-links.tsx:12

Recommendation:
  1. Fix imports manually
  2. Run: /fix-structure-issues --retry-failed
  3. Or skip: /fix-structure-issues --mark-resolved 5
```

---

## Best Practices

### When to Use This Command

✅ **Good Use Cases:**
- After running `/analyze-structure`
- Before major releases
- During refactoring sprints
- When onboarding to fix tech debt
- After adding multiple new features

❌ **Avoid Using:**
- On production branches without review
- When you have uncommitted changes
- If TypeScript isn't compiling already
- Without reading the analysis report first

### Recommendations

1. **Always review the analysis report first**
   - Understand what will be changed
   - Verify recommendations make sense
   - Check for project-specific concerns

2. **Start with higher priorities**
   - Fix critical issues first
   - Validate before moving to next priority
   - Use `--dry-run` to preview changes

3. **Test after fixes**
   - Run `npm run typecheck`
   - Test affected features manually
   - Run automated tests if available

4. **Commit frequently**
   - Commit after each priority level
   - Use descriptive commit messages
   - Easy to rollback if needed

5. **Keep reports**
   - Maintain fix reports in git
   - Track improvements over time
   - Reference in PRs and documentation

---

## Troubleshooting

### Q: Fixes break TypeScript compilation

**A:** Use rollback feature or manually fix TypeScript errors. The command attempts to update imports but may miss some cases.

```bash
/fix-structure-issues --rollback  # Undo last session
```

### Q: Want to undo a specific fix

**A:** Rollback the entire session and selectively re-apply:

```bash
/fix-structure-issues --rollback
/fix-structure-issues --priority critical --select 1,3,5  # Skip issue #2
```

### Q: Large refactors take too long

**A:** Use dry-run mode first, then break into smaller batches:

```bash
/fix-structure-issues --priority high --dry-run  # Preview
/fix-structure-issues --priority high --select 1-5  # First half
/fix-structure-issues --priority high --select 6-10  # Second half
```

### Q: How to customize templates

**A:** Create custom templates in `.claude/templates/` and configure in `.claude/fix-structure.config.json`

---

## Summary

This command provides a systematic, safe, and reversible way to fix structural issues identified in project analysis. It:

- ✅ Reads and parses any structure analysis report
- ✅ Categorizes issues by priority
- ✅ Fixes issues with proper validation
- ✅ Maintains detailed logs and reports
- ✅ Supports rollback and dry-run modes
- ✅ Verifies changes with TypeScript and build
- ✅ Updates documentation automatically

**Usage Pattern:**
```bash
# 1. Analyze structure
/analyze-structure

# 2. Review report
cat docs/structure-analysis-report.md

# 3. Fix issues (interactive)
/fix-structure-issues

# 4. Or fix specific priority
/fix-structure-issues --priority critical

# 5. Verify fixes
/analyze-structure
```
