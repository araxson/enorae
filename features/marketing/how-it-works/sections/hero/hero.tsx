import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingHero } from '@/features/marketing/common-components'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <MarketingHero {...heroData} variant="simple">
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>See how onboarding works for both salons and customers step-by-step.</ItemDescription>
        </ItemContent>
      </Item>
      <ButtonGroup
        aria-label="How Enorae works hero actions"
        className="flex flex-wrap justify-center gap-2"
      >
        <Button asChild size="lg">
          <Link href="/signup">Start as a salon</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/explore">Discover salons</Link>
        </Button>
      </ButtonGroup>
    </MarketingHero>
  )
}
