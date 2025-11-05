import { getUserSalonDescription } from './api/queries'
import { DescriptionForm } from './components'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export async function SalonDescriptionSettings() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const description = await getUserSalonDescription()

  return <DescriptionForm salonId={salonId} description={description} />
}
export type * from './api/types'
