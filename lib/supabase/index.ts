/**
 * Supabase clients and utilities barrel file
 * Exports all database client initialization functions and middleware
 *
 * Usage:
 *   import { createClient } from '@/lib/supabase'
 *   import { createServiceRoleClient } from '@/lib/supabase'
 *   import { logSupabaseError } from '@/lib/supabase'
 */

// Server-side client
export { createClient, type ServerSupabaseClient } from './server'

// Client-side client
export { createClient as createBrowserClient } from './client'

// Service role client (admin operations)
export { createServiceRoleClient } from './service-role'

// Auth middleware
export { updateSession } from './middleware'

// Error handling
export { logSupabaseError } from './errors'
