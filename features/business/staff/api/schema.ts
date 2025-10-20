import { z } from 'zod'

/**
 * Schema for staff ID validation
 * Enforces valid UUID format
 */
export const staffIdSchema = z.string().uuid('Invalid staff ID format')

/**
 * Schema for email validation
 */
const emailSchema = z.string().email('Invalid email address')

/**
 * Schema for full name validation
 */
const fullNameSchema = z
  .string()
  .min(1, 'Full name is required')
  .max(100, 'Full name must not exceed 100 characters')

/**
 * Schema for title validation
 */
const titleSchema = z
  .string()
  .max(100, 'Title must not exceed 100 characters')
  .optional()

/**
 * Schema for bio validation
 */
const bioSchema = z
  .string()
  .max(500, 'Bio must not exceed 500 characters')
  .optional()

/**
 * Schema for phone validation
 */
const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
  .min(7, 'Phone number must be at least 7 characters')
  .max(20, 'Phone number must not exceed 20 characters')
  .optional()

/**
 * Schema for experience years validation
 */
const experienceYearsSchema = z
  .number()
  .int('Experience years must be a whole number')
  .min(0, 'Experience years cannot be negative')
  .max(70, 'Experience years must not exceed 70')
  .optional()

/**
 * Schema for creating a new staff member
 */
export const createStaffMemberSchema = z.object({
  email: emailSchema,
  full_name: fullNameSchema,
  title: titleSchema,
  bio: bioSchema,
  phone: phoneSchema,
  experience_years: experienceYearsSchema,
})

/**
 * Schema for updating an existing staff member
 * All fields are optional for partial updates
 */
export const updateStaffMemberSchema = z.object({
  staffId: staffIdSchema,
  email: emailSchema.optional(),
  full_name: fullNameSchema.optional(),
  title: titleSchema,
  bio: bioSchema,
  phone: phoneSchema,
  experience_years: experienceYearsSchema,
})

/**
 * Schema for deactivating/reactivating staff member
 */
export const staffActionSchema = z.object({
  staffId: staffIdSchema,
})

/**
 * Type exports for mutations
 */
export type CreateStaffMemberInput = z.infer<typeof createStaffMemberSchema>
export type UpdateStaffMemberInput = z.infer<typeof updateStaffMemberSchema>
export type StaffActionInput = z.infer<typeof staffActionSchema>
