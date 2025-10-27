import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingHero } from '@/features/marketing/common-components'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <MarketingHero {...heroData} variant="stacked" align="center">
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>Discover our mission, values, and the people behind Enorae.</ItemDescription>
        </ItemContent>
      </Item>
      <ButtonGroup className="flex flex-wrap justify-center gap-2">
        <Button asChild size="lg">
          <Link href="/about#team">Meet the team</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Contact leadership</Link>
        </Button>
      </ButtonGroup>
    </MarketingHero>
  )
}
