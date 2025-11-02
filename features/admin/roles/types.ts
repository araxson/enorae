'use server'

import type { Database } from '@/lib/types/database.types'

export type RoleType = Database['public']['Enums']['role_type']

export type RoleActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
