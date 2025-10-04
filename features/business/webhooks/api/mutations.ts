'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Retry a failed webhook
 */
export async function retryWebhook(webhookId: string): Promise<ActionResponse> {
  try {
    if (!UUID_REGEX.test(webhookId)) {
      return { success: false, error: 'Invalid webhook ID format' }
    }

    const supabase = await createClient()

    // Auth check
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Get user's salon
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    // Get webhook to verify it exists and check status
    const { data: webhook } = await supabase
      .from('webhook_queue')
      .select('id, status')
      .eq('id', webhookId)
      .single<{ id: string; status: string | null }>()

    if (!webhook) {
      return { success: false, error: 'Webhook not found' }
    }

    // Only retry failed webhooks
    if (webhook.status !== 'failed') {
      return { success: false, error: 'Can only retry failed webhooks' }
    }

    // Reset status to pending for retry
    const { error } = await supabase
      .schema('communication')
      .from('webhook_queue')
      .update({
        status: 'pending',
        last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', webhookId)

    if (error) throw error

    revalidatePath('/business/settings/webhooks')

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error retrying webhook:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retry webhook',
    }
  }
}

/**
 * Delete a webhook entry
 */
export async function deleteWebhook(webhookId: string): Promise<ActionResponse> {
  try {
    if (!UUID_REGEX.test(webhookId)) {
      return { success: false, error: 'Invalid webhook ID format' }
    }

    const supabase = await createClient()

    // Auth check
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Get user's salon
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    // Verify webhook exists
    const { data: webhook } = await supabase
      .from('webhook_queue')
      .select('id')
      .eq('id', webhookId)
      .single()

    if (!webhook) {
      return { success: false, error: 'Webhook not found' }
    }

    // Delete the webhook
    const { error } = await supabase
      .schema('communication')
      .from('webhook_queue')
      .delete()
      .eq('id', webhookId)

    if (error) throw error

    revalidatePath('/business/settings/webhooks')

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error deleting webhook:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete webhook',
    }
  }
}

/**
 * Retry all failed webhooks for the salon
 */
export async function retryAllFailedWebhooks(): Promise<ActionResponse<{ count: number }>> {
  try {
    const supabase = await createClient()

    // Auth check
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Get user's salon
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    // Reset all failed webhooks to pending
    const { error, count } = await supabase
      .schema('communication')
      .from('webhook_queue')
      .update({
        status: 'pending',
        last_error: null,
        updated_at: new Date().toISOString(),
      }, { count: 'exact' })
      .eq('status', 'failed')

    if (error) throw error

    revalidatePath('/business/settings/webhooks')

    return {
      success: true,
      data: { count: count || 0 }
    }
  } catch (error) {
    console.error('Error retrying webhooks:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retry webhooks',
    }
  }
}

/**
 * Clear completed webhooks (older than 30 days)
 */
export async function clearCompletedWebhooks(): Promise<ActionResponse<{ count: number }>> {
  try {
    const supabase = await createClient()

    // Auth check
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Get user's salon
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { success: false, error: 'User salon not found' }
    }

    // Delete completed webhooks older than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { error, count } = await supabase
      .schema('communication')
      .from('webhook_queue')
      .delete({ count: 'exact' })
      .eq('status', 'sent')
      .lt('completed_at', thirtyDaysAgo.toISOString())

    if (error) throw error

    revalidatePath('/business/settings/webhooks')

    return {
      success: true,
      data: { count: count || 0 }
    }
  } catch (error) {
    console.error('Error clearing webhooks:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear webhooks',
    }
  }
}
