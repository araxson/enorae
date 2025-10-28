import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'

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
        <Item className="flex-col items-center text-center" variant="muted">
          <ItemContent>
            <ItemDescription>Everything visitors need to understand Enorae at a glance.</ItemDescription>
          </ItemContent>
        </Item>
      </MarketingSection>
      <Hero />
      <Metrics />
      <Features />
      <Testimonials />
      <CTA />
    </main>
  )
}
