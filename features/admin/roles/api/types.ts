'use server'

import type { Database } from '@/lib/types/database.types'

export type RoleType = Database['public']['Enums']['role_type']

export type RoleValue =
  | 'super_admin'
  | 'platform_admin'
  | 'tenant_owner'
  | 'salon_owner'
  | 'salon_manager'
  | 'senior_staff'
  | 'staff'
  | 'junior_staff'
  | 'customer'
  | 'vip_customer'
  | 'guest'

export type RoleActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
