import { z } from 'zod'

export const createRuleSchema = z.object({
  endpoint: z.string().min(1, 'Endpoint is required').max(255),
  limitThreshold: z.number().int().min(1, 'Limit must be at least 1'),
  windowSeconds: z.number().int().min(1, 'Window must be at least 1 second'),
  description: z.string().max(500, 'Description too long'),
})

export const updateRuleSchema = z.object({
  ruleId: z.string().uuid('Invalid rule ID'),
  limitThreshold: z.number().int().min(1).optional(),
  windowSeconds: z.number().int().min(1).optional(),
  description: z.string().max(500).optional(),
})

export const toggleRuleSchema = z.object({
  ruleId: z.string().uuid('Invalid rule ID'),
  active: z.boolean(),
})

export const deleteRuleSchema = z.object({
  ruleId: z.string().uuid('Invalid rule ID'),
})

export type CreateRuleInput = z.infer<typeof createRuleSchema>
export type UpdateRuleInput = z.infer<typeof updateRuleSchema>
export type ToggleRuleInput = z.infer<typeof toggleRuleSchema>
export type DeleteRuleInput = z.infer<typeof deleteRuleSchema>
