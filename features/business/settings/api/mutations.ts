'use server'

export * from './mutations'

// Direct re-export to help TypeScript resolver
export { updateSalonSettings, toggleAcceptingBookings, toggleFeature } from './mutations/salon'
export { updateBookingRules } from './mutations/booking'
export { updateCancellationPolicy } from './mutations/cancellation'
export { updatePaymentMethods } from './mutations/payment'
