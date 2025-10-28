import 'server-only'

import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export async function getAnalyticsSalon() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return { id: salonId }
}
