import { getUserSalonMedia } from './api/queries'
import { MediaForm } from './components/media-form'
import { Section, Stack } from '@/components/layout'
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
          <p className="leading-7 text-base font-semibold">Salon Media</p>
          <p className="leading-7">No salon found. Please create a salon first.</p>
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
          <p className="leading-7 text-base font-semibold">Salon Media</p>
          <p className="text-sm text-muted-foreground">
            Manage photos, branding, and social media links for {salonName}
          </p>
        </div>

        <MediaForm media={media} />
      </Stack>
    </Section>
  )
}
