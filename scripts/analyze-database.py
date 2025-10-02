#!/usr/bin/env python3
"""
Ultra-Deep Database Analysis Script
Analyzes database.types.ts for Supabase best practice violations

Based on Supabase official documentation:
- RLS policies must wrap auth.uid() in (select auth.uid())
- RLS policies must specify TO role (authenticated/anon)
- Indexes required on all RLS-filtered columns
- No direct joins in RLS policies
- Security definer functions for bypassing RLS
- Public views for all queryable tables
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set
from collections import defaultdict

# Colors for output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text: str):
    print(f"\n{Colors.BOLD}{Colors.HEADER}{'='*80}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}{text}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}{'='*80}{Colors.ENDC}\n")

def print_section(text: str):
    print(f"\n{Colors.BOLD}{Colors.OKCYAN}{'─'*80}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.OKCYAN}  {text}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.OKCYAN}{'─'*80}{Colors.ENDC}")

def print_issue(severity: str, message: str):
    color = Colors.FAIL if severity == "CRITICAL" else Colors.WARNING
    icon = "🔴" if severity == "CRITICAL" else "⚠️ "
    print(f"{icon} {color}{severity}{Colors.ENDC}: {message}")

def print_success(message: str):
    print(f"✅ {Colors.OKGREEN}{message}{Colors.ENDC}")

def analyze_database_types():
    """Analyze database.types.ts file"""
    types_file = Path("lib/types/database.types.ts")

    if not types_file.exists():
        print_issue("CRITICAL", f"database.types.ts not found at {types_file}")
        return None

    content = types_file.read_text()

    # Extract schema information
    schemas = extract_schemas(content)

    return {
        'content': content,
        'schemas': schemas,
        'file_path': types_file
    }

def extract_schemas(content: str) -> Dict:
    """Extract all schemas and their tables/views"""
    schemas = {}

    # Find all schema definitions
    schema_pattern = r'(\w+):\s*\{\s*Tables:\s*\{'
    for match in re.finditer(schema_pattern, content):
        schema_name = match.group(1)
        if schema_name not in ['Database', '__InternalSupabase']:
            schemas[schema_name] = {
                'tables': set(),
                'views': set(),
                'functions': set()
            }

    # Extract tables for each schema
    current_pos = 0
    for schema_name in schemas.keys():
        # Find schema start
        schema_start = content.find(f"  {schema_name}: {{", current_pos)
        if schema_start == -1:
            continue

        # Find Tables section
        tables_start = content.find("Tables: {", schema_start)
        if tables_start != -1:
            # Find end of Tables section
            views_start = content.find("Views: {", tables_start)
            if views_start != -1:
                tables_section = content[tables_start:views_start]
                # Extract table names
                table_matches = re.finditer(r'      (\w+):\s*\{', tables_section)
                for match in table_matches:
                    table_name = match.group(1)
                    if table_name not in ['never']:
                        schemas[schema_name]['tables'].add(table_name)

        # Find Views section
        if views_start != -1:
            # Find end of Views section
            functions_start = content.find("Functions: {", views_start)
            if functions_start != -1:
                views_section = content[views_start:functions_start]
                # Extract view names
                view_matches = re.finditer(r'      (\w+):\s*\{', views_section)
                for match in view_matches:
                    view_name = match.group(1)
                    if view_name not in ['never']:
                        schemas[schema_name]['views'].add(view_name)

    return schemas

def analyze_public_schema(schemas: Dict):
    """Analyze public schema for required views"""
    print_section("PUBLIC SCHEMA ANALYSIS")

    if 'public' not in schemas:
        print_issue("CRITICAL", "No public schema found!")
        return

    public = schemas['public']

    print(f"\n{Colors.BOLD}Tables:{Colors.ENDC} {len(public['tables'])}")
    for table in sorted(public['tables']):
        print(f"  • {table}")

    print(f"\n{Colors.BOLD}Views:{Colors.ENDC} {len(public['views'])}")
    expected_views = {
        'appointments', 'blocked_times', 'customer_favorites',
        'profiles', 'salons', 'services', 'staff',
        'staff_schedules', 'staff_services', 'user_roles'
    }

    found_views = public['views']

    for view in sorted(found_views):
        is_expected = "✓" if view in expected_views else " "
        print(f"  [{is_expected}] {view}")

    # Check for missing expected views
    missing_views = expected_views - found_views
    if missing_views:
        print(f"\n{Colors.WARNING}Missing Expected Views:{Colors.ENDC}")
        for view in sorted(missing_views):
            print_issue("WARNING", f"Missing view: {view}")
    else:
        print_success("All expected views are present")

    # Check for public_tables_without_rls view
    if 'public_tables_without_rls' in found_views:
        print_success("RLS monitoring view exists: public_tables_without_rls")
    else:
        print_issue("WARNING", "Missing RLS monitoring view: public_tables_without_rls")

def analyze_domain_schemas(schemas: Dict):
    """Analyze domain schemas"""
    print_section("DOMAIN SCHEMAS ANALYSIS")

    expected_domains = {
        'organization': {'min_tables': 5, 'description': 'Salons, staff, locations'},
        'catalog': {'min_tables': 3, 'description': 'Services, pricing, categories'},
        'scheduling': {'min_tables': 3, 'description': 'Appointments, schedules'},
        'inventory': {'min_tables': 5, 'description': 'Products, stock, suppliers'},
        'identity': {'min_tables': 3, 'description': 'Users, profiles, roles'},
        'communication': {'min_tables': 2, 'description': 'Messages, notifications'},
        'analytics': {'min_tables': 2, 'description': 'Metrics, reports'},
        'engagement': {'min_tables': 1, 'description': 'Favorites, reviews'}
    }

    for domain, config in expected_domains.items():
        if domain in schemas:
            tables_count = len(schemas[domain]['tables'])
            status = "✓" if tables_count >= config['min_tables'] else "⚠"
            print(f"[{status}] {Colors.BOLD}{domain:20}{Colors.ENDC} {tables_count:2} tables - {config['description']}")

            if tables_count < config['min_tables']:
                print_issue("WARNING", f"{domain} has fewer tables than expected")
        else:
            print_issue("CRITICAL", f"Missing domain schema: {domain}")

def analyze_rls_issues():
    """Analyze potential RLS issues from CLAUDE.md patterns"""
    print_section("RLS POLICY VIOLATIONS (Based on Supabase Docs)")

    violations = []

    # These are patterns to look for when we can access the actual SQL
    print(f"\n{Colors.BOLD}Common RLS Anti-Patterns:{Colors.ENDC}")
    print("  1. ❌ auth.uid() without (select ...) wrapper")
    print("  2. ❌ Missing 'TO authenticated' role specification")
    print("  3. ❌ Join queries in RLS policies")
    print("  4. ❌ Missing indexes on RLS-filtered columns")
    print("  5. ❌ Functions not wrapped in SELECT for caching")

    print(f"\n{Colors.BOLD}Required Patterns:{Colors.ENDC}")
    print("  1. ✓ (select auth.uid()) = user_id")
    print("  2. ✓ TO authenticated USING (...)")
    print("  3. ✓ team_id IN (select ...) -- avoid joins")
    print("  4. ✓ CREATE INDEX ON table(user_id, salon_id)")
    print("  5. ✓ (select function()) -- cache function results")

    print(f"\n{Colors.WARNING}⚠️  Cannot analyze actual RLS policies without database access{Colors.ENDC}")
    print(f"{Colors.WARNING}    Need to connect to database to verify policies{Colors.ENDC}")

def analyze_missing_indexes():
    """Identify columns that likely need indexes"""
    print_section("INDEX RECOMMENDATIONS")

    # Common patterns that need indexes
    index_recommendations = [
        ("All domain tables", "user_id", "For RLS policies filtering by user"),
        ("All domain tables", "salon_id", "For RLS policies filtering by salon"),
        ("scheduling.appointments", "customer_id", "For customer queries"),
        ("scheduling.appointments", "staff_id", "For staff queries"),
        ("scheduling.appointments", "start_time", "For time-based queries"),
        ("catalog.services", "salon_id, is_active", "Composite for active services"),
        ("organization.staff_profiles", "salon_id, is_active", "Composite for active staff"),
        ("identity.user_roles", "user_id, role_name", "Composite for role lookups"),
        ("engagement.customer_favorites", "customer_id, salon_id", "Composite for favorites"),
    ]

    print(f"\n{Colors.BOLD}Recommended Indexes (Based on Common Query Patterns):{Colors.ENDC}\n")
    for table, column, reason in index_recommendations:
        print(f"  📊 {Colors.BOLD}{table:40}{Colors.ENDC} ({column})")
        print(f"     Reason: {reason}\n")

    print(f"{Colors.WARNING}⚠️  Need database access to verify existing indexes{Colors.ENDC}")

def generate_summary(schemas: Dict):
    """Generate analysis summary"""
    print_header("ANALYSIS SUMMARY")

    total_schemas = len(schemas)
    total_tables = sum(len(s['tables']) for s in schemas.values())
    total_views = sum(len(s['views']) for s in schemas.values())

    print(f"Total Schemas: {Colors.BOLD}{total_schemas}{Colors.ENDC}")
    print(f"Total Tables:  {Colors.BOLD}{total_tables}{Colors.ENDC}")
    print(f"Total Views:   {Colors.BOLD}{total_views}{Colors.ENDC}")

    print_section("SCHEMA BREAKDOWN")
    for schema_name in sorted(schemas.keys()):
        schema = schemas[schema_name]
        tables_count = len(schema['tables'])
        views_count = len(schema['views'])
        print(f"  {schema_name:20} {tables_count:3} tables, {views_count:3} views")

def main():
    print_header("ULTRA-DEEP SUPABASE DATABASE ANALYSIS")
    print(f"Analyzing database types and identifying violations...")

    # Analyze database types
    db_info = analyze_database_types()
    if not db_info:
        return

    schemas = db_info['schemas']

    # Run analyses
    generate_summary(schemas)
    analyze_public_schema(schemas)
    analyze_domain_schemas(schemas)
    analyze_rls_issues()
    analyze_missing_indexes()

    # Final recommendations
    print_header("CRITICAL NEXT STEPS")
    print(f"""
{Colors.BOLD}To complete the analysis, you need to:{Colors.ENDC}

1. {Colors.FAIL}Connect to the Supabase database{Colors.ENDC}
   Run: supabase db dump -f supabase/migrations/001_current_schema.sql

2. {Colors.WARNING}Analyze actual RLS policies{Colors.ENDC}
   Check for:
   - Unwrapped auth.uid() calls
   - Missing TO authenticated clauses
   - Join queries in policies

3. {Colors.WARNING}Verify indexes on RLS columns{Colors.ENDC}
   Query: SELECT * FROM admin.check_missing_fk_indexes()

4. {Colors.OKGREEN}Generate fix migration{Colors.ENDC}
   Create migration with:
   - Wrapped auth.uid() in all policies
   - TO authenticated on all policies
   - Missing indexes
   - Security definer functions

{Colors.BOLD}Database Connection Required:{Colors.ENDC}
   Project: nwmcpfioxerzodvbjigw
   Command: supabase link --project-ref nwmcpfioxerzodvbjigw
""")

if __name__ == "__main__":
    main()
