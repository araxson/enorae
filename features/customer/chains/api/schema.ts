import { z } from 'zod'

export const chainIdentifierSchema = z.object({
  idOrSlug: z.string().trim().min(1, 'Chain identifier is required').max(120),
})

export type ChainIdentifierInput = z.infer<typeof chainIdentifierSchema>

export const chainLocationSchema = z.object({
  chainId: z.string().uuid('Chain ID must be a valid UUID'),
})

export type ChainLocationInput = z.infer<typeof chainLocationSchema>
