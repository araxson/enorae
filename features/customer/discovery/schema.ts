import { z } from 'zod'

export const discoverySchema = z.object({})
export type DiscoverySchema = z.infer<typeof discoverySchema>

export const discoveryPaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional()
})

export const discoveryFilterSchema = z.object({
  category: z.string().optional()
})

export const discoverySearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional()
})
