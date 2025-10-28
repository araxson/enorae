// Re-export all queries
export * from './appointments'
export * from './business-hours'
export * from './appointment-services'
export * from './service-options'

// Re-export getUserSalon from shared location
export { getUserSalon } from '@/features/business/business-common/api/queries'
