#!/usr/bin/env python3
"""
Generate Project Tree Script
Generates a comprehensive project tree and saves it to docs/PROJECT_TREE.md
This runs automatically before every Claude Code session via pre-chat hook
"""

import os
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Set

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_FILE = PROJECT_ROOT / "docs" / "PROJECT_TREE.md"

# Directories to ignore
IGNORE_DIRS: Set[str] = {
    "node_modules",
    ".next",
    ".git",
    ".vscode",
    ".idea",
    "dist",
    "build",
    "coverage",
    ".turbo",
    ".vercel",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".DS_Store",
    "supabase/functions/node_modules",
}

# Files to ignore
IGNORE_FILES: Set[str] = {
    ".DS_Store",
    "Thumbs.db",
    ".env.local",
    ".env.production",
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
}

# File extensions to show
SHOW_EXTENSIONS: Set[str] = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".md",
    ".sql",
    ".toml",
    ".yml",
    ".yaml",
    ".sh",
    ".py",
    ".css",
    ".env.example",
}


def should_ignore_dir(dir_name: str, path: Path) -> bool:
    """Check if directory should be ignored"""
    if dir_name in IGNORE_DIRS:
        return True
    if dir_name.startswith(".") and dir_name not in {".claude", ".github"}:
        return True
    return False


def should_ignore_file(file_name: str) -> bool:
    """Check if file should be ignored"""
    if file_name in IGNORE_FILES:
        return True
    if file_name.startswith(".") and file_name != ".env.example":
        return True

    # Check if file has a tracked extension
    has_tracked_ext = any(file_name.endswith(ext) for ext in SHOW_EXTENSIONS)
    if not has_tracked_ext:
        return True

    return False


def get_dir_summary(path: Path) -> dict:
    """Get summary statistics for a directory"""
    stats = {
        "total_files": 0,
        "total_dirs": 0,
        "by_extension": {},
        "total_size": 0,
    }

    try:
        for item in path.rglob("*"):
            # Skip ignored directories
            if any(should_ignore_dir(p.name, p) for p in item.parents):
                continue

            if item.is_file():
                if should_ignore_file(item.name):
                    continue

                stats["total_files"] += 1
                ext = item.suffix or "no extension"
                stats["by_extension"][ext] = stats["by_extension"].get(ext, 0) + 1

                try:
                    stats["total_size"] += item.stat().st_size
                except:
                    pass
            elif item.is_dir():
                if not should_ignore_dir(item.name, item):
                    stats["total_dirs"] += 1
    except Exception as e:
        print(f"Error processing {path}: {e}", file=sys.stderr)

    return stats


def generate_tree(
    directory: Path,
    prefix: str = "",
    is_last: bool = True,
    max_depth: int = 10,
    current_depth: int = 0,
) -> List[str]:
    """Generate tree structure recursively"""
    lines = []

    if current_depth >= max_depth:
        return lines

    try:
        # Get all items in directory
        items = sorted(directory.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))

        # Filter out ignored items
        items = [
            item for item in items
            if not (item.is_dir() and should_ignore_dir(item.name, item))
            and not (item.is_file() and should_ignore_file(item.name))
        ]

        for index, item in enumerate(items):
            is_last_item = index == len(items) - 1

            # Create the branch characters
            if is_last_item:
                branch = "└── "
                extension = "    "
            else:
                branch = "├── "
                extension = "│   "

            # Add the item
            if item.is_dir():
                lines.append(f"{prefix}{branch}{item.name}/")
                # Recursively process subdirectory
                subdir_lines = generate_tree(
                    item,
                    prefix + extension,
                    is_last_item,
                    max_depth,
                    current_depth + 1,
                )
                lines.extend(subdir_lines)
            else:
                # Add file size for certain files
                size_str = ""
                if item.suffix in {".md", ".json", ".sql"}:
                    try:
                        size = item.stat().st_size
                        if size > 1024 * 1024:
                            size_str = f" ({size / (1024 * 1024):.1f}MB)"
                        elif size > 1024:
                            size_str = f" ({size / 1024:.1f}KB)"
                    except:
                        pass

                lines.append(f"{prefix}{branch}{item.name}{size_str}")

    except PermissionError:
        lines.append(f"{prefix}[Permission Denied]")
    except Exception as e:
        lines.append(f"{prefix}[Error: {str(e)}]")

    return lines


def format_size(size_bytes: int) -> str:
    """Format bytes to human readable size"""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f}{unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f}TB"


def generate_markdown_tree() -> str:
    """Generate the complete markdown document"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Generate tree
    tree_lines = generate_tree(PROJECT_ROOT, max_depth=8)

    # Get statistics
    stats = get_dir_summary(PROJECT_ROOT)

    # Build markdown content
    content = f"""# 🌳 ENORAE PROJECT TREE

> **Auto-generated on**: {timestamp}
> **Purpose**: Current project structure for Claude Code AI context
> **Location**: `docs/PROJECT_TREE.md`

---

## 📊 PROJECT STATISTICS

- **Total Files**: {stats['total_files']:,}
- **Total Directories**: {stats['total_dirs']:,}
- **Total Size**: {format_size(stats['total_size'])}

### Files by Type

"""

    # Add file type breakdown
    sorted_exts = sorted(stats["by_extension"].items(), key=lambda x: x[1], reverse=True)
    for ext, count in sorted_exts[:15]:  # Top 15 extensions
        content += f"- `{ext}`: {count:,} files\n"

    content += f"""

---

## 🗂️ PROJECT STRUCTURE

```
enorae/
"""

    # Add tree
    content += "\n".join(tree_lines)

    content += """
```

---

## 📁 KEY DIRECTORIES

### `/apps/web/` - Main Next.js Application
- **Purpose**: Single Next.js 15 app with all features
- **Structure**: App Router with 4 route groups (portals)
- **Features**: 19 feature modules in `/apps/web/features/`

### `/docs/` - Documentation
- **Structure**: Organized in numbered folders (01, 02, 03, 04)
- **Total**: 14 mandatory documentation files (~200KB)
- **Navigation**: Start with `docs/index.md`

### `/supabase/` - Database & Backend
- **Migrations**: Database schema changes
- **Functions**: Edge Functions (serverless)
- **Config**: Supabase project configuration

### `/scripts/` - Utility Scripts
- **generate-project-tree.py**: This script (auto-runs on session start)
- **generate-types.py**: Generate TypeScript types from Supabase
- **backup-project.py**: Project backup utility

### `/.claude/` - Claude Code Configuration
- **hooks/**: Pre-chat, pre-file-write, pre-commit hooks
- **agents/**: Custom Claude Code agents
- **commands/**: Custom slash commands

---

## 🎯 IMPORTANT FILES

### Root Level
- `CLAUDE.md` - **MANDATORY** AI Development Guidelines
- `README.md` - Project overview and setup
- `package.json` - Workspace configuration
- `tsconfig.json` - TypeScript configuration

### Documentation
- `docs/index.md` - Documentation navigation hub
- `docs/02-architecture/overview.md` - Architecture decisions
- `docs/03-database/best-practices.md` - Database patterns
- `docs/04-frontend/component-patterns.md` - Frontend patterns

### Application Core
- `apps/web/app/page.tsx` - Homepage
- `apps/web/lib/supabase/server.ts` - Supabase server client
- `apps/web/middleware.ts` - Auth middleware
- `apps/web/features/*/dal/*.queries.ts` - Data Access Layer

---

## 📦 FEATURES (apps/web/features/)

### Current Features ({stats['by_extension'].get('.tsx', 0)} components)

1. **home** - Homepage with hero and featured salons
2. **salon-discovery** - Browse and search salons
3. **salon-detail** - Individual salon view
4. **booking** - Customer booking flow
5. **auth** - Login, signup, password reset
6. **customer-profile** - Customer dashboard
7. **dashboard** - Business dashboard
8. **appointments-management** - Business appointments
9. **staff-management** - Staff CRUD
10. **services-management** - Services CRUD
11. **analytics** - Business analytics
12. **advanced-analytics** - AI insights
13. **blocked-times** - Staff unavailability
14. **favorites** - Customer favorites
15. **notifications** - Notification system
16. **navigation** - Sidebar components
17. **admin-dashboard** - Platform admin
18. **admin-salons** - Admin salon management
19. **admin-users** - Admin user management

---

## 🗄️ DATABASE

- **Tables**: 42 tables across 8 business schemas
- **Functions**: 108 database functions
- **Views**: 10 public queryable views
- **Schemas**: organization, catalog, scheduling, identity, analytics, communication, engagement, inventory

---

## 🚀 TECHNOLOGY STACK

- **Frontend**: Next.js 15, React 19, TypeScript 5.6
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Deployment**: Vercel (Frontend), Supabase Cloud (Backend)
- **Monorepo**: pnpm workspaces

---

## 📝 NAMING CONVENTIONS

### Folders
- Format: `kebab-case/`
- Examples: `salon-discovery/`, `staff-management/`

### Files
- Components: `kebab-case.tsx` (e.g., `salon-card.tsx`)
- DAL: `[feature].queries.ts` (e.g., `salon.queries.ts`)
- Actions: `[feature].actions.ts` (e.g., `salon.actions.ts`)
- Types: `[feature].types.ts` (e.g., `salon.types.ts`)
- Hooks: `use-[name].ts` (e.g., `use-salon.ts`)

### Never Use
- ❌ Suffixes: `-v2`, `-new`, `-old`, `-fixed`, `-temp`
- ❌ Underscores in folders: `salon_discovery/`
- ❌ PascalCase folders: `SalonDiscovery/`

---

## 🎯 CRITICAL REMINDERS

### Database
- ✅ ALWAYS query from public views (not schema tables)
- ✅ ALWAYS use `Database['public']['Views']` for types
- ❌ NEVER query with `.schema('name').from('table')`
- ❌ NEVER use `Database['public']['Tables']` types

### Data Access Layer (DAL)
- ✅ ALWAYS add `import 'server-only'` at the top
- ✅ ALWAYS check auth: `await supabase.auth.getUser()`
- ✅ ALWAYS add explicit filters: `.eq('user_id', user.id)`

### UI Components
- ✅ ALWAYS use shadcn/ui from `@/components/ui/`
- ❌ NEVER create custom UI primitives
- ✅ Compose shadcn components for features

### File Operations
- ✅ ALWAYS follow naming conventions
- ❌ NEVER create files with forbidden suffixes
- ✅ ALWAYS use kebab-case

---

## 🔗 NAVIGATION

- **Main Documentation**: `docs/index.md`
- **AI Guidelines**: `CLAUDE.md`
- **Project Setup**: `README.md`
- **Hook Documentation**: `.claude/hooks/README.md`
- **This File**: Auto-generated, DO NOT EDIT manually

---

*Generated by*: `scripts/generate-project-tree.py`
*Run command*: `python3 scripts/generate-project-tree.py`
*Auto-runs*: On every Claude Code session start (via `.claude/hooks/pre-chat.sh`)
*Last updated*: {timestamp}
"""

    return content


def main():
    """Main function"""
    try:
        print("🌳 Generating project tree...", file=sys.stderr)

        # Ensure output directory exists
        OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

        # Generate markdown content
        content = generate_markdown_tree()

        # Write to file
        OUTPUT_FILE.write_text(content, encoding="utf-8")

        file_size = OUTPUT_FILE.stat().st_size
        print(f"✅ Project tree generated successfully!", file=sys.stderr)
        print(f"📄 Output: {OUTPUT_FILE}", file=sys.stderr)
        print(f"📊 Size: {format_size(file_size)}", file=sys.stderr)

        return 0

    except Exception as e:
        print(f"❌ Error generating project tree: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
