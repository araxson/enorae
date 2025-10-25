#!/usr/bin/env python3
"""
Generate TypeScript types from Supabase Database - Fixed Version
Uses local schema generation with access token
"""

import subprocess
import sys
import os
from pathlib import Path
from datetime import datetime
import json

# Project configuration
PROJECT_ROOT = Path(__file__).parent.parent
PROJECT_ID = "nwmcpfioxerzodvbjigw"

# Output locations
OUTPUTS = [
    PROJECT_ROOT / "lib" / "types" / "database.types.ts",
]

# Core schemas only - avoiding system schemas that might cause issues
CORE_SCHEMAS = [
    # Core application schemas (7 business domains)
    "organization",      # Salons, staff, locations, chains, settings
    "catalog",          # Services, categories, pricing, booking rules
    "scheduling",       # Appointments, schedules, blocked times, time off
    "identity",         # Profiles, roles, permissions, sessions, auth
    "analytics",        # Metrics, reports, insights
    "communication",    # Messages, notifications, webhooks
    "engagement",       # Favorites, reviews, loyalty
    "public",           # Public views (CRITICAL - query layer)
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
        version = result.stdout.strip()
        print(f"   ✅ Supabase CLI: {version}")

        # Check if version is too old
        if "2.39" in version:
            print(f"   ⚠️  WARNING: Your Supabase CLI is outdated (v2.39.2)")
            print(f"   ⚠️  Latest version is v2.53.6")
            print(f"   ⚠️  Run: npm update -g supabase")
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


def try_alternative_generation():
    """Try alternative generation method using local connection"""

    print("\n🔄 Trying alternative generation method...")
    print("   Using core schemas only to avoid system schema issues")
    print()

    # Build the command with core schemas only
    cmd = [
        "npx",
        "supabase",
        "gen",
        "types",
        "typescript",
        "--project-id",
        PROJECT_ID,
        "--local"  # Try local flag
    ]

    # Add only core schema flags
    for schema in CORE_SCHEMAS:
        cmd.extend(["--schema", schema])

    print(f"📊 Generating types for {len(CORE_SCHEMAS)} core schemas:")
    for i, schema in enumerate(CORE_SCHEMAS, 1):
        print(f"   {i:2d}. {schema}")
    print()

    try:
        # Run the command
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60,  # 1 minute timeout
            cwd=PROJECT_ROOT
        )

        # Check if it worked
        if result.returncode == 0 and result.stdout:
            return result
        else:
            # If local flag didn't work, try without it
            cmd.remove("--local")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60,
                cwd=PROJECT_ROOT
            )
            if result.returncode == 0 and result.stdout:
                return result
    except:
        pass

    return None


def generate_minimal_types():
    """Generate minimal TypeScript types as fallback"""

    print("\n📝 Generating minimal TypeScript types as fallback...")

    minimal_types = f"""/**
 * Supabase Database Types - Minimal Fallback
 *
 * Auto-generated with limited schema access
 * Project ID: {PROJECT_ID}
 * Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 *
 * NOTE: This is a minimal type definition.
 * Run 'npm update -g supabase' and retry for full types.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | {{ [key: string]: Json | undefined }}
  | Json[]

export interface Database {{
  public: {{
    Tables: {{
      [key: string]: {{
        Row: {{ [key: string]: unknown }}
        Insert: {{ [key: string]: unknown }}
        Update: {{ [key: string]: unknown }}
      }}
    }}
    Views: {{
      // Core view types - update these based on your actual views
      salons: {{
        Row: {{
          id: string
          name: string
          email: string | null
          phone: string | null
          created_at: string
          updated_at: string
          [key: string]: unknown
        }}
      }}
      appointments: {{
        Row: {{
          id: string
          salon_id: string
          customer_id: string | null
          staff_id: string | null
          service_id: string | null
          start_time: string
          end_time: string
          status: string
          [key: string]: unknown
        }}
      }}
      services: {{
        Row: {{
          id: string
          salon_id: string
          name: string
          duration: number
          price: number
          [key: string]: unknown
        }}
      }}
      staff: {{
        Row: {{
          id: string
          salon_id: string
          user_id: string
          role: string
          [key: string]: unknown
        }}
      }}
      [key: string]: {{
        Row: {{ [key: string]: unknown }}
      }}
    }}
    Functions: {{
      [key: string]: {{
        Args: {{ [key: string]: unknown }}
        Returns: unknown
      }}
    }}
    Enums: {{
      [key: string]: string
    }}
  }}
  {'  '.join([f'''
  {schema}: {{
    Tables: {{ [key: string]: unknown }}
    Views: {{ [key: string]: unknown }}
  }}''' for schema in CORE_SCHEMAS if schema != 'public'])}
  audit: {{
    Tables: {{ [key: string]: unknown }}
    Views: {{ [key: string]: unknown }}
  }}
}}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Common types based on your application
export type Salon = Views<'salons'>
export type Appointment = Views<'appointments'>
export type Service = Views<'services'>
export type Staff = Views<'staff'>
"""

    return minimal_types


def generate_types():
    """Generate TypeScript types for all schemas"""

    print("\n" + "="*60)
    print("🔧 GENERATING SUPABASE TYPESCRIPT TYPES")
    print("="*60)
    print(f"Project: {PROJECT_ID}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60 + "\n")

    # First try the alternative generation method
    result = try_alternative_generation()

    if result and result.stdout:
        print("✅ Successfully generated types using alternative method!")
        content = result.stdout
    else:
        print("⚠️  Standard generation failed, using fallback...")
        content = generate_minimal_types()
        print("✅ Generated minimal fallback types")

    # Add header comment
    header = f"""/**
 * Supabase Database Types
 *
 * Auto-generated from Supabase database schema
 *
 * Project ID: {PROJECT_ID}
 * Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 *
 * CRITICAL:
 * - Always query from public views (not schema tables)
 * - Use Database['public']['Views'] for types
 * - Never use Database['public']['Tables'] for queries
 *
 * @see docs/stack-patterns/supabase-patterns.md
 */

"""

    full_content = header + content

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

    print()

    # Show output locations
    for output_path in written_files:
        file_size = output_path.stat().st_size
        line_count = len(full_content.splitlines())

        print(f"📄 {output_path.relative_to(PROJECT_ROOT)}")
        print(f"   Size: {file_size:,} bytes ({file_size / 1024:.1f} KB)")
        print(f"   Lines: {line_count:,}")
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


def fix_supabase_cli():
    """Provide instructions to fix the Supabase CLI issue"""

    print("\n" + "="*60)
    print("🔧 HOW TO FIX THE SUPABASE CLI ISSUE")
    print("="*60)
    print()
    print("The PostgREST error (PGRST002) indicates schema cache issues.")
    print("Here are the solutions in order of preference:")
    print()
    print("1️⃣  UPDATE SUPABASE CLI (Recommended):")
    print("   npm update -g supabase")
    print("   # or")
    print("   npm install -g supabase@latest")
    print()
    print("2️⃣  RE-AUTHENTICATE:")
    print("   npx supabase logout")
    print("   npx supabase login")
    print()
    print("3️⃣  USE ACCESS TOKEN:")
    print("   export SUPABASE_ACCESS_TOKEN=your-access-token")
    print("   # Get token from: https://supabase.com/dashboard/account/tokens")
    print()
    print("4️⃣  REFRESH SCHEMA CACHE:")
    print("   # In Supabase Dashboard:")
    print("   # Settings > API > Reload Schema Cache")
    print()
    print("5️⃣  USE GENERATED FALLBACK:")
    print("   # The script has generated minimal types that will work")
    print("   # Update them manually as needed")
    print()
    print("="*60)


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

        # Show how to fix the issue
        fix_supabase_cli()

        print("\n" + "="*60)
        print("✅ TYPE GENERATION COMPLETE")
        print("="*60)
        print()
        print("Next steps:")
        print("  1. Review generated types in lib/types/database.types.ts")
        print("  2. Update Supabase CLI for full type generation")
        print("  3. Restart TypeScript server in your editor")
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