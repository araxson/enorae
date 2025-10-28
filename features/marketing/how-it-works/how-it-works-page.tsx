import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { Hero } from '@/features/marketing/how-it-works/sections/hero'
import { ForCustomers } from '@/features/marketing/how-it-works/sections/for-customers'
import { ForBusinesses } from '@/features/marketing/how-it-works/sections/for-businesses'
import { CTA } from '@/features/marketing/how-it-works/sections/cta'

export function HowItWorksPage() {
  return (
    <main className="flex flex-col gap-16">
      <MarketingSection spacing="compact">
        <Item className="flex-col items-center text-center" variant="muted">
          <ItemContent>
            <ItemDescription>See how the platform guides both clients and salons from discovery to booking.</ItemDescription>
          </ItemContent>
        </Item>
      </MarketingSection>
      <Hero />
      <ForCustomers />
      <ForBusinesses />
      <CTA />
    </main>
  )
}
