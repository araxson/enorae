import { getUserSalonSettings } from './api/queries'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import { SalonSettingsContent } from './components/salon-settings-content'
import { SalonSettingsNoSalonError } from './components/salon-settings-error'

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
