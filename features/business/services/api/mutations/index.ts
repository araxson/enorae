/**
 * Service mutations index
 *
 * Exports public API for service mutations. Server-only functions (from shared.ts)
 * are NOT exported - they should be imported directly only by server action files.
 */

export {
  createService,
  type ServiceFormData,
  type ServicePricingData,
  type ServiceBookingRulesData,
} from './create-service'

export { updateService } from './update-service'
export { deleteService } from './delete-service'
export { permanentlyDeleteService } from './permanently-delete-service'
// NOTE: shared.ts is NOT exported - it uses 'server-only'. Import directly in server files.
export * from './create-service-helpers'
export * from './create-service-schemas'

// Server Actions for forms
export { createServiceAction } from './create-service-action'
export { updateServiceAction } from './update-service-action'
export type { FormState } from './action-types'
export * from './action-helpers'
export * from './action-schemas'
