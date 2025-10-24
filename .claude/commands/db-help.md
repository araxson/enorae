# Database Fix Commands Help

## Available Database Commands

### 📋 Command Overview

| Command | Description | Usage |
|---------|-------------|-------|
| `/db-fix` | Fix one database issue at a time | Fix next unchecked task |
| `/db-fix-batch` | Fix all issues in one category | Complete entire category |
| `/db-fix-rls` | Fix critical RLS issues only | Emergency security fixes |
| `/db-status` | Show current progress report | Check completion status |
| `/db-rollback` | Rollback a database change | Undo problematic fixes |
| `/db-verify` | Verify all completed fixes | Ensure fixes are working |
| `/db-help` | Show this help message | List all commands |

---

### 🔧 Command Details

#### `/db-fix`
**Purpose**: Fix one database issue at a time, methodically
- Reads progress tracker
- Finds next unchecked task
- Applies fix using Supabase MCP
- Updates tracker with `[x]`
- Stops and asks to continue

**Best for**: Careful, controlled fixes with verification

---

#### `/db-fix-batch`
**Purpose**: Fix all tasks in a single category
- Processes entire category at once
- Applies multiple migrations
- Updates all completed tasks
- Provides category summary

**Best for**: Quickly clearing a category of related fixes

---

#### `/db-fix-rls`
**Purpose**: Emergency fix for RLS security issues
- Focuses only on critical RLS problems
- Prioritizes partition table protection
- Fast-tracks security fixes

**Best for**: Urgent security vulnerability patching

---

#### `/db-status`
**Purpose**: Generate progress report
- Shows completion percentages
- Lists recent completions
- Identifies next priorities
- Estimates remaining time

**Best for**: Daily progress reviews, status updates

---

#### `/db-rollback`
**Purpose**: Undo database changes
- Rollback specific migration
- Restore previous state
- Update tracker accordingly

**Best for**: Fixing mistakes, reverting problematic changes

---

#### `/db-verify`
**Purpose**: Verify all completed fixes
- Checks RLS policies are active
- Confirms indexes exist/removed
- Validates view definitions
- Reports any issues found

**Best for**: Quality assurance, post-fix validation

---

### 📊 Current Statistics

To see current database fix progress, use: `/db-status`

### 📁 Related Files

| File | Purpose |
|------|---------|
| `docs/database-analysis/DATABASE_PROGRESS_TRACKER.md` | Main task tracker |
| `docs/database-analysis/DATABASE_FIX_PROMPT.md` | Manual fix prompts |
| `docs/database-analysis/*.md` | Detailed analysis reports |

### 🎯 Quick Start

1. **First time?** Start with `/db-status` to see what needs fixing
2. **Ready to fix?** Use `/db-fix` for controlled fixes
3. **In a hurry?** Use `/db-fix-batch` for category completion
4. **Made a mistake?** Use `/db-rollback` to undo

### ⚠️ Important Notes

- Always work in priority order: Critical → High → Medium → Low
- Read referenced reports before attempting fixes
- Test in staging if available
- Create backups before destructive operations
- Use only Supabase MCP tools for database operations

### 🔒 Security First

**CRITICAL**: Start with RLS fixes! 52 partition tables are unprotected.
Use `/db-fix-rls` to address these immediately.

---

**For detailed analysis reports, see:** `docs/database-analysis/`
**For manual prompts, see:** `docs/database-analysis/DATABASE_FIX_PROMPT.md`