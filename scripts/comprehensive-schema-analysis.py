#!/usr/bin/env python3
"""
Comprehensive Database Schema Mismatch Analysis

Analyzes the codebase against the actual database schema to find:
1. Missing views/tables
2. Missing columns
3. Type mismatches
4. RPC function issues
5. Property access on non-existent fields
"""

import re
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set

PROJECT_ROOT = Path(__file__).parent.parent
SCHEMA_FILE = PROJECT_ROOT / "schema-parsed.json"

def load_schema():
    """Load parsed schema"""
    with open(SCHEMA_FILE) as f:
        return json.load(f)

def find_all_typescript_files():
    """Find all TypeScript files in features"""
    patterns = [
        "features/**/*.ts",
        "features/**/*.tsx",
        "app/**/*.ts",
        "app/**/*.tsx",
        "lib/**/*.ts",
        "lib/**/*.tsx",
    ]

    files = []
    for pattern in patterns:
        files.extend(PROJECT_ROOT.glob(pattern))

    return [f for f in files if 'node_modules' not in str(f)]

def analyze_file(file_path: Path, views: Dict, functions: Dict):
    """Analyze a single file for schema mismatches"""
    issues = []

    try:
        content = file_path.read_text()
        relative_path = str(file_path.relative_to(PROJECT_ROOT))

        # Track context - what table/view is being queried
        current_table = None

        # Pattern 1: .from('table_name')
        from_matches = list(re.finditer(r"\.from\(['\"](\w+)['\"]\)", content))
        for match in from_matches:
            table_name = match.group(1)
            line_num = content[:match.start()].count('\n') + 1

            # Check if view exists
            if table_name not in views:
                issues.append({
                    'severity': 'critical',
                    'type': 'missing_view',
                    'file': relative_path,
                    'line': line_num,
                    'table': table_name,
                    'message': f"View '{table_name}' does not exist in public schema",
                    'fix': f"Check if view name is correct. Available views: {', '.join(list(views.keys())[:5])}..."
                })
            else:
                current_table = table_name

        # Pattern 2: .select() with specific columns
        select_matches = list(re.finditer(r"\.select\(['\"]([^'\"]+)['\"]\)", content))
        for match in select_matches:
            select_str = match.group(1)
            line_num = content[:match.start()].count('\n') + 1

            # Find the nearest .from() before this .select()
            prev_content = content[:match.start()]
            prev_from = list(re.finditer(r"\.from\(['\"](\w+)['\"]\)", prev_content))

            if prev_from:
                table_name = prev_from[-1].group(1)
                if table_name in views:
                    view_columns = views[table_name]

                    # Parse selected columns
                    # Handle: 'col1, col2', 'col1:alias, col2', '*'
                    if select_str != '*':
                        columns = []
                        for col_spec in select_str.split(','):
                            col_spec = col_spec.strip()
                            # Handle aliases: column:alias or column as alias
                            if ':' in col_spec:
                                col_name = col_spec.split(':')[0].strip()
                            elif ' as ' in col_spec.lower():
                                col_name = col_spec.split(' as ')[0].strip()
                            else:
                                col_name = col_spec

                            # Remove any function calls, parens, etc
                            col_name = re.sub(r'\(.*?\)', '', col_name)
                            col_name = col_name.strip('() ')

                            if col_name and col_name not in ['*', '']:
                                columns.append(col_name)

                        # Check each column
                        for col in columns:
                            if col not in view_columns:
                                issues.append({
                                    'severity': 'high',
                                    'type': 'missing_column',
                                    'file': relative_path,
                                    'line': line_num,
                                    'table': table_name,
                                    'column': col,
                                    'message': f"Column '{col}' does not exist in view '{table_name}'",
                                    'available_columns': list(view_columns.keys()),
                                    'fix': f"Available columns: {', '.join(list(view_columns.keys())[:10])}..."
                                })

        # Pattern 3: .eq(), .neq(), .filter() with column names
        filter_patterns = [
            (r"\.eq\(['\"](\w+)['\"]", 'eq'),
            (r"\.neq\(['\"](\w+)['\"]", 'neq'),
            (r"\.gt\(['\"](\w+)['\"]", 'gt'),
            (r"\.gte\(['\"](\w+)['\"]", 'gte'),
            (r"\.lt\(['\"](\w+)['\"]", 'lt'),
            (r"\.lte\(['\"](\w+)['\"]", 'lte'),
            (r"\.like\(['\"](\w+)['\"]", 'like'),
            (r"\.ilike\(['\"](\w+)['\"]", 'ilike'),
            (r"\.in\(['\"](\w+)['\"]", 'in'),
            (r"\.contains\(['\"](\w+)['\"]", 'contains'),
        ]

        for pattern, filter_type in filter_patterns:
            filter_matches = list(re.finditer(pattern, content))
            for match in filter_matches:
                column = match.group(1)
                line_num = content[:match.start()].count('\n') + 1

                # Find the nearest .from() before this filter
                prev_content = content[:match.start()]
                prev_from = list(re.finditer(r"\.from\(['\"](\w+)['\"]\)", prev_content))

                if prev_from:
                    table_name = prev_from[-1].group(1)
                    if table_name in views:
                        view_columns = views[table_name]

                        if column not in view_columns:
                            issues.append({
                                'severity': 'medium',
                                'type': 'missing_filter_column',
                                'file': relative_path,
                                'line': line_num,
                                'table': table_name,
                                'column': column,
                                'filter_type': filter_type,
                                'message': f"Filter column '{column}' does not exist in view '{table_name}'",
                                'fix': f"Available columns: {', '.join(list(view_columns.keys())[:10])}..."
                            })

        # Pattern 4: RPC function calls
        rpc_matches = list(re.finditer(r"\.rpc\(['\"](\w+)['\"]\s*,?\s*(\{[^}]*\})?", content))
        for match in rpc_matches:
            func_name = match.group(1)
            line_num = content[:match.start()].count('\n') + 1

            if func_name not in functions:
                issues.append({
                    'severity': 'high',
                    'type': 'missing_rpc_function',
                    'file': relative_path,
                    'line': line_num,
                    'function': func_name,
                    'message': f"RPC function '{func_name}' does not exist",
                    'fix': f"Check function name spelling or verify it exists in database"
                })

        # Pattern 5: Type assertions (e.g., data as SomeType)
        # This is harder to detect perfectly, but we can find obvious cases
        type_assertions = list(re.finditer(r"as Database\['public'\]\['Views'\]\['(\w+)'\]", content))
        for match in type_assertions:
            view_name = match.group(1)
            line_num = content[:match.start()].count('\n') + 1

            if view_name not in views:
                issues.append({
                    'severity': 'medium',
                    'type': 'invalid_type_assertion',
                    'file': relative_path,
                    'line': line_num,
                    'view': view_name,
                    'message': f"Type assertion references non-existent view '{view_name}'",
                    'fix': f"Update type to use existing view"
                })

    except Exception as e:
        # Skip files that can't be read
        pass

    return issues

def analyze_codebase(schema):
    """Analyze entire codebase"""
    print("\n🔍 Analyzing codebase...")

    views = schema['views']
    functions = schema['functions']

    files = find_all_typescript_files()
    print(f"   Found {len(files)} TypeScript files")

    all_issues = []
    files_with_issues = set()

    for i, file_path in enumerate(files):
        if i % 100 == 0 and i > 0:
            print(f"   Analyzed {i}/{len(files)} files...")

        issues = analyze_file(file_path, views, functions)
        if issues:
            all_issues.extend(issues)
            files_with_issues.add(str(file_path.relative_to(PROJECT_ROOT)))

    print(f"✅ Analysis complete")
    print(f"   Total issues: {len(all_issues)}")
    print(f"   Files with issues: {len(files_with_issues)}")

    return all_issues

def generate_detailed_report(schema, issues):
    """Generate comprehensive report"""
    views = schema['views']
    functions = schema['functions']

    report = []
    report.append("=" * 100)
    report.append("COMPREHENSIVE DATABASE SCHEMA ANALYSIS REPORT")
    report.append("=" * 100)
    report.append("")

    # Executive Summary
    report.append("## EXECUTIVE SUMMARY")
    report.append("")
    report.append(f"📊 Total Public Views: {len(views)}")
    report.append(f"⚙️  Total RPC Functions: {len(functions)}")
    report.append(f"❌ Total Issues Found: {len(issues)}")
    report.append("")

    # Issue breakdown by severity
    by_severity = defaultdict(int)
    by_type = defaultdict(int)
    for issue in issues:
        by_severity[issue['severity']] += 1
        by_type[issue['type']] += 1

    report.append("### Issues by Severity:")
    for severity in ['critical', 'high', 'medium', 'low']:
        if severity in by_severity:
            report.append(f"  - {severity.upper()}: {by_severity[severity]}")
    report.append("")

    report.append("### Issues by Type:")
    for issue_type, count in sorted(by_type.items(), key=lambda x: -x[1]):
        report.append(f"  - {issue_type}: {count}")
    report.append("")

    # Top 20 Critical Issues
    report.append("=" * 100)
    report.append("## TOP 20 CRITICAL ISSUES")
    report.append("=" * 100)
    report.append("")

    critical = [i for i in issues if i['severity'] in ['critical', 'high']]
    for i, issue in enumerate(critical[:20], 1):
        report.append(f"{i}. [{issue['severity'].upper()}] {issue['type'].upper()}")
        report.append(f"   File: {issue['file']}:{issue['line']}")
        report.append(f"   Issue: {issue['message']}")
        if 'fix' in issue:
            report.append(f"   Fix: {issue['fix']}")
        report.append("")

    # Files needing fixes (top 30)
    report.append("=" * 100)
    report.append("## TOP 30 FILES NEEDING FIXES")
    report.append("=" * 100)
    report.append("")

    by_file = defaultdict(list)
    for issue in issues:
        by_file[issue['file']].append(issue)

    for i, (file_path, file_issues) in enumerate(sorted(by_file.items(), key=lambda x: -len(x[1]))[:30], 1):
        critical_count = len([i for i in file_issues if i['severity'] == 'critical'])
        high_count = len([i for i in file_issues if i['severity'] == 'high'])
        medium_count = len([i for i in file_issues if i['severity'] == 'medium'])

        report.append(f"{i}. {file_path}")
        report.append(f"   Total: {len(file_issues)} issues (Critical: {critical_count}, High: {high_count}, Medium: {medium_count})")

        # Show first 5 issues
        for issue in file_issues[:5]:
            report.append(f"   - Line {issue['line']}: {issue['message']}")

        if len(file_issues) > 5:
            report.append(f"   ... and {len(file_issues) - 5} more issues")
        report.append("")

    # Complete database schema
    report.append("=" * 100)
    report.append("## COMPLETE DATABASE SCHEMA")
    report.append("=" * 100)
    report.append("")

    report.append(f"Total Views: {len(views)}")
    report.append("")

    # Key views with full schema
    key_views = [
        'appointments', 'salons', 'services', 'staff', 'profiles',
        'blocked_times', 'operating_hours', 'products', 'messages',
        'appointment_services', 'customer_favorites'
    ]

    report.append("### KEY VIEWS (with full schema):")
    report.append("")

    for view_name in key_views:
        if view_name in views:
            report.append(f"#### {view_name}")
            report.append("")
            columns = views[view_name]
            for col_name, col_type in sorted(columns.items()):
                report.append(f"  - {col_name}: {col_type}")
            report.append("")

    # All views summary
    report.append("### ALL PUBLIC VIEWS:")
    report.append("")
    for i, (view_name, columns) in enumerate(sorted(views.items()), 1):
        report.append(f"{i:3d}. {view_name:45s} ({len(columns):2d} columns)")

    report.append("")

    # Gap analysis
    report.append("=" * 100)
    report.append("## GAP ANALYSIS")
    report.append("=" * 100)
    report.append("")

    report.append("### Missing Views (referenced in code but not in database):")
    missing_views = set()
    for issue in issues:
        if issue['type'] == 'missing_view':
            missing_views.add(issue['table'])

    if missing_views:
        for view in sorted(missing_views):
            # Count occurrences
            count = len([i for i in issues if i.get('table') == view and i['type'] == 'missing_view'])
            report.append(f"  - {view} (referenced {count} times)")
    else:
        report.append("  ✅ No missing views")
    report.append("")

    report.append("### Most Problematic Columns:")
    col_issues = defaultdict(int)
    for issue in issues:
        if issue['type'] in ['missing_column', 'missing_filter_column']:
            key = f"{issue['table']}.{issue['column']}"
            col_issues[key] += 1

    if col_issues:
        for col_ref, count in sorted(col_issues.items(), key=lambda x: -x[1])[:20]:
            report.append(f"  - {col_ref} ({count} references)")
    else:
        report.append("  ✅ No column issues")
    report.append("")

    # Action items
    report.append("=" * 100)
    report.append("## RECOMMENDED ACTIONS")
    report.append("=" * 100)
    report.append("")

    report.append("### Priority 1: Fix Critical Issues")
    report.append("These issues will cause runtime errors:")
    report.append("")
    critical_by_file = defaultdict(list)
    for issue in [i for i in issues if i['severity'] == 'critical']:
        critical_by_file[issue['file']].append(issue)

    for file_path, file_issues in sorted(critical_by_file.items(), key=lambda x: -len(x[1]))[:10]:
        report.append(f"- {file_path} ({len(file_issues)} critical issues)")

    report.append("")

    report.append("### Priority 2: Fix High Severity Issues")
    report.append("These issues may cause runtime errors or incorrect behavior:")
    report.append("")
    high_count = len([i for i in issues if i['severity'] == 'high'])
    report.append(f"Total high severity issues: {high_count}")
    report.append("")

    report.append("### Priority 3: Fix Medium Severity Issues")
    report.append("These issues should be fixed but are less urgent:")
    report.append("")
    medium_count = len([i for i in issues if i['severity'] == 'medium'])
    report.append(f"Total medium severity issues: {medium_count}")
    report.append("")

    report.append("=" * 100)
    report.append("END OF REPORT")
    report.append("=" * 100)

    return "\n".join(report)

def main():
    """Main execution"""
    print("\n" + "=" * 100)
    print("COMPREHENSIVE DATABASE SCHEMA MISMATCH ANALYSIS")
    print("=" * 100)

    # Load schema
    print("\n📥 Loading schema...")
    schema = load_schema()
    print(f"   ✅ Loaded {len(schema['views'])} views and {len(schema['functions'])} functions")

    # Analyze codebase
    issues = analyze_codebase(schema)

    # Generate report
    print("\n📝 Generating report...")
    report = generate_detailed_report(schema, issues)

    # Save report
    report_path = PROJECT_ROOT / "COMPREHENSIVE_SCHEMA_ANALYSIS.md"
    report_path.write_text(report)
    print(f"✅ Report saved to: {report_path}")

    # Save issues as JSON for programmatic access
    issues_path = PROJECT_ROOT / "schema-issues.json"
    with open(issues_path, 'w') as f:
        json.dump({
            'total_issues': len(issues),
            'by_severity': {
                'critical': len([i for i in issues if i['severity'] == 'critical']),
                'high': len([i for i in issues if i['severity'] == 'high']),
                'medium': len([i for i in issues if i['severity'] == 'medium']),
            },
            'issues': issues
        }, f, indent=2)
    print(f"✅ Issues saved to: {issues_path}")

    print("\n" + "=" * 100)
    print("ANALYSIS COMPLETE")
    print("=" * 100)
    print()

    return 0

if __name__ == "__main__":
    main()
