import type { Salon } from '@/features/marketing/salon-directory/components/salon-profile/types'

interface LanguagesCardProps {
  salon: Salon
}

export function LanguagesCard({ salon }: LanguagesCardProps) {
  // Languages not available in database schema
  return null
}
