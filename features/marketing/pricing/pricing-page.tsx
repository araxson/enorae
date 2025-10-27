import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/pricing/sections/hero'
import { Plans } from '@/features/marketing/pricing/sections/plans'

export function PricingPage() {
  return (
    <ItemGroup className="gap-12">
      <Item className="flex-col items-center text-center" variant="muted">
        <ItemContent>
          <ItemDescription>Compare simple plans designed for salons of every size.</ItemDescription>
        </ItemContent>
      </Item>
      <Hero />
      <Plans />
    </ItemGroup>
  )
}
