import type { Database } from '@/lib/types/database.types'

/**
 * Admin salon management types
 */

export type AdminSalon = Database['public']['Views']['admin_salons_overview']['Row']

export interface AdminSalonRecord {}

export interface AdminSalonFilter {}
