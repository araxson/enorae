'use server'

import { z } from 'zod'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const updateSalonSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  businessName: z.string().max(200).optional(),
  businessType: z.string().optional(),
})

export const updateSettingsSchema = z.object({
  subscriptionTier: z.string().optional(),
  isAcceptingBookings: z.boolean().optional(),
  maxStaff: z.number().int().min(1).optional(),
  maxServices: z.number().int().min(1).optional(),
})
