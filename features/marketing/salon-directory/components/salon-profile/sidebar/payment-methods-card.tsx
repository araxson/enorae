import type { Salon } from '@/features/marketing/salon-directory/components/salon-profile/types'

interface PaymentMethodsCardProps {
  salon: Salon
}

export function PaymentMethodsCard({ salon }: PaymentMethodsCardProps) {
  // Payment methods not available in database schema
  return null
}
