'use server'

import { verifySession } from '@/lib/auth/session'
import { DEFAULT_ROUTES, ROLE_HIERARCHY } from './roles'

export async function canAccessRoute(route: string): Promise<boolean> {
  const session = await verifySession()
  if (!session) return false

  const allowedRoutes = ROLE_HIERARCHY[session.role] || []
  return allowedRoutes.some((allowedRoute) => route.startsWith(allowedRoute))
}

export async function getDefaultRoute(): Promise<string> {
  const session = await verifySession()
  return session ? DEFAULT_ROUTES[session.role] || '/' : '/'
}
