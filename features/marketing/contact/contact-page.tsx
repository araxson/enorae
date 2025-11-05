import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Hero } from '@/features/marketing/contact/sections/hero'
import { Form } from '@/features/marketing/contact/sections/form'
import { Info } from '@/features/marketing/contact/sections/info'
import { MarketingPanel, MarketingSection } from '@/features/marketing/components/common'

export function ContactPage() {
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
              <BreadcrumbPage>Contact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <MarketingPanel
          variant="muted"
          align="center"
          description="Reach our team directly or share details with the contact form below."
        />
      </MarketingSection>
      <Hero />
      <MarketingSection
        className="bg-background"
        spacing="normal"
        containerClassName="max-w-6xl"
        groupClassName="gap-12"
      >
        <div className="grid gap-12 sm:grid-cols-2">
          <Form />
          <Info />
        </div>
      </MarketingSection>
    </main>
  )
}
