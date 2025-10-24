'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole } from '@/lib/auth/role-guard'
import { ROLE_GROUPS } from '@/lib/auth/constants'

const updateIncidentSchema = z.object({
  incidentId: z.string().uuid(),
  remediationStatus: z.enum(['pending', 'in_progress', 'resolved']),
  notes: z.string().max(500).optional(),
})

const logIncidentSchema = z.object({
  eventType: z.string().min(1).max(100),
  severity: z.enum(['info', 'warning', 'critical']),
  description: z.string().min(1).max(1000),
  impactedResources: z.array(z.string()),
})

export async function updateIncidentStatus(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = updateIncidentSchema.parse({
      incidentId: formData.get('incidentId')?.toString(),
      remediationStatus: formData.get('remediationStatus')?.toString() as
        | 'pending'
        | 'in_progress'
        | 'resolved',
      notes: formData.get('notes')?.toString(),
    })

    const { error } = await supabase
      .schema('audit')
      .from('security_incidents')
      .update({
        remediation_status: validated.remediationStatus,
        resolved_at: validated.remediationStatus === 'resolved' ? new Date().toISOString() : null,
        resolved_by: validated.remediationStatus === 'resolved' ? session.user.id : null,
      })
      .eq('id', validated.incidentId)

    if (error) {
      console.error('Failed to update incident:', error)
      return { error: 'Failed to update incident' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'security_incident_updated',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        incident_id: validated.incidentId,
        new_status: validated.remediationStatus,
        notes: validated.notes,
      },
    })

    revalidatePath('/admin/security/incidents')
    return { success: true }
  } catch (error) {
    console.error('Error updating incident:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function logSecurityIncident(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const resourcesJson = formData.get('impactedResources')?.toString()
    const impactedResources = resourcesJson ? JSON.parse(resourcesJson) : []

    const validated = logIncidentSchema.parse({
      eventType: formData.get('eventType')?.toString(),
      severity: formData.get('severity')?.toString() as 'info' | 'warning' | 'critical',
      description: formData.get('description')?.toString(),
      impactedResources,
    })

    const { error } = await supabase
      .schema('audit')
      .from('security_incidents')
      .insert({
        event_type: validated.eventType,
        severity: validated.severity,
        description: validated.description,
        impacted_resources: validated.impactedResources,
        remediation_status: 'pending',
        logged_by: session.user.id,
        occurred_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Failed to log incident:', error)
      return { error: 'Failed to log incident' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'security_incident_logged',
      event_category: 'security',
      severity: validated.severity,
      user_id: session.user.id,
      metadata: {
        event_type: validated.eventType,
        description: validated.description,
      },
    })

    revalidatePath('/admin/security/incidents')
    return { success: true }
  } catch (error) {
    console.error('Error logging incident:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
