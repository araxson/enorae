import { z } from 'zod'

/**
 * Validation schema for creating a new staff member
 */
export const createStaffSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name too long'),
  title: z.string().max(100, 'Title too long').optional(),
  bio: z.string().max(1000, 'Bio too long').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
  experience_years: z.number().int().min(0, 'Experience years must be non-negative').max(100, 'Experience years must be realistic').optional(),
})

/**
 * Validation schema for updating an existing staff member
 */
export const updateStaffSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name too long').optional(),
  title: z.string().max(100, 'Title too long').optional(),
  bio: z.string().max(1000, 'Bio too long').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
  experience_years: z.number().int().min(0, 'Experience years must be non-negative').max(100, 'Experience years must be realistic').optional(),
})

// Aliases for backwards compatibility
export const createStaffMemberSchema = createStaffSchema
export const updateStaffMemberSchema = updateStaffSchema

export const staffSchema = z.object({})
export type StaffSchema = z.infer<typeof staffSchema>
export type CreateStaffSchema = z.infer<typeof createStaffSchema>
export type UpdateStaffSchema = z.infer<typeof updateStaffSchema>

// Type exports - aliases for backwards compatibility
export type CreateStaffMemberInput = CreateStaffSchema
export type UpdateStaffMemberInput = UpdateStaffSchema
