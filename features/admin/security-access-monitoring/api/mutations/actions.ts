'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

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

type SecurityAccessRecord = {
  user_email?: string
  risk_score?: number
  [key: string]: unknown
}

export async function acknowledgeSecurityAlert(formData: FormData) {
  const logger = createOperationLogger('acknowledgeSecurityAlert', {})
  logger.start()

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

    const typedRecord = record as SecurityAccessRecord

    // Audit log for security alert acknowledgement
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'security_alert_acknowledged',
      event_type: 'security_alert_acknowledged',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      target_schema: 'security',
      target_table: 'access_monitoring',
      target_id: validated.accessId,
      metadata: {
        access_id: validated.accessId,
        user_email: typedRecord.user_email,
        risk_score: typedRecord.risk_score,
      },
    })

    revalidatePath('/admin/security/monitoring', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function dismissSecurityAlert(formData: FormData) {
  const logger = createOperationLogger('dismissSecurityAlert', {})
  logger.start()

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

    const typedRecord = record as SecurityAccessRecord

    // Audit log for security alert dismissal
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'security_alert_dismissed',
      event_type: 'security_alert_dismissed',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      target_schema: 'security',
      target_table: 'access_monitoring',
      target_id: validated.accessId,
      metadata: {
        access_id: validated.accessId,
        user_email: typedRecord.user_email,
        risk_score: typedRecord.risk_score,
      },
    })

    revalidatePath('/admin/security/monitoring', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function suppressSecurityAlert(formData: FormData) {
  const logger = createOperationLogger('suppressSecurityAlert', {})
  logger.start()

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

    const typedRecord = record as SecurityAccessRecord

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

    // Audit log for security alert suppression
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'security_alert_suppressed',
      event_type: 'security_alert_suppressed',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      target_schema: 'security',
      target_table: 'access_monitoring',
      target_id: validated.accessId,
      metadata: {
        access_id: validated.accessId,
        user_email: typedRecord.user_email,
        reason: validated.reason,
        duration: validated.duration,
        expires_at: expiresAt.toISOString(),
      },
    })

    revalidatePath('/admin/security/monitoring', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
