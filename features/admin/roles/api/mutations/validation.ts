
import { z } from 'zod'

import type { RoleType } from '../../api/types'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const roleSchema = z.enum([
  'super_admin',
  'platform_admin',
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
  'customer',
  'vip_customer',
  'guest',
])

export const assignmentSchema = z.object({
  userId: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  role: roleSchema,
  salonId: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  permissions: z.array(z.string()).max(25).optional(),
})

export const bulkSchema = z.array(assignmentSchema).min(1).max(50)

export const ROLES_NEEDING_SALON: RoleType[] = [
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
]
