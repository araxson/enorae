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
          <ItemDescription>Find quick answers for both clients and salons before you get in touch.</ItemDescription>
        </ItemContent>
      </Item>
      <ButtonGroup className="flex flex-wrap justify-center gap-2">
        <Button asChild size="lg">
          <Link href="/contact">Ask a question</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/explore">Browse salons</Link>
        </Button>
      </ButtonGroup>
    </MarketingHero>
  )
}
