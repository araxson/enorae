'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole } from '@/lib/auth/role-guard'
import { ROLE_GROUPS } from '@/lib/auth/constants'

const createRuleSchema = z.object({
  endpoint: z.string().min(1).max(255),
  limitThreshold: z.number().int().min(1),
  windowSeconds: z.number().int().min(1),
  description: z.string().max(500),
})

const updateRuleSchema = z.object({
  ruleId: z.string().uuid(),
  limitThreshold: z.number().int().min(1).optional(),
  windowSeconds: z.number().int().min(1).optional(),
  description: z.string().max(500).optional(),
})

const toggleRuleSchema = z.object({
  ruleId: z.string().uuid(),
  active: z.boolean(),
})

const deleteRuleSchema = z.object({
  ruleId: z.string().uuid(),
})

export async function createRateLimitRule(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = createRuleSchema.parse({
      endpoint: formData.get('endpoint')?.toString(),
      limitThreshold: Number(formData.get('limitThreshold')),
      windowSeconds: Number(formData.get('windowSeconds')),
      description: formData.get('description')?.toString() || '',
    })

    const { data: newRule, error: insertError } = await supabase
      .schema('public')
      .from('rate_limit_rules')
      .insert({
        endpoint: validated.endpoint,
        limit_threshold: validated.limitThreshold,
        window_seconds: validated.windowSeconds,
        description: validated.description,
        active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create rate limit rule:', insertError)
      return { error: 'Failed to create rule' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'rate_limit_rule_created',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        endpoint: validated.endpoint,
        limit_threshold: validated.limitThreshold,
        window_seconds: validated.windowSeconds,
      },
    })

    revalidatePath('/admin/security')
    return { success: true, ruleId: (newRule as any)?.id }
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
      limitThreshold: formData.get('limitThreshold')
        ? Number(formData.get('limitThreshold'))
        : undefined,
      windowSeconds: formData.get('windowSeconds')
        ? Number(formData.get('windowSeconds'))
        : undefined,
      description: formData.get('description')?.toString(),
    })

    const updatePayload: any = {}
    if (validated.limitThreshold) updatePayload.limit_threshold = validated.limitThreshold
    if (validated.windowSeconds) updatePayload.window_seconds = validated.windowSeconds
    if (validated.description) updatePayload.description = validated.description

    const { error: updateError } = await supabase
      .schema('public')
      .from('rate_limit_rules')
      .update(updatePayload)
      .eq('id', validated.ruleId)

    if (updateError) {
      console.error('Failed to update rate limit rule:', updateError)
      return { error: 'Failed to update rule' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'rate_limit_rule_updated',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
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
      active: formData.get('active') === 'true',
    })

    const { error: updateError } = await supabase
      .schema('public')
      .from('rate_limit_rules')
      .update({ active: validated.active })
      .eq('id', validated.ruleId)

    if (updateError) {
      console.error('Failed to toggle rate limit rule:', updateError)
      return { error: 'Failed to toggle rule' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'rate_limit_rule_toggled',
      event_category: 'security',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        rule_id: validated.ruleId,
        active: validated.active,
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
      .schema('public')
      .from('rate_limit_rules')
      .delete()
      .eq('id', validated.ruleId)

    if (deleteError) {
      console.error('Failed to delete rate limit rule:', deleteError)
      return { error: 'Failed to delete rule' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'rate_limit_rule_deleted',
      event_category: 'security',
      severity: 'warning',
      user_id: session.user.id,
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
