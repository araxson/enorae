import type { Salon } from '@/features/marketing/salon-directory/components/salon-profile/types'

interface GalleryCardProps {
  salon: Salon
}

export function GalleryCard({ salon }: GalleryCardProps) {
  // Gallery URLs not available in database schema
  return null
}
