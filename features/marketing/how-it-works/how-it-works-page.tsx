import { Hero } from './sections/hero'
import { ForCustomers } from './sections/for-customers'
import { ForBusinesses } from './sections/for-businesses'
import { CTA } from './sections/cta'

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
