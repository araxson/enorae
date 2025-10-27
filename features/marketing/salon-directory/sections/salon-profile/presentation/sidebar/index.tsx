import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
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
    <ItemGroup className="gap-6">
      <Item className="flex-col" variant="muted">
        <ItemContent>
          <ItemDescription>Key details to help you plan visits and stay in touch with the salon.</ItemDescription>
        </ItemContent>
      </Item>
      <ContactCard salon={salon} location={location} />
      <QuickStatsCard salon={salon} />
      <SpecialtiesCard salon={salon} />
      <LanguagesCard salon={salon} />
      <PaymentMethodsCard salon={salon} />
    </ItemGroup>
  )
}
