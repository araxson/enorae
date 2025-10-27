import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/terms/sections/hero'
import { Content } from '@/features/marketing/terms/sections/content'

export function TermsPage() {
  return (
    <ItemGroup className="gap-12">
      <Item className="flex-col items-center text-center" variant="muted">
        <ItemContent>
          <ItemDescription>Review the agreements that guide appointments, payments, and platform use.</ItemDescription>
        </ItemContent>
      </Item>
      <Hero />
      <Content />
    </ItemGroup>
  )
}
