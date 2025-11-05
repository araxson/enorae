/**
 * Authentication and Authorization - Secure Pattern
 *
 * SECURITY BEST PRACTICES (Next.js 15 + Supabase):
 * 1. Always use verifySession() (uses getUser() - validates with Supabase)
 * 2. Never use getSession() directly (can be spoofed)
 * 3. Perform auth checks in Server Components, not middleware
 * 4. Use requireAuth() / requireRole() in Server Actions
 *
 * @example Server Component
 * ```tsx
 * import { verifySession } from '@/lib/auth'
 *
 * export default async function DashboardPage() {
 *   const session = await verifySession()
 *   if (!session) redirect('/login')
 *
 *   return <div>Welcome {session.user.email}</div>
 * }
 * ```
 *
 * @example Server Action
 * ```tsx
 * 'use server'
 * import { requireAuth } from '@/lib/auth'
 *
 * export async function updateProfile(data: FormData) {
 *   const session = await requireAuth()
 *   // Proceed with authenticated user
 * }
 * ```
 */

// Core authentication
export * from './session'

// Role-based authorization
export * from './permissions'

// Query guards - NOTE: guards-query.ts uses 'server-only' and should not be
// exported from this barrel. Import directly from './guards-query' only in server files.
// Export only the type that client components might need:
export type { GuardedQuery } from './guards-query'
