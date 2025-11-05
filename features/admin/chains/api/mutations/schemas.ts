import { z } from 'zod'

const CHAIN_SUBSCRIPTION_TIERS = ['free', 'basic', 'premium', 'enterprise'] as const

export const chainIdSchema = z.string().uuid({ message: 'Invalid chain identifier' })

export const verifyChainSchema = z.object({
  chainId: chainIdSchema,
  isVerified: z.boolean(),
  reason: z
    .string()
    .trim()
    .min(10, 'Please provide a reason with at least 10 characters')
    .max(500, 'Reason must be 500 characters or fewer'),
})

export const updateChainActiveStatusSchema = z.object({
  chainId: chainIdSchema,
  isActive: z.boolean(),
  reason: z
    .string()
    .trim()
    .min(10, 'Please provide a reason with at least 10 characters')
    .max(500, 'Reason must be 500 characters or fewer'),
})

export const updateChainSubscriptionSchema = z.object({
  chainId: chainIdSchema,
  subscriptionTier: z.enum(CHAIN_SUBSCRIPTION_TIERS, {
    message: 'Unsupported subscription tier',
  }),
  reason: z
    .string()
    .trim()
    .max(500, 'Reason must be 500 characters or fewer')
    .optional(),
})

export const deleteChainSchema = z.object({
  chainId: chainIdSchema,
  reason: z
    .string()
    .trim()
    .min(10, 'Deletion reason must include at least 10 characters')
    .max(500, 'Deletion reason must be 500 characters or fewer'),
})
