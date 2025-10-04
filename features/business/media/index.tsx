import { getUserSalonMedia } from './api/queries'
import { MediaForm } from './components/media-form'
import { Section, Stack } from '@/components/layout'
import { H1, P, Muted } from '@/components/ui/typography'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { SalonMediaView } from '@/lib/types/view-extensions'

type SalonBasic = Database['public']['Views']['salons']['Row']

export async function SalonMedia() {
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
          <H1>Salon Media</H1>
          <P>No salon found. Please create a salon first.</P>
        </Stack>
      </Section>
    )
  }

  const media = await getUserSalonMedia() as SalonMediaView | null

  // Type-safe: salon.id cannot be null here because we checked for salon existence
  const salonName = salon.name || 'your salon'

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Salon Media</H1>
          <Muted>
            Manage photos, branding, and social media links for {salonName}
          </Muted>
        </div>

        <MediaForm media={media} />
      </Stack>
    </Section>
  )
}
