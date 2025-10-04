import { getUserSalonSettings } from './api/queries'
import { SettingsForm } from './components/settings-form'
import { Section, Stack } from '@/components/layout'
import { H1, P, Muted } from '@/components/ui/typography'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type SalonBasic = Database['public']['Views']['salons']['Row']

export async function SalonSettings() {
  // SECURITY: Require business user role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Get user's salon
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('owner_id', session.user.id)
    .single<Pick<SalonBasic, 'id' | 'name'>>()

  if (!salon) {
    return (
      <Section size="lg">
        <Stack gap="md">
          <H1>Salon Settings</H1>
          <P>No salon found. Please create a salon first.</P>
        </Stack>
      </Section>
    )
  }

  const settings = await getUserSalonSettings()

  // Type-safe: salon.id cannot be null here because we checked for salon existence
  const salonId = salon.id!
  const salonName = salon.name || 'your salon'

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Salon Settings</H1>
          <Muted>
            Configure booking rules, account limits, and subscription settings for {salonName}
          </Muted>
        </div>

        <SettingsForm salonId={salonId} settings={settings} />
      </Stack>
    </Section>
  )
}
