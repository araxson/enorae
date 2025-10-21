import type { Salon } from '../types'
import { ContactCard } from './contact-card'
import { QuickStatsCard } from './quick-stats-card'
import { SpecialtiesCard } from './specialties-card'
import { LanguagesCard } from './languages-card'
import { PaymentMethodsCard } from './payment-methods-card'

interface SalonSidebarProps {
  salon: Salon
  location: string
}

export function SalonSidebar({ salon, location }: SalonSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      <ContactCard salon={salon} location={location} />
      <QuickStatsCard salon={salon} />
      <SpecialtiesCard salon={salon} />
      <LanguagesCard salon={salon} />
      <PaymentMethodsCard salon={salon} />
    </div>
  )
}
