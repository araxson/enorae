'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { logSupabaseError } from '@/lib/supabase/errors'

import { logDashboardAudit } from './audit'
import type { ActionResponse, AppointmentStatus } from '../../api/types'
import { VALID_APPOINTMENT_STATUSES } from './validation'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function updateAppointmentStatus(
  formData: FormData,
): Promise<ActionResponse> {
  const logger = createOperationLogger('updateAppointmentStatus', {})
  logger.start()

  try {
    const appointmentId = formData.get('appointmentId')?.toString()
    const status = formData.get('status')?.toString().trim() as AppointmentStatus | undefined

    if (!appointmentId || !status) {
      return { success: false, error: 'Appointment ID and status required' }
    }

    if (!VALID_APPOINTMENT_STATUSES.includes(status)) {
      return { success: false, error: 'Invalid status' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    // Query the appointment view for reading (appointment updates use schema table)
    const { data: existingAppointment, error: fetchError } = await supabase
      .from('appointments_view')
      .select('status')
      .eq('id', appointmentId)
      .maybeSingle()

    if (fetchError) {
      logSupabaseError('updateAppointmentStatus:fetch', fetchError)
      return { success: false, error: fetchError.message }
    }

    const { error } = await supabase
      .schema('scheduling')
      .from('appointments')
      .update({
        status,
        updated_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', appointmentId)

    if (error) {
      logSupabaseError('updateAppointmentStatus', error)
      return { success: false, error: error.message }
    }

    await logDashboardAudit(supabase, session.user.id, 'appointment_status_overridden', 'warning', {
      entity_id: appointmentId,
      previous_status: existingAppointment?.status ?? null,
      new_status: status,
    })

    revalidatePath('/admin', 'layout')
    revalidatePath('/admin/appointments', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update appointment',
    }
  }
}
