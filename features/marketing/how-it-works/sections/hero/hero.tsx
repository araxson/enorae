import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { MarketingHero } from '@/features/marketing/common-components'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <MarketingHero {...heroData} variant="simple">
      <ButtonGroup className="flex flex-wrap justify-center gap-2">
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
