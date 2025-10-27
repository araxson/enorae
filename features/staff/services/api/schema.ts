import { z } from 'zod'

/**
 * Schema for staff service ID validation
 * Enforces valid UUID format
 */
export const staffServiceIdSchema = z.string().uuid('Invalid staff service ID format')

/**
 * Schema for service ID validation
 * Enforces valid UUID format
 */
export const serviceIdSchema = z.string().uuid('Invalid service ID format')

/**
 * Schema for proficiency level
 * Must be one of the defined levels
 */
export const proficiencyLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert'])

/**
 * Schema for toggling service availability
 */
export const toggleServiceAvailabilitySchema = z.object({
  staffServiceId: staffServiceIdSchema,
  isAvailable: z.boolean(),
})

/**
 * Schema for updating service proficiency
 */
export const updateServiceProficiencySchema = z.object({
  staffServiceId: staffServiceIdSchema,
  proficiencyLevel: proficiencyLevelSchema,
})

/**
 * Schema for requesting service addition
 */
export const requestServiceAdditionSchema = z.object({
  serviceId: serviceIdSchema,
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
})

/**
 * Type exports for mutations
 */
export type ToggleServiceAvailabilityInput = z.infer<typeof toggleServiceAvailabilitySchema>
export type UpdateServiceProficiencyInput = z.infer<typeof updateServiceProficiencySchema>
export type RequestServiceAdditionInput = z.infer<typeof requestServiceAdditionSchema>
