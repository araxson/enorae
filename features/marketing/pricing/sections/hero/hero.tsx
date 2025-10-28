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
          <ItemDescription>Transparent plans with no hidden fees—choose what fits your salon.</ItemDescription>
        </ItemContent>
      </Item>
      <ButtonGroup
        aria-label="Pricing hero actions"
        className="flex flex-wrap justify-center gap-2"
      >
        <Button asChild size="lg">
          <Link href="/signup">Start free trial</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Talk to our team</Link>
        </Button>
      </ButtonGroup>
    </MarketingHero>
  )
}
