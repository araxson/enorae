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
          <Link href="/privacy">View privacy policy</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Contact legal</Link>
        </Button>
      </ButtonGroup>
    </MarketingHero>
  )
}
