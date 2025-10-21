#!/usr/bin/env python3
"""
Parse database.types.ts to extract complete schema information
"""

import re
import json
from pathlib import Path
from collections import defaultdict

PROJECT_ROOT = Path(__file__).parent.parent
TYPES_FILE = PROJECT_ROOT / "lib/types/database.types.ts"

def extract_public_views():
    """Extract all public views and their columns"""
    print("🔍 Parsing database.types.ts...")

    content = TYPES_FILE.read_text()

    # Find the public schema section
    public_start = content.find("  public: {")
    if public_start == -1:
        print("❌ Could not find public schema")
        return {}

    # Find the Views section within public
    views_start = content.find("Views: {", public_start)
    if views_start == -1:
        print("❌ Could not find Views section")
        return {}

    # Find the end of Views section (next closing brace at same level)
    brace_count = 1
    i = views_start + len("Views: {")
    while i < len(content) and brace_count > 0:
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
        i += 1

    views_section = content[views_start:i]

    # Now parse individual views
    views = {}

    # Pattern to match view name and its Row definition
    # Look for:   view_name: {
    #               Row: {
    #                 column: type
    view_pattern = re.compile(r'(\w+): \{\s*Row: \{([^}]+(?:\}[^}]+)*?)\s*\}\s*(?:Insert:|Update:|Relationships:)')

    for match in view_pattern.finditer(views_section):
        view_name = match.group(1)
        row_content = match.group(2)

        # Parse columns from Row content
        columns = {}

        # Match column: type pairs
        # Handle multi-line types and nullable types
        col_matches = re.finditer(r'(\w+):\s*([^\n]+)', row_content)

        for col_match in col_matches:
            col_name = col_match.group(1)
            col_type = col_match.group(2).strip()

            # Clean up type (remove trailing commas, etc)
            if col_type.endswith(','):
                col_type = col_type[:-1].strip()

            columns[col_name] = col_type

        views[view_name] = columns

    print(f"✅ Parsed {len(views)} public views")

    # Show sample
    if views:
        sample_view = list(views.keys())[0]
        print(f"\n📋 Sample view '{sample_view}':")
        for col, typ in list(views[sample_view].items())[:5]:
            print(f"   {col}: {typ}")
        if len(views[sample_view]) > 5:
            print(f"   ... and {len(views[sample_view]) - 5} more columns")

    return views

def extract_public_functions():
    """Extract all public RPC functions"""
    print("\n🔍 Parsing RPC functions...")

    content = TYPES_FILE.read_text()

    # Find Functions section
    functions_pattern = re.compile(r'Functions:\s*\{([^}]+(?:\}[^}]+)*?)\n\s*\}(?:\s*Enums:|\s*$)', re.DOTALL)

    match = functions_pattern.search(content)
    if not match:
        print("❌ Could not find Functions section")
        return {}

    functions_section = match.group(1)

    # Parse function definitions
    functions = {}

    # Pattern: function_name: {
    func_pattern = re.compile(r'(\w+):\s*\{[^}]*Args:\s*\{([^}]*)\}[^}]*Returns:\s*([^\n]+)', re.DOTALL)

    for func_match in func_pattern.finditer(functions_section):
        func_name = func_match.group(1)
        args_content = func_match.group(2)
        returns = func_match.group(3).strip()

        # Parse arguments
        args = {}
        arg_matches = re.finditer(r'(\w+):\s*([^\n]+)', args_content)
        for arg_match in arg_matches:
            arg_name = arg_match.group(1)
            arg_type = arg_match.group(2).strip().rstrip(',')
            args[arg_name] = arg_type

        functions[func_name] = {
            'args': args,
            'returns': returns
        }

    print(f"✅ Parsed {len(functions)} functions")

    return functions

def save_schema(views, functions):
    """Save parsed schema to JSON for easy analysis"""
    schema = {
        'views': views,
        'functions': functions,
        'view_count': len(views),
        'function_count': len(functions)
    }

    output_file = PROJECT_ROOT / "schema-parsed.json"
    with open(output_file, 'w') as f:
        json.dump(schema, f, indent=2)

    print(f"\n✅ Saved schema to {output_file}")

    return schema

def print_summary(views, functions):
    """Print summary of schema"""
    print("\n" + "=" * 80)
    print("SCHEMA SUMMARY")
    print("=" * 80)

    print(f"\n📊 Total Public Views: {len(views)}")
    print("\nKey Views:")

    # List important views
    important_views = [
        'appointments', 'profiles', 'salons', 'services', 'staff',
        'blocked_times', 'operating_hours', 'products', 'messages'
    ]

    for view_name in important_views:
        if view_name in views:
            col_count = len(views[view_name])
            print(f"  ✅ {view_name} ({col_count} columns)")
        else:
            print(f"  ❌ {view_name} - NOT FOUND")

    print(f"\n📋 All {len(views)} Views:")
    for i, view_name in enumerate(sorted(views.keys()), 1):
        col_count = len(views[view_name])
        print(f"  {i:2d}. {view_name:40s} ({col_count:2d} columns)")

    print(f"\n⚙️  Total RPC Functions: {len(functions)}")
    if functions:
        print("\nFunctions:")
        for func_name in sorted(functions.keys()):
            func_info = functions[func_name]
            arg_count = len(func_info['args'])
            print(f"  - {func_name}({arg_count} args) -> {func_info['returns']}")

    print("\n" + "=" * 80)

def main():
    """Main execution"""
    print("\n" + "=" * 80)
    print("DATABASE SCHEMA PARSER")
    print("=" * 80)
    print()

    # Extract views
    views = extract_public_views()

    # Extract functions
    functions = extract_public_functions()

    # Save to JSON
    save_schema(views, functions)

    # Print summary
    print_summary(views, functions)

    return 0

if __name__ == "__main__":
    main()
