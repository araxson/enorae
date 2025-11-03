import { getUserSalonContactDetails } from './api/queries'
import { ContactForm } from './components'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export async function SalonContactSettings() {
  // Ensure caller is a business user and resolve active salon context
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const contactDetails = await getUserSalonContactDetails()

  return <ContactForm salonId={salonId} contactDetails={contactDetails} />
}
export * from './api/types'
