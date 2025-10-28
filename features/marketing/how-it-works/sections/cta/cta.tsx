import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { ctaData } from './cta.data'

export function CTA() {
  return (
    <MarketingSection
      className="bg-background"
      containerClassName="max-w-3xl"
      groupClassName="gap-6 text-center"
    >
      <Item className="flex-col items-center text-center" variant="muted">
        <ItemHeader>
          <ItemTitle>{ctaData.title}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{ctaData.description}</ItemDescription>
        </ItemContent>
      </Item>
      <ButtonGroup
        aria-label="How Enorae works call to action buttons"
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {ctaData.buttons.map((button) => (
          <Button key={button.text} asChild variant={button.variant} size="lg">
            <Link href={button.href}>{button.text}</Link>
          </Button>
        ))}
      </ButtonGroup>
    </MarketingSection>
  )
}
