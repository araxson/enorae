import 'server-only'

const RETRYABLE_CODES = new Set(['40001', '42501', 'ECONNRESET', 'ETIMEDOUT'])

interface RetryOptions {
  attempts?: number
  delayMs?: number
  isRetryable?: (error: unknown) => boolean
}

export async function withSupabaseRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { attempts = 3, delayMs = 150, isRetryable } = options

  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      const code = typeof error === 'object' && error && 'code' in error ? (error as { code?: string }).code : undefined
      const retryable = isRetryable ? isRetryable(error) : (code ? RETRYABLE_CODES.has(code) : false)

      if (attempt === attempts || !retryable) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt))
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unknown Supabase error')
}
