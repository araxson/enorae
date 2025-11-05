/**
 * Logger Utility Functions
 */

import type { LogLevel, LogContext, ErrorLogContext } from './logger-types'

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'api_key',
  'apiKey',
  'accessToken',
  'refreshToken',
  'credit_card',
  'creditCard',
  'cvv',
  'ssn',
  'authorization',
]

/**
 * Sanitize sensitive data from log context
 */
export function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase()

    if (SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeContext(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Format log message with context
 */
export function formatLog(level: LogLevel, message: string, context?: LogContext | ErrorLogContext): string {
  const timestamp = new Date().toISOString()
  const sanitizedContext = context ? sanitizeContext(context as Record<string, unknown>) : {}

  return JSON.stringify({
    level,
    message,
    timestamp,
    ...sanitizedContext,
  })
}

/**
 * Categorize error by type
 */
export function categorizeError(error: Error | string): string {
  const errorMessage = typeof error === 'string' ? error : error.message

  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return 'validation'
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'network'
  }
  if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
    return 'permission'
  }
  if (errorMessage.includes('database') || errorMessage.includes('query')) {
    return 'database'
  }
  if (errorMessage.includes('payment') || errorMessage.includes('stripe')) {
    return 'payment'
  }
  if (errorMessage.includes('auth') || errorMessage.includes('authentication')) {
    return 'auth'
  }
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return 'not_found'
  }

  return 'unknown'
}
