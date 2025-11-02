// Re-export all queries
export * from './appointments'
export * from './business-hours'
export * from './appointment-services'
export * from './service-options'
// Export only schemas from service-options-schema (types are exported from service-options)
export { ServiceOptionSchema, StaffOptionSchema, ServiceOptionsResponseSchema, type ServiceOptionsResponse } from './service-options-schema'

// Re-export getUserSalon from shared location
export { getUserSalon } from '@/features/business/business-common/api/queries'
