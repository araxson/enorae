'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

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
  const logger = createOperationLogger('unblockIdentifier', {})
  logger.start()

  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const result = unblockIdentifierSchema.safeParse({
      identifier: formData.get('identifier')?.toString(),
      reason: formData.get('reason')?.toString(),
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { error: firstError ?? 'Validation failed' }
    }

    const validated = result.data

    // Get current record
    const { data: record } = await supabase
      .from('security_rate_limit_tracking_view')
      .select('identifier, endpoint, request_count, blocked_until')
      .eq('identifier', validated.identifier)
      .single()

    if (!record) {
      return { error: 'Rate limit record not found' }
    }

    const nowIso = new Date().toISOString()

    let updateBuilder = supabase
      .schema('security')
      .from('rate_limit_tracking')
      .update({
        blocked_until: null,
        request_count: 0,
        updated_at: nowIso,
      })
      .eq('identifier', validated.identifier)

    const endpoint =
      record && typeof record === 'object' && 'endpoint' in record && typeof record.endpoint === 'string'
        ? record.endpoint
        : null
    if (endpoint) {
      updateBuilder = updateBuilder.eq('endpoint', endpoint)
    }

    const { error: updateError } = await updateBuilder

    if (updateError) {
      console.error('Failed to unblock identifier:', updateError)
      return { error: 'Failed to unblock identifier' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'update',
      target_schema: 'security',
      target_table: 'rate_limit_tracking',
      event_type: 'rate_limit_unblock',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        identifier: validated.identifier,
        reason: validated.reason,
        endpoint,
      },
    })

    revalidatePath('/admin/security-monitoring', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function adjustRateLimit(formData: FormData) {
  const logger = createOperationLogger('adjustRateLimit', {})
  logger.start()

  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const result = adjustLimitSchema.safeParse({
      ruleId: formData.get('ruleId')?.toString(),
      newLimit: Number(formData.get('newLimit')),
      duration: formData.get('duration')?.toString() as
        | '1hour'
        | '1day'
        | '1week'
        | 'permanent',
      reason: formData.get('reason')?.toString(),
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { error: firstError ?? 'Validation failed' }
    }

    const validated = result.data

    // Get current rule
    const { data: rule } = await supabase
      .from('security_rate_limit_rules_view')
      .select('id, endpoint, max_requests, window_seconds, metadata')
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

    const metadata =
      rule && typeof rule === 'object' && rule !== null && 'metadata' in rule && typeof rule.metadata === 'object'
        ? (rule.metadata as Record<string, unknown>)
        : {}

    const updatedMetadata = {
      ...metadata,
      override: {
        newLimit: validated.newLimit,
        expiresAt: expiresAt.toISOString(),
        reason: validated.reason,
        adjustedBy: session.user.id,
        duration: validated.duration,
      },
    }

    const { error: updateError } = await supabase
      .schema('security')
      .from('rate_limit_rules')
      .update({
        max_requests: validated.newLimit,
        updated_at: now.toISOString(),
        updated_by_id: session.user.id,
        metadata: updatedMetadata,
      })
      .eq('id', validated.ruleId)

    if (updateError) {
      console.error('Failed to adjust rate limit:', updateError)
      return { error: 'Failed to adjust rate limit' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'update',
      target_schema: 'security',
      target_table: 'rate_limit_rules',
      event_type: 'rate_limit_adjusted',
      event_category: 'security',
      severity: 'warning',
      user_id: session.user.id,
      metadata: {
        rule_id: validated.ruleId,
        old_limit:
          typeof rule === 'object' && rule !== null && 'max_requests' in rule
            ? Number((rule as Record<string, unknown>)['max_requests'] ?? 0)
            : 0,
        new_limit: validated.newLimit,
        reason: validated.reason,
        duration: validated.duration,
        expires_at: expiresAt.toISOString(),
      },
    })

    revalidatePath('/admin/security-monitoring', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function purgeStaleRecords(formData: FormData) {
  const logger = createOperationLogger('purgeStaleRecords', {})
  logger.start()

  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const result = purgeStaleSchema.safeParse({
      identifier: formData.get('identifier')?.toString(),
      endpoint: formData.get('endpoint')?.toString(),
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { error: firstError ?? 'Validation failed' }
    }

    const validated = result.data

    // Delete stale records (older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    let deleteBuilder = supabase
      .schema('security')
      .from('rate_limit_tracking')
      .delete()
      .eq('identifier', validated.identifier)

    if (validated.endpoint) {
      deleteBuilder = deleteBuilder.eq('endpoint', validated.endpoint)
    }

    const { error: deleteError } = await deleteBuilder.lt('last_request_at', thirtyDaysAgo.toISOString())

    if (deleteError) {
      console.error('Failed to purge stale records:', deleteError)
      return { error: 'Failed to purge records' }
    }

    // Audit log
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'delete',
      target_schema: 'security',
      target_table: 'rate_limit_tracking',
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

    revalidatePath('/admin/security-monitoring', 'page')
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
