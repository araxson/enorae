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
          <ItemDescription>Review how we safeguard customer data and honor access requests.</ItemDescription>
        </ItemContent>
      </Item>
      <ButtonGroup
        aria-label="Privacy hero actions"
        className="flex flex-wrap justify-center gap-2"
      >
        <Button asChild size="lg">
          <Link href="/terms">Review terms</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Request data</Link>
        </Button>
      </ButtonGroup>
    </MarketingHero>
  )
}
