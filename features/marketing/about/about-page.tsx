import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { Hero } from '@/features/marketing/about/sections/hero'
import { Mission } from '@/features/marketing/about/sections/mission'
import { Values } from '@/features/marketing/about/sections/values'
import { Team } from '@/features/marketing/about/sections/team'
import { MarketingSection } from '@/features/marketing/components/common'

export function AboutPage() {
  return (
    <main className="flex flex-col gap-16">
      <MarketingSection spacing="compact">
        <Item variant="muted">
          <ItemContent>
            <div className="flex flex-col items-center text-center">
              <ItemDescription>Learn how Enorae started, what drives us, and the team bringing it to life.</ItemDescription>
            </div>
          </ItemContent>
        </Item>
      </MarketingSection>
      <Hero />
      <Mission />
      <Values />
      <Team />
    </main>
  )
}
