import { MediaForm } from '.'
import type { getUserSalonMedia } from '../api/queries'

type SalonMediaContentProps = {
  media: Awaited<ReturnType<typeof getUserSalonMedia>>
  salonName: string
}

export function SalonMediaContent({ media, salonName }: SalonMediaContentProps) {
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
