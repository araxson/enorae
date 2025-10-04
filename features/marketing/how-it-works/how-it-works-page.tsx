import { Stack } from '@/components/layout'
import { Hero } from './sections/hero'
import { ForCustomers } from './sections/for-customers'
import { ForBusinesses } from './sections/for-businesses'
import { CTA } from './sections/cta'

export function HowItWorksPage() {
  return (
    <Stack gap="none">
      <Hero />
      <ForCustomers />
      <ForBusinesses />
      <CTA />
    </Stack>
  )
}
