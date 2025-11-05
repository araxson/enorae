import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { ItemDescription } from '@/components/ui/item'
import { MarketingHero } from '@/features/marketing/components/common'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <MarketingHero {...heroData} variant="simple">
      <ItemDescription>
        Transparent plans with no hidden fees—choose what fits your salon.
      </ItemDescription>
      <ButtonGroup aria-label="Pricing hero actions">
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
