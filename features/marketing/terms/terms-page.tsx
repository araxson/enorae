import { ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/terms/sections/hero'
import { Content } from '@/features/marketing/terms/sections/content'

export function TermsPage() {
  return (
    <ItemGroup>
      <Hero />
      <Content />
    </ItemGroup>
  )
}
