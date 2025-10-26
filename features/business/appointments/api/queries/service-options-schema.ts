/**
 * API_INTEGRATION_FIX: Response validation schemas for service options API
 *
 * Validates API responses to ensure type safety and contract compliance
 */

import { z } from 'zod'

export const ServiceOptionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export const StaffOptionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export const ServiceOptionsResponseSchema = z.object({
  services: z.array(ServiceOptionSchema).optional(),
  staff: z.array(StaffOptionSchema).optional(),
})

export type ServiceOption = z.infer<typeof ServiceOptionSchema>
export type StaffOption = z.infer<typeof StaffOptionSchema>
export type ServiceOptionsResponse = z.infer<typeof ServiceOptionsResponseSchema>
