import { ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/faq/sections/hero'
import { Questions } from '@/features/marketing/faq/sections/questions'

export function FAQPage() {
  return (
    <ItemGroup>
      <Hero />
      <Questions />
    </ItemGroup>
  )
}
