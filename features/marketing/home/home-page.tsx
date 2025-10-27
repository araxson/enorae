import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'

import {
  CTA,
  Features,
  Hero,
  Metrics,
  Testimonials,
} from './sections'

export function HomePage() {
  return (
    <main className="pb-16">
      <ItemGroup className="gap-12">
        <Item className="flex-col items-center text-center" variant="muted">
          <ItemContent>
            <ItemDescription>Everything visitors need to understand Enorae at a glance.</ItemDescription>
          </ItemContent>
        </Item>
        <Hero />
        <Metrics />
        <Features />
        <Testimonials />
        <CTA />
      </ItemGroup>
    </main>
  )
}
