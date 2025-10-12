import { Hero } from '../components/sections/hero'
import { ForCustomers } from '../components/sections/for-customers'
import { ForBusinesses } from '../components/sections/for-businesses'
import { CTA } from '../components/sections/cta'

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
