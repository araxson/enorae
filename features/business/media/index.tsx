import { getUserSalonMedia } from './api/queries'
import { MediaForm } from './components/media-form'
import { Section, Stack } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type SalonBasic = Database['public']['Views']['salons']['Row']

export async function SalonMedia() {
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

  if (!salon) {
    return (
      <Section size="lg">
        <Stack gap="md">
          <P className="text-base font-semibold">Salon Media</P>
          <P>No salon found. Please create a salon first.</P>
        </Stack>
      </Section>
    )
  }

  const media = await getUserSalonMedia()

  // Type-safe: salon.id cannot be null here because we checked for salon existence
  const salonName = salon.name || 'your salon'

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <P className="text-base font-semibold">Salon Media</P>
          <Muted>
            Manage photos, branding, and social media links for {salonName}
          </Muted>
        </div>

        <MediaForm media={media} />
      </Stack>
    </Section>
  )
}
