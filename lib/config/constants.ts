/**
 * Application Configuration Constants
 *
 * @deprecated This file has been split into domain-specific files.
 * Imports from this file are preserved for backward compatibility
 * but will be re-exported from the new structure.
 *
 * New structure:
 * - lib/config/constants/time.ts
 * - lib/config/constants/cache.ts
 * - lib/config/constants/rate-limits.ts
 * - lib/config/constants/data.ts
 * - lib/config/constants/business.ts
 * - lib/config/constants/analytics.ts
 * - lib/config/constants/app.ts
 * - lib/config/constants/platform.ts
 * - lib/config/constants/moderation.ts
 * - lib/config/constants/address.ts
 *
 * Import from '@/lib/config/constants' still works via re-exports below.
 */

// Re-export all constants from the new structure
export * from './constants/time'
export * from './constants/cache'
export * from './constants/rate-limits'
export * from './constants/data'
export * from './constants/business'
export * from './constants/analytics'
export * from './constants/app'
export * from './constants/platform'
export * from './constants/moderation'
export * from './constants/address'
