#!/usr/bin/env python3
"""
Generate TypeScript types from Supabase Database
Generates complete types including all schemas, tables, views, functions, and enums
"""

import subprocess
import sys
import os
from pathlib import Path
from datetime import datetime

# Project configuration
PROJECT_ROOT = Path(__file__).parent.parent
PROJECT_ID = "nwmcpfioxerzodvbjigw"

# Output locations
OUTPUTS = [
    PROJECT_ROOT / "lib" / "types" / "database.types.ts",
]

# All schemas to include (comprehensive list)
SCHEMAS = [
    # Core application schemas (8 business domains)
    "organization",      # Salons, staff, locations, chains, settings
    "catalog",          # Services, categories, pricing, booking rules
    "scheduling",       # Appointments, schedules, blocked times, time off
    "identity",         # Profiles, roles, permissions, sessions, auth
    "analytics",        # Metrics, reports, insights
    "communication",    # Messages, notifications, webhooks
    "engagement",       # Favorites, reviews, loyalty
    "inventory",        # Products, stock, suppliers, orders

    # Additional application schemas
    "admin",            # Admin functionality
    "archive",          # Archived/historical data
    "audit",            # Audit logs and tracking
    "security",         # Security features
    "utility",          # Utility functions and helpers

    # System schemas
    "public",           # Public views (CRITICAL - query layer)
    "auth",             # Supabase auth
    "storage",          # Supabase storage
    "realtime",         # Supabase realtime
    "realtime_system",  # Realtime system tables

    # Infrastructure schemas
    "extensions",       # Database extensions
    "vault",            # Secrets vault
    "supabase_migrations",  # Migration tracking
    "private",          # Private schema
    "graphql",          # GraphQL schema
    "graphql_public",   # GraphQL public schema
    "net",              # Network utilities
    "cron",             # Cron jobs
    "pgbouncer",        # PgBouncer connection pooling
]


def check_prerequisites():
    """Check if required tools are available"""
    print("🔍 Checking prerequisites...")

    # Check if Supabase CLI is available
    try:
        result = subprocess.run(
            ["npx", "supabase", "--version"],
            capture_output=True,
            text=True,
            timeout=10
        )
        print(f"   ✅ Supabase CLI: {result.stdout.strip()}")
    except Exception as e:
        print(f"   ❌ Supabase CLI not found")
        print(f"   Install: npm install -g supabase")
        return False

    # Check if we have project access
    print(f"   ✅ Project ID: {PROJECT_ID}")

    return True


def ensure_output_dirs():
    """Ensure output directories exist"""
    for output in OUTPUTS:
        output.parent.mkdir(parents=True, exist_ok=True)
        print(f"   📁 Output dir: {output.parent}")


def generate_types():
    """Generate TypeScript types for all schemas"""

    print("\n" + "="*60)
    print("🔧 GENERATING SUPABASE TYPESCRIPT TYPES")
    print("="*60)
    print(f"Project: {PROJECT_ID}")
    print(f"Schemas: {len(SCHEMAS)} schemas")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60 + "\n")

    # Build the command
    cmd = [
        "npx",
        "supabase",
        "gen",
        "types",
        "typescript",
        "--project-id",
        PROJECT_ID,
    ]

    # Add all schema flags
    for schema in SCHEMAS:
        cmd.extend(["--schema", schema])

    print(f"📊 Generating types for {len(SCHEMAS)} schemas:")
    for i, schema in enumerate(SCHEMAS, 1):
        print(f"   {i:2d}. {schema}")
    print()

    print("🚀 Running Supabase CLI...")
    print(f"Command: {' '.join(cmd[:10])}... (+ {len(SCHEMAS)} schemas)")
    print()

    try:
        # Run the command
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True,
            timeout=300,  # 5 minute timeout
            cwd=PROJECT_ROOT
        )

        if not result.stdout:
            print("❌ Error: No output generated")
            if result.stderr:
                print(f"STDERR: {result.stderr}")
            return False

        # Add header comment
        header = f"""/**
 * Supabase Database Types
 *
 * Auto-generated from Supabase database schema
 *
 * Project ID: {PROJECT_ID}
 * Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 * Schemas: {len(SCHEMAS)} schemas
 *
 * CRITICAL:
 * - Always query from public views (not schema tables)
 * - Use Database['public']['Views'] for types
 * - Never use Database['public']['Tables'] for queries
 *
 * @see docs/03-database/best-practices.md
 * @see CLAUDE.md
 */

"""

        full_content = header + result.stdout

        # Write to all output locations
        written_files = []
        for output_path in OUTPUTS:
            try:
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_text(full_content, encoding="utf-8")
                written_files.append(output_path)
            except Exception as e:
                print(f"⚠️  Warning: Could not write to {output_path}: {e}")

        if not written_files:
            print("❌ Error: Could not write to any output location")
            return False

        print("✅ Successfully generated types!")
        print()

        # Show output locations
        for output_path in written_files:
            file_size = output_path.stat().st_size
            line_count = len(full_content.splitlines())

            print(f"📄 {output_path.relative_to(PROJECT_ROOT)}")
            print(f"   Size: {file_size:,} bytes ({file_size / 1024:.1f} KB)")
            print(f"   Lines: {line_count:,}")
            print()

        # Analyze generated types
        print("📊 Type Analysis:")
        content_lower = result.stdout.lower()

        # Count occurrences
        tables_count = result.stdout.count("Tables: {")
        views_count = result.stdout.count("Views: {")
        functions_count = result.stdout.count("Functions: {")
        enums_count = result.stdout.count("Enums: {")

        print(f"   Tables: {tables_count} schema(s)")
        print(f"   Views: {views_count} schema(s)")
        print(f"   Functions: {functions_count} schema(s)")
        print(f"   Enums: {enums_count} schema(s)")
        print()

        # Show any warnings from stderr
        if result.stderr:
            print("⚠️  Warnings:")
            print(result.stderr)
            print()

        # Critical reminder
        print("="*60)
        print("⚠️  CRITICAL REMINDERS:")
        print("="*60)
        print("✅ ALWAYS query from public views:")
        print("   const { data } = await supabase.from('appointments')")
        print()
        print("✅ ALWAYS use Views types:")
        print("   type Salon = Database['public']['Views']['salons']['Row']")
        print()
        print("❌ NEVER query schema tables directly:")
        print("   .schema('scheduling').from('appointments') // FORBIDDEN")
        print()
        print("❌ NEVER use Tables types for queries:")
        print("   Database['public']['Tables']['salons'] // FORBIDDEN")
        print("="*60)

        return True

    except subprocess.TimeoutExpired:
        print("❌ Error: Command timed out after 5 minutes")
        print("   Try again or check network connection")
        return False

    except subprocess.CalledProcessError as e:
        print(f"❌ Error: Command failed with exit code {e.returncode}")
        print()
        if e.stderr:
            print("STDERR:")
            print(e.stderr)
        print()
        print("Possible issues:")
        print("  1. Project ID is incorrect")
        print("  2. No access to Supabase project")
        print("  3. Supabase CLI not authenticated")
        print()
        print("Solutions:")
        print("  1. Check PROJECT_ID in this script")
        print("  2. Run: npx supabase login")
        print("  3. Check .env for SUPABASE credentials")
        return False

    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False


def verify_output():
    """Verify the generated types file"""
    print("\n🔍 Verifying generated types...")

    for output_path in OUTPUTS:
        if not output_path.exists():
            continue

        content = output_path.read_text(encoding="utf-8")

        # Check for critical sections
        checks = [
            ("Database interface", "export interface Database" in content),
            ("Public schema", "'public':" in content),
            ("Tables definition", "Tables:" in content),
            ("Views definition", "Views:" in content),
            ("Functions definition", "Functions:" in content or "functions:" in content),
        ]

        print(f"\n📄 {output_path.relative_to(PROJECT_ROOT)}:")
        all_passed = True
        for check_name, passed in checks:
            status = "✅" if passed else "❌"
            print(f"   {status} {check_name}")
            if not passed:
                all_passed = False

        if not all_passed:
            print("   ⚠️  Warning: Some expected sections missing")

    return True


def main():
    """Main function"""
    try:
        print()

        # Check prerequisites
        if not check_prerequisites():
            print("\n❌ Prerequisites not met")
            return 1

        print()

        # Ensure output directories exist
        ensure_output_dirs()

        print()

        # Generate types
        if not generate_types():
            print("\n❌ Type generation failed")
            return 1

        # Verify output
        verify_output()

        print("\n" + "="*60)
        print("✅ TYPE GENERATION COMPLETE")
        print("="*60)
        print()
        print("Next steps:")
        print("  1. Review generated types in lib/types/database.types.ts")
        print("  2. Restart TypeScript server in your editor")
        print("  3. Verify imports in your code")
        print()
        print("Documentation:")
        print("  - docs/03-database/best-practices.md")
        print("  - docs/04-frontend/component-patterns.md")
        print()

        return 0

    except KeyboardInterrupt:
        print("\n\n⚠️  Cancelled by user")
        return 130

    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
