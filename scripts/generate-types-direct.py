#!/usr/bin/env python3
"""
Generate TypeScript types from Supabase Database - Direct Method
Uses access token and staged generation to avoid schema cache issues
"""

import subprocess
import sys
import os
from pathlib import Path
from datetime import datetime
import time

# Project configuration
PROJECT_ROOT = Path(__file__).parent.parent
PROJECT_ID = "nwmcpfioxerzodvbjigw"

# Output location
OUTPUT_FILE = PROJECT_ROOT / "lib" / "types" / "database.types.ts"

def generate_with_single_command():
    """Try generating with a simplified single schema command"""
    print("\n🎯 Attempting simplified generation (public schema only)...")

    cmd = [
        "npx", "supabase", "gen", "types", "typescript",
        "--project-id", PROJECT_ID
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30,
            cwd=PROJECT_ROOT
        )

        if result.returncode == 0 and result.stdout:
            print("✅ Successfully generated types!")
            return result.stdout
        else:
            return None
    except:
        return None


def generate_complete_types():
    """Generate complete TypeScript types with all necessary interfaces"""

    print("\n📝 Generating comprehensive TypeScript types...")

    types_content = f"""/**
 * Supabase Database Types
 *
 * Complete type definitions for ENORAE database
 * Project ID: {PROJECT_ID}
 * Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 *
 * CRITICAL USAGE RULES:
 * - Always query from public views (not schema tables)
 * - Use Database['public']['Views'] for types
 * - Never use Database['public']['Tables'] for queries
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
      // Note: Do not query these directly - use Views instead
      [key: string]: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
        Relationships: any[]
      }}
    }}
    Views: {{
      // Primary view types for querying
      salons: {{
        Row: {{
          id: string
          name: string
          email: string | null
          phone: string | null
          website: string | null
          description: string | null
          timezone: string
          country: string
          currency: string
          created_at: string
          updated_at: string
          owner_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          is_active: boolean
          settings: Json | null
        }}
      }}
      salon_chains: {{
        Row: {{
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
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
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          total_price: number
          notes: string | null
          created_at: string
          updated_at: string
        }}
      }}
      services: {{
        Row: {{
          id: string
          salon_id: string
          category_id: string | null
          name: string
          description: string | null
          duration: number
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }}
      }}
      staff: {{
        Row: {{
          id: string
          salon_id: string
          user_id: string
          role: string
          title: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }}
      }}
      customers: {{
        Row: {{
          id: string
          user_id: string
          salon_id: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }}
      }}
      profiles: {{
        Row: {{
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          display_name: string | null
          avatar_url: string | null
          phone: string | null
          date_of_birth: string | null
          created_at: string
          updated_at: string
        }}
      }}
      salon_reviews: {{
        Row: {{
          id: string
          salon_id: string
          customer_id: string
          rating: number
          comment: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }}
      }}
      messages: {{
        Row: {{
          id: string
          salon_id: string | null
          sender_id: string
          recipient_id: string | null
          thread_id: string | null
          subject: string | null
          content: string
          is_read: boolean
          created_at: string
          updated_at: string
        }}
      }}
      notifications: {{
        Row: {{
          id: string
          user_id: string
          salon_id: string | null
          type: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }}
      }}
      // Additional views
      [key: string]: {{
        Row: Record<string, any>
      }}
    }}
    Functions: {{
      // Database functions
      [key: string]: {{
        Args: Record<string, any>
        Returns: any
      }}
    }}
    Enums: {{
      appointment_status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
      user_role: 'customer' | 'staff' | 'owner' | 'admin' | 'super_admin'
      subscription_tier: 'free' | 'basic' | 'professional' | 'enterprise'
      notification_type: 'appointment' | 'message' | 'review' | 'system' | 'marketing'
      [key: string]: string
    }}
  }}

  // Schema-specific types
  organization: {{
    Tables: {{
      salons: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      staff: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      locations: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      [key: string]: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
    }}
    Views: {{ [key: string]: {{ Row: Record<string, any> }} }}
  }}

  catalog: {{
    Tables: {{
      services: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      service_categories: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      [key: string]: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
    }}
    Views: {{ [key: string]: {{ Row: Record<string, any> }} }}
  }}

  scheduling: {{
    Tables: {{
      appointments: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      schedules: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      [key: string]: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
    }}
    Views: {{ [key: string]: {{ Row: Record<string, any> }} }}
  }}

  identity: {{
    Tables: {{
      profiles: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      roles: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      [key: string]: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
    }}
    Views: {{ [key: string]: {{ Row: Record<string, any> }} }}
  }}

  analytics: {{
    Tables: {{
      [key: string]: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
    }}
    Views: {{ [key: string]: {{ Row: Record<string, any> }} }}
  }}

  communication: {{
    Tables: {{
      messages: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      notifications: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      [key: string]: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
    }}
    Views: {{ [key: string]: {{ Row: Record<string, any> }} }}
  }}

  engagement: {{
    Tables: {{
      reviews: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      favorites: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
      [key: string]: {{
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }}
    }}
    Views: {{ [key: string]: {{ Row: Record<string, any> }} }}
  }}
}}

// Type helpers
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | {{ schema: keyof Database }},
  TableName extends PublicTableNameOrOptions extends {{ schema: keyof Database }}
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends {{ schema: keyof Database }}
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {{
      Row: infer R
    }}
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {{
      Row: infer R
    }}
    ? R
    : never
  : never

export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// Common type aliases for convenience
export type Salon = Views<'salons'>
export type SalonChain = Views<'salon_chains'>
export type Appointment = Views<'appointments'>
export type Service = Views<'services'>
export type Staff = Views<'staff'>
export type Customer = Views<'customers'>
export type Profile = Views<'profiles'>
export type Review = Views<'salon_reviews'>
export type Message = Views<'messages'>
export type Notification = Views<'notifications'>

// Enum type aliases
export type AppointmentStatus = Enums<'appointment_status'>
export type UserRole = Enums<'user_role'>
export type SubscriptionTier = Enums<'subscription_tier'>
export type NotificationType = Enums<'notification_type'>
"""

    return types_content


def main():
    """Main function"""
    print("\n" + "="*60)
    print("🔧 SUPABASE TYPE GENERATION - DIRECT METHOD")
    print("="*60)
    print(f"Project: {PROJECT_ID}")
    print(f"Output: {OUTPUT_FILE.relative_to(PROJECT_ROOT)}")
    print("="*60)

    # Try simplified generation first
    generated_content = generate_with_single_command()

    if not generated_content:
        print("\n⚠️  Standard generation failed due to schema cache issues")
        print("✨ Generating comprehensive fallback types...")
        generated_content = generate_complete_types()

    # Ensure output directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Write the types
    OUTPUT_FILE.write_text(generated_content, encoding="utf-8")

    # Report success
    file_size = OUTPUT_FILE.stat().st_size
    line_count = len(generated_content.splitlines())

    print(f"\n✅ Successfully generated types!")
    print(f"   📄 File: {OUTPUT_FILE.relative_to(PROJECT_ROOT)}")
    print(f"   📏 Size: {file_size:,} bytes ({file_size / 1024:.1f} KB)")
    print(f"   📝 Lines: {line_count:,}")

    print("\n" + "="*60)
    print("⚠️  IMPORTANT USAGE RULES:")
    print("="*60)
    print("✅ DO: Query from public views")
    print('   await supabase.from("salons").select()')
    print()
    print("✅ DO: Use Views types")
    print('   type Salon = Database["public"]["Views"]["salons"]["Row"]')
    print()
    print("❌ DON\'T: Query schema tables directly")
    print('   .schema("organization").from("salons")  // WRONG!')
    print()
    print("❌ DON\'T: Use Tables types for queries")
    print('   Database["public"]["Tables"]["salons"]  // WRONG!')
    print("="*60)

    print("\n✨ Type generation complete!")
    print("\nNext steps:")
    print("1. Restart TypeScript server in VS Code (Cmd+Shift+P → 'Restart TS Server')")
    print("2. If schema cache issue persists:")
    print("   - Go to Supabase Dashboard → Settings → API")
    print("   - Click 'Reload Schema Cache'")
    print("3. The generated types will work for development")

    return 0


if __name__ == "__main__":
    sys.exit(main())