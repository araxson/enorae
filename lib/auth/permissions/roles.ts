import type { Database } from '@/lib/types/database.types'

export type RoleType = Database['public']['Enums']['role_type']

export const ROLE_HIERARCHY: Record<string, string[]> = {
  super_admin: ['/admin', '/business', '/staff', '/customer', '/profile', '/book'],
  platform_admin: ['/admin', '/business', '/staff', '/customer', '/profile'],
  tenant_owner: ['/business', '/staff', '/profile'],
  salon_owner: ['/business', '/staff', '/profile'],
  salon_manager: ['/business', '/profile'],
  senior_staff: ['/staff', '/profile', '/book'],
  staff: ['/staff', '/profile', '/book'],
  junior_staff: ['/staff', '/profile'],
  vip_customer: ['/customer', '/profile', '/book'],
  customer: ['/customer', '/profile', '/book'],
  guest: ['/customer', '/book'],
} as const

export const DEFAULT_ROUTES: Record<string, string> = {
  super_admin: '/admin',
  platform_admin: '/admin',
  tenant_owner: '/business',
  salon_owner: '/business',
  salon_manager: '/business',
  senior_staff: '/staff',
  staff: '/staff',
  junior_staff: '/staff',
  vip_customer: '/customer',
  customer: '/customer',
  guest: '/explore',
} as const

export const ROLE_GROUPS = {
  PLATFORM_ADMINS: ['super_admin', 'platform_admin'] as RoleType[],
  BUSINESS_USERS: ['tenant_owner', 'salon_owner', 'salon_manager'] as RoleType[],
  STAFF_USERS: ['senior_staff', 'staff', 'junior_staff'] as RoleType[],
  CUSTOMER_USERS: ['vip_customer', 'customer', 'guest'] as RoleType[],
  SALON_MANAGERS: ['salon_owner', 'salon_manager'] as RoleType[],
  ALL_STAFF: ['senior_staff', 'staff', 'junior_staff', 'salon_owner', 'salon_manager'] as RoleType[],
} as const
