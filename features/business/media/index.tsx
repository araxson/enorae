import { getUserSalonMedia } from './api/queries'
import { getUserSalon } from '@/features/business/common/api/queries'
import { SalonMediaContent, SalonMediaUnavailableError } from './components'

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
export type * from './api/types'
