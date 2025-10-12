import { getUserSalonMedia } from './api/queries'
import { MediaForm } from './components/media-form'
import { Section, Stack } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import { getUserSalon } from '@/features/business/business-common/api/queries'

export async function SalonMedia() {
  let salon: Awaited<ReturnType<typeof getUserSalon>> | null = null

  try {
    salon = await getUserSalon()
  } catch {
    salon = null
  }

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
