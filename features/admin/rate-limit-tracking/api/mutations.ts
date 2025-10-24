'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

const unblockIdentifierSchema = z.object({
  identifier: z.string().min(1),
  reason: z.string().min(1).max(500),
})

const adjustLimitSchema = z.object({
  ruleId: z.string().uuid(),
  newLimit: z.number().int().min(1),
  duration: z.enum(['1hour', '1day', '1week', 'permanent']),
  reason: z.string().min(1).max(500),
})

const purgeStaleSchema = z.object({
  identifier: z.string().min(1),
  endpoint: z.string().min(1),
})

export async function unblockIdentifier(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = unblockIdentifierSchema.parse({
      identifier: formData.get('identifier')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    // Get current record
    const { data: record } = await supabase
      .from('security_rate_limit_tracking_view')
      .select('*')
      .eq('identifier', validated.identifier)
      .single()

    if (!record) {
      return { error: 'Rate limit record not found' }
    }

    // Reset the counter on schema table
    const { error: updateError } = await supabase
      .schema('public')
      .from('rate_limit_tracking')
      .update({
        current_count: 0,
        last_reset_by: session.user.id,
        last_reset_at: new Date().toISOString(),
      })
      .eq('identifier', validated.identifier)

    if (updateError) {
      console.error('Failed to unblock identifier:', updateError)
      return { error: 'Failed to unblock identifier' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'rate_limit_unblock',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        identifier: validated.identifier,
        reason: validated.reason,
        endpoint: (record as any).endpoint,
      },
    })

    revalidatePath('/admin/security-monitoring')
    return { success: true }
  } catch (error) {
    console.error('Error unblocking identifier:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function adjustRateLimit(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = adjustLimitSchema.parse({
      ruleId: formData.get('ruleId')?.toString(),
      newLimit: Number(formData.get('newLimit')),
      duration: formData.get('duration')?.toString() as
        | '1hour'
        | '1day'
        | '1week'
        | 'permanent',
      reason: formData.get('reason')?.toString(),
    })

    // Get current rule
    const { data: rule } = await supabase
      .from('security_rate_limit_rules_view')
      .select('*')
      .eq('id', validated.ruleId)
      .single()

    if (!rule) {
      return { error: 'Rate limit rule not found' }
    }

    // Calculate adjustment expiry
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

    // Create temporary adjustment record
    const { error: insertError } = await supabase
      .schema('public')
      .from('rate_limit_adjustments')
      .insert({
        rule_id: validated.ruleId,
        adjusted_limit: validated.newLimit,
        adjusted_by: session.user.id,
        reason: validated.reason,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Failed to adjust rate limit:', insertError)
      return { error: 'Failed to adjust rate limit' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'rate_limit_adjusted',
      event_category: 'security',
      severity: 'warning',
      user_id: session.user.id,
      metadata: {
        rule_id: validated.ruleId,
        old_limit: (rule as any).limit_threshold,
        new_limit: validated.newLimit,
        reason: validated.reason,
        duration: validated.duration,
      },
    })

    revalidatePath('/admin/security-monitoring')
    return { success: true }
  } catch (error) {
    console.error('Error adjusting rate limit:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function purgeStaleRecords(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = purgeStaleSchema.parse({
      identifier: formData.get('identifier')?.toString(),
      endpoint: formData.get('endpoint')?.toString(),
    })

    // Delete stale records (older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { error: deleteError } = await supabase
      .schema('public')
      .from('rate_limit_tracking')
      .delete()
      .eq('identifier', validated.identifier)
      .eq('endpoint', validated.endpoint)
      .lt('last_attempt', thirtyDaysAgo.toISOString())

    if (deleteError) {
      console.error('Failed to purge stale records:', deleteError)
      return { error: 'Failed to purge records' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'rate_limit_purge',
      event_category: 'maintenance',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        identifier: validated.identifier,
        endpoint: validated.endpoint,
        purged_before: thirtyDaysAgo.toISOString(),
      },
    })

    revalidatePath('/admin/security-monitoring')
    return { success: true }
  } catch (error) {
    console.error('Error purging stale records:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
