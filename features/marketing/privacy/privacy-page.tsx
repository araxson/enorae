import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/privacy/sections/hero'
import { Content } from '@/features/marketing/privacy/sections/content'

export function PrivacyPage() {
  return (
    <ItemGroup className="gap-12">
      <Item className="flex-col items-center text-center" variant="muted">
        <ItemContent>
          <ItemDescription>Understand how Enorae protects your information across the platform.</ItemDescription>
        </ItemContent>
      </Item>
      <Hero />
      <Content />
    </ItemGroup>
  )
}
