/**
 * Role management mutations - Public API
 *
 * NOTE: This file does NOT have 'server-only' because it's a re-export barrel
 * that may be imported by client components for type definitions and action references.
 * The actual server actions (assign.ts, update.ts, etc.) have 'use server' directive.
 */
export { assignUserRole } from './assign'
export { updateUserRole } from './update'
export { deactivateUserRole, reactivateUserRole } from './activate'
export type { ActionResult } from './helpers'
