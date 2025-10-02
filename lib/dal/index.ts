/**
 * Shared Data Access Layer Utilities
 *
 * Common helpers used across multiple features.
 * Import these instead of duplicating auth/salon logic.
 */

export {
  requireAuth,
  getUserSalon,
  getUserSalonId,
  getAuthUser,
  getUserRole,
} from './helpers'
