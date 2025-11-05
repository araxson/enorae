import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/components/common'
import { Hero } from '@/features/marketing/faq/sections/hero'
import { Questions } from '@/features/marketing/faq/sections/questions'

export function FAQPage() {
  return (
    <main className="flex flex-col gap-16">
      <MarketingSection spacing="compact">
        <Item variant="muted">
          <ItemContent>
            <div className="flex flex-col items-center text-center">
              <ItemDescription>Answers to the most common customer and salon questions.</ItemDescription>
            </div>
          </ItemContent>
        </Item>
      </MarketingSection>
      <Hero />
      <Questions />
    </main>
  )
}
