import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/how-it-works/sections/hero'
import { ForCustomers } from '@/features/marketing/how-it-works/sections/for-customers'
import { ForBusinesses } from '@/features/marketing/how-it-works/sections/for-businesses'
import { CTA } from '@/features/marketing/how-it-works/sections/cta'

export function HowItWorksPage() {
  return (
    <ItemGroup className="gap-12">
      <Item className="flex-col items-center text-center" variant="muted">
        <ItemContent>
          <ItemDescription>See how the platform guides both clients and salons from discovery to booking.</ItemDescription>
        </ItemContent>
      </Item>
      <Hero />
      <ForCustomers />
      <ForBusinesses />
      <CTA />
    </ItemGroup>
  )
}
