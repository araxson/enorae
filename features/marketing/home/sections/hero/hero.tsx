import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { ItemDescription } from '@/components/ui/item'
import { MarketingHero, TrustBadge } from '@/features/marketing/components/common'

import { heroContent } from './hero.data'

export function Hero() {
  return (
    <MarketingHero
      title={heroContent.title}
      subtitle={heroContent.subtitle}
      description={heroContent.description}
    >
      <ItemDescription>
        Streamline bookings whether you run a salon or schedule services as a client.
      </ItemDescription>
      <div className="flex w-full flex-col items-center gap-6">
        <ButtonGroup aria-label="Home hero actions">
          <Button asChild size="lg">
            <Link href={heroContent.primaryCta.href}>
              {heroContent.primaryCta.label}
            </Link>
          </Button>
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
