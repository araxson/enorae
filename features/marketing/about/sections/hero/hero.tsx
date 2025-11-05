import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { ItemDescription } from '@/components/ui/item'
import { MarketingHero } from '@/features/marketing/components/common'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <MarketingHero {...heroData} variant="stacked" align="center">
      <ItemDescription>
        Discover our mission, values, and the people behind Enorae.
      </ItemDescription>
      <ButtonGroup aria-label="About hero actions">
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
