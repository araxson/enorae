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

import { ctaContent } from './cta.data'

export function CTA() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{ctaContent.title}</EmptyTitle>
          <EmptyDescription>{ctaContent.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ButtonGroup className="w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-center">
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
    </section>
  )
}
