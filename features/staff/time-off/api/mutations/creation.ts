'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { requestSchema } from './schemas'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

type TimeOffRequestInsert = Database['scheduling']['Tables']['time_off_requests']['Insert']

export async function createTimeOffRequest(formData: FormData) {
  const logger = createOperationLogger('createTimeOffRequest', {})
  logger.start()

  try {
    const result = requestSchema.safeParse({
      staffId: formData.get('staffId'),
      startAt: formData.get('startAt'),
      endAt: formData.get('endAt'),
      requestType: formData.get('requestType'),
      reason: formData.get('reason'),
      isAutoReschedule: formData.get('isAutoReschedule') === 'true',
      isNotifyCustomers: formData.get('isNotifyCustomers') === 'true',
    })

    if (!result.success) {
      return {
        error: 'Validation failed. Please check your input.',
        fieldErrors: result.error.flatten().fieldErrors
      }
    }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    const insertPayload: TimeOffRequestInsert = {
      salon_id: staffProfile.salon_id,
      staff_id: data.staffId,
      start_at: data.startAt,
      end_at: data.endAt,
      request_type: data.requestType,
      reason: data.reason || null,
      status: 'pending',
      is_auto_reschedule: data.isAutoReschedule || false,
      is_notify_customers: data.isNotifyCustomers || false,
      created_by_id: user.id,
      updated_by_id: user.id,
      updated_at: new Date().toISOString(),
    }

    const { error: insertError } = await supabase
      .schema('scheduling')
      .from('time_off_requests')
      .insert<TimeOffRequestInsert>(insertPayload)

    if (insertError) return { error: insertError.message }

    revalidatePath('/business/time-off', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create request' }
  }
}
