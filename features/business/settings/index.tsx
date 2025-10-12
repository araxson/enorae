import { getUserSalonSettings } from './api/queries'
import { SettingsForm } from './components/settings-form'
import { Section, Stack } from '@/components/layout'
import { P } from '@/components/ui/typography'
import { getUserSalon } from '@/features/business/business-common/api/queries'

export async function SalonSettings() {
  let salon: Awaited<ReturnType<typeof getUserSalon>> | null = null

  try {
    salon = await getUserSalon()
  } catch {
    salon = null
  }

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
