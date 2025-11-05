import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { MarketingPanel, MarketingSection } from '@/features/marketing/components/common'
import { Hero } from '@/features/marketing/pricing/sections/hero'
import { Plans } from '@/features/marketing/pricing/sections/plans'

export function PricingPage() {
  return (
    <main className="flex flex-col gap-16">
      <MarketingSection spacing="compact">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pricing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <MarketingPanel
          variant="muted"
          align="center"
          description="Compare simple plans designed for salons of every size."
        />
      </MarketingSection>
      <Hero />
      <Plans />
    </main>
  )
}
