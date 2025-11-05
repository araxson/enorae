/**
 * Logger Type Definitions
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

export type OperationLogger = {
  start: (additionalContext?: Partial<LogContext>) => void
  success: (result?: unknown, additionalContext?: Partial<LogContext>) => void
  error: (error: Error | string, errorCategory?: ErrorCategory, additionalContext?: Partial<LogContext>) => void
  warn: (message: string, additionalContext?: Partial<LogContext>) => void
}
