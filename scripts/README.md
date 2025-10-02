# 📜 SCRIPTS DOCUMENTATION

> **Utility Scripts for Enorae Project**
> **Last Updated**: 2025-10-01

---

## 📋 Overview

This directory contains Python scripts for automating project maintenance tasks, particularly for Claude Code AI integration.

---

## 📜 Scripts

### 1. `generate-project-tree.py` ⭐ **PRIMARY SCRIPT**

**Purpose**: Generates a comprehensive, up-to-date project tree structure.

**Output**: `docs/PROJECT_TREE.md` (~10KB)

**Features**:
- 🌳 Complete directory tree visualization
- 📊 Project statistics (file count, types, size)
- 📁 Key directories documentation
- 🎯 Important files listing
- 📦 Feature modules breakdown
- 🗄️ Database summary
- 📝 Naming conventions reference
- 🚀 Technology stack
- ⚠️ Critical reminders

**Usage**:
```bash
# Manual execution
python3 scripts/generate-project-tree.py

# Or from project root
cd /path/to/enorae
python3 scripts/generate-project-tree.py
```

**Auto-execution**:
- ✅ Runs automatically on every Claude Code session start
- ✅ Triggered by `.claude/hooks/pre-chat.sh`
- ✅ Ensures Claude always has current project structure

**Configuration**:
```python
# Ignored directories
IGNORE_DIRS = {
    "node_modules", ".next", ".git", "dist", "build",
    "coverage", ".turbo", ".vercel", "__pycache__"
}

# Ignored files
IGNORE_FILES = {
    ".DS_Store", ".env.local", "pnpm-lock.yaml"
}

# Tracked extensions
SHOW_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".json", ".md",
    ".sql", ".toml", ".yml", ".yaml", ".sh", ".py", ".css"
}
```

**Output Example**:
```markdown
# 🌳 ENORAE PROJECT TREE

> **Auto-generated on**: 2025-10-01 07:38:40

## 📊 PROJECT STATISTICS

- **Total Files**: 62
- **Total Directories**: 38
- **Total Size**: 825.0KB

### Files by Type
- `.md`: 49 files
- `.json`: 4 files
- `.ts`: 1 files

## 🗂️ PROJECT STRUCTURE

```
enorae/
├── .claude/
│   ├── hooks/
│   │   ├── pre-chat.sh
│   │   └── pre-file-write.sh
├── docs/
│   ├── 02-architecture/
│   ├── 03-database/
│   └── 04-frontend/
...
```
```

**Error Handling**:
- Skips directories without permission
- Handles missing files gracefully
- Continues on errors
- Returns exit code 0 on success, 1 on failure

---

### 2. `generate-types.py`

**Purpose**: Generate TypeScript types from Supabase database schema.

**Output**: `lib/types/database.types.ts`

**Usage**:
```bash
python3 scripts/generate-types.py
```

**Requirements**:
- Supabase CLI installed
- Valid `.env` with Supabase credentials

---

### 3. `backup-project.py`

**Purpose**: Create timestamped backups of the entire project.

**Output**: `backups/enorae-YYYYMMDD-HHMMSS.tar.gz`

**Usage**:
```bash
python3 scripts/backup-project.py
```

**Features**:
- Excludes `node_modules`, `.next`, etc.
- Creates compressed archives
- Timestamped filenames

---

## 🔄 Integration with Claude Code

### How It Works

1. **Session Start** (`.claude/hooks/pre-chat.sh`):
   ```bash
   # Generate fresh project tree
   python3 "$PROJECT_ROOT/scripts/generate-project-tree.py"
   ```

2. **Claude Reads Tree** (`docs/PROJECT_TREE.md`):
   - Current file structure
   - Statistics and breakdown
   - Key directories
   - Naming conventions
   - Critical reminders

3. **Benefits**:
   - ✅ Always up-to-date structure
   - ✅ No manual updates needed
   - ✅ Claude has full context
   - ✅ Prevents outdated references

---

## 📊 PROJECT_TREE.md Structure

### Sections

1. **Header**
   - Auto-generation timestamp
   - Purpose statement
   - File location

2. **Statistics**
   - Total files and directories
   - Total size
   - Files by type (top 15 extensions)

3. **Project Structure**
   - Complete tree visualization
   - Max depth: 8 levels
   - Shows file sizes for .md, .json, .sql

4. **Key Directories**
   - `/apps/web/` - Main application
   - `/docs/` - Documentation
   - `/supabase/` - Database
   - `/scripts/` - Utility scripts
   - `/.claude/` - Claude Code config

5. **Important Files**
   - Root level files
   - Documentation files
   - Application core files

6. **Features List**
   - All 19 feature modules
   - Brief descriptions

7. **Database Summary**
   - 42 tables, 108 functions
   - 10 public views
   - 8 business schemas

8. **Technology Stack**
   - Frontend, backend, deployment

9. **Naming Conventions**
   - Folders, files, patterns
   - Forbidden patterns

10. **Critical Reminders**
    - Database rules
    - DAL rules
    - UI component rules
    - File operation rules

---

## 🎯 Best Practices

### When to Regenerate Manually

Run the script manually when:
- Adding new directories/files
- Restructuring the project
- Before major commits
- When debugging structure issues

**Command**:
```bash
python3 scripts/generate-project-tree.py
```

### DO NOT

- ❌ Edit `docs/PROJECT_TREE.md` manually
- ❌ Commit stale PROJECT_TREE.md
- ❌ Modify the script without testing

### DO

- ✅ Let the script run automatically
- ✅ Review PROJECT_TREE.md after major changes
- ✅ Update ignored directories/files in script config
- ✅ Keep the script simple and fast

---

## 🛠️ Script Development

### Adding New Features

Edit `generate-project-tree.py`:

```python
def generate_markdown_tree() -> str:
    """Generate the complete markdown document"""

    # Add your new section here
    content += """
## 🆕 NEW SECTION

Your content here...
"""

    return content
```

### Testing

```bash
# Run script
python3 scripts/generate-project-tree.py

# Check output
cat docs/PROJECT_TREE.md

# Check file size
ls -lh docs/PROJECT_TREE.md

# Verify in hook
./.claude/hooks/pre-chat.sh
```

### Performance

Current benchmarks:
- Generation time: <1 second
- Output size: ~10KB
- File count: 62 tracked files
- Directory count: 38

---

## 📁 File Locations

```
scripts/
├── generate-project-tree.py    # Main tree generator (THIS SCRIPT)
├── generate-types.py            # Type generation
├── backup-project.py            # Project backup
└── README.md                    # This file

Output:
└── docs/PROJECT_TREE.md         # Generated tree (auto-updated)
```

---

## 🔗 Related Documentation

- **Hook Documentation**: `.claude/hooks/README.md`
- **Pre-Chat Hook**: `.claude/hooks/pre-chat.sh`
- **Project Index**: `docs/index.md`
- **AI Guidelines**: `CLAUDE.md`

---

## 🚀 Quick Start

### For Developers

1. **Manual run**:
   ```bash
   python3 scripts/generate-project-tree.py
   ```

2. **Check output**:
   ```bash
   cat docs/PROJECT_TREE.md
   ```

### For Claude Code

1. Script runs automatically on session start
2. Read `docs/PROJECT_TREE.md` for current structure
3. Use as reference for all file operations

---

## 📊 Statistics

- **Total Scripts**: 3
- **Primary Script**: `generate-project-tree.py`
- **Auto-runs**: Yes (via pre-chat hook)
- **Output Format**: Markdown
- **Update Frequency**: Every Claude Code session

---

**Last Updated**: 2025-10-01
**Maintained By**: Enorae Development Team
**Status**: ✅ Production-Ready
