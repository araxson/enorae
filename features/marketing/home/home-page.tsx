import { ItemGroup } from '@/components/ui/item'

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
        <Hero />
        <Metrics />
        <Features />
        <Testimonials />
        <CTA />
      </ItemGroup>
    </main>
  )
}
