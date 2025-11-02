import 'server-only'

import { createOperationLogger } from '@/lib/observability'
import {
  checkAppointmentConflict as sharedCheckAppointmentConflict,
  checkStaffAvailability as sharedCheckStaffAvailability,
} from '@/features/shared/appointments/api/queries'

export async function checkStaffAvailability(
  staffId: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Promise<boolean> {
  const logger = createOperationLogger('checkStaffAvailability', {})
  logger.start()

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
