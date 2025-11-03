/**
 * Simplified Query Logger
 *
 * Eliminates repeated pattern:
 * ```ts
 * const logger = createOperationLogger('functionName', {})
 * logger.start()
 * ```
 *
 * Usage in query files:
 * ```ts
 * import 'server-only'
 * import { logQuery } from '@/lib/observability/query-logger'
 *
 * export async function getData() {
 *   const logger = logQuery('getData', { param: 'value' })
 *   // ... query logic
 *   return data
 * }
 * ```
 */

import { createOperationLogger } from './logger'
import type { OperationLogger } from './logger'

/**
 * Create and start a logger for query functions
 * Combines createOperationLogger + logger.start() into one call
 */
export function logQuery(
  operationName: string,
  context?: Record<string, unknown>
): OperationLogger {
  const logger = createOperationLogger(operationName, context ?? {})
  logger.start()
  return logger
}

/**
 * Create and start a logger for mutation functions
 * Combines createOperationLogger + logger.start() into one call
 */
export function logMutation(
  operationName: string,
  context?: Record<string, unknown>
): OperationLogger {
  const logger = createOperationLogger(operationName, context ?? {})
  logger.start()
  return logger
}
