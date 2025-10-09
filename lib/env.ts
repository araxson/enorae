/**
 * Environment Variable Validation
 *
 * Validates environment variables at startup using Zod.
 * Prevents runtime errors from missing or invalid environment variables.
 *
 * @throws {Error} If required environment variables are missing or invalid
 */

import { z } from 'zod'

/**
 * Environment variable schema
 * All required variables must be present and valid
 */
const envSchema = z.object({
  // Supabase Configuration (Required)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL is required')
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .startsWith('https://', 'NEXT_PUBLIC_SUPABASE_URL must use HTTPS'),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
    .min(20, 'NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)'),

  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required in non-development environments')
    .min(20, 'SUPABASE_SERVICE_ROLE_KEY appears to be invalid (too short)')
    .optional(),

  // Application URLs
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .optional(),

  NEXT_PUBLIC_SITE_URL: z
    .string()
    .min(1, 'NEXT_PUBLIC_SITE_URL is required')
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL')
    .default('http://localhost:3000'),

  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

/**
 * Validated environment variables
 * Safe to use throughout the application
 */
export type Env = z.infer<typeof envSchema>

/**
 * Parse and validate environment variables
 *
 * @throws {Error} If validation fails
 * @returns {Env} Validated environment variables
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  })

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(JSON.stringify(parsed.error.format(), null, 2))
    throw new Error('Invalid environment variables. Check your .env.local file.')
  }

  return parsed.data
}

/**
 * Validated environment variables
 * Import this to access environment variables safely
 *
 * @example
 * import { env } from '@/lib/env'
 *
 * const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
 */
export const env = validateEnv()

/**
 * Helper function to check if running in production
 */
export const isProduction = env.NODE_ENV === 'production'

/**
 * Helper function to check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development'

/**
 * Helper function to check if running in test environment
 */
export const isTest = env.NODE_ENV === 'test'
