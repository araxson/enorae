'use server'

export { verifyUserEmail } from './dashboard-mutations/verify-user-email'
export { approveSalon } from './dashboard-mutations/approve-salon'
export { rejectSalon } from './dashboard-mutations/reject-salon'
export { updateAppointmentStatus } from './dashboard-mutations/update-appointment-status'
export { bulkVerifyUsers } from './dashboard-mutations/bulk-verify-users'

export type { ActionResponse, AppointmentStatus } from './dashboard-mutations/types'
