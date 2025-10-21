#!/usr/bin/env python3
"""
Analyze Database Schema Mismatches

This script:
1. Parses database.types.ts to extract all table/view schemas
2. Searches codebase for database queries and property access
3. Identifies mismatches between code and actual schema
4. Generates comprehensive report
"""

import re
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set, Tuple

PROJECT_ROOT = Path(__file__).parent.parent
TYPES_FILE = PROJECT_ROOT / "lib/types/database.types.ts"

# Track all findings
schema_data = {}
mismatches = []
query_patterns = []

def parse_database_types():
    """Parse database.types.ts to extract schema information"""
    print("🔍 Parsing database.types.ts...")

    content = TYPES_FILE.read_text()

    # Extract public views section
    public_match = re.search(r'public: \{.*?Views: \{(.*?)\n    \}', content, re.DOTALL)
    if not public_match:
        print("❌ Could not find public.Views section")
        return {}

    views_content = public_match.group(1)

    # Parse each view
    view_pattern = r'(\w+): \{\s*Row: \{(.*?)\}'
    views = {}

    for match in re.finditer(view_pattern, views_content, re.DOTALL):
        view_name = match.group(1)
        row_content = match.group(2)

        # Parse columns
        columns = {}
        col_pattern = r'(\w+):\s*([\w\[\]\s|]+?)(?:\n|$)'

        for col_match in re.finditer(col_pattern, row_content):
            col_name = col_match.group(1)
            col_type = col_match.group(2).strip()
            columns[col_name] = col_type

        views[view_name] = columns

    print(f"✅ Parsed {len(views)} public views")
    return views

def find_supabase_queries():
    """Find all Supabase query patterns in the codebase"""
    print("\n🔍 Searching for Supabase queries...")

    patterns = []

    # Search for .from() calls
    feature_files = list(PROJECT_ROOT.glob("features/**/*.ts"))
    feature_files.extend(PROJECT_ROOT.glob("features/**/*.tsx"))

    print(f"   Scanning {len(feature_files)} files...")

    for file_path in feature_files:
        try:
            content = file_path.read_text()

            # Pattern: .from('table_name')
            from_matches = re.finditer(r'\.from\([\'"](\w+)[\'"]\)', content)
            for match in from_matches:
                table_name = match.group(1)
                line_num = content[:match.start()].count('\n') + 1
                patterns.append({
                    'file': str(file_path.relative_to(PROJECT_ROOT)),
                    'line': line_num,
                    'table': table_name,
                    'type': 'from'
                })

            # Pattern: .select('column1, column2, ...')
            select_matches = re.finditer(r'\.select\([\'"]([^\'"]+)[\'"]\)', content)
            for match in select_matches:
                select_str = match.group(1)
                line_num = content[:match.start()].count('\n') + 1
                patterns.append({
                    'file': str(file_path.relative_to(PROJECT_ROOT)),
                    'line': line_num,
                    'select': select_str,
                    'type': 'select'
                })

            # Pattern: .eq('column', value)
            eq_matches = re.finditer(r'\.eq\([\'"](\w+)[\'"]\s*,', content)
            for match in eq_matches:
                column = match.group(1)
                line_num = content[:match.start()].count('\n') + 1
                patterns.append({
                    'file': str(file_path.relative_to(PROJECT_ROOT)),
                    'line': line_num,
                    'column': column,
                    'type': 'eq'
                })

            # Pattern: property access on data (data.property)
            # This is trickier - look for common patterns after .from() calls

        except Exception as e:
            print(f"   ⚠️  Error reading {file_path}: {e}")

    print(f"✅ Found {len(patterns)} query patterns")
    return patterns

def analyze_mismatches(views, queries):
    """Analyze queries against schema to find mismatches"""
    print("\n🔍 Analyzing for mismatches...")

    issues = []

    # Track current context (table being queried)
    file_contexts = {}

    for query in queries:
        file_path = query['file']

        if query['type'] == 'from':
            table = query['table']
            file_contexts[file_path] = table

            # Check if view exists
            if table not in views:
                issues.append({
                    'severity': 'high',
                    'type': 'missing_view',
                    'file': file_path,
                    'line': query['line'],
                    'table': table,
                    'message': f"View '{table}' does not exist in public schema"
                })

        elif query['type'] == 'select':
            # Parse select columns
            select_str = query['select']
            columns = [c.strip().split(':')[0] for c in select_str.split(',')]

            # Try to determine which table this select is for
            current_table = file_contexts.get(file_path)

            if current_table and current_table in views:
                view_columns = views[current_table]

                for col in columns:
                    if col and col != '*' and col not in view_columns:
                        issues.append({
                            'severity': 'high',
                            'type': 'missing_column',
                            'file': file_path,
                            'line': query['line'],
                            'table': current_table,
                            'column': col,
                            'message': f"Column '{col}' does not exist in view '{current_table}'"
                        })

        elif query['type'] == 'eq':
            column = query['column']
            current_table = file_contexts.get(file_path)

            if current_table and current_table in views:
                view_columns = views[current_table]

                if column not in view_columns:
                    issues.append({
                        'severity': 'medium',
                        'type': 'missing_filter_column',
                        'file': file_path,
                        'line': query['line'],
                        'table': current_table,
                        'column': column,
                        'message': f"Filter column '{column}' does not exist in view '{current_table}'"
                    })

    print(f"✅ Found {len(issues)} potential issues")
    return issues

def generate_report(views, queries, issues):
    """Generate comprehensive report"""
    print("\n📊 Generating report...")

    report = []
    report.append("=" * 80)
    report.append("DATABASE SCHEMA ANALYSIS REPORT")
    report.append("=" * 80)
    report.append("")

    # Schema Summary
    report.append("## SCHEMA SUMMARY")
    report.append("")
    report.append(f"Total Public Views: {len(views)}")
    report.append("")

    # List all views with column counts
    report.append("### Public Views:")
    for view_name in sorted(views.keys()):
        columns = views[view_name]
        report.append(f"  - {view_name} ({len(columns)} columns)")
    report.append("")

    # Query Summary
    report.append("## QUERY ANALYSIS")
    report.append("")
    report.append(f"Total Query Patterns Found: {len(queries)}")

    query_types = defaultdict(int)
    for q in queries:
        query_types[q['type']] += 1

    for qtype, count in sorted(query_types.items()):
        report.append(f"  - {qtype}: {count}")
    report.append("")

    # Issues Summary
    report.append("## MISMATCHES FOUND")
    report.append("")
    report.append(f"Total Issues: {len(issues)}")

    if issues:
        # Group by severity
        high_severity = [i for i in issues if i['severity'] == 'high']
        medium_severity = [i for i in issues if i['severity'] == 'medium']

        report.append(f"  - High Severity: {len(high_severity)}")
        report.append(f"  - Medium Severity: {len(medium_severity)}")
        report.append("")

        # Top 10 issues
        report.append("### TOP 10 CRITICAL ISSUES:")
        report.append("")

        for i, issue in enumerate(high_severity[:10], 1):
            report.append(f"{i}. {issue['type'].upper()}")
            report.append(f"   File: {issue['file']}:{issue['line']}")
            report.append(f"   {issue['message']}")
            report.append("")

        # Group by file
        by_file = defaultdict(list)
        for issue in issues:
            by_file[issue['file']].append(issue)

        report.append("### FILES NEEDING FIXES:")
        report.append("")
        for file_path in sorted(by_file.keys(), key=lambda f: len(by_file[f]), reverse=True)[:20]:
            file_issues = by_file[file_path]
            report.append(f"  {file_path}")
            report.append(f"    {len(file_issues)} issues")
            for issue in file_issues[:3]:
                report.append(f"      - Line {issue['line']}: {issue['message']}")
            if len(file_issues) > 3:
                report.append(f"      ... and {len(file_issues) - 3} more")
            report.append("")
    else:
        report.append("✅ No mismatches found!")
        report.append("")

    # Detailed schema for key views
    report.append("## DETAILED VIEW SCHEMAS")
    report.append("")

    key_views = ['appointments', 'profiles', 'salons', 'services', 'staff']

    for view_name in key_views:
        if view_name in views:
            report.append(f"### {view_name}")
            report.append("")
            for col_name, col_type in sorted(views[view_name].items()):
                report.append(f"  - {col_name}: {col_type}")
            report.append("")

    report.append("=" * 80)
    report.append("END OF REPORT")
    report.append("=" * 80)

    return "\n".join(report)

def main():
    """Main execution"""
    print("\n" + "=" * 80)
    print("DATABASE SCHEMA MISMATCH ANALYSIS")
    print("=" * 80)
    print()

    # Parse schema
    views = parse_database_types()

    # Find queries
    queries = find_supabase_queries()

    # Analyze mismatches
    issues = analyze_mismatches(views, queries)

    # Generate report
    report = generate_report(views, queries, issues)

    # Save report
    report_path = PROJECT_ROOT / "SCHEMA_ANALYSIS_REPORT.md"
    report_path.write_text(report)

    print(f"\n✅ Report saved to: {report_path}")
    print()

    # Also print to console
    print(report)

    return 0

if __name__ == "__main__":
    main()
