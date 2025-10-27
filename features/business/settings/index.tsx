import { getUserSalonSettings } from './api/queries'
import { SettingsForm } from './components/settings-form'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Store } from 'lucide-react'

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
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Store className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No salon found</EmptyTitle>
              <EmptyDescription>Please create a salon first to manage settings.</EmptyDescription>
            </EmptyHeader>
          </Empty>
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
