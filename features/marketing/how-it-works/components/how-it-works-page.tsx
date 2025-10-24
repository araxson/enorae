import { Hero } from '@/features/marketing/how-it-works/components/sections/hero'
import { ForCustomers } from '@/features/marketing/how-it-works/components/sections/for-customers'
import { ForBusinesses } from '@/features/marketing/how-it-works/components/sections/for-businesses'
import { CTA } from '@/features/marketing/how-it-works/components/sections/cta'

export function HowItWorksPage() {
  return (
    <div className="space-y-0">
      <Hero />
      <ForCustomers />
      <ForBusinesses />
      <CTA />
    </div>
  )
}
