import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
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
    <div
      className="group/item-group flex flex-col gap-6"
      data-slot="item-group"
      role="list"
    >
      <Item variant="muted">
        <ItemContent>
          <div className="flex flex-col gap-2">
            <ItemTitle>Helpful details</ItemTitle>
            <ItemDescription>Key details to help you plan visits and stay in touch with the salon.</ItemDescription>
          </div>
        </ItemContent>
      </Item>
      <ContactCard salon={salon} location={location} />
      <QuickStatsCard salon={salon} />
      <SpecialtiesCard salon={salon} />
      <LanguagesCard salon={salon} />
      <PaymentMethodsCard salon={salon} />
    </div>
  )
}
