'use server'

import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  contactName: z.string().max(200).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  paymentTerms: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
})

export const updateSupplierSchema = createSupplierSchema.extend({
  id: z.string().regex(UUID_REGEX, 'Invalid supplier ID format'),
})

export const deleteSupplierSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'Invalid supplier ID format'),
})
