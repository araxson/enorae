import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { Hero } from '@/features/marketing/contact/sections/hero'
import { Form } from '@/features/marketing/contact/sections/form'
import { Info } from '@/features/marketing/contact/sections/info'
import { MarketingSection } from '@/features/marketing/common-components'

export function ContactPage() {
  return (
    <main className="flex flex-col gap-16">
      <MarketingSection spacing="compact">
        <Item variant="muted">
          <ItemContent>
            <div className="flex flex-col items-center text-center">
              <ItemDescription>Reach our team directly or share details with the contact form below.</ItemDescription>
            </div>
          </ItemContent>
        </Item>
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
