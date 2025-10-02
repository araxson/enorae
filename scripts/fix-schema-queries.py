#!/usr/bin/env python3
"""
Fix all .schema() queries in dal/*.queries.ts files
Changes SELECT queries to use public views instead of schema.table
IMPORTANT: Does NOT modify actions files (mutations need schema.table)
"""

import re
import os
from pathlib import Path

def fix_query_file(filepath: Path) -> tuple[bool, str]:
    """
    Fix a single query file
    Returns: (changed, message)
    """
    try:
        content = filepath.read_text()
        original = content

        # Fix Type definitions - change Tables to Views
        # Pattern: Database['<schema>']['Tables']['<table>'] → Database['public']['Views']['<table>']
        content = re.sub(
            r"Database\['[^']+'\]\['Tables'\]\['([^']+)'\]",
            r"Database['public']['Views']['\1']",
            content
        )

        # Fix .schema().from() patterns (including multiline)
        # Pattern: .schema('organization').from('staff_profiles') → .from('staff')
        content = re.sub(
            r"\.schema\('organization'\)\s*\.from\('staff_profiles'\)",
            ".from('staff')",
            content
        )

        # Pattern: .schema('<schema>').from('<table>') → .from('<table>')
        content = re.sub(
            r"\.schema\('[^']+'\)\s*\.from\('([^']+)'\)",
            r".from('\1')",
            content
        )

        # Remove comments about keeping .schema() calls
        content = re.sub(
            r"// Keeping \.schema\(\) calls until public views are created[^\n]*\n?",
            "",
            content
        )

        if content != original:
            # Save backup
            backup_path = filepath.with_suffix('.ts.bak')
            backup_path.write_text(original)

            # Write updated content
            filepath.write_text(content)
            return True, f"✅ Updated (backup: {backup_path.name})"
        else:
            return False, "⏭️  No changes needed"

    except Exception as e:
        return False, f"❌ Error: {e}"

def main():
    print("🔧 Fixing schema queries in dal/*.queries.ts files...")
    print("=" * 60)

    # Find all *.queries.ts files in features directory
    features_dir = Path("features")
    query_files = list(features_dir.rglob("*.queries.ts"))

    print(f"Found {len(query_files)} query files to process\n")

    updated_count = 0
    skipped_count = 0
    error_count = 0

    for filepath in sorted(query_files):
        changed, message = fix_query_file(filepath)
        rel_path = filepath.relative_to(features_dir)
        print(f"{rel_path}: {message}")

        if changed:
            updated_count += 1
        elif "Error" in message:
            error_count += 1
        else:
            skipped_count += 1

    print("\n" + "=" * 60)
    print(f"✅ Updated: {updated_count} files")
    print(f"⏭️  Skipped: {skipped_count} files")
    if error_count > 0:
        print(f"❌ Errors: {error_count} files")

    print("\nNext steps:")
    print("  1. Review changes: git diff features")
    print("  2. Run type check: pnpm typecheck")
    print("  3. Remove backups: find features -name '*.bak' -delete")

if __name__ == "__main__":
    main()
