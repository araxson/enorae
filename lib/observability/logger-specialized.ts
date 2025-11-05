/**
 * Specialized Logger Functions
 */

import type { LogContext } from './logger-types'
import { logInfo, logWarn, logError } from './logger-core'

/**
 * Log API call
 */
export function logApiCall(
  method: string,
  endpoint: string,
  context?: LogContext & { statusCode?: number; duration?: number }
): void {
  logInfo(`API ${method} ${endpoint}`, {
    ...context,
    operationName: 'api_call',
  })
}

/**
 * Log database query
 */
export function logDatabaseQuery(
  operation: string,
  table: string,
  context?: LogContext & { rowCount?: number; duration?: number }
): void {
  logInfo(`Database ${operation} on ${table}`, {
    ...context,
    operationName: 'database_query',
  })
}

/**
 * Log mutation
 */
export function logMutation(
  action: string,
  resourceType: string,
  resourceId: string,
  context?: LogContext & { changes?: Record<string, unknown> }
): void {
  logInfo(`Mutation: ${action} ${resourceType} ${resourceId}`, {
    ...context,
    operationName: 'mutation',
    resourceType,
    resourceId,
  })
}

/**
 * Log auth event
 */
export function logAuthEvent(
  event: 'login' | 'logout' | 'permission_check' | 'session_refresh' | 'auth_failure' | 'auth_rate_limited',
  context?: LogContext & { reason?: string; success?: boolean }
): void {
  const level = event === 'auth_failure' || event === 'auth_rate_limited' ? 'warn' : 'info'
  const message = `Auth event: ${event}`

  if (level === 'warn') {
    logWarn(message, { ...context, operationName: 'auth' })
  } else {
    logInfo(message, { ...context, operationName: 'auth' })
  }
}

/**
 * Log payment operation
 */
export function logPayment(
  action: string,
  context: LogContext & {
    amount?: number
    currency?: string
    orderId?: string
    status?: string
    paymentMethod?: string
  }
): void {
  logInfo(`Payment: ${action}`, {
    ...context,
    operationName: 'payment',
  })
}

/**
 * Log async operation
 */
export function logAsyncOperation(
  operationName: string,
  status: 'started' | 'completed' | 'failed',
  context?: LogContext & { duration?: number; error?: string }
): void {
  if (status === 'failed') {
    logError(`Async operation ${operationName} failed`, {
      ...context,
      operationName: `async_${operationName}`,
      error: context?.error || 'Unknown error',
    })
  } else {
    logInfo(`Async operation ${operationName} ${status}`, {
      ...context,
      operationName: `async_${operationName}`,
    })
  }
}
