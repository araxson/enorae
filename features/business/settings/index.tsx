import { getUserSalonSettings } from './api/queries'
import { SettingsForm } from './components/settings-form'
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
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <p className="leading-7">No salon found. Please create a salon first.</p>
          </div>
        </div>
      </section>
    )
  }

  const settings = await getUserSalonSettings()

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <SettingsForm salonId={salon.id} settings={settings} />
        </div>
      </div>
    </section>
  )
}
