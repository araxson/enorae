import 'server-only'

import { requireAnyRole, ROLE_GROUPS, type Session } from '@/lib/auth'

/** Ensure the current session belongs to a platform admin. */
export const requirePlatformAdmin = (): Promise<Session> => requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
