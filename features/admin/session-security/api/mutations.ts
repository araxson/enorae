'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

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

    // Mark session as quarantined
    const { error: updateError } = await supabase
      .schema('public')
      .from('session_security_events')
      .insert({
        session_id: validated.sessionId,
        event_type: 'quarantine',
        severity: 'high',
        details: {
          reason: validated.reason,
          quarantined_by: session.user.id,
        },
      })

    if (updateError) {
      console.error('Failed to quarantine session:', updateError)
      return { error: 'Failed to quarantine session' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'session_quarantined',
      event_category: 'security',
      severity: 'warning',
      user_id: session.user.id,
      metadata: {
        session_id: validated.sessionId,
        user_email: typedRecord.user_email,
        risk_level: typedRecord.risk_level,
        reason: validated.reason,
      },
    })

    revalidatePath('/admin/settings/sessions')
    return { success: true }
  } catch (error) {
    console.error('Error quarantining session:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function requireMfaForUser(formData: FormData) {
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

    // Create MFA requirement record
    const { error: insertError } = await supabase
      .schema('public')
      .from('mfa_requirements')
      .insert({
        user_id: validated.userId,
        required_by: session.user.id,
        reason: validated.reason,
        created_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('Failed to require MFA:', insertError)
      return { error: 'Failed to require MFA' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'mfa_required',
      event_category: 'security',
      severity: 'high',
      user_id: session.user.id,
      metadata: {
        user_id: validated.userId,
        session_count: userSessions.length,
        reason: validated.reason,
      },
    })

    revalidatePath('/admin/settings/sessions')
    return { success: true }
  } catch (error) {
    console.error('Error requiring MFA:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function evictSession(formData: FormData) {
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

    // Delete session from Supabase auth
    const { error: deleteError } = await supabase
      .schema('auth')
      .from('sessions')
      .delete()
      .eq('id', validated.sessionId)

    if (deleteError) {
      console.error('Failed to evict session:', deleteError)
      return { error: 'Failed to evict session' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'session_evicted',
      event_category: 'security',
      severity: 'critical',
      user_id: session.user.id,
      metadata: {
        session_id: validated.sessionId,
        user_email: typedRecord.user_email,
        risk_level: typedRecord.risk_level,
        reason: validated.reason,
      },
    })

    revalidatePath('/admin/settings/sessions')
    return { success: true }
  } catch (error) {
    console.error('Error evicting session:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function overrideSeverity(formData: FormData) {
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

    // Update risk level
    const { error: updateError } = await supabase
      .schema('public')
      .from('session_risk_overrides')
      .insert({
        session_id: validated.sessionId,
        original_risk_level: typedRecord.risk_level,
        override_risk_level: validated.newRiskLevel,
        overridden_by: session.user.id,
        reason: validated.reason,
        created_at: new Date().toISOString(),
      })

    if (updateError) {
      console.error('Failed to override severity:', updateError)
      return { error: 'Failed to override severity' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'session_severity_override',
      event_category: 'security',
      severity: 'warning',
      user_id: session.user.id,
      metadata: {
        session_id: validated.sessionId,
        user_email: typedRecord.user_email,
        old_risk_level: typedRecord.risk_level,
        new_risk_level: validated.newRiskLevel,
        reason: validated.reason,
      },
    })

    revalidatePath('/admin/settings/sessions')
    return { success: true }
  } catch (error) {
    console.error('Error overriding severity:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
