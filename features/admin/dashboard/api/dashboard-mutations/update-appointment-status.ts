'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { logSupabaseError } from '@/lib/supabase/errors'

import { logDashboardAudit } from './audit'
import type { ActionResponse, AppointmentStatus } from './types'
import { VALID_APPOINTMENT_STATUSES } from './validation'

export async function updateAppointmentStatus(
  formData: FormData,
): Promise<ActionResponse> {
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

    // Query the actual table for updates (views are read-only)
    const { data: existingAppointment, error: fetchError } = await supabase
      .schema('scheduling')
      .from('appointments')
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

    revalidatePath('/admin')
    revalidatePath('/admin/appointments')
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update appointment',
    }
  }
}
