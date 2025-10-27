import { ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/privacy/sections/hero'
import { Content } from '@/features/marketing/privacy/sections/content'

export function PrivacyPage() {
  return (
    <ItemGroup>
      <Hero />
      <Content />
    </ItemGroup>
  )
}
