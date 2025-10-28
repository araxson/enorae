import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { Hero } from '@/features/marketing/terms/sections/hero'
import { Content } from '@/features/marketing/terms/sections/content'

export function TermsPage() {
  return (
    <main className="flex flex-col gap-16">
      <MarketingSection spacing="compact">
        <Item className="flex-col items-center text-center" variant="muted">
          <ItemContent>
            <ItemDescription>Review the agreements that guide appointments, payments, and platform use.</ItemDescription>
          </ItemContent>
        </Item>
      </MarketingSection>
      <Hero />
      <Content />
    </main>
  )
}
