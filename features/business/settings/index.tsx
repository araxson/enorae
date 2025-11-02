import { getUserSalonSettings } from './api/queries'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import { SalonSettingsContent, SalonSettingsNoSalonError } from './components'

export async function SalonSettings() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    salon = null
  }

  if (!salon?.id) {
    return <SalonSettingsNoSalonError />
  }

  const settings = await getUserSalonSettings()

  return <SalonSettingsContent salonId={salon.id} settings={settings} />
}
export * from './types'
