import { ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/pricing/sections/hero'
import { Plans } from '@/features/marketing/pricing/sections/plans'

export function PricingPage() {
  return (
    <ItemGroup>
      <Hero />
      <Plans />
    </ItemGroup>
  )
}
