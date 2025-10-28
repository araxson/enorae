import { getUserSalonMedia } from './api/queries'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import { SalonMediaContent } from './components/salon-media-content'
import { SalonMediaUnavailableError } from './components/salon-media-error'

export async function SalonMedia() {
  let salon
  try {
    salon = await getUserSalon()
  } catch {
    salon = null
  }

  if (!salon) {
    return <SalonMediaUnavailableError />
  }

  const media = await getUserSalonMedia()
  const salonName = salon.name || 'your salon'

  return <SalonMediaContent media={media} salonName={salonName} />
}
