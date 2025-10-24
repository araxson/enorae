'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

const acknowledgeAlertSchema = z.object({
  accessId: z.string().uuid(),
})

const dismissAlertSchema = z.object({
  accessId: z.string().uuid(),
})

const suppressAlertSchema = z.object({
  accessId: z.string().uuid(),
  reason: z.string().min(1).max(500),
  duration: z.enum(['1hour', '1day', '1week', 'permanent']),
})

export async function acknowledgeSecurityAlert(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = acknowledgeAlertSchema.parse({
      accessId: formData.get('accessId')?.toString(),
    })

    // Get current record
    const { data: record } = await supabase
      .from('security_access_monitoring_view')
      .select('*')
      .eq('id', validated.accessId)
      .single()

    if (!record) {
      return { error: 'Security access record not found' }
    }

    // Update acknowledgement status on schema table
    const { error: updateError } = await supabase
      .schema('public')
      .from('security_access_logs')
      .update({
        acknowledgement_status: 'acknowledged',
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: session.user.id,
      })
      .eq('id', validated.accessId)

    if (updateError) {
      console.error('Failed to acknowledge alert:', updateError)
      return { error: 'Failed to acknowledge alert' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'security_alert_acknowledged',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        access_id: validated.accessId,
        user_email: (record as any).user_email,
        risk_score: (record as any).risk_score,
      },
    })

    revalidatePath('/admin/security/monitoring')
    return { success: true }
  } catch (error) {
    console.error('Error acknowledging alert:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function dismissSecurityAlert(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = dismissAlertSchema.parse({
      accessId: formData.get('accessId')?.toString(),
    })

    // Get current record
    const { data: record } = await supabase
      .from('security_access_monitoring_view')
      .select('*')
      .eq('id', validated.accessId)
      .single()

    if (!record) {
      return { error: 'Security access record not found' }
    }

    // Update status on schema table
    const { error: updateError } = await supabase
      .schema('public')
      .from('security_access_logs')
      .update({
        acknowledgement_status: 'dismissed',
      })
      .eq('id', validated.accessId)

    if (updateError) {
      console.error('Failed to dismiss alert:', updateError)
      return { error: 'Failed to dismiss alert' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'security_alert_dismissed',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        access_id: validated.accessId,
        user_email: (record as any).user_email,
        risk_score: (record as any).risk_score,
      },
    })

    revalidatePath('/admin/security/monitoring')
    return { success: true }
  } catch (error) {
    console.error('Error dismissing alert:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function suppressSecurityAlert(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = suppressAlertSchema.parse({
      accessId: formData.get('accessId')?.toString(),
      reason: formData.get('reason')?.toString(),
      duration: formData.get('duration')?.toString() as
        | '1hour'
        | '1day'
        | '1week'
        | 'permanent',
    })

    // Get current record
    const { data: record } = await supabase
      .from('security_access_monitoring_view')
      .select('*')
      .eq('id', validated.accessId)
      .single()

    if (!record) {
      return { error: 'Security access record not found' }
    }

    // Calculate suppression expiry
    const now = new Date()
    let expiresAt: Date
    switch (validated.duration) {
      case '1hour':
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000)
        break
      case '1day':
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        break
      case '1week':
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case 'permanent':
        expiresAt = new Date('2099-12-31')
        break
    }

    // Create suppression record
    const { error: insertError } = await supabase
      .schema('public')
      .from('security_alert_suppressions')
      .insert({
        access_log_id: validated.accessId,
        reason: validated.reason,
        suppressed_by: session.user.id,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Failed to suppress alert:', insertError)
      return { error: 'Failed to suppress alert' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'security_alert_suppressed',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        access_id: validated.accessId,
        user_email: (record as any).user_email,
        reason: validated.reason,
        duration: validated.duration,
      },
    })

    revalidatePath('/admin/security/monitoring')
    return { success: true }
  } catch (error) {
    console.error('Error suppressing alert:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
