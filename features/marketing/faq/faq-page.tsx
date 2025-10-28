import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { Hero } from '@/features/marketing/faq/sections/hero'
import { Questions } from '@/features/marketing/faq/sections/questions'

export function FAQPage() {
  return (
    <main className="flex flex-col gap-16">
      <MarketingSection spacing="compact">
        <Item className="flex-col items-center text-center" variant="muted">
          <ItemContent>
            <ItemDescription>Answers to the most common customer and salon questions.</ItemDescription>
          </ItemContent>
        </Item>
      </MarketingSection>
      <Hero />
      <Questions />
    </main>
  )
}
