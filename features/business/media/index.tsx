import { getUserSalonMedia } from './api/queries'
import { MediaForm } from './components/media-form'
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
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <p>Salon Media</p>
            <p className="text-muted-foreground">No salon found. Please create a salon first.</p>
          </div>
        </div>
      </section>
    )
  }

  const media = await getUserSalonMedia()
  const salonName = salon.name || 'your salon'

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
        <div>
          <p>Salon Media</p>
          <p className="text-muted-foreground">
            Manage photos, branding, and social media links for {salonName}
          </p>
        </div>

        <MediaForm media={media} />
        </div>
      </div>
    </section>
  )
}
