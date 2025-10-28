import 'server-only'

import {
  checkAppointmentConflict as sharedCheckAppointmentConflict,
  checkStaffAvailability as sharedCheckStaffAvailability,
} from '@/features/shared/appointments/api/queries/availability'

export async function checkStaffAvailability(
  staffId: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Promise<boolean> {
  const result = await sharedCheckStaffAvailability({
    staffId,
    startTime,
    endTime,
    excludeAppointmentId,
  })

  return result.available
}

export async function checkAppointmentConflict(
  salonId: string,
  staffId: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Promise<boolean> {
  const conflicts = await sharedCheckAppointmentConflict({
    salonId,
    staffId,
    startTime,
    endTime,
    excludeAppointmentId,
  })

  return conflicts.hasConflict
}
