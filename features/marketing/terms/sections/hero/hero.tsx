import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingHero } from '@/features/marketing/components/common'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <MarketingHero {...heroData} variant="simple">
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>Understand platform expectations before booking or offering services.</ItemDescription>
        </ItemContent>
      </Item>
      <ButtonGroup aria-label="Terms hero actions">
        <Button asChild size="lg">
          <Link href="/privacy">View privacy policy</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Contact legal</Link>
        </Button>
      </ButtonGroup>
    </MarketingHero>
  )
}
