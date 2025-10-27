import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { MarketingHero } from '@/features/marketing/common-components'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <MarketingHero {...heroData} variant="stacked" align="center">
      <ButtonGroup className="flex flex-wrap justify-center gap-2">
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
