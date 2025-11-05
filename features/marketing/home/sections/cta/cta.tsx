import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { MarketingSection } from '@/features/marketing/components/common'

import { ctaContent } from './cta.data'

export function CTA() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-0">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{ctaContent.title}</EmptyTitle>
          <EmptyDescription>{ctaContent.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            Choose the option that fits—get started now or talk with our team first.
          </EmptyDescription>
          <ButtonGroup aria-label="Marketing call to action options">
            <Button asChild size="lg">
              <Link href={ctaContent.primaryCta.href}>
                {ctaContent.primaryCta.label}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={ctaContent.secondaryCta.href}>
                {ctaContent.secondaryCta.label}
              </Link>
            </Button>
          </ButtonGroup>
        </EmptyContent>
      </Empty>
    </MarketingSection>
  )
}
