import { getUserSalonDescription } from './api/queries'
import { DescriptionForm } from './components/description-form'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function SalonDescriptionSettings() {
  // Get user's salon
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single<{ id: string }>()

  if (!salon) {
    throw new Error('No salon found for user')
  }

  const description = await getUserSalonDescription()

  return <DescriptionForm salonId={salon.id} description={description} />
}
