/**
 * Structured Logger for ENORAE Platform
 *
 * Provides consistent logging across the application with:
 * - Structured context (userId, salonId, operationName)
 * - Automatic sanitization of sensitive data
 * - Error categorization
 * - Request tracing
 * - Performance tracking
 */

// Types
export * from './logger-types'

// Core logging functions
export * from './logger-core'

// Specialized loggers
export * from './logger-specialized'

// Utilities (internal use)
export { sanitizeContext, formatLog, categorizeError } from './logger-utils'
