'use server'

/**
 * Server Action form state type
 */
export type FormState = {
  message?: string
  errors?: Record<string, string[]>
  success?: boolean
}

