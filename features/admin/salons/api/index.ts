// Barrel export for admin salons API
export * from './queries'
export * from './mutations'
// Types are exported from queries/salon-list.ts - avoid duplicate export
export type { AdminSalonRecord, AdminSalonFilter } from './types'
