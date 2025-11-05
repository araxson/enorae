import { MarketingPanel, MarketingSection } from '@/features/marketing/components/common'

import {
  CTA,
  Features,
  Hero,
  Metrics,
  Testimonials,
} from './sections'

export function HomePage() {
  return (
    <main className="flex flex-col gap-16 pb-16">
      <MarketingSection spacing="compact">
        <MarketingPanel
          variant="muted"
          align="center"
          description="Everything visitors need to understand Enorae at a glance."
        />
      </MarketingSection>
      <Hero />
      <Metrics />
      <Features />
      <Testimonials />
      <CTA />
    </main>
  )
}
