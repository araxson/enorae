import { SettingsForm } from './settings-form'
import type { getUserSalonSettings } from '../api/queries'

type SalonSettingsContentProps = {
  salonId: string
  settings: Awaited<ReturnType<typeof getUserSalonSettings>>
}

export function SalonSettingsContent({ salonId, settings }: SalonSettingsContentProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <SettingsForm salonId={salonId} settings={settings} />
        </div>
      </div>
    </section>
  )
}
