/**
 * Environment variable validation and type-safe access
 *
 * This module validates all required environment variables at startup/build time
 * and provides type-safe access throughout the application.
 *
 * Benefits:
 * - Fails fast if required env vars are missing
 * - Type-safe access (no need for process.env everywhere)
 * - Centralized configuration
 * - Clear error messages
 */

import { z } from 'zod'

/**
 * Public (client-side) environment variables schema
 */
const PublicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .describe('Public site URL (e.g., https://enorae.com)'),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url()
    .describe('Supabase project URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1)
    .describe('Supabase anonymous key'),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z
    .string()
    .min(1)
    .optional()
    .describe('Google Maps API key (optional for address autocomplete)'),
})

/**
 * Server-side environment variables schema
 *
 * Note: These are only available in server-side code.
 * Import this in server-only files to access server env vars.
 */
const ServerEnvSchema = z.object({
  // Add server-side env vars here as needed
  // Example:
  // STRIPE_SECRET_KEY: z.string().min(1),
  // DATABASE_URL: z.string().url(),
})

/**
 * Validated public environment variables
 *
 * Safe to use in client and server code.
 */
export const ENV = (() => {
  try {
    return PublicEnvSchema.parse({
      NEXT_PUBLIC_SITE_URL: process.env['NEXT_PUBLIC_SITE_URL'],
      NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'],
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'],
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:')
      error.issues.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      throw new Error('Missing or invalid environment variables. Check .env file.')
    }
    throw error
  }
})()

/**
 * Validated server-side environment variables
 *
 * Only use in server-side code (API routes, server components, server actions).
 */
export const SERVER_ENV = (() => {
  try {
    return ServerEnvSchema.parse({
      // Map server env vars here
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Server environment variable validation failed:')
      error.issues.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      // Don't crash on server env validation in client builds
      if (typeof window === 'undefined') {
        throw new Error('Missing or invalid server environment variables.')
      }
    }
    return {} as z.infer<typeof ServerEnvSchema>
  }
})()

/**
 * Check if Google Maps integration is available
 */
export function isGoogleMapsEnabled(): boolean {
  return Boolean(ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
}

/**
 * Get Google Maps API key safely
 *
 * @throws Error if Google Maps is not configured
 */
export function getGoogleMapsApiKey(): string {
  if (!ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.')
  }
  return ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
}

/**
 * External API configuration
 */
export const EXTERNAL_APIS = {
  GOOGLE_MAPS: {
    GEOCODE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
    AUTOCOMPLETE_URL: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
    EMBED_URL: 'https://maps.google.com/maps',
    getApiKey: getGoogleMapsApiKey,
    isEnabled: isGoogleMapsEnabled,
  },
} as const

// Log configuration status at startup (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Environment variables validated successfully')
  console.log('  - Site URL:', ENV.NEXT_PUBLIC_SITE_URL)
  console.log('  - Supabase URL:', ENV.NEXT_PUBLIC_SUPABASE_URL)
  console.log('  - Google Maps:', isGoogleMapsEnabled() ? 'Enabled' : 'Disabled')
}
