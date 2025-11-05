/**
 * Core Logger Functions
 */

import type { LogContext, ErrorLogContext, OperationLogger, ErrorCategory } from './logger-types'
import { formatLog } from './logger-utils'

/**
 * Log info message
 */
export function logInfo(message: string, context?: LogContext): void {
  console.log(formatLog('info', message, context))
}

/**
 * Log warning message
 */
export function logWarn(message: string, context?: LogContext): void {
  console.warn(formatLog('warn', message, context))
}

/**
 * Log error message
 */
export function logError(message: string, context: ErrorLogContext): void {
  const errorMessage = context.error instanceof Error
    ? context.error.message
    : String(context.error)

  const stack = context.error instanceof Error
    ? context.error.stack
    : undefined

  console.error(formatLog('error', message, {
    ...context,
    error: errorMessage,
    stack,
  }))
}

/**
 * Log debug message (only in development)
 */
export function logDebug(message: string, context?: LogContext): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug(formatLog('debug', message, context))
  }
}

/**
 * Summarize result for logging (avoid logging large objects)
 */
function summarizeResult(result: unknown): string {
  if (Array.isArray(result)) {
    return `Array(${result.length})`
  }
  if (typeof result === 'object' && result !== null) {
    return `Object(${Object.keys(result).length} keys)`
  }
  return String(result)
}

/**
 * Create an operation logger with pre-filled context
 */
export function createOperationLogger(operationName: string, baseContext?: Partial<LogContext>): OperationLogger {
  const context: LogContext = {
    ...baseContext,
    operationName,
    correlationId: baseContext?.correlationId || crypto.randomUUID(),
  }

  return {
    start: (additionalContext?: Partial<LogContext>) => {
      logInfo(`Starting ${operationName}`, { ...context, ...additionalContext })
    },

    success: (result?: unknown, additionalContext?: Partial<LogContext>) => {
      logInfo(`${operationName} completed successfully`, {
        ...context,
        ...additionalContext,
        resultSummary: result ? summarizeResult(result) : undefined,
      })
    },

    error: (error: Error | string, errorCategory?: ErrorCategory, additionalContext?: Partial<LogContext>) => {
      logError(`${operationName} failed`, {
        ...context,
        ...additionalContext,
        error,
        errorCategory: errorCategory || 'unknown',
      })
    },

    warn: (message: string, additionalContext?: Partial<LogContext>) => {
      logWarn(`${operationName}: ${message}`, { ...context, ...additionalContext })
    },
  }
}
