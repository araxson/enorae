import { Stack } from '@/components/layout'
import { Hero } from './sections/hero'
import { Plans } from './sections/plans'

export function PricingPage() {
  return (
    <Stack gap="none">
      <Hero />
      <Plans />
    </Stack>
  )
}
