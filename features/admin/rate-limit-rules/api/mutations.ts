'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Database } from '@/lib/types/database.types'

const createRuleSchema = z.object({
  ruleName: z.string().min(1).max(255),
  endpoint: z.string().min(1).max(255),
  maxRequests: z.number().int().min(1),
  windowSeconds: z.number().int().min(1),
  appliesTo: z.string().min(1),
  description: z.string().max(500),
})

const updateRuleSchema = z.object({
  ruleId: z.string().uuid(),
  maxRequests: z.number().int().min(1).optional(),
  windowSeconds: z.number().int().min(1).optional(),
  description: z.string().max(500).optional(),
})

const toggleRuleSchema = z.object({
  ruleId: z.string().uuid(),
  isActive: z.boolean(),
})

const deleteRuleSchema = z.object({
  ruleId: z.string().uuid(),
})

export async function createRateLimitRule(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = createRuleSchema.parse({
      ruleName: formData.get('ruleName')?.toString(),
      endpoint: formData.get('endpoint')?.toString(),
      maxRequests: Number(formData.get('maxRequests')),
      windowSeconds: Number(formData.get('windowSeconds')),
      appliesTo: formData.get('appliesTo')?.toString() || 'all',
      description: formData.get('description')?.toString() || '',
    })

    const { data: newRule, error: insertError} = await supabase
      .schema('security')
      .from('rate_limit_rules')
      .insert({
        rule_name: validated.ruleName,
        endpoint: validated.endpoint,
        max_requests: validated.maxRequests,
        window_seconds: validated.windowSeconds,
        applies_to: validated.appliesTo,
        description: validated.description,
        is_active: true,
      })
      .select('id')
      .returns<Pick<Database['security']['Tables']['rate_limit_rules']['Row'], 'id'>[]>()
      .single()

    if (insertError) {
      console.error('Failed to create rate limit rule:', insertError)
      return { error: 'Failed to create rule' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      action: 'rate_limit_rule_created',
      event_type: 'rate_limit_rule_created',
      event_category: 'security',
      target_schema: 'security',
      target_table: 'rate_limit_rules',
      severity: 'info',
      user_id: session.user.id,
      is_success: true,
      metadata: {
        rule_name: validated.ruleName,
        endpoint: validated.endpoint,
        max_requests: validated.maxRequests,
        window_seconds: validated.windowSeconds,
      },
    })

    revalidatePath('/admin/security')
    return { success: true, ruleId: newRule?.id }
  } catch (error) {
    console.error('Error creating rate limit rule:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateRateLimitRule(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = updateRuleSchema.parse({
      ruleId: formData.get('ruleId')?.toString(),
      maxRequests: formData.get('maxRequests')
        ? Number(formData.get('maxRequests'))
        : undefined,
      windowSeconds: formData.get('windowSeconds')
        ? Number(formData.get('windowSeconds'))
        : undefined,
      description: formData.get('description')?.toString(),
    })

    const updatePayload: Record<string, number | string> = {}
    if (validated.maxRequests) updatePayload['max_requests'] = validated.maxRequests
    if (validated.windowSeconds) updatePayload['window_seconds'] = validated.windowSeconds
    if (validated.description) updatePayload['description'] = validated.description

    const { error: updateError } = await supabase
      .schema('security')
      .from('rate_limit_rules')
      .update(updatePayload)
      .eq('id', validated.ruleId)

    if (updateError) {
      console.error('Failed to update rate limit rule:', updateError)
      return { error: 'Failed to update rule' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      action: 'rate_limit_rule_updated',
      event_type: 'rate_limit_rule_updated',
      event_category: 'security',
      target_schema: 'security',
      target_table: 'rate_limit_rules',
      severity: 'info',
      user_id: session.user.id,
      is_success: true,
      metadata: {
        rule_id: validated.ruleId,
        updated_fields: Object.keys(updatePayload),
      },
    })

    revalidatePath('/admin/security')
    return { success: true }
  } catch (error) {
    console.error('Error updating rate limit rule:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function toggleRateLimitRule(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = toggleRuleSchema.parse({
      ruleId: formData.get('ruleId')?.toString(),
      isActive: formData.get('isActive') === 'true',
    })

    const { error: updateError } = await supabase
      .schema('security')
      .from('rate_limit_rules')
      .update({ is_active: validated.isActive })
      .eq('id', validated.ruleId)

    if (updateError) {
      console.error('Failed to toggle rate limit rule:', updateError)
      return { error: 'Failed to toggle rule' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      action: 'rate_limit_rule_toggled',
      event_type: 'rate_limit_rule_toggled',
      event_category: 'security',
      target_schema: 'security',
      target_table: 'rate_limit_rules',
      severity: 'info',
      user_id: session.user.id,
      is_success: true,
      metadata: {
        rule_id: validated.ruleId,
        is_active: validated.isActive,
      },
    })

    revalidatePath('/admin/security')
    return { success: true }
  } catch (error) {
    console.error('Error toggling rate limit rule:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteRateLimitRule(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = deleteRuleSchema.parse({
      ruleId: formData.get('ruleId')?.toString(),
    })

    const { error: deleteError } = await supabase
      .schema('security')
      .from('rate_limit_rules')
      .delete()
      .eq('id', validated.ruleId)

    if (deleteError) {
      console.error('Failed to delete rate limit rule:', deleteError)
      return { error: 'Failed to delete rule' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      action: 'rate_limit_rule_deleted',
      event_type: 'rate_limit_rule_deleted',
      event_category: 'security',
      target_schema: 'security',
      target_table: 'rate_limit_rules',
      severity: 'warning',
      user_id: session.user.id,
      is_success: true,
      metadata: {
        rule_id: validated.ruleId,
      },
    })

    revalidatePath('/admin/security')
    return { success: true }
  } catch (error) {
    console.error('Error deleting rate limit rule:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
