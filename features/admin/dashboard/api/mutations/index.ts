'use server'

// Re-export all mutation functions
export { verifyUserEmail } from './verify-user-email'
export { approveSalon } from './approve-salon'
export { rejectSalon } from './reject-salon'
export { updateAppointmentStatus } from './update-appointment-status'
export { bulkVerifyUsers } from './bulk-verify-users'

// Re-export types
export type { ActionResponse, AppointmentStatus } from './types'
