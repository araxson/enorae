import { getUserSalonSettings } from './api/queries'
import { SettingsForm } from './components/settings-form'
import { Section, Stack } from '@/components/layout'
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
          <p className="leading-7">No salon found. Please create a salon first.</p>
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
