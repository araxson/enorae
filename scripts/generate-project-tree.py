#!/usr/bin/env python3
"""
Generate Project Tree Script
Generates a comprehensive project tree and saves it to docs/project-tree.md
This runs automatically before every Claude Code session via pre-chat hook
"""

import os
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Set, Optional, Tuple

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_FILE = PROJECT_ROOT / "docs" / "project-tree.md"
INCONSISTENCIES_FILE = PROJECT_ROOT / "docs" / "project-inconsistencies.md"

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

# File size guardrails (lines per file)
DEFAULT_COMPONENT_LIMIT = 200
DEFAULT_DAL_LIMIT = 200
DEFAULT_HELPER_LIMIT = 150

# Valid portal names
VALID_PORTALS = {"customer", "business", "staff", "admin", "marketing", "shared"}

# Forbidden file suffixes
FORBIDDEN_SUFFIXES = {
    "-v2", "-new", "-old", "-fixed", "-temp", "-enhanced",
    "-backup", "-copy", "-draft", "-wip", "-test",
    "enhanced-", "new-", "temp-", "old-"
}

# Paths to exclude from size checks
EXCLUDED_PATHS = {
    Path("lib/types/database.types.ts"),
}

# Directories to exclude from size checks (relative to project root)
EXCLUDED_DIRS = {
    ("components", "ui"),
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


def determine_line_limit(relative_path: Path) -> Optional[int]:
    """Return maximum allowed lines for a given file, if any"""
    path_str = str(relative_path)
    suffix = relative_path.suffix
    if suffix not in {".ts", ".tsx"}:
        return None

    if relative_path in EXCLUDED_PATHS:
        return None

    for excluded_parts in EXCLUDED_DIRS:
        if relative_path.parts[:len(excluded_parts)] == excluded_parts:
            return None

    # Data access layer (queries/mutations/actions/loaders)
    if path_str.endswith(("queries.ts", "queries.tsx", "mutations.ts", "mutations.tsx", "actions.ts", "actions.tsx", "loader.ts", "loader.tsx")):
        return DEFAULT_DAL_LIMIT

    # Components / hooks / client modules
    if suffix in {".ts", ".tsx"}:
        if any(segment in {"components", "hooks"} for segment in relative_path.parts):
            return DEFAULT_COMPONENT_LIMIT
        if path_str.endswith(("client.tsx", "client.ts")) or relative_path.name.startswith("use-"):
            return DEFAULT_COMPONENT_LIMIT
        if "app" in relative_path.parts and relative_path.name in {"page.tsx", "layout.tsx"}:
            return DEFAULT_COMPONENT_LIMIT

    # Helpers / utils / lib
    if any(segment in {"utils", "lib"} for segment in relative_path.parts):
        return DEFAULT_HELPER_LIMIT

    return None


def count_file_lines(path: Path) -> Optional[int]:
    """Safely count text lines in a file"""
    try:
        with path.open("r", encoding="utf-8", errors="ignore") as f:
            return sum(1 for _ in f)
    except Exception:
        return None


def find_line_violations() -> List[Tuple[int, int, Path]]:
    """Locate files that exceed configured line-count limits"""
    violations: List[Tuple[int, int, Path]] = []

    for item in PROJECT_ROOT.rglob("*"):
        if any(should_ignore_dir(parent.name, parent) for parent in item.parents):
            continue
        if not item.is_file():
            continue
        if should_ignore_file(item.name):
            continue

        rel_path = item.relative_to(PROJECT_ROOT)
        limit = determine_line_limit(rel_path)
        if not limit:
            continue

        line_count = count_file_lines(item)
        if line_count is None:
            continue

        if line_count > limit:
            violations.append((line_count, limit, rel_path))

    violations.sort(key=lambda x: x[0], reverse=True)
    return violations


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


def detect_naming_violations() -> List[Tuple[str, str, Path]]:
    """Detect files with naming convention violations"""
    violations = []

    for item in PROJECT_ROOT.rglob("*"):
        if any(should_ignore_dir(parent.name, parent) for parent in item.parents):
            continue
        if not item.is_file():
            continue
        if should_ignore_file(item.name):
            continue

        rel_path = item.relative_to(PROJECT_ROOT)
        name = item.stem

        # Check for forbidden suffixes
        for suffix in FORBIDDEN_SUFFIXES:
            if suffix in name:
                violations.append(("forbidden_suffix", f"Contains forbidden suffix '{suffix}'", rel_path))
                break

        # Check for snake_case in folders
        for parent in rel_path.parents:
            if "_" in parent.name and parent.name not in IGNORE_DIRS:
                violations.append(("snake_case_folder", f"Folder '{parent.name}' uses snake_case instead of kebab-case", rel_path))
                break

        # Check for PascalCase folders (except components/ui and known patterns)
        for parent in rel_path.parents:
            if parent.name and parent.name[0].isupper() and parent.name not in {"README", "CLAUDE"}:
                if not any(part in {"components", "ui"} for part in rel_path.parts):
                    violations.append(("pascal_case_folder", f"Folder '{parent.name}' uses PascalCase instead of kebab-case", rel_path))
                    break

        # Check for improperly named client files (should be [Feature]-client.tsx)
        if item.name == "client.tsx" or item.name == "client.ts":
            violations.append(("generic_client_name", "Client file should be named '[Feature]-client.tsx'", rel_path))

    violations.sort(key=lambda x: (x[0], str(x[2])))
    return violations


def detect_feature_structure_issues() -> List[Tuple[str, str, Path]]:
    """Detect feature folder structure violations"""
    issues = []
    features_dir = PROJECT_ROOT / "features"

    if not features_dir.exists():
        return issues

    # Check each portal
    for portal_dir in features_dir.iterdir():
        if not portal_dir.is_dir() or should_ignore_dir(portal_dir.name, portal_dir):
            continue

        # Check if portal name is valid
        if portal_dir.name not in VALID_PORTALS:
            issues.append(("invalid_portal", f"'{portal_dir.name}' is not a valid portal name. Valid: {', '.join(sorted(VALID_PORTALS))}", portal_dir.relative_to(PROJECT_ROOT)))

        # Check each feature in portal
        for feature_dir in portal_dir.iterdir():
            if not feature_dir.is_dir() or should_ignore_dir(feature_dir.name, feature_dir):
                continue

            rel_path = feature_dir.relative_to(PROJECT_ROOT)

            # Check for index.tsx
            if not (feature_dir / "index.tsx").exists():
                issues.append(("missing_index", "Feature missing 'index.tsx' entry point", rel_path))

            # Check for api folder
            api_dir = feature_dir / "api"
            if not api_dir.exists():
                issues.append(("missing_api", "Feature missing 'api/' folder", rel_path))
            else:
                # Check for queries.ts or mutations.ts
                has_queries = (api_dir / f"{feature_dir.name}.queries.ts").exists()
                has_mutations = (api_dir / f"{feature_dir.name}.mutations.ts").exists()
                has_any_queries = any(f.name.endswith(".queries.ts") for f in api_dir.iterdir() if f.is_file())
                has_any_mutations = any(f.name.endswith(".mutations.ts") for f in api_dir.iterdir() if f.is_file())

                if not (has_queries or has_any_queries or has_mutations or has_any_mutations):
                    issues.append(("missing_dal", "Feature 'api/' folder missing queries.ts or mutations.ts", rel_path))

            # Check for components folder
            if not (feature_dir / "components").exists():
                issues.append(("missing_components", "Feature missing 'components/' folder", rel_path))

    issues.sort(key=lambda x: (x[0], str(x[2])))
    return issues


def detect_anti_patterns() -> List[Tuple[str, str, Path]]:
    """Detect common anti-patterns"""
    patterns = []

    # Check app directory for thick pages
    app_dir = PROJECT_ROOT / "app"
    if app_dir.exists():
        for page_file in app_dir.rglob("page.tsx"):
            if any(should_ignore_dir(parent.name, parent) for parent in page_file.parents):
                continue

            line_count = count_file_lines(page_file)
            if line_count and line_count > 15:
                rel_path = page_file.relative_to(PROJECT_ROOT)
                patterns.append(("thick_page", f"Page has {line_count} lines (should be 5-15 lines)", rel_path))

    # Check for 'any' type usage in TypeScript files
    for ts_file in PROJECT_ROOT.rglob("*.ts"):
        if any(should_ignore_dir(parent.name, parent) for parent in ts_file.parents):
            continue
        if should_ignore_file(ts_file.name):
            continue

        try:
            content = ts_file.read_text(encoding="utf-8", errors="ignore")
            if ": any" in content or "<any>" in content or "as any" in content:
                rel_path = ts_file.relative_to(PROJECT_ROOT)
                patterns.append(("any_type", "File contains 'any' type usage", rel_path))
        except:
            pass

    # Check for missing 'server-only' in queries.ts files
    for queries_file in PROJECT_ROOT.rglob("*.queries.ts"):
        if any(should_ignore_dir(parent.name, parent) for parent in queries_file.parents):
            continue

        try:
            content = queries_file.read_text(encoding="utf-8", errors="ignore")
            if "import 'server-only'" not in content and 'import "server-only"' not in content:
                rel_path = queries_file.relative_to(PROJECT_ROOT)
                patterns.append(("missing_server_only", "queries.ts file missing 'import server-only' directive", rel_path))
        except:
            pass

    # Check for missing 'use server' in mutations.ts files
    for mutations_file in PROJECT_ROOT.rglob("*.mutations.ts"):
        if any(should_ignore_dir(parent.name, parent) for parent in mutations_file.parents):
            continue

        try:
            content = mutations_file.read_text(encoding="utf-8", errors="ignore")
            if "'use server'" not in content and '"use server"' not in content:
                rel_path = mutations_file.relative_to(PROJECT_ROOT)
                patterns.append(("missing_use_server", "mutations.ts file missing 'use server' directive", rel_path))
        except:
            pass

    patterns.sort(key=lambda x: (x[0], str(x[2])))
    return patterns


def assign_priority(issue_type: str, severity: any = None) -> str:
    """Assign priority based on issue type and severity"""
    # Critical - must fix for security/functionality
    if issue_type in {"missing_server_only", "missing_use_server", "any_type"}:
        return "🔴 CRITICAL"

    # High - important for code quality and maintainability
    if issue_type in {"forbidden_suffix", "generic_client_name", "missing_index", "missing_api", "thick_page"}:
        return "🟠 HIGH"

    # Medium - should fix for consistency
    if issue_type in {"missing_dal", "missing_components", "snake_case_folder", "pascal_case_folder"}:
        return "🟡 MEDIUM"

    # Low - nice to have
    if issue_type == "invalid_portal":
        return "🟢 LOW"

    # File size - priority based on excess
    if isinstance(severity, int):
        if severity > 150:
            return "🔴 CRITICAL"
        elif severity > 100:
            return "🟠 HIGH"
        elif severity > 50:
            return "🟡 MEDIUM"
        else:
            return "🟢 LOW"

    return "🟡 MEDIUM"


def generate_inconsistencies_report() -> str:
    """Generate markdown report of all detected inconsistencies"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Collect all inconsistencies
    naming_violations = detect_naming_violations()
    structure_issues = detect_feature_structure_issues()
    anti_patterns = detect_anti_patterns()
    line_violations = find_line_violations()

    # Count total issues
    total_issues = len(naming_violations) + len(structure_issues) + len(anti_patterns) + len(line_violations)

    # Count by priority
    critical_count = 0
    high_count = 0
    medium_count = 0
    low_count = 0

    for vtype, _, _ in naming_violations:
        priority = assign_priority(vtype)
        if "CRITICAL" in priority: critical_count += 1
        elif "HIGH" in priority: high_count += 1
        elif "MEDIUM" in priority: medium_count += 1
        else: low_count += 1

    for itype, _, _ in structure_issues:
        priority = assign_priority(itype)
        if "CRITICAL" in priority: critical_count += 1
        elif "HIGH" in priority: high_count += 1
        elif "MEDIUM" in priority: medium_count += 1
        else: low_count += 1

    for ptype, _, _ in anti_patterns:
        priority = assign_priority(ptype)
        if "CRITICAL" in priority: critical_count += 1
        elif "HIGH" in priority: high_count += 1
        elif "MEDIUM" in priority: medium_count += 1
        else: low_count += 1

    for lines, limit, _ in line_violations:
        excess = lines - limit
        priority = assign_priority("file_size", excess)
        if "CRITICAL" in priority: critical_count += 1
        elif "HIGH" in priority: high_count += 1
        elif "MEDIUM" in priority: medium_count += 1
        else: low_count += 1

    content = f"""# 🔍 PROJECT INCONSISTENCIES - ACTION ITEMS

> **Auto-generated on**: {timestamp}
> **Purpose**: Actionable tasks to fix project standard violations
> **Based on**: `docs/features-folder-pattern.md` and `CLAUDE.md`

---

## 📊 SUMMARY

- **Total Tasks**: {total_issues}
- **By Priority**:
  - 🔴 **CRITICAL**: {critical_count} (Fix immediately - security/functionality)
  - 🟠 **HIGH**: {high_count} (Fix soon - code quality)
  - 🟡 **MEDIUM**: {medium_count} (Fix when possible - consistency)
  - 🟢 **LOW**: {low_count} (Nice to have - minor improvements)

- **By Category**:
  - Naming Violations: {len(naming_violations)}
  - Feature Structure Issues: {len(structure_issues)}
  - Anti-Patterns: {len(anti_patterns)}
  - File Size Violations: {len(line_violations)}

---

## 🔴 CRITICAL PRIORITY TASKS

### Security & Type Safety Issues

"""

    # Critical tasks
    critical_tasks = []

    # Anti-patterns (critical)
    for ptype, desc, path in anti_patterns:
        priority = assign_priority(ptype)
        if "CRITICAL" in priority:
            critical_tasks.append((ptype, desc, path, priority))

    # File size violations (critical only)
    for lines, limit, path in line_violations:
        excess = lines - limit
        priority = assign_priority("file_size", excess)
        if "CRITICAL" in priority:
            critical_tasks.append(("file_size", f"File has {lines} lines (limit {limit}, excess +{excess})", path, priority))

    if critical_tasks:
        for task_type, desc, path, priority in sorted(critical_tasks, key=lambda x: str(x[2])):
            content += f"- [ ] {priority} | `{path}`\n"
            content += f"      → {desc}\n"
    else:
        content += "✅ No critical issues!\n"

    content += """

---

## 🟠 HIGH PRIORITY TASKS

### Naming & Structure Issues

"""

    # High priority tasks
    high_tasks = []

    for vtype, desc, path in naming_violations:
        priority = assign_priority(vtype)
        if "HIGH" in priority:
            high_tasks.append((vtype, desc, path, priority))

    for itype, desc, path in structure_issues:
        priority = assign_priority(itype)
        if "HIGH" in priority:
            high_tasks.append((itype, desc, path, priority))

    for ptype, desc, path in anti_patterns:
        priority = assign_priority(ptype)
        if "HIGH" in priority:
            high_tasks.append((ptype, desc, path, priority))

    for lines, limit, path in line_violations:
        excess = lines - limit
        priority = assign_priority("file_size", excess)
        if "HIGH" in priority:
            high_tasks.append(("file_size", f"File has {lines} lines (limit {limit}, excess +{excess})", path, priority))

    if high_tasks:
        for task_type, desc, path, priority in sorted(high_tasks, key=lambda x: str(x[2])):
            content += f"- [ ] {priority} | `{path}`\n"
            content += f"      → {desc}\n"
    else:
        content += "✅ No high priority issues!\n"

    content += """

---

## 🟡 MEDIUM PRIORITY TASKS

### Consistency & Convention Issues

"""

    # Medium priority tasks
    medium_tasks = []

    for vtype, desc, path in naming_violations:
        priority = assign_priority(vtype)
        if "MEDIUM" in priority:
            medium_tasks.append((vtype, desc, path, priority))

    for itype, desc, path in structure_issues:
        priority = assign_priority(itype)
        if "MEDIUM" in priority:
            medium_tasks.append((itype, desc, path, priority))

    for ptype, desc, path in anti_patterns:
        priority = assign_priority(ptype)
        if "MEDIUM" in priority:
            medium_tasks.append((ptype, desc, path, priority))

    for lines, limit, path in line_violations:
        excess = lines - limit
        priority = assign_priority("file_size", excess)
        if "MEDIUM" in priority:
            medium_tasks.append(("file_size", f"File has {lines} lines (limit {limit}, excess +{excess})", path, priority))

    if medium_tasks:
        for task_type, desc, path, priority in sorted(medium_tasks, key=lambda x: str(x[2])):
            content += f"- [ ] {priority} | `{path}`\n"
            content += f"      → {desc}\n"
    else:
        content += "✅ No medium priority issues!\n"

    content += """

---

## 🟢 LOW PRIORITY TASKS

### Minor Improvements

"""

    # Low priority tasks
    low_tasks = []

    for vtype, desc, path in naming_violations:
        priority = assign_priority(vtype)
        if "LOW" in priority:
            low_tasks.append((vtype, desc, path, priority))

    for itype, desc, path in structure_issues:
        priority = assign_priority(itype)
        if "LOW" in priority:
            low_tasks.append((itype, desc, path, priority))

    for ptype, desc, path in anti_patterns:
        priority = assign_priority(ptype)
        if "LOW" in priority:
            low_tasks.append((ptype, desc, path, priority))

    for lines, limit, path in line_violations:
        excess = lines - limit
        priority = assign_priority("file_size", excess)
        if "LOW" in priority:
            low_tasks.append(("file_size", f"File has {lines} lines (limit {limit}, excess +{excess})", path, priority))

    if low_tasks:
        for task_type, desc, path, priority in sorted(low_tasks, key=lambda x: str(x[2])):
            content += f"- [ ] {priority} | `{path}`\n"
            content += f"      → {desc}\n"
    else:
        content += "✅ No low priority issues!\n"

    content += f"""

---

## 📋 QUICK FIX GUIDE

### 🔴 Critical Issues - Fix First

#### Missing 'server-only' directive
```typescript
// Add as first line in *.queries.ts files
import 'server-only'
```

#### Missing 'use server' directive
```typescript
// Add as first line in *.mutations.ts files
'use server'
```

#### Replace 'any' types
```typescript
// ❌ Bad
const data: any = await getData()

// ✅ Good
import type {{ Database }} from '@/lib/types/database.types'
type Salon = Database['public']['Views']['salons']['Row']
const data: Salon[] = await getData()
```

### 🟠 High Priority Issues

#### Rename files with forbidden suffixes
```bash
# Remove -v2, -new, -old, -fixed, -temp, -enhanced
mv file-temp.tsx file.tsx
mv component-v2.tsx component.tsx
```

#### Add missing index.tsx
```typescript
// features/[portal]/[feature]/index.tsx
import {{ FeatureComponent }} from './components/feature-component'

export async function Feature() {{
  return <FeatureComponent />
}}
```

#### Add missing api folder
```bash
mkdir -p features/[portal]/[feature]/api
touch features/[portal]/[feature]/api/[feature].queries.ts
touch features/[portal]/[feature]/api/[feature].mutations.ts
```

### 🟡 Medium Priority Issues

#### Fix thick pages (>15 lines)
```typescript
// ❌ Bad - logic in page
export default async function Page() {{
  const data = await fetchData()
  const processed = processData(data)
  // ... 50+ lines
}}

// ✅ Good - delegate to component
export default async function Page() {{
  return <FeatureComponent />
}}
```

#### Add missing components folder
```bash
mkdir -p features/[portal]/[feature]/components
```

#### Split oversized files
```bash
# Break large files into smaller modules
# DAL files: Split by domain
# Components: Extract sub-components
# Utils: Separate into focused helpers
```

---

## 📋 GUIDELINES REFERENCE

### Feature Folder Pattern

```
features/
  [portal]/              # customer, business, staff, admin, marketing, shared
    [feature]/
      index.tsx          # REQUIRED: Main entry point (5-15 lines)
      api/
        [feature].queries.ts    # REQUIRED: SELECT operations
        [feature].mutations.ts  # REQUIRED: INSERT/UPDATE/DELETE operations
      components/        # REQUIRED: UI components
        [Feature]-client.tsx
        [Component].tsx
      hooks/            # OPTIONAL: Custom hooks
        use-[hook].ts
      utils/            # OPTIONAL: Helper functions
        [helper].ts
```

### Naming Conventions

- **Folders**: `kebab-case/` (e.g., `salon-discovery/`)
- **Files**: `kebab-case.tsx` (e.g., `salon-card.tsx`)
- **DAL**: `[feature].queries.ts`, `[feature].mutations.ts`
- **Hooks**: `use-[name].ts` (e.g., `use-salon.ts`)
- **Client Components**: `[Feature]-client.tsx`

### Forbidden Patterns

- ❌ Suffixes: `-v2`, `-new`, `-old`, `-fixed`, `-temp`, `-enhanced`
- ❌ Prefixes: `new-`, `temp-`, `old-`, `enhanced-`
- ❌ Snake_case folders: `salon_discovery/`
- ❌ PascalCase folders: `SalonDiscovery/`
- ❌ Generic client names: `client.tsx` (use `[Feature]-client.tsx`)

### File Size Limits

- **Pages**: 5-15 lines (render feature components only)
- **Components/Hooks**: ≤200 lines
- **DAL (queries/mutations)**: ≤200 lines
- **Helpers/Utils**: ≤150 lines

### Required Directives

- **queries.ts**: Must start with `import 'server-only'`
- **mutations.ts**: Must start with `'use server'`
- **DAL functions**: Must check auth before queries

---

## 🔧 HOW TO FIX

### 1. Fix Naming Violations

```bash
# Rename files with forbidden suffixes
mv file-v2.tsx file.tsx

# Convert snake_case to kebab-case
mv user_profile/ user-profile/

# Rename generic client files
mv client.tsx salon-discovery-client.tsx
```

### 2. Fix Feature Structure

```bash
# Add missing index.tsx
touch features/[portal]/[feature]/index.tsx

# Add missing api folder
mkdir -p features/[portal]/[feature]/api
touch features/[portal]/[feature]/api/[feature].queries.ts

# Add missing components folder
mkdir -p features/[portal]/[feature]/components
```

### 3. Fix Anti-Patterns

```typescript
// Add server-only directive to queries.ts
import 'server-only'  // First line
import {{ createClient }} from '@/lib/supabase/server'

// Add use server directive to mutations.ts
'use server'  // First line
import {{ revalidatePath }} from 'next/cache'

// Fix thick pages (move logic to components)
export default async function Page() {{
  return <FeatureComponent />  // 5-15 lines max
}}

// Replace 'any' types with proper types
import type {{ Database }} from '@/lib/types/database.types'
type Salon = Database['public']['Views']['salons']['Row']
```

### 4. Fix File Size Violations

- Break large components into smaller sub-components
- Extract hooks from components into separate files
- Split large DAL files by domain (e.g., `salon-queries.ts`, `staff-queries.ts`)
- Move utility functions to separate helper files

---

## 📚 DOCUMENTATION

- **Feature Pattern**: `docs/features-folder-pattern.md`
- **AI Guidelines**: `CLAUDE.md`
- **Project Tree**: `docs/project-tree.md`

---

*Generated by*: `scripts/generate-project-tree.py`
*Run command*: `python3 scripts/generate-project-tree.py`
*Last updated*: {timestamp}
"""

    return content


def generate_markdown_tree() -> str:
    """Generate the complete markdown document"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Generate tree
    tree_lines = generate_tree(PROJECT_ROOT, max_depth=8)

    # Get statistics
    stats = get_dir_summary(PROJECT_ROOT)
    violations = find_line_violations()

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

## ⚠️ FILE SIZE VIOLATIONS

"""

    if violations:
        for lines, limit, rel_path in violations:
            content += f"- `{rel_path}` &mdash; {lines} lines (limit {limit})\n"
    else:
        content += "- None detected 🎉\n"

    content += """
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
- `claude.md` - **MANDATORY** AI Development Guidelines
- `readme.md` - Project overview and setup
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
- **AI Guidelines**: `claude.md`
- **Project Setup**: `readme.md`
- **Hook Script**: `.claude/hooks/session-start.sh`
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

        # Generate markdown content for project tree
        tree_content = generate_markdown_tree()

        # Write tree to file
        OUTPUT_FILE.write_text(tree_content, encoding="utf-8")

        file_size = OUTPUT_FILE.stat().st_size
        print(f"✅ Project tree generated successfully!", file=sys.stderr)
        print(f"📄 Output: {OUTPUT_FILE}", file=sys.stderr)
        print(f"📊 Size: {format_size(file_size)}", file=sys.stderr)

        # Generate inconsistencies report
        print("\n🔍 Analyzing project inconsistencies...", file=sys.stderr)
        inconsistencies_content = generate_inconsistencies_report()

        # Write inconsistencies to file
        INCONSISTENCIES_FILE.write_text(inconsistencies_content, encoding="utf-8")

        inconsistencies_size = INCONSISTENCIES_FILE.stat().st_size
        print(f"✅ Inconsistencies report generated successfully!", file=sys.stderr)
        print(f"📄 Output: {INCONSISTENCIES_FILE}", file=sys.stderr)
        print(f"📊 Size: {format_size(inconsistencies_size)}", file=sys.stderr)

        return 0

    except Exception as e:
        print(f"❌ Error generating project tree: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
