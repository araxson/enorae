import { ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/how-it-works/sections/hero'
import { ForCustomers } from '@/features/marketing/how-it-works/sections/for-customers'
import { ForBusinesses } from '@/features/marketing/how-it-works/sections/for-businesses'
import { CTA } from '@/features/marketing/how-it-works/sections/cta'

export function HowItWorksPage() {
  return (
    <ItemGroup>
      <Hero />
      <ForCustomers />
      <ForBusinesses />
      <CTA />
    </ItemGroup>
  )
}
