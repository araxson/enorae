import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group'
import { MarketingHero, TrustBadge } from '@/features/marketing/common-components'

import { heroContent } from './hero.data'

export function Hero() {
  return (
    <MarketingHero
      title={heroContent.title}
      subtitle={heroContent.subtitle}
      description={heroContent.description}
    >
      <div className="flex w-full flex-col items-center gap-6">
        <ButtonGroup className="flex flex-wrap justify-center gap-2 px-2">
          <Button asChild size="lg">
            <Link href={heroContent.primaryCta.href}>
              {heroContent.primaryCta.label}
            </Link>
          </Button>
          <ButtonGroupSeparator className="hidden sm:flex" />
          <Button asChild variant="outline" size="lg">
            <Link href={heroContent.secondaryCta.href}>
              {heroContent.secondaryCta.label}
            </Link>
          </Button>
        </ButtonGroup>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {heroContent.trustBadges.map((badge) => (
            <TrustBadge key={badge.type} {...badge} />
          ))}
        </div>
      </div>
    </MarketingHero>
  )
}
