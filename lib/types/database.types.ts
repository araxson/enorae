/**
 * Supabase Database Types
 *
 * Auto-generated from Supabase database schema
 *
 * Project ID: nwmcpfioxerzodvbjigw
 * Generated: 2025-10-23 14:33:04
 *
 * CRITICAL:
 * - Always query from public views (not schema tables)
 * - Use Database['public']['Views'] for types
 * - Never use Database['public']['Tables'] for queries
 *
 * @see docs/stack-patterns/supabase-patterns.md
 */

/**
 * Supabase Database Types - Minimal Fallback
 *
 * Auto-generated with limited schema access
 * Project ID: nwmcpfioxerzodvbjigw
 * Generated: 2025-10-23 14:33:04
 *
 * NOTE: This is a minimal type definition.
 * Run 'npm update -g supabase' and retry for full types.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: { [key: string]: any }
        Insert: { [key: string]: any }
        Update: { [key: string]: any }
      }
    }
    Views: {
      // Core view types - update these based on your actual views
      salons: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          created_at: string
          updated_at: string
          [key: string]: any
        }
      }
      appointments: {
        Row: {
          id: string
          salon_id: string
          customer_id: string | null
          staff_id: string | null
          service_id: string | null
          start_time: string
          end_time: string
          status: string
          [key: string]: any
        }
      }
      services: {
        Row: {
          id: string
          salon_id: string
          name: string
          duration: number
          price: number
          [key: string]: any
        }
      }
      staff: {
        Row: {
          id: string
          salon_id: string
          user_id: string
          role: string
          [key: string]: any
        }
      }
      [key: string]: {
        Row: { [key: string]: any }
      }
    }
    Functions: {
      [key: string]: {
        Args: { [key: string]: any }
        Returns: any
      }
    }
    Enums: {
      [key: string]: string
    }
  }
  audit: {
    Tables: { [key: string]: any }
    Views: { [key: string]: any }
  }
  auth: {
    Tables: { [key: string]: any }
    Views: { [key: string]: any }
  }
  organization: {
    Tables: { [key: string]: any }
    Views: { [key: string]: any }
  }
  catalog: {
    Tables: { [key: string]: any }
    Views: { [key: string]: any }
  }
  scheduling: {
    Tables: { [key: string]: any }
    Views: { [key: string]: any }
  }
  identity: {
    Tables: { [key: string]: any }
    Views: { [key: string]: any }
  }
  analytics: {
    Tables: { [key: string]: any }
    Views: { [key: string]: any }
  }
  communication: {
    Tables: { [key: string]: any }
    Views: { [key: string]: any }
  }
  engagement: {
    Tables: { [key: string]: any }
    Views: { [key: string]: any }
  }
  [schema: string]: any
}

// Helper types
export type Tables<_Schema = any, _Table = any> = any
export type Views<_Name = any> = any
export type Enums<_Name = any> = any

// Common types based on your application
export type Salon = any
export type Appointment = any
export type Service = any
export type Staff = any
