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

// Secure session verification (primary exports)
export {
  verifySession,
  requireAuth,
  requireRole,
  requireAnyRole,
  getUserId,
  getUserRole,
  type Session,
} from './session'

// Role-based permissions (secondary exports)
export {
  isPlatformAdmin,
  isBusinessUser,
  isStaffUser,
  isSeniorStaff,
  getStaffRoleLevel,
  isCustomer,
  canAccessRoute,
  getDefaultRoute,
  canAccessSalon,
  getUserSalonId,
  requireUserSalonId,
  ROLE_HIERARCHY,
  DEFAULT_ROUTES,
  ROLE_GROUPS,
} from './permissions'

// Legacy exports (marked for deprecation)
export { hasRole, hasAnyRole } from './permissions'
