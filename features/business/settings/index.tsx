import { getUserSalonSettings } from './api/queries'
import { SettingsForm } from './components/settings-form'
import { Section, Stack } from '@/components/layout'
import { P } from '@/components/ui/typography'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type SalonBasic = Database['public']['Views']['salons']['Row']

export async function SalonSettings() {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()
  const salonId = await requireUserSalonId()

  // Get user's salon
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('id', salonId)
    .single<Pick<SalonBasic, 'id' | 'name'>>()

  if (!salon?.id) {
    return (
      <Section size="lg">
        <Stack gap="md">
          <P>No salon found. Please create a salon first.</P>
        </Stack>
      </Section>
    )
  }

  const settings = await getUserSalonSettings()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <SettingsForm salonId={salon.id} settings={settings} />
      </Stack>
    </Section>
  )
}
