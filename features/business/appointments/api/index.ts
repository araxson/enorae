// Barrel export for business appointments API
export * from './mutations'
export * from './schema'
export * from './types'
// Export queries explicitly to avoid duplicate AppointmentWithDetails export
export type {
  AppointmentServiceDetails,
  ServiceOption,
  StaffOption,
  ServiceOptionsResponse,
} from './queries'
export {
  getAppointments,
  getAppointmentsByStatus,
  getAppointmentServices,
  calculateBusinessHours,
  calculateDurationMinutes,
  ServiceOptionSchema,
  StaffOptionSchema,
  ServiceOptionsResponseSchema,
  getUserSalon,
} from './queries'
