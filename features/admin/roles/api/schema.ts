import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Role names enumeration (built-in roles)
 */
export const roleNameEnum = z.enum([
  'super_admin',
  'admin',
  'salon_owner',
  'salon_manager',
  'staff',
  'customer',
  'guest',
])


/**
 * Permission category enumeration
 */
export const permissionCategoryEnum = z.enum([
  'appointments',
  'customers',
  'services',
  'staff',
  'reports',
  'settings',
  'billing',
  'system',
])


/**
 * Role assignment schema
 * For assigning roles to users
 */
export const roleAssignmentSchema = z.object({
  user_id: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  role_name: roleNameEnum,
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  assigned_by: z.string().regex(UUID_REGEX, 'Invalid assigned by user ID').optional(),
  expires_at: z
    .string()
    .datetime('Invalid datetime format')
    .refine(
      (date) => {
        const expiryDate = new Date(date)
        const now = new Date()
        return expiryDate > now
      },
      {
        message: 'Expiry date must be in the future',
      }
    )
    .optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
})

/**
 * Bulk role assignment schema
 * For assigning the same role to multiple users
 */
export const bulkRoleAssignmentSchema = z.object({
  user_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid user ID'))
    .min(1, 'Select at least one user')
    .max(100, 'Cannot assign roles to more than 100 users at once'),
  role_name: roleNameEnum,
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
})

/**
 * Role revocation schema
 * For removing roles from users
 */
export const roleRevocationSchema = z.object({
  user_id: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  role_name: roleNameEnum,
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)').max(500, 'Reason is too long'),
  revoked_by: z.string().regex(UUID_REGEX, 'Invalid revoked by user ID').optional(),
})

/**
 * Custom role creation schema
 * For creating custom roles with specific permissions
 */
export const customRoleSchema = z.object({
  name: z
    .string()
    .min(3, 'Role name must be at least 3 characters')
    .max(100, 'Role name is too long')
    .regex(/^[a-z_]+$/, 'Role name must be lowercase letters and underscores only')
    .refine(
      (name) => {
        // Ensure not using built-in role names
        const builtInRoles = ['super_admin', 'admin', 'salon_owner', 'salon_manager', 'staff', 'customer', 'guest']
        return !builtInRoles.includes(name)
      },
      {
        message: 'Cannot use built-in role names',
      }
    ),
  display_name: z.string().min(3, 'Display name must be at least 3 characters').max(100, 'Display name is too long'),
  description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
  permissions: z
    .array(z.string().min(1, 'Permission is required'))
    .min(1, 'At least one permission is required')
    .max(100, 'Maximum 100 permissions allowed'),
  is_system_role: z.boolean().default(false),
  is_active: z.boolean().default(true),
  priority: z.coerce
    .number()
    .int('Priority must be a whole number')
    .min(0, 'Priority cannot be negative')
    .max(100, 'Priority too high')
    .default(50),
})

/**
 * Permission update schema
 * For updating permissions for a role
 */
export const permissionUpdateSchema = z.object({
  role_name: z.string().min(1, 'Role name is required'),
  permissions_to_add: z.array(z.string().min(1, 'Permission is required')).max(50, 'Too many permissions').optional(),
  permissions_to_remove: z
    .array(z.string().min(1, 'Permission is required'))
    .max(50, 'Too many permissions')
    .optional(),
}).refine(
  (data) => {
    // Must have at least one of add or remove
    return (
      (data.permissions_to_add && data.permissions_to_add.length > 0) ||
      (data.permissions_to_remove && data.permissions_to_remove.length > 0)
    )
  },
  {
    message: 'Must specify at least one permission to add or remove',
    path: ['permissions_to_add'],
  }
)

/**
 * Role audit search schema
 * For searching role assignment history
 */
export const roleAuditSearchSchema = z.object({
  user_id: z.string().regex(UUID_REGEX, 'Invalid user ID').optional(),
  role_name: roleNameEnum.optional(),
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  action: z.enum(['assigned', 'revoked', 'updated']).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  performed_by: z.string().regex(UUID_REGEX, 'Invalid performed by user ID').optional(),
})


/**
 * Inferred TypeScript types from schemas
 */
export type RoleAssignmentSchema = z.infer<typeof roleAssignmentSchema>
export type BulkRoleAssignmentSchema = z.infer<typeof bulkRoleAssignmentSchema>
export type RoleRevocationSchema = z.infer<typeof roleRevocationSchema>
export type CustomRoleSchema = z.infer<typeof customRoleSchema>
export type PermissionUpdateSchema = z.infer<typeof permissionUpdateSchema>
export type RoleAuditSearchSchema = z.infer<typeof roleAuditSearchSchema>
