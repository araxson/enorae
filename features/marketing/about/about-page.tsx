import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/about/sections/hero'
import { Mission } from '@/features/marketing/about/sections/mission'
import { Values } from '@/features/marketing/about/sections/values'
import { Team } from '@/features/marketing/about/sections/team'

export function AboutPage() {
  return (
    <ItemGroup className="gap-12">
      <Item className="flex-col items-center text-center" variant="muted">
        <ItemContent>
          <ItemDescription>Learn how Enorae started, what drives us, and the team bringing it to life.</ItemDescription>
        </ItemContent>
      </Item>
      <Hero />
      <Mission />
      <Values />
      <Team />
    </ItemGroup>
  )
}
