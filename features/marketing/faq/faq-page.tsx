import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/faq/sections/hero'
import { Questions } from '@/features/marketing/faq/sections/questions'

export function FAQPage() {
  return (
    <ItemGroup className="gap-12">
      <Item className="flex-col items-center text-center" variant="muted">
        <ItemContent>
          <ItemDescription>Answers to the most common customer and salon questions.</ItemDescription>
        </ItemContent>
      </Item>
      <Hero />
      <Questions />
    </ItemGroup>
  )
}
