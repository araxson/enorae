import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { Hero } from '@/features/marketing/pricing/sections/hero'
import { Plans } from '@/features/marketing/pricing/sections/plans'

export function PricingPage() {
  return (
    <main className="flex flex-col gap-16">
      <MarketingSection spacing="compact">
        <Item className="flex-col items-center text-center" variant="muted">
          <ItemContent>
            <ItemDescription>Compare simple plans designed for salons of every size.</ItemDescription>
          </ItemContent>
        </Item>
      </MarketingSection>
      <Hero />
      <Plans />
    </main>
  )
}
