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

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export type ErrorCategory =
  | 'validation'
  | 'network'
  | 'permission'
  | 'system'
  | 'database'
  | 'payment'
  | 'auth'
  | 'not_found'
  | 'unknown'

export interface LogContext {
  userId?: string
  salonId?: string
  staffId?: string
  customerId?: string
  appointmentId?: string
  operationName: string
  timestamp?: string
  correlationId?: string
  [key: string]: unknown
}

export interface ErrorLogContext extends LogContext {
  error: Error | string
  errorCategory?: ErrorCategory
  stack?: string
}

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
function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
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
function formatLog(level: LogLevel, message: string, context?: LogContext | ErrorLogContext): string {
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
 * Create an operation logger with pre-filled context
 */
export function createOperationLogger(operationName: string, baseContext?: Partial<LogContext>) {
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
  event: 'login' | 'logout' | 'permission_check' | 'session_refresh' | 'auth_failure',
  context?: LogContext & { reason?: string; success?: boolean }
): void {
  const level = event === 'auth_failure' ? 'warn' : 'info'
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
