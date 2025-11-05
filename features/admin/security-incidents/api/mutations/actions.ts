'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

const updateIncidentSchema = z.object({
  incidentId: z.string().uuid(),
  remediationStatus: z.enum(['pending', 'in_progress', 'resolved']),
  notes: z.string().max(500).optional(),
})

const impactedResourcesSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return []
  }
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}, z.array(z.string()))

const logIncidentSchema = z.object({
  eventType: z.string().min(1).max(100),
  severity: z.enum(['info', 'warning', 'critical']),
  description: z.string().min(1).max(1000),
  impactedResources: impactedResourcesSchema.default([]),
})

export async function updateIncidentStatus(formData: FormData): Promise<{ success: true } | { error: string }> {
  const logger = createOperationLogger('updateIncidentStatus', {})
  logger.start()

  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const result = updateIncidentSchema.safeParse({
      incidentId: formData.get('incidentId')?.toString(),
      remediationStatus: formData.get('remediationStatus')?.toString() as
        | 'pending'
        | 'in_progress'
        | 'resolved',
      notes: formData.get('notes')?.toString(),
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { error: firstError ?? 'Validation failed' }
    }

    const validated = result.data

    // Log the incident update
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'security_incident_updated',
      event_type: 'security_incident_updated',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      target_schema: 'audit',
      target_table: 'security_incidents',
      target_id: validated.incidentId,
      metadata: {
        incident_id: validated.incidentId,
        new_status: validated.remediationStatus,
        notes: validated.notes,
      },
    })

    revalidatePath('/admin/security/incidents', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function logSecurityIncident(formData: FormData): Promise<{ success: true } | { error: string; fieldErrors?: Record<string, string[]> }> {
  const logger = createOperationLogger('logSecurityIncident', {})
  logger.start()

  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validationResult = logIncidentSchema.safeParse({
      eventType: formData.get('eventType')?.toString(),
      severity: formData.get('severity')?.toString() as 'info' | 'warning' | 'critical',
      description: formData.get('description')?.toString(),
      impactedResources: formData.get('impactedResources')?.toString(),
    })

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      const message = firstError ?? 'Invalid incident payload submitted'
      console.error('[AdminSecurityIncidents] Validation failed', validationResult.error)
      return { error: message, fieldErrors }
    }

    const validated = validationResult.data

    // Log the security incident
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'security_incident_logged',
      event_type: 'security_incident_logged',
      event_category: 'security',
      severity: validated.severity,
      user_id: session.user.id,
      target_schema: 'audit',
      target_table: 'audit_logs',
      metadata: {
        event_type: validated.eventType,
        description: validated.description,
        impacted_resources: validated.impactedResources,
      },
    })

    revalidatePath('/admin/security/incidents', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
