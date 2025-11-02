'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

const quarantineSessionSchema = z.object({
  sessionId: z.string().uuid(),
  reason: z.string().min(1).max(500),
})

const requireMfaSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(1).max(500),
})

const evictSessionSchema = z.object({
  sessionId: z.string().uuid(),
  reason: z.string().min(1).max(500),
})

const overrideSeveritySchema = z.object({
  sessionId: z.string().uuid(),
  newRiskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  reason: z.string().min(1).max(500),
})

type SessionSecurityRecord = {
  user_email?: string
  risk_level?: string
  [key: string]: unknown
}

export async function quarantineSession(formData: FormData) {
  const logger = createOperationLogger('quarantineSession', {})
  logger.start()

  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = quarantineSessionSchema.parse({
      sessionId: formData.get('sessionId')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    // Get current record
    const { data: record } = await supabase
      .from('security_session_security_view')
      .select('*')
      .eq('id', validated.sessionId)
      .single()

    if (!record) {
      return { error: 'Session security record not found' }
    }

    const typedRecord = record as SessionSecurityRecord

    // TODO: Database schema doesn't have session_security_events table
    // Mark session as blocked in session_security table instead
    const { error: updateError } = await supabase
      .schema('security')
      .from('session_security')
      .update({
        is_blocked: true,
        suspicious_score: 100, // High score for quarantined sessions
      })
      .eq('session_id', validated.sessionId)

    if (updateError) {
      console.error('Failed to quarantine session:', updateError)
      return { error: 'Failed to quarantine session' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'session_quarantined',
      event_type: 'session_quarantined',
      event_category: 'security',
      severity: 'warning',
      target_schema: 'security',
      target_table: 'session_security',
      user_id: session.user.id,
      metadata: {
        session_id: validated.sessionId,
        user_email: typedRecord.user_email,
        risk_level: typedRecord.risk_level,
        reason: validated.reason,
      },
    })

    revalidatePath('/admin/settings/sessions', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function requireMfaForUser(formData: FormData) {
  const logger = createOperationLogger('requireMfaForUser', {})
  logger.start()

  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = requireMfaSchema.parse({
      userId: formData.get('userId')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    // Get user sessions
    const { data: userSessions } = await supabase
      .from('security_session_security_view')
      .select('*')
      .eq('user_id', validated.userId)

    if (!userSessions || userSessions.length === 0) {
      return { error: 'No sessions found for this user' }
    }

    // TODO: Database schema doesn't have mfa_requirements table
    // Log the MFA requirement via audit log only for now
    console.log('MFA requirement for user:', validated.userId, 'reason:', validated.reason)

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'mfa_required',
      event_type: 'mfa_required',
      event_category: 'security',
      severity: 'high',
      target_schema: 'security',
      target_table: 'session_security',
      user_id: session.user.id,
      metadata: {
        target_user_id: validated.userId,
        session_count: userSessions.length,
        reason: validated.reason,
        required_by: session.user.id,
      },
    })

    revalidatePath('/admin/settings/sessions', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function evictSession(formData: FormData) {
  const logger = createOperationLogger('evictSession', {})
  logger.start()

  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = evictSessionSchema.parse({
      sessionId: formData.get('sessionId')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    // Get current record
    const { data: record } = await supabase
      .from('security_session_security_view')
      .select('*')
      .eq('id', validated.sessionId)
      .single()

    if (!record) {
      return { error: 'Session security record not found' }
    }

    const typedRecord = record as SessionSecurityRecord

    // TODO: Database schema doesn't have 'auth' schema access
    // Delete session from identity schema sessions table instead
    const { error: deleteError } = await supabase
      .schema('identity')
      .from('sessions')
      .delete()
      .eq('id', validated.sessionId)

    if (deleteError) {
      console.error('Failed to evict session:', deleteError)
      return { error: 'Failed to evict session' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'session_evicted',
      event_type: 'session_evicted',
      event_category: 'security',
      severity: 'critical',
      target_schema: 'identity',
      target_table: 'sessions',
      user_id: session.user.id,
      metadata: {
        session_id: validated.sessionId,
        user_email: typedRecord.user_email,
        risk_level: typedRecord.risk_level,
        reason: validated.reason,
      },
    })

    revalidatePath('/admin/settings/sessions', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function overrideSeverity(formData: FormData) {
  const logger = createOperationLogger('overrideSeverity', {})
  logger.start()

  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = overrideSeveritySchema.parse({
      sessionId: formData.get('sessionId')?.toString(),
      newRiskLevel: formData.get('newRiskLevel')?.toString() as
        | 'low'
        | 'medium'
        | 'high'
        | 'critical',
      reason: formData.get('reason')?.toString(),
    })

    // Get current record
    const { data: record } = await supabase
      .from('security_session_security_view')
      .select('*')
      .eq('id', validated.sessionId)
      .single()

    if (!record) {
      return { error: 'Session security record not found' }
    }

    const typedRecord = record as SessionSecurityRecord

    // TODO: Database schema doesn't have session_risk_overrides table
    // Update suspicious_score in session_security table based on risk level
    const riskScoreMap = { low: 10, medium: 40, high: 70, critical: 100 }
    const newScore = riskScoreMap[validated.newRiskLevel]

    const { error: updateError } = await supabase
      .schema('security')
      .from('session_security')
      .update({
        suspicious_score: newScore,
      })
      .eq('session_id', validated.sessionId)

    if (updateError) {
      console.error('Failed to override severity:', updateError)
      return { error: 'Failed to override severity' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'session_severity_override',
      event_type: 'session_severity_override',
      event_category: 'security',
      severity: 'warning',
      target_schema: 'security',
      target_table: 'session_security',
      user_id: session.user.id,
      metadata: {
        session_id: validated.sessionId,
        user_email: typedRecord.user_email,
        old_risk_level: typedRecord.risk_level,
        new_risk_level: validated.newRiskLevel,
        new_suspicious_score: newScore,
        reason: validated.reason,
        overridden_by: session.user.id,
      },
    })

    revalidatePath('/admin/settings/sessions', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
