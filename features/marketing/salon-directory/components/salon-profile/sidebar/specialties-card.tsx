import type { Salon } from '@/features/marketing/salon-directory/components/salon-profile/types'

interface SpecialtiesCardProps {
  salon: Salon
}

export function SpecialtiesCard({ salon }: SpecialtiesCardProps) {
  // Specialties not available in database schema
  return null
}
