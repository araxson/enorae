import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Item, ItemContent, ItemDescription } from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'

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
          <Item variant="muted">
            <ItemContent>
              <ItemDescription>Choose the option that fits—get started now or talk with our team first.</ItemDescription>
            </ItemContent>
          </Item>
          <ButtonGroup
            aria-label="Marketing call to action options"
            className="w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-center"
          >
            <Button asChild size="lg">
              <Link href={ctaContent.primaryCta.href}>
                {ctaContent.primaryCta.label}
              </Link>
            </Button>
            <ButtonGroupSeparator className="hidden sm:flex" />
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
