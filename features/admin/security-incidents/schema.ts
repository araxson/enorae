import { z } from 'zod'

export const updateIncidentSchema = z.object({
  incidentId: z.string().uuid('Invalid incident ID'),
  remediationStatus: z.enum(['pending', 'in_progress', 'resolved']),
  notes: z.string().max(500).optional(),
})

export const logIncidentSchema = z.object({
  eventType: z.string().min(1).max(100),
  severity: z.enum(['info', 'warning', 'critical']),
  description: z.string().min(1).max(1000),
  impactedResources: z.array(z.string()),
})

export type UpdateIncidentInput = z.infer<typeof updateIncidentSchema>
export type LogIncidentInput = z.infer<typeof logIncidentSchema>
